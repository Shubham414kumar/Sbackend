const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers
app.use(helmet());

// Request Logging
app.use(morgan('combined'));

// CORS — configure for production
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security Middleware
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

// Prevent NoSQL query injection
app.use(mongoSanitize());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 200, message: { message: 'Too many requests, please try again later.' } });
app.use('/api', limiter);

// XSS Input Sanitization
const { sanitizeBody, sanitizeQuery } = require('./src/middleware/sanitizer');
app.use(sanitizeBody);
app.use(sanitizeQuery);

// Auth-specific rate limiter (stricter)
const { authLimiter } = require('./src/middleware/rateLimiter');
app.use('/api/auth', authLimiter);

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/search', require('./src/routes/searchRoutes'));
app.use('/api/courses', require('./src/routes/courseRoutes'));
app.use('/api/study-materials', require('./src/routes/studyMaterialRoutes'));
app.use('/api/quizzes', require('./src/routes/quizRoutes'));
app.use('/api/gamification', require('./src/routes/gamificationRoutes'));
app.use('/api/ai', require('./src/routes/aiRoutes'));
app.use('/api/payment', require('./src/routes/paymentRoutes'));
app.use('/api/vacancies', require('./src/routes/vacancyRoutes'));
app.use('/api/notifications', require('./src/routes/notificationRoutes'));
app.use('/api/admit-cards', require('./src/routes/admitCardRoutes'));
app.use('/api/results', require('./src/routes/resultRoutes'));
app.use('/api/comments', require('./src/routes/commentRoutes'));
app.use('/api/current-affairs', require('./src/routes/currentAffairRoutes'));
app.use('/api/upload', require('./src/routes/uploadRoutes'));
app.use('/api/analytics', require('./src/routes/analyticsRoutes'));
app.use('/api/applications', require('./src/routes/applicationRoutes'));
app.use('/api/notes', require('./src/routes/noteRoutes'));
app.use('/api/study-plans', require('./src/routes/studyPlanRoutes'));
app.get('/', (req, res) => {
  res.send('SaarthiPrep API is running');
});

// Global Error Handling Middleware
const errorHandler = require('./src/middleware/errorHandler');
app.use(errorHandler);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/saarthiprep')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
