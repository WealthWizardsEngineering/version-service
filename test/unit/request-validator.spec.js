const test = require('tape');
const requestValidator = require('../../src/request-validator');
const httpMocks = require('node-mocks-http');
const Joi = require('joi');
const ApiError = require('../../src/api-error');

const setupRouteParams = (queryId) => {
  const req = httpMocks.createRequest({
    method: 'GET',
    url: '/some/resource/',
    query: {
      id: queryId,
    },
  });
  const res = httpMocks.createResponse();

  return { req, res };
};

test('Request validator', t => {
  t.test('Check that when no schema is passed an error is thrown', assert => {
    const { req, res } = setupRouteParams('string');
    const next = () => {};

    assert.throws(() => requestValidator()(req, res, next), Error, 'No route schema provided.');

    assert.end();
  });

  t.test('Check that when the route matches the schema no errors are thrown or passed to next()', assert => { // eslint-disable-line max-len
    const schema = {
      query: {
        id: Joi.string().required(),
      },
    };

    const { req, res } = setupRouteParams('string');
    const next = (message) => {
      assert.equal(message instanceof Error, false, 'No Error passed in next.');
      assert.equal(message, undefined, 'Nothing returned from next.');
    };

    assert.doesNotThrow(() => requestValidator(schema)(req, res, next), Error, 'No route schema provided.'); // eslint-disable-line max-len

    assert.end();
  });

  t.test('Check that when the route doesn\'t match the schema no errors are thrown or but an error is passed to next()', assert => { // eslint-disable-line max-len
    const schema = {
      query: {
        id: Joi.string().required(),
      },
    };

    const { req, res } = setupRouteParams(15);
    const next = (message) => {
      assert.equal(message instanceof ApiError, true, 'ApiError passed in next.');
      assert.equal(message.message, 'Invalid route parameters provided. See the error object for more details.', 'Error string returned within ApiError in next().'); // eslint-disable-line max-len
    };

    assert.doesNotThrow(() => requestValidator(schema)(req, res, next), Error, 'No route schema provided.'); // eslint-disable-line max-len

    assert.end();
  });
});
