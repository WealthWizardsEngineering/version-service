const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

test('get environment', t => {

  t.test('should build query from whitelist', assert => {
    assert.plan(1);

    const fakeId = 'fake id';
    const fakeReq = {
      query: {},
      params: {
        id: fakeId,
      },
    };
    const fakeRes = { send: sinon.spy() };

    const expectedWhitelist = [
      'date',
      'product',
    ];

    const target = proxyquire('../../../src/routes/get-environment', {
      '../db/helpers': {
        buildQuery: (whitelist) => {
          assert.deepEqual(whitelist, expectedWhitelist);

          return () => ({});
        },
        buildProjection: () => () => {
        },
      },
      '../db/environment-reader': {
        getEnvironment: () => Promise.resolve(),
      },
    });

    target(fakeReq, fakeRes);
  });

  t.test('should build projection from whitelist', assert => {
    assert.plan(1);

    const fakeId = 'fake id';
    const fakeReq = {
      query: {},
      params: {
        id: fakeId,
      },
    };
    const fakeRes = { send: sinon.spy() };

    const expectedWhitelist = [
    ];

    const target = proxyquire('../../../src/routes/get-environment', {
      '../db/helpers': {
        buildProjection: (whitelist) => {
          assert.deepEqual(whitelist, expectedWhitelist);

          return () => ({});
        },
        buildQuery: () => () => {
        },
      },
      '../db/environment-reader': {
        getEnvironment: () => Promise.resolve(),
      },
    });

    target(fakeReq, fakeRes);

  });

  t.test('should send results from environment reader', assert => {
    assert.plan(6);

    const fakeId = 'fake id';
    const fakeReq = {
      query: {},
      params: {
        id: fakeId,
      },
    };
    const fakeRes = { send: sinon.spy() };

    const fakeQuery = 'fake query';
    const fakeProjection = 'fake projection';
    const fakeResults = 'fake results';

    const target = proxyquire('../../../src/routes/get-environment', {
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
        getEnvironment: (query, projection, id) => {
          assert.equal(query, fakeQuery);
          assert.equal(projection, fakeProjection);
          assert.equal(id, fakeId);

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
