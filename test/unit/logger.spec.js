const test = require('tape');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

const stubBunyan = (sandbox) => {
  const bunyanStub = sandbox.stub();
  bunyanStub.createLogger = sandbox.stub();
  bunyanStub.level = sandbox.stub();
  bunyanStub.createLogger.returns({ level: sandbox.stub() });

  bunyanStub.stdSerializers = {
    req: 'req',
    err: 'err',
  };
  bunyanStub.FATAL = 100;
  return bunyanStub;
}

test('that a bunyan logged is instantiated', (t) => {

  const sandbox = sinon.sandbox.create();

  const bunyanStub = stubBunyan(sandbox);

  const logger = proxyquire('../../src/logger', {
    'bunyan': bunyanStub
  });

  sinon.assert.calledOnce(bunyanStub.createLogger);

  t.equal(bunyanStub.createLogger.args[0][0].name, 'version-service');
  t.equal(bunyanStub.createLogger.args[0][0].streams[0].level, 'INFO');

  t.end();
});
