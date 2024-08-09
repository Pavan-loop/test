const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employees');
const nodemailer = require('nodemailer');

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.register = async (req, res) => {
  const { firstName, lastName, phoneNumber, email, gender, role } = req.body;

  try {
    let employee = await Employee.findOne({ email });
    if (employee) {
      return res.status(400).json({ msg: 'Employee already exists' });
    }

    // Generate a random password
    const password = Math.random().toString(36).slice(-8);

    employee = new Employee({ firstName, lastName, phoneNumber, email, gender, role, password });
    const salt = await bcrypt.genSalt(10);
    employee.password = await bcrypt.hash(password, salt);

    await employee.save();


    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Account Credentials',
      text: `Username: ${email}\nPassword: ${password}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Email sent: ' + info.response);
    });

    const payload = { employee: { id: employee.id, role: employee.role } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = { employee: { id: employee.id, role: employee.role, firstName: employee.firstName } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, role: employee.role, id: employee.id });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};