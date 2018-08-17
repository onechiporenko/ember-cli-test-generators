import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | team', function(hooks) {
  setupTest(hooks);
  test('#users has many "user" inverted as #team', function(assert) {
    const Model = this.owner.lookup('service:store').modelFor('team');
    // eslint-disable-next-line
    const relationship = get(Model, 'relationshipsByName').get('users');
    assert.equal(relationship.type, 'user');
    assert.equal(relationship.kind, 'hasMany');
    assert.equal(relationship.options.inverse, 'team');
  });


  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('team', {});
    assert.ok(model);
  });
});
