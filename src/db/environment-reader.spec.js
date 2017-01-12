const test = require('tape');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

test('getEnvironments', t => {

  t.test('should pass query and projection ', assert => {

    assert.plan(1);

    const fakeQuery = 'fake query';
    const fakeProjection = 'fake projection';

    const thenSpy = sinon.spy()
    const execSpy = sinon.stub().returns({ then: thenSpy });
    const distinctStub = sinon.stub().withArgs('application_name').returns({ exec: execSpy });
    const findStub = sinon.stub().withArgs(fakeQuery).returns({ distinct: distinctStub });

    const applicationVersionStub = {
      find: findStub,
    };

    const { getEnvironments } = proxyquire('./environment-reader', { './application-version-model': applicationVersionStub });
    const target = getEnvironments;

    target(fakeQuery, fakeProjection);

    // assert.true(thenSpy.calledWithExactly());
    assert.true(execSpy.calledOnce);

  });

});

// test('getApplicationVersion', t => {
//
//   t.test('should find by id', assert => {
//
//     assert.plan(2);
//
//     const fakeId = 'fake id';
//
//     const execSpy = sinon.spy();
//     const findStub = sinon.stub().withArgs(fakeId).returns({ exec: execSpy });
//
//     applicationVersionStub = {
//       findById: findStub,
//     };
//
//     const { getApplicationVersion } = proxyquire('./application-version-reader', { './application-version-model': applicationVersionStub });
//     const target = getApplicationVersion;
//
//     target(fakeId);
//
//     assert.true(execSpy.calledWithExactly());
//     assert.true(execSpy.calledOnce);
//
//   });
//
// });
