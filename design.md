# NSAC Campus Companions - System Design

## 1. Overview
NSAC Campus Companions is a mobile-first web application designed for the **NUST Stray Animals Club (NSAC)**. It serves two primary audiences:
- **Students**: Providing a "Digital Zoo" to discover campus animals, check their feeding status, and report emergencies.
- **Volunteers/Admins**: A management tool to track feeding rounds, medical cases, and inventory.

## 2. Architecture
The application is built using **Python (Flask 3.x)** and follows a modular structure using **Blueprints**.

### Core Components:
- **`app.py`**: Entry point, configuration, and blueprint registration.
- **`models.py`**: Database schema defined using SQLAlchemy.
- **`extensions.py`**: Initialization of Flask extensions (DB, Cache, Login).
- **`blueprints/`**: Modularized route handlers.
- **`utils/`**: Helper functions for image processing and performance (e.g., Bloom Filter).
- **`templates/`**: Jinja2 templates using a "Gummy UI" design language.

## 3. Tech Stack
- **Backend**: Flask 3.x
- **ORM**: SQLAlchemy
- **Database**: SQLite (Development) / PostgreSQL or Turso (Production)
- **Frontend**: 
    - **CSS**: Tailwind CSS v4 (Glassmorphism / "Gummy UI")
    - **JS**: Alpine.js v3 (Reactive components)
- **Caching**: Flask-Caching (SimpleCache)
- **Authentication**: Flask-Login

## 4. Data Model
The database consists of the following entities:

- **User**: Authentication and RBAC (Roles: `admin`, `volunteer`).
- **Animal**: Core entity for animals (Name, Sector, Health, Mood, Last Fed).
- **Sighting**: User-submitted sightings with images and location tracking.
- **FeedingLog**: Records of feeding rounds by volunteers.
- **MedicalLog**: Rescue lifecycle tracking including costs and clinical details.
- **EmergencyReport**: Student-submitted reports (Minor injury, Sickness).
- **InventoryItem**: ABC-categorized medical and food stock.

## 5. Module Breakdown

### `public` Blueprint
Handles student-facing views:
- **Home (`/`)**: Sector feeding status and animal carousel.
- **Directory (`/directory`)**: Searchable list of all animals.
- **Detail (`/animal/<id>`)**: Personality traits, history, and recent sightings.
- **Report (`/report`)**: Emergency submission form.

### `admin` Blueprint
Restricted to logged-in volunteers/admins:
- **Dashboard (`/admin/panel`)**: Overview of medical logs, feeding logs, and inventory.
- **Export**: CSV export of medical logs for club reporting.

### `api` Blueprint
RESTful endpoints for dynamic interactions:
- **Likes/Votes**: Real-time "Karma" system for animal tags.
- **Feeding/Medical/Inventory**: POST handlers for volunteer tasks.
- **Sighting Uploads**: Multipart upload handling for student sightings.
- **Paginated Data**: Fetching sightings and trending animals for high performance.

### `auth` Blueprint
- Simple login/logout flow for volunteers and admins.

## 6. Performance & Optimizations
- **Image Handling**: Resizing and `BlurHash` generation to ensure fast loading on low-bandwidth campus Wi-Fi.
- **Bloom Filter**: Used in `utils/bloom_filter.py` to prevent duplicate voting on animal tags.
- **Caching**: Trending animals and expensive queries are cached via `SimpleCache`.
- **Indexing**: Composite indices on `Animal` and `Sighting` models for optimized location-based queries.

## 7. UI/UX (Gummy UI)
- **Glassmorphism**: Translucent cards and blurred backgrounds.
- **Mobile-First**: Bottom-nav navigation and touch-friendly buttons.
- **Visual Feedback**: Confetti rewards for feeding logs and "Mood Badges" for animals.
