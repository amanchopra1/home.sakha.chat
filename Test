  const axios = require('axios');

let chatHistory = []; // This will store the chat history in memory

module.exports = async (req, res) => {
  const { prompt } = req.body;

  // Update chat history with the user prompt
  chatHistory.push({ role: 'user', content: prompt });

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo-1106', // Adjusted model
        messages: [
          { role: 'system', content: 'You are a spiritual assistant.' },
          ...chatHistory, // Include the chat history for context
          { role: 'user', content: prompt } // The latest user message
        ],
        max_tokens: 300,
        temperature: 0.5,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Get AI response
    const aiMessage = response.data.choices[0].message.content;

    // Update chat history with the AI response
    chatHistory.push({ role: 'assistant', content: aiMessage });

    // Send the response back to the client
    res.status(200).json({ message: aiMessage });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
