# Phase 2 — UI Review (v2)

**Audited:** 2026-05-06
**Baseline:** design3.md (Pawprint Studio)
**Screenshots:** Not captured (no dev server running)

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 2/4 | Generic labels persist in React components despite CSS token updates. |
| 2. Visuals | 2/4 | CSS defines the aesthetic, but React component structures remain "Bootstrap-default". |
| 3. Color | 3/4 | Tokens correctly mapped in `app.css`, but hardcoded colors exist in JSX. |
| 4. Typography | 3/4 | Baloo 2 and Nunito loaded; applied to headers but body text usage is inconsistent. |
| 5. Spacing | 3/4 | Radii and shadows match spec in CSS; layout consistency in JSX is lacking. |
| 6. Experience Design | 1/4 | **BLOCKER:** Core interaction models (Food Bowls, Severity Chips) not implemented in React. |

**Overall: 14/24**

---

## Top 3 Priority Fixes

1. **Refactor Navbar Component** — The `Navbar.jsx` still uses a standard top-bar structure. While `app.css` forces it into a floating pill, the internal layout and labels ("Directory" instead of "Find", missing "SOS") diverge from the mobile-first floating nav spec. — **Concrete Fix:** Update `Navbar.jsx` to use the specified icon + label structure and ensure the "Emergency" link uses the `.sos` class and pulsing animation.
2. **Update Animal Directory & Card** — `AnimalCard.jsx` and `AnimalDirectory.jsx` use standard layouts. The spec requires "full-bleed photo" and "mood badge overlaid" for cards, and specific search/filter visuals. — **Concrete Fix:** Update card JSX to overlay the mood badge on the image and implement the "check another sector" empty state in `AnimalDirectory.jsx`.
3. **Implement Severity Chips in Emergency Report** — The `/emergency` page uses a standard dropdown for severity. The spec mandates large, tap-friendly chips for mobile usability. — **Concrete Fix:** Replace the `select` in `EmergencyReport.jsx` with a flex-row of styled `div` or `button` elements using the `.severity-chip` class.

---

## Detailed Findings

### Pillar 1: Copywriting (2/4)
- **Home:** Title is "NSAC Campus Companions" instead of "Hey there, campus friend! 🐾". "Trending Profiles" used instead of "Popular this week ✨".
- **Directory:** Empty state "No animals found matching your search." instead of spec's "No friends here… yet! Check another sector?".
- **Emergency:** "Submit Report" button instead of "Send Alert Now". Success message is "Report submitted." instead of "Help is on the way! 💚".
- **Reference:** `client/src/pages/Home.jsx`, `client/src/pages/AnimalDirectory.jsx`, `client/src/pages/EmergencyReport.jsx`.

### Pillar 2: Visuals (2/4)
- **Nav Divergence:** `Navbar.jsx` contains Bootstrap utility classes (`navbar-expand-lg`, `bg-white`, `border-bottom`) that conflict with the intended floating pill aesthetic.
- **Card Divergence:** `AnimalCard.jsx` uses a standard card body with title/species/tags below the image, failing the "character-rich" overlaid design in `design3.md`.
- **Form Divergence:** Emergency report uses standard inputs/selects; lacks the "notebook-textured" card and severity chips.

### Pillar 3: Color (3/4)
- **CSS Tokens:** `app.css` successfully implements the Cream & Meadow system via CSS variables.
- **JSX Conflicts:** Hardcoded `text-dark`, `text-muted`, and `bg-white` in React components bypass the `var(--color-ink)` and `var(--color-cream)` tokens.
- **Reference:** `client/src/components/Navbar.jsx:12`, `client/src/components/AnimalCard.jsx:31`.

### Pillar 4: Typography (3/4)
- **Integration:** Baloo 2 and Nunito are correctly imported in `app.css`.
- **Application:** Global header styles (h1-h6) work, but specific UI labels in components (like `nav-label`) aren't consistently using `var(--font-display)`.

### Pillar 5: Spacing (3/4)
- **Tokens:** `var(--radius-lg)` (28px) is defined in CSS but implementation in JSX often relies on Bootstrap's `rounded-4` or `rounded-pill`.
- **Touch Targets:** The floating nav links are small and might not meet the ≥48px height requirement depending on viewport.

### Pillar 6: Experience Design (1/4)
- **Missing Interaction Model:** The "Food Bowl" icons for sector status (Pillar 4.2 in spec) are defined in CSS but not used in `Home.jsx` or `FeedStatus.jsx`.
- **Missing Gamification:** "Karma tap" heart bursts and animations mentioned in spec are not present in `AnimalCard.jsx` or `AnimalDetail.jsx`.
- **Functional Gaps:** Emergency report success state is a standard Bootstrap alert, missing the "contextual tone shift" and themed success message.

---

## Files Audited
- `client/src/styles/app.css`
- `client/src/App.jsx`
- `client/src/components/Navbar.jsx`
- `client/src/components/AnimalCard.jsx`
- `client/src/pages/Home.jsx`
- `client/src/pages/AnimalDirectory.jsx`
- `client/src/pages/EmergencyReport.jsx`
- `client/package.json`
