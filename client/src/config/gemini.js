import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Default Model Name and API Key
const DEFAULT_MODEL_NAME = "gemini-2.0-flash"; // Default model
const DEFAULT_API_KEY = "AIzaSyCurOei1JQ8nCDXwx6PQapt1h10EszlrsQ"; // Replace with your actual API key

// Default Generation Configuration
const defaultGenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2048,
  responseMimeType: "text/plain",
};

// Safety Settings to filter harmful content
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Initialize Google Generative AI Instance
function initializeGenerativeAI(apiKey = DEFAULT_API_KEY, modelName = DEFAULT_MODEL_NAME) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({
      model: modelName,
    });
  } catch (error) {
    console.error("Error initializing Generative AI:", error);
    throw error;
  }
}

// Unified Function for Chat Requests
async function runChat(prompt, apiKey = DEFAULT_API_KEY, modelName = DEFAULT_MODEL_NAME) {
  const model = initializeGenerativeAI(apiKey, modelName);

  // Start a chat session with specified configuration
  const chatSession = model.startChat({
    generationConfig: { ...defaultGenerationConfig },
    safetySettings, // Apply safety settings
    history: [], // Initialize with no prior chat history
  });

  try {
    // Send a message and return the AI's response
    const result = await chatSession.sendMessage(prompt);
    return result.response.text(); // Extract and return the text response
  } catch (error) {
    console.error("Error during chat request:", error);
    throw error;
  }
}

// Export Function for External Use
export default runChat;
