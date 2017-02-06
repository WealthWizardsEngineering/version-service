const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

test('get environments', assert => {
  assert.plan(1);

  const fakeResults = 'fake results';
  const fakeReq = {};
  const fakeRes = { send: sinon.spy() };

  const target = proxyquire('../../../src/routes/get-environments', {
    '../db/environment-reader': {
      getEnvironments: () => Promise.resolve(fakeResults),
    },
  });

  target(fakeReq, fakeRes);

  setImmediate(() => {
    assert.true(fakeRes.send.calledWithExactly(fakeResults));
  });
});
