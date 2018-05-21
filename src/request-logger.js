const logger = require('./logger');

const requestLogger = (req, res, next) => {
  req.log = logger;

  req.log._logger.fields.method = req.method;
  req.log._logger.fields.url = req.url;

  req.log.trace({ body: req.body });

  next();
};

module.exports = requestLogger;
