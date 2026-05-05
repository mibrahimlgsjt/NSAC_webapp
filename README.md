# 🐾 NSAC Campus Companions MVP

A high-performance, mobile-first web application for the **NUST Stray Animals Club**. This platform serves as a "Digital Zoo" for students and a mission-critical management tool for volunteers.

## 🚀 Features

### For Students
- **Digital Encyclopedia:** Searchable database of campus animals with identification markers and personality backstories.
- **Real-time Status:** Check "Fed vs. Hungry" status for campus sectors (C1, C2, NBS, SEECS).
- **Emergency Reporting:** One-touch access to WhatsApp/Phone for critical cases and a digital form for minor issues.

### For Volunteers
- **Step-by-Step Feeding Tracker:** A gamified 3-step workflow (Select Round -> Sector -> Verify) with confetti rewards.
- **Medical Case Management:** Replace manual Excel sheets with full rescue lifecycle tracking and CSV export.
- **Inventory Management:** ABC-categorized stock registry with automated "Low Stock" alerts for critical meds.

## 🛠️ Tech Stack
- **Backend:** Python (Flask 3.x) with SQLAlchemy ORM.
- **Database:** SQLite (Local Dev) / Turso (Production Ready).
- **Frontend:** HTML5 + Tailwind CSS v4 ("Gummy UI" / Glassmorphism) + Alpine.js v3.
- **Typography:** 'Nunito' via Google Fonts.

## 📦 Quick Start

### 1. Prerequisites
Ensure you have **Python 3.10+** installed.

### 2. Installation
Clone the repository and install dependencies:
```bash
pip install -r requirements.txt
```

### 3. Run the App
```bash
python app.py
```
- The app will automatically initialize and seed the database with 5 initial animal profiles.
- Access the platform at: **http://127.0.0.1:5000**

## 🔐 Admin Access
- **Volunteer Portal:** `/admin`
- **PIN:** `NSAC2026`

## 📊 Project Structure
- `app.py`: Main Flask logic and API endpoints.
- `models.py`: SQLAlchemy database schema.
- `templates/`: Jinja2 templates for the Gummy UI.
- `instance/`: Local SQLite database storage.

---
*Built for NSAC Volunteers with ❤️ at NUST.*
