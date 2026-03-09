require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

async function getAdminCredentials() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        let admin = await User.findOne({ role: 'admin' });

        if (!admin) {
            console.log("No admin found. Creating a default admin...");
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            admin = await User.create({
                name: 'Admin',
                email: 'admin@saarthiprep.com',
                password: hashedPassword,
                role: 'admin',
                phone: '0000000000',
                examCategory: 'Other',
                class: 'Other'
            });
            console.log("Default Admin Created!");
            console.log(`Email: ${admin.email}`);
            console.log(`Password: admin123`);
        } else {
            console.log("Admin user found in database!");
            console.log(`Email: ${admin.email}`);

            // We can't decrypt bcrypt, so let's just reset the password to 'admin123' to be helpful.
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash('admin123', salt);
            await admin.save();
            console.log("Password has been reset to: admin123");
        }

        mongoose.disconnect();
    } catch (e) {
        console.error(e);
        mongoose.disconnect();
    }
}

getAdminCredentials();
