import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { io } from 'socket.io-client'
import Navbar from '../components/Navbar'
import { chatAPI, profileAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

const Chat = () => {
  const { userId } = useParams()
  const { user: currentUser } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [otherUser, setOtherUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [socket, setSocket] = useState(null)
  const messagesEndRef = useRef(null)

  const roomId = [currentUser.id, userId].sort().join('-')

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:8000')
    setSocket(newSocket)

    // Announce user is online
    newSocket.emit('user-online', currentUser.id)

    // Join room
    newSocket.emit('join-room', roomId)

    // Listen for messages
    newSocket.on('receive-message', (data) => {
      // Only add message if it's not from current user (to avoid duplication)
      if (data.senderId !== currentUser.id) {
        setMessages(prev => [...prev, {
          senderId: { _id: data.senderId, name: data.senderName },
          message: data.message,
          timestamp: new Date()
        }])
      }
    })

    return () => newSocket.close()
  }, [roomId, currentUser.id])

  useEffect(() => {
    fetchChatData()
  }, [userId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchChatData = async () => {
    try {
      console.log('Fetching chat data for userId:', userId); // Debug
      console.log('Current user ID:', currentUser.id); // Debug
      
      const [messagesResponse, profileResponse] = await Promise.all([
        chatAPI.getMessages(userId),
        profileAPI.getProfile(userId)
      ])
      
      console.log('Messages:', messagesResponse.data); // Debug
      console.log('Other user profile:', profileResponse.data); // Debug
      
      setMessages(messagesResponse.data)
      setOtherUser(profileResponse.data)
    } catch (error) {
      console.error('Error fetching chat data:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const messageData = {
      receiverId: userId,
      message: newMessage.trim()
    }

    const messageToAdd = {
      senderId: { _id: currentUser.id, name: currentUser.name },
      message: newMessage.trim(),
      timestamp: new Date()
    }

    console.log('Sending message:', messageData); // Debug
    console.log('Room ID:', roomId); // Debug

    // Add to local messages immediately
    setMessages(prev => [...prev, messageToAdd])
    setNewMessage('')

    try {
      // Send to API
      const response = await chatAPI.sendMessage(messageData)
      console.log('Message API response:', response.data); // Debug

      // Send via socket
      if (socket) {
        console.log('Emitting socket message to room:', roomId); // Debug
        socket.emit('send-message', {
          roomId,
          senderId: currentUser.id,
          senderName: currentUser.name,
          message: messageToAdd.message
        })
      } else {
        console.error('Socket not connected!'); // Debug
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Remove message from local state if API call failed
      setMessages(prev => prev.filter(msg => 
        !(msg.senderId._id === currentUser.id && msg.message === messageToAdd.message && msg.timestamp === messageToAdd.timestamp)
      ))
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mt-4">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="container-fluid mt-4" style={{ height: 'calc(100vh - 120px)' }}>
        <div className="row h-100">
          <div className="col-12">
            <div className="card h-100">
              {/* Chat Header */}
              <div className="card-header bg-primary text-white">
                <div className="d-flex align-items-center">
                  <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3"
                       style={{width: '40px', height: '40px'}}>
                    <span className="text-primary fw-bold">
                      {otherUser?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-0">{otherUser?.name}</h6>
                    <small className="opacity-75">
                      {otherUser?.role.charAt(0).toUpperCase() + otherUser?.role.slice(1)}
                    </small>
                  </div>
                  <Link
                    to={`/profile/${userId}`}
                    className="btn btn-light btn-sm"
                  >
                    View Profile
                  </Link>
                </div>
              </div>

              {/* Messages Container */}
              <div className="card-body p-0 d-flex flex-column" style={{ height: 'calc(100% - 140px)' }}>
                <div className="flex-grow-1 overflow-auto p-3">
                  {messages.length === 0 ? (
                    <div className="text-center py-5">
                      <h5 className="text-muted">No messages yet</h5>
                      <p className="text-muted">Start the conversation!</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((message, index) => {
                        const isOwn = message.senderId._id === currentUser.id
                        return (
                          <div key={index} className={`d-flex mb-3 ${isOwn ? 'justify-content-end' : 'justify-content-start'}`}>
                            <div className={`card ${isOwn ? 'bg-primary text-white' : 'bg-light'}`} 
                                 style={{ maxWidth: '70%' }}>
                              <div className="card-body p-2">
                                <p className="mb-1">{message.message}</p>
                                <small className={`${isOwn ? 'text-light' : 'text-muted'} opacity-75`}>
                                  {message.senderId.name} • {formatTime(message.timestamp)}
                                </small>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Message Input */}
                <div className="border-top p-3">
                  <form onSubmit={sendMessage}>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <button 
                        className="btn btn-primary" 
                        type="submit"
                        disabled={!newMessage.trim()}
                      >
                        <i className="bi bi-send"></i>
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat