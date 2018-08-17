import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | user', function(hooks) {
  setupTest(hooks);
  test('#password must match #passwordConfirmation value', function(assert) {
    const model = run(() => this.owner.lookup('service:store').createRecord('user'));
    const firstValue = 'Jim';
    const secondValue = 'Sarah';
    run(() => {
      set(model, 'password', firstValue);
      set(model, 'passwordConfirmation', secondValue);
    });
    assert.notOk(get(model, 'validations.attrs.password.isValid'));

    run(() => set(model, 'password', secondValue));
    assert.ok(get(model, 'validations.attrs.password.isValid'));
  });


  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('user', {});
    assert.ok(model);
  });
});
