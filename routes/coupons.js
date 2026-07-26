const express = require('express');
const { db } = require('../config/firebase');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();
router.use(require('../middleware/requireDb'));
const col = () => db.collection('coupons');

router.get('/', async (req, res) => {
  const snap = await col().get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});
router.post('/', adminAuth, async (req, res) => {
  const ref = await col().add({ ...req.body, createdAt: Date.now() });
  res.json({ id: ref.id, ...req.body });
});
router.put('/:id', adminAuth, async (req, res) => {
  await col().doc(req.params.id).set(req.body, { merge: true });
  res.json({ ok: true });
});
router.delete('/:id', adminAuth, async (req, res) => {
  await col().doc(req.params.id).delete();
  res.json({ ok: true });
});

module.exports = router;
