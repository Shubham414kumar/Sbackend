const mongoose = require('mongoose');
require('dotenv').config();

const AdmitCard = require('./src/models/AdmitCard');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const dummyCards = [
            {
                examName: 'CTET Jan 2026',
                examDate: '21 Jan 2026',
                releaseDate: '15 Jan 2026',
                status: 'Released',
                downloadUrl: 'https://ctet.nic.in',
                examCategory: 'Teaching'
            },
            {
                examName: 'SBI PO Mains',
                examDate: '5 March 2026',
                releaseDate: '1 March 2026',
                status: 'Upcoming',
                downloadUrl: '',
                examCategory: 'Banking'
            }
        ];

        const inserted = await AdmitCard.insertMany(dummyCards);
        console.log(`Successfully seeded ${inserted.length} dummy admit cards.`);

    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

seed();
