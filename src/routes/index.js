const getSolutions = require('./get-solutions');
const querystringValidation = require('../rules/querystring-validation');
const { requestValidator } = require('ww-validation');

module.exports = (app) => {
  app.get('/v1/version',
    requestValidator({ query: querystringValidation }),
    getSolutions
  );
};
