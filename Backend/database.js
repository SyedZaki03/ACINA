// Import the Mongoose library to handle MongoDB connections and schemas
import mongoose from 'mongoose';
// Import Dotenv to load environment variables from a .env file
import dotenv from 'dotenv';

// Load environmental variables into process.env
dotenv.config();

// Define the MongoDB connection URI, defaulting to a local instance if the environment variable is not set
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/acina';

// Define and export an asynchronous function to initialize the database connection
export const initDb = async () => {
  try {
    // Log that the connection process is starting
    console.log('🔌 Connecting to MongoDB...');
    // Establish connection to MongoDB using the MONGODB_URI
    await mongoose.connect(MONGODB_URI);
    // Log successful connection establishment
    console.log('✓ MongoDB connection established successfully.');
  } catch (error) {
    // Log error if connection fails
    console.error('✗ Unable to connect to MongoDB:', error);
    // Rethrow the error to prevent the server from running without a database connection
    throw error;
  }
};
