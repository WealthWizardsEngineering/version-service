const Joi = require('joi');

const querystringValidation = Joi.object().keys({
  _id: Joi.string(),
  fact_find_id: Joi.string(),
  fields: Joi.string(),
});

module.exports = querystringValidation;