const rateLimit = require('express-rate-limit');

// Skip rate limiting for localhost/development
const skipLocalhost = (req) => {
    return req.ip === '127.0.0.1' ||
        req.ip === '::1' ||
        req.ip === 'localhost' ||
        req.hostname === 'localhost';
};

// General Limiter: For most routes (500 requests per 15 minutes)
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500,
    skip: skipLocalhost, // Skip for localhost
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many requests from this IP, please try again after 15 minutes'
    }
});

// Strict Limiter: For sensitive routes (1000 requests per 15 minutes)
const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
    skip: skipLocalhost, // Skip for localhost
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many attempts, please try again later'
    }
});

module.exports = { generalLimiter, strictLimiter };
