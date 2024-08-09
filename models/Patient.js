const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: Date, required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Employees', required: true }, // Reference to Employees collection
  patientType: { type: String, required: true },
  medicalCondition: { type: String, required: true },
  status: { type: String, default: 'Yet to check', required: true },
  age: {type: Number, required: true},
  password: { type: String, required: false }, 
  prescriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' }]
});

module.exports = mongoose.model('Patient', PatientSchema);
