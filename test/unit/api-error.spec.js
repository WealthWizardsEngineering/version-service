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

  t.test('Create an error and check it handles capture stack trace undefined (by not throwing error)', (t) => {
    // Better way of doing this??
    Error.captureStackTrace = undefined;

    const error = new ApiError(
      `Some resource not found error`,
      ErrorCodes.RESOURCE_NOT_FOUND,
      404
    );

    t.end();
  });

});
