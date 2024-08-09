// server.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json({ extended: false }));

app.use('/api/patients', require('./routes/patients'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/emp/auth', require('./routes/empAuthRoutes'));
app.use('/api/emp/users', require('./routes/empUserRoutes'));
app.use('/api/emp/', require('./routes/empdateRoute'));
app.use('/api/patient', require('./routes/patients'));
app.use('/api/emp', require('./routes/getDoctors')); 
app.use('/api/modify', require('./routes/patients'));
app.use('/api/prescription', require('./routes/PrescriptionRoutes'));
app.use('/api/bill',  require('./routes/billGenerateRoute'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
