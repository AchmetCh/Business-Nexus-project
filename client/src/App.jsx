import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/Authcontext'
import Login from './pages/Login'
import Register from './pages/Register'
import InvestorDashboard from './pages/InvestorDashboard'
import EntrepreneurDashboard from './pages/EntrepreneurDashboard'
import Profile from './pages/Profile'
import Chat from './pages/Chat'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard/investor" element={
            <ProtectedRoute role="investor">
              <InvestorDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/entrepreneur" element={
            <ProtectedRoute role="entrepreneur">
              <EntrepreneurDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/profile/:id" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/chat/:userId" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App