const express = require('express');
const fetch = require('node-fetch').default;
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');
const router = express.Router();

router.all('/api/proxy', auth, async (req, res) => {
  const { url, method, headers, body } = req.body;
  const userId = req.user.id;

  if (!url || !method) {
    return res.status(400).json({ error: 'Missing URL or method' });
  }

  try {
    const fetchOptions = {
      method: method.toUpperCase(),
      headers: headers || {},
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
    };

    const startTime = Date.now();
    const externalResponse = await fetch(url, fetchOptions);
    const duration = `${Date.now() - startTime}ms`;

    const responseHeaders = {};
    externalResponse.headers.forEach((v, k) => (responseHeaders[k] = v));

    const contentType = externalResponse.headers.get('content-type');
    const responseBody =
      contentType && contentType.includes('application/json')
        ? await externalResponse.json()
        : await externalResponse.text();

    await supabase.from('history').insert({
      user_id: userId,
      url,
      method,
      request_body: body,
      response_status: externalResponse.status,
      response_headers: responseHeaders,
      response_body: responseBody,
      duration,
    });

    res.json({
      status: externalResponse.status,
      statusText: externalResponse.statusText,
      duration,
      headers: responseHeaders,
      body: responseBody,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
