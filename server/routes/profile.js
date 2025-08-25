const express = require('express');
const profileController = require('../controllers/profileController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /api/profile/:id - Get profile by ID
router.get('/:id', auth, profileController.getProfile);

// PUT /api/profile - Update own profile
router.put('/', auth, profileController.updateProfile);

// GET /api/profile/entrepreneurs - Get all entrepreneurs
router.get('/users/entrepreneurs', auth, profileController.getAllEntrepreneurs);

// GET /api/profile/investors - Get all investors
router.get('/users/investors', auth, profileController.getAllInvestors);

module.exports = router;