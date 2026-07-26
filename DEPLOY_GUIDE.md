# 🚀 FISHKO.IN — Deploy with Firebase + GitHub + Render

This guide takes you from the code on your computer to a **live website with a real database**, in four parts:

- **Part A — Firebase** (your database + file storage)
- **Part B — Test on your computer** (make sure it works locally first)
- **Part C — GitHub** (put the code online)
- **Part D — Render** (host the live site)

You only need to do this once. Later, to update the site you just run the push script again (Part C, step 4).

> ⚠️ **About secrets:** Firebase gives you a private key file. Never share it, never commit it to GitHub. This project's `.gitignore` already blocks it. You paste it into Render as an environment variable instead (Part D).

---

## What you need first

1. **Node.js 18+** — check by opening Command Prompt and typing `node -v`. If missing, install from https://nodejs.org (LTS version).
2. **Git** — check with `git --version`. If missing, install from https://git-scm.com/download/win.
3. A free **Google account** (for Firebase).
4. A free **GitHub account** — https://github.com/signup.
5. A free **Render account** — https://render.com (sign up with GitHub, it's easiest).

---

## Part A — Firebase (database + storage)

1. Go to https://console.firebase.google.com and click **Add project**. Name it `fishko` (or anything). You can turn **Google Analytics OFF** — not needed. Click **Create project**.

2. **Enable the database.** In the left menu: **Build → Firestore Database → Create database**.
   - Choose a location near you (e.g. `asia-south1` for India).
   - Start in **Production mode** → **Enable**.

3. **Enable file storage** (for product photos). Left menu: **Build → Storage → Get started** → accept the default rules → **Done**. Note the bucket name shown at the top — it looks like `fishko-xxxx.appspot.com`. **Write it down.**

4. **Create the service-account key** (this is how your server logs into Firebase).
   - Click the ⚙️ gear (top-left, next to *Project Overview*) → **Project settings**.
   - Open the **Service accounts** tab.
   - Click **Generate new private key** → **Generate key**. A `.json` file downloads.
   - Keep this file safe. You'll paste its contents into Render in Part D.

✅ Firebase is ready. You now have: a Firestore database, a Storage bucket name, and a service-account `.json` key.

---

## Part B — Test on your computer first

1. Open Command Prompt and go to the server folder:
   ```
   cd "D:\ONLINE FISH\fishko-server"
   ```

2. Install the code's dependencies (one time):
   ```
   npm install
   ```

3. Create your local settings file. Copy `.env.example` to `.env`:
   ```
   copy .env.example .env
   ```
   Then open `.env` in Notepad and set:
   - `ADMIN_PASSWORD` → your admin login password (e.g. `admin123`).
   - `JWT_SECRET` → any long random text.
   - `FIREBASE_STORAGE_BUCKET` → the bucket from Part A step 3 (e.g. `fishko-xxxx.appspot.com`).
   - For `FIREBASE_SERVICE_ACCOUNT`: the easiest local option is to instead **rename your downloaded key file to `serviceAccount.json`** and drop it in the `fishko-server` folder. The app looks for that automatically. (`.gitignore` keeps it private.)

4. Load the starting fish catalogue into your database (one time):
   ```
   npm run seed
   ```
   You should see `✅ Seeded 10 products into Firestore.`

5. Start the site:
   ```
   npm start
   ```
   Open your browser to **http://localhost:8080** (storefront) and **http://localhost:8080/admin** (admin panel).

   > If you see "Firebase not configured", the site still opens but the database is off — recheck step 3.

Press `Ctrl+C` in the Command Prompt to stop the local server.

---

## Part C — GitHub (put the code online)

1. Create an **empty** repository: go to https://github.com/new, name it `fishko`, leave it **Public or Private**, do **NOT** add a README/gitignore (the project already has them), click **Create repository**. Copy the repo URL it shows, e.g. `https://github.com/YOURNAME/fishko.git`.

2. In Command Prompt, from the `fishko-server` folder, run the helper script:
   ```
   push-to-github.bat
   ```
   It will ask for your repo URL the first time, then commit and upload everything (your `.env` and key file are automatically skipped).

3. Refresh your GitHub repo page — you should see all the files.

4. **Later, whenever you change the site**, just run `push-to-github.bat` again to upload the updates. Render will automatically redeploy (Part D handles that).

> Prefer doing it manually? See "Manual git commands" at the bottom.

---

## Part D — Render (host the live site)

1. Go to https://dashboard.render.com → **New +** → **Blueprint**.
2. Connect your GitHub account and pick the `fishko` repo. Render reads the included `render.yaml` and proposes a web service called **fishko**. Click **Apply**.
3. Render will ask for the secret values (these are **not** in GitHub). Set:
   - **ADMIN_PASSWORD** → your admin password.
   - **JWT_SECRET** → leave it (Render auto-generates one).
   - **FIREBASE_STORAGE_BUCKET** → your bucket, e.g. `fishko-xxxx.appspot.com`.
   - **FIREBASE_SERVICE_ACCOUNT** → open your downloaded key `.json` in Notepad, **select all, copy, and paste the entire contents** into this box (it's a big block of text starting with `{"type":"service_account"...`). Paste it as-is.
4. Click **Create / Deploy**. Wait 2–4 minutes for the build to finish.
5. When it's live, Render gives you a URL like `https://fishko.onrender.com`. Open it — that's your live store. `/admin` is your live admin panel.

### Seed the live database (one time)
Your live site shares the same Firebase database you seeded in Part B, so products are already there. If you skipped Part B, seed it now from your computer (with `serviceAccount.json` in place): `npm run seed`.

---

## ✅ You're live
- **Store:** `https://fishko.onrender.com`
- **Admin:** `https://fishko.onrender.com/admin` (password = your `ADMIN_PASSWORD`)

Every change you push to GitHub auto-deploys to Render in a couple of minutes.

---

## Notes & troubleshooting

- **Free Render plan sleeps.** The free web service goes to sleep after ~15 min idle, so the first visit after a while takes ~30 seconds to wake. Upgrade to a paid instance ($7/mo) to keep it always on.
- **"Database not configured yet"** on the live site → the `FIREBASE_SERVICE_ACCOUNT` paste is missing or malformed. Re-copy the whole `.json` contents into Render → Environment → save → it redeploys.
- **Storage bucket errors** → make sure `FIREBASE_STORAGE_BUCKET` exactly matches what Firebase shows (usually `your-project.appspot.com`).
- **Admin can't log in** → the password must match `ADMIN_PASSWORD` in Render's Environment tab.
- **Never commit secrets.** `.env` and `serviceAccount.json` are already in `.gitignore`. Keep it that way.

### Manual git commands (instead of the script)
```
cd "D:\ONLINE FISH\fishko-server"
git init
git add .
git commit -m "FISHKO site"
git branch -M main
git remote add origin https://github.com/YOURNAME/fishko.git
git push -u origin main
```
For later updates: `git add .` → `git commit -m "update"` → `git push`.
