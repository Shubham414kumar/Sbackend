const mongoose = require('mongoose');
require('dotenv').config();

const Vacancy = require('./src/models/Vacancy');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const dummyVacancies = [
            {
                title: 'SSC CGL 2026',
                organization: 'Staff Selection Commission',
                examCategory: 'SSC',
                lastDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
                vacancies: 8500,
                eligibility: 'Graduation',
                salary: '₹44,900 - ₹1,42,400',
                applicationUrl: 'https://ssc.nic.in',
                status: 'Active',
                documentsRequired: ['Aadhar Card', 'Graduation Marksheet', 'Passport Photo', 'Signature']
            },
            {
                title: 'SBI PO Recruitment',
                organization: 'State Bank of India',
                examCategory: 'Banking',
                lastDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
                vacancies: 2000,
                eligibility: 'Graduation in any discipline',
                salary: '₹41,960 (Basic Pay)',
                applicationUrl: 'https://sbi.co.in/web/careers',
                status: 'Active',
                documentsRequired: ['ID Proof', 'Graduation Degree', 'Category Certificate']
            }
        ];

        const inserted = await Vacancy.insertMany(dummyVacancies);
        console.log(`Successfully seeded ${inserted.length} dummy vacancies.`);

    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

seed();
