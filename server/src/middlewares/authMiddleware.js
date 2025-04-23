import { verifyToken } from '../utils/jwtUtils.js';
import { User } from '../models/index.js';

// Middleware to protect routes that require authentication
export const protect = async (req, res, next) => {
  let token;

  // Check if auth header exists and has the right format
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = verifyToken(token);
      
      if (!decoded) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }

      // Get user from the token
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password_hash'] }
      });

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin authorization middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

// Seller authorization middleware
export const seller = (req, res, next) => {
  if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a seller' });
  }
}; 