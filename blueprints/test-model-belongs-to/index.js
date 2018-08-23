/* eslint-env node */

const EOL = require('os').EOL;
const SilentError = require('silent-error');
const fs = require('fs');

module.exports = {
  description: 'Generates a test for model\'s belongs-to relationship',

  availableOptions: [
    {name: 'related', type: String, aliases: ['r']},
    {name: 'inverse', type: String, aliases: ['in']},
  ],

  model: undefined,
  attr: undefined,
  defaultValue: undefined,
  related: undefined,
  inverse: undefined,

  beforeInstall(options) {
    const chunks = options.entity.name.split(':');
    if (chunks.length === 1) {
      return Promise.reject(new SilentError('Use `modelName:attrName` format'));
    }
    this.model = chunks[0];
    this.attr = chunks.slice(1).join(':');
    this.related = options.related;
    if (!options.related) {
      return Promise.reject(new SilentError('--related is required'));
    }
    this.inverse = options.inverse;
    return this.lookupBlueprint('model');
  },

  afterInstall() {
    return this.insertTest();
  },

  insertTest() {
    const filePath = `tests/unit/models/${this.model}-test.js`;
    if (!fs.existsSync(filePath)) {
      return Promise.reject(new SilentError(`File "${filePath}" was not found`));
    }
    let msg = `#${this.attr} belongs to "${this.related}"`;
    if (this.inverse) {
      msg = msg + ` inverted as #${this.inverse}`;
    }
    return this.insertIntoFile(filePath, [
      `${EOL}  test('${msg}', function(assert) {`,
      `    const Model = this.owner.lookup('service:store').modelFor('${this.model}');`,
      `    // eslint-disable-next-line`,
      `    const relationship = get(Model, 'relationshipsByName').get('${this.attr}');`,
      `    assert.equal(relationship.type, '${this.related}');`,
      `    assert.equal(relationship.kind, 'belongsTo');`,
      this.inverse ? `    assert.equal(relationship.options.inverse, '${this.inverse}');` : '',
      `  });`
    ].filter(_ => !!_).join(EOL), {after: 'setupTest(hooks);'});
  }

};
