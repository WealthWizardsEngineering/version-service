const test = require('tape');
const request = require('supertest');
const { app } = require('../../src/server');
const Solution = require('../../src/db/solution-model');
const clearDownSolutionDB = () => Solution.remove();
const solutionCreator = require('../../src/db/solution-creator');
const jwt = require('jsonwebtoken');
const env = require('../../src/env-vars');
const Joi = require('joi');

test('get solutions', (t) => {

  t.test('should return all solutions sorted by updated-at desc', assert => {

    assert.plan(3);

    const fakeSolutionA = { fact_find_id: 'ffa', solution: { id: 'fake solution a' } };
    const fakeSolutionB = { fact_find_id: 'ffb', solution: { id: 'fake solution b' } };

    clearDownSolutionDB()
      .then(() => solutionCreator(fakeSolutionA))
      .then(() => solutionCreator(fakeSolutionB))
      .then(() => {
        request(app)
          .get('/version-service/v1/solution')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.length, 2);

            const results = res.body.map(({ fact_find_id, solution }) => ({ fact_find_id, solution }));

            assert.deepEqual(results, [ fakeSolutionB, fakeSolutionA ]);
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
  //         .get('/solution-service/v1/solution')
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
  //         .get('/solution-service/v1/solution')
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
