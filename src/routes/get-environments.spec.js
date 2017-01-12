const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

test('get environments', t => {

  t.test('should build query from whitelist', assert => {

    assert.plan(1);

    const fakeReq = { query: {} };

    const expectedWhitelist = [
      'environment',
      'date',
    ];

    const target = proxyquire('./get-environments', {
      '../db/helpers': {
        buildQuery: (whitelist) => {
          assert.deepEqual(whitelist, expectedWhitelist);

          return () => ({});
        },
        buildProjection: () => () => {
        },
      },
      '../db/environment-reader': {
        getEnvironments: () => Promise.resolve(),
      },
    });

    target(fakeReq);

  });

  t.test('should build projection from whitelist', assert => {

    assert.plan(1);

    const fakeReq = { query: {} };

    const expectedWhitelist = [
      'environment',
    ];

    const target = proxyquire('./get-environments', {
      '../db/helpers': {
        buildProjection: (whitelist) => {
          assert.deepEqual(whitelist, expectedWhitelist);

          return () => ({});
        },
        buildQuery: () => () => {
        },
      },
      '../db/environment-reader': {
        getEnvironments: () => Promise.resolve(),
      },
    });

    target(fakeReq);

  });

  t.test('should send results from environment reader', assert => {

    assert.plan(5);

    const fakeReq = { query: { fields: 'fake fields' } };
    const fakeRes = { send: sinon.spy() };

    const fakeQuery = 'fake query';
    const fakeProjection = 'fake projection';
    const fakeResults = 'fake results';

    const target = proxyquire('./get-environments', {
      '../db/helpers': {
        buildQuery: () => query => {
          assert.deepEqual(query, fakeReq.query);

          return fakeQuery;
        },
        buildProjection: () => fields => {
          assert.deepEqual(fields, fakeReq.query.fields);

          return fakeProjection;
        },
      },
      '../db/environment-reader': {
        getEnvironments: (query, projection) => {
          assert.equal(query, fakeQuery);
          assert.equal(projection, fakeProjection);

          return Promise.resolve(fakeResults);
        },
      },
    });

    target(fakeReq, fakeRes);

    setImmediate(() => {
      assert.true(fakeRes.send.calledWithExactly(fakeResults));
    });

  });

});
