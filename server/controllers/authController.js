const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const SALT_ROUNDS = process.env.SALT_ROUNDS;

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, parseInt(SALT_ROUNDS));
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    //Generaete JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, PRIVATE_KEY, {
      expiresIn: "24h",
    });
    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login a user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    //Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, PRIVATE_KEY, {
      expiresIn: "24h",
    });
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
