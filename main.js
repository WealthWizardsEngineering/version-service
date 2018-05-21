require('dotenv').config({ silent: true });
const env = require('./src/env-vars');
const { app } = require('./src/server');
const logger = require('./src/logger');
const mongoose = require('mongoose');

mongoose.Promise = Promise;
const mongooseConnectionErrorHandler = require('./src/db/mongoose-connection-error-handler');

mongooseConnectionErrorHandler(logger, [mongoose.connection]);

const server = app.listen(env.PORT, () => {
  logger.info(`Listening on port ${env.PORT} with context route of /version-service`);
});

process.on('SIGTERM', () => {
  logger.info('Shutting down...');
  server.close(() => app.shutdown());
});
