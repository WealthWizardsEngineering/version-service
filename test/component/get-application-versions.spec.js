const test = require('tape');
const request = require('supertest');
const { app } = require('../../src/server');
const ApplicationVersion = require('../../src/db/application-version-model');
const clearDownApplicationVersionDB = () => ApplicationVersion.remove();
const applicationVersionCreator = require('../../src/db/application-version-creator');
const jwt = require('jsonwebtoken');
const env = require('../../src/env-vars');
const Joi = require('joi');

test('get application versions', (t) => {

  t.test('should return all application versions sorted by date desc', assert => {

    assert.plan(3);

    const fakeApplicationVersionA = { environment: 'environmenta', application_name: 'application_namea', version: 'versiona', product: 'producta' };
    const fakeApplicationVersionB = { environment: 'environmentb', application_name: 'application_nameb', version: 'versionb', product: 'productb' };

    clearDownApplicationVersionDB()
      .then(() => applicationVersionCreator(fakeApplicationVersionA))
      .then(() => applicationVersionCreator(fakeApplicationVersionB))
      .then(() => {
        request(app)
          .get('/version-service/v1/version')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.length, 2);

            const results = res.body.map(({ environment, application_name, version, product }) => ({ environment, application_name, version, product }));

            assert.deepEqual(results, [ fakeApplicationVersionB, fakeApplicationVersionA ]);
          });
      });

  });

  t.test('should return all application versions with matching environment', assert => {

    assert.plan(3);

    const fakeApplicationVersions = [
      { environment: 'environmenta', application_name: 'application_namea', version: 'versiona', product: 'producta' },
      { environment: 'environmentb', application_name: 'application_nameb', version: 'versionb', product: 'productb' },
      { environment: 'environmentc', application_name: 'application_namec', version: 'versionc', product: 'productc' },
    ];

    clearDownApplicationVersionDB()
      .then(() => Promise.all(fakeApplicationVersions.map(x => applicationVersionCreator(x))))
      .then(() => {
        request(app)
          .get('/version-service/v1/version')
          .query({ environment: 'environmenta,environmentc' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.length, 2);

            const results = res.body.map(({ environment, application_name, version, product }) => ({ environment, application_name, version, product }));

            const expectedSolutions = [fakeApplicationVersions[2], fakeApplicationVersions[0]];

            assert.deepEqual(results, expectedSolutions);
          });
      });

  });

  t.test('should only return specified fields', assert => {

    assert.plan(3);

    const fakeApplicationVersions = [
      { environment: 'environmenta', application_name: 'application_namea', version: 'versiona', product: 'producta' },
      { environment: 'environmentb', application_name: 'application_nameb', version: 'versionb', product: 'productb' },
      { environment: 'environmentc', application_name: 'application_namec', version: 'versionc', product: 'productc' },
    ];

    clearDownApplicationVersionDB()
      .then(() => Promise.all(fakeApplicationVersions.map(x => applicationVersionCreator(x))))
      .then(() => {
        request(app)
          .get('/version-service/v1/version')
          .query({ fields: 'environment' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.length, 3);

            const results = res.body;

            assert.true(Joi.validate(results, Joi.array().items(
              Joi.object().keys({
                _id: Joi.string(),
                environment: Joi.string(),
              }))));
          });
      });

  });

});
