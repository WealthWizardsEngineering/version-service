const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();
const timekeeper = require('timekeeper');

test('application version model', (t) => {

  t.test('creates a new mongoose schema', assert => {

    assert.plan(7);

    const fakeObjectId = 'fake object id';

    timekeeper.freeze(new Date());

    function fakeSchema(schema, options) {
      assert.deepEqual(schema.fact_find_id, { type: String, required: true });
      assert.deepEqual(schema.solution, { type: Object });
      assert.deepEqual(schema.suitability_report, { type: String });
      assert.deepEqual(schema.statement_of_fact, { type: fakeObjectId, ref: 'fs.files' });
      assert.deepEqual(schema.solution_summary, { type: fakeObjectId, ref: 'fs.files' });
      assert.deepEqual(options, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
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

    const target = proxyquire('./application-version-model', { mongoose: fakeMongoose });

    assert.equal(target, 'ApplicationVersion:fakeSchema');

    timekeeper.reset();

  });

});
