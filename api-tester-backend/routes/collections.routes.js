const express = require('express');
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');
const router = express.Router();

// ✅ Create Collection (USER-SPECIFIC)
router.post('/api/collections', auth, async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  const { data, error } = await supabase
    .from('collections')
    .insert({ name, user_id: userId })
    .select()
    .single();

  if (error) return res.status(500).json({ error });
  res.status(201).json(data);
});

// ✅ Get Only Logged-in User Collections
router.get('/api/collections', auth, async (req, res) => {
  const userId = req.user.id;

  const { data: collections } = await supabase
    .from('collections')
    .select('id, name')
    .eq('user_id', userId);

  const { data: items } = await supabase
    .from('collection_items')
    .select('collection_id')
    .eq('user_id', userId);

  const counts = items.reduce((acc, item) => {
    acc[item.collection_id] = (acc[item.collection_id] || 0) + 1;
    return acc;
  }, {});

  const merged = collections.map(c => ({
    ...c,
    item_count: counts[c.id] || 0,
  }));

  res.json(merged);
});

// ✅ Save Item to Collection (USER-SPECIFIC)
router.post('/api/collections/:collectionId/items', auth, async (req, res) => {
  const { collectionId } = req.params;
  const { url, method, headers, params, body } = req.body;
  const userId = req.user.id;

  const { data, error } = await supabase
    .from('collection_items')
    .insert({
      collection_id: collectionId,
      user_id: userId,
      url,
      method,
      request_body: body,
      request_headers: headers,
      request_params: params,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error });
  res.status(201).json(data);
});

// ✅ Get Items of One Collection (USER-SPECIFIC)
router.get('/api/collections/:collectionId/items', auth, async (req, res) => {
  const { collectionId } = req.params;
  const userId = req.user.id;

  const { data, error } = await supabase
    .from('collection_items')
    .select('id, url, method')
    .eq('collection_id', collectionId)
    .eq('user_id', userId);

  if (error) return res.status(500).json({ error });
  res.json(data);
});

// ✅ Get One Item Detail (USER-SPECIFIC)
router.get('/api/collections/items/:id', auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const { data, error } = await supabase
    .from('collection_items')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) return res.status(500).json({ error });
  res.json(data);
});

module.exports = router;
