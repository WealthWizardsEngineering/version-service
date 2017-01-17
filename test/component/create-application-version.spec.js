const test = require('tape');
const request = require('supertest');
const { app } = require('../../src/server');
const ApplicationVersion = require('../../src/db/application-version-model');
const clearDownApplicationVersionDB = () => ApplicationVersion.remove();
const applicationVersionReader = require('../../src/db/application-version-reader');
const jwt = require('jsonwebtoken');
const env = require('../../src/env-vars');
const Joi = require('joi');

test('create application versions', (t) => {

  t.test('should create an application version correctly', assert => {

    assert.plan(6);

    const fakeApplicationVersion = { environment: 'environmenta', application_name: 'application_namea', version: 'versiona', product: 'producta' };

    clearDownApplicationVersionDB()
      .then(() => {
        request(app)
          .post('/version-service/v1/version')
          .send(fakeApplicationVersion)
          .end((err, res) => {
            assert.equal(res.status, 201);
            assert.ok(res.body.id);
            applicationVersionReader.getApplicationVersion(res.body.id)
              .then((result) => {
                assert.equal(result.environment, fakeApplicationVersion.environment);
                assert.equal(result.application_name, fakeApplicationVersion.application_name);
                assert.equal(result.version, fakeApplicationVersion.version);
                assert.equal(result.product, fakeApplicationVersion.product);
              });
          });
      });

  });

});
