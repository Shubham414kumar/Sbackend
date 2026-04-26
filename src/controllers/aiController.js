const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

// Initialize Anthropic (Claude)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are SaarthiPrep AI, an expert tutor for Indian government exam preparation.
You help students prepare for SSC, Banking, UPSC, Railways, Defence, Teaching, and State-level exams.
Provide clear, accurate, and concise answers. Use Hindi-English mix when appropriate.
Include mnemonics, tricks, and shortcuts wherever possible.
Format your answers with bullet points and headings for easy reading.
If asked about current affairs, provide the most recent information you have.
Always be encouraging and supportive.`;

exports.askAI = async (req, res) => {
  try {
    const { question, conversationHistory = [] } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.json({
        answer: "⚠️ AI Key Missing! Please add ANTHROPIC_API_KEY in server/.env file.\n\nThis is a placeholder response."
      });
    }

    // Build messages with conversation history for context
    const messages = [
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: "user", content: question }
    ];

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages,
    });

    const text = response.content[0].text;

    res.json({
      answer: text,
      model: "claude-3-haiku",
      tokensUsed: response.usage?.output_tokens || 0
    });

  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ message: "Failed to get AI response. Please try again." });
  }
};
