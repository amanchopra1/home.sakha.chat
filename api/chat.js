import { GoogleGenerativeAI } from "@google/generative-ai";

// Configure Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// True system prompt for Sakha
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
`;

// In-memory chat history storage (in production, use a real DB)
const chatHistories = new Map();

export const maxDuration = 60;

export async function POST(req) {
  try {
    const { prompt, sessionId, chatHistory } = await req.json();
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "The 'prompt' field is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 1. Initialize the finetuned model with tight sampling & repetition penalty
    const model = genAI.getGenerativeModel({
      model: "tunedModels/sakha-i8ehrirsufxc",
      generationConfig: {
        temperature: 0.2,
        topP: 0.6,
        topK: 20,
     
        maxOutputTokens: 8192,
      },
    });

    // 2. Build or retrieve conversation history
    let history = [];
    if (sessionId && chatHistories.has(sessionId)) {
      history = chatHistories.get(sessionId);
    } else if (Array.isArray(chatHistory) && chatHistory.length) {
      history = chatHistory;
    }

    // 3. Start chat with systemInstruction & prefixMessages to lock persona
    const chat = model.startChat({
      systemInstruction: SPIRITUAL_INSTRUCTIONS,
      prefixMessages: [
        { role: "user",  content: "hi" },
        { role: "model", content: "Hare Krishna! I am Sakha, your spiritual guide. How may I assist you on your path today?" }
      ],
      history
    });

    // 4. Send the user’s prompt and get a response
    const result = await chat.sendMessage(prompt);

    // 5. Update history & optionally store it
    const reply = result.response.candidates[0].content.parts[0].text;
    history.push({ role: "user",  content: prompt });
    history.push({ role: "model", content: reply });

    if (sessionId) chatHistories.set(sessionId, history);

    // 6. Return the reply
    return new Response(
      JSON.stringify({ reply, chatHistory: history }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
