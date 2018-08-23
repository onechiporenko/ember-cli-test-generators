'use strict';

const blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
const {
  emberNew,
  emberGenerate,
  emberDestroy,
  setupTestHooks
} = blueprintHelpers;

const fixture = require('../helpers/fixture');
const chai = require('ember-cli-blueprint-test-helpers/chai');
const expectError = require('../helpers/expect-error');
const {file, expect} = chai;

const modelName = 'user';
const attrName = 'team';
const related = 'team';
const inverse = 'users';

describe('Acceptance: ember g test-model-belongs-to', function() {
  setupTestHooks(this);

  describe('in app', function () {

    beforeEach(function () {
      return emberNew();
    });

    describe('errors', function () {

      it(`ember g test-model-belongs-to ${modelName}`, function () {
        let args = ['test-model-belongs-to', modelName];
        return expectError(
          emberGenerate(args),
          'Use `modelName:attrName` format'
        );
      });

      it(`ember g test-model-belongs-to ${modelName}:${attrName}`, function () {
        let args = ['test-model-belongs-to', `${modelName}:${attrName}`];
        return expectError(
          emberGenerate(args),
          '--related is required'
        );
      });

    });

    describe('should add test to the correct file', function () {

      beforeEach(function () {
        return emberGenerate(['model-test', modelName]);
      });

      afterEach(function () {
        return emberDestroy(['model-test', modelName]);
      });

      it(`ember g test-model-belongs-to ${modelName}:${attrName} --related=${related}`, function () {
        let args = ['test-model-belongs-to', `${modelName}:${attrName}`, `--related=${related}`];
        return emberGenerate(args)
          .then(() => {
            expect(file(`tests/unit/models/${modelName}-test.js`))
              .to.equal(fixture('test-model-belongs-to/user-team.js'));
          });
      });

      it(`ember g test-model-belongs-to ${modelName}:${attrName} --related=${related} --inverse=${inverse}`, function () {
        let args = ['test-model-belongs-to', `${modelName}:${attrName}`, `--related=${related}`, `--inverse=${inverse}`];
        return emberGenerate(args)
          .then(() => {
            expect(file(`tests/unit/models/${modelName}-test.js`))
              .to.equal(fixture('test-model-belongs-to/user-team-with-inverse.js'));
          });
      });

    });

  });
});
