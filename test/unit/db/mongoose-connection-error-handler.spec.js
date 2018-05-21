const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

test('connections are cleared up on error', (t) => {
  const sandbox = sinon.sandbox.create();

  const errorHandler = proxyquire('../../../src/db/mongoose-connection-error-handler', {
  });

  const loggerStub = sandbox.stub();
  loggerStub.toInvestigateTomorrow = sandbox.stub();

  const connection1Stub = sandbox.stub();
  connection1Stub.on = sandbox.stub();

  const connection2Stub = sandbox.stub();
  connection2Stub.on = sandbox.stub();

  const connections = [
    connection1Stub,
    connection2Stub,
  ];

  errorHandler(loggerStub, connections);

  t.equals(connection1Stub.on.callCount, 2);
  t.equals(connection1Stub.on.args[0][0], 'error');
  t.equals(connection1Stub.on.args[1][0], 'disconnected');

  t.equals(connection2Stub.on.callCount, 2);

  t.end();
});
