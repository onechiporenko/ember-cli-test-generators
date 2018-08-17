import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | user', function(hooks) {
  setupTest(hooks);
  test('#age must be odd', function(assert) {
    const model = run(() => this.owner.lookup('service:store').createRecord('user'));
    run(() => set(model, 'age', 11));
    assert.ok(get(model, 'validations.attrs.age.isValid'));

    run(() => set(model, 'age', 10));
    assert.notOk(get(model, 'validations.attrs.age.isValid'));
  });

  test('#age min value is 10', function(assert) {
    const model = run(() => this.owner.lookup('service:store').createRecord('user'));
    run(() => set(model, 'age', 11));
    assert.ok(get(model, 'validations.attrs.age.isValid'));

    run(() => set(model, 'age', 10));
    assert.ok(get(model, 'validations.attrs.age.isValid'));

    run(() => set(model, 'age', 9));
    assert.notOk(get(model, 'validations.attrs.age.isValid'));
  });


  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('user', {});
    assert.ok(model);
  });
});
