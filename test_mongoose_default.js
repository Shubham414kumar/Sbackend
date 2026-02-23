const mongoose = require('mongoose');
const User = require('./src/models/User');

const test = new User({ name: 'Test', email: 'test@example.com', password: 'abc' });
console.log('New User default xp:', test.xp);

const rawDoc = { name: 'Old', email: 'old@example.com', password: 'abc' };
const oldUser = new User(rawDoc, false); // Initialize from DB without applying defaults maybe?
oldUser.init(rawDoc); // Mock what findOne does
console.log('Old User init xp:', oldUser.xp);
