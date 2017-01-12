const { getEnvironments } = require('../db/environment-reader');
const { buildQuery, buildProjection } = require('../db/helpers');

const QUERY_WHITELIST = ['environment'];
const PROJECTION_WHITELIST = ['environment'];

module.exports = (req, res) => {

  const query = buildQuery(QUERY_WHITELIST)(req.query);
  const projection = buildProjection(PROJECTION_WHITELIST)(req.query.fields);

  getEnvironments(query, projection)
    .then(results => {
      res.send(results);
    });

};
