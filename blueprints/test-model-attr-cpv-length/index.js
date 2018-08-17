/* eslint-env node */
const EOL = require('os').EOL;
const SilentError = require('silent-error');

module.exports = {
  description: 'Generates a test for model\'s attribute to check its length value',

  model: undefined,
  attr: undefined,
  max: undefined,
  min: undefined,
  is: undefined,

  availableOptions: [
    {name: 'max', type: Number},
    {name: 'min', type: Number},
    {name: 'is', type: Number}
  ],

  locals(options) {
    const chunks = options.entity.name.split(':');
    if (chunks.length === 1) {
      return Promise.reject(new SilentError('Use `modelName:attrName` format'));
    }
    this.model = chunks[0];
    this.attr = chunks.slice(1).join(':');
    this.min = options.min;
    this.max = options.max;
    this.is = options.is;
    return {};
  },

  beforeInstall() {
    if (!('ember-cp-validations' in this.project.dependencies())) {
      return Promise.reject(new SilentError('Please, install `ember-cp-validations` before using this generator'));
    }
    if (typeof this.max === 'undefined' && typeof this.min === 'undefined' && typeof this.is === 'undefined') {
      return Promise.reject(new SilentError('--is, --max or --min is required'));
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
      .then(() => this.insertMaxTest())
      .then(() => this.insertIsTest());
  },

  insertMaxTest() {
    if (typeof this.max !== 'undefined') {
      const msg = `#${this.attr} max length is ${this.max}`;
      return this.insertIntoFile(`tests/unit/models/${this.model}-test.js`, [
        `${EOL}  test('${msg}', function(assert) {`,
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
      ].join(`${EOL}`), {after: 'setupTest(hooks);'});
    }
    return Promise.resolve();
  },

  insertMinTest() {
    if (typeof this.min !== 'undefined') {
      const msg = `#${this.attr} min length is ${this.min}`;
      return this.insertIntoFile(`tests/unit/models/${this.model}-test.js`, [
        `${EOL}  test('${msg}', function(assert) {`,
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
      ].join(`${EOL}`), {after: 'setupTest(hooks);'});
    }
    return Promise.resolve();
  },

  insertIsTest() {
    if (typeof this.is !== 'undefined') {
      const msg = `#${this.attr} length is ${this.is}`;
      return this.insertIntoFile(`tests/unit/models/${this.model}-test.js`, [
        `${EOL}  test('${msg}', function(assert) {`,
        `    const model = run(() => this.owner.lookup('service:store').createRecord('${this.model}'));`,
        `    run(() => set(model, '${this.attr}', new Array(${this.is + 2}).join('*')));`,
        `    assert.notOk(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        ``,
        `    run(() => set(model, '${this.attr}', new Array(${this.is}).join('*')));`,
        `    assert.ok(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        ``,
        `    run(() => set(model, '${this.attr}', new Array(${this.is - 1}).join('*')));`,
        `    assert.notOk(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        `  });`
      ].join(`${EOL}`), {after: 'setupTest(hooks);'});
    }
    return Promise.resolve();
  }

};
