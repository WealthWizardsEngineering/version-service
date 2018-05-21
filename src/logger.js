const bunyan = require('bunyan');

let level = 'INFO';
if (process.env.WW_LOGGER_LEVEL != null) {
  level = process.env.WW_LOGGER_LEVEL;
}

const loggerName = process.env.npm_package_name || 'svcLogger';

const logger = bunyan.createLogger({
  name: loggerName,
  serializers: {
    err: bunyan.stdSerializers.err,
  },
  streams: [{
    level,
    stream: process.stdout,
  }],
});

if (process.env.NODE_ENV === 'test') {
  logger.level(bunyan.FATAL + 1); // syslog levels
}

module.exports = {
  trace: (...args) => (logger.trace(...args)),
  debug: (...args) => (logger.debug(...args)),
  info: (...args) => (logger.info(...args)),
  warn: (...args) => (logger.warn(...args)),
  error: (...args) => (logger.error(...args)),
  _logger: logger,
  level,
};
