# NSAC Campus Companions: High-Traffic Deployment Master Plan

This plan is optimized for **200+ active users**, **1000+ photo storage**, and **$0 monthly cost**.

To achieve this scale for free, we must split the application into specialized services:
1.  **Compute (Render):** Runs the Python code. (Replaces Heroku)
2.  **Database (Neon.tech):** Handles high-concurrency data (SQL). (Replaces SQLite)
3.  **Storage (Cloudinary):** Serves thousands of images instantly. (Replaces local file storage)

---

## 🏆 The "Production-Grade" Stack (Render + Neon + Cloudinary)

| Component | Service | Tier | Limits | Why this choice? |
| :--- | :--- | :--- | :--- | :--- |
| **App Hosting** | **Render.com** | Free | 512MB RAM | Auto-deploys from Git, supports HTTPS natively. |
| **Database** | **Neon.tech** | Free | 500MB Storage | PostgreSQL allows simultaneous writes (unlike SQLite). |
| **Images** | **Cloudinary** | Free | 25GB Storage | Global CDN for fast loading; ephemeral file system proof. |
| **Monitoring** | **UptimeRobot** | Free | 5-min checks | Prevents Render app from "sleeping" (Spin-down). |

---

## 🛑 Prerequisites (Do this first)
1.  **GitHub Repo:** Ensure your latest code is pushed to `main`.
2.  **Accounts:** Sign up for **Render**, **Neon**, and **Cloudinary**.

---

## 🚀 Execution Guide

### Phase 1: The Database (Neon)
*Goal: Get a database URL that can handle traffic.*
1.  Log in to [Neon Console](https://console.neon.tech).
2.  Create a Project: `nsac-production`.
3.  **Copy Connection String:** `postgres://user:pass@ep-cool.aws.neon.tech/neondb`
4.  **Save this!** You will need it for Render.

### Phase 2: The Storage (Cloudinary)
*Goal: Store 1000+ images reliably.*
1.  Log in to [Cloudinary Console](https://console.cloudinary.com).
2.  Locate "API Environment variable" on the dashboard.
3.  **Copy the URL:** `cloudinary://874...:abc...@dp7...`
    *   *(Copy only the value starting with `cloudinary://`)*.
4.  **Save this!**

### Phase 3: The Deployment (Render)
*Goal: Launch the app.*
1.  Go to [Render Dashboard](https://dashboard.render.com).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub Repo: `NSAC_webapp`.
4.  **Configuration:**
    *   **Name:** `nsac-app`
    *   **Runtime:** `Python 3`
    *   **Build Command:** `pip install -r requirements.txt`
    *   **Start Command:** `gunicorn app:app`
5.  **Environment Variables (Essential):**
    *   `DATABASE_URL`: *(Paste Neon String)*
    *   `CLOUDINARY_URL`: *(Paste Cloudinary String)*
    *   `SECRET_KEY`: `(Generate a random secure string)`
    *   `PYTHON_VERSION`: `3.10.0`
6.  Click **Create Web Service**.

### Phase 4: Zero-Downtime Hack (UptimeRobot)
*Goal: Keep it fast for the first user.*
Render's free tier sleeps after 15 mins of inactivity.
1.  Go to [UptimeRobot](https://uptimerobot.com).
2.  Add New Monitor -> **HTTP(s)**.
3.  **URL:** Your new `https://nsac-app.onrender.com` address.
4.  **Interval:** 5 minutes.
5.  **Start:** This pings your app constantly, keeping it "hot" and ready for users.

---

## ✅ Why this won't crash
*   **Traffic:** Gunicorn (`gunicorn.conf.py`) uses multiple workers to handle concurrent requests.
*   **Database:** PostgreSQL handles locking natively (SQLite would crash with 200 users).
*   **Images:** Cloudinary offloads the heavy bandwidth of 1000+ images, saving your Render RAM for code logic.
