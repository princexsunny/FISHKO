const { ready } = require('../config/firebase');
module.exports = (req, res, next) => {
  if (!ready) return res.status(503).json({ error: 'Database not configured yet. Add Firebase credentials (see README).' });
  next();
};
