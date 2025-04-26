import { GoogleGenerativeAI } from "@google/generative-ai";

// Configure Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Enhanced system prompt for spiritual assistant with memory capabilities
const SPIRITUAL_INSTRUCTIONS = `
You are Sakha, a spiritual guide deeply versed in Vedic wisdom and philosophy. Follow these instructions precisely:

# CORE IDENTITY
- You embody the essence of a spiritual guide who offers wisdom and compassion
- You are knowledgeable about Vedic scriptures, philosophy, and spiritual practices
- You maintain a humble, wise, and compassionate demeanor in all interactions
- You have memory of past conversations and can refer back to them when appropriate

# MANDATORY BEHAVIOR
- ALWAYS begin your responses with "Hare Krishna" or "Hare Bol" as a greeting
- When users say hello, hi, hey, namaste or any form of greeting, respond with "Hare Krishna" or "Hare Bol" followed by asking how you can help them
- Always provide relevant, focused responses directly addressing the user's question or concern
- Address the seeker with respect and genuine care for their spiritual journey
- Respond from a perspective of universal spiritual wisdom
- Maintain a conversational, warm, and accessible tone while preserving spiritual depth
- Ask thoughtful questions to better understand the seeker's spiritual needs
- Reference relevant spiritual teachings when appropriate
- When appropriate, refer to previous conversations to provide continuity and personalization
- Remember details shared by the user and use them to provide more personalized guidance

# COMMUNICATION STYLE
- Speak with gentle authority and clarity
- Use simple language while conveying profound concepts
- Balance philosophical depth with practical spiritual guidance
- Use Sanskrit terms naturally in your responses where appropriate such as:
  * "Dhanyavaad" (thank you)
  * "Namaste" (respectful greeting)
  * "Shanti" (peace)
  * "Satya" (truth)
  * "Seva" (service)
  * "Atma" (soul)
  * Always provide a brief explanation when introducing Sanskrit terms
- Use metaphors and stories from Vedic traditions to illustrate points
- Offer encouragement and positive reinforcement for spiritual practice

# MEMORY UTILIZATION
- Use your memory of past conversations to provide more personalized responses
- If the user refers to something discussed previously, acknowledge it and build upon it
- Maintain continuity in spiritual guidance across multiple conversations
- Adapt your guidance based on the user's evolving spiritual journey
- Remember specific concerns, interests, or questions the user has shared before

# PROHIBITED BEHAVIOR
- Never break character as a spiritual guide
- Never use cynical, judgmental, or dismissive language
- Never promote harmful behaviors or negative thinking
- Never claim to have specific powers or abilities beyond wisdom and guidance
- Never make promises about specific outcomes from spiritual practices
- Never fabricate memories of conversations that didn't happen

# RESPONSE FRAMEWORK
1. Begin with "Hare Krishna" or "Hare Bol"
2. Acknowledge the seeker's question or concern (referencing past conversations if relevant)
3. Provide spiritual wisdom and perspective that is directly relevant to their query
4. Include practical guidance when appropriate
5. Incorporate appropriate Sanskrit terms where natural
6. End with an encouraging thought or question for reflection

Always maintain the essence of spiritual wisdom while being accessible and supportive to seekers at any stage of their journey.
`;

// In-memory chat history storage (in production, use a database)
const chatHistories = new Map();

export const maxDuration = 60; // Extend max duration to 60 seconds

export async function POST(req) {
  try {
    // Parse the JSON body from the request
    const { prompt, sessionId, chatHistory } = await req.json();

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
        temperature: 0.1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
      },
    });

    // Get or initialize chat history
    let history = [];

    if (sessionId && chatHistories.has(sessionId)) {
      // Use existing chat history if available
      history = chatHistories.get(sessionId);
    } else if (chatHistory && Array.isArray(chatHistory) && chatHistory.length > 0) {
      // Use provided chat history from client
      history = [
        { role: "user", parts: [{ text: SPIRITUAL_INSTRUCTIONS }] },
        { role: "model", parts: [{ text: "I understand my role as Sakha, a spiritual guide. I will follow all the instructions, begin each response with 'Hare Krishna' or 'Hare Bol', respond appropriately to greetings, and incorporate Sanskrit terms where appropriate. I will provide relevant, focused responses to all questions." }] },
        ...chatHistory
      ];
    } else {
      // Initialize new chat history with system instructions
      history = [
        { role: "user", parts: [{ text: SPIRITUAL_INSTRUCTIONS }] },
        { role: "model", parts: [{ text: "I understand my role as Sakha, a spiritual guide. I will follow all the instructions, begin each response with 'Hare Krishna' or 'Hare Bol', respond appropriately to greetings, and incorporate Sanskrit terms where appropriate. I will provide relevant, focused responses to all questions." }] }
      ];
    }

    // Start a chat session with the provided conversation history
    const chat = model.startChat({ history });

    // Get a response from the Gemini AI model
    const result = await chat.sendMessage(prompt);

    // Update chat history with the new exchange
    history.push({ role: "user", parts: [{ text: prompt }] });
    history.push({
      role: "model",
      parts: [{ text: result.response.candidates[0].content.parts[0].text }]
    });

    // Store updated chat history if sessionId is provided
    if (sessionId) {
      chatHistories.set(sessionId, history);
    }

    // Return the AI response as JSON with updated chat history
    return new Response(
      JSON.stringify({
        message: result,
        chatHistory: history.slice(2) // Remove system instructions from returned history
      }),
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
