const test = require('tape');
const { app } = require('../../src/server');

test.onFinish(() => {
  app.shutdown();
});