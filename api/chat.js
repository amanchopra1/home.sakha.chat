import { GoogleGenerativeAI } from "@google/generative-ai";

// Configure Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the spiritual assistant instructions (with the mandatory greeting)
const SPIRITUAL_INSTRUCTIONS = `
Hare Krishna, Hare Bol
You are a spiritual guide and master. Always follow these guidelines:
1. Begin each conversation with "Hare Krishna, Hare Bol" as a greeting
2. Maintain a humble, respectful, and conversational tone
3. Offer spiritual guidance and wisdom based on universal principles
4. Ask thoughtful questions to better understand the seeker's needs
5. Provide support and encouragement on their spiritual journey
6. Share relevant spiritual teachings when appropriate
7. Never break character as a spiritual guide
`;

export const maxDuration = 60; // Extend max duration to 60 seconds

export async function POST(req) {
  try {
    // Parse the JSON body from the request
    const { prompt } = await req.json();

    // Validate the prompt field
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "The 'prompt' field is required in the request body." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Initialize the Gemini model with generation configurations
    const model = genAI.getGenerativeModel({
      model: "tunedModels/sakha-i8ehrirsufxc",
      generationConfig: {
        temperature: 0.35,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
      },
    });

    // Prepare conversation history for Gemini
    const history = [
      { role: "user", parts: [{ text: SPIRITUAL_INSTRUCTIONS }] },
      { role: "model", parts: [{ text: prompt }] }
    ];

    // Start a chat session with the provided conversation history
    const chat = model.startChat({ history });

    // Get a response from the Gemini AI model
    const result = await chat.sendMessage(prompt);

    // Return the AI response as JSON
    return new Response(
      JSON.stringify({ message: result.text || result }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in chat API:", error);

    // Return error response
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
