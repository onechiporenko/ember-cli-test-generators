'use strict';

const blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
const setupTestHooks = blueprintHelpers.setupTestHooks;
const emberNew = blueprintHelpers.emberNew;
const emberGenerate = blueprintHelpers.emberGenerate;
const emberDestroy = blueprintHelpers.emberDestroy;

const fixture = require('../helpers/fixture');
const chai = require('ember-cli-blueprint-test-helpers/chai');
const expectError = require('../helpers/expect-error');
const {file, expect} = chai;

const modelName = 'team';
const attrName = 'users';
const related = 'user';
const inverse = 'team';

describe('Acceptance: ember g test-model-has-many', function() {
  setupTestHooks(this);

  describe('in app', function () {

    beforeEach(function () {
      return emberNew();
    });

    describe('errors', function () {

      it(`ember g test-model-has-many ${modelName}`, function () {
        let args = ['test-model-has-many', modelName];
        return expectError(
          emberGenerate(args),
          'Use `modelName:attrName` format'
        );
      });

      it(`ember g test-model-has-many ${modelName}:${attrName}`, function () {
        let args = ['test-model-has-many', `${modelName}:${attrName}`];
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

      it(`ember g test-model-has-many ${modelName}:${attrName} --related=${related}`, function () {
        let args = ['test-model-has-many', `${modelName}:${attrName}`, `--related=${related}`];
        return emberGenerate(args)
          .then(() => {
            expect(file(`tests/unit/models/${modelName}-test.js`))
              .to.equal(fixture('test-model-has-many/team-users.js'));
          });
      });

      it(`ember g test-model-has-many ${modelName}:${attrName} --related=${related} --inverse=${inverse}`, function () {
        let args = ['test-model-has-many', `${modelName}:${attrName}`, `--related=${related}`, `--inverse=${inverse}`];
        return emberGenerate(args)
          .then(() => {
            expect(file(`tests/unit/models/${modelName}-test.js`))
              .to.equal(fixture('test-model-has-many/team-users-with-inverse.js'));
          });
      });

    });

  });
});
