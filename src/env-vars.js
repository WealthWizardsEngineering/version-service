const envalid = require('envalid');
const logger = require('./logger');
const { str, num } = envalid;

const env = envalid.cleanEnv(process.env, {
  PORT: num(),
  MONGODB_URL: str(),
});

logger.info('Required environment variables are present');

module.exports = env;
