const { ErrorCodes, ApiError } = require('ww-utils');
const createApplicationVersion = require('../db/application-version-creator');

module.exports = (req, res, next) => {
  createApplicationVersion(req.body)
    .then((result) => {
      const returnData = { id: result.id };
      res.status(201).send(returnData);
    })
    .catch(() => {
      next(new ApiError('Internal server error', ErrorCodes.INTERNAL_SERVER_ERROR, 500));
    });
};
