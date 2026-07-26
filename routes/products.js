const express = require('express');
const { db } = require('../config/firebase');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();
router.use(require('../middleware/requireDb'));
const col = () => db.collection('products');

// Public: list all products
router.get('/', async (req, res) => {
  const snap = await col().orderBy('name').get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

// Public: single product
router.get('/:id', async (req, res) => {
  const doc = await col().doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: 'Not found' });
  res.json({ id: doc.id, ...doc.data() });
});

// Admin: create
router.post('/', adminAuth, async (req, res) => {
  const data = req.body || {};
  const id = data.id || (data.name || 'item').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  await col().doc(id).set({ ...data, updatedAt: Date.now() });
  res.json({ id, ...data });
});

// Admin: update
router.put('/:id', adminAuth, async (req, res) => {
  await col().doc(req.params.id).set({ ...req.body, updatedAt: Date.now() }, { merge: true });
  res.json({ id: req.params.id, ...req.body });
});

// Admin: delete
router.delete('/:id', adminAuth, async (req, res) => {
  await col().doc(req.params.id).delete();
  res.json({ ok: true });
});

module.exports = router;
