/* eslint-env node */
const EOL = require('os').EOL;
const SilentError = require('silent-error');

module.exports = {
  description: 'Generates a test for model\'s attribute to check its length value',

  model: undefined,
  attr: undefined,
  length: undefined,
  defaultValue: undefined,

  availableOptions: [
    {name: 'max', type: Number},
    {name: 'min', type: Number}
  ],

  locals(options) {
    const chunks = options.entity.name.split(':');
    this.model = chunks[0];
    this.attr = chunks.slice(1).join(':');
    this.min = options.min;
    this.max = options.max;
    return {};
  },

  beforeInstall() {
    if (!('ember-cp-validations' in this.project.dependencies())) {
      return Promise.reject(new SilentError('please, install `ember-cp-validations` before using this generator'));
    }
    if (typeof this.max === 'undefined' && typeof this.min === 'undefined') {
      return Promise.reject(new SilentError('--max or --min is required'));
    }
    if (typeof this.max === 'number' && typeof this.min === 'number' && this.max < this.min) {
      return Promise.reject(new SilentError('--max must be greater than --min'));
    }
  },

  afterInstall() {
    return this.insertTest();
  },

  insertTest() {
    return this.insertMinTest()
      .then(() => this.insertMaxTest());
  },

  insertMaxTest() {
    if (typeof this.max !== 'undefined') {
      const msg = `#${this.attr} max length is ${this.max}`;
      return this.insertIntoFile(`tests/unit/models/${this.model}-test.js`, [
        `${EOL}  test('${msg}', function (assert) {`,
        `    const model = run(() => this.owner.lookup('service:store').createRecord('${this.model}'));`,
        `    run(() => set(model, '${this.attr}', new Array(${this.max + 2}).join('*')));`,
        `    assert.notOk(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        ``,
        `    run(() => set(model, '${this.attr}', new Array(${this.max}).join('*')));`,
        `    assert.ok(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        ``,
        `    run(() => set(model, '${this.attr}', new Array(${this.max - 1}).join('*')));`,
        `    assert.ok(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        `  });`
      ].join(`${EOL}`), {after: '});'});
    }
    return Promise.resolve();
  },

  insertMinTest() {
    if (typeof this.min !== 'undefined') {
      const msg = `#${this.attr} min length is ${this.min}`;
      return this.insertIntoFile(`tests/unit/models/${this.model}-test.js`, [
        `${EOL}  test('${msg}', function (assert) {`,
        `    const model = run(() => this.owner.lookup('service:store').createRecord('${this.model}'));`,
        `    run(() => set(model, '${this.attr}', new Array(${this.min + 2}).join('*')));`,
        `    assert.ok(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        ``,
        `    run(() => set(model, '${this.attr}', new Array(${this.min}).join('*')));`,
        `    assert.ok(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        ``,
        `    run(() => set(model, '${this.attr}', new Array(${this.min - 1}).join('*')));`,
        `    assert.notOk(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        `  });`
      ].join(`${EOL}`), {after: '});'});
    }
    return Promise.resolve();
  }

};