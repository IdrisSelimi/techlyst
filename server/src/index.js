import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize environment variables
dotenv.config();

// Database connection
import './config/database.js';

// Import routes
import userRoutes from './routes/userRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

// Create Express app
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/categories', categoryRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Techlyst API' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 