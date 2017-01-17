const { getEnvironment } = require('../db/environment-reader');
const { buildQuery, buildProjection } = require('../db/helpers');

const QUERY_WHITELIST = ['date', 'product'];
const PROJECTION_WHITELIST = [];

module.exports = (req, res) => {
  const query = buildQuery(QUERY_WHITELIST)(req.query);
  const projection = buildProjection(PROJECTION_WHITELIST)(req.query.fields);

  getEnvironment(query, projection, req.params.id)
    .then(environment => {
      res.send(environment);
    });

};
