# Nexora Landing Page Design System
> Warm Paper Aesthetic with Escher-Inspired Elements

---

## 🎨 Color Palette

### Light Mode

#### Background Colors
```css
--color-bg-primary: hsl(40, 30%, 97%);      /* Warm cream background - #FAF8F5 */
--color-bg-secondary: hsl(40, 25%, 95%);    /* Soft tan cards - #F6F3EE */
--color-bg-tertiary: hsl(40, 20%, 93%);     /* Slightly darker surfaces - #F2EEE7 */
--color-bg-elevated: hsl(0, 0%, 100%);      /* Pure white for elevated elements */
```

#### Text Colors
```css
--color-text-primary: hsl(30, 15%, 15%);          /* Deep brown-charcoal - #2D2621 */
--color-text-secondary: hsl(30, 15%, 35%);        /* Medium brown - #67594C */
--color-text-tertiary: hsl(30, 15%, 55%);         /* Light brown - #A39581 */
--color-text-muted: hsl(30, 10%, 65%);            /* Muted brown - #B8AE9E */
```

#### Border Colors
```css
--color-border-default: hsl(35, 15%, 85%);        /* Subtle muted border - #E0D9CE */
--color-border-light: hsl(35, 15%, 90%);          /* Very subtle border - #EBE6DD */
--color-border-accent: hsl(35, 20%, 75%);         /* Accent border - #CDC0AA */
```

### Dark Mode

#### Background Colors
```css
--color-bg-primary: hsl(30, 5%, 10.5%);     /* Rich charcoal base - #1B1B1B */
--color-bg-secondary: hsl(30, 5%, 12%);     /* Elevated surfaces - #1E1E1E */
--color-bg-tertiary: hsl(30, 5%, 14%);      /* Higher elevation - #242423 */
--color-bg-elevated: hsl(30, 5%, 16%);      /* Highest elevation - #292928 */
```

#### Text Colors
```css
--color-text-primary: hsl(40, 20%, 92%);          /* Warm off-white - #F3EFEA */
--color-text-secondary: hsl(40, 15%, 75%);        /* Muted warm white - #CFC6B8 */
--color-text-tertiary: hsl(40, 10%, 60%);         /* Subtle warm gray - #A8A19A */
--color-text-muted: hsl(40, 8%, 45%);             /* Very muted - #7D7870 */
```

#### Border Colors
```css
--color-border-default: hsl(30, 5%, 20%);         /* Subtle dark border - #353533 */
--color-border-light: hsl(30, 5%, 18%);           /* Very subtle border - #2F2F2D */
--color-border-accent: hsl(30, 5%, 25%);          /* Accent border - #414140 */
```

### Accent Colors (Warm Tans - Light & Dark)

#### Light Mode Accents
```css
--color-accent-primary: hsl(35, 20%, 88%);        /* Warm tan - #E8DFD2 */
--color-accent-secondary: hsl(35, 20%, 90%);      /* Lighter tan - #EDE6DB */
--color-accent-hover: hsl(35, 25%, 85%);          /* Hover state - #E3D7C5 */
--color-accent-active: hsl(35, 25%, 80%);         /* Active state - #DDCEB8 */
```

#### Dark Mode Accents
```css
--color-accent-primary: hsl(35, 15%, 28%);        /* Warm dark tan - #534935 */
--color-accent-secondary: hsl(35, 15%, 32%);      /* Lighter dark tan - #5F543F */
--color-accent-hover: hsl(35, 18%, 35%);          /* Hover state - #685D47 */
--color-accent-active: hsl(35, 18%, 40%);         /* Active state - #766950 */
```

### Status Colors
```css
--color-success: hsl(120, 25%, 65%);              /* Warm green */
--color-error: hsl(0, 60%, 60%);                  /* Warm red */
--color-warning: hsl(40, 80%, 60%);               /* Warm yellow */
--color-info: hsl(210, 25%, 60%);                 /* Muted blue */
```

---

## ✍️ Typography

### Font Families

**Primary Font: Geist Sans**
```css
font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```
- Used for: All body text, headings, UI elements
- Clean, modern, highly readable
- Excellent for both light and dark modes

**Monospace Font: Geist Mono**
```css
font-family: 'Geist Mono', 'Monaco', 'Courier New', monospace;
```
- Used for: Code snippets, technical content
- Consistent character widths
- Pairs perfectly with Geist Sans

### Font Weights
```css
--font-weight-normal: 400;     /* Regular body text */
--font-weight-medium: 500;     /* Medium emphasis */
--font-weight-semibold: 600;   /* Buttons, labels, subheadings */
--font-weight-bold: 700;       /* Strong headings */
```

### Font Size Scale
```css
/* Tailwind-compatible scale */
--text-xs: 0.75rem;      /* 12px - Fine print */
--text-sm: 0.875rem;     /* 14px - Small text, body */
--text-base: 1rem;       /* 16px - Standard body */
--text-lg: 1.125rem;     /* 18px - Large body */
--text-xl: 1.25rem;      /* 20px - Small headings */
--text-2xl: 1.5rem;      /* 24px - Section titles */
--text-3xl: 1.875rem;    /* 30px - H3 */
--text-4xl: 2.25rem;     /* 36px - H2 */
--text-5xl: 3rem;        /* 48px - H1 */
--text-6xl: 3.75rem;     /* 60px - Hero titles */
--text-7xl: 4.5rem;      /* 72px - Large hero */
```

### Typography Hierarchy

**Hero Headline (H1):**
- Desktop: `text-5xl` or `text-6xl` (48-60px)
- Mobile: `text-3xl` or `text-4xl` (30-36px)
- Weight: `font-semibold` (600)
- Tracking: `tracking-tight` (-0.025em)
- Line height: `leading-tight` (1.25)

**Section Headings (H2):**
- Desktop: `text-4xl` (36px)
- Mobile: `text-2xl` (24px)
- Weight: `font-semibold` (600)
- Tracking: `tracking-tight`

**Subsection Headings (H3):**
- Desktop: `text-2xl` (24px)
- Mobile: `text-xl` (20px)
- Weight: `font-semibold` (600)

**Body Text:**
- Standard: `text-sm` (14px) or `text-base` (16px)
- Color: `text-foreground` (primary text)
- Line height: `leading-relaxed` (1.625)

**Muted Text:**
- Size: `text-sm` (14px)
- Color: `text-muted-foreground` (tertiary text)
- Use for: Secondary information, captions, labels

### Letter Spacing
```css
--letter-spacing-tighter: -0.05em;  /* Very tight - large headings */
--letter-spacing-tight: -0.025em;   /* Tight - standard headings */
--letter-spacing-normal: 0;         /* Normal - body text */
--letter-spacing-wide: 0.025em;     /* Wide - small caps, labels */
```

---

## 📐 Spacing System

### Base Spacing Scale (Tailwind-compatible)
```css
--space-0: 0;
--space-px: 1px;
--space-0.5: 0.125rem;  /* 2px */
--space-1: 0.25rem;     /* 4px */
--space-2: 0.5rem;      /* 8px */
--space-3: 0.75rem;     /* 12px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-8: 2rem;        /* 32px */
--space-10: 2.5rem;     /* 40px */
--space-12: 3rem;       /* 48px */
--space-16: 4rem;       /* 64px */
--space-20: 5rem;       /* 80px */
--space-24: 6rem;       /* 96px */
--space-32: 8rem;       /* 128px */
```

### Section Spacing (Vertical Padding)

**Desktop:**
```css
py-16  /* 64px - Standard sections */
py-20  /* 80px - Important sections */
py-24  /* 96px - Hero sections */
py-32  /* 128px - Major sections */
```

**Mobile:**
```css
py-12  /* 48px - Standard sections */
py-16  /* 64px - Important sections */
py-20  /* 80px - Hero sections */
```

### Component Spacing
```css
/* Cards & Containers */
p-6   /* 24px - Standard card padding */
p-8   /* 32px - Large card padding */

/* Buttons */
px-6 py-3  /* Standard button */
px-8 py-4  /* Large button */
px-4 py-2  /* Small button */

/* Gaps */
gap-4  /* 16px - Tight spacing */
gap-6  /* 24px - Standard spacing */
gap-8  /* 32px - Comfortable spacing */
gap-12 /* 48px - Section spacing */
```

---

## 🎭 Escher-Inspired Design Elements

### Geometric Patterns
Incorporate M.C. Escher's tessellation and impossible geometry concepts:

1. **Tessellation Backgrounds:**
   - Subtle repeating geometric patterns
   - Use warm paper colors with slight opacity variations
   - Apply to section backgrounds or decorative elements

2. **Impossible Shapes:**
   - Penrose triangle variations
   - Subtle integration in hero section or decorative elements
   - Use stroke outlines in accent colors

3. **Metamorphosis Transitions:**
   - Gradual shape transformations between sections
   - Smooth transitions from one geometric form to another
   - Animated on scroll or hover

4. **Perspective Play:**
   - Isometric grid backgrounds (subtle)
   - Cards with slight 3D perspective
   - Depth through layering and shadows

### Implementation Ideas
```css
/* Tessellation pattern (CSS background) */
background-image:
  repeating-linear-gradient(45deg, transparent, transparent 35px,
    hsl(35, 20%, 90%) 35px, hsl(35, 20%, 90%) 70px);

/* Subtle isometric grid */
background-image:
  linear-gradient(30deg, hsl(35, 15%, 90%) 12%, transparent 12.5%, transparent 87%, hsl(35, 15%, 90%) 87.5%),
  linear-gradient(150deg, hsl(35, 15%, 90%) 12%, transparent 12.5%, transparent 87%, hsl(35, 15%, 90%) 87.5%);
background-size: 80px 140px;
```

---

## 🧱 Component Guidelines

### Cards
```css
/* Standard Card */
background: var(--color-bg-secondary);
border: 1px solid var(--color-border-default);
border-radius: 0.75rem; /* 12px - subtle rounded corners */
padding: 1.5rem; /* 24px */
box-shadow: 0 1px 3px 0 hsl(30, 15%, 15%, 0.05);
```

### Buttons

**Primary Button:**
```css
background: var(--color-text-primary);
color: var(--color-bg-primary);
padding: 0.75rem 1.5rem;
border-radius: 0.5rem;
font-weight: 600;
transition: all 0.2s ease;

/* Hover */
background: var(--color-accent-hover);
transform: translateY(-1px);
```

**Secondary Button:**
```css
background: var(--color-accent-primary);
color: var(--color-text-primary);
border: 1px solid var(--color-border-accent);
```

### Borders & Shadows
```css
/* Subtle shadow (cards, elevated elements) */
box-shadow: 0 1px 3px 0 hsl(30, 15%, 15%, 0.05),
            0 1px 2px 0 hsl(30, 15%, 15%, 0.03);

/* Medium shadow (hover states) */
box-shadow: 0 4px 6px -1px hsl(30, 15%, 15%, 0.08),
            0 2px 4px -1px hsl(30, 15%, 15%, 0.04);

/* Border radius */
--radius-sm: 0.375rem;   /* 6px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
```

---

## 🎬 Animations & Interactions

### Transitions
```css
/* Standard transition */
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

/* Smooth ease */
transition: all 0.3s ease-in-out;

/* Button hover */
transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
```

### Hover States
```css
/* Card hover */
transform: translateY(-2px);
box-shadow: 0 8px 16px -4px hsl(30, 15%, 15%, 0.1);

/* Button hover */
transform: translateY(-1px);
filter: brightness(1.05);
```

### Scroll Animations
- Fade in on scroll: `opacity: 0 → 1`
- Slide up on scroll: `transform: translateY(20px) → translateY(0)`
- Stagger children animations for lists

---

## 📱 Responsive Design

### Breakpoints (Tailwind defaults)
```css
sm: 640px   /* Tablet portrait */
md: 768px   /* Tablet landscape */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large desktop */
```

### Container Widths
```css
/* Standard container */
max-width: 1280px; /* xl */
padding: 0 1rem;   /* 16px sides on mobile */
margin: 0 auto;

/* Wide container */
max-width: 1536px; /* 2xl */

/* Narrow container (text-heavy sections) */
max-width: 896px;  /* ~56rem */
```

### Mobile-First Approach
Always design mobile-first, then enhance for larger screens:
```tsx
<div className="text-2xl sm:text-4xl md:text-5xl">
  Responsive Heading
</div>
```

---

## 🎨 Design Principles

### 1. Warmth & Readability
- Prioritize warm, earthy tones from the paper palette
- Ensure high contrast between text and backgrounds
- Use cream/tan backgrounds to reduce eye strain

### 2. Geometric Elegance
- Incorporate Escher-inspired geometric patterns subtly
- Use tessellations as decorative, not overwhelming, elements
- Maintain clean, structured layouts with mathematical precision

### 3. Depth & Dimension
- Create depth through subtle shadows and layering
- Use perspective to add visual interest
- Maintain flat design where appropriate for clarity

### 4. Smooth Interactions
- All interactions should feel natural and responsive
- Subtle animations enhance, never distract
- Hover states provide clear feedback

### 5. Consistency
- Maintain consistent spacing, colors, and typography
- Reuse components and patterns throughout
- Follow the design system rigorously

---

## 📋 Implementation Checklist

### Initial Setup
- [ ] Install Geist Sans and Geist Mono fonts
- [ ] Configure Tailwind CSS with custom colors (design.json)
- [ ] Set up CSS custom properties for theming
- [ ] Implement dark mode toggle

### Core Components
- [ ] Layout container component
- [ ] Section wrapper component
- [ ] Card component
- [ ] Button component (primary, secondary, tertiary)
- [ ] Typography components (H1-H6, body text)

### Escher Elements
- [ ] Create tessellation pattern SVGs
- [ ] Implement geometric decorations
- [ ] Add perspective grid backgrounds
- [ ] Animate transitions on scroll

### Responsive Implementation
- [ ] Test all breakpoints
- [ ] Ensure touch-friendly interactions
- [ ] Optimize font sizes for mobile
- [ ] Verify dark mode on all devices

---

## 🔗 Inspiration References

**Example Designs:**
- https://reap-odyssey.vercel.app/
- https://reap-odyssey.vercel.app/resume

**Escher Works:**
- Tessellation patterns (birds, fish transformations)
- Impossible constructions (Penrose triangle, Waterfall)
- Geometric art (Metamorphosis series)

**Design Philosophy:**
- Clean, readable hierarchy (Geist Sans)
- Warm, paper-like aesthetic
- Mathematical precision meets artistic creativity
- Dark mode with warm undertones, not stark black
