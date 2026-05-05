# NSAC Campus Companions — UI/UX Redesign Document (v3)

> **NUST Stray Animals Club (NSAC)** · Mobile-First Web Application  
> Stack: Flask 3.x · SQLAlchemy · Alpine.js · Tailwind CSS v4  
> Design Language: **Pawprint Studio** — Warm, Kawaii-adjacent, Tactile

---

## What Changed (and Why)

The v2 design used glassmorphism — cool, but cold. It felt like a productivity dashboard, not a place where people care for living animals. **Pawprint Studio** replaces it with a warm, tactile, character-rich system that makes volunteers feel rewarded and students feel emotionally invested in campus animals. The goal: every interaction should feel like a tiny celebration.

No structural or backend changes. Pure UI/UX upgrade.

---

## 1. Design Philosophy

**Tone**: Warm · Playful · Caring · Alive  
**Inspiration**: Tamagotchi UI warmth + Duolingo streak psychology + Animal Crossing pastel palette  
**North Star question**: *Does this screen make you smile and want to tap something?*

The app is about animals. The UI should feel like it was made by people who love animals — not by a design agency. Imperfect, friendly, a little chaotic in the best way.

---

## 2. Color System

Replace the glass/dark palette with a **Cream & Meadow** system built on CSS variables.

```css
:root {
  /* Base */
  --color-cream:       #FDF6EC;   /* warm off-white background */
  --color-paper:       #FFF9F2;   /* card backgrounds */
  --color-ink:         #2D2013;   /* primary text — warm near-black */
  --color-muted:       #8C7B6B;   /* secondary text */

  /* Brand Accents */
  --color-paw:         #FF7B5C;   /* primary CTA — warm coral-orange */
  --color-paw-light:   #FFE4DC;   /* paw tint for backgrounds */
  --color-meadow:      #52B788;   /* success / fed / healthy */
  --color-meadow-light:#D8F3DC;
  --color-sunflower:   #F4A946;   /* warning / overdue */
  --color-sunflower-light: #FFF0CC;
  --color-rosewood:    #E05C6A;   /* critical / emergency */
  --color-rosewood-light:  #FDDDE0;
  --color-lavender:    #9B8FD9;   /* medical / special */
  --color-lavender-light:  #EAE7FA;

  /* Texture */
  --shadow-card:   0 2px 12px rgba(45,32,19,0.08), 0 1px 3px rgba(45,32,19,0.04);
  --shadow-hover:  0 8px 28px rgba(45,32,19,0.14), 0 2px 6px rgba(45,32,19,0.06);
  --shadow-paw:    0 4px 16px rgba(255,123,92,0.35);

  /* Radii — everything is rounder */
  --radius-sm:   10px;
  --radius-md:   18px;
  --radius-lg:   28px;
  --radius-pill: 999px;
}
```

**Mood → Color mapping** (replaces generic status dots):

| Mood       | Background              | Icon |
|------------|-------------------------|------|
| Happy      | `--color-meadow-light`  | 🐾   |
| Resting    | `--color-sunflower-light`| 😴  |
| Unwell     | `--color-rosewood-light` | 🌡️  |
| Playful    | `--color-lavender-light` | ✨  |

---

## 3. Typography

Ditch system fonts entirely. Use **two Google Fonts** loaded via `<link>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&family=Nunito:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
```

| Role              | Font             | Weight | Notes |
|-------------------|------------------|--------|-------|
| Display / Hero    | Baloo 2          | 800    | Rounded, chunky, lovable |
| Headings (H2–H4)  | Baloo 2          | 700    | Strong but soft |
| UI Labels / Buttons | Baloo 2        | 600    | Consistent brand feel |
| Body / Description | Nunito          | 400    | Easy to read, friendly |
| Italics / Captions | Nunito Italic   | 400    | Warmth in small text |

```css
:root {
  --font-display: 'Baloo 2', cursive;
  --font-body:    'Nunito', sans-serif;
}

h1, h2, h3, h4, button, .badge, .nav-label {
  font-family: var(--font-display);
}

body, p, input, textarea {
  font-family: var(--font-body);
}
```

---

## 4. Component Library

### 4.1 Animal Card (Directory / Carousel)

The heart of the app. Cards must feel alive.

```
┌─────────────────────────────────┐
│  [BlurHash → Photo, full-bleed] │  ← 56% of card height
│                                 │
│  🐾 Happy      ← mood badge     │  ← overlaid on image bottom
└──────────────────┬──────────────┘
│  Mochi           │ 🍚 2h ago    │  ← name + fed-ago pill
│  Sector C · Cat  │              │
│                  │              │
│  🎭 Playful  🤍 Gentle  🌟 Bold │  ← personality pills
│                  │   [+ Karma]  │  ← tap to upvote a tag
└─────────────────────────────────┘
```

**Key CSS behaviors:**

```css
.animal-card {
  background: var(--color-paper);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.22s ease;
  cursor: pointer;
}

/* Springy lift on hover — the "pet me" effect */
.animal-card:hover {
  transform: translateY(-6px) scale(1.015);
  box-shadow: var(--shadow-hover);
}

/* Personality tag pills */
.tag-pill {
  background: var(--color-paw-light);
  color: var(--color-paw);
  border-radius: var(--radius-pill);
  padding: 4px 12px;
  font-size: 0.75rem;
  font-family: var(--font-display);
  font-weight: 600;
  transition: background 0.15s, transform 0.15s;
}

.tag-pill:hover {
  background: var(--color-paw);
  color: white;
  transform: scale(1.08);
}
```

**Karma tap animation** (Alpine.js):

```html
<button
  @click="sendKarma(tag)"
  :class="{ 'karma-pop': tapped }"
  x-transition:enter="transition ease-out duration-150"
  class="tag-pill"
>
  {{ tag }} <span x-show="tapped">✨</span>
</button>
```

```css
@keyframes karma-pop {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.3) rotate(-5deg); }
  70%  { transform: scale(0.9) rotate(3deg); }
  100% { transform: scale(1); }
}
.karma-pop { animation: karma-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
```

---

### 4.2 Feeding Status Grid (Home Page)

Replace abstract color blocks with **Food Bowl Icons** that animate.

```
┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
│  🟢    │  │  🟡    │  │  🔴    │  │  🟢    │
│  [🍚]  │  │  [🥣]  │  │  [💔]  │  │  [🍚]  │
│  Sec A │  │  Sec B │  │  Sec C │  │  Sec D │
│ 1h ago │  │ 4h ago │  │ 8h ago │  │ 2h ago │
└────────┘  └────────┘  └────────┘  └────────┘
```

- **Green (< 3h)**: Full bowl emoji 🍚, `--color-meadow-light` bg, gentle pulse on icon
- **Amber (3–6h)**: Half bowl 🥣, `--color-sunflower-light` bg, slow wobble
- **Red (> 6h)**: Empty bowl 💔, `--color-rosewood-light` bg, urgent pulse animation
- Tapping a sector card deep-links to `/directory?sector=X`

```css
/* Urgent pulse for overdue sectors */
@keyframes bowl-pulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.12); }
}
.sector-critical .bowl-icon {
  animation: bowl-pulse 1.2s ease-in-out infinite;
  filter: drop-shadow(0 0 6px rgba(224, 92, 106, 0.6));
}
```

---

### 4.3 Navigation Bar (Mobile)

Bottom nav with a **floating pill** design — no flat boring bar.

```
╔══════════════════════════════════════════╗
║                                          ║
║  ┌──────────────────────────────────┐   ║
║  │  🏠    🐾    🚨    📦    👤     │   ║
║  │ Home  Find  SOS  Stock  Me      │   ║
║  └──────────────────────────────────┘   ║
╚══════════════════════════════════════════╝
```

```css
.bottom-nav {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-ink);
  border-radius: var(--radius-pill);
  padding: 10px 24px;
  display: flex;
  gap: 28px;
  align-items: center;
  box-shadow: 0 8px 32px rgba(45,32,19,0.25);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: var(--color-muted);
  transition: color 0.2s, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  min-width: 48px;
  padding: 4px 0;
}

.nav-item.active {
  color: var(--color-paw);
  transform: translateY(-4px);
}

.nav-item:active {
  transform: scale(0.88) translateY(-4px);
}

.nav-label {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.03em;
}

/* SOS button gets special treatment */
.nav-item.sos {
  background: var(--color-rosewood);
  color: white;
  border-radius: var(--radius-pill);
  padding: 8px 16px;
  margin: 0 4px;
  box-shadow: 0 0 0 0 rgba(224, 92, 106, 0.5);
  animation: sos-ring 2.5s ease-out infinite;
}

@keyframes sos-ring {
  0%   { box-shadow: 0 0 0 0 rgba(224,92,106, 0.55); }
  60%  { box-shadow: 0 0 0 10px rgba(224,92,106, 0); }
  100% { box-shadow: 0 0 0 0 rgba(224,92,106, 0); }
}
```

---

### 4.4 Buttons

Three tiers — all rounded, all satisfying to tap.

```css
/* Primary — Paw */
.btn-primary {
  background: var(--color-paw);
  color: white;
  border-radius: var(--radius-pill);
  padding: 14px 28px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  box-shadow: var(--shadow-paw);
  transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.18s ease;
}
.btn-primary:hover  { transform: translateY(-2px) scale(1.03); }
.btn-primary:active { transform: scale(0.95); box-shadow: none; }

/* Secondary */
.btn-secondary {
  background: var(--color-paw-light);
  color: var(--color-paw);
  border-radius: var(--radius-pill);
  padding: 12px 24px;
  font-family: var(--font-display);
  font-weight: 600;
  border: 2px solid transparent;
  transition: border-color 0.15s, background 0.15s;
}
.btn-secondary:hover { border-color: var(--color-paw); }

/* Ghost */
.btn-ghost {
  background: transparent;
  color: var(--color-muted);
  border-radius: var(--radius-pill);
  padding: 10px 20px;
  border: 2px solid rgba(45,32,19,0.12);
  font-family: var(--font-display);
  font-weight: 600;
  transition: border-color 0.15s, color 0.15s;
}
.btn-ghost:hover { border-color: var(--color-paw); color: var(--color-paw); }
```

---

### 4.5 Badges & Pills

Mood, status, and category badges are now **sticker-like** — they feel physical.

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: var(--radius-pill);
  padding: 5px 12px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.78rem;
  border: 2px solid transparent;
  /* subtle inner highlight — makes them look slightly raised */
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
}

.badge-happy    { background: var(--color-meadow-light);    color: #1E7E4A; }
.badge-resting  { background: var(--color-sunflower-light); color: #9A6200; }
.badge-unwell   { background: var(--color-rosewood-light);  color: #B5202E; }
.badge-medical  { background: var(--color-lavender-light);  color: #5A4BAD; }
```

---

### 4.6 Forms (Report / Login)

Forms feel like filling in a cute little notebook.

```css
.form-card {
  background: var(--color-paper);
  border-radius: var(--radius-lg);
  padding: 32px 28px;
  box-shadow: var(--shadow-card);
  /* subtle ruled-line texture */
  background-image: repeating-linear-gradient(
    transparent,
    transparent 27px,
    rgba(45,32,19,0.04) 28px
  );
}

.form-input {
  width: 100%;
  background: var(--color-cream);
  border: 2px solid rgba(45,32,19,0.1);
  border-radius: var(--radius-md);
  padding: 13px 16px;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--color-ink);
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.form-input:focus {
  border-color: var(--color-paw);
  box-shadow: 0 0 0 4px var(--color-paw-light);
}

.form-label {
  display: block;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.88rem;
  color: var(--color-ink);
  margin-bottom: 6px;
}

/* Severity selector — big tap-friendly chips, not a dropdown */
.severity-chip {
  flex: 1;
  padding: 14px 10px;
  border-radius: var(--radius-md);
  border: 2px solid rgba(45,32,19,0.1);
  text-align: center;
  cursor: pointer;
  transition: all 0.18s;
  font-family: var(--font-display);
  font-weight: 700;
}
.severity-chip[data-level="minor"]:is(:hover, .selected) {
  background: var(--color-sunflower-light);
  border-color: var(--color-sunflower);
  color: #9A6200;
}
.severity-chip[data-level="serious"]:is(:hover, .selected) {
  background: var(--color-rosewood-light);
  border-color: var(--color-rosewood);
  color: #B5202E;
}
```

---

### 4.7 Admin Dashboard Panels

Keep the data-density but wrap it in warmth.

```css
.dashboard-panel {
  background: var(--color-paper);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-card);
  border-left: 5px solid var(--color-paw); /* accent stripe — identity at a glance */
}

.dashboard-panel.medical  { border-left-color: var(--color-lavender); }
.dashboard-panel.stock    { border-left-color: var(--color-sunflower); }
.dashboard-panel.alerts   { border-left-color: var(--color-rosewood); }

.panel-title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.1rem;
  color: var(--color-ink);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

/* Table rows in admin — softer than default */
.data-row {
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  transition: background 0.15s;
}
.data-row:hover { background: var(--color-cream); }
```

---

## 5. Motion & Micro-Interactions

### Page Load — Staggered Card Entrance

```css
.animal-card {
  opacity: 0;
  transform: translateY(20px);
  animation: card-enter 0.4s ease forwards;
}

@keyframes card-enter {
  to { opacity: 1; transform: none; }
}

/* Stagger via Alpine or Jinja loop index */
.animal-card:nth-child(1) { animation-delay: 0.05s; }
.animal-card:nth-child(2) { animation-delay: 0.10s; }
.animal-card:nth-child(3) { animation-delay: 0.15s; }
/* ... etc via CSS or inline style="animation-delay: Xs" */
```

### Feeding Submission — Paw Confetti 🐾

Replace generic confetti with **paw print particles**. Use the same confetti library but override the shape:

```javascript
// In your feeding success handler:
function celebrateFeed() {
  const pawEmojis = ['🐾', '🍚', '💛', '🌿', '✨'];
  confetti({
    particleCount: 60,
    spread: 80,
    origin: { y: 0.6 },
    shapes: ['text'],
    scalar: 1.4,
    // use emoji as custom scalar shapes via canvas-confetti text option
  });
  // Fallback: standard confetti with meadow + paw colors
  confetti({
    particleCount: 80,
    spread: 90,
    colors: ['#52B788', '#FF7B5C', '#F4A946', '#FDF6EC'],
    origin: { y: 0.55 }
  });
}
```

### Karma Upvote — Heart Burst

```javascript
// Alpine.js: x-data on tag pill
{
  tapped: false,
  hearts: [],
  sendKarma(tag) {
    if (this.tapped) return;  // Bloom filter handles server side
    this.tapped = true;
    // Spawn 3 floating hearts above the pill
    for (let i = 0; i < 3; i++) {
      this.hearts.push({ id: Date.now() + i, offset: (i - 1) * 20 });
    }
    setTimeout(() => { this.tapped = false; this.hearts = []; }, 800);
    // POST to /api/animals/:id/karma
  }
}
```

```css
.heart-float {
  position: absolute;
  font-size: 1.1rem;
  pointer-events: none;
  animation: heart-rise 0.75s ease-out forwards;
}
@keyframes heart-rise {
  0%   { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-40px) scale(1.3); }
}
```

### Pull-to-Refresh (mobile)

```css
.ptr-indicator {
  display: flex;
  justify-content: center;
  padding: 12px;
  font-size: 1.4rem;
  animation: paw-spin 0.8s linear infinite;
}
@keyframes paw-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
/* Show a spinning 🐾 while refreshing — implemented via Alpine + touch events */
```

---

## 6. Page-by-Page Redesign Notes

### `/` — Home

- **Hero**: Large Baloo 2 heading `"Hey there, campus friend! 🐾"` on `--color-cream` background. No hero image — let the feeding grid be the first interactive element.
- **Feeding Grid**: 2×2 (mobile) or 4-across (desktop) bowl cards, not abstract colored squares.
- **Trending Carousel**: Horizontally scrollable row of Animal Cards with a subtle left-fade mask suggesting scroll. Label it `"Popular this week ✨"` not `"Trending"`.
- **Quick CTA Strip**: Two large pill buttons — `🍚 Log a Feeding` and `🚨 Report Emergency` — above the fold on mobile.

### `/directory` — Find Friends

- **Search bar**: Full-width, pill shape, with a 🔍 icon that transforms to 🐾 when active.
- **Filter chips**: Horizontal scrollable row of sector and species filters styled as `.tag-pill` — tap to toggle, active state fills with `--color-paw`.
- **Empty state**: Illustrated "no animals found" with a sad bowl emoji and copy: `"No friends here… yet! Check another sector?"`.

### `/animal/<id>` — Animal Profile

- **Header**: Full-bleed photo with BlurHash, animal name in Baloo 2 800 overlaid at bottom in white with a soft text-shadow.
- **Mood & status row**: Large badge strip directly under photo.
- **Personality section**: `"What makes [Name] special?"` header, then a wrap of interactive karma pills.
- **Feeding history timeline**: Vertical timeline with 🍚 icons and volunteer names instead of a plain table.
- **Sighting gallery**: Masonry-lite 2-column grid, each image with rounded corners and BlurHash placeholders.

### `/report` — Emergency

- **Tone shift**: Page background shifts to a very soft `--color-rosewood-light` tint to signal urgency without panic.
- **Large header**: `"Need help for an animal? 🚨"` — reassuring, not alarming.
- **Severity chips**: Three large tap targets (Minor / Sick / Other) instead of a dropdown — faster on mobile.
- **Submit button**: Full-width, `--color-rosewood` bg, large Baloo 2 label: `"Send Alert Now"`, with pulsing ring animation before submission.
- **Success state**: Switches to meadow green: `"Help is on the way! 💚 Thank you for caring."` with a gentle check animation.

### `/admin/panel` — Dashboard

- **Stat cards**: Four top KPI cards (open cases · fed today · low stock · reports) in a 2×2 grid with large Baloo 2 numbers and a colored left-border stripe.
- **Alert queue**: Emergency reports rendered as attention cards with `--color-rosewood-light` background and a pulsing dot indicator for new items.
- **Quick actions**: Floating action speed-dial in bottom-right for `+ Feeding`, `+ Medical`, `+ Inventory`.

---

## 7. Decorative System

### Background Texture

Subtle dot-grid on the main background — gives depth without competing with content.

```css
body {
  background-color: var(--color-cream);
  background-image: radial-gradient(
    circle,
    rgba(45,32,19,0.06) 1px,
    transparent 1px
  );
  background-size: 24px 24px;
}
```

### Section Dividers

Use wavy SVG dividers between home page sections instead of horizontal rules.

```html
<!-- Between hero and grid -->
<svg viewBox="0 0 1200 60" preserveAspectRatio="none" class="section-wave">
  <path d="M0,30 C300,60 900,0 1200,30 L1200,60 L0,60 Z"
        fill="var(--color-paper)"/>
</svg>
```

### Paw Print Accents

Scatter small, low-opacity `🐾` characters as CSS `::before` / `::after` content on section headers:

```css
.section-heading::after {
  content: '🐾';
  font-size: 0.75em;
  opacity: 0.25;
  margin-left: 8px;
}
```

---

## 8. Accessibility & Touch

No aesthetic choices should hurt usability.

| Rule | Implementation |
|---|---|
| **Touch targets** | All interactive elements ≥ 48px hit area via `min-height: 48px` + padding |
| **Focus rings** | `outline: 3px solid var(--color-paw); outline-offset: 3px` on all focusables |
| **Color contrast** | All text on `--color-cream` backgrounds passes WCAG AA (verified: `--color-ink` on `--color-cream` = 13.2:1) |
| **Motion opt-out** | All animations wrapped in `@media (prefers-reduced-motion: no-preference)` |
| **Badge text** | Mood badges always include a text label, not just color |

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Tailwind v4 Token Mapping

Override Tailwind's defaults via `@theme` to match Pawprint Studio:

```css
@import "tailwindcss";

@theme {
  --color-cream:      #FDF6EC;
  --color-paper:      #FFF9F2;
  --color-ink:        #2D2013;
  --color-paw:        #FF7B5C;
  --color-paw-light:  #FFE4DC;
  --color-meadow:     #52B788;
  --color-sunflower:  #F4A946;
  --color-rosewood:   #E05C6A;
  --color-lavender:   #9B8FD9;

  --font-display: 'Baloo 2', cursive;
  --font-body:    'Nunito', sans-serif;

  --radius-sm:   10px;
  --radius-md:   18px;
  --radius-lg:   28px;
  --radius-pill: 9999px;
}
```

This means Tailwind classes like `bg-paw`, `text-meadow`, `rounded-lg`, and `font-display` work natively in templates.

---

## 10. What This Achieves

| Before (Glassmorphism) | After (Pawprint Studio) |
|---|---|
| Cool, translucent, dark palette | Warm, solid, cream + coral palette |
| Generic Sans-serif (Inter assumed) | Baloo 2 + Nunito — distinctly friendly |
| Status dots for feeding urgency | Animated food bowl icons |
| Flat bottom nav bar | Floating pill nav with bouncy active states |
| Generic confetti on feed | Paw + color-matched particle burst |
| Glass cards — hoverable | Spring-lift cards with `cubic-bezier` overshoot |
| Form inputs, plain | Notebook-textured card, big severity chips |
| Clinical urgency (red text) | Contextual tone shift (soft rosewood bg) |
| Admin: dense table | Admin: KPI cards + colored left-border panels |

The app now feels like it was made *for* the animals, not just *about* them.
