const express = require('express');
const router = express.Router();
const Employees = require('../models/Employees');

// Get all doctors
router.get('/doctors', async (req, res) => {
  try {
    const roles = ['Physicians','Pediatrician','Psychiatrist','Dermatologist']
    const doctors = await Employees.find({ role: { $in : roles } });
    res.json(doctors);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
