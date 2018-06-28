/* eslint-env node */
const EOL = require('os').EOL;
const SilentError = require('silent-error');

module.exports = {
  description: 'Generates a test for model\'s attribute to check its length value',

  model: undefined,
  attr: undefined,
  defaultValue: undefined,
  positive: false,
  integer: false,
  odd: false,
  even: false,
  allowNone: false,

  availableOptions: [
    {name: 'max', type: Number},
    {name: 'min', type: Number},
    {name: 'integer', type: Boolean, default: false, aliases: ['i']},
    {name: 'positive', type: Boolean, default: false, aliases: ['pos']},
    {name: 'odd', type: Boolean, default: false},
    {name: 'even', type: Boolean, default: false},
    {name: 'allow-none', type: Boolean, default: false, aliases: ['an']},
  ],

  locals(options) {
    const chunks = options.entity.name.split(':');
    this.model = chunks[0];
    this.attr = chunks.slice(1).join(':');
    this.min = options.min;
    this.max = options.max;
    this.integer = options.integer;
    this.positive = options.positive;
    this.odd = options.odd;
    this.allowNone = options.allowNone;
    return {};
  },

  beforeInstall() {
    if (!('ember-cp-validations' in this.project.dependencies())) {
      return Promise.reject(new SilentError('please, install `ember-cp-validations` before using this generator'));
    }
    if (this.even && this.odd) {
      return Promise.reject(new SilentError('--odd and --even can\'t be used together'));
    }
    if (typeof this.max !== 'undefined' && typeof this.min !== 'undefined' && this.max <= this.min) {
      return Promise.reject(new SilentError('--max must be greater than --min'));
    }
  },

  afterInstall() {
    return this.insertTest();
  },

  insertTest() {
    return this.insertMinTest()
      .then(() => this.insertMaxTest())
      .then(() => this.insertIntegerTest())
      .then(() => this.insertPositiveTest())
      .then(() => this.insertOddTest())
      .then(() => this.insertEvenTest())
      .then(() => this.insertNoneTest());
  },

  insertMaxTest() {
    if (typeof this.max !== 'undefined') {
      const msg = `#${this.attr} max value is ${this.max}`;
      return this.insertIntoFile(`tests/unit/models/${this.model}-test.js`, [
        `${EOL}  test('${msg}', function (assert) {`,
        `    const model = run(() => this.owner.lookup('service:store').createRecord('${this.model}'));`,
        `    run(() => set(model, '${this.attr}', ${this.max + 1}));`,
        `    assert.notOk(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        ``,
        `    run(() => set(model, '${this.attr}', ${this.max}));`,
        `    assert.ok(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        ``,
        `    run(() => set(model, '${this.attr}', ${this.max - 1}));`,
        `    assert.ok(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        `  });`
      ].join(`${EOL}`), {after: '});'});
    }
    return Promise.resolve();
  },

  insertMinTest() {
    if (typeof this.min !== 'undefined') {
      const msg = `#${this.attr} min value is ${this.min}`;
      return this.insertIntoFile(`tests/unit/models/${this.model}-test.js`, [
        `${EOL}  test('${msg}', function (assert) {`,
        `    const model = run(() => this.owner.lookup('service:store').createRecord('${this.model}'));`,
        `    run(() => set(model, '${this.attr}', ${this.min + 1}));`,
        `    assert.ok(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        ``,
        `    run(() => set(model, '${this.attr}', ${this.min}));`,
        `    assert.ok(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        ``,
        `    run(() => set(model, '${this.attr}', ${this.min - 1}));`,
        `    assert.notOk(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        `  });`
      ].join(`${EOL}`), {after: '});'});
    }
    return Promise.resolve();
  },

  insertIntegerTest() {
    if (this.integer) {
      let testValInt = this.positive ? 1 : -1;
      let testValFloat = this.positive ? 0.9 : -0.9;
      if (this.min) {
        testValInt = this.min + 1;
        testValFloat = this.min + 0.9;
      }
      if (this.max) {
        testValInt = this.max - 1;
        testValFloat = this.max - 0.9;
      }
      return this.insertIntoFile(`tests/unit/models/${this.model}-test.js`, [
        `${EOL}  test('#${this.attr} must be an integer', function (assert) {`,
        `    const model = run(() => this.owner.lookup('service:store').createRecord('${this.model}'));`,
        `    run(() => set(model, '${this.attr}', ${testValInt}));`,
        `    assert.ok(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        ``,
        `    run(() => set(model, '${this.attr}', ${testValFloat}));`,
        `    assert.notOk(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        `  });`
      ].join(`${EOL}`), {after: '});'});
    }
    return Promise.resolve();
  },

  insertPositiveTest() {
    if (this.positive && (typeof this.min ==='undefined' || this.min <= 0)) {
      const msg = `#${this.attr} must be greater than 0`;
      return this.insertIntoFile(`tests/unit/models/${this.model}-test.js`, [
        `${EOL}  test('${msg}', function (assert) {`,
        `    const model = run(() => this.owner.lookup('service:store').createRecord('${this.model}'));`,
        `    run(() => set(model, '${this.attr}', 1));`,
        `    assert.ok(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        ``,
        `    run(() => set(model, '${this.attr}', 0));`,
        `    assert.notOk(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        ``,
        `    run(() => set(model, '${this.attr}', -1));`,
        `    assert.notOk(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        `  });`
      ].join(`${EOL}`), {after: '});'});
    }
    return Promise.resolve();
  },

  insertOddTest() {
    if (this.odd) {
      let valid = this.positive ? 1 : -1;
      let invalid = this.positive ? 2 : -2;
      if (this.min) {
        valid = this.min % 2 ? this.min : this.min + 1;
        invalid = this.min % 2 ? this.min + 1 : this.min;
      }
      if (this.max) {
        valid = this.max % 2 ? this.max : this.max - 1;
        invalid = this.max % 2 ? this.max - 1 : this.max;
      }
      return this.insertIntoFile(`tests/unit/models/${this.model}-test.js`, [
        `${EOL}  test('#${this.attr} must be odd', function (assert) {`,
        `    const model = run(() => this.owner.lookup('service:store').createRecord('${this.model}'));`,
        `    run(() => set(model, '${this.attr}', ${valid}));`,
        `    assert.ok(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        ``,
        `    run(() => set(model, '${this.attr}', ${invalid}));`,
        `    assert.notOk(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        `  });`
      ].join(`${EOL}`), {after: '});'});
    }
    return Promise.resolve();
  },

  insertEvenTest() {
    if (this.even) {
      let valid = this.positive ? 2 : -2;
      let invalid = this.positive ? 1 : -1;
      if (this.min) {
        valid = this.min % 2 ? this.min + 1: this.min;
        invalid = this.min % 2 ? this.min : this.min + 1;
      }
      if (this.max) {
        valid = this.max % 2 ? this.max - 1: this.max;
        invalid = this.max % 2 ? this.max : this.max - 1;
      }
      return this.insertIntoFile(`tests/unit/models/${this.model}-test.js`, [
        `${EOL}  test('#${this.attr} must be even', function (assert) {`,
        `    const model = run(() => this.owner.lookup('service:store').createRecord('${this.model}'));`,
        `    run(() => set(model, '${this.attr}', ${valid}));`,
        `    assert.ok(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        ``,
        `    run(() => set(model, '${this.attr}', ${invalid}));`,
        `    assert.notOk(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        `  });`
      ].join(`${EOL}`), {after: '});'});
    }
    return Promise.resolve();
  },

  insertNoneTest() {
    if (this.allowNone) {
      return this.insertIntoFile(`tests/unit/models/${this.model}-test.js`, [
        `${EOL}  test('#${this.attr} can be null and undefined', function (assert) {`,
        `    const model = run(() => this.owner.lookup('service:store').createRecord('${this.model}'));`,
        `    run(() => set(model, '${this.attr}', null));`,
        `    assert.ok(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        ``,
        `    run(() => set(model, '${this.attr}', undefined));`,
        `    assert.ok(get(model, 'validations.attrs.${this.attr}.isValid'));`,
        `  });`
      ].join(`${EOL}`), {after: '});'});
    }
    return Promise.resolve();
  },

};
