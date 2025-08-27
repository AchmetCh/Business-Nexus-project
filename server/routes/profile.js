const express = require('express');
const {
  getProfile,
  updateProfile,
  getEntrepreneurs,
  getInvestors
} = require('../controllers/profileController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// PUT /api/profile - Update own profile (must come before /:id)
router.put('/', auth, updateProfile);

// GET /api/profile/users/entrepreneurs - Get all entrepreneurs (specific routes first)
router.get('/users/entrepreneurs', auth, getEntrepreneurs);

// GET /api/profile/users/investors - Get all investors
router.get('/users/investors', auth, getInvestors);

// GET /api/profile/:id - Get profile by ID (dynamic route last)
router.get('/:id', auth, getProfile);

module.exports = router;