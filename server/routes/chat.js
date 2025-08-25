const express = require('express');
const {
  getMessages,
  sendMessage,
  getChatPartners
} = require('../controllers/chatController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /api/chat/:userId - Get messages between current user and userId
router.get('/:userId', auth, getMessages);

// POST /api/chat - Send message
router.post('/', auth, sendMessage);

// GET /api/chat/partners - Get all chat partners
router.get('/partners/all', auth, getChatPartners);

module.exports = router;