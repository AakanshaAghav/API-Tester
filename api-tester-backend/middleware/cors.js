const cors = require('cors');

// Read origins from the environment variable, split by comma, and trim any spaces
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

module.exports = cors({
  origin: function (origin, callback) {
    // 1. Allow requests with no origin (like server-to-server or Postman)
    if (!origin) return callback(null, true);

    // 2. Allow any localhost port for local development
    if (/^http:\/\/localhost(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    // 3. Allow any 127.0.0.1 port
    if (/^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    // 4. Check if the incoming origin matches our environment list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // If it doesn't match any, block the request
    callback(new Error('CORS not allowed for origin: ' + origin));
  },
  credentials: true,
});