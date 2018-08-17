'use strict';

const blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
const setupTestHooks = blueprintHelpers.setupTestHooks;
const emberNew = blueprintHelpers.emberNew;
const emberGenerate = blueprintHelpers.emberGenerate;
const modifyPackages = blueprintHelpers.modifyPackages;

const fixture = require('../helpers/fixture');
const expectError = require('../helpers/expect-error');
const chai = require('ember-cli-blueprint-test-helpers/chai');

const modelName = 'user';
const attrName = 'password';
const is = 15;
const min = 10;
const max = 20;

const {expect, file} = chai;

describe('Acceptance: ember g test-model-attr-cpv-length', function() {
  setupTestHooks(this);

  describe('in app', function () {

    beforeEach(function () {
      return emberNew();
    });

    describe('errors', function () {

      it(`ember g test-model-attr-cpv-length ${modelName}:${attrName}`, function () {
        let args = ['test-model-attr-cpv-length', `${modelName}:${attrName}`];
        return expectError(
          emberGenerate(args),
          'Please, install `ember-cp-validations` before using this generator'
        );
      });

      it(`ember g test-model-attr-cpv-length ${modelName}`, function () {
        modifyPackages([
          {name: 'ember-cp-validations'}
        ]);
        let args = ['test-model-attr-cpv-length', modelName];
        return expectError(
          emberGenerate(args),
          'Use `modelName:attrName` format'
        );
      });

      it(`ember g test-model-attr-cpv-length ${modelName}:${attrName}`, function () {
        modifyPackages([
          {name: 'ember-cp-validations'}
        ]);
        let args = ['test-model-attr-cpv-length', `${modelName}:${attrName}`];
        return expectError(
          emberGenerate(args),
          '--is, --max or --min is required'
        );
      });

      it(`ember g test-model-attr-cpv-length ${modelName}:${attrName} --min=${max} --max=${min}`, function () {
        modifyPackages([
          {name: 'ember-cp-validations'}
        ]);
        let args = ['test-model-attr-cpv-length', `${modelName}:${attrName}`, `--min=${max}`, `--max=${min}`];
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

      it(`ember g test-model-attr-cpv-length ${modelName}:${attrName} --is=${is}`, function () {
        const args = ['test-model-attr-cpv-length', `${modelName}:${attrName}`, `--is=${is}`];
        return emberGenerate(args)
          .then(() => {
            expect(file(`tests/unit/models/${modelName}-test.js`))
              .to.equal(fixture('test-model-attr-cpv-length/user-password-is.js'));
          });
      });

      it(`ember g test-model-attr-cpv-length ${modelName}:${attrName} --min=${min}`, function () {
        const args = ['test-model-attr-cpv-length', `${modelName}:${attrName}`, `--min=${min}`];
        return emberGenerate(args)
          .then(() => {
            expect(file(`tests/unit/models/${modelName}-test.js`))
              .to.equal(fixture('test-model-attr-cpv-length/user-password-min.js'));
          });
      });

      it(`ember g test-model-attr-cpv-length ${modelName}:${attrName} --max=${max}`, function () {
        const args = ['test-model-attr-cpv-length', `${modelName}:${attrName}`, `--max=${max}`];
        return emberGenerate(args)
          .then(() => {
            expect(file(`tests/unit/models/${modelName}-test.js`))
              .to.equal(fixture('test-model-attr-cpv-length/user-password-max.js'));
          });
      });

    });

  });
});
