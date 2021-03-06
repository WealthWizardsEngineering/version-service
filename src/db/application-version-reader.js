const ApplicationVersion = require('./application-version-model');

const getApplicationVersions = (query, projection) =>
  ApplicationVersion
    .find(query)
    .sort({ date: 'desc' })
    .select(projection)
    .exec();

const getApplicationVersion = id =>
  ApplicationVersion
    .findById(id)
    .exec();

module.exports = {
  getApplicationVersions,
  getApplicationVersion,
};
