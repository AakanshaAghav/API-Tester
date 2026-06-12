const cors = require('cors');

const allowedOrigins = [
  'https://api-tester-app-ochre.vercel.app',
  'https://api-tester-lgm9bpiqz-aakanshas-projects-f4b2c9ab.vercel.app'
];

module.exports = cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. curl, Postman desktop)
    if (!origin) return callback(null, true);

    // Allow any localhost port for local development
    if (/^http:\/\/localhost(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    // Allow any 127.0.0.1 port
    if (/^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error('CORS not allowed for origin: ' + origin));
  },
  credentials: true,
});
