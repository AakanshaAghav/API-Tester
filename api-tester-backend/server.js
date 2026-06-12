const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const corsMiddleware = require('./middleware/cors');

const healthRoutes = require('./routes/health.routes');
const proxyRoutes = require('./routes/proxy.routes');
const historyRoutes = require('./routes/history.routes');
const collectionsRoutes = require('./routes/collections.routes');

const app = express();

// ✅ IMPORTANT FIX: Let Render control the port
const PORT = process.env.PORT;

app.use(corsMiddleware);
app.use(bodyParser.json());

app.use('/', healthRoutes);
app.use(proxyRoutes);
app.use(historyRoutes);
app.use(collectionsRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
