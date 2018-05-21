const test = require('tape');
const ErrorCodes = require('../../src/error-codes.js');

test('Error codes', (t) => {

  t.test('Create an error code and verify it\'s message is correct', (t) => {

    const errorCode = new ErrorCodes('An error Code');
    t.equal(errorCode.toString(), 'An error Code', 'The error code message');
    t.end();

  });

});
