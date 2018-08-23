/* eslint-env node, mocha */
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
const expectError = require('../helpers/expect-error');
const chai = require('ember-cli-blueprint-test-helpers/chai');

const modelName = 'user';
const attrName = 'password';
const on = 'passwordConfirmation';
const {expect, file} = chai;

describe('Acceptance: ember g test-model-attr-cpv-confirmation', function () {
  setupTestHooks(this);

  describe('in app', function () {

    beforeEach(function () {
      return emberNew();
    });

    describe('errors', function () {

      it(`ember g test-model-attr-cpv-confirmation ${modelName}:${attrName} --on=${on}`, function () {
        let args = ['test-model-attr-cpv-confirmation', `${modelName}:${attrName}`, `--on=${on}`];
        return expectError(
          emberGenerate(args),
          'Please, install `ember-cp-validations` before using this generator'
        );
      });

      it(`ember g test-model-attr-cpv-confirmation ${modelName} --on=${on}`, function () {
        modifyPackages([
          {name: 'ember-cp-validations'}
        ]);
        let args = ['test-model-attr-cpv-confirmation', modelName, `--on=${on}`];
        return expectError(
          emberGenerate(args),
          'Use `modelName:attrName` format'
        );
      });

      it(`ember g test-model-attr-cpv-confirmation ${modelName}:${attrName}`, function () {
        modifyPackages([
          {name: 'ember-cp-validations'}
        ]);
        let args = ['test-model-attr-cpv-confirmation', `${modelName}:${attrName}`];
        return expectError(
          emberGenerate(args),
          '--on is required'
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

      it(`ember g test-model-attr-cpv-confirmation ${modelName}:${attrName} --on=${on}`, function () {
        const args = ['test-model-attr-cpv-confirmation', `${modelName}:${attrName}`, `--on=${on}`];
        return emberGenerate(args)
          .then(() => {
            expect(file(`tests/unit/models/${modelName}-test.js`))
              .to.equal(fixture('test-model-attr-cpv-confirmation/user-password-confirmation.js'));
          });
      });

    });

  });

});