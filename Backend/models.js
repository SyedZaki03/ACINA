// Import Mongoose to define data schemas and compile models
import mongoose from 'mongoose';

// Define the schema structure for a User document in MongoDB
const userSchema = new mongoose.Schema({
  // The user's full name (required, string, trimmed of extra whitespace)
  name: {
    type: String,
    required: true,
    trim: true
  },
  // The user's email address (required, unique, string, trimmed, and converted to lowercase)
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  // The user's securely hashed password string (required, string)
  hashed_password: {
    type: String,
    required: true
  },
  // The timestamp indicating when the user account was created (defaults to current date/time)
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  // Ensure that virtual properties (computed fields) are included when schema is converted to JSON
  toJSON: { virtuals: true },
  // Ensure that virtual properties are included when schema is converted to a plain JavaScript Object
  toObject: { virtuals: true }
});

// Define the schema structure for a Contract Analysis document in MongoDB
const contractAnalysisSchema = new mongoose.Schema({
  // Reference to the user who uploaded/analyzed the contract (required ObjectId linking to 'User' collection)
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // The original filename of the uploaded contract document (required, string)
  filename: {
    type: String,
    required: true
  },
  // The predicted classification category of the contract (required, string)
  predicted_class: {
    type: String,
    required: true
  },
  // The classification confidence score (required, float/number)
  confidence: {
    type: Number,
    required: true
  },
  // Top model prediction classes and their scores (stored as a flexible mixed array of objects)
  top_predictions: {
    type: mongoose.Schema.Types.Mixed, // Stored as native MongoDB array of objects
    default: []
  },
  // Short preview snippet of the extracted contract text (defaults to empty string)
  text_preview: {
    type: String,
    default: ""
  },
  // Full text or raw base64 data of the file (required, string)
  file_data: {
    type: String,
    required: true
  },
  // The timestamp indicating when the contract analysis was performed (defaults to current date/time)
  analysis_date: {
    type: Date,
    default: Date.now
  },
  // The accumulated chat negotiation messages associated with this contract (defaults to empty array)
  chat_history: {
    type: [
      {
        // The sender of the message: 'user' or 'assistant'
        role: { type: String, required: true },
        // The plain or formatted text content of the message
        content: { type: String, required: true },
        // The timestamp indicating when this message was sent
        timestamp: { type: Date, default: Date.now }
      }
    ],
    default: []
  },
  // The detailed AI legal analysis explanation saved in the database
  llm_explanation: {
    type: String,
    default: ""
  }
}, {
  // Include virtual properties when converting documents to JSON
  toJSON: { virtuals: true },
  // Include virtual properties when converting documents to Objects
  toObject: { virtuals: true }
});

// Compile and export the User model based on userSchema
export const User = mongoose.model('User', userSchema);
// Compile and export the ContractAnalysis model based on contractAnalysisSchema
export const ContractAnalysis = mongoose.model('ContractAnalysis', contractAnalysisSchema);
