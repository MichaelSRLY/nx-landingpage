# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nexora is a premium B2B landing page for a German construction/infrastructure company ("Generalunternehmer"). Built as a single-page marketing site with no backend — form submission is simulated. All content is in German.

## Commands

```bash
npm run dev      # Dev server on localhost:3000
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint
```

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5**
- **Framer Motion** for animations
- **lucide-react** for icons
- **Inter** font (Google Fonts)
- Deployed on **Vercel**

## Architecture

Single-page app with all content in `src/app/page.tsx` (client component). Components in `src/components/`.

**Key components:**
- `IntroReveal.tsx` — Full-screen video intro overlay (auto-hides after video + 5s delay, skip after 3s, fallback at 20s)
- `Navbar.tsx` — Fixed nav with light/dark theme toggle (persisted to localStorage via `data-theme` attribute on `<html>`)
- `ProcessSection.tsx` — Interactive 4-phase process with tabs and sticky visualization (desktop), each phase has a unique animated widget
- `ProjectInquiry.tsx` — 3-step modal form (project type → scope → email) with AnimatePresence transitions and simulated submission
- `ServiceCard.tsx` — Image cards with mouse-tracking spotlight effect (framer-motion useMotionValue)

**Page sections flow:** IntroReveal → Hero → Benefits (bento grid) → Transparency → Process → Services → Impact Stats → CTA → Footer

### Mandantenportal Senger (`src/app/mandantenportal-senger/`)

Self-contained dashboard at `/mandantenportal-senger` — a dark-only data visualization portal for Senger & Senger financial data. Single `page.tsx` (~1,468 lines) with all components inline. Uses **recharts** (PieChart, BarChart, AreaChart, RadarChart, Treemap) + framer-motion. Styling is 100% inline styles (no CSS files) with one `<style jsx global>` for resets. Color palette: gold `#c8a97e` on charcoal `#0c0a09`. Data from `bookings.json`. Three views: overview, details, timeline with draggable card layout.

## Styling Approach

Mixed strategy — no single pattern:
- **globals.css**: Design tokens (CSS custom properties), layout utility classes (`.section-padding`, `.max-w-content`, `.grid-2/3/4`, `.glass-card`, `.escher-card`, `.btn-primary/secondary`, `.eyebrow`, `.text-gradient`), keyframe animations
- **Inline styles**: Component-specific and dynamic values (used extensively)
- **Styled-jsx** (`<style jsx>`): Scoped styles in ProjectInquiry and AutomationShowcase
- **CSS Modules**: `page.module.css` (minimal usage)

**Theme system:** Light/dark via CSS custom properties toggled by `data-theme` attribute. Light = warm paper tones, Dark = deep charcoal.

**Responsive breakpoints:** 768px (primary), 1024px (grid adjustments). Mobile-first with `clamp()` for typography.

## Animation Pattern

Reusable `revealProps` object in page.tsx for scroll-triggered entrance animations:
```tsx
const revealProps = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};
```

## Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

## Design Tokens

A `design.json` file at the project root documents the full design system (colors, typography, spacing, shadows). Refer to it for design decisions.
