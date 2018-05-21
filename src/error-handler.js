const errorHandler = (err, req, res, next) => {
  const isOperational = (err.statusCode > 0);

  if (isOperational) {
    const { statusCode, code, message, moreInfo, source } = err;

    req.log.debug(err);

    req.log.info(message);

    return res.status(statusCode).json({
      id: req.uuid,
      statusCode,
      code,
      message,
      moreInfo,
      source,
    });
  }

  req.log.warn({ err });

  res.status(500).send('Service unavailable :(');
  return next();
};

module.exports = errorHandler;
