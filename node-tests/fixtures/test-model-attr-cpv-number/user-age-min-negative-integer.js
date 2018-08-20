import { module, test } from 'qunit';
import { get, set } from '@ember/object';
import { run } from '@ember/runloop';
import { setupTest } from 'ember-qunit';

module('Unit | Model | user', function(hooks) {
  setupTest(hooks);
  test('#age must be an integer', function(assert) {
    const model = this.owner.lookup('service:store').createRecord('user');
    run(() => set(model, 'age', -9));
    assert.notOk(get(model, 'validations.attrs.age.errors').isAny('type', 'number'));

    run(() => set(model, 'age', -9.1));
    assert.ok(get(model, 'validations.attrs.age.errors').isAny('type', 'number'));
  });

  test('#age min value is -10', function(assert) {
    const model = this.owner.lookup('service:store').createRecord('user');
    run(() => set(model, 'age', -9));
    assert.notOk(get(model, 'validations.attrs.age.errors').isAny('type', 'number'));

    run(() => set(model, 'age', -10));
    assert.notOk(get(model, 'validations.attrs.age.errors').isAny('type', 'number'));

    run(() => set(model, 'age', -11));
    assert.ok(get(model, 'validations.attrs.age.errors').isAny('type', 'number'));
  });


  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('user', {});
    assert.ok(model);
  });
});
