# 🐟 FISHKO.IN — Server (Node.js + Express + Firebase)

Backend + frontend for the FISHKO fresh-seafood store.

**Stack:** Node.js + Express · Firebase Firestore (database) · Firebase Storage (images) · GitHub · Render (hosting)

## What's here
```
fishko-server/
  server.js            Express app (API + serves the frontend)
  config/firebase.js   Firebase Admin init
  middleware/          admin JWT auth
  routes/              products, orders, subscribers, coupons, upload, auth
  seed/seed.js         load the 10 default products into Firestore
  public/              index.html + admin.html (your frontend)
  render.yaml          Render deploy blueprint
```

## API
| Method | Route | Access | Purpose |
|---|---|---|---|
| GET | /api/products | public | list products |
| POST/PUT/DELETE | /api/products[/:id] | admin | manage products |
| POST | /api/orders | public | place an order |
| GET/PUT | /api/orders | admin | view / update orders |
| POST | /api/subscribers | public | save a phone number |
| GET/DELETE | /api/subscribers | admin | manage subscribers |
| POST | /api/subscribers/broadcast | admin | send an offer to all numbers |
| GET/POST/PUT/DELETE | /api/coupons | mixed | manage coupons |
| POST | /api/upload | admin | upload a product image |
| POST | /api/auth/login | public | admin login → JWT |

## 1. Set up Firebase
1. Create a project at https://console.firebase.google.com
2. Enable **Firestore Database** and **Storage**.
3. Project settings → Service accounts → **Generate new private key** → save as `serviceAccount.json` (local dev) OR copy its JSON into the `FIREBASE_SERVICE_ACCOUNT` env var (Render).
4. Copy your Storage bucket name (e.g. `fishko-xxxx.appspot.com`).

## 2. Run locally
```bash
cp .env.example .env      # fill in ADMIN_PASSWORD, JWT_SECRET, FIREBASE_* 
npm install
npm run seed              # loads the 10 products into Firestore
npm start                 # http://localhost:8080  (admin at /admin)
```

## 3. Push to GitHub
```bash
git init && git add . && git commit -m "FISHKO server"
git branch -M main
git remote add origin https://github.com/<you>/fishko.git
git push -u origin main
```

## 4. Deploy on Render
1. render.com → **New → Web Service** → connect your GitHub repo.
2. Render reads `render.yaml`. Set the env vars: `ADMIN_PASSWORD`, `FIREBASE_SERVICE_ACCOUNT` (paste the full JSON), `FIREBASE_STORAGE_BUCKET`. `JWT_SECRET` is auto-generated.
3. Deploy → you get a public URL like `https://fishko.onrender.com`.

## 5. Connect the frontend to the API
The pages currently use `localStorage` (demo). `public/js/api.js` is a ready client — swap the storage calls for `FishkoAPI.*` (e.g. `FishkoAPI.listProducts()`), and admin login for `FishkoAPI.adminLogin(password)`.

## Going fully live (next)
- **Phone OTP login:** Firebase Authentication (Phone) on the client — replaces the demo `1234`.
- **Real broadcasts:** plug MSG91 / Twilio / FCM into `routes/subscribers.js → /broadcast` (marked with a TODO).
- **Payments:** add Razorpay/UPI at checkout.
