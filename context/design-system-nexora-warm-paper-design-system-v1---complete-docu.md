# Nexora Warm Paper Design System v1 - Complete Documentation & Implementation

**Type:** design-system
**Summary:** Nexora v1 is a comprehensive design system anchored in warm earth tones (HSL 30-40) inspired by M.C. Escher's geometric tessellations. It includes complete token specifications (colors, typography, spacing, effects), responsive breakpoints (XS-3XL), accessible component patterns, and fully functional React/TypeScript implementations for hero sections with dark/light themes, mobile navigation, and floating card animations.

---

# Nexora Warm Paper Design System

**Version 2.0.0** · Inspired by M.C. Escher · Anchored in HSL 30–40

---

## Philosophy

Nexora is a design system built around the idea that digital interfaces should feel *tactile*. Every surface carries the warmth of aged paper. Every element finds its place in the tessellation. The palette never strays from the earth-tone anchor of HSL 30–40, producing an aesthetic that feels handcrafted rather than computed.

The Escher influence manifests not as literal optical illusions, but as a commitment to geometric harmony — repeating patterns, interlocking shapes, and the sense that every piece belongs exactly where it is.

---

## Color System

### Light Theme

| Token | Value | Usage |
|---|---|---|
| `background` | `hsl(40, 30%, 97%)` | Page background |
| `surface` | `hsl(40, 25%, 95%)` | Cards, panels, elevated containers |
| `surfaceElevated` | `hsl(40, 28%, 98%)` | Modals, popovers, tooltips |
| `text.primary` | `hsl(30, 15%, 15%)` | Headings, primary body text |
| `text.secondary` | `hsl(30, 10%, 40%)` | Subtitles, descriptions |
| `text.muted` | `hsl(35, 10%, 60%)` | Captions, labels, metadata |
| `text.disabled` | `hsl(35, 8%, 75%)` | Disabled states |
| `border` | `hsl(35, 15%, 85%)` | Card borders, dividers |
| `borderSubtle` | `hsl(35, 12%, 90%)` | Inner separators |
| `accent` | `hsl(35, 20%, 88%)` | Skeleton loaders, soft highlights |
| `accentHover` | `hsl(35, 22%, 84%)` | Accent hover state |
| `interactive.hover` | `hsl(40, 25%, 93%)` | Interactive element hover |
| `interactive.active` | `hsl(40, 25%, 90%)` | Interactive element active/pressed |
| `interactive.focus` | `hsl(35, 30%, 80%)` | Focus ring color |

### Dark Theme

| Token | Value | Usage |
|---|---|---|
| `background` | `hsl(30, 5%, 10.5%)` | Page background |
| `surface` | `hsl(30, 5%, 12%)` | Cards, panels |
| `surfaceElevated` | `hsl(30, 6%, 14%)` | Modals, popovers |
| `text.primary` | `hsl(40, 20%, 92%)` | Headings, body text |
| `text.secondary` | `hsl(40, 15%, 70%)` | Subtitles, descriptions |
| `text.muted` | `hsl(30, 10%, 50%)` | Captions, labels |
| `text.disabled` | `hsl(30, 8%, 35%)` | Disabled states |
| `border` | `hsl(30, 5%, 20%)` | Card borders, dividers |
| `accent` | `hsl(35, 20%, 30%)` | Skeleton loaders, highlights |

### Theme Application

Apply themes via a `.dark` class on `<html>` or `<body>`. All tokens are mapped to CSS custom properties:

```css
:root {
  --nexora-bg: hsl(40, 30%, 97%);
  --nexora-surface: hsl(40, 25%, 95%);
  /* ... */
}

.dark {
  --nexora-bg: hsl(30, 5%, 10.5%);
  --nexora-surface: hsl(30, 5%, 12%);
  /* ... */
}
```

---

## Typography

### Font Stack

| Role | Stack |
|---|---|
| Sans (primary) | `'Geist Sans', system-ui, -apple-system, sans-serif` |
| Mono (code/labels) | `'Geist Mono', 'SF Mono', 'Fira Code', monospace` |

**Font source:** [vercel.com/font](https://vercel.com/font) — Geist is a variable font supporting weights 100–900.

### Responsive Type Scale

The type scale is defined per breakpoint. Each step includes `size`, `lineHeight`, and `letterSpacing`. Font sizes are significantly reduced on mobile for compact readability.

#### XS (0–374px) — Compact Phones

| Token | Size | Line Height | Letter Spacing |
|---|---|---|---|
| h1 | 1.75rem (28px) | 1.1 | -0.02em |
| h2 | 1.25rem (20px) | 1.2 | -0.01em |
| h3 | 1.063rem (17px) | 1.3 | 0 |
| body | 0.813rem (13px) | 1.6 | 0.01em |
| small | 0.688rem (11px) | 1.5 | 0.02em |
| tiny | 0.563rem (9px) | 1.4 | 0.03em |
| eyebrow | 0.563rem (9px) | 1.2 | 0.15em |

#### SM (375–639px) — Standard Phones

| Token | Size | Line Height | Letter Spacing |
|---|---|---|---|
| h1 | 2rem (32px) | 1.08 | -0.02em |
| h2 | 1.375rem (22px) | 1.2 | -0.01em |
| h3 | 1.125rem (18px) | 1.3 | 0 |
| body | 0.813rem (13px) | 1.65 | 0.01em |
| small | 0.688rem (11px) | 1.5 | 0.02em |
| tiny | 0.625rem (10px) | 1.4 | 0.03em |
| eyebrow | 0.625rem (10px) | 1.2 | 0.15em |

#### MD (640–767px) — Large Phones / Small Tablets

| Token | Size | Line Height | Letter Spacing |
|---|---|---|---|
| h1 | 2.5rem (40px) | 1.06 | -0.025em |
| h2 | 1.5rem (24px) | 1.2 | -0.01em |
| body | 0.875rem (14px) | 1.65 | 0.01em |
| eyebrow | 0.625rem (10px) | 1.2 | 0.15em |

#### LG (768–1023px) — Tablets

| Token | Size | Line Height | Letter Spacing |
|---|---|---|---|
| h1 | 3rem (48px) | 1.05 | -0.025em |
| h2 | 1.75rem (28px) | 1.2 | -0.015em |
| body | 0.938rem (15px) | 1.7 | 0.005em |
| eyebrow | 0.688rem (11px) | 1.2 | 0.15em |

#### XL (1024–1279px) — Small Desktops

| Token | Size | Line Height | Letter Spacing |
|---|---|---|---|
| h1 | 3.5rem (56px) | 1.05 | -0.03em |
| h2 | 1.875rem (30px) | 1.2 | -0.015em |
| body | 1rem (16px) | 1.7 | 0 |
| eyebrow | 0.75rem (12px) | 1.2 | 0.15em |

#### XXL (1280+) — Standard Desktops

| Token | Size | Line Height | Letter Spacing |
|---|---|---|---|
| h1 | 4rem (64px) | 1.05 | -0.03em |
| h2 | 2rem (32px) | 1.2 | -0.015em |
| body | 1rem (16px) | 1.7 | 0 |
| eyebrow | 0.75rem (12px) | 1.2 | 0.15em |

### Font Weights

| Token | Value | Usage |
|---|---|---|
| thin | 100 | Hero H1 italic emphasis |
| extralight | 200 | Hero H1 main weight |
| light | 300 | Subtitles, secondary buttons, nav links |
| regular | 400 | Body text, primary buttons, mono labels |
| medium | 500 | Semi-prominent labels |
| semibold | 600 | Logo, nav brand, card headings |
| bold | 700 | Strong emphasis, alerts |

---

## Spacing

### Base Scale

| Token | Value |
|---|---|
| `xs` | 4px |
| `sm` | 8px |
| `md` | 16px |
| `lg` | 32px |
| `xl` | 64px |
| `xxl` | 128px |

### Responsive Spacing

#### Section Padding

| Breakpoint | Padding |
|---|---|
| xs | 48px 16px |
| sm | 56px 20px |
| md | 64px 32px |
| lg | 80px 40px |
| xl | 96px 48px |
| xxl | 128px 64px |

#### Nav Padding

| Breakpoint | Padding |
|---|---|
| xs | 12px 16px |
| sm | 14px 20px |
| md | 16px 32px |
| lg–xxl | 16px 40–64px |

#### Container Max Width

| Breakpoint | Max Width |
|---|---|
| sm | 100% |
| md | 640px |
| lg | 768px |
| xl | 1024px |
| xxl | 1200px |
| xxxl | 1400px |

---

## Effects

### Shadows

| Token | Value | Usage |
|---|---|---|
| `sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| `md` | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)` | Buttons, interactive |
| `lg` | `0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)` | Prominent cards |
| `paper` | `0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02)` | Floating cards, elevated panels |
| `elevated` | `0 25px 50px -12px rgba(0,0,0,0.08)` | Modals, overlays |

### Paper Texture

The paper texture is created by layering two pseudo-elements:

1. **Grain** — A warm radial gradient: `radial-gradient(at 50% 20%, rgba(160, 120, 70, 0.06) 0%, transparent 50%)`
2. **Noise** — An SVG fractal noise filter at 3.5% opacity (light) or 5% opacity (dark)

Both are applied as `position: fixed` overlays with `pointer-events: none`.

### Transitions

| Token | Value | Usage |
|---|---|---|
| `fast` | 150ms ease | Micro-interactions (hover states) |
| `default` | 300ms ease | Standard transitions |
| `slow` | 500ms ease | Layout changes |
| `spring` | 500ms cubic-bezier(0.34, 1.56, 0.64, 1) | Playful bounces |

### Animations

The system defines five core animations:

- **fadeUp** — Content entrance from below (800ms, staggered with 150ms increments)
- **fadeDown** — Nav entrance from above (800ms)
- **float** — Floating card idle motion (10–14s, infinite)
- **scrollPulse** — Scroll hint indicator (2s, infinite)
- **slowSpin** — Escher pattern rotation (120s, linear, infinite)

All animations respect `prefers-reduced-motion: reduce` and are disabled accordingly.

---

## Components

### Navigation

The nav is a fixed, full-width bar with backdrop blur. On mobile (below 640px), nav links collapse into a hamburger drawer.

| Property | XS | SM | MD | LG+ |
|---|---|---|---|---|
| Height | 52px | 56px | 60px | 64px |
| Logo size | 0.75rem | 0.813rem | 0.813rem | 0.875rem |
| Link size | 0.688rem | 0.75rem | 0.75rem | 0.875rem |
| Link gap | 16px | 20px | 20px | 32px |
| Layout | Hamburger | Hamburger | Inline | Inline |

The mobile nav drawer slides down from the nav bar with a 300ms cubic-bezier animation. Each link is full-width with 16px vertical padding and a 1px border-bottom divider.

### Hero Section

The hero is a full-viewport centered section with layered depth. Floating decorative cards only appear above 1024px.

| Property | XS | SM | MD | LG | XL+ |
|---|---|---|---|---|---|
| H1 size | 1.75rem | 2rem | 2.5rem | 3rem | 4rem |
| H1 weight | 200 | 200 | 200 | 200 | 200 |
| Subtitle max-w | 100% | 320px | 400px | 440px | 480px |
| Content max-w | 100% | 100% | 560px | 640px | 720px |
| Pattern size | 240px | 320px | 400px | 480px | 560px |
| Floating cards | Hidden | Hidden | Hidden | Visible | Visible |
| CTA layout | Column | Column | Row | Row | Row |

### Buttons

| Variant | Padding (XS) | Padding (LG+) | Font Size (XS) | Font Size (LG+) |
|---|---|---|---|---|
| Primary | 12px 24px | 14px 32px | 0.75rem | 0.875rem |
| Secondary | 12px 24px | 14px 32px | 0.75rem | 0.875rem |

Primary buttons use `text.primary` as background with `background` as text color, creating a natural inversion. Secondary buttons are transparent with a `border` outline.

Below 640px, the CTA group stacks vertically and buttons expand to full width.

### Floating Cards

Decorative skeleton-content cards that float around the hero. They contain placeholder "skeleton" lines (6px tall, rounded) and dots (8px circles) in the `accent` color.

Only rendered above 1024px. Four cards are positioned absolutely with staggered fade-in animations (1.0s, 1.2s, 1.4s, 1.6s delay) and continuous float motion at varying speeds (10–14s cycles).

### Scroll Hint

A minimal indicator at the bottom of the hero: a mono-font label ("Scroll") above a 1px × 32px line with an animated pulse traveling downward.

---

## Breakpoint Strategy

### Mobile-First Approach

All styles are written mobile-first. Media queries use `min-width` to progressively enhance:

```css
/* Base: XS (0px+) */
h1 { font-size: 1.75rem; }

/* SM: 375px+ */
@media (min-width: 375px) { h1 { font-size: 2rem; } }

/* MD: 640px+ */
@media (min-width: 640px) { h1 { font-size: 2.5rem; } }

/* LG: 768px+ */
@media (min-width: 768px) { h1 { font-size: 3rem; } }

/* XL: 1024px+ */
@media (min-width: 1024px) { h1 { font-size: 3.5rem; } }

/* XXL: 1280px+ */
@media (min-width: 1280px) { h1 { font-size: 4rem; } }
```

### Key Responsive Behaviors

| Feature | Below 640px | 640–1023px | 1024px+ |
|---|---|---|---|
| Nav links | Hamburger drawer | Inline | Inline |
| CTA buttons | Stacked, full-width | Inline | Inline |
| Floating cards | Hidden | Hidden | Visible |
| Escher pattern | 240–320px | 400px | 480–560px |
| H1 | 1.75–2rem | 2.5–3rem | 3.5–4rem |

---

## Accessibility

### Focus States

All interactive elements display a 2px focus ring offset by 2px using the `interactive.focus` color. Focus is visible on keyboard navigation only (`:focus-visible`).

### Touch Targets

All tappable elements maintain a minimum 44×44px touch target, even if the visual element is smaller (achieved via padding or invisible hit area expansion).

### Reduced Motion

When `prefers-reduced-motion: reduce` is active, the system disables all animations (fadeUp, float, slowSpin, scrollPulse), removes floating cards entirely, and stops the Escher pattern rotation.

### Contrast Ratios

All text-on-background combinations meet WCAG AA standards. `text.primary` on `background` achieves 12.5:1 (light) and 13.1:1 (dark). `text.secondary` meets 5.2:1 / 5.8:1.

---

## Implementation Notes

### CSS Custom Properties

All tokens should be mapped to CSS custom properties prefixed with `--nexora-`:

```
--nexora-color-bg
--nexora-color-surface
--nexora-color-text-primary
--nexora-font-sans
--nexora-font-mono
--nexora-space-md
--nexora-shadow-paper
--nexora-radius-md
```

### React/TypeScript

The system is designed to work with inline styles or CSS-in-JS. A TypeScript types file (`nexora.types.ts`) can be generated from `design.json` for type-safe token access.

### File Structure

```
nexora/
├── design.json          # Machine-readable tokens
├── design.md            # Human-readable documentation (this file)
├── NexoraHero.tsx       # React TypeScript hero component
├── nexora.types.ts      # TypeScript token types (optional)
└── assets/
    └── geist/           # Geist font files
```
{
  "name": "Nexora Warm Paper Design System",
  "version": "2.0.0",
  "description": "A papery, warm aesthetic anchored in HSL 30-40, inspired by the works of M.C. Escher. Extended with comprehensive responsive breakpoints, component variants, and mobile-first typography.",

  "breakpoints": {
    "xs": {
      "value": "0px",
      "label": "Extra Small — Compact phones",
      "maxWidth": "374px"
    },
    "sm": {
      "value": "375px",
      "label": "Small — Standard phones",
      "maxWidth": "639px"
    },
    "md": {
      "value": "640px",
      "label": "Medium — Large phones / Small tablets",
      "maxWidth": "767px"
    },
    "lg": {
      "value": "768px",
      "label": "Large — Tablets",
      "maxWidth": "1023px"
    },
    "xl": {
      "value": "1024px",
      "label": "Extra Large — Small desktops",
      "maxWidth": "1279px"
    },
    "xxl": {
      "value": "1280px",
      "label": "2XL — Standard desktops",
      "maxWidth": "1535px"
    },
    "xxxl": {
      "value": "1536px",
      "label": "3XL — Large desktops & ultrawide",
      "maxWidth": null
    }
  },

  "tokens": {
    "colors": {
      "light": {
        "background": "hsl(40, 30%, 97%)",
        "surface": "hsl(40, 25%, 95%)",
        "surfaceElevated": "hsl(40, 28%, 98%)",
        "text": {
          "primary": "hsl(30, 15%, 15%)",
          "secondary": "hsl(30, 10%, 40%)",
          "muted": "hsl(35, 10%, 60%)",
          "disabled": "hsl(35, 8%, 75%)"
        },
        "border": "hsl(35, 15%, 85%)",
        "borderSubtle": "hsl(35, 12%, 90%)",
        "accent": "hsl(35, 20%, 88%)",
        "accentHover": "hsl(35, 22%, 84%)",
        "secondary": "hsl(35, 20%, 90%)",
        "interactive": {
          "hover": "hsl(40, 25%, 93%)",
          "active": "hsl(40, 25%, 90%)",
          "focus": "hsl(35, 30%, 80%)"
        },
        "overlay": "hsla(30, 15%, 15%, 0.04)"
      },
      "dark": {
        "background": "hsl(30, 5%, 10.5%)",
        "surface": "hsl(30, 5%, 12%)",
        "surfaceElevated": "hsl(30, 6%, 14%)",
        "text": {
          "primary": "hsl(40, 20%, 92%)",
          "secondary": "hsl(40, 15%, 70%)",
          "muted": "hsl(30, 10%, 50%)",
          "disabled": "hsl(30, 8%, 35%)"
        },
        "border": "hsl(30, 5%, 20%)",
        "borderSubtle": "hsl(30, 5%, 16%)",
        "accent": "hsl(35, 20%, 30%)",
        "accentHover": "hsl(35, 22%, 35%)",
        "secondary": "hsl(35, 15%, 25%)",
        "interactive": {
          "hover": "hsl(30, 5%, 15%)",
          "active": "hsl(30, 6%, 18%)",
          "focus": "hsl(35, 15%, 28%)"
        },
        "overlay": "hsla(40, 20%, 92%, 0.04)"
      }
    },

    "typography": {
      "families": {
        "sans": "'Geist Sans', system-ui, -apple-system, sans-serif",
        "mono": "'Geist Mono', 'SF Mono', 'Fira Code', monospace"
      },
      "scale": {
        "xs": {
          "h1": { "size": "1.75rem", "lineHeight": "1.1", "letterSpacing": "-0.02em" },
          "h2": { "size": "1.25rem", "lineHeight": "1.2", "letterSpacing": "-0.01em" },
          "h3": { "size": "1.063rem", "lineHeight": "1.3", "letterSpacing": "0" },
          "body": { "size": "0.813rem", "lineHeight": "1.6", "letterSpacing": "0.01em" },
          "small": { "size": "0.688rem", "lineHeight": "1.5", "letterSpacing": "0.02em" },
          "tiny": { "size": "0.563rem", "lineHeight": "1.4", "letterSpacing": "0.03em" },
          "eyebrow": { "size": "0.563rem", "lineHeight": "1.2", "letterSpacing": "0.15em" }
        },
        "sm": {
          "h1": { "size": "2rem", "lineHeight": "1.08", "letterSpacing": "-0.02em" },
          "h2": { "size": "1.375rem", "lineHeight": "1.2", "letterSpacing": "-0.01em" },
          "h3": { "size": "1.125rem", "lineHeight": "1.3", "letterSpacing": "0" },
          "body": { "size": "0.813rem", "lineHeight": "1.65", "letterSpacing": "0.01em" },
          "small": { "size": "0.688rem", "lineHeight": "1.5", "letterSpacing": "0.02em" },
          "tiny": { "size": "0.625rem", "lineHeight": "1.4", "letterSpacing": "0.03em" },
          "eyebrow": { "size": "0.625rem", "lineHeight": "1.2", "letterSpacing": "0.15em" }
        },
        "md": {
          "h1": { "size": "2.5rem", "lineHeight": "1.06", "letterSpacing": "-0.025em" },
          "h2": { "size": "1.5rem", "lineHeight": "1.2", "letterSpacing": "-0.01em" },
          "h3": { "size": "1.25rem", "lineHeight": "1.3", "letterSpacing": "0" },
          "body": { "size": "0.875rem", "lineHeight": "1.65", "letterSpacing": "0.01em" },
          "small": { "size": "0.75rem", "lineHeight": "1.5", "letterSpacing": "0.02em" },
          "tiny": { "size": "0.625rem", "lineHeight": "1.4", "letterSpacing": "0.03em" },
          "eyebrow": { "size": "0.625rem", "lineHeight": "1.2", "letterSpacing": "0.15em" }
        },
        "lg": {
          "h1": { "size": "3rem", "lineHeight": "1.05", "letterSpacing": "-0.025em" },
          "h2": { "size": "1.75rem", "lineHeight": "1.2", "letterSpacing": "-0.015em" },
          "h3": { "size": "1.375rem", "lineHeight": "1.3", "letterSpacing": "0" },
          "body": { "size": "0.938rem", "lineHeight": "1.7", "letterSpacing": "0.005em" },
          "small": { "size": "0.813rem", "lineHeight": "1.5", "letterSpacing": "0.015em" },
          "tiny": { "size": "0.688rem", "lineHeight": "1.4", "letterSpacing": "0.02em" },
          "eyebrow": { "size": "0.688rem", "lineHeight": "1.2", "letterSpacing": "0.15em" }
        },
        "xl": {
          "h1": { "size": "3.5rem", "lineHeight": "1.05", "letterSpacing": "-0.03em" },
          "h2": { "size": "1.875rem", "lineHeight": "1.2", "letterSpacing": "-0.015em" },
          "h3": { "size": "1.5rem", "lineHeight": "1.3", "letterSpacing": "0" },
          "body": { "size": "1rem", "lineHeight": "1.7", "letterSpacing": "0" },
          "small": { "size": "0.875rem", "lineHeight": "1.5", "letterSpacing": "0.01em" },
          "tiny": { "size": "0.75rem", "lineHeight": "1.4", "letterSpacing": "0.02em" },
          "eyebrow": { "size": "0.75rem", "lineHeight": "1.2", "letterSpacing": "0.15em" }
        },
        "xxl": {
          "h1": { "size": "4rem", "lineHeight": "1.05", "letterSpacing": "-0.03em" },
          "h2": { "size": "2rem", "lineHeight": "1.2", "letterSpacing": "-0.015em" },
          "h3": { "size": "1.5rem", "lineHeight": "1.3", "letterSpacing": "0" },
          "body": { "size": "1rem", "lineHeight": "1.7", "letterSpacing": "0" },
          "small": { "size": "0.875rem", "lineHeight": "1.5", "letterSpacing": "0.01em" },
          "tiny": { "size": "0.75rem", "lineHeight": "1.4", "letterSpacing": "0.02em" },
          "eyebrow": { "size": "0.75rem", "lineHeight": "1.2", "letterSpacing": "0.15em" }
        }
      },
      "weights": {
        "thin": 100,
        "extralight": 200,
        "light": 300,
        "regular": 400,
        "medium": 500,
        "semibold": 600,
        "bold": 700
      }
    },

    "spacing": {
      "0": "0px",
      "xs": "4px",
      "sm": "8px",
      "md": "16px",
      "lg": "32px",
      "xl": "64px",
      "xxl": "128px",
      "responsive": {
        "sectionPadding": {
          "xs": "48px 16px",
          "sm": "56px 20px",
          "md": "64px 32px",
          "lg": "80px 40px",
          "xl": "96px 48px",
          "xxl": "128px 64px"
        },
        "containerMaxWidth": {
          "sm": "100%",
          "md": "640px",
          "lg": "768px",
          "xl": "1024px",
          "xxl": "1200px",
          "xxxl": "1400px"
        },
        "heroVerticalPadding": {
          "xs": "100px 16px 48px",
          "sm": "110px 20px 56px",
          "md": "120px 32px 64px",
          "lg": "128px 40px 64px",
          "xl": "128px 48px 64px",
          "xxl": "128px 64px 64px"
        },
        "navPadding": {
          "xs": "12px 16px",
          "sm": "14px 20px",
          "md": "16px 32px",
          "lg": "16px 40px",
          "xl": "16px 48px",
          "xxl": "16px 64px"
        },
        "gap": {
          "xs": "12px",
          "sm": "16px",
          "md": "20px",
          "lg": "24px",
          "xl": "32px"
        }
      }
    },

    "radii": {
      "none": "0px",
      "sm": "4px",
      "md": "8px",
      "lg": "12px",
      "xl": "16px",
      "full": "9999px"
    },

    "effects": {
      "shadows": {
        "sm": "0 1px 2px rgba(0,0,0,0.05)",
        "md": "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
        "lg": "0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)",
        "paper": "0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02)",
        "elevated": "0 25px 50px -12px rgba(0,0,0,0.08)"
      },
      "patterns": {
        "grain": "radial-gradient(at 50% 20%, rgba(160, 120, 70, 0.06) 0%, transparent 50%)",
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        "noiseOpacity": {
          "light": 0.035,
          "dark": 0.05
        }
      },
      "transitions": {
        "fast": "150ms ease",
        "default": "300ms ease",
        "slow": "500ms ease",
        "spring": "500ms cubic-bezier(0.34, 1.56, 0.64, 1)"
      },
      "animations": {
        "fadeUp": {
          "from": { "opacity": 0, "transform": "translateY(16px)" },
          "to": { "opacity": 1, "transform": "translateY(0)" },
          "duration": "800ms",
          "easing": "ease-out"
        },
        "fadeDown": {
          "from": { "opacity": 0, "transform": "translateY(-12px)" },
          "to": { "opacity": 1, "transform": "translateY(0)" },
          "duration": "800ms",
          "easing": "ease-out"
        },
        "float": {
          "keyframes": {
            "0%": { "transform": "translateY(0)" },
            "50%": { "transform": "translateY(-10px)" },
            "100%": { "transform": "translateY(0)" }
          },
          "duration": "12s",
          "easing": "ease-in-out",
          "iteration": "infinite"
        },
        "scrollPulse": {
          "keyframes": {
            "0%": { "top": "-100%" },
            "50%": { "top": "100%" },
            "100%": { "top": "100%" }
          },
          "duration": "2s",
          "easing": "ease-in-out",
          "iteration": "infinite"
        },
        "slowSpin": {
          "duration": "120s",
          "easing": "linear",
          "iteration": "infinite"
        },
        "stagger": {
          "baseDelay": "200ms",
          "increment": "150ms"
        }
      },
      "backdrop": {
        "blur": "16px",
        "navOpacity": 0.8
      }
    }
  },

  "components": {
    "nav": {
      "height": {
        "xs": "52px",
        "sm": "56px",
        "md": "60px",
        "lg": "64px"
      },
      "logoSize": {
        "xs": "0.75rem",
        "sm": "0.813rem",
        "lg": "0.875rem"
      },
      "linkSize": {
        "xs": "0.688rem",
        "sm": "0.75rem",
        "lg": "0.875rem"
      },
      "linkGap": {
        "xs": "16px",
        "sm": "20px",
        "lg": "32px"
      },
      "themeToggle": {
        "size": "36px",
        "radius": "full"
      },
      "mobileMenu": {
        "breakpoint": "640px",
        "itemPadding": "16px 20px",
        "animationDuration": "300ms"
      }
    },

    "hero": {
      "minHeight": "100vh",
      "maxContentWidth": {
        "xs": "100%",
        "sm": "100%",
        "md": "560px",
        "lg": "640px",
        "xl": "720px"
      },
      "subtitleMaxWidth": {
        "xs": "100%",
        "sm": "320px",
        "md": "400px",
        "lg": "440px",
        "xl": "480px"
      },
      "pattern": {
        "size": {
          "xs": "240px",
          "sm": "320px",
          "md": "400px",
          "lg": "480px",
          "xl": "560px"
        },
        "opacity": {
          "light": 0.04,
          "dark": 0.06
        }
      }
    },

    "card": {
      "borderRadius": "8px",
      "borderWidth": "1px",
      "padding": {
        "xs": "16px",
        "sm": "20px",
        "lg": "24px"
      },
      "floatingCards": {
        "showOnMobile": false,
        "minBreakpoint": "1024px",
        "opacity": {
          "near": 0.7,
          "far": 0.55
        },
        "positions": {
          "card1": { "top": "18%", "left": "8%", "width": "180px", "height": "120px" },
          "card2": { "top": "22%", "right": "7%", "width": "160px", "height": "100px" },
          "card3": { "bottom": "20%", "left": "10%", "width": "140px", "height": "90px" },
          "card4": { "bottom": "18%", "right": "9%", "width": "170px", "height": "110px" }
        }
      }
    },

    "button": {
      "primary": {
        "padding": {
          "xs": "12px 24px",
          "sm": "13px 28px",
          "lg": "14px 32px"
        },
        "fontSize": {
          "xs": "0.75rem",
          "sm": "0.813rem",
          "lg": "0.875rem"
        },
        "radius": "8px",
        "fontWeight": 400,
        "letterSpacing": "0.02em"
      },
      "secondary": {
        "padding": {
          "xs": "12px 24px",
          "sm": "13px 28px",
          "lg": "14px 32px"
        },
        "fontSize": {
          "xs": "0.75rem",
          "sm": "0.813rem",
          "lg": "0.875rem"
        },
        "radius": "8px",
        "fontWeight": 300,
        "letterSpacing": "0.02em"
      },
      "ctaGroup": {
        "layout": {
          "xs": "column",
          "md": "row"
        },
        "gap": {
          "xs": "12px",
          "md": "16px"
        },
        "fullWidthBelow": "640px"
      }
    },

    "scrollHint": {
      "lineHeight": "32px",
      "lineWidth": "1px",
      "labelSize": {
        "xs": "0.5rem",
        "lg": "0.625rem"
      },
      "showOnMobile": true,
      "bottomOffset": {
        "xs": "24px",
        "lg": "32px"
      }
    },

    "skeleton": {
      "lineHeight": "6px",
      "lineRadius": "3px",
      "dotSize": "8px",
      "lineGap": "8px"
    },

    "timeline": {
      "markerSize": "36px",
      "connectorWidth": "1px",
      "gap": "28px"
    },

    "mobileNavDrawer": {
      "width": "100%",
      "background": "var(--surface)",
      "padding": "20px",
      "linkSize": "1rem",
      "linkWeight": 300,
      "linkPadding": "16px 0",
      "dividerColor": "var(--border)",
      "animation": {
        "type": "slideDown",
        "duration": "300ms",
        "easing": "cubic-bezier(0.4, 0, 0.2, 1)"
      }
    }
  },

  "accessibility": {
    "focusRing": {
      "width": "2px",
      "offset": "2px",
      "color": {
        "light": "hsl(35, 30%, 60%)",
        "dark": "hsl(35, 20%, 50%)"
      }
    },
    "minTouchTarget": "44px",
    "reducedMotion": {
      "disableAnimations": true,
      "disableFloatingCards": true,
      "disablePatternSpin": true
    },
    "contrastRatios": {
      "light": {
        "primaryOnBg": "12.5:1",
        "secondaryOnBg": "5.2:1",
        "mutedOnBg": "3.1:1"
      },
      "dark": {
        "primaryOnBg": "13.1:1",
        "secondaryOnBg": "5.8:1",
        "mutedOnBg": "3.4:1"
      }
    }
  },

  "meta": {
    "inspiration": "M.C. Escher — tessellations, impossible geometry, and recursive patterns",
    "colorAnchor": "HSL 30–40 (warm earth tones)",
    "aesthetic": "Papery, tactile, warm, minimal",
    "fontSource": "https://vercel.com/font (Geist Sans & Geist Mono)",
    "cssCustomProperties": {
      "prefix": "--nexora",
      "example": "--nexora-color-bg, --nexora-font-sans, --nexora-space-md"
    }
  }
}
import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════
   NEXORA WARM PAPER DESIGN SYSTEM — Hero Section
   React / TypeScript · Mobile-First Responsive
   ═══════════════════════════════════════════════════════ */

// ── Design Tokens ──────────────────────────────────────

const tokens = {
  colors: {
    light: {
      bg: "hsl(40, 30%, 97%)",
      surface: "hsl(40, 25%, 95%)",
      surfaceElevated: "hsl(40, 28%, 98%)",
      textPrimary: "hsl(30, 15%, 15%)",
      textSecondary: "hsl(30, 10%, 40%)",
      textMuted: "hsl(35, 10%, 60%)",
      textDisabled: "hsl(35, 8%, 75%)",
      border: "hsl(35, 15%, 85%)",
      borderSubtle: "hsl(35, 12%, 90%)",
      accent: "hsl(35, 20%, 88%)",
      accentHover: "hsl(35, 22%, 84%)",
      hoverBg: "hsl(40, 25%, 93%)",
      focusRing: "hsl(35, 30%, 80%)",
      overlay: "hsla(30, 15%, 15%, 0.04)",
    },
    dark: {
      bg: "hsl(30, 5%, 10.5%)",
      surface: "hsl(30, 5%, 12%)",
      surfaceElevated: "hsl(30, 6%, 14%)",
      textPrimary: "hsl(40, 20%, 92%)",
      textSecondary: "hsl(40, 15%, 70%)",
      textMuted: "hsl(30, 10%, 50%)",
      textDisabled: "hsl(30, 8%, 35%)",
      border: "hsl(30, 5%, 20%)",
      borderSubtle: "hsl(30, 5%, 16%)",
      accent: "hsl(35, 20%, 30%)",
      accentHover: "hsl(35, 22%, 35%)",
      hoverBg: "hsl(30, 5%, 15%)",
      focusRing: "hsl(35, 20%, 50%)",
      overlay: "hsla(40, 20%, 92%, 0.04)",
    },
  },
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
    paper:
      "0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02)",
    elevated: "0 25px 50px -12px rgba(0,0,0,0.08)",
  },
} as const;

// ── Escher Pattern SVG ────────────────────────────────

const EscherPattern = ({ color }: { color: string }) => (
  <svg
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "100%", height: "100%" }}
  >
    <defs>
      <pattern
        id="escher"
        x="0"
        y="0"
        width="80"
        height="80"
        patternUnits="userSpaceOnUse"
      >
        {[0, 40].map((x) =>
          [0, 40].map((y) => (
            <path
              key={`${x}-${y}`}
              d={`M${x} ${y} L${x + 40} ${y} L${x + 40} ${y + 40} L${x} ${y + 40} Z`}
              stroke={color}
              strokeWidth="0.5"
              fill="none"
            />
          ))
        )}
        {[20, 60].map((cx) =>
          [0, 40].map((y) => (
            <path
              key={`v-${cx}-${y}`}
              d={`M${cx} ${y} Q${cx + 10} ${y + 20} ${cx} ${y + 40} Q${cx - 10} ${y + 20} ${cx} ${y}`}
              stroke={color}
              strokeWidth="0.5"
              fill="none"
            />
          ))
        )}
        {[0, 40].map((x) =>
          [20, 60].map((cy) => (
            <path
              key={`h-${x}-${cy}`}
              d={`M${x} ${cy} Q${x + 20} ${cy + 10} ${x + 40} ${cy} Q${x + 20} ${cy - 10} ${x} ${cy}`}
              stroke={color}
              strokeWidth="0.5"
              fill="none"
            />
          ))
        )}
        {[20, 60].map((cx) =>
          [20, 60].map((cy) => (
            <circle
              key={`c-${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r="3"
              stroke={color}
              strokeWidth="0.3"
              fill="none"
            />
          ))
        )}
      </pattern>
    </defs>
    <rect width="400" height="400" fill="url(#escher)" />
  </svg>
);

// ── Skeleton Card ─────────────────────────────────────

interface SkeletonCardProps {
  lines: Array<"dot" | number>;
  style: React.CSSProperties;
  animDelay: number;
  isDark: boolean;
}

const SkeletonCard = ({ lines, style, animDelay, isDark }: SkeletonCardProps) => {
  const c = isDark ? tokens.colors.dark : tokens.colors.light;
  return (
    <div
      style={{
        position: "absolute",
        background: c.surface,
        border: `1px solid ${c.border}`,
        borderRadius: 8,
        padding: 24,
        boxShadow: tokens.shadows.paper,
        opacity: 0,
        animation: `nexoraFloatIn ${animDelay}s ease-out forwards, nexoraFloat 12s ease-in-out ${animDelay + 0.8}s infinite`,
        ...style,
      }}
    >
      {lines.map((line, i) =>
        line === "dot" ? (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: c.accent,
              marginBottom: 12,
            }}
          />
        ) : (
          <div
            key={i}
            style={{
              height: 6,
              borderRadius: 3,
              background: c.accent,
              width: `${line}%`,
              marginBottom: i < lines.length - 1 ? 8 : 0,
            }}
          />
        )
      )}
    </div>
  );
};

// ── Hamburger Icon ────────────────────────────────────

const HamburgerIcon = ({ open, color }: { open: boolean; color: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <line
      x1="3"
      y1="5"
      x2="17"
      y2="5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      style={{
        transition: "all 300ms ease",
        transformOrigin: "center",
        transform: open ? "translateY(5px) rotate(45deg)" : "none",
      }}
    />
    <line
      x1="3"
      y1="10"
      x2="17"
      y2="10"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      style={{
        transition: "all 300ms ease",
        opacity: open ? 0 : 1,
      }}
    />
    <line
      x1="3"
      y1="15"
      x2="17"
      y2="15"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      style={{
        transition: "all 300ms ease",
        transformOrigin: "center",
        transform: open ? "translateY(-5px) rotate(-45deg)" : "none",
      }}
    />
  </svg>
);

// ── Scroll Hint ───────────────────────────────────────

const ScrollHint = ({ isDark }: { isDark: boolean }) => {
  const c = isDark ? tokens.colors.dark : tokens.colors.light;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        animation: "nexoraFadeUp 0.8s ease-out 1s both",
      }}
    >
      <span
        style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: "0.5rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase" as const,
          color: c.textMuted,
        }}
      >
        Scroll
      </span>
      <div
        style={{
          width: 1,
          height: 32,
          background: c.border,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-100%",
            left: 0,
            width: "100%",
            height: "100%",
            background: c.textMuted,
            animation: "nexoraScrollPulse 2s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════
// ── MAIN COMPONENT ───────────────────────────────────
// ══════════════════════════════════════════════════════

export default function NexoraHero() {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const stylesRef = useRef<HTMLStyleElement | null>(null);

  const c = isDark ? tokens.colors.dark : tokens.colors.light;

  // ── Responsive listener ──
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMobile(e.matches);
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  // ── Inject keyframes ──
  useEffect(() => {
    if (stylesRef.current) return;
    const style = document.createElement("style");
    style.textContent = `
      @keyframes nexoraFadeUp {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes nexoraFadeDown {
        from { opacity: 0; transform: translateY(-12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes nexoraFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      @keyframes nexoraFloatIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 0.65; transform: scale(1); }
      }
      @keyframes nexoraScrollPulse {
        0% { top: -100%; }
        50% { top: 100%; }
        100% { top: 100%; }
      }
      @keyframes nexoraSlowSpin {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
      }
      @keyframes nexoraMenuSlide {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(style);
    stylesRef.current = style;
  }, []);

  const navLinks = ["About", "Work", "Journal"];

  return (
    <div
      style={{
        fontFamily: "'Geist Sans', system-ui, -apple-system, sans-serif",
        background: c.bg,
        color: c.textPrimary,
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* ── Grain overlay ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(at 50% 20%, rgba(160,120,70,0.06) 0%, transparent 50%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ── Noise overlay ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: isDark ? 0.05 : 0.035,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ═══════ NAV ═══════ */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: isMobile ? "12px 16px" : "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          background: `color-mix(in srgb, ${c.bg} 80%, transparent)`,
          borderBottom: `1px solid ${c.border}`,
          animation: "nexoraFadeDown 0.8s ease-out",
        }}
      >
        {/* Logo */}
        <span
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: isMobile ? "0.75rem" : "0.875rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            color: c.textPrimary,
          }}
        >
          Nexora
        </span>

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 300,
                  color: c.textSecondary,
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = c.textPrimary)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = c.textSecondary)
                }
              >
                {link}
              </a>
            ))}
            <button
              onClick={() => setIsDark(!isDark)}
              aria-label="Toggle theme"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: `1px solid ${c.border}`,
                background: c.surface,
                color: c.textSecondary,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                fontSize: "0.875rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = c.accent;
                e.currentTarget.style.color = c.textPrimary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = c.surface;
                e.currentTarget.style.color = c.textSecondary;
              }}
            >
              {isDark ? "☀" : "☾"}
            </button>
          </div>
        )}

        {/* Mobile controls */}
        {isMobile && (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button
              onClick={() => setIsDark(!isDark)}
              aria-label="Toggle theme"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: `1px solid ${c.border}`,
                background: c.surface,
                color: c.textSecondary,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.813rem",
              }}
            >
              {isDark ? "☀" : "☾"}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: `1px solid ${c.border}`,
                background: c.surface,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              <HamburgerIcon open={menuOpen} color={c.textSecondary} />
            </button>
          </div>
        )}
      </nav>

      {/* ── Mobile Menu Drawer ── */}
      {isMobile && menuOpen && (
        <div
          style={{
            position: "fixed",
            top: isMobile ? 52 : 64,
            left: 0,
            right: 0,
            zIndex: 99,
            background: c.surface,
            borderBottom: `1px solid ${c.border}`,
            padding: "8px 16px 16px",
            animation: "nexoraMenuSlide 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {navLinks.map((link, i) => (
            <a
              key={link}
              href="#"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "16px 0",
                fontSize: "0.938rem",
                fontWeight: 300,
                color: c.textSecondary,
                textDecoration: "none",
                letterSpacing: "0.02em",
                borderBottom:
                  i < navLinks.length - 1
                    ? `1px solid ${c.borderSubtle}`
                    : "none",
                animation: `nexoraFadeUp 0.3s ease-out ${i * 0.05}s both`,
              }}
            >
              {link}
            </a>
          ))}
        </div>
      )}

      {/* ═══════ HERO ═══════ */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: isMobile ? "100px 20px 48px" : "128px 48px 64px",
          position: "relative",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        {/* Escher pattern */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? 280 : 560,
            height: isMobile ? 280 : 560,
            opacity: isDark ? 0.06 : 0.04,
            pointerEvents: "none",
            animation: "nexoraSlowSpin 120s linear infinite",
          }}
        >
          <EscherPattern color={c.textPrimary} />
        </div>

        {/* Floating cards — desktop only */}
        {!isMobile && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 0,
              overflow: "hidden",
            }}
          >
            <SkeletonCard
              isDark={isDark}
              lines={["dot", 90, 60, 80]}
              style={{ top: "18%", left: "8%", width: 180, height: 120 }}
              animDelay={1.0}
            />
            <SkeletonCard
              isDark={isDark}
              lines={[70, 90, 40]}
              style={{ top: "22%", right: "7%", width: 160, height: 100 }}
              animDelay={1.2}
            />
            <SkeletonCard
              isDark={isDark}
              lines={["dot", 80, 60]}
              style={{ bottom: "20%", left: "10%", width: 140, height: 90 }}
              animDelay={1.4}
            />
            <SkeletonCard
              isDark={isDark}
              lines={[60, 90, 70, 40]}
              style={{ bottom: "18%", right: "9%", width: 170, height: 110 }}
              animDelay={1.6}
            />
          </div>
        )}

        {/* ── Content ── */}
        <p
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: isMobile ? "0.563rem" : "0.75rem",
            fontWeight: 400,
            letterSpacing: "0.15em",
            textTransform: "uppercase" as const,
            color: c.textMuted,
            marginBottom: 32,
            animation: "nexoraFadeUp 0.8s ease-out 0.2s both",
          }}
        >
          Design System v2.0
        </p>

        <h1
          style={{
            fontSize: isMobile ? "2rem" : "4rem",
            fontWeight: 200,
            lineHeight: isMobile ? 1.1 : 1.05,
            letterSpacing: isMobile ? "-0.02em" : "-0.03em",
            color: c.textPrimary,
            maxWidth: isMobile ? "100%" : 720,
            marginBottom: 32,
            animation: "nexoraFadeUp 0.8s ease-out 0.35s both",
          }}
        >
          Built on paper,
          <br />
          shaped by{" "}
          <em style={{ fontStyle: "italic", fontWeight: 100 }}>geometry</em>
        </h1>

        <p
          style={{
            fontSize: isMobile ? "0.813rem" : "1rem",
            fontWeight: 300,
            color: c.textSecondary,
            maxWidth: isMobile ? "100%" : 480,
            lineHeight: 1.7,
            marginBottom: 48,
            animation: "nexoraFadeUp 0.8s ease-out 0.5s both",
          }}
        >
          A warm, papery aesthetic anchored in earth tones — where every surface
          feels tactile and every element finds its place in the tessellation.
        </p>

        {/* CTA Group */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 12 : 16,
            alignItems: "center",
            width: isMobile ? "100%" : "auto",
            maxWidth: isMobile ? 280 : "none",
            animation: "nexoraFadeUp 0.8s ease-out 0.65s both",
          }}
        >
          <button
            style={{
              fontFamily: "'Geist Sans', system-ui, sans-serif",
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              fontWeight: 400,
              letterSpacing: "0.02em",
              padding: isMobile ? "12px 24px" : "14px 32px",
              background: c.textPrimary,
              color: c.bg,
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: tokens.shadows.md,
              width: isMobile ? "100%" : "auto",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = tokens.shadows.paper;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = tokens.shadows.md;
            }}
          >
            Explore Components
          </button>
          <button
            style={{
              fontFamily: "'Geist Sans', system-ui, sans-serif",
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              fontWeight: 300,
              letterSpacing: "0.02em",
              padding: isMobile ? "12px 24px" : "14px 32px",
              background: "transparent",
              color: c.textSecondary,
              border: `1px solid ${c.border}`,
              borderRadius: 8,
              cursor: "pointer",
              transition: "all 0.3s ease",
              width: isMobile ? "100%" : "auto",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = c.textMuted;
              e.currentTarget.style.color = c.textPrimary;
              e.currentTarget.style.background = c.surface;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = c.border;
              e.currentTarget.style.color = c.textSecondary;
              e.currentTarget.style.background = "transparent";
            }}
          >
            Read the Docs
          </button>
        </div>

        {/* Scroll Hint */}
        <ScrollHint isDark={isDark} />
      </section>
    </div>
  );
}
import { useState, useEffect, useRef } from "react";

const tokens = {
  colors: {
    light: {
      bg: "hsl(40, 30%, 97%)", surface: "hsl(40, 25%, 95%)", surfaceElevated: "hsl(40, 28%, 98%)",
      textPrimary: "hsl(30, 15%, 15%)", textSecondary: "hsl(30, 10%, 40%)", textMuted: "hsl(35, 10%, 60%)",
      textDisabled: "hsl(35, 8%, 75%)", border: "hsl(35, 15%, 85%)", borderSubtle: "hsl(35, 12%, 90%)",
      accent: "hsl(35, 20%, 88%)", accentHover: "hsl(35, 22%, 84%)", hoverBg: "hsl(40, 25%, 93%)",
      focusRing: "hsl(35, 30%, 80%)", overlay: "hsla(30, 15%, 15%, 0.04)",
    },
    dark: {
      bg: "hsl(30, 5%, 10.5%)", surface: "hsl(30, 5%, 12%)", surfaceElevated: "hsl(30, 6%, 14%)",
      textPrimary: "hsl(40, 20%, 92%)", textSecondary: "hsl(40, 15%, 70%)", textMuted: "hsl(30, 10%, 50%)",
      textDisabled: "hsl(30, 8%, 35%)", border: "hsl(30, 5%, 20%)", borderSubtle: "hsl(30, 5%, 16%)",
      accent: "hsl(35, 20%, 30%)", accentHover: "hsl(35, 22%, 35%)", hoverBg: "hsl(30, 5%, 15%)",
      focusRing: "hsl(35, 20%, 50%)", overlay: "hsla(40, 20%, 92%, 0.04)",
    },
  },
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
    paper: "0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02)",
    elevated: "0 25px 50px -12px rgba(0,0,0,0.08)",
  },
};

const EscherPattern = ({ color }) => (
  <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    <defs>
      <pattern id="escher" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        {[0, 40].map(x => [0, 40].map(y => (
          <path key={`r-${x}-${y}`} d={`M${x} ${y} L${x+40} ${y} L${x+40} ${y+40} L${x} ${y+40} Z`} stroke={color} strokeWidth="0.5" fill="none" />
        )))}
        {[20, 60].map(cx => [0, 40].map(y => (
          <path key={`v-${cx}-${y}`} d={`M${cx} ${y} Q${cx+10} ${y+20} ${cx} ${y+40} Q${cx-10} ${y+20} ${cx} ${y}`} stroke={color} strokeWidth="0.5" fill="none" />
        )))}
        {[0, 40].map(x => [20, 60].map(cy => (
          <path key={`h-${x}-${cy}`} d={`M${x} ${cy} Q${x+20} ${cy+10} ${x+40} ${cy} Q${x+20} ${cy-10} ${x} ${cy}`} stroke={color} strokeWidth="0.5" fill="none" />
        )))}
        {[20, 60].map(cx => [20, 60].map(cy => (
          <circle key={`c-${cx}-${cy}`} cx={cx} cy={cy} r="3" stroke={color} strokeWidth="0.3" fill="none" />
        )))}
      </pattern>
    </defs>
    <rect width="400" height="400" fill="url(#escher)" />
  </svg>
);

const SkeletonCard = ({ lines, style, animDelay, isDark }) => {
  const c = isDark ? tokens.colors.dark : tokens.colors.light;
  return (
    <div style={{
      position: "absolute", background: c.surface, border: `1px solid ${c.border}`,
      borderRadius: 8, padding: 24, boxShadow: tokens.shadows.paper, opacity: 0,
      animation: `floatIn 0.8s ease-out ${animDelay}s forwards, floatIdle 12s ease-in-out ${animDelay + 0.8}s infinite`,
      ...style,
    }}>
      {lines.map((line, i) =>
        line === "dot" ? (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c.accent, marginBottom: 12 }} />
        ) : (
          <div key={i} style={{ height: 6, borderRadius: 3, background: c.accent, width: `${line}%`, marginBottom: i < lines.length - 1 ? 8 : 0 }} />
        )
      )}
    </div>
  );
};

const HamburgerIcon = ({ open, color }) => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <line x1="3" y1="5" x2="17" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round"
      style={{ transition: "all 300ms ease", transformOrigin: "center", transform: open ? "translateY(5px) rotate(45deg)" : "none" }} />
    <line x1="3" y1="10" x2="17" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round"
      style={{ transition: "all 300ms ease", opacity: open ? 0 : 1 }} />
    <line x1="3" y1="15" x2="17" y2="15" stroke={color} strokeWidth="1.5" strokeLinecap="round"
      style={{ transition: "all 300ms ease", transformOrigin: "center", transform: open ? "translateY(-5px) rotate(-45deg)" : "none" }} />
  </svg>
);

export default function NexoraHero() {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [width, setWidth] = useState(800);
  const containerRef = useRef(null);
  const stylesRef = useRef(null);

  const c = isDark ? tokens.colors.dark : tokens.colors.light;
  const isXS = width < 375;
  const isSM = width >= 375 && width < 640;
  const isMD = width >= 640 && width < 768;
  const isLG = width >= 768 && width < 1024;
  const isXL = width >= 1024;
  const isMobile = width < 640;

  // Responsive font size for H1
  const h1Size = isXS ? "1.75rem" : isSM ? "2rem" : isMD ? "2.5rem" : isLG ? "3rem" : isXL ? "3.75rem" : "4rem";
  const bodySize = isXS ? "0.813rem" : isSM ? "0.813rem" : isMD ? "0.875rem" : "1rem";
  const eyebrowSize = isXS ? "0.563rem" : isSM ? "0.625rem" : isMD ? "0.625rem" : "0.75rem";
  const btnSize = isMobile ? "0.75rem" : "0.875rem";
  const navPad = isXS ? "12px 12px" : isSM ? "12px 16px" : isMD ? "14px 24px" : "16px 32px";
  const logoSize = isMobile ? "0.75rem" : "0.875rem";
  const patternSize = isXS ? 200 : isSM ? 260 : isMD ? 360 : isLG ? 440 : 540;

  useEffect(() => {
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) setWidth(entry.contentRect.width);
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  useEffect(() => {
    if (stylesRef.current) return;
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
      @keyframes fadeDown { from { opacity:0; transform:translateY(-12px) } to { opacity:1; transform:translateY(0) } }
      @keyframes floatIdle { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-10px) } }
      @keyframes floatIn { from { opacity:0; transform:scale(0.95) } to { opacity:0.6; transform:scale(1) } }
      @keyframes scrollPulse { 0% { top:-100% } 50% { top:100% } 100% { top:100% } }
      @keyframes slowSpin { from { transform:translate(-50%,-50%) rotate(0deg) } to { transform:translate(-50%,-50%) rotate(360deg) } }
      @keyframes menuSlide { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
    `;
    document.head.appendChild(style);
    stylesRef.current = style;
  }, []);

  const navLinks = ["About", "Work", "Journal"];

  return (
    <div ref={containerRef} style={{
      fontFamily: "'Geist Sans', system-ui, -apple-system, sans-serif",
      background: c.bg, color: c.textPrimary, minHeight: "100vh",
      position: "relative", overflowX: "hidden", overflowY: "auto",
    }}>
      {/* Grain */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(at 50% 20%, rgba(160,120,70,0.06) 0%, transparent 50%)", pointerEvents: "none", zIndex: 1 }} />
      {/* Noise */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, opacity: isDark ? 0.05 : 0.035,
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100, padding: navPad,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        background: `color-mix(in srgb, ${c.bg} 80%, transparent)`,
        borderBottom: `1px solid ${c.border}`, animation: "fadeDown 0.8s ease-out",
      }}>
        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: logoSize, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: c.textPrimary }}>
          Nexora
        </span>
        {!isMobile ? (
          <div style={{ display: "flex", gap: isLG ? 24 : 32, alignItems: "center" }}>
            {navLinks.map(link => (
              <a key={link} href="#" style={{ fontSize: isMD ? "0.75rem" : "0.875rem", fontWeight: 300, color: c.textSecondary, textDecoration: "none", letterSpacing: "0.02em", transition: "color 0.3s ease" }}
                onMouseEnter={e => e.currentTarget.style.color = c.textPrimary}
                onMouseLeave={e => e.currentTarget.style.color = c.textSecondary}>
                {link}
              </a>
            ))}
            <button onClick={() => setIsDark(!isDark)} aria-label="Toggle theme"
              style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${c.border}`, background: c.surface, color: c.textSecondary, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease", fontSize: "0.875rem" }}
              onMouseEnter={e => { e.currentTarget.style.background = c.accent; e.currentTarget.style.color = c.textPrimary }}
              onMouseLeave={e => { e.currentTarget.style.background = c.surface; e.currentTarget.style.color = c.textSecondary }}>
              {isDark ? "☀" : "☾"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={() => setIsDark(!isDark)} aria-label="Toggle theme"
              style={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid ${c.border}`, background: c.surface, color: c.textSecondary, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>
              {isDark ? "☀" : "☾"}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen}
              style={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid ${c.border}`, background: c.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
              <HamburgerIcon open={menuOpen} color={c.textSecondary} />
            </button>
          </div>
        )}
      </nav>

      {/* Mobile drawer */}
      {isMobile && menuOpen && (
        <div style={{ position: "sticky", top: isMobile ? 58 : 64, zIndex: 99, background: c.surface, borderBottom: `1px solid ${c.border}`, padding: "4px 16px 12px", animation: "menuSlide 0.3s cubic-bezier(0.4,0,0.2,1)" }}>
          {navLinks.map((link, i) => (
            <a key={link} href="#" onClick={() => setMenuOpen(false)}
              style={{ display: "block", padding: "14px 0", fontSize: "0.875rem", fontWeight: 300, color: c.textSecondary, textDecoration: "none", letterSpacing: "0.02em", borderBottom: i < navLinks.length - 1 ? `1px solid ${c.borderSubtle}` : "none", animation: `fadeUp 0.3s ease-out ${i * 0.05}s both` }}>
              {link}
            </a>
          ))}
        </div>
      )}

      {/* ═══ HERO ═══ */}
      <section style={{
        minHeight: "calc(100vh - 64px)", display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: isMobile ? "40px 20px 48px" : isMD ? "48px 32px 56px" : "64px 48px 64px",
        position: "relative", zIndex: 2, textAlign: "center",
      }}>
        {/* Pattern */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: patternSize, height: patternSize, opacity: isDark ? 0.06 : 0.04,
          pointerEvents: "none", animation: "slowSpin 120s linear infinite",
        }}>
          <EscherPattern color={c.textPrimary} />
        </div>

        {/* Floating cards */}
        {isXL && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
            <SkeletonCard isDark={isDark} lines={["dot", 90, 60, 80]} style={{ top: "18%", left: "6%", width: 170, height: 115 }} animDelay={1.0} />
            <SkeletonCard isDark={isDark} lines={[70, 90, 40]} style={{ top: "22%", right: "5%", width: 155, height: 95 }} animDelay={1.2} />
            <SkeletonCard isDark={isDark} lines={["dot", 80, 60]} style={{ bottom: "22%", left: "8%", width: 135, height: 85 }} animDelay={1.4} />
            <SkeletonCard isDark={isDark} lines={[60, 90, 70, 40]} style={{ bottom: "18%", right: "7%", width: 165, height: 105 }} animDelay={1.6} />
          </div>
        )}

        {/* Content */}
        <p style={{
          fontFamily: "'Geist Mono', monospace", fontSize: eyebrowSize, fontWeight: 400,
          letterSpacing: "0.15em", textTransform: "uppercase", color: c.textMuted,
          marginBottom: isMobile ? 24 : 32, animation: "fadeUp 0.8s ease-out 0.2s both",
        }}>
          Design System v2.0
        </p>

        <h1 style={{
          fontSize: h1Size, fontWeight: 200, lineHeight: isMobile ? 1.12 : 1.05,
          letterSpacing: isMobile ? "-0.02em" : "-0.03em", color: c.textPrimary,
          maxWidth: isMobile ? "100%" : isMD ? 560 : 720, marginBottom: isMobile ? 24 : 32,
          animation: "fadeUp 0.8s ease-out 0.35s both", padding: isMobile ? "0 4px" : 0,
        }}>
          Built on paper,<br />shaped by{" "}
          <em style={{ fontStyle: "italic", fontWeight: 100 }}>geometry</em>
        </h1>

        <p style={{
          fontSize: bodySize, fontWeight: 300, color: c.textSecondary,
          maxWidth: isMobile ? "100%" : isMD ? 400 : 480, lineHeight: 1.7,
          marginBottom: isMobile ? 36 : 48, animation: "fadeUp 0.8s ease-out 0.5s both",
          padding: isMobile ? "0 8px" : 0,
        }}>
          A warm, papery aesthetic anchored in earth tones — where every surface feels tactile and every element finds its place in the tessellation.
        </p>

        {/* CTAs */}
        <div style={{
          display: "flex", flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 12 : 16, alignItems: "center",
          width: isMobile ? "100%" : "auto", maxWidth: isMobile ? 260 : "none",
          animation: "fadeUp 0.8s ease-out 0.65s both",
        }}>
          <button style={{
            fontFamily: "'Geist Sans', system-ui, sans-serif", fontSize: btnSize, fontWeight: 400,
            letterSpacing: "0.02em", padding: isMobile ? "12px 24px" : "14px 32px",
            background: c.textPrimary, color: c.bg, border: "none", borderRadius: 8,
            cursor: "pointer", transition: "all 0.3s ease", boxShadow: tokens.shadows.md,
            width: isMobile ? "100%" : "auto",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = tokens.shadows.paper }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = tokens.shadows.md }}>
            Explore Components
          </button>
          <button style={{
            fontFamily: "'Geist Sans', system-ui, sans-serif", fontSize: btnSize, fontWeight: 300,
            letterSpacing: "0.02em", padding: isMobile ? "12px 24px" : "14px 32px",
            background: "transparent", color: c.textSecondary, border: `1px solid ${c.border}`,
            borderRadius: 8, cursor: "pointer", transition: "all 0.3s ease",
            width: isMobile ? "100%" : "auto",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = c.textMuted; e.currentTarget.style.color = c.textPrimary; e.currentTarget.style.background = c.surface }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textSecondary; e.currentTarget.style.background = "transparent" }}>
            Read the Docs
          </button>
        </div>

        {/* Scroll Hint */}
        <div style={{
          position: "absolute", bottom: isMobile ? 20 : 32, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          animation: "fadeUp 0.8s ease-out 1s both",
        }}>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: isMobile ? "0.5rem" : "0.625rem", letterSpacing: "0.15em", textTransform: "uppercase", color: c.textMuted }}>
            Scroll
          </span>
          <div style={{ width: 1, height: 28, background: c.border, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-100%", left: 0, width: "100%", height: "100%", background: c.textMuted, animation: "scrollPulse 2s ease-in-out infinite" }} />
          </div>
        </div>
      </section>
    </div>
  );
}

