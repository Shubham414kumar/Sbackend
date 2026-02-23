const mongoose = require('mongoose');
require('dotenv').config();

const CurrentAffair = require('./src/models/CurrentAffair');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const dummyAffairs = [
            {
                date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
                title: 'ISRO successfully launches new Earth Observation Satellite',
                description: 'India\'s space agency successfully placed the EOS-08 satellite into intended orbit, boosting disaster management capabilities.',
                category: 'Science & Tech',
                icon: '🚀',
                important: true
            },
            {
                date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
                title: 'RBI Monetary Policy: Repo Rate remains unchanged at 6.5%',
                description: 'The MPC decided to keep the policy repo rate under the liquidity adjustment facility (LAF) unchanged to manage inflation.',
                category: 'Economy',
                icon: '🏦',
                important: true
            },
            {
                date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
                title: 'India wins Gold in Asian Games Hockey',
                description: 'The Indian Men\'s Hockey team secured a historic victory in the finals, qualifying for the upcoming Olympics.',
                category: 'Sports',
                icon: '🏑',
                important: false
            }
        ];

        const inserted = await CurrentAffair.insertMany(dummyAffairs);
        console.log(`Successfully seeded ${inserted.length} dummy current affairs.`);

    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

seed();
