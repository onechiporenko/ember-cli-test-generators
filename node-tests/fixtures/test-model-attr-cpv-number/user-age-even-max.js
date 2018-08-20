import { module, test } from 'qunit';
import { get, set } from '@ember/object';
import { run } from '@ember/runloop';
import { setupTest } from 'ember-qunit';

module('Unit | Model | user', function(hooks) {
  setupTest(hooks);
  test('#age must be even', function(assert) {
    const model = this.owner.lookup('service:store').createRecord('user');
    run(() => set(model, 'age', 20));
    assert.notOk(get(model, 'validations.attrs.age.errors').isAny('type', 'number'));

    run(() => set(model, 'age', 19));
    assert.ok(get(model, 'validations.attrs.age.errors').isAny('type', 'number'));
  });

  test('#age max value is 20', function(assert) {
    const model = this.owner.lookup('service:store').createRecord('user');
    run(() => set(model, 'age', 21));
    assert.ok(get(model, 'validations.attrs.age.errors').isAny('type', 'number'));

    run(() => set(model, 'age', 20));
    assert.notOk(get(model, 'validations.attrs.age.errors').isAny('type', 'number'));

    run(() => set(model, 'age', 19));
    assert.notOk(get(model, 'validations.attrs.age.errors').isAny('type', 'number'));
  });


  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('user', {});
    assert.ok(model);
  });
});
