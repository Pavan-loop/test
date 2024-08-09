const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');

router.post('/add', async (req, res) => {
  const { patientId, medicines, tests } = req.body;

  try {
    const newPrescription = new Prescription({
      patient: patientId,
      medicines,
      tests
    });

    const savedPrescription = await newPrescription.save();

    await Patient.findByIdAndUpdate(patientId, {
      $push: { prescriptions: savedPrescription._id }
    });

    res.status(201).json(savedPrescription);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:patientId', async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.params.patientId });
    res.json(prescriptions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
