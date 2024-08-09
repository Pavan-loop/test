const mongoose = require('mongoose');

const PricingSchema = new mongoose.Schema({
  serviceName: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model('Pricing', PricingSchema);
