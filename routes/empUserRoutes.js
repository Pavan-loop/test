const express = require('express');
const router = express.Router();
const auth = require('../middleware/empAuthMiddleware');
const User = require('../models/Employees');

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message, "idhe");
    res.status(500).send('Server error');
  }
});

module.exports = router;
