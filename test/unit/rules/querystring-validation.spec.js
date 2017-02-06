const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();

test('querystring validation', assert => {

  assert.plan(1);

  const fakeDate = {
    iso: () => 'iso',
  };

  const fakeJoi = {
    object: () => ({
      keys: (keys) => keys,
    }),
    string: () => 'string',
    date: () => fakeDate,
  };

  const target = proxyquire('../../../src/rules/querystring-validation', { 'joi': fakeJoi });

  const expectedKeys = {
    _id: 'string',
    environment: 'string',
    application_name: 'string',
    fields: 'string',
    date: 'iso',
    product: 'string',
  };

  assert.deepEqual(target, expectedKeys);

});
