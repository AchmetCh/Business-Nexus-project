const express = require('express');
const {
  getMessages,
  sendMessage,
  getChatPartners
} = require('../controllers/chatController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /api/chat/partners/all - Get all chat partners (specific route first)
router.get('/partners/all', auth, getChatPartners);

// POST /api/chat - Send message
router.post('/', auth, sendMessage);

// GET /api/chat/:userId - Get messages between current user and userId (dynamic route last)
router.get('/:userId', auth, getMessages);

module.exports = router;