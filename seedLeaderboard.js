const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const dummyUsers = [
            {
                name: 'Neon Samurai',
                email: 'neon@saarthiprep.com',
                password: 'password123',
                xp: 95000,
                level: 31,
                streakCount: 145
            },
            {
                name: 'Anime Pacer',
                email: 'anime@saarthiprep.com',
                password: 'password123',
                xp: 82000,
                level: 28,
                streakCount: 90
            },
            {
                name: 'Cyber Ninja',
                email: 'cyber@saarthiprep.com',
                password: 'password123',
                xp: 75000,
                level: 27,
                streakCount: 75
            },
            {
                name: 'Kratos',
                email: 'kratos@saarthiprep.com',
                password: 'password123',
                xp: 45000,
                level: 21,
                streakCount: 40
            },
            {
                name: 'Elden Lord',
                email: 'elden@saarthiprep.com',
                password: 'password123',
                xp: 12000,
                level: 11,
                streakCount: 12
            }
        ];

        const inserted = await User.insertMany(dummyUsers);
        console.log(`Successfully seeded ${inserted.length} high-rank dummy users.`);

    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

seed();
