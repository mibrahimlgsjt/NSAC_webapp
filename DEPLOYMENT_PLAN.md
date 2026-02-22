# NSAC Campus Companions: Zero-Cost Deployment Plan

This document outlines the two best strategies for deploying the NSAC Campus Companions app for **$0/month** while ensuring good performance and stability.

---

## 🏆 Recommendation: Which path should you choose?

| Feature | **Option A: The "Modern Stack"** (Render + Neon) | **Option B: The "All-in-One"** (PythonAnywhere) |
| :--- | :--- | :--- |
| **Best For** | Scalability, Resume, "Round 4" Architecture | Speed, Simplicity, "It just works" |
| **Database** | PostgreSQL (Neon.tech) | SQLite (Built-in) or MySQL |
| **File Storage** | **Ephemeral** (Images vanish on restart*) | **Persistent** (Images stay forever) |
| **Setup Time** | 15 Minutes | 10 Minutes |
| **Tech Stack** | Docker-friendly, Gunicorn, WSGI | uWSGI, Traditional Hosting |

> **Critical Note on Option A:** Free PaaS tiers (Render, Heroku) have "ephemeral" file systems. User uploads will disappear when the app restarts unless you integrate an external service like Cloudinary or AWS S3.
>
> **Critical Note on Option B:** PythonAnywhere's free tier allows persistent storage (images are safe!) but whitelist-blocks outgoing API requests (so external APIs might not work, though your current app is mostly self-contained).

---

## Option A: The "Modern Stack" (Render + Neon)
*Aligns best with the "Round 4" production infrastructure upgrades.*

### 1. The Database (Neon.tech)
We need a cloud PostgreSQL database because Render's free DB expires after 30 days.
1.  Go to [Neon.tech](https://neon.tech) and sign up (Free).
2.  Create a new Project: `nsac-db`.
3.  **Copy the Connection String:** It will look like `postgres://user:pass@ep-cool-123.aws.neon.tech/neondb`.

### 2. The Web Service (Render.com)
1.  Push your code to **GitHub**.
2.  Go to [Render.com](https://render.com) and create a **New Web Service**.
3.  Connect your GitHub repository.
4.  **Settings:**
    *   **Runtime:** Python 3
    *   **Build Command:** `pip install -r requirements.txt`
    *   **Start Command:** `gunicorn app:app` (We already created `gunicorn.conf.py`, so this works great).
5.  **Environment Variables:**
    *   `DATABASE_URL`: Paste your Neon connection string here. **Important:** Render usually handles this, but `app.py` has a fix to convert `postgres://` to `postgresql://` automatically, so just paste it as is.
    *   `SECRET_KEY`: Generate a random string (e.g., `purple-gummy-bear-2026`).
    *   `PYTHON_VERSION`: `3.10.0` (or your local version).

### 3. Pros & Cons
*   ✅ **Pros:** Professional architecture, scalable, fast global CDN, auto-deploys from Git.
*   ❌ **Cons:** **Images will disappear** every time you deploy or the app "sleeps" (free tier limitation). You must upgrade `image_handler.py` to use Cloudinary for permanent storage.

---

## Option B: The "All-in-One" (PythonAnywhere)
*The fastest way to get everything (including uploads) working without changing code.*

### 1. Setup
1.  Sign up for a "Beginner" account at [PythonAnywhere.com](https://www.pythonanywhere.com/).
2.  Go to the **Web** tab -> **Add a new web app**.
3.  Choose **Flask** -> **Python 3.10**.
4.  **Path:** It will create a default file. You will replace this.

### 2. Upload Code
1.  Go to the **Consoles** tab -> **Bash**.
2.  Clone your repo: `git clone https://github.com/YOUR_USER/nsac-app.git mysite`
3.  Install dependencies:
    ```bash
    cd mysite
    pip3.10 install -r requirements.txt --user
    ```

### 3. Configuration
1.  Go to the **Web** tab.
2.  **Source code:** Enter the path to your folder (e.g., `/home/yourusername/mysite`).
3.  **WSGI Configuration File:** Click the link to edit.
4.  Update the file to import your app:
    ```python
    import sys
    import os

    path = '/home/yourusername/mysite'
    if path not in sys.path:
        sys.path.append(path)

    from app import app as application  # This hooks into your Flask app
    ```
5.  **Static Files:**
    *   **URL:** `/static/`
    *   **Directory:** `/home/yourusername/mysite/static/`

### 4. Database & Images
*   **Database:** You can keep using `sqlite:///nsac.sqlite`. It sits on the disk and persists forever.
*   **Images:** Uploads save to `static/uploads/`. They persist forever.

### 5. Pros & Cons
*   ✅ **Pros:** **Persistent storage** (Images & SQLite work out of the box), easy setup, no external DB needed.
*   ❌ **Cons:** Interface is a bit dated, manual "Git Pull" to update, no outgoing API requests on free tier (might block advanced integrations later).

---

## 🚀 Final Verdict

**Choose Option B (PythonAnywhere)** if you want to show the client a working prototype *today* where uploaded images actually stick around without writing more code.

**Choose Option A (Render + Neon)** if you are ready to implement Cloudinary for image storage and want a portfolio-grade, modern deployment stack.
