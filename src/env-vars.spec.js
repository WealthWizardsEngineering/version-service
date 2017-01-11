const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

test('that env vars are validated', (t) => {
  const envalidStub = sinon.stub();
  envalidStub.str = sinon.stub().returns('str');
  envalidStub.num = sinon.stub().returns('num');
  envalidStub.bool = sinon.stub().returns('bool');
  envalidStub.cleanEnv = sinon.stub();

  proxyquire('./env-vars', {
    envalid: envalidStub,
    './logger': { info: () => {} },
  });

  t.deepEquals(envalidStub.cleanEnv.args[0][1], {
    PORT: 'num',
    MONGODB_URL: 'str',
  });

  t.end();
});
