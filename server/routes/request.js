const express = require('express');
const {
  sendRequest,
  getRequests,
  updateRequestStatus
} = require('../controllers/requestController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// POST /api/request - Send collaboration request
router.post('/', auth, sendRequest);

// GET /api/request - Get user's requests
router.get('/', auth, getRequests);

// PATCH /api/request/:id - Update request status
router.patch('/:id', auth, updateRequestStatus);

module.exports = router;