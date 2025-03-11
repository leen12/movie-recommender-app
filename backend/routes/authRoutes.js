const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Use Node's built-in crypto instead of bcrypt
const { findUserByEmail, createUser } = require('../config/jsonDb');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Simple hash function using crypto (replacement for bcrypt)
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password + 'salt-value').digest('hex');
};

// Verify password (replacement for bcrypt.compare)
const verifyPassword = (password, hashedPassword) => {
  const hashed = crypto.createHash('sha256').update(password + 'salt-value').digest('hex');
  return hashed === hashedPassword;
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = findUserByEmail(email);

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password using our simple hash function
    const hashedPassword = hashPassword(password);

    // Create new user
    const user = createUser({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      watchlist: []
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = findUserByEmail(email);

    if (user && verifyPassword(password, user.password)) {
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = findUserByEmail(req.user.email);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = findUserByEmail(req.user.email);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.profilePicture = req.body.profilePicture || user.profilePicture;
      
      if (req.body.preferences) {
        user.preferences = {
          ...user.preferences,
          ...req.body.preferences,
        };
      }

      if (req.body.password) {
        const hashedPassword = hashPassword(req.body.password);
        user.password = hashedPassword;
      }

      const updatedUser = createUser({
        ...user,
        updatedAt: new Date().toISOString(),
      });

      res.json({
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        token: generateToken(updatedUser.id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 