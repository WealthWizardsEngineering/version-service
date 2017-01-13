const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();

test('routes', (t) => {

  t.test('creates a GET route for /v1/version', assert => {

    assert.plan(2);

    const fakeApp = {
      get: (route, ...middleware) => {
        if (route === '/v1/version') {
          assert.equal(route, '/v1/version');
          assert.equal(middleware[1], 'get-application-versions');
        }
      },
    };

    const target = proxyquire('./', {
      './get-application-versions': 'get-application-versions',
    });

    target(fakeApp);

  });

  t.test('creates a GET route for /v1/environment', assert => {

    assert.plan(2);

    const fakeApp = {
      get: (route, ...middleware) => {
        if (route === '/v1/environment') {
          assert.equal(route, '/v1/environment');
          assert.equal(middleware[1], 'get-environments');
        }
      },
    };

    const target = proxyquire('./', {
      './get-environments': 'get-environments',
    });

    target(fakeApp);

  });

  t.test('creates a GET route for /v1/environment/:id', assert => {

    assert.plan(2);

    const fakeApp = {
      get: (route, ...middleware) => {
        if (route === '/v1/environment/:id') {
          assert.equal(route, '/v1/environment/:id');
          assert.equal(middleware[1], 'get-environment');
        }
      },
    };

    const target = proxyquire('./', {
      './get-environment': 'get-environment',
    });

    target(fakeApp);

  });

});
