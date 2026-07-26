// Initialise Firebase Admin (Firestore + Storage) — but never crash the server if
// credentials aren't set yet. The site still serves; DB features activate once configured.
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let db = null, bucket = null, ready = false;

try {
  let creds;
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    creds = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    const local = path.join(__dirname, '..', 'serviceAccount.json');
    if (fs.existsSync(local)) creds = require(local);
  }

  if (creds) {
    admin.initializeApp({
      credential: admin.credential.cert(creds),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    db = admin.firestore();
    if (process.env.FIREBASE_STORAGE_BUCKET) bucket = admin.storage().bucket();
    ready = true;
    console.log('✅ Firebase connected.');
  } else {
    console.warn('⚠️  Firebase not configured yet — site runs, but /api database routes are inactive.');
    console.warn('    Add serviceAccount.json or FIREBASE_SERVICE_ACCOUNT to enable it (see README).');
  }
} catch (e) {
  console.warn('⚠️  Firebase init failed:', e.message, '\n    Site still runs; configure credentials to enable the database.');
}

module.exports = { admin, db, bucket, ready };
