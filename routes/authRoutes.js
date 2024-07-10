// authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/api/test', (req, res) => {
  console.log('Request Body:', req.body); // Log the incoming JSON data
  res.json({ message: 'Data received and logged' });
});

module.exports = router;
