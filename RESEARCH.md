# Phase: UI/UX Redesign - Pawprint Studio - Research

**Researched:** 2026-05-05
**Domain:** UI/UX Redesign (Gummy UI to Pawprint Studio)
**Confidence:** HIGH

## Summary

The NSAC Campus Companions application is undergoing a comprehensive UI/UX redesign to transition from the current "Gummy UI" (Glassmorphism) to the new "Pawprint Studio" design language. This shift replaces the cool, translucent aesthetic with a warm, tactile, and character-rich system designed to increase volunteer engagement and student emotional investment.

**Primary recommendation:** Centralize Pawprint Studio design tokens in a Tailwind v4 theme configuration within `base.html` and use Alpine.js for the newly defined micro-interactions (Karma pops, Pet me effects).

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Global Theming | Browser / Client | — | Managed via Tailwind v4 CSS variables in `base.html`. |
| Layout & Components | Frontend (Jinja2) | — | Templates define structure; Tailwind classes apply Pawprint Studio styling. |
| Micro-interactions | Browser / Client | — | Alpine.js handles "Karma" pops, confetti, and springy animations. |
| Data Flow (Feeding) | API / Backend | Frontend | Backend provides timestamps; Frontend determines "Bowl Status" (Green/Amber/Red). |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | v4 (CDN) | Styling & Tokens | Uses modern CSS variables for theme definition; high performance. [VERIFIED: templates/base.html] |
| Alpine.js | v3.x | Interactions | Lightweight reactivity for Karma taps and state management. [VERIFIED: templates/base.html] |
| Baloo 2 | Google Font | Display Typography | Rounded, chunky, and friendly feel specified in design docs. [CITED: design3.md] |
| Nunito | Google Font | Body Typography | High readability with a friendly tone. [CITED: design3.md] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|--------------|
| canvas-confetti| v1.6.0 | Celebration FX | Triggered on feeding log success; uses paw print emojis. [VERIFIED: templates/base.html] |
| BlurHash | v2.0.5 | Image Placeholders | Smooth loading experience for animal photos. [VERIFIED: templates/base.html] |

**Installation:**
```bash
# No new packages required as the project uses CDNs for prototype stage
```

## Architecture Patterns

### Recommended Project Structure
The current structure is maintained; research focuses on template overrides.
```
templates/
├── base.html          # Global tokens, typography, floating nav
├── public/            # Public-facing redesign (Index, Directory, Detail)
├── admin/             # Admin panel wrappers (Dashboard, KPI cards)
└── auth/              # Login styling
```

### Pattern 1: Tailwind v4 Theme Tokens
**What:** Mapping the Pawprint Studio palette to Tailwind's `@theme` directive.
**When to use:** Global style definition in `base.html`.
**Example:**
```css
/* Source: design3.md */
@theme {
  --color-cream: #FDF6EC;
  --color-paper: #FFF9F2;
  --color-ink: #2D2013;
  --color-paw: #FF7B5C;
  /* ... rest of Pawprint Studio tokens */
}
```

### Pattern 2: Springy Micro-interactions
**What:** Using `cubic-bezier(0.34, 1.56, 0.64, 1)` for "overshoot" animations that feel tactile.
**When to use:** Hover effects on cards and button taps.

### Anti-Patterns to Avoid
- **Overusing Glassmorphism:** The new design specifically moves *away* from `.glass` classes.
- **System Fonts:** Standard sans-serifs should be replaced project-wide with Nunito.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Celebration Effects | Custom canvas animation | `canvas-confetti` | Robust, supports emoji shapes, handles cleanup. |
| Complex Bezier Curves | Manual CSS transitions | Tailwind v4 built-ins | Standardizes the "springy" feel across the app. |
| Image Placeholders | Loading spinners | `BlurHash` | Better perceived performance for image-heavy directories. |

## Component Mapping

| Old UI Element | New Design Component | File(s) |
|----------------|----------------------|---------|
| `.glass` cards | `.animal-card` (Spring lift) | `index.html`, `directory.html` |
| Rectangular blocks | Animated Bowl Status Grid | `index.html` |
| Emoji + Plain Nav | Floating Pill Bottom Nav | `base.html` |
| System Font Headings| Baloo 2 (Extra Bold) | Project-wide |
| Dropdown Severity | Big Tap Severity Chips | `report.html` |
| Dense Admin Tables | `.dashboard-panel` (Left-border) | `admin_panel.html` |

## Common Pitfalls

### Pitfall 1: Breaking the "Dark Mode"
**What goes wrong:** The original app has a `theme-dark` implementation. Pawprint Studio is primarily focused on a "Cream & Meadow" light palette.
**How to avoid:** Research suggests the "Cream" palette *is* the core identity. Dark mode should either be a "Dark Chocolate" variant of the warm palette or prioritized lower than the core warm aesthetic.

### Pitfall 2: Confetti Overload
**What goes wrong:** Triggering standard confetti feels generic.
**How to avoid:** Override `shapes: ['text']` in `canvas-confetti` to use 🐾 and 🍚 as specified in `design3.md`.

## Code Examples

### Feeding Status Bowl Logic (Template)
```html
<!-- Derived from design3.md logic -->
<div :class="{
    'bg-meadow-light': hours < 3,
    'bg-sunflower-light': hours >= 3 && hours < 6,
    'bg-rosewood-light': hours >= 6
}" class="bowl-card p-4 rounded-lg">
    <span class="bowl-icon text-3xl">
        {{ hours < 3 ? '🍚' : (hours < 6 ? '🥣' : '💔') }}
    </span>
    <!-- Logic depends on passing last_fed timestamps to template -->
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Glassmorphism (v2) | Pawprint Studio (v3) | May 2026 | Shift from cold/clinical to warm/tactile. |
| Tailwind v3 (config.js) | Tailwind v4 (CSS-first) | Project Start | Cleaner token management via CSS variables. |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Backend can provide `last_fed_at` for sectors | Code Examples | Bowl status logic will remain binary (Fed/Hungry) instead of 3-state. |
| A2 | Users prefer high-character UI over minimal | Summary | Redesign might feel "too busy" for some admin users. |

## Open Questions

1. **Dark Mode implementation:** Should dark mode be fully redesigned to "Dark Chocolate" or is the current blueish dark mode acceptable with Pawprint fonts?
   - *Recommendation:* Stick to the warm "Pawprint" palette as the primary experience.
2. **Sector Data:** The current `public.index` route only checks a 4-hour window. Should it be updated to return specific durations for the 3-state bowl status?
   - *Recommendation:* Update `blueprints/public.py` to calculate hours since last feeding per sector.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Tailwind v4 | Global Styling | ✓ | CDN | — |
| Alpine.js | Interactions | ✓ | 3.x | — |
| Google Fonts| Typography | ✓ | — | System Sans |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | pytest |
| Quick run command | `pytest` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command |
|--------|----------|-----------|-------------------|
| UI-01 | Tokens apply correctly | Smoke | Check `base.html` for CSS vars |
| UI-02 | Component mapping | Visual | Manual verification against `design3.md` |

## Security Domain

### Applicable ASVS Categories
- **V5 Input Validation:** Ensure new form components (Severity chips) still submit valid enum values to the backend.

### Known Threat Patterns for Pawprint Studio
- **CSS Injection:** Since tokens are managed in `base.html`, ensure no user-controlled strings are injected into the `<style>` tag. (Low risk in current architecture).

## Sources

### Primary (HIGH confidence)
- `design3.md` - Full design specification for Pawprint Studio.
- `templates/base.html` - Current tech stack verification (Tailwind v4, Alpine).
- `models.py` - Understanding animal data fields (mood, tags).

### Secondary (MEDIUM confidence)
- `blueprints/public.py` - Current route data logic for index/directory.

## Metadata

**Research date:** 2026-05-05
**Valid until:** 2026-06-05
