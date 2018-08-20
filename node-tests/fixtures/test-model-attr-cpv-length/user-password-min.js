import { module, test } from 'qunit';
import { get, set } from '@ember/object';
import { run } from '@ember/runloop';
import { setupTest } from 'ember-qunit';

module('Unit | Model | user', function(hooks) {
  setupTest(hooks);
  test('#password min length is 10', function(assert) {
    const model = this.owner.lookup('service:store').createRecord('user');
    run(() => set(model, 'password', new Array(12).join('*')));
    assert.notOk(get(model, 'validations.attrs.password.errors').isAny('type', 'length'));

    run(() => set(model, 'password', new Array(10).join('*')));
    assert.notOk(get(model, 'validations.attrs.password.errors').isAny('type', 'length'));

    run(() => set(model, 'password', new Array(9).join('*')));
    assert.ok(get(model, 'validations.attrs.password.errors').isAny('type', 'length'));
  });


  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('user', {});
    assert.ok(model);
  });
});
