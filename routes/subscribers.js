const express = require('express');
const { db } = require('../config/firebase');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();
router.use(require('../middleware/requireDb'));
const col = () => db.collection('subscribers');

// Public: add a phone (on login / order)
router.post('/', async (req, res) => {
  const phone = String(req.body.phone || '').replace(/[^0-9]/g, '').slice(-10);
  if (phone.length !== 10) return res.status(400).json({ error: 'Invalid phone' });
  await col().doc(phone).set({ phone, since: Date.now() }, { merge: true });
  res.json({ ok: true, phone });
});

// Admin: list subscribers
router.get('/', adminAuth, async (req, res) => {
  const snap = await col().get();
  res.json(snap.docs.map(d => d.data().phone));
});

// Admin: remove
router.delete('/:phone', adminAuth, async (req, res) => {
  await col().doc(req.params.phone).delete();
  res.json({ ok: true });
});

// Admin: broadcast an offer to all subscribers
// (records it; plug an SMS/WhatsApp provider here to actually deliver)
router.post('/broadcast', adminAuth, async (req, res) => {
  const { title, message } = req.body || {};
  const snap = await col().get();
  const recipients = snap.docs.map(d => d.data().phone);
  const rec = { title, message, count: recipients.length, sentAt: Date.now() };
  await db.collection('broadcasts').add(rec);
  // TODO: integrate MSG91 / Twilio / FCM here to send to `recipients`
  res.json({ ok: true, ...rec });
});

module.exports = router;
