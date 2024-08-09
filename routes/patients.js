const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Patient = require('../models/Patient');
const Employee = require('../models/Employees');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { addPatients, modifyDoctor } = require('../controllers/patientController');


// Get patients assigned to a specific doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const patients = await Patient.find({ doctor: req.params.doctorId });
    res.json(patients);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findOne({_id: req.params.id});
    res.json(patient);
  }catch (error) {
    res.status(500).send('Problema');
  }
})

router.post('/add', addPatients);


router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find().populate('doctor', 'firstName lastName');
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.put('/:id/change-doctor', modifyDoctor);

router.put('/status/complete/:id', async (req, res) => {
  try{
    const patient = await Patient.findById(req.params.id);

    if(!patient) {
      return res.status(404).json({msg: 'Patient not Found'});
    }

    patient.status = 'Complete';
    await patient.save();
    res.json(patient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/status/testing/:id', async (req, res) => {
  try{
    const patient = await Patient.findById(req.params.id);

    if(!patient) {
      return res.status(404).json({msg: 'Patient not Found'});
    }

    patient.status = 'Testing';
    await patient.save();
    res.json(patient);
  }catch(err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
})




router.put('/status/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    patient.status = 'Ongoing';
    await patient.save();

    res.json(patient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

function generateRandomPassword(length = 8) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, gender, email, time, date, doctor, patientType, medicalCondition, age } = req.body;

    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: "Patient with this email already exists." });
    }

    const randomPassword = generateRandomPassword(8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const newPatient = new Patient({
      firstName,
      lastName,
      gender,
      email,
      password: hashedPassword,
      time,
      date,
      doctor,
      patientType,
      medicalCondition,
      age
    });

    await newPatient.save();

    const doctorDetails = await Employee.findById(doctor);
    const doctorName = doctorDetails ? doctorDetails.firstName + ' ' + doctorDetails.lastName : 'Unknown Doctor';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Patient Account Password',
      text: `Dear ${firstName},\n\nThank you for choosing our hospital. We are pleased to confirm your appointment scheduled as follows:\n\nDate: ${date}\nTime: ${time}\nDoctor: Dr. ${doctorName}\n\nShould you have any questions or need further assistance, please do not hesitate to contact us.\n\nYour account has been created. Your password is: ${randomPassword}\n\nPlease log in and change your password as soon as possible.\n\nBest regards,\nYour Healthcare Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: "Error sending email", error });
      }
      res.status(201).json({ message: "Patient registered and password sent to email" });
    });
  } catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({ message: "Error registering patient", error });
  }
});

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const patient = await Patient.findOne({ email });

    if (!patient) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: patient._id, email: patient.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, message: "Login successful!" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error logging in", error });
  }
});
module.exports = router;

