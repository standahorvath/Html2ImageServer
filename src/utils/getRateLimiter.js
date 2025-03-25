const rateLimit = require('express-rate-limit');

function getRateLimiter() {
  const windowSeconds = parseInt(process.env.RATE_LIMIT_WINDOW || '60', 10);
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX || '10', 10);

  return rateLimit({
    windowMs: windowSeconds * 1000,
    max: maxRequests,
    message: { error: 'Too many requests. Please try again later.' },
  });
}

module.exports = getRateLimiter;
