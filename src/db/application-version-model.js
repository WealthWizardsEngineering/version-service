const mongoose = require('mongoose');
mongoose.Promise = Promise;

const ApplicationVersionSchema = new mongoose.Schema({
  environment: { type: String },
  application_name: { type: String },
  version: { type: String },
}, { timestamps: { createdAt: 'date', updatedAt: 'updated_at' } });

module.exports = mongoose.model('ApplicationVersion', ApplicationVersionSchema);
