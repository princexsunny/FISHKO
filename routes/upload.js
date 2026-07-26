// Upload a product image to Firebase Storage, return its public URL.
const express = require('express');
const multer = require('multer');
const { bucket } = require('../config/firebase');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();
router.use(require('../middleware/requireDb'));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/', adminAuth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  const name = `products/${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  const file = bucket.file(name);
  await file.save(req.file.buffer, { metadata: { contentType: req.file.mimetype } });
  await file.makePublic();
  const url = `https://storage.googleapis.com/${bucket.name}/${name}`;
  res.json({ url });
});

module.exports = router;
