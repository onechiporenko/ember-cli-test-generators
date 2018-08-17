import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | user', function(hooks) {
  setupTest(hooks);
  test('#age can be null and undefined', function(assert) {
    const model = run(() => this.owner.lookup('service:store').createRecord('user'));
    run(() => set(model, 'age', null));
    assert.ok(get(model, 'validations.attrs.age.isValid'));

    run(() => set(model, 'age', undefined));
    assert.ok(get(model, 'validations.attrs.age.isValid'));
  });


  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('user', {});
    assert.ok(model);
  });
});
