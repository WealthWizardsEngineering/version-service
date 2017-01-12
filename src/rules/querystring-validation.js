const Joi = require('joi');

const querystringValidation = Joi.object().keys({
  _id: Joi.string(),
  environment: Joi.string(),
  application_name: Joi.string(),
  fields: Joi.string(),
  date: Joi.date().iso(),
});

module.exports = querystringValidation;
