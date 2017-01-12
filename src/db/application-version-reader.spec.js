const test = require('tape');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

test('getApplicationVersions', t => {

  t.test('should pass query and projection ', assert => {

    assert.plan(2);

    const fakeQuery = 'fake query';
    const fakeProjection = 'fake projection';

    const execSpy = sinon.spy();
    const selectStub = sinon.stub().withArgs(fakeProjection).returns({ exec: execSpy });
    const sortStub = sinon.stub().withArgs({ date: 'desc' }).returns({ select: selectStub });
    const findStub = sinon.stub().withArgs(fakeQuery).returns({ sort: sortStub });

    const applicationVersionStub = {
      find: findStub,
    };

    const { getApplicationVersions } = proxyquire('./application-version-reader', { './application-version-model': applicationVersionStub });
    const target = getApplicationVersions;

    target(fakeQuery, fakeProjection);

    assert.true(execSpy.calledWithExactly());
    assert.true(execSpy.calledOnce);

  });

});

test('getApplicationVersion', t => {

  t.test('should find by id', assert => {

    assert.plan(2);

    const fakeId = 'fake id';

    const execSpy = sinon.spy();
    const findStub = sinon.stub().withArgs(fakeId).returns({ exec: execSpy });

    applicationVersionStub = {
      findById: findStub,
    };

    const { getApplicationVersion } = proxyquire('./application-version-reader', { './application-version-model': applicationVersionStub });
    const target = getApplicationVersion;

    target(fakeId);

    assert.true(execSpy.calledWithExactly());
    assert.true(execSpy.calledOnce);

  });

});
