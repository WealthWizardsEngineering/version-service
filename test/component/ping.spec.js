const test = require('tape');
const request = require('supertest');

const { app } = require('../../src/server');

test('ping wired in', assert => {

  assert.plan(2);

  request(app)
    .get('/version-service/ping')
    .expect(200)
    .end((err, res) => {
      assert.true(typeof res.body.name === 'string', 'Body Name is a string');
      assert.true(typeof res.body.version === 'string', 'Body version is a string');
    });
});
