const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();

test('routes', (t) => {

  t.test('creates a GET route for /v1/solution', assert => {

    assert.plan(2);

    const fakeApp = {
      get: (route, ...middleware) => {
        assert.equal(route, '/v1/solution');

        assert.equal(middleware[1], 'get-solutions');
      },
    };

    const target = proxyquire('./', {
      './get-solutions': 'get-solutions',
    });

    target(fakeApp);

  });

});
