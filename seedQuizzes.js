const mongoose = require('mongoose');
require('dotenv').config();

const Quiz = require('./src/models/Quiz');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const quiz = await Quiz.create({
            title: 'JEE Main Full Mock Test 1',
            description: 'Comprehensive mock test covering Physics, Chemistry, and Mathematics.',
            category: 'JEE',
            class: ['11', '12', 'dropper'],
            difficulty: 'Hard',
            duration: 180, // 3 hours
            totalMarks: 300,
            questions: [
                {
                    questionText: 'What is the SI unit of electric flux?',
                    options: ['Weber', 'Volt-meter', 'Tesla', 'Farad'],
                    correctOption: 1, // Volt-meter
                    marks: 4,
                    explanation: 'Electric flux = E * A, so units are (V/m) * m^2 = V*m.'
                },
                {
                    questionText: 'Which of the following is an electrophile?',
                    options: ['H2O', 'NH3', 'AlCl3', 'C2H5OH'],
                    correctOption: 2, // AlCl3
                    marks: 4,
                    explanation: 'AlCl3 is electron-deficient and acts as a Lewis acid (electrophile).'
                },
                {
                    questionText: 'Evaluate the integral of x^2 dx from 0 to 1.',
                    options: ['1', '1/3', '1/2', '0'],
                    correctOption: 1, // 1/3
                    marks: 4,
                    explanation: 'Integral of x^2 is x^3/3. Evaluated from 0 to 1, it is 1/3.'
                }
            ]
        });

        console.log('Quiz Seeded successfully. Quiz ID:', quiz._id);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

seed();
