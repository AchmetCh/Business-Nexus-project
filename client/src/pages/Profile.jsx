import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { profileAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
  const { id } = useParams()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [message, setMessage] = useState('')

  const isOwnProfile = currentUser.id === id

  useEffect(() => {
    fetchProfile()
  }, [id])

  const fetchProfile = async () => {
    try {
      const response = await profileAPI.getProfile(id)
      setProfile(response.data)
      setFormData(response.data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await profileAPI.updateProfile(formData)
      setProfile(response.data.user)
      setEditing(false)
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating profile')
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

  if (!profile) {
    return (
      <div>
        <Navbar />
        <div className="container mt-4">
          <div className="alert alert-danger">Profile not found</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {message && (
              <div className="alert alert-info alert-dismissible fade show">
                {message}
              </div>
            )}

            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">
                    <i className="bi bi-person-circle me-2"></i>
                    Profile
                  </h4>
                  {isOwnProfile && !editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="btn btn-light btn-sm"
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Edit
                    </button>
                  )}
                </div>
              </div>

              <div className="card-body">
                {editing ? (
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name || ''}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={profile.email}
                          disabled
                        />
                        <small className="text-muted">Email cannot be changed</small>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Bio</label>
                      <textarea
                        className="form-control"
                        name="bio"
                        rows="3"
                        value={formData.bio || ''}
                        onChange={handleChange}
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    {profile.role === 'entrepreneur' && (
                      <>
                        <div className="mb-3">
                          <label className="form-label">Startup Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="startup"
                            value={formData.startup || ''}
                            onChange={handleChange}
                            placeholder="Your startup name"
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Pitch Summary</label>
                          <textarea
                            className="form-control"
                            name="pitchSummary"
                            rows="4"
                            value={formData.pitchSummary || ''}
                            onChange={handleChange}
                            placeholder="Describe your startup idea..."
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Funding Need</label>
                          <input
                            type="text"
                            className="form-control"
                            name="fundingNeed"
                            value={formData.fundingNeed || ''}
                            onChange={handleChange}
                            placeholder="e.g., $100K - $500K"
                          />
                        </div>
                      </>
                    )}

                    {profile.role === 'investor' && (
                      <>
                        <div className="mb-3">
                          <label className="form-label">Investment Interests</label>
                          <textarea
                            className="form-control"
                            name="investmentInterests"
                            rows="3"
                            value={formData.investmentInterests || ''}
                            onChange={handleChange}
                            placeholder="What industries or types of startups are you interested in?"
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Portfolio Companies</label>
                          <textarea
                            className="form-control"
                            name="portfolioCompanies"
                            rows="3"
                            value={formData.portfolioCompanies || ''}
                            onChange={handleChange}
                            placeholder="List your current or past investments..."
                          />
                        </div>
                      </>
                    )}

                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="row mb-4">
                      <div className="col-md-3 text-center">
                        <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                             style={{width: '100px', height: '100px'}}>
                          <span className="text-white fw-bold" style={{fontSize: '2rem'}}>
                            {profile.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <h5>{profile.name}</h5>
                        <span className="badge bg-secondary">
                          {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                        </span>
                      </div>
                      <div className="col-md-9">
                        <div className="row">
                          <div className="col-md-6">
                            <strong>Email:</strong>
                            <p className="text-muted">{profile.email}</p>
                          </div>
                          <div className="col-md-6">
                            <strong>Member Since:</strong>
                            <p className="text-muted">
                              {new Date(profile.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {profile.bio && (
                          <div className="mb-3">
                            <strong>Bio:</strong>
                            <p className="text-muted">{profile.bio}</p>
                          </div>
                        )}

                        {profile.role === 'entrepreneur' && (
                          <>
                            {profile.startup && (
                              <div className="mb-3">
                                <strong>Startup:</strong>
                                <p className="text-muted">{profile.startup}</p>
                              </div>
                            )}
                            {profile.pitchSummary && (
                              <div className="mb-3">
                                <strong>Pitch Summary:</strong>
                                <p className="text-muted">{profile.pitchSummary}</p>
                              </div>
                            )}
                            {profile.fundingNeed && (
                              <div className="mb-3">
                                <strong>Funding Need:</strong>
                                <span className="badge bg-warning text-dark ms-2">
                                  {profile.fundingNeed}
                                </span>
                              </div>
                            )}
                          </>
                        )}

                        {profile.role === 'investor' && (
                          <>
                            {profile.investmentInterests && (
                              <div className="mb-3">
                                <strong>Investment Interests:</strong>
                                <p className="text-muted">{profile.investmentInterests}</p>
                              </div>
                            )}
                            {profile.portfolioCompanies && (
                              <div className="mb-3">
                                <strong>Portfolio Companies:</strong>
                                <p className="text-muted">{profile.portfolioCompanies}</p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {!isOwnProfile && (
                      <div className="text-center">
                        <Link
                          to={`/chat/${profile._id}`}
                          className="btn btn-primary"
                        >
                          <i className="bi bi-chat me-2"></i>
                          Start Chat
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile