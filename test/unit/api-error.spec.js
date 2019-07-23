const test = require('tape');
const sinon = require('sinon');
const ApiError = require('../../src/api-error')
const ErrorCodes = require('../../src/error-codes')

test('Error codes', (t) => {

  t.test('Create an ApiError verify it\'s an (child) instance of Error', (t) => {
    const error = new ApiError(
      `Some resource not found error`,
      ErrorCodes.RESOURCE_NOT_FOUND,
      404
    );

    t.equal(error instanceof ApiError, true, 'ApiError is (child) instance of Error');

    t.end();
  });
});
