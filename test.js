const checks = [
    { name: 'express', path: 'express' },
    { name: 'mongoose', path: 'mongoose' },
    { name: 'cors', path: 'cors' },
    { name: 'dotenv', path: 'dotenv' },
    { name: 'helmet', path: 'helmet' },
    { name: 'express-mongo-sanitize', path: 'express-mongo-sanitize' },
    { name: 'express-rate-limit', path: 'express-rate-limit' },
    { name: 'hpp', path: 'hpp' },
    { name: 'sanitizer', path: './src/middleware/sanitizer' },
    { name: 'rateLimiter', path: './src/middleware/rateLimiter' },
    { name: 'authRoutes', path: './src/routes/authRoutes' },
    { name: 'courseRoutes', path: './src/routes/courseRoutes' },
    { name: 'studyMaterialRoutes', path: './src/routes/studyMaterialRoutes' },
    { name: 'quizRoutes', path: './src/routes/quizRoutes' },
    { name: 'gamificationRoutes', path: './src/routes/gamificationRoutes' },
    { name: 'aiRoutes', path: './src/routes/aiRoutes' },
    { name: 'paymentRoutes', path: './src/routes/paymentRoutes' },
    { name: 'vacancyRoutes', path: './src/routes/vacancyRoutes' },
    { name: 'notificationRoutes', path: './src/routes/notificationRoutes' },
    { name: 'admitCardRoutes', path: './src/routes/admitCardRoutes' },
    { name: 'resultRoutes', path: './src/routes/resultRoutes' },
    { name: 'commentRoutes', path: './src/routes/commentRoutes' }
];

console.log('Starting checks...');
checks.forEach(check => {
    try {
        require(check.path);
        console.log(`✅ ${check.name}`);
    } catch (e) {
        console.error(`❌ ${check.name} FAILED: ${e.message}`);
        console.error(e.stack);
        process.exit(1);
    }
});
console.log('All checks passed!');
