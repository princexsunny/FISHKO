// Admin login -> returns a JWT.  (For customer phone login, use Firebase Auth on the client.)
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SECRET = process.env.JWT_SECRET || 'dev-secret';

router.post('/login', (req, res) => {
  const { password } = req.body || {};
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Wrong password' });
  const token = jwt.sign({ role: 'admin' }, SECRET, { expiresIn: '12h' });
  res.json({ token });
});

module.exports = router;
