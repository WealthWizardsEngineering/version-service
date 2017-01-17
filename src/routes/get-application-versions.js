const { getApplicationVersions } = require('../db/application-version-reader');
const { buildQuery, buildProjection } = require('../db/helpers');

const QUERY_WHITELIST = ['_id', 'environment', 'application_name', 'product'];
const PROJECTION_WHITELIST = ['_id', 'environment', 'application_name', 'version', 'date', 'product'];

module.exports = (req, res) => {

  const query = buildQuery(QUERY_WHITELIST)(req.query);
  const projection = buildProjection(PROJECTION_WHITELIST)(req.query.fields);

  getApplicationVersions(query, projection)
    .then(results => {
      res.send(results);
    });

};
