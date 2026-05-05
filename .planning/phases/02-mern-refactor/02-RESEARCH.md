# Phase 2: MERN Refactor - Research

**Researched:** 2025-05-05
**Domain:** MERN Stack Migration (React, Express, MongoDB)
**Confidence:** HIGH

## Summary

The project is undergoing a transition from a Flask prototype to a full MERN stack application. The research confirms that the foundation for the MERN refactor is already robust, with most models, controllers, and pages implemented. The application follows a strict MVC pattern on the backend and uses React 19 with Vite and Bootstrap 5 on the frontend.

Key features such as animal management, volunteer feeding logs, medical case tracking, and inventory management have been successfully ported with logic parity. Advanced features like a dynamic "Like" button and search-based filtering in the Animal Directory are also operational.

**Primary recommendation:** Focus on final integration testing across all 21 routes and ensuring the MongoDB Atlas production connection is properly documented in the environment setup.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Data Persistence | Database (MongoDB) | — | Mongoose handles schema enforcement and storage. |
| Business Logic | Backend (Express) | — | Controllers manage state transitions (e.g., closing medical cases). |
| Authentication | Backend (Express) | Frontend (React) | JWT issued by backend; stored and sent by frontend context. |
| View Rendering | Browser (React) | — | Pure SPA approach using React Router for navigation. |
| Image Hosting | External (Cloudinary) | — | Offloads heavy asset management from the app server. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.0.0 | UI Framework | Latest stable version for component-based UI. |
| Express | 4.21.2 | Web Server | De facto standard for Node.js APIs. |
| Mongoose | 8.9.5 | ODM | Robust MongoDB object modeling for Node.js. |
| Bootstrap | 5.3.3 | CSS Framework | Reliable responsive design and pre-built components. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|--------------|
| Axios | 1.7.9 | HTTP Client | Used for all frontend-to-backend API communication. |
| React Router | 7.1.1 | Routing | Manages the 21+ frontend routes. |
| BcryptJS | 2.4.3 | Security | Secure password hashing for the User model. |
| Jsonwebtoken | 9.0.2 | Auth | Session management via stateless tokens. |

**Installation:**
```bash
# Server dependencies
npm --prefix server install express mongoose cors dotenv bcryptjs jsonwebtoken nodemon

# Client dependencies
npm --prefix client install react react-dom react-router-dom axios bootstrap
```

## Architecture Patterns

### Recommended Project Structure
```
server/src/
├── config/          # DB connection (db.js)
├── controllers/     # Route logic (animalController.js, etc.)
├── middleware/      # Auth, Error handling, Async wrappers
├── models/          # Mongoose Schemas (Animal.js, User.js, etc.)
├── routes/          # Express route definitions
└── utils/           # Seeding logic and helpers

client/src/
├── components/      # Reusable UI (AnimalCard, Navbar, etc.)
├── context/         # AuthContext for global session state
├── hooks/           # useApiResource for data fetching
├── pages/           # Route-level components
├── routes/          # AppRoutes definition
├── services/        # API instance (api.js)
└── styles/          # Custom CSS (app.css)
```

### Pattern 1: Controller-Service-Model
**What:** Decoupling route definitions from logic using controllers and Mongoose models.
**When to use:** All API endpoints.
**Example:**
```javascript
// server/src/controllers/animalController.js
const listAnimals = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const filter = search ? { name: new RegExp(search, "i") } : {};
  const animals = await Animal.find(filter);
  res.json(animals);
});
```

### Anti-Patterns to Avoid
- **Inline Logic in Routes:** Keeps routes clean by delegating to controllers.
- **Prop Drilling for Auth:** Use `AuthContext` to provide user state to deeply nested components.
- **Sync DB Calls:** Always use `async/await` with `asyncHandler` to prevent server hangs and unhandled rejections.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Authentication | Custom session store | JWT + Cookies/Headers | Stateless, scales better for MERN. |
| Password Storage | Plain text/MD5 | BcryptJS | Standard salt/hash protection. |
| Form Validation | Manual if/else | Zod / HTML5 / Mongoose | Prevents bad data at multiple layers. |
| File Uploads | Local disk storage | Cloudinary | Prevents disk full errors on ephemeral servers (Render/Vercel). |

## Common Pitfalls

### Pitfall 1: Mismatched ID Types
**What goes wrong:** Flask used Integer IDs; MongoDB uses ObjectIDs (Strings).
**Why it happens:** Legacy code expecting `animal.id` to be a number.
**How to avoid:** Ensure frontend uses `animal._id` and backend uses `req.params.id` with `isValidObjectId` checks.

### Pitfall 2: CORS Blocking
**What goes wrong:** Frontend at port 5173 cannot talk to Backend at port 5000.
**How to avoid:** Explicitly configure the `cors` middleware in `app.js` with `origin` and `credentials: true`.

## Code Examples

### Standard Data Fetching (useApiResource Hook)
```javascript
// client/src/hooks/useApiResource.js
const { data, loading, error } = useApiResource("/animals", []);
```

### Protected Admin Route
```javascript
// client/src/routes/AppRoutes.jsx
<Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
```

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (Client) / Jest or Mocha (Server) |
| Config file | vitest.config.ts / package.json |
| Quick run command | `npm test` |

### Wave 0 Gaps
- [ ] `server/tests/` — No backend unit tests for controllers currently exist.
- [ ] `client/src/__tests__/` — No frontend component tests.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | Yes | JWT with 7d expiry and Secure/HttpOnly flags. |
| V5 Input Validation | Yes | Mongoose Schema validation + Express JSON limits. |
| V6 Cryptography | Yes | Bcrypt for password hashing (10 salt rounds). |

### Known Threat Patterns for MERN

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| NoSQL Injection | Tampering | Use Mongoose (avoids raw $ operator injections). |
| JWT Exfiltration | Information Disclosure | Use environment variables for secrets; avoid storing sensitive data in JWT payload. |

## Sources

### Primary (HIGH confidence)
- `server/src/models/` - Verified schema structure.
- `client/src/routes/AppRoutes.jsx` - Verified 21 route implementation.
- `MERN_REFACTOR_PLAN.md` - Verified project roadmap.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Verified via package.json.
- Architecture: HIGH - Verified via folder structure and controller code.
- Pitfalls: MEDIUM - Based on common MERN migration patterns.

**Research date:** 2025-05-05
**Valid until:** 2025-06-05
