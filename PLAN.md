# Master Implementation Plan: Pawprint Studio UI Redesign

This plan outlines the sequenced steps to transition the NSAC Campus Companions application from its current Gummy UI to the **Pawprint Studio** design language.

## Overview
- **Phase:** UI Redesign
- **Design System:** Pawprint Studio (Warm, Tactile, Character-rich)
- **Primary Tech:** Tailwind CSS v4, Alpine.js, Google Fonts (Baloo 2, Nunito)

---

## 1. Sequenced Task List

### Wave 1: Foundation & Layout
- **Task 1.1: Global Styles & Typography**
  - Integrate Baloo 2 and Nunito fonts.
  - Set up Tailwind v4 `@theme` with the Cream & Meadow palette.
  - Implement the dot-grid background texture in `base.html`.
- **Task 1.2: Core Layout & Navigation**
  - Implement the "Floating Pill" Bottom Navigation in `base.html`.
  - Update global container padding and transition resets.

### Wave 2: Home Page & Data
- **Task 2.1: Backend Feeding Logic**
  - Update `blueprints/public.py` to calculate hours since feeding for each sector.
- **Task 2.2: Home Page Redesign**
  - Redesign Hero section and Quick CTA Strip.
  - Implement the 3-state Food Bowl Status Grid (Green/Amber/Red).
  - Add the "Popular this week" Trending Carousel with staggered card entrance.

### Wave 3: Discovery & Detail
- **Task 3.1: Animal Directory Redesign**
  - Update Search Bar (with icon transformation) and scrollable Filter Chips.
  - Redesign Animal Cards with spring-lift effects and Karma pop animations.
- **Task 3.2: Animal Profile Detail**
  - Redesign Header with full-bleed photos and overlaid names.
  - Implement the Feeding History timeline and masonry-lite Sighting Gallery.

### Wave 4: Functional & Admin
- **Task 4.1: Emergency & Login**
  - Apply contextual tone shift (soft red bg) and Severity Chips to the Report page.
  - Apply "Notebook" form styling to the Login page.
- **Task 4.2: Admin Dashboard**
  - Update Admin Panels with left-border accents and KPI cards.
  - Redesign Alert Queue with pulsing indicators.

### Wave 5: Motion & Polish
- **Task 5.1: Celebration FX & Accessibility**
  - Implement Paw Confetti logic in the base template.
  - Final polish on accessibility (touch targets) and motion-reduction support.

---

## 2. Verification Strategy

### Automated Checks
- **Style Injection:** Use `grep` to verify `@theme` tokens and font imports in `base.html`.
- **Data Flow:** Verify the `index` route returns quantitative hours for feeding status.
- **Component Existence:** Verify new classes (`.animal-card`, `.bottom-nav`, `.bowl-icon`) are present in templates.

### Visual Verification
- **Typography:** Confirm headings are rounded (Baloo 2) and body text is readable (Nunito).
- **Tactile Feedback:** Verify cards lift on hover and tags "pop" on tap.
- **Mobile Navigation:** Confirm the nav pill floats correctly and the SOS button pulses.

---

## 3. Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| **Dark Mode Regressions** | Prioritize the "Cream" palette; ensure current dark mode doesn't break fonts or basic layout. |
| **Performance (Images)** | Use `BlurHash` placeholders for all animal photos to maintain high perceived performance. |
| **User Confusion (Admin)** | Maintain existing data density in the dashboard while updating the "shell" styling. |
| **CDN Availability** | Use fallback system fonts (Sans-serif) if Google Fonts fail to load. |

---

## 4. Detailed Planning Artifacts
Detailed, atomic plans for each wave can be found in `.planning/phases/01-ui-redesign/`.
Next Step: `/gsd:execute-phase 01-ui-redesign`
