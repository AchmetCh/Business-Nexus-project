const User = require('../models/User');

// Get user profile by ID
exports.getProfile = async (req, res) => {
  try {
    console.log('Getting profile for ID:', req.params.id); // Debug log
    console.log('Current user ID:', req.user.userId); // Debug log
    
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('Found user:', user.name, user.role); // Debug log
    res.json(user);
  } catch (error) {
    console.error('Error in getProfile:', error); // Debug log
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update own profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = req.body;

    // Remove sensitive fields
    delete updates.password;
    delete updates.email;

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all entrepreneurs (for investors)
exports.getEntrepreneurs = async (req, res) => {
  try {
    const entrepreneurs = await User.find({ role: 'entrepreneur' })
      .select('-password');
    res.json(entrepreneurs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all investors (for entrepreneurs)
exports.getInvestors = async (req, res) => {
  try {
    const investors = await User.find({ role: 'investor' })
      .select('-password');
    res.json(investors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};