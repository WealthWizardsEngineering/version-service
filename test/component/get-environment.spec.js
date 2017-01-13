const test = require('tape');
const request = require('supertest');
const { app } = require('../../src/server');
const ApplicationVersion = require('../../src/db/application-version-model');
const clearDownApplicationVersionDB = () => ApplicationVersion.remove();
const applicationVersionCreator = require('../../src/db/application-version-creator');
const jwt = require('jsonwebtoken');
const env = require('../../src/env-vars');
const Joi = require('joi');

test('get environment', (t) => {

  t.test('should return versions in the given environment', assert => {

    assert.plan(3);

    const fakeApplicationVersionA = { environment: 'environmenta', application_name: 'application_namea', version: 'versiona' };
    const fakeApplicationVersionB = { environment: 'environmentb', application_name: 'application_nameb', version: 'versionb' };

    clearDownApplicationVersionDB()
      .then(() => applicationVersionCreator(fakeApplicationVersionA))
      .then(() => applicationVersionCreator(fakeApplicationVersionB))
      .then(() => {
        request(app)
          .get('/version-service/v1/environment/environmentb')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.length, 1);

            const results = res.body.map(({ application_name, version }) => ({ application_name, version }));

            assert.deepEqual(results, [ { application_name: 'application_nameb', version: 'versionb' } ]);
          });
      });

  });

});
