const express = require('express');
const bodyParser = require('body-parser');
const responseTime = require('response-time');
const helmet = require('helmet');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const env = require('./env-vars');
const apiRoutes = require('./routes');
const errorHandler = require('./error-handler');
const requestLogger = require('./request-logger');

const app = express();

const contextRoute = express.Router();

mongoose.connect(env.MONGODB_URL);

contextRoute.use(helmet());

contextRoute.use(requestLogger);

contextRoute.use(responseTime());

contextRoute.use(bodyParser.urlencoded({
  extended: false,
}));
contextRoute.use(bodyParser.json());

apiRoutes(contextRoute);

contextRoute.use(errorHandler);

app.use('/version-service', contextRoute);

app.shutdown = () => {
  mongoose.disconnect();
};

module.exports = {
  app,
};
