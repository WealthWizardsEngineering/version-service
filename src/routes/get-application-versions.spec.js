const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

test('get application versions', t => {

  t.test('should build query from whitelist', assert => {

    assert.plan(1);

    const fakeReq = { query: {} };

    const expectedWhitelist = [
      '_id',
      'environment',
      'application_name',
    ];

    const target = proxyquire('./get-application-versions', {
      '../db/helpers': {
        buildQuery: (whitelist) => {
          assert.deepEqual(whitelist, expectedWhitelist);

          return () => ({});
        },
        buildProjection: () => () => {
        },
      },
      '../db/application-version-reader': {
        getApplicationVersions: () => Promise.resolve(),
      },
    });

    target(fakeReq);

  });

  t.test('should build projection from whitelist', assert => {

    assert.plan(1);

    const fakeReq = { query: {} };

    const expectedWhitelist = [
      '_id',
      'environment',
      'application_name',
      'version',
      'date',
      'updated_at',
    ];

    const target = proxyquire('./get-application-versions', {
      '../db/helpers': {
        buildProjection: (whitelist) => {
          assert.deepEqual(whitelist, expectedWhitelist);

          return () => ({});
        },
        buildQuery: () => () => {
        },
      },
      '../db/application-version-reader': {
        getApplicationVersions: () => Promise.resolve(),
      },
    });

    target(fakeReq);

  });

  t.test('should send results from application version reader', assert => {

    assert.plan(5);

    const fakeReq = { query: { fields: 'fake fields' } };
    const fakeRes = { send: sinon.spy() };

    const fakeQuery = 'fake query';
    const fakeProjection = 'fake projection';
    const fakeResults = 'fake results';

    const target = proxyquire('./get-application-versions', {
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
      '../db/application-version-reader': {
        getApplicationVersions: (query, projection) => {
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
