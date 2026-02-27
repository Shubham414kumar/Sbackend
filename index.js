const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Security Middleware
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

// Set security headers
app.use(helmet());



// Prevent NoSQL query injection
app.use(mongoSanitize());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// XSS Input Sanitization
const { sanitizeBody, sanitizeQuery } = require('./src/middleware/sanitizer');
app.use(sanitizeBody);
app.use(sanitizeQuery);

// Auth-specific rate limiter
const { authLimiter } = require('./src/middleware/rateLimiter');
app.use('/api/auth', authLimiter);

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/courses', require('./src/routes/courseRoutes'));
app.use('/api/study', require('./src/routes/studyMaterialRoutes'));
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
