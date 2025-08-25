const Chat = require('../models/Chat');

// Get chat messages between two users
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;

    const messages = await Chat.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId }
      ]
    })
      .populate('senderId', 'name')
      .populate('receiverId', 'name')
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.userId;

    const newMessage = new Chat({
      senderId,
      receiverId,
      message
    });

    await newMessage.save();

    const populatedMessage = await Chat.findById(newMessage._id)
      .populate('senderId', 'name')
      .populate('receiverId', 'name');

    res.status(201).json({
      message: 'Message sent successfully',
      chat: populatedMessage
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all chat partners for a user
exports.getChatPartners = async (req, res) => {
  try {
    const userId = req.user.userId;

    const messages = await Chat.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    })
      .populate('senderId', 'name role')
      .populate('receiverId', 'name role')
      .sort({ timestamp: -1 });

    // Get unique chat partners
    const partners = new Map();
    
    messages.forEach(msg => {
      const partnerId = msg.senderId._id.toString() === userId ? 
        msg.receiverId._id.toString() : msg.senderId._id.toString();
      
      const partner = msg.senderId._id.toString() === userId ? 
        msg.receiverId : msg.senderId;
      
      if (!partners.has(partnerId)) {
        partners.set(partnerId, {
          ...partner.toObject(),
          lastMessage: msg.message,
          lastMessageTime: msg.timestamp
        });
      }
    });

    res.json(Array.from(partners.values()));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};