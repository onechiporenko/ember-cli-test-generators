import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | user', function(hooks) {
  setupTest(hooks);
  test('#password length is 15', function(assert) {
    const model = run(() => this.owner.lookup('service:store').createRecord('user'));
    run(() => set(model, 'password', new Array(17).join('*')));
    assert.notOk(get(model, 'validations.attrs.password.isValid'));

    run(() => set(model, 'password', new Array(15).join('*')));
    assert.ok(get(model, 'validations.attrs.password.isValid'));

    run(() => set(model, 'password', new Array(14).join('*')));
    assert.notOk(get(model, 'validations.attrs.password.isValid'));
  });


  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('user', {});
    assert.ok(model);
  });
});
