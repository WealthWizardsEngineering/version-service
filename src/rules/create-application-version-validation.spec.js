const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();

test('create application version validation', t => {

  t.test('creates a Joi validation object', assert => {

    assert.plan(1);

    const fakeJoi = {
      object: () => ({
        keys: (keys) => keys
      }),
      string: () => ({
        required: () => 'string:required',
        optional: () => 'string:optional',
      }),
    };

    const target = proxyquire('./create-application-version-validation', { 'joi': fakeJoi });

    const expectedKeys = {
      environment: 'string:required',
      application_name: 'string:required',
      version: 'string:required',
      product: 'string:optional',
    };

    assert.deepEqual(target, expectedKeys);

  });

});
