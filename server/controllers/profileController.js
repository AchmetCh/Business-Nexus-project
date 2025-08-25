const User = require("../models/User");

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const updates = req.body;
        // Remove sensitive fields from updates
        delete updates.email;
        delete updates.password;
        const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//Get all entrepreneurs (for investors to browse)
exports.getAllEntrepreneurs = async (req, res) => {
    try {
        const entrepreneurs = await User.find({ role: 'entrepreneur' }).select('-password');
        res.status(200).json(entrepreneurs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//Get all investors (for entrepreneurs to browse)
exports.getAllInvestors = async (req, res) => {
    try {
        const investors = await User.find({ role: 'investor' }).select('-password');
        res.status(200).json(investors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}