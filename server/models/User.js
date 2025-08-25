const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['investor', 'entrepreneur']
  },
  bio: {
    type: String,
    default: ''
  },
  // Entrepreneur specific fields
  startup: {
    type: String,
    default: ''
  },
  pitchSummary: {
    type: String,
    default: ''
  },
  fundingNeed: {
    type: String,
    default: ''
  },
  // Investor specific fields
  investmentInterests: {
    type: String,
    default: ''
  },
  portfolioCompanies: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);