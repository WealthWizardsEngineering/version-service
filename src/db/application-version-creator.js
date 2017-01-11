const ApplicationVersion = require('./application-version-model');

module.exports = ({ fact_find_id, solution, suitability_report, statement_of_fact, solution_summary }) => {
  const f = new ApplicationVersion({
    fact_find_id,
    solution,
    suitability_report,
    statement_of_fact,
    solution_summary,
  });

  return f.save();
};
