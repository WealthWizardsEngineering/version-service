const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();
const timekeeper = require('timekeeper');

test('application version model', (t) => {

  t.test('creates a new mongoose schema', assert => {

    assert.plan(6);

    const fakeObjectId = 'fake object id';

    timekeeper.freeze(new Date());

    function fakeSchema(schema, options) {
      assert.deepEqual(schema.environment, { type: String });
      assert.deepEqual(schema.application_name, { type: String });
      assert.deepEqual(schema.version, { type: String });
      assert.deepEqual(schema.product, { type: String });
      assert.deepEqual(options, { timestamps: { createdAt: 'date', updatedAt: 'updated_at' } });
    }

    fakeSchema.Types = {
      ObjectId: fakeObjectId,
    };

    const fakeMongoose = {
      Schema: fakeSchema,
      model: (name, schema) => {
        return `${name}:${schema.constructor.name}`;
      },
    };

    const target = proxyquire('../../../src/db/application-version-model', { mongoose: fakeMongoose });

    assert.equal(target, 'ApplicationVersion:fakeSchema');

    timekeeper.reset();

  });

});
