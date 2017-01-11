const test = require('tape');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

test('application version creator', t => {

  t.test('should create a new application version model and call save', assert => {

    assert.plan(5);

    const fakeData = {
      environment: 'a fake environment',
      application_name: 'a fake application name',
      version: 'a fake version',
    };

    const fakeSave = sinon.spy();

    function applicationVersionStub(schema) {
      assert.equal(schema.environment, fakeData.environment);
      assert.equal(schema.application_name, fakeData.application_name);
      assert.equal(schema.version, fakeData.version);

      this.save = fakeSave;
    }

    const target = proxyquire('./application-version-creator', { './application-version-model': applicationVersionStub });

    target(fakeData);

    assert.true(fakeSave.calledWithExactly());
    assert.true(fakeSave.calledOnce);

  });

});
