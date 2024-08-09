const express = require("express")
const router = express.Router();
const {getEmp} = require('../controllers/empdataController');

router.get('/get', getEmp);

module.exports = router;
