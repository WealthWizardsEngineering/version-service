const test = require('tape');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

test('getSolutions', t => {

  t.test('should pass query and projection ', assert => {

    assert.plan(2);

    const fakeQuery = 'fake query';
    const fakeProjection = 'fake projection';

    const execSpy = sinon.spy();
    const selectStub = sinon.stub().withArgs(fakeProjection).returns({ exec: execSpy });
    const sortStub = sinon.stub().withArgs({ update_at: 'desc' }).returns({ select: selectStub });
    const findStub = sinon.stub().withArgs(fakeQuery).returns({ sort: sortStub });

    const solutionStub = {
      find: findStub,
    };

    const { getSolutions } = proxyquire('./solution-reader', { './application-version-model': solutionStub });
    const target = getSolutions;

    target(fakeQuery, fakeProjection);

    assert.true(execSpy.calledWithExactly());
    assert.true(execSpy.calledOnce);

  });

});

test('getSolution', t => {

  t.test('should find by id', assert => {

    assert.plan(2);

    const fakeId = 'fake id';

    const execSpy = sinon.spy();
    const findStub = sinon.stub().withArgs(fakeId).returns({ exec: execSpy });

    const solutionStub = {
      findById: findStub,
    };

    const { getSolution } = proxyquire('./solution-reader', { './application-version-model': solutionStub });
    const target = getSolution;

    target(fakeId);

    assert.true(execSpy.calledWithExactly());
    assert.true(execSpy.calledOnce);

  });

});
