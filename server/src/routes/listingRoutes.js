import express from 'express';
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  uploadListingImages,
  getListingsBySeller
} from '../controllers/listingController.js';
import { protect, seller } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getListings);
router.get('/:id', getListingById);
router.get('/seller/:id', getListingsBySeller);

// Seller protected routes
router.post('/', protect, seller, createListing);
router.put('/:id', protect, seller, updateListing);
router.delete('/:id', protect, seller, deleteListing);
router.post('/:id/images', protect, seller, upload.array('images', 8), uploadListingImages);

export default router; 