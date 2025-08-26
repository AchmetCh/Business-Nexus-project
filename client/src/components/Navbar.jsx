import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand fw-bold" to={`/dashboard/${user.role}`}>
          Business Nexus
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className="nav-link" 
                to={`/dashboard/${user.role}`}
              >
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className="nav-link" 
                to={`/profile/${user.id}`}
              >
                My Profile
              </Link>
            </li>
          </ul>
          
          <div className="navbar-nav">
            <span className="navbar-text me-3">
              Welcome, {user.name}
            </span>
            <button 
              className="btn btn-outline-light btn-sm" 
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar