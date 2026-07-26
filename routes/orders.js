const express = require('express');
const { db } = require('../config/firebase');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();
router.use(require('../middleware/requireDb'));
const col = () => db.collection('orders');

// Public: place an order (from the storefront)
router.post('/', async (req, res) => {
  const o = req.body || {};
  const id = 'FK' + Date.now().toString().slice(-6);
  const order = { ...o, id, status: 'New', createdAt: Date.now() };
  await col().doc(id).set(order);
  // also capture the phone as a subscriber
  if (o.phone) {
    const phone = String(o.phone).replace(/[^0-9]/g, '').slice(-10);
    if (phone.length === 10) await db.collection('subscribers').doc(phone).set({ phone, since: Date.now() }, { merge: true });
  }
  res.json(order);
});

// Admin: list orders
router.get('/', adminAuth, async (req, res) => {
  const snap = await col().orderBy('createdAt', 'desc').get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

// Admin: update status
router.put('/:id', adminAuth, async (req, res) => {
  await col().doc(req.params.id).set({ status: req.body.status }, { merge: true });
  res.json({ ok: true });
});

module.exports = router;
