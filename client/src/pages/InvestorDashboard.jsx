import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { profileAPI, requestAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

const InvestorDashboard = () => {
  const [entrepreneurs, setEntrepreneurs] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    fetchEntrepreneurs()
  }, [])

  const fetchEntrepreneurs = async () => {
    try {
      const response = await profileAPI.getEntrepreneurs()
      setEntrepreneurs(response.data)
    } catch (error) {
      console.error('Error fetching entrepreneurs:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendRequest = async (entrepreneurId) => {
    try {
      await requestAPI.sendRequest({
        entrepreneurId,
        message: 'I am interested in your startup!'
      })
      setMessage('Request sent successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error sending request')
      setTimeout(() => setMessage(''), 3000)
    }
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
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4">
              <i className="bi bi-person-workspace me-2"></i>
              Discover Entrepreneurs
            </h2>

            {message && (
              <div className="alert alert-info alert-dismissible fade show">
                {message}
              </div>
            )}

            {entrepreneurs.length === 0 ? (
              <div className="text-center py-5">
                <h4 className="text-muted">No entrepreneurs found</h4>
                <p className="text-muted">Check back later for new opportunities</p>
              </div>
            ) : (
              <div className="row">
                {entrepreneurs.map((entrepreneur) => (
                  <div key={entrepreneur._id} className="col-md-6 col-lg-4 mb-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                               style={{width: '50px', height: '50px'}}>
                            <span className="text-white fw-bold">
                              {entrepreneur.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h5 className="card-title mb-0">{entrepreneur.name}</h5>
                            <small className="text-muted">Entrepreneur</small>
                          </div>
                        </div>

                        {entrepreneur.startup && (
                          <div className="mb-2">
                            <strong>Startup:</strong>
                            <p className="text-muted mb-0">{entrepreneur.startup}</p>
                          </div>
                        )}

                        {entrepreneur.pitchSummary && (
                          <div className="mb-3">
                            <strong>Pitch Summary:</strong>
                            <p className="text-muted small">
                              {entrepreneur.pitchSummary.length > 100 
                                ? entrepreneur.pitchSummary.substring(0, 100) + '...' 
                                : entrepreneur.pitchSummary}
                            </p>
                          </div>
                        )}

                        {entrepreneur.fundingNeed && (
                          <div className="mb-3">
                            <span className="badge bg-warning text-dark">
                              Funding Need: {entrepreneur.fundingNeed}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="card-footer bg-transparent">
                        <div className="d-flex gap-2">
                          <Link
                            to={`/profile/${entrepreneur._id}`}
                            className="btn btn-outline-primary btn-sm flex-fill"
                          >
                            View Profile
                          </Link>
                          <button
                            onClick={() => sendRequest(entrepreneur._id)}
                            className="btn btn-primary btn-sm flex-fill"
                          >
                            Send Request
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvestorDashboard