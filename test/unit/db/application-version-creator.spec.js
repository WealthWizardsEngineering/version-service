const test = require('tape');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

test('application version creator', t => {

  t.test('should create a new application version model and call save', assert => {

    assert.plan(6);

    const fakeData = {
      environment: 'a fake environment',
      application_name: 'a fake application name',
      version: 'a fake version',
      product: 'a fake product',
    };

    const fakeSave = sinon.spy();

    function applicationVersionStub(schema) {
      assert.equal(schema.environment, fakeData.environment);
      assert.equal(schema.application_name, fakeData.application_name);
      assert.equal(schema.version, fakeData.version);
      assert.equal(schema.product, fakeData.product);

      this.save = fakeSave;
    }

    const target = proxyquire('../../../src/db/application-version-creator', { './application-version-model': applicationVersionStub });

    target(fakeData);

    assert.true(fakeSave.calledWithExactly());
    assert.true(fakeSave.calledOnce);

  });

});
