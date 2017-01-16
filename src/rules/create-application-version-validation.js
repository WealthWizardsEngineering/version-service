const Joi = require('joi');

const createValidationRules = Joi.object().keys({
  environment: Joi.string().required(),
  application_name: Joi.string().required(),
  version: Joi.string().required(),
});

module.exports = createValidationRules;
