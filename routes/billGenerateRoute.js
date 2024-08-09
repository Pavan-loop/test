const express = require('express');
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const Patient = require('../models/Patient'); 
const Prescription = require('../models/Prescription'); 
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/generate-invoice/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId).populate('prescriptions').exec();
    if (!patient) {
      return res.status(404).send('Patient not found');
    }

    const doc = new PDFDocument();
    const filePath = path.join(__dirname, 'invoices', `${patient.firstName}_${patient.lastName}_Invoice.pdf`);
    
    // Ensure the directory exists
    fs.mkdirSync(path.join(__dirname, 'invoices'), { recursive: true });

    doc.pipe(fs.createWriteStream(filePath));

    // Add content to the PDF
    doc.fontSize(25).text('Medical Invoice', { align: 'center' });
    doc.moveDown();

    doc.fontSize(16).text(`Patient: ${patient.firstName} ${patient.lastName}`);
    doc.text(`Age: ${patient.age}`);
    doc.text(`Gender: ${patient.gender}`);
    doc.text(`Date: ${new Date(patient.date).toLocaleDateString()}`);
    doc.text(`Time: ${patient.time}`);
    doc.moveDown();

    doc.text('Prescriptions:');
    patient.prescriptions.forEach((prescription, index) => {
      doc.text(`Prescription ${index + 1}`);
      doc.text(`- Medicines: ${prescription.medicines}`);
      doc.text(`- Tests: ${prescription.tests.join(', ')}`);
      doc.moveDown();
    });

    doc.end();

    doc.on('finish', () => {
      res.download(filePath, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).send('Error downloading file');
        }
      });
    });

  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
