const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();

test('querystring validation', assert => {

  assert.plan(1);

  const fakeJoi = {
    object: () => ({
      keys: (keys) => keys,
    }),
    string: () => 'string',
  };

  const target = proxyquire('./querystring-validation', { 'joi': fakeJoi });

  const expectedKeys = {
    _id: 'string',
    fact_find_id: 'string',
    fields: 'string',
  };

  assert.deepEqual(target, expectedKeys);

});