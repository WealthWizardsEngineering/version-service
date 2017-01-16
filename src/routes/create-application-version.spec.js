const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

test('create application version', (t) => {

  t.test('returns a 201 and created data on create application version success', (t) => {

    t.plan(3);

    const fakeSend = sinon.spy();
    const fakeStatus = sinon.stub();
    fakeStatus.withArgs(201).returns({ send: fakeSend });
    const fakeResult = { id: 'fake data id' };
    const fakeReq = {
      body: 'fake body'
    };
    const fakeRes = {
      status: fakeStatus
    };
    const fakeNext = sinon.spy();

    const target = proxyquire('./create-application-version', {
      '../db/application-version-creator': (body) => {
        t.equal(body, fakeReq.body);
        return Promise.resolve(fakeResult)
      }
    });

    target(fakeReq, fakeRes, fakeNext);

    setImmediate(() => {
      t.assert(fakeSend.calledWithExactly({ id: fakeResult.id }));
      t.assert(fakeNext.neverCalledWith());
    });

  });

  t.test('calls next with Internal Server Error on create application version failure', (t) => {

    t.plan(1);

    const fakeReq = {};
    const fakeRes = {};
    const fakeNext = sinon.spy();

    function fakeApiError(message, code, other) {
      this.error = `${message}:${code}:${other}`;
    }

    const fakeInternalServerError = 'fake internal server error';

    const target = proxyquire('./create-application-version', {
      '../db/application-version-creator': () => {
        return Promise.reject()
      },
      'ww-utils': {
        ErrorCodes: { INTERNAL_SERVER_ERROR: fakeInternalServerError },
        ApiError: fakeApiError
      },
    });

    target(fakeReq, fakeRes, fakeNext)

    setImmediate(() => {
      t.assert(fakeNext.calledWithExactly(sinon.match((e) => e.error === `Internal server error:${fakeInternalServerError}:500`)));
    });

  })

});
