const { getSolutions } = require('../db/solution-reader');
const { buildQuery, buildProjection } = require('../db/helpers');

const QUERY_WHITELIST = ['_id', 'fact_find_id'];
const PROJECTION_WHITELIST = ['_id', 'fact_find_id', 'solution', 'suitability_report', 'created_at', 'updated_at'];

module.exports = (req, res) => {

  const query = buildQuery(QUERY_WHITELIST)(req.query);
  const projection = buildProjection(PROJECTION_WHITELIST)(req.query.fields);

  getSolutions(query, projection)
    .then(results => {
      res.send(results);
    });

};