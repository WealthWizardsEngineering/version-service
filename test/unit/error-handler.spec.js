const test = require('tape');
const sinon = require('sinon');

test('that an error is logged when status code is > 0', (t) => {

  const sandbox = sinon.sandbox.create();

  const errorHandler = require('../../src/error-handler');

  const errStub = sandbox.stub();
  const reqStub = sandbox.stub();
  const resStub = sandbox.stub();
  const nextStub = sandbox.stub();

  errStub.statusCode = 500;
  errStub.code = 'CODE';
  errStub.message = 'message';
  errStub.moreInfo = 'moreInfo';
  errStub.source = 'source';

  resStub.status = (status) => {
    t.equal(status, 500);
    return resStub;
  };
  resStub.send = sandbox.stub();
  resStub.json = sandbox.stub();

  const debugStub = sandbox.stub();
  const infoStub = sandbox.stub();
  const warnStub = sandbox.stub();

  reqStub.uuid = '12345';
  reqStub.log = {
    debug: debugStub,
    info: infoStub,
    warn: warnStub,
    level: 'INFO',
  };

  errorHandler(errStub, reqStub, resStub, nextStub);

  sinon.assert.calledOnce(reqStub.log.info);
  t.equal(reqStub.log.info.args[0][0], 'message');
  t.deepEqual(resStub.json.args[0][0], {
    id: '12345',
    statusCode: 500,
    code: 'CODE',
    message: 'message',
    moreInfo: 'moreInfo',
    source: 'source',
  });

  t.end();
});

test('that an error is logged when status code = 0', (t) => {

  const sandbox = sinon.sandbox.create();

  const errorHandler = require('../../src/error-handler');

  const errStub = sandbox.stub();
  const reqStub = sandbox.stub();
  const resStub = sandbox.stub();
  const nextStub = sandbox.stub();

  errStub.statusCode = 0;
  errStub.code = 'CODE';
  errStub.message = 'message';
  errStub.moreInfo = 'moreInfo';
  errStub.source = 'source';

  resStub.status = (status) => {
    t.equal(status, 500);
    return resStub;
  };
  resStub.send = sandbox.stub();
  resStub.json = sandbox.stub();

  const debugStub = sandbox.stub();
  const infoStub = sandbox.stub();
  const errorStub = sandbox.stub();
  const warnStub = sandbox.stub();

  reqStub.uuid = '12345';
  reqStub.log = {
    debug: debugStub,
    info: infoStub,
    error: errorStub,
    warn: warnStub,
    level: 'DEBUG'
  };

  errorHandler(errStub, reqStub, resStub, nextStub);

  sinon.assert.calledOnce(reqStub.log.warn);
  t.deepEqual(reqStub.log.warn.args[0][0], { err: errStub });
  t.deepEqual(resStub.send.args[0][0], 'Service unavailable :(');

  t.end();
});
