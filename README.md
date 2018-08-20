# ember-cli-test-generators

[![Build Status](https://travis-ci.org/onechiporenko/ember-cli-test-generators.svg?branch=master)](https://travis-ci.org/onechiporenko/ember-cli-test-generators)
[![Mutation testing badge](https://badge.stryker-mutator.io/github.com/onechiporenko/ember-cli-test-generators/master)](https://stryker-mutator.github.io)

## About

Some blueprints for unit-tests.

## Install

```bash
ember i ember-cli-test-generators
```

## Usage

For `ember-data`:

Test `belongs-to` relationship:

```bash
ember g test-model-belongs-to user:team --related=team --inverse=users
```

Test `has-many` relationship:

```bash
ember g test-model-has-many team:users --related=user --inverse=team
```

For `ember-data` with `ember-cp-validations`:

Test `confirmation` validation:

```bash
ember g test-model-attr-cpv-confirmation user:password --on=passwordConfirmation
```

Test `length` validation:

```bash
ember g test-model-attr-cpv-length user:password --min=10
```

Test `number` validation:

```bash
ember g test-model-attr-cpv-number user:age --min=10
```

Check tests for more examples.