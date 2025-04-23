import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  upgradeToSeller
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/upgrade-to-seller', protect, upgradeToSeller);

export default router; 