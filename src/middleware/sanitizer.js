const xss = require('xss');

/**
 * Sanitize all string fields in req.body to prevent XSS
 */
function sanitizeBody(req, res, next) {
    if (req.body && typeof req.body === 'object') {
        sanitizeObject(req.body);
    }
    next();
}

/**
 * Sanitize all string fields in req.query
 */
function sanitizeQuery(req, res, next) {
    if (req.query && typeof req.query === 'object') {
        sanitizeObject(req.query);
    }
    next();
}

function sanitizeObject(obj) {
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            obj[key] = xss(obj[key].trim());
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitizeObject(obj[key]);
        }
    }
}

/**
 * Validate MongoDB ObjectId format
 */
function validateObjectId(paramName = 'id') {
    return (req, res, next) => {
        const id = req.params[paramName];
        if (id && !/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.status(400).json({ error: `Invalid ${paramName} format` });
        }
        next();
    };
}

module.exports = { sanitizeBody, sanitizeQuery, validateObjectId };
