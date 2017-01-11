const Solution = require('./solution-model');

module.exports = ({ fact_find_id, solution, suitability_report, statement_of_fact, solution_summary }) => {
  const f = new Solution({
    fact_find_id,
    solution,
    suitability_report,
    statement_of_fact,
    solution_summary,
  });

  return f.save();
};
