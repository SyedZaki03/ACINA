// Define the Backend server base address for API requests
const API_BASE_URL = "http://localhost:8000";

/**
 * Service function to upload contract file and fetch prediction classification and LLM description
 * @param {File} file - The file element obtained from the browser input
 * @param {string} token - The user session JWT access token string
 * @returns {Promise<Object>} The API response JSON payload
 */
export const analyzeContractWithExplanation = async (file, token) => {
  // Validate that a file parameter was supplied
  if (!file) {
    throw new Error("Please select a PDF file");
  }

  // Enforce validation to restrict non-PDF file mime-types
  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed");
  }

  // Verify that an authentication token is supplied
  if (!token) {
    throw new Error("Please login first");
  }

  // Create multipart FormData instance to carry binary file fields
  const formData = new FormData();
  // Append binary file object
  formData.append("file", file);

  try {
    // Log target endpoint path details
    console.log("📤 Sending request to:", `${API_BASE_URL}/contracts/analyze-with-explanation`);
    // Log attributes of the file being sent
    console.log("📁 File:", file.name, file.type);
    
    // Set up request abort controller to enforce a network timeout limit
    const controller = new AbortController();
    // Configure timer to trigger abort after 60 seconds (60,000 milliseconds)
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    // Perform the asynchronous POST request to the backend server
    const response = await fetch(
      `${API_BASE_URL}/contracts/analyze-with-explanation`,
      {
        method: "POST",
        headers: {
          // Provide JWT access token within the Authorization Bearer header
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        // Bind the timeout signal to the fetch controller
        signal: controller.signal,
      }
    );

    // Cancel the timer since response has been received
    clearTimeout(timeoutId);

    // Log the resulting HTTP status code
    console.log("📥 Response status:", response.status);
    
    // Check if HTTP response status is successful (2xx range)
    if (!response.ok) {
      let errorMessage = `Server error: ${response.status}`;
      try {
        // Try parsing JSON error detail body
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.error || errorMessage;
      } catch (e) {
        // Fall back to reading plain text error payload
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      // Throw the extracted error message
      throw new Error(errorMessage);
    }

    // Parse successfully returned JSON response
    const data = await response.json();
    console.log("✅ Response received:", data);
    // Return response object to caller
    return data;
  } catch (error) {
    // Distinguish between timeout abort errors and other network exceptions
    if (error.name === 'AbortError') {
      console.error("⏱️ Request timeout - Server took too long to respond");
      throw new Error("Request timeout - Server took too long to respond. Please check if backend is running.");
    }
    // Log general errors
    console.error("❌ Error:", error);
    // Throw error payload details
    throw new Error(error.message || "Failed to analyze contract");
  }
};

/**
 * Service function to request and fetch deep legal explanation for an existing contract record
 * @param {string} analysisId - The MongoDB document primary key for the contract analysis
 * @param {string} token - The user session JWT access token string
 * @returns {Promise<Object>} The API response JSON payload carrying the explanation
 */
export const fetchExplanation = async (analysisId, token) => {
  // Verify parameters presence
  if (!analysisId) {
    throw new Error("Missing contract analysis record ID");
  }
  if (!token) {
    throw new Error("Authentication token is missing. Please login.");
  }

  try {
    // Perform asynchronous POST request to backend explain endpoint
    const response = await fetch(`${API_BASE_URL}/contracts/${analysisId}/explain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    // Parse returned JSON data
    const data = await response.json();

    // Catch HTTP error status codes
    if (!response.ok) {
      throw new Error(data.detail || data.error || `Server error: ${response.status}`);
    }

    // Return results payload
    return data;
  } catch (error) {
    console.error("❌ fetchExplanation Error:", error);
    throw new Error(error.message || "Failed to fetch contract explanation");
  }
};
