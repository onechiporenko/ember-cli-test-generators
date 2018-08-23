/* eslint-env node */
const EOL = require('os').EOL;
const SilentError = require('silent-error');

module.exports = {
  description: 'Generates a test for model\'s attribute to check if its value matches another attr value',

  model: undefined,
  attr: undefined,
  on: undefined,

  availableOptions: [
    {name: 'on', type: String},
  ],

  beforeInstall(options) {
    const chunks = options.entity.name.split(':');
    if (chunks.length === 1) {
      return Promise.reject(new SilentError('Use `modelName:attrName` format'));
    }
    this.model = chunks[0];
    this.attr = chunks.slice(1).join(':');
    this.on = options.on;
    if (!('ember-cp-validations' in this.project.dependencies())) {
      return Promise.reject(new SilentError('Please, install `ember-cp-validations` before using this generator'));
    }
    if (typeof this.on === 'undefined') {
      return Promise.reject(new SilentError('--on is required'));
    }
  },

  afterInstall() {
    return this.insertTest()
      .then(() => this.insertImport());
  },

  insertTest() {
    return this.insertIntoFile(`tests/unit/models/${this.model}-test.js`, [
      `${EOL}  test('#${this.attr} must match #${this.on} value', function(assert) {`,
      `    const model = this.owner.lookup('service:store').createRecord('${this.model}');`,
      `    const firstValue = 'Jim';`,
      `    const secondValue = 'Sarah';`,
      `    run(() => {`,
      `      set(model, '${this.attr}', firstValue);`,
      `      set(model, '${this.on}', secondValue);`,
      `    });`,
      `    assert.ok(get(model, 'validations.attrs.${this.attr}.errors').isAny('type', 'confirmation'));`,
      ``,
      `    run(() => set(model, '${this.attr}', secondValue));`,
      `    assert.notOk(get(model, 'validations.attrs.${this.attr}.errors').isAny('type', 'confirmation'));`,
      `  });`
    ].join(EOL), {after: 'setupTest(hooks);'});
  },

  insertImport() {
    return this.insertIntoFile(`tests/unit/models/${this.model}-test.js`,
      [
        `import { get, set } from '@ember/object';`,
        `import { run } from '@ember/runloop';`,
      ].join(EOL),
      {before: 'import { setupTest } from \'ember-qunit\';'}
    );
  }

};
