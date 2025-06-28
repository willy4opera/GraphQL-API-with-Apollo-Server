const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Validate JWT secret in production
if (process.env.NODE_ENV === 'production' && JWT_SECRET === 'your-super-secret-jwt-key-change-this-in-production') {
  console.error('⚠️  WARNING: Using default JWT secret in production! Please set JWT_SECRET environment variable.');
}

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Hash password
const hashPassword = async (password) => {
  const saltRounds = process.env.NODE_ENV === 'production' ? 12 : 10;
  return await bcrypt.hash(password, saltRounds);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Get user from context (authentication middleware)
const getUser = (context) => {
  const token = context.token;
  
  if (!token) {
    return null;
  }
  
  // Remove 'Bearer ' prefix if present
  const cleanToken = token.replace('Bearer ', '');
  
  try {
    const decoded = verifyToken(cleanToken);
    return decoded;
  } catch (error) {
    return null;
  }
};

// Require authentication
const requireAuth = (context) => {
  const user = getUser(context);
  
  if (!user) {
    throw new Error('You must be logged in to perform this action');
  }
  
  return user;
};

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  getUser,
  requireAuth,
};
