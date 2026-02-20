const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

// Initialize Anthropic (Claude)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

exports.askAI = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.json({
        answer: "Key Missing! Please add ANTHROPIC_API_KEY in server/.env file.\n\nMock Answer: " + question
      });
    }

    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      messages: [{ role: "user", content: question }],
    });

    const text = response.content[0].text;

    res.json({ answer: text });

  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ message: "Failed to get AI response. " + err.message });
  }
};
