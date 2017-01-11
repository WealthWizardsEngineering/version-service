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

  t.test('should return all application versions sorted by updated-at desc', assert => {

    assert.plan(3);

    const fakeApplicationVersionA = { fact_find_id: 'ffa', solution: { id: 'fake solution a' } };
    const fakeApplicationVersionB = { fact_find_id: 'ffb', solution: { id: 'fake solution b' } };

    clearDownApplicationVersionDB()
      .then(() => applicationVersionCreator(fakeApplicationVersionA))
      .then(() => applicationVersionCreator(fakeApplicationVersionB))
      .then(() => {
        request(app)
          .get('/version-service/v1/version')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.length, 2);

            const results = res.body.map(({ fact_find_id, solution }) => ({ fact_find_id, solution }));

            assert.deepEqual(results, [ fakeApplicationVersionB, fakeApplicationVersionA ]);
          });
      });

  });
  //
  // t.test('should return all solutions with matching fact_find_id', assert => {
  //
  //   assert.plan(3);
  //
  //   const fakeSolutions = [
  //     { fact_find_id: 'ffa', solution: { id: 'fake solution a' } },
  //     { fact_find_id: 'ffb', solution: { id: 'fake solution b' } },
  //     { fact_find_id: 'ffc', solution: { id: 'fake solution c' } },
  //   ];
  //
  //   const token = jwt.sign({}, env.JWT_SECRET);
  //
  //   clearDownSolutionDB()
  //     .then(() => Promise.all(fakeSolutions.map(x => solutionCreator(x))))
  //     .then(() => {
  //       request(app)
  //         .get('/solution-service/v1/version')
  //         .query({ fact_find_id: 'ffa,ffc' })
  //         .set('Authorization', `Bearer ${token}`)
  //         .end((err, res) => {
  //           assert.equal(res.status, 200);
  //           assert.equal(res.body.length, 2);
  //
  //           const results = res.body.map(({ fact_find_id, solution }) => ({ fact_find_id, solution }));
  //
  //           const expectedSolutions = [fakeSolutions[2], fakeSolutions[0]];
  //
  //           assert.deepEqual(results, expectedSolutions);
  //         });
  //     });
  //
  // });
  //
  // t.test('should only return specified fields', assert => {
  //
  //   assert.plan(3);
  //
  //   const fakeSolutions = [
  //     { fact_find_id: 'ffa', solution: { id: 'fake solution a' } },
  //     { fact_find_id: 'ffb', solution: { id: 'fake solution b' } },
  //     { fact_find_id: 'ffc', solution: { id: 'fake solution c' } },
  //   ];
  //
  //   const token = jwt.sign({}, env.JWT_SECRET);
  //
  //   clearDownSolutionDB()
  //     .then(() => Promise.all(fakeSolutions.map(x => solutionCreator(x))))
  //     .then(() => {
  //       request(app)
  //         .get('/solution-service/v1/version')
  //         .query({ fields: 'fact_find_id' })
  //         .set('Authorization', `Bearer ${token}`)
  //         .end((err, res) => {
  //           assert.equal(res.status, 200);
  //           assert.equal(res.body.length, 3);
  //
  //           const results = res.body;
  //
  //           assert.true(Joi.validate(results, Joi.array().items(
  //             Joi.object().keys({
  //               _id: Joi.string(),
  //               fact_find_id: Joi.string(),
  //             }))));
  //         });
  //     });
  //
  // });

});
