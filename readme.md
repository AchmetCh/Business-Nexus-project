# Business Nexus 🚀

A professional networking platform connecting entrepreneurs and investors. Built with React, Node.js, and real-time chat functionality.

## ✨ Features

- **User Authentication** - JWT-based login/registration with role selection
- **Role-Based Dashboards** - Different views for investors and entrepreneurs
- **Profile Management** - Customizable profiles with role-specific fields
- **Collaboration Requests** - Send, accept, or reject partnership requests
- **Real-Time Chat** - Socket.io powered messaging system
- **Responsive Design** - Clean Bootstrap UI works on all devices

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- Bootstrap 5.3
- Axios for API calls
- Socket.io Client

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Socket.io for real-time features
- bcrypt for password hashing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB running locally or MongoDB Atlas

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and JWT secret
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📂 Project Structure

```
business-nexus/
├── backend/
│   ├── models/          # Database schemas
│   ├── controllers/     # Route logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth middleware
│   └── server.js        # Main server file
└── frontend/
    ├── src/
    │   ├── pages/       # Main pages
    │   ├── components/  # Reusable components
    │   ├── context/     # Auth context
    │   └── services/    # API services
    └── public/
```

## 🔌 API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `GET /api/profile/:id` - Get user profile
- `PUT /api/profile` - Update own profile
- `POST /api/request` - Send collaboration request
- `GET /api/request` - Get user's requests
- `GET /api/chat/:userId` - Get chat messages
- `POST /api/chat` - Send message

## 🎯 User Roles

**Entrepreneurs:**
- View investor profiles
- Receive collaboration requests
- Manage startup information
- Chat with interested investors

**Investors:**
- Browse entrepreneur profiles  
- Send collaboration requests
- Manage investment preferences
- Chat with potential partners

## 🔧 Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/businessnexus
JWT_SECRET=your-super-secret-key
PORT=5000
```

## 📱 Demo

1. Register as either an investor or entrepreneur
2. Complete your profile with relevant information
3. Browse other users based on your role
4. Send collaboration requests or start conversations
5. Use real-time chat to discuss opportunities

## 🤝 Contributing

Feel free to open issues and pull requests. This is a learning project!

## 📄 License

MIT License - feel free to use this project for learning purposes.

---

Built with ❤️ for connecting entrepreneurs and investors