// models/Plan.js
const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  planName: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Plan', PlanSchema);
