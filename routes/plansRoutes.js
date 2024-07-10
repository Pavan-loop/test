// routes/planRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Plan = require('../models/Plans');

router.get('/', auth, async (req, res) => {
  try {
    const plans = await Plan.find({ user: req.user.id });
    res.json(plans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/', auth, async (req, res) => {
  const { planName, description } = req.body;

  try {
    const newPlan = new Plan({
      planName,
      description,
      user: req.user.id
    });

    const plan = await newPlan.save();
    res.json(plan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
