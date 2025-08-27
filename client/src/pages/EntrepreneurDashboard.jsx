import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { requestAPI } from '../services/api'

const EntrepreneurDashboard = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await requestAPI.getRequests({
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
      setRequests(response.data)
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateRequestStatus = async (requestId, status) => {
    try {
      await requestAPI.updateRequestStatus(requestId, status)
      setMessage(`Request ${status} successfully!`)
      setTimeout(() => setMessage(''), 3000)
      fetchRequests() // Refresh the list
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating request')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-warning text-dark',
      accepted: 'bg-success',
      rejected: 'bg-danger'
    }
    return (
      <span className={`badge ${statusClasses[status] || 'bg-secondary'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
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
              <i className="bi bi-envelope me-2"></i>
              Collaboration Requests
            </h2>

            {message && (
              <div className="alert alert-info alert-dismissible fade show">
                {message}
              </div>
            )}

            {requests.length === 0 ? (
              <div className="text-center py-5">
                <h4 className="text-muted">No requests yet</h4>
                <p className="text-muted">Investors will send you collaboration requests here</p>
              </div>
            ) : (
              <div className="row">
                {requests.map((request) => (
                  <div key={request._id} className="col-md-6 col-lg-4 mb-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3" 
                               style={{width: '50px', height: '50px'}}>
                            <span className="text-white fw-bold">
                              {request.investorId.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="card-title mb-0">{request.investorId.name}</h5>
                            <small className="text-muted">Investor</small>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>

                        {request.investorId.investmentInterests && (
                          <div className="mb-3">
                            <strong>Investment Interests:</strong>
                            <p className="text-muted small mb-0">
                              {request.investorId.investmentInterests}
                            </p>
                          </div>
                        )}

                        {request.message && (
                          <div className="mb-3">
                            <strong>Message:</strong>
                            <p className="text-muted small mb-0">
                              {request.message}
                            </p>
                          </div>
                        )}

                        <small className="text-muted">
                          Received: {new Date(request.createdAt).toLocaleDateString()}
                        </small>
                      </div>

                      <div className="card-footer bg-transparent">
                        <div className="d-flex gap-2 mb-2">
                          <Link
                            to={`/profile/${request.investorId._id}`}
                            className="btn btn-outline-primary btn-sm flex-fill"
                          >
                            View Profile
                          </Link>
                          <Link
                            to={`/chat/${request.investorId._id}`}
                            className="btn btn-outline-secondary btn-sm flex-fill"
                          >
                            Chat
                          </Link>
                        </div>

                        {request.status === 'pending' && (
                          <div className="d-flex gap-2">
                            <button
                              onClick={() => updateRequestStatus(request._id, 'accepted')}
                              className="btn btn-success btn-sm flex-fill"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateRequestStatus(request._id, 'rejected')}
                              className="btn btn-danger btn-sm flex-fill"
                            >
                              Reject
                            </button>
                          </div>
                        )}
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

export default EntrepreneurDashboard