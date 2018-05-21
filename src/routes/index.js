const createApplicationVersion = require('./create-application-version');
const getApplicationVersions = require('./get-application-versions');
const getEnvironment = require('./get-environment');
const getEnvironments = require('./get-environments');
const getHealth= require('./get-health');
const getPing= require('./get-ping');
const createApplicationVersionValidation = require('../rules/create-application-version-validation');
const cors = require('cors');
const nocache = require('nocache');
const queryStringValidation = require('../rules/querystring-validation');
const requestValidator  = require('../request-validator');

module.exports = (app) => {
  app.get('/ping',
    cors(),
    nocache(),
    getPing
  );

  app.get('/health',
    cors(),
    nocache(),
    getHealth
  );

  app.post('/v1/version',
    requestValidator({ body: createApplicationVersionValidation }),
    createApplicationVersion
  );

  app.get('/v1/version',
    requestValidator({ query: queryStringValidation }),
    getApplicationVersions
  );

  app.get('/v1/environment',
    requestValidator({ query: queryStringValidation }),
    getEnvironments
  );

  app.get('/v1/environment/:id',
    requestValidator({ query: queryStringValidation }),
    getEnvironment
  );
};
