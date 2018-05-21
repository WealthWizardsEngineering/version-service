module.exports = (logger, mongooseConnections = []) => {
  for (const connection of mongooseConnections) {
    connection.on('error', (err) => {
      logger.warn({
        msg: 'Mongoose default connection error',
        err,
      });
      process.exit(1);
    });

    connection.on('disconnected', () => {
      logger.warn('Mongoose disconnection error');
      process.exit(1);
    });
  }
};
