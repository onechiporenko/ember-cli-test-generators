import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | user', function(hooks) {
  setupTest(hooks);
  test('#team belongs to "team"', function(assert) {
    const Model = this.owner.lookup('service:store').modelFor('user');
    // eslint-disable-next-line
    const relationship = get(Model, 'relationshipsByName').get('team');
    assert.equal(relationship.type, 'team');
    assert.equal(relationship.kind, 'belongsTo');
  });


  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('user', {});
    assert.ok(model);
  });
});
