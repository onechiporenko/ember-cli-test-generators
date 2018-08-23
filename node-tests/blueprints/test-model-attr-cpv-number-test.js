'use strict';

const blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
const {
  setupTestHooks,
  emberNew,
  emberGenerate,
  emberDestroy,
  modifyPackages
} = blueprintHelpers;

const fixture = require('../helpers/fixture');
const chai = require('ember-cli-blueprint-test-helpers/chai');
const expectError = require('../helpers/expect-error');
const {expect, file} = chai;

const modelName = 'user';
const attrName = 'age';
const min = 10;
const max = 20;

describe('Acceptance: ember g test-model-attr-cpv-number', function() {
  setupTestHooks(this);

  describe('in app', function () {

    beforeEach(function () {
      return emberNew();
    });

    describe('errors', function () {

      it(`ember g test-model-attr-cpv-number ${modelName}:${attrName}`, function () {
        let args = ['test-model-attr-cpv-number', `${modelName}:${attrName}`];
        return expectError(
          emberGenerate(args),
          'Please, install `ember-cp-validations` before using this generator'
        );
      });

      it(`ember g test-model-attr-cpv-number ${modelName}`, function () {
        modifyPackages([
          {name: 'ember-cp-validations'}
        ]);
        let args = ['test-model-attr-cpv-number', modelName];
        return expectError(
          emberGenerate(args),
          'Use `modelName:attrName` format'
        );
      });

      it(`ember g test-model-attr-cpv-number ${modelName}:${attrName} --odd --even`, function () {
        modifyPackages([
          {name: 'ember-cp-validations'}
        ]);
        let args = ['test-model-attr-cpv-number', `${modelName}:${attrName}`, '--odd', '--even'];
        return expectError(
          emberGenerate(args),
          '--odd and --even can\'t be used together'
        );
      });

      it(`ember g test-model-attr-cpv-number ${modelName}:${attrName} --min=${max} --max=${min}`, function () {
        modifyPackages([
          {name: 'ember-cp-validations'}
        ]);
        let args = ['test-model-attr-cpv-number', `${modelName}:${attrName}`, `--min=${max}`, `--max=${min}`];
        return expectError(
          emberGenerate(args),
          '--max must be greater than --min'
        );
      });

    });

    describe('should add test to the correct file', function () {

      beforeEach(function () {
        modifyPackages([
          {name: 'ember-cp-validations'}
        ]);
        return emberGenerate(['model-test', modelName]);
      });

      afterEach(function () {
        return emberDestroy(['model-test', modelName]);
      });

      it(`ember g test-model-attr-cpv-number ${modelName}:${attrName} --max=${max}`, function () {
        let args = ['test-model-attr-cpv-number', `${modelName}:${attrName}`, `--max=${max}`];
        return emberGenerate(args)
          .then(() => {
            expect(file(`tests/unit/models/${modelName}-test.js`))
              .to.equal(fixture('test-model-attr-cpv-number/user-age-max.js'));
          });
      });

      it(`ember g test-model-attr-cpv-number ${modelName}:${attrName} --min=${min}`, function () {
        let args = ['test-model-attr-cpv-number', `${modelName}:${attrName}`, `--min=${min}`];
        return emberGenerate(args)
          .then(() => {
            expect(file(`tests/unit/models/${modelName}-test.js`))
              .to.equal(fixture('test-model-attr-cpv-number/user-age-min.js'));
          });
      });

      it(`ember g test-model-attr-cpv-number ${modelName}:${attrName} --positive`, function () {
        let args = ['test-model-attr-cpv-number', `${modelName}:${attrName}`, `--positive`];
        return emberGenerate(args)
          .then(() => {
            expect(file(`tests/unit/models/${modelName}-test.js`))
              .to.equal(fixture('test-model-attr-cpv-number/user-age-positive.js'));
          });
      });

      it(`ember g test-model-attr-cpv-number ${modelName}:${attrName} --odd`, function () {
        let args = ['test-model-attr-cpv-number', `${modelName}:${attrName}`, `--odd`];
        return emberGenerate(args)
          .then(() => {
            expect(file(`tests/unit/models/${modelName}-test.js`))
              .to.equal(fixture('test-model-attr-cpv-number/user-age-odd.js'));
          });
      });

      it(`ember g test-model-attr-cpv-number ${modelName}:${attrName} --odd --min=${min}`, function () {
        let args = ['test-model-attr-cpv-number', `${modelName}:${attrName}`, `--odd`, `--min=${min}`];
        return emberGenerate(args)
          .then(() => {
            expect(file(`tests/unit/models/${modelName}-test.js`))
              .to.equal(fixture('test-model-attr-cpv-number/user-age-odd-min.js'));
          });
      });

      it(`ember g test-model-attr-cpv-number ${modelName}:${attrName} --odd --max=${max}`, function () {
        let args = ['test-model-attr-cpv-number', `${modelName}:${attrName}`, `--odd`, `--max=${max}`];
        return emberGenerate(args)
          .then(() => {
            expect(file(`tests/unit/models/${modelName}-test.js`))
              .to.equal(fixture('test-model-attr-cpv-number/user-age-odd-max.js'));
          });
      });

      it(`ember g test-model-attr-cpv-number ${modelName}:${attrName} --even`, function () {
        let args = ['test-model-attr-cpv-number', `${modelName}:${attrName}`, `--even`];
        return emberGenerate(args)
          .then(() => {
            expect(file(`tests/unit/models/${modelName}-test.js`))
              .to.equal(fixture('test-model-attr-cpv-number/user-age-even.js'));
          });
      });

      it(`ember g test-model-attr-cpv-number ${modelName}:${attrName} --even --min=${min}`, function () {
        let args = ['test-model-attr-cpv-number', `${modelName}:${attrName}`, '--even', `--min=${min}`];
        return emberGenerate(args)
          .then(() => {
            expect(file(`tests/unit/models/${modelName}-test.js`))
              .to.equal(fixture('test-model-attr-cpv-number/user-age-even-min.js'));
          });
      });

      it(`ember g test-model-attr-cpv-number ${modelName}:${attrName} --even --max=${max}`, function () {
        let args = ['test-model-attr-cpv-number', `${modelName}:${attrName}`, '--even', `--max=${max}`];
        return emberGenerate(args)
          .then(() => {
            expect(file(`tests/unit/models/${modelName}-test.js`))
              .to.equal(fixture('test-model-attr-cpv-number/user-age-even-max.js'));
          });
      });

      it(`ember g test-model-attr-cpv-number ${modelName}:${attrName} --allowNone`, function () {
        let args = ['test-model-attr-cpv-number', `${modelName}:${attrName}`, `--allowNone`];
        return emberGenerate(args)
          .then(() => {
            expect(file(`tests/unit/models/${modelName}-test.js`))
              .to.equal(fixture('test-model-attr-cpv-number/user-age-allow-none.js'));
          });
      });

      it(`ember g test-model-attr-cpv-number ${modelName}:${attrName} --min=${min} --positive --integer`, function () {
        let args = ['test-model-attr-cpv-number', `${modelName}:${attrName}`, `--min=${min}`, '--positive', '--integer'];
        return emberGenerate(args)
          .then(() => {
            expect(file(`tests/unit/models/${modelName}-test.js`))
              .to.equal(fixture('test-model-attr-cpv-number/user-age-min-positive-integer.js'));
          });
      });

      it(`ember g test-model-attr-cpv-number ${modelName}:${attrName} --min=${-min} --integer`, function () {
        let args = ['test-model-attr-cpv-number', `${modelName}:${attrName}`, `--min=${-min}`, '--integer'];
        return emberGenerate(args)
          .then(() => {
            expect(file(`tests/unit/models/${modelName}-test.js`))
              .to.equal(fixture('test-model-attr-cpv-number/user-age-min-negative-integer.js'));
          });
      });

      it(`ember g test-model-attr-cpv-number ${modelName}:${attrName} --max=${max} --positive --integer`, function () {
        let args = ['test-model-attr-cpv-number', `${modelName}:${attrName}`, `--max=${max}`, '--positive', '--integer'];
        return emberGenerate(args)
          .then(() => {
            expect(file(`tests/unit/models/${modelName}-test.js`))
              .to.equal(fixture('test-model-attr-cpv-number/user-age-max-positive-integer.js'));
          });
      });

      it(`ember g test-model-attr-cpv-number ${modelName}:${attrName} --min=${-max} --integer`, function () {
        let args = ['test-model-attr-cpv-number', `${modelName}:${attrName}`, `--min=${-max}`, '--integer'];
        return emberGenerate(args)
          .then(() => {
            expect(file(`tests/unit/models/${modelName}-test.js`))
              .to.equal(fixture('test-model-attr-cpv-number/user-age-max-negative-integer.js'));
          });
      });

    });

  });
});
