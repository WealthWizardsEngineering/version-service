const mongoose = require('mongoose');
mongoose.Promise = Promise;

const ApplicationVersionSchema = new mongoose.Schema({
  environment: { type: String },
  application_name: { type: String },
  version: { type: String },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// { date: Date,

module.exports = mongoose.model('ApplicationVersion', ApplicationVersionSchema);
