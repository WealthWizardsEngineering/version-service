const createApplicationVersion = require('./create-application-version');
const getApplicationVersions = require('./get-application-versions');
const getEnvironment = require('./get-environment');
const getEnvironments = require('./get-environments');
const createApplicationVersionValidation = require('../rules/create-application-version-validation');
const querystringValidation = require('../rules/querystring-validation');
const { requestValidator } = require('ww-validation');

module.exports = (app) => {
  app.post('/v1/version',
    requestValidator({ body: createApplicationVersionValidation }),
    createApplicationVersion
  );

  app.get('/v1/version',
    requestValidator({ query: querystringValidation }),
    getApplicationVersions
  );

  app.get('/v1/environment',
    requestValidator({ query: querystringValidation }),
    getEnvironments
  );

  app.get('/v1/environment/:id',
    requestValidator({ query: querystringValidation }),
    getEnvironment
  );
};
