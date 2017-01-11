require('dotenv').config({ silent: true });
const env = require('./src/env-vars');
const { app } = require('./src/server');

const server = app.listen(env.PORT, () => {
  console.log(`Listening on port ${env.PORT} with context route of ${env.CONTEXT_ROUTE}`);
});

process.on('SIGTERM', () => {
  console.log('Shutting down...');
  server.close(() => app.shutdown());
});
