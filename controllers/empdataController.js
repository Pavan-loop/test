const Employee = require('../models/Employees')

exports.getEmp = async (req,res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).send('Server Error');
  }
}