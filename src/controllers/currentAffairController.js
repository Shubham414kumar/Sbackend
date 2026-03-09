const CurrentAffair = require('../models/CurrentAffair');
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const getAffairs = async (req, res) => {
    try {
        const { date } = req.query;
        let query = {};
        if (date) {
            query.date = date;
        }

        const affairs = await CurrentAffair.find(query).sort({ createdAt: -1 }); // Recently added first
        res.json(affairs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const generateDailyAffairs = async (req, res) => {
    try {
        const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

        // Check if already generated for today
        const existing = await CurrentAffair.findOne({ date: today });
        if (existing) {
            return res.status(200).json({ message: 'Current affairs for today already exist.' });
        }

        const prompt = `Generate 5-8 multiple-choice style current affairs specifically for Indian competitive exams (like SSC, UPSC, Railways, Banking). 
        Top 5 most important news of today (${today}).
        
        Strictly output a JSON array of objects. Do not include markdown formatting like \`\`\`json.
        Each object should have:
        - title: String (Headline in English)
        - titleHindi: String (Headline accurately translated into Hindi using Devanagari script)
        - description: String (2-3 sentences max in English)
        - descriptionHindi: String (2-3 sentences max accurately translated into Hindi using Devanagari script)
        - category: String (Choose one: National, International, Economy, Science & Tech, Sports, Polity, Environment, Art & Culture, Education, Other)
        - icon: String (A relevant emoji)
        - important: Boolean (true if very major news)
        
        Focus on factual accuracy and high quality Hindi translations.`;

        const completion = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 2048,
            messages: [{ role: "user", content: prompt }]
        });

        const textResponse = completion.content[0].text;

        // Clean up response if it contains markdown code blocks
        const jsonString = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

        const affairsData = JSON.parse(jsonString);

        // Add date to each item
        const affairsWithDate = affairsData.map(item => ({
            ...item,
            date: today
        }));

        await CurrentAffair.insertMany(affairsWithDate);

        res.status(201).json({ message: 'Daily current affairs generated successfully', count: affairsWithDate.length });

    } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({ message: 'Failed to generate current affairs', error: error.message });
    }
};

module.exports = {
    getAffairs,
    generateDailyAffairs
};
