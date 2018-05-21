const test = require('tape');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

test('that requests are logged correctly', (t) => {

  process.env.npm_package_name = 'myService';

  const sandbox = sinon.sandbox.create();
  const loggerStub = sandbox.stub();
  loggerStub.trace = sandbox.stub();
  loggerStub.info = sandbox.stub();
  loggerStub._logger = {
    fields: sandbox.stub(),
  };

  const requestId = proxyquire('../../src/request-logger', {
    './logger': loggerStub
  });

  const reqStub = sandbox.stub();
  const resStub = sandbox.stub();
  const nextStub = sandbox.stub();

  reqStub.on = sandbox.stub();

  requestId(reqStub, resStub, nextStub);

  sinon.assert.calledOnce(nextStub);

  t.end();
});
