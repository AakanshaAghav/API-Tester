const express = require('express');
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');
const router = express.Router();

// ✅ History List (USER-SPECIFIC)
router.get('/api/history', auth, async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from('history')
    .select('id, url, method, response_status, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) return res.status(500).json({ error });

  res.json(data);
});


router.get("/api/history/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("history")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)   // security
      .single();

    if (error || !data) {
      return res.status(404).json({ message: "History item not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("History detail error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
