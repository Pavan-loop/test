const Patients = require('../models/Patient');
const Employee = require('../models/Employees');
const nodemailer = require('nodemailer');
const Employees = require('../models/Employees');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.addPatients = async (req, res) => {
  const {
    firstName,
    lastName,
    gender,
    email,
    time,
    date,
    doctor: doctorId,
    patientType,
    medicalCondition,
    age
  } = req.body;

  try {
    const newPatient = new Patients({
      firstName,
      lastName,
      gender,
      email,
      time,
      date,
      doctor: doctorId,
      patientType,
      medicalCondition,
      age
    });

    const patient = await newPatient.save();

    const doctor = await Employee.findById(doctorId);

    if (!doctor) {
      return res.status(404).send('Doctor not found');
    }

    const doctorName = doctor.firstName;
    console.log(doctorName);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Doctor Appointment",
      text: `Dear ${firstName}, \nThank you for choosing our hospital. We are pleased to confirm your appointment scheduled as follows: \nDate: ${date} \nTime: ${time} \nDoctor: Dr. ${doctorName} \nShould you have any questions or need further assistance, please do not hesitate to contact us.\nWe look forward to seeing you.\nBest regards,\nMERN Hospital`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send("Error sending email");
      }
      console.log('Email sent:', info.response);
    });

    res.json(patient);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send("Something went wrong");
  }
};

exports.modifyDoctor = async(req,res) => {
  const {id} = req.params;
  const {doctorId} = req.body;

  try{
    const patient = await Patients.findByIdAndUpdate(
      id,
      { doctor: doctorId},
      { new: true}
    ).populate('doctor');

    const doctorerer = await Employees.findById(doctorId);

    if (!doctorerer) {
      return res.status(404).send('Doctor not found');
    }

    const doctorName = doctorerer.firstName;
    console.log(doctorName);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: patient.email,
      subject: "Doctor Rescheduling",
      text: `Dear ${patient.firstName}, \nThank you for choosing our hospital. Rescheduling process is complete and your appointment scheduled as follows: \nDate: ${patient.date} \nTime: ${patient.time} \nDoctor: Dr. ${doctorName} \nShould you have any questions or need further assistance, please do not hesitate to contact us.\nWe look forward to seeing you.\nBest regards,\nMERN Hospital`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send("Error sending email");
      }
      console.log('Email sent:', info.response);
    });


    if (!patient) {
      return res.status(404).json({ msg: "Patient not found" });
    }

    res.json(patient);
  }catch(err) {
    res.status(500).send("Server Error");
  }
};
