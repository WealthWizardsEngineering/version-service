const getApplicationVersions = require('./get-application-versions');
const getEnvironments = require('./get-environments');
const querystringValidation = require('../rules/querystring-validation');
const { requestValidator } = require('ww-validation');

module.exports = (app) => {
  app.get('/v1/version',
    requestValidator({ query: querystringValidation }),
    getApplicationVersions
  );

  app.get('/v1/environment',
    requestValidator({ query: querystringValidation }),
    getEnvironments
  );
};
