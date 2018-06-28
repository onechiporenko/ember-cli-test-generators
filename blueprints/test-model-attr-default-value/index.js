/* eslint-env node */

const EOL = require('os').EOL;

module.exports = {
  description: 'Generates a test for model\'s attribute default value',

  model: undefined,
  attr: undefined,
  defaultValue: undefined,

  locals(options) {
    const chunks = options.entity.name.split(':');
    this.model = chunks[0];
    this.attr = chunks.slice(1).join(':');
    return {};
  },

  afterInstall() {
    this.lookupBlueprint('model');
    return this.insertTest();
  },

  insertTest() {
    return this.insertIntoFile(`tests/unit/models/${this.model}-test.js`, [
      `${EOL}  test('#${this.attr} default value', function () {`,
      `    let store = this.owner.lookup('service:store');`,
      `    let model = run(() => store.createRecord('${this.model}', {}));`,
      `    assert.equal(get(model, '${this.attr}'), null);`,
      `  });`
    ].join(`${EOL}`), {after: '});'});
  }

};
