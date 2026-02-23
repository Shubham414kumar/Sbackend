const mongoose = require('mongoose');
require('dotenv').config();

const Course = require('./src/models/Course');
const Lesson = require('./src/models/Lesson');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Ensure to support the new array format or single string based on Mongoose schema flexibility
        const course = await Course.create({
            title: 'Mastering React Native 2026',
            description: 'Advanced mobile development featuring new architecture and backend hooks.',
            thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
            category: 'Tech',
            class: ['11', '12', 'dropper'],
            instructor: 'Saarthi AI',
            price: 0,
            rating: 5.0
        });

        await Lesson.create({
            courseId: course._id,
            title: 'Expo Networking and Caching',
            videoUrl: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
            order: 1,
            duration: '15 min'
        });

        console.log('Seeded successfully. Course ID:', course._id);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

seed();
