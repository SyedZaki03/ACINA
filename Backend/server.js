// Import express framework for routing and middleware handling
import express from 'express';
// Import cors middleware to allow cross-origin resource sharing from the frontend
import cors from 'cors';
// Import multer middleware to parse file uploads (multipart/form-data)
import multer from 'multer';
// Import pdf-parse library to extract raw text content from uploaded PDF files
import pdf from 'pdf-parse';
// Import dotenv to load environment configuration variables
import dotenv from 'dotenv';

// Import database initialization function
import { initDb } from './database.js';
// Import database models for User and ContractAnalysis tables/documents
import { User, ContractAnalysis } from './models.js';
// Import password crypt functions, token generators, and authentication middleware
import { hashPassword, verifyPassword, createAccessToken, requireAuth } from './auth.js';
// Import model client singleton to run predictions against the BERT process
import { modelClient } from './model_client.js';
// Import Groq LLM chatbot handlers and text sanitization tools
import { chatWithGroq, cleanMarkdownText } from './chatbot.js';

// Configure process.env parameters using .env file settings
dotenv.config();

// Create the express application instance
const app = express();

// Configure CORS middleware to accept requests from all origins with credential sharing
app.use(cors({
  origin: '*', // In production, specify allowed origins
  credentials: true
}));
// Configure body parser to parse JSON payload formats
app.use(express.json());

// Set up Multer middleware to parse uploads and store them temporarily in RAM
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // Impose a file size boundary of 10 Megabytes
});

// Root route checking backend reachability
app.get('/', (req, res) => {
  return res.json({
    message: "Node.js Express Auth Backend is running",
    status: "healthy"
  });
});

// Post route to register new accounts
app.post('/signup', async (req, res) => {
  // Extract signup properties from request body
  const { name, email, password, confirm_password } = req.body;

  // Validate that name string is provided
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ detail: "Name is required" });
  }

  // Validate that email conforms to standard email regex syntax
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ detail: "Invalid email address format" });
  }

  // Validate that password is at least 6 characters in length
  if (!password || password.length < 6) {
    return res.status(400).json({ detail: "Password must be at least 6 characters" });
  }

  // Validate that password and confirmation string match exactly
  if (password !== confirm_password) {
    return res.status(400).json({ detail: "Password and confirm_password do not match" });
  }

  try {
    // Search database for pre-existing accounts with the requested email address
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    // If user exists, block request to prevent duplicate signups
    if (existingUser) {
      return res.status(409).json({ detail: "Email already registered. Please use a different email or login." });
    }

    // Securely hash the password using bcrypt rounds
    const hashedPassword = await hashPassword(password);

    // Write the new user document to MongoDB
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      hashed_password: hashedPassword,
      created_at: new Date()
    });

    // Return 201 Created response along with created user profile context (omitting hashed password)
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        created_at: newUser.created_at
      }
    });

  } catch (error) {
    // Log registration exception details
    console.error("Signup error:", error);
    // Return 500 server error response
    return res.status(500).json({ detail: `An error occurred during signup: ${error.message}` });
  }
});

// Post route to authenticate existing accounts and issue JWT tokens
app.post('/login', async (req, res) => {
  // Extract email and password credentials
  const { email, password } = req.body;

  // Validate that both values are present
  if (!email || !password) {
    return res.status(400).json({ detail: "Email and password are required" });
  }

  try {
    // Query database for a user matching the lowercase email
    const user = await User.findOne({ email: email.toLowerCase() });
    // Return 404 if user does not exist
    if (!user) {
      return res.status(404).json({ detail: "User not found with this email address" });
    }

    // Compare provided password with user's hashed password
    const isPasswordValid = await verifyPassword(password, user.hashed_password);
    // Return 401 if passwords do not match
    if (!isPasswordValid) {
      return res.status(401).json({ detail: "Invalid email or password" });
    }

    // Issue JWT access token containing standard identity claims
    const accessToken = createAccessToken({
      sub: user.email,
      user_id: user.id,
      name: user.name
    });

    // Return the token type, token string, and user details payload
    return res.json({
      access_token: accessToken,
      token_type: "bearer",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at
      }
    });

  } catch (error) {
    // Log authentication errors
    console.error("Login error:", error);
    // Return 500 server error response
    return res.status(500).json({ detail: `An error occurred during login: ${error.message}` });
  }
});

// Get route to fetch the authenticated user's profile context
app.get('/users/profile', requireAuth, async (req, res) => {
  // Return user info attached to request by auth middleware
  return res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    created_at: req.user.created_at
  });
});

// Put route to update user details (name or email)
app.put('/users/profile', requireAuth, async (req, res) => {
  // Extract name and email fields from body
  const { name, email } = req.body;

  // Enforce name length validation
  if (name && name.trim().length === 0) {
    return res.status(400).json({ detail: "Name cannot be empty" });
  }

  // Enforce email format regex check
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ detail: "Invalid email address format" });
  }

  try {
    // If email is changing, check if another account already occupies that email address
    if (email && email.toLowerCase() !== req.user.email.toLowerCase()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({ detail: "Email already registered by another account" });
      }
      req.user.email = email.toLowerCase();
    }

    // Save updated name parameters if provided
    if (name) req.user.name = name;
    // Persist changes to database
    await req.user.save();

    // Return the updated profile parameters
    return res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      created_at: req.user.created_at
    });
  } catch (error) {
    // Log profile update exceptions
    console.error("Profile update error:", error);
    return res.status(500).json({ detail: `Error updating profile: ${error.message}` });
  }
});

// Put route to update user password
app.put('/users/change-password', requireAuth, async (req, res) => {
  // Extract old and new password fields
  const { oldPassword, newPassword } = req.body;

  // Validate presence of both parameters
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ detail: "Both current and new password are required" });
  }

  // Validate minimum character constraint
  if (newPassword.length < 6) {
    return res.status(400).json({ detail: "New password must be at least 6 characters" });
  }

  try {
    // Verify that old password matches database record
    const isPasswordValid = await verifyPassword(oldPassword, req.user.hashed_password);
    if (!isPasswordValid) {
      return res.status(400).json({ detail: "Invalid current password" });
    }

    // Update password with new hashed string
    req.user.hashed_password = await hashPassword(newPassword);
    // Persist changes to database
    await req.user.save();

    // Return success message
    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    // Log password update failures
    console.error("Change password error:", error);
    return res.status(500).json({ detail: `Error changing password: ${error.message}` });
  }
});

// Get route to fetch user profile details by ID
app.get('/users/:user_id', async (req, res) => {
  // Retrieve user ID from route params
  const { user_id } = req.params;

  try {
    // Retrieve user document from database
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ detail: "User not found" });
    }

    // Return public user attributes
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at
    });
  } catch (error) {
    // Log error and return failure message
    console.error("Get user error:", error);
    return res.status(500).json({ detail: `Error retrieving user: ${error.message}` });
  }
});

// ============================================================================
// CONTRACT ANALYSIS ENDPOINTS (Requires Authentication)
// ============================================================================

// Post route to upload a PDF contract file and parse its category predictions using the BERT model worker
app.post('/contracts/analyze', requireAuth, upload.single('file'), async (req, res) => {
  try {
    // Enforce file payload presence validation
    if (!req.file) {
      return res.status(400).json({ detail: "Invalid file. Please upload a PDF file." });
    }
    // Block uploads that are not PDF MIME types
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ detail: "Invalid file type. Please upload a PDF file." });
    }

    // Load PDF raw bytes
    const pdfBuffer = req.file.buffer;
    // Process and extract plain text from PDF formatting structures
    const parsedPdf = await pdf(pdfBuffer);
    const extractedText = parsedPdf.text;

    // Reject files that contain no extractable text
    if (!extractedText || !extractedText.trim()) {
      return res.status(400).json({ detail: "No text could be extracted from PDF." });
    }

    // Dispatch raw text to the BERT python sub-process model client
    const analysisResult = await modelClient.predict(extractedText);
    const topPredictions = analysisResult.top_predictions || [];

    // Base64 encode the binary PDF file for potential storage or download needs
    const fileBase64 = pdfBuffer.toString('base64');

    // Create a new ContractAnalysis log document in MongoDB
    const dbAnalysis = await ContractAnalysis.create({
      user_id: req.user.id,
      filename: req.file.originalname || "contract.pdf",
      predicted_class: analysisResult.predicted_class,
      confidence: analysisResult.confidence,
      top_predictions: topPredictions,
      // Store a normalized snippet of the first 500 characters
      text_preview: extractedText.replace(/\s+/g, ' ').substring(0, 500),
      file_data: fileBase64,
      analysis_date: new Date()
    });

    // Return the analysis details and predictions
    return res.json({
      success: true,
      analysis_id: dbAnalysis.id,
      message: "Contract analyzed successfully",
      filename: dbAnalysis.filename,
      predicted_class: dbAnalysis.predicted_class,
      confidence: dbAnalysis.confidence,
      top_predictions: topPredictions,
      text_preview: dbAnalysis.text_preview,
      timestamp: new Date()
    });

  } catch (error) {
    // Log exception context and return error status
    console.error("Analysis error:", error);
    return res.status(400).json({ detail: `Contract analysis failed: ${error.message}` });
  }
});

// Post route to analyze contract type and prompt the Groq API for a detailed legal description/explanation
app.post('/contracts/analyze-with-explanation', requireAuth, upload.single('file'), async (req, res) => {
  try {
    // Enforce presence of file field
    if (!req.file) {
      return res.status(400).json({ detail: "Invalid file. Please upload a PDF file." });
    }
    // Block files that are not PDF
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ detail: "Invalid file type. Please upload a PDF file." });
    }

    // Read file buffer and extract text contents
    const pdfBuffer = req.file.buffer;
    const parsedPdf = await pdf(pdfBuffer);
    const extractedText = parsedPdf.text;

    // Check if any text was extracted
    if (!extractedText || !extractedText.trim()) {
      return res.status(400).json({ detail: "No text could be extracted from PDF." });
    }

    // Run BERT classification on the text
    const analysisResult = await modelClient.predict(extractedText);
    const predictedClass = analysisResult.predicted_class;
    const confidence = analysisResult.confidence;
    const topPredictions = analysisResult.top_predictions || [];

    // Slice the first 3000 characters to form a context snippet for the LLM call
    const contractTextExcerpt = extractedText.replace(/\s+/g, ' ').substring(0, 3000);

    // Formulate a detailed prompting instruction for legal classification explanation
    const llmPrompt = `
You are a contract analysis expert. I have analyzed a contract document using a machine learning model 
that classified it as: "${predictedClass}" (with ${confidence}% confidence).

Here is an excerpt from the contract:
---
${contractTextExcerpt}
---

Based on this contract excerpt and the classification as "${predictedClass}", please provide a detailed 
explanation of:

1. Why this contract was likely classified as "${predictedClass}"
2. Key indicators or clauses that support this classification
3. Important risks or considerations associated with this type of contract
4. Any notable patterns or language that led to this classification

Please be specific and professional in your analysis, referencing actual content from the contract excerpt where possible.
`;

    // Query Groq LLM API for structural analysis and explanation of the categorization
    const llmResult = await chatWithGroq(llmPrompt);
    // Block flow if LLM query fails
    if (!llmResult.success) {
      throw new Error(`LLM explanation failed: ${llmResult.error || 'Unknown error'}`);
    }

    // Clean markdown characters from LLM text output for uniform display format
    const cleanExplanation = cleanMarkdownText(llmResult.response || 'Unable to generate explanation');

    // Base64 encode the PDF file bytes
    const fileBase64 = pdfBuffer.toString('base64');

    // Persist analysis transaction to MongoDB
    const dbAnalysis = await ContractAnalysis.create({
      user_id: req.user.id,
      filename: req.file.originalname || "contract.pdf",
      predicted_class: predictedClass,
      confidence: confidence,
      top_predictions: topPredictions,
      text_preview: extractedText.replace(/\s+/g, ' ').substring(0, 500),
      file_data: fileBase64,
      analysis_date: new Date(),
      // Persist the generated legal explanation context text
      llm_explanation: cleanExplanation
    });

    // Return prediction status along with custom LLM analysis explanation
    return res.json({
      predicted_class: predictedClass,
      confidence: confidence,
      llm_explanation: cleanExplanation,
      analysis_id: dbAnalysis.id,
      filename: dbAnalysis.filename,
      top_predictions: topPredictions
    });

  } catch (error) {
    // Log exception stack and return failure response
    console.error("Analysis with explanation error:", error);
    return res.status(400).json({ detail: `Contract analysis with explanation failed: ${error.message}` });
  }
});

// Get route to fetch the authenticated user's analysis history list
app.get('/contracts/history', requireAuth, async (req, res) => {
  // Read pagination query parameters, setting fallback values
  const limit = parseInt(req.query.limit || '50', 10);
  const offset = parseInt(req.query.offset || '0', 10);

  try {
    // Retrieve matching user entries, sorted descending by date with limit restrictions
    const analyses = await ContractAnalysis.find({ user_id: req.user.id })
      .sort({ analysis_date: -1 })
      .skip(offset)
      .limit(limit)
      .select('id filename predicted_class confidence analysis_date');

    // Map database array documents to frontend friendly property naming structures
    const formatted = analyses.map(a => ({
      id: a.id,
      filename: a.filename,
      predicted_class: a.predicted_class,
      confidence: a.confidence,
      analysis_date: a.analysis_date
    }));

    // Send formatted history response array
    return res.json(formatted);
  } catch (error) {
    // Log exceptions and return server error
    console.error("History query error:", error);
    return res.status(500).json({ detail: `Failed to retrieve history: ${error.message}` });
  }
});

// Get route to fetch details of a specific analysis record
app.get('/contracts/:analysis_id', requireAuth, async (req, res) => {
  // Extract analysis primary key from URL params
  const { analysis_id } = req.params;

  try {
    // Retrieve record from database
    const analysis = await ContractAnalysis.findById(analysis_id);
    if (!analysis) {
      return res.status(404).json({ detail: "Analysis not found" });
    }

    // Verify ownership security constraint before releasing details
    if (analysis.user_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ detail: "You are not authorized to view this analysis" });
    }

    // Send analysis properties
    return res.json({
      id: analysis.id,
      filename: analysis.filename,
      predicted_class: analysis.predicted_class,
      confidence: analysis.confidence,
      top_predictions: analysis.top_predictions || [],
      text_preview: analysis.text_preview,
      analysis_date: analysis.analysis_date,
      user_id: analysis.user_id,
      // Include the persisted negotiation chat history associated with this contract
      chat_history: analysis.chat_history || [],
      // Include the persisted AI legal analysis explanation associated with this contract
      llm_explanation: analysis.llm_explanation || ""
    });
  } catch (error) {
    // Log exception and return server error
    console.error("Get details error:", error);
    return res.status(500).json({ detail: `Failed to retrieve analysis details: ${error.message}` });
  }
});

// Delete route to erase an analysis record by ID
app.delete('/contracts/:analysis_id', requireAuth, async (req, res) => {
  // Extract target record key from params
  const { analysis_id } = req.params;

  try {
    // Retrieve target document
    const analysis = await ContractAnalysis.findById(analysis_id);
    if (!analysis) {
      return res.status(404).json({ detail: "Analysis not found" });
    }

    // Enforce ownership validation checks
    if (analysis.user_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ detail: "You are not authorized to delete this analysis" });
    }

    // Delete document from MongoDB collection
    await analysis.deleteOne();

    // Return success confirmation response
    return res.json({
      success: true,
      message: `Analysis ${analysis_id} deleted successfully`
    });
  } catch (error) {
    // Log delete failures
    console.error("Delete analysis error:", error);
    return res.status(500).json({ detail: `Error deleting analysis: ${error.message}` });
  }
});

// Post route to generate and save detailed LLM analysis explanation for an existing contract record without creating duplicate entries
app.post('/contracts/:analysis_id/explain', requireAuth, async (req, res) => {
  // Extract target analysis record key from params
  const { analysis_id } = req.params;

  try {
    // Retrieve target document from database
    const analysis = await ContractAnalysis.findById(analysis_id);
    if (!analysis) {
      return res.status(404).json({ detail: "Analysis not found" });
    }

    // Enforce ownership validation checks
    if (analysis.user_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ detail: "You are not authorized to access this analysis" });
    }

    // Return the cached explanation immediately if it is already generated to conserve AI resources
    if (analysis.llm_explanation) {
      return res.json({
        predicted_class: analysis.predicted_class,
        confidence: analysis.confidence,
        llm_explanation: analysis.llm_explanation,
        analysis_id: analysis.id,
        filename: analysis.filename,
        top_predictions: analysis.top_predictions || []
      });
    }

    // Decode file data bytes and extract raw text contents from the PDF
    const pdfBuffer = Buffer.from(analysis.file_data, 'base64');
    const parsedPdf = await pdf(pdfBuffer);
    const extractedText = parsedPdf.text;

    // Check if any text was successfully parsed
    if (!extractedText || !extractedText.trim()) {
      return res.status(400).json({ detail: "No text could be extracted from contract." });
    }

    // Slice context snippet for LLM call
    const contractTextExcerpt = extractedText.replace(/\s+/g, ' ').substring(0, 3000);

    // Formulate prompting instructions for classification explanation
    const llmPrompt = `
You are a contract analysis expert. I have analyzed a contract document using a machine learning model 
that classified it as: "${analysis.predicted_class}" (with ${analysis.confidence}% confidence).

Here is an excerpt from the contract:
---
${contractTextExcerpt}
---

Based on this contract excerpt and the classification as "${analysis.predicted_class}", please provide a detailed 
explanation of:

1. Why this contract was likely classified as "${analysis.predicted_class}"
2. Key indicators or clauses that support this classification
3. Important risks or considerations associated with this type of contract
4. Any notable patterns or language that led to this classification

Please be specific and professional in your analysis, referencing actual content from the contract excerpt where possible.
`;

    // Query Groq LLM API
    const llmResult = await chatWithGroq(llmPrompt);
    if (!llmResult.success) {
      throw new Error(`LLM explanation failed: ${llmResult.error || 'Unknown error'}`);
    }

    // Clean explanation formatting text
    const cleanExplanation = cleanMarkdownText(llmResult.response || 'Unable to generate explanation');

    // Save generated explanation to MongoDB
    analysis.llm_explanation = cleanExplanation;
    await analysis.save();

    // Return predictions and explanation JSON data
    return res.json({
      predicted_class: analysis.predicted_class,
      confidence: analysis.confidence,
      llm_explanation: cleanExplanation,
      analysis_id: analysis.id,
      filename: analysis.filename,
      top_predictions: analysis.top_predictions || []
    });

  } catch (error) {
    // Log exception and return server failure details
    console.error("Generate explanation error:", error);
    return res.status(500).json({ detail: `Failed to generate explanation: ${error.message}` });
  }
});

// Get route to calculate and return aggregate contract analysis metrics for stats panel
app.get('/contracts/stats/summary', requireAuth, async (req, res) => {
  try {
    // Fetch all analysis records matching the logged-in user ID
    const analyses = await ContractAnalysis.find({ user_id: req.user.id });

    // Handle empty state responses
    if (!analyses || analyses.length === 0) {
      return res.json({
        total_analyses: 0,
        contract_types: {},
        average_confidence: 0,
        most_common_type: null
      });
    }

    // Initialize metrics counters
    const contract_types = {};
    let total_confidence = 0;
    let first_analysis = null;
    let latest_analysis = null;

    // Loop through history list to compute aggregates
    analyses.forEach(a => {
      const type = a.predicted_class;
      // Increment category occurrences counter
      contract_types[type] = (contract_types[type] || 0) + 1;
      // Accumulate confidence values
      total_confidence += a.confidence;

      // Track earliest and latest analysis date stamps
      const date = new Date(a.analysis_date);
      if (!first_analysis || date < first_analysis) first_analysis = date;
      if (!latest_analysis || date > latest_analysis) latest_analysis = date;
    });

    // Find the most frequent contract category type in the dataset
    let most_common_type = null;
    let maxCount = -1;
    for (const [type, count] of Object.entries(contract_types)) {
      if (count > maxCount) {
        maxCount = count;
        most_common_type = type;
      }
    }

    // Compute average confidence score rounded to 2 decimal places
    const average_confidence = Math.round((total_confidence / analyses.length) * 100) / 100;

    // Send statistics JSON response
    return res.json({
      total_analyses: analyses.length,
      contract_types,
      average_confidence,
      most_common_type,
      first_analysis,
      latest_analysis
    });

  } catch (error) {
    // Log exception and return server error
    console.error("Stats error:", error);
    return res.status(500).json({ detail: `Failed to retrieve statistics: ${error.message}` });
  }
});

// ============================================================================
// CHATBOT ENDPOINTS
// ============================================================================

// Post route to process user messages and prompt the legal chatbot advisor
app.post('/chat', requireAuth, async (req, res) => {
  // Extract chat components including analysis_id from request body
  const { message, conversation_history, analysis_id, temperature, max_tokens } = req.body;

  // Validate that user message string is not empty
  if (!message || message.trim().length === 0) {
    return res.status(400).json({ detail: "Message content is required" });
  }

  try {
    // Track message to send to LLM
    let contextPrompt = message;
    // Track target contract database document
    let contract = null;
    // Track past conversation history to feed to LLM context
    let historyForLLM = conversation_history || [];

    // If analysis_id is provided, retrieve contract and construct context
    if (analysis_id) {
      // Find the contract by primary key
      contract = await ContractAnalysis.findById(analysis_id);
      if (contract) {
        // Enforce ownership security validation
        if (contract.user_id.toString() !== req.user.id.toString()) {
          return res.status(403).json({ detail: "You are not authorized to access this contract" });
        }
        // Prefix message with the contract text snippet preview context
        contextPrompt = `[Context: The user is currently reviewing the contract named "${contract.filename}" which classified as "${contract.predicted_class}" and has this excerpt: "${contract.text_preview}"]\n\nQuestion: ${message}`;
        // If contract document already carries message history records, use them
        if (contract.chat_history && contract.chat_history.length > 0) {
          historyForLLM = contract.chat_history.map(h => ({
            role: h.role,
            content: h.content
          }));
        }
      }
    }

    // Request assistant response using chatbot module, supplying custom contextual prompt and history
    const result = await chatWithGroq(
      contextPrompt,
      historyForLLM,
      temperature || 0.7,
      max_tokens || 1024
    );

    // Return failure response immediately if chatbot query fails
    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }

    // If contract context is active, append both user and assistant messages to database history
    if (contract) {
      // Add user message details
      contract.chat_history.push({ role: 'user', content: message });
      // Add assistant response details
      contract.chat_history.push({ role: 'assistant', content: result.response });
      // Save changes to MongoDB
      await contract.save();
    }

    // Return response payload from Groq client
    return res.json({
      success: result.success,
      response: result.response,
      model: result.model,
      usage: result.usage,
      error: result.error
    });
  } catch (error) {
    // Log endpoints exceptions and return standard response payload indicating failure
    console.error("Chat endpoint error:", error);
    return res.json({
      success: false,
      response: null,
      error: `An error occurred: ${error.message}`,
      model: "openai/gpt-oss-120b"
    });
  }
});

// Get route checking status and health metrics of chatbot service
app.get('/chat/health', (req, res) => {
  return res.json({
    status: "operational",
    model: "openai/gpt-oss-120b",
    provider: "GROQ",
    service: "AI Chatbot"
  });
});

// Post route to dynamically generate professional contracts using Groq legal intelligence
app.post('/contracts/draft', requireAuth, async (req, res) => {
  // Extract contract details from req.body
  const { category, governingLaw, partyA, partyB, tone, covenants } = req.body;

  // Require category type field to formulate draft
  if (!category) {
    return res.status(400).json({ detail: "Contract category is required" });
  }

  // Construct structured drafting instructions for the LLM
  const prompt = `
You are an expert legal counsel and contract drafting assistant.
Please draft a comprehensive, legally sound, and professional contract matching the following details:
- Category/Type: ${category}
- Governing Law: ${governingLaw || "Not specified (use standard jurisdiction)"}
- Contracting Parties: Party A (Disclosing/First Party): ${partyA || "First Party"} and Party B (Receiving/Second Party): ${partyB || "Second Party"}
- Drafting Tone: ${tone || "Balanced"}
- Special Covenants / Notes: ${covenants || "None"}

Requirements:
1. Provide a professional, detailed document with appropriate legal clauses, definitions, and execution signatures.
2. Use markdown formatting with clear headings (e.g. #, ##, ###) and bold text to organize clauses.
3. Ensure the draft is customized specifically for these parties and details.
`;

  try {
    // Request drafting generation from chatbot helper function
    const result = await chatWithGroq(prompt, [], 0.5, 1500);
    // Return 500 error if drafting generation fails
    if (!result.success) {
      return res.status(500).json({ detail: `AI Drafting failed: ${result.error}` });
    }
    // Return generated draft document
    return res.json({
      success: true,
      draft: result.response,
      category,
      partyA,
      partyB
    });
  } catch (error) {
    // Log exception and return server error
    console.error("Drafting error:", error);
    return res.status(500).json({ detail: `Failed to draft contract: ${error.message}` });
  }
});

// Retrieve server target port from environmental variables, falling back to 8000
const PORT = process.env.PORT || 8000;

// Listen on configured network port and trigger database and Python worker startups
app.listen(PORT, async () => {
  console.log(`🚀 Node.js Express server running on port ${PORT}`);
  try {
    // Initialize database connectivity
    await initDb();
    // Initialize BERT PyTorch worker child process
    await modelClient.init();
    console.log('✓ Model client worker initialized successfully.');
  } catch (err) {
    // Log initialization stack errors
    console.error('✗ Failed to initialize database or model worker:', err);
  }
});
