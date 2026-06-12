const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Health Check
router.get('/', (req, res) => {
  res.send('API Tester Backend is running!');
});

// DB Check
router.get('/check-db', async (req, res) => {
  try {
    const { error } = await supabase.from('nonexistent_table').select('*').limit(0);

    if (error) {
      return res.status(200).json({
        status: 'OK',
        message: 'Supabase connection successful.',
      });
    }

    res.status(200).json({ status: 'OK' });
  } catch (err) {
    res.status(500).json({
      status: 'Error',
      message: err.message,
    });
  }
});

module.exports = router;
