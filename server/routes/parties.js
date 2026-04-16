const express = require('express');
const basicAuth = require('express-basic-auth');
const dbConnect = require('../../lib/mongodb');
const Party = require('../../lib/models/Party');

const router = express.Router();

// Basic auth for admin endpoints
const adminAuth = basicAuth({
  users: { 'admin': 'password' }, // Change this to secure credentials
  challenge: true,
});

// GET /api/parties — return all parties
router.get('/', async (req, res) => {
  try {
    await dbConnect();
    const parties = await Party.find({});
    res.json({ success: true, data: parties });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/parties/:name — return single party by name
router.get('/:name', async (req, res) => {
  try {
    await dbConnect();
    const party = await Party.findOne({ name: req.params.name });
    if (!party) return res.status(404).json({ success: false, error: 'Party not found' });
    res.json({ success: true, data: party });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/parties — add new party (admin auth)
router.post('/', adminAuth, async (req, res) => {
  try {
    await dbConnect();
    const party = new Party(req.body);
    await party.save();
    res.status(201).json({ success: true, data: party });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT /api/parties/:name — update party record (admin auth)
router.put('/:name', adminAuth, async (req, res) => {
  try {
    await dbConnect();
    const party = await Party.findOneAndUpdate({ name: req.params.name }, req.body, { new: true });
    if (!party) return res.status(404).json({ success: false, error: 'Party not found' });
    res.json({ success: true, data: party });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;