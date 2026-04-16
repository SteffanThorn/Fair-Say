const express = require('express');
const basicAuth = require('express-basic-auth');
const dbConnect = require('../../lib/mongodb');
const MP = require('../../lib/models/MP');

const router = express.Router();

// Basic auth for admin endpoints
const adminAuth = basicAuth({
  users: { 'admin': 'password' }, // Change this to secure credentials
  challenge: true,
});

// GET /api/mps — return all MPs, support query params: ?party=National and ?spectrum=centre-right
router.get('/', async (req, res) => {
  try {
    await dbConnect();
    const { party, spectrum } = req.query;
    let query = {};
    if (party) query.partyName = party;
    if (spectrum) query.political_spectrum = spectrum;
    const mps = await MP.find(query).populate('party', 'name slug color');
    res.json({ success: true, data: mps });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/mps/:id — return single MP by MongoDB id
router.get('/:id', async (req, res) => {
  try {
    await dbConnect();
    const mp = await MP.findById(req.params.id).populate('party', 'name slug color');
    if (!mp) return res.status(404).json({ success: false, error: 'MP not found' });
    res.json({ success: true, data: mp });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/mps/search?name= — search MPs by name
router.get('/search', async (req, res) => {
  try {
    await dbConnect();
    const { name } = req.query;
    if (!name) return res.status(400).json({ success: false, error: 'Name query parameter required' });
    const mps = await MP.find({ name: new RegExp(name, 'i') }).populate('party', 'name slug color');
    res.json({ success: true, data: mps });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/mps — add new MP (admin auth)
router.post('/', adminAuth, async (req, res) => {
  try {
    await dbConnect();
    const mp = new MP(req.body);
    await mp.save();
    res.status(201).json({ success: true, data: mp });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT /api/mps/:id — update MP record (admin auth)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    await dbConnect();
    const mp = await MP.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mp) return res.status(404).json({ success: false, error: 'MP not found' });
    res.json({ success: true, data: mp });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;