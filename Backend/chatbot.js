// Import Groq SDK to interact with the Groq API for LLM reasoning
import Groq from 'groq-sdk';
// Import dotenv to access variables from environment files
import dotenv from 'dotenv';

// Initialize configuration from .env file
dotenv.config();

// Retrieve Groq API key from environment variables
const GROQ_API_KEY = process.env.GROQ_API_KEY;
// Print warning in console logs if the Groq API Key is not set
if (!GROQ_API_KEY) {
  console.warn("WARNING: GROQ_API_KEY not found in environment variables");
}

// Instantiate Groq client wrapper with the key
const groqClient = new Groq({ apiKey: GROQ_API_KEY });
// Set the specific LLM model ID to use for inference
const MODEL_ID = "openai/gpt-oss-120b";

// Define the system instructions for the LLM chatbot to enforce an expert, highly professional legal counsel persona
const SYSTEM_PROMPT = `
You are a senior corporate legal counsel and contract negotiation expert. Your purpose is to provide highly professional, objective, and analytically rigorous legal guidance, contract analysis, and negotiation advice.

Operating Guidelines:
1. Tone & Demeanor:
   - Maintain a formal, objective, authoritative, and professional legal tone.
   - Avoid casual language, colloquialisms, conversational filler, or exclamation marks.
   - Speak with the precision, clarity, and caution expected of a senior attorney advising corporate clients.

2. Contract & Clause Analysis:
   - Provide highly structured analyses using numbered headings, bullet points, and defined terms.
   - Scrutinize clauses for subtle risks, allocation of liabilities, indemnities, warranties, and compliance issues.
   - Offer concrete alternative drafts or specific redline suggestions when requested or appropriate.
   - Distinguish clearly between market-standard terms and highly aggressive or unfavorable provisions.

3. General Behavior & Inquiries:
   - Respond to standard greetings formally (e.g., "Good day. How may I assist you with your legal or contract inquiries today?") and concisely.
   - Focus directly on addressing the query without unnecessary preface or conversational fluff.
   - Provide clear rationales for all recommendations.

4. Scope Limitation:
   - Strictly confine your assistance to contract-related matters and general legal information.
   - If a query falls outside legal or contract scope, decline formally: "This inquiry falls outside the scope of contract analysis and legal guidance. I am only authorized to assist with contract-related and legal matters."

5. Risk Disclaimer:
   - Do not provide binding, definitive legal advice or guarantee specific legal outcomes.
   - Always include a formal disclaimer: "Disclaimer: This analysis is for informational and educational purposes only and does not constitute definitive legal advice. You should consult a qualified attorney in the relevant jurisdiction before executing any agreement."
`;

/**
 * Sends a conversation messages list to the Groq API for a response
 * @param {string} userMessage - The new incoming message from the user
 * @param {Array} conversationHistory - List of past messages (role/content format)
 * @param {number} temperature - Creativity level of the LLM output (default 0.7)
 * @param {number} maxTokens - Max token length of the response (default 1024)
 * @returns {Promise<Object>} An object indicating success, assistant response text, and token usage
 */
export const chatWithGroq = async (userMessage, conversationHistory = [], temperature = 0.7, maxTokens = 1024) => {
  try {
    // Start message array with the default system instructions
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];

    // Append historical dialog messages if any exist
    if (conversationHistory && conversationHistory.length > 0) {
      messages.push(...conversationHistory);
    }

    // Append user's current message
    messages.push({ role: 'user', content: userMessage });

    // Request chat completion from the Groq API
    const response = await groqClient.chat.completions.create({
      messages,
      model: MODEL_ID,
      temperature,
      max_tokens: maxTokens,
      top_p: 1.0,
      stream: false
    });

    // Extract the generated reply content from the response
    const assistantMessage = response.choices[0]?.message?.content || "";

    // Return success object with token usage details
    return {
      success: true,
      response: assistantMessage,
      model: MODEL_ID,
      usage: {
        prompt_tokens: response.usage?.prompt_tokens || 0,
        completion_tokens: response.usage?.completion_tokens || 0,
        total_tokens: response.usage?.total_tokens || 0
      }
    };
  } catch (error) {
    // Log exception details
    console.error("Error in chatWithGroq:", error);
    // Return failure response status
    return {
      success: false,
      error: error.message || String(error),
      response: null,
      model: MODEL_ID
    };
  }
};

/**
 * Removes markdown formatting characters from a string to return plain text
 * @param {string} text - The input text containing markdown markers
 * @returns {string} The cleaned text string
 */
export const cleanMarkdownText = (text) => {
  // If the input is empty or null, return an empty string
  if (!text) return "";
  let cleaned = text;
  // Remove markdown headers (# Title)
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');
  // Remove markdown bold (**bold** or __bold__)
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, '$1');
  cleaned = cleaned.replace(/__(.+?)__/g, '$1');
  // Remove markdown italic (*italic* or _italic_)
  cleaned = cleaned.replace(/\*(.+?)\*/g, '$1');
  cleaned = cleaned.replace(/_(.+?)_/g, '$1');
  // Remove markdown tables (| col |)
  cleaned = cleaned.replace(/\|.*\|/g, '');
  // Remove markdown links ([label](url))
  cleaned = cleaned.replace(/\[(.+?)\]\(.+?\)/g, '$1');
  // Remove multi-line code blocks (```code```)
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');
  // Remove inline code ticks (`code`)
  cleaned = cleaned.replace(/`(.+?)`/g, '$1');
  // Remove horizontal separator lines (--- or ***)
  cleaned = cleaned.replace(/^(\-{3,}|\*{3,}|_{3,})$/gm, '');
  // Remove bullet point lists (* item or - item)
  cleaned = cleaned.replace(/^\s*[\*\-\+]\s+/gm, '');
  // Replace triple or more newlines with double newlines
  cleaned = cleaned.replace(/\n\n\n+/g, '\n\n');
  // Trim spaces and newlines from both ends of the text
  return cleaned.trim();
};
