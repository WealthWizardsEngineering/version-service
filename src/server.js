const express = require('express');
const bodyParser = require('body-parser');
const responseTime = require('response-time');
const helmet = require('helmet');
const wwLogging = require('ww-logging');
const wwMonitoring = require('ww-monitoring');
const wwUtils = require('ww-utils');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const env = require('./env-vars');
const apiRoutes = require('./routes');
const ApplicationVersion = require('./db/application-version-model');

const app = express();

const contextRoute = express.Router();

mongoose.connect(env.MONGODB_URL);

contextRoute.use(helmet());

contextRoute.use(wwLogging.requestId);
contextRoute.use(wwLogging.requestLogger);
contextRoute.use(wwLogging.correlationId);

wwMonitoring.ping(contextRoute);
wwMonitoring.health(contextRoute, [
  {
    type: 'mongo',
    name: 'application version store',
    model: ApplicationVersion,
  },
]);

contextRoute.use(responseTime());

contextRoute.use(bodyParser.urlencoded({
  extended: false,
}));
contextRoute.use(bodyParser.json());

wwUtils.apiDocRoutes(contextRoute);
apiRoutes(contextRoute);

contextRoute.use(wwLogging.errorHandler);

app.use('/version-service', contextRoute);

app.shutdown = () => {
  mongoose.disconnect();
};

module.exports = {
  app,
};
