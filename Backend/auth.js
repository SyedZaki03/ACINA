// Import bcryptjs for secure password hashing and comparison
import bcrypt from 'bcryptjs';
// Import jsonwebtoken for creating and verifying JWT tokens
import jwt from 'jsonwebtoken';
// Import dotenv to access variables from process.env
import dotenv from 'dotenv';
// Import the User model from models.js to fetch user details
import { User } from './models.js';

// Load variables from .env file into environment
dotenv.config();

// Define secret key for signing JWTs, defaulting to a fallback message if unset
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-change-this-in-production-please-use-env-variables';
// Set the token signature algorithm
const ALGORITHM = 'HS256';

// Helper function to hash a plaintext password with a salt round of 10
export const hashPassword = async (password) => {
  // Generate salt factor
  const salt = await bcrypt.genSalt(10);
  // Hash password using generated salt and return the hashed password string
  return bcrypt.hash(password, salt);
};

// Helper function to verify a plaintext password against a stored hashed password
export const verifyPassword = async (plainPassword, hashedPassword) => {
  // Compare passwords and return boolean match status
  return bcrypt.compare(plainPassword, hashedPassword);
};

// Helper function to create an access token for user sessions
export const createAccessToken = (data) => {
  // Construct token payload containing subject email, user ID, and username
  const payload = {
    sub: data.sub,
    user_id: data.user_id,
    name: data.name
  };
  
  // Retrieve token expiration limit in minutes from environment, defaulting to 1440 (24 hours) for developer sessions
  const expiryMinutes = parseInt(process.env.ACCESS_TOKEN_EXPIRE_MINUTES || '1440', 10);
  // Format expiration string as "1440m" for the jwt library
  const expiresIn = `${expiryMinutes}m`;
  
  // Sign and return the access token with the specified secret and algorithm
  return jwt.sign(payload, SECRET_KEY, { algorithm: ALGORITHM, expiresIn });
};

// Helper function to decode and verify the access token
export const decodeAccessToken = (token) => {
  try {
    // Verify token using secret and algorithm, returning the decoded payload if valid
    return jwt.verify(token, SECRET_KEY, { algorithms: [ALGORITHM] });
  } catch (error) {
    // Return null if token is invalid or expired
    return null;
  }
};

// Express authentication middleware to protect API routes
export const requireAuth = async (req, res, next) => {
  try {
    // Get Authorization header from incoming request
    const authHeader = req.headers.authorization;
    // Return 401 error if header is missing or does not start with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ detail: 'Missing or invalid authentication header' });
    }
    
    // Extract token part from the Bearer string
    const token = authHeader.split(' ')[1];
    // Decode and verify the extracted token
    const payload = decodeAccessToken(token);
    
    // Return 401 error if token verification failed (expired or invalid)
    if (!payload) {
      return res.status(401).json({ detail: 'Invalid or expired token' });
    }
    
    // Extract user details from the verified token payload
    const userEmail = payload.sub;
    const userId = payload.user_id;
    
    // Return 401 error if token claims do not contain required fields
    if (!userEmail || !userId) {
      return res.status(401).json({ detail: 'Invalid token claims' });
    }
    
    // Find the corresponding user in the database
    const user = await User.findById(userId);
    // Return 401 error if no user matches the ID in the token
    if (!user) {
      return res.status(401).json({ detail: 'User not found' });
    }
    
    // Attach the found user object to the Request context for downstream routes
    req.user = user;
    // Continue execution to the next handler
    next();
  } catch (error) {
    // Log unexpected errors during auth middleware execution
    console.error('Authentication error:', error);
    // Return 500 internal server error
    return res.status(500).json({ detail: 'Internal server error during authentication' });
  }
};
