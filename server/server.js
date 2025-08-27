const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
const PORT = process.env.PORT ;
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const requestRoutes = require('./routes/request');
const chatRoutes = require('./routes/chat');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/chat', chatRoutes);


// Socket.io for real-time chat
const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining
  socket.on('user-online', (userId) => {
    activeUsers.set(userId, socket.id);
    console.log(`User ${userId} is online`);
  });

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on('send-message', (data) => {
    // Broadcast to room including sender
    io.to(data.roomId).emit('receive-message', data);
    console.log('Message sent to room:', data.roomId);
  });

  socket.on('disconnect', () => {
    // Remove user from active users
    for (let [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        activeUsers.delete(userId);
        console.log(`User ${userId} went offline`);
        break;
      }
    }
    console.log('User disconnected:', socket.id);
  });
});


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});