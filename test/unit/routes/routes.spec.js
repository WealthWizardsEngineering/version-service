const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();

test('routes', (t) => {

  t.test('creates a POST route for /v1/version', assert => {

    assert.plan(3);

    const fakeApp = {
      post: (route, ...middleware) => {
        assert.equal(route, '/v1/version');
        assert.deepEqual(middleware[0], { body: 'create-application-version-validation' }, 'create application version validation correct');
        assert.equal(middleware[1], 'create-application-version');
      },
      get: () => {},
    };

    const target = proxyquire('../../../src/routes/', {
      '../rules/create-application-version-validation': 'create-application-version-validation',
      './create-application-version': 'create-application-version',
      'ww-validation': {
        requestValidator: (rule) => rule
      }
    });

    target(fakeApp);

  });

  t.test('creates a GET route for /v1/version', assert => {

    assert.plan(2);

    const fakeApp = {
      post: () => {},
      get: (route, ...middleware) => {
        if (route === '/v1/version') {
          assert.equal(route, '/v1/version');
          assert.equal(middleware[1], 'get-application-versions');
        }
      },
    };

    const target = proxyquire('../../../src/routes/', {
      './get-application-versions': 'get-application-versions',
    });

    target(fakeApp);

  });

  t.test('creates a GET route for /v1/environment', assert => {

    assert.plan(2);

    const fakeApp = {
      post: () => {},
      get: (route, ...middleware) => {
        if (route === '/v1/environment') {
          assert.equal(route, '/v1/environment');
          assert.equal(middleware[1], 'get-environments');
        }
      },
    };

    const target = proxyquire('../../../src/routes/', {
      './get-environments': 'get-environments',
    });

    target(fakeApp);

  });

  t.test('creates a GET route for /v1/environment/:id', assert => {

    assert.plan(2);

    const fakeApp = {
      post: () => {},
      get: (route, ...middleware) => {
        if (route === '/v1/environment/:id') {
          assert.equal(route, '/v1/environment/:id');
          assert.equal(middleware[1], 'get-environment');
        }
      },
    };

    const target = proxyquire('../../../src/routes/', {
      './get-environment': 'get-environment',
    });

    target(fakeApp);

  });

});
