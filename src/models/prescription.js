// models/Prescription.js
const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  prescriptionId: { type: String, unique: true, required: true },
  userId: { type: String, required: true },
  doctorId: { type: String, required: true },
  medications: [
    {
      name: { type: String, required: true },
      dosage: { type: String, required: true },
      duration: { type: String, required: true },
    },
  ],
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Prescription || mongoose.model('Prescription', PrescriptionSchema);
