const ApplicationVersion = require('./application-version-model');

const getSolutions = (query, projection) =>
  ApplicationVersion
    .find(query)
    .sort({ updated_at: 'desc' })
    .select(projection)
    .exec();

const getSolution = id =>
  ApplicationVersion
    .findById(id)
    .exec();

module.exports = {
  getSolutions,
  getSolution,
};
