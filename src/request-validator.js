const ApiError = require('./api-error')
const ErrorCodes = require('./error-codes')

const Joi = require('joi');

const validate = (schema, baseOptions = {}) => {
  // Never abort early
  const options = Object.assign({}, baseOptions, {
    abortEarly: false,
  });

  return function validateRequest(req, res, next) {
    const toValidate = {};

    if (!schema) {
      throw new Error('No route schema provided.');
    }

    ['params', 'body', 'query'].forEach((key) => {
      if (schema[key]) {
        toValidate[key] = req[key];
      }
    });

    const onValidationComplete = (err, validated) => {
      if (err) {
        // err.details is an array of the errors
        const source = [];
        for (let i = 0; i < err.details.length; i++) {
          source.push({
            message: err.details[i].message,
            path: err.details[i].path,
          });
        }

        return next(new ApiError(
          'Invalid route parameters provided. See the error object for more details.',
          ErrorCodes.FAILED_VALIDATION,
          400,
          source
        ));
      }

      // copy the validated data to the req object
      Object.assign(req, validated);

      return next();
    };

    // Validate the schema and run callback
    const validationOptions = Object.assign({}, options, {
      context: {
        body: req.body,
        params: req.params,
        query: req.query,
      },
    });

    return Joi.validate(toValidate, schema, validationOptions, onValidationComplete);
  };
};

module.exports = validate;
