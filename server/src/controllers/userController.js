import { User } from '../models/index.js';
import { generateToken } from '../utils/jwtUtils.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ 
      where: { 
        [Op.or]: [
          { email },
          { username }
        ]
      } 
    });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      email,
      username,
      password_hash: password,
      role: 'buyer' // Default role
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        token: generateToken(user.id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });

    // Check user and password
    if (user && (await user.validPassword(password))) {
      res.json({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        token: generateToken(user.id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      
      if (req.body.password) {
        user.password_hash = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser.id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upgrade user to seller
// @route   PUT /api/users/upgrade-to-seller
// @access  Private
export const upgradeToSeller = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user) {
      if (user.role === 'seller') {
        return res.status(400).json({ message: 'User is already a seller' });
      }

      user.role = 'seller';
      await user.save();

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user.id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}; 