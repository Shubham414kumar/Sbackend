const rateLimit = require('express-rate-limit');

// General API rate limiter — 100 requests per minute per IP
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
});

// Auth rate limiter — 10 login/signup attempts per 15 minutes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many login attempts, please try again after 15 minutes.' },
});

// Notification send limiter — 5 sends per minute (admin)
const notificationLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Notification rate limit exceeded.' },
});

module.exports = { apiLimiter, authLimiter, notificationLimiter };
