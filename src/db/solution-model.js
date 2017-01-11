const mongoose = require('mongoose');
mongoose.Promise = Promise;

const ApplicationVersionSchema = new mongoose.Schema({
  fact_find_id: { type: String, required: true },
  solution: { type: Object },
  suitability_report: { type: String },
  statement_of_fact: { type: mongoose.Schema.Types.ObjectId, ref: 'fs.files' },
  solution_summary: { type: mongoose.Schema.Types.ObjectId, ref: 'fs.files' },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('ApplicationVersion', ApplicationVersionSchema);
