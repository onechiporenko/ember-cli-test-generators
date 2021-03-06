import { module, test } from 'qunit';
import { get, set } from '@ember/object';
import { run } from '@ember/runloop';
import { setupTest } from 'ember-qunit';

module('Unit | Model | user', function(hooks) {
  setupTest(hooks);
  test('#age can be null and undefined', function(assert) {
    const model = this.owner.lookup('service:store').createRecord('user');
    run(() => set(model, 'age', null));
    assert.notOk(get(model, 'validations.attrs.age.errors').isAny('type', 'number'));

    run(() => set(model, 'age', undefined));
    assert.notOk(get(model, 'validations.attrs.age.errors').isAny('type', 'number'));
  });


  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('user', {});
    assert.ok(model);
  });
});
