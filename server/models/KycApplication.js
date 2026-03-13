const mongoose = require('mongoose');

const kycApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: String,
    required: true
  },
  aadhaarNumber: {
    type: String,
    required: true,
    match: [/^\d{12}$/, 'Aadhaar must be 12 digits']
  },
  panNumber: {
    type: String,
    required: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format']
  },
  aadhaarImageUrl: {
    type: String,
    required: true
  },
  panImageUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminComment: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('KycApplication', kycApplicationSchema);