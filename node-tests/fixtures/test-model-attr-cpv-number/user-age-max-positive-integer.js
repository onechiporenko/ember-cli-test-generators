import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | user', function(hooks) {
  setupTest(hooks);
  test('#age must be greater than 0', function(assert) {
    const model = run(() => this.owner.lookup('service:store').createRecord('user'));
    run(() => set(model, 'age', 1));
    assert.ok(get(model, 'validations.attrs.age.isValid'));

    run(() => set(model, 'age', 0));
    assert.notOk(get(model, 'validations.attrs.age.isValid'));

    run(() => set(model, 'age', -1));
    assert.notOk(get(model, 'validations.attrs.age.isValid'));
  });

  test('#age must be an integer', function(assert) {
    const model = run(() => this.owner.lookup('service:store').createRecord('user'));
    run(() => set(model, 'age', 19));
    assert.ok(get(model, 'validations.attrs.age.isValid'));

    run(() => set(model, 'age', 19.1));
    assert.notOk(get(model, 'validations.attrs.age.isValid'));
  });

  test('#age max value is 20', function(assert) {
    const model = run(() => this.owner.lookup('service:store').createRecord('user'));
    run(() => set(model, 'age', 21));
    assert.notOk(get(model, 'validations.attrs.age.isValid'));

    run(() => set(model, 'age', 20));
    assert.ok(get(model, 'validations.attrs.age.isValid'));

    run(() => set(model, 'age', 19));
    assert.ok(get(model, 'validations.attrs.age.isValid'));
  });


  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('user', {});
    assert.ok(model);
  });
});
