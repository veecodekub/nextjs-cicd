---
name: NestPost Hub Design System
description: Visual design specification for the NestPost developer hub.
colors:
  primary: "#4f46e5"
  primary-hover: "#4338ca"
  primary-light: "#6366f1"
  neutral-bg: "#09090b"
  neutral-surface: "#18181b"
  neutral-border: "#27272a"
  neutral-text: "#f4f4f5"
  neutral-text-muted: "#a1a1aa"
typography:
  display:
    fontFamily: "var(--font-geist-sans), sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "var(--font-geist-sans), sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 2.25rem)"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "var(--font-geist-sans), sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "-0.01em"
  body:
    fontFamily: "var(--font-geist-sans), sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "var(--font-geist-mono), monospace"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  sm: "4px"
  md: "8px"
  xl: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.md}"
    padding: "6px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "rgba(24, 24, 27, 0.3)"
    textColor: "{colors.neutral-text-muted}"
    rounded: "{rounded.md}"
    padding: "6px 16px"
  button-secondary-hover:
    backgroundColor: "rgba(24, 24, 27, 0.8)"
    textColor: "{colors.neutral-text}"
---

# Design System: NestPost Hub

## 1. Overview

**Creative North Star: "The Developer Sanctuary"**

NestPost Hub utilizes a dark, focused user interface designed to mirror a modern code editor environment. The system leans heavily on deep zinc shades, crisp 1px borders, and translucent layered surfaces to establish a clean hierarchical layout. High-fidelity indigo and violet accents serve to highlight interactive targets and key metadata without overstimulating the user's attention.

The visual direction rejects cluttered dashboards, excessive decorative gradients, and flat, uninspired gray-on-gray interfaces. High readability, precise alignment, and responsive micro-interactions give the sanctuary a sense of responsive craftsmanship.

**Key Characteristics:**
- Deep dark backdrop with a clean gray color scale (zinc).
- High-fidelity indigo/violet accents (used selectively at ≤10% visual weight).
- Flat surface containers defined by precise 1px borders and alpha-blended transparency.
- Technical typography (Geist Sans) coupled with monospace metadata (Geist Mono).

## 2. Colors

A dark, high-contrast palette built on a neutral zinc gray ramp and powered by vibrant indigo accents.

### Primary
- **Electric Indigo** (#4f46e5 / oklch(50% 0.25 285)): Primary interactive accent. Used for CTA buttons, primary states, and focus indicators.

### Secondary
- **Cyber Violet** (#7c3aed / oklch(55% 0.26 295)): Accent highlight used on hover gradients and branding markers.

### Neutral
- **Sanctuary Black** (#09090b / oklch(10% 0.005 240)): Main layout background.
- **Translucent Zinc** (rgba(24, 24, 27, 0.4) / oklch(15% 0.005 240 / 40%)): Default container and card surface.
- **Border Zinc** (#27272a / oklch(25% 0.005 240)): Structural borders for panels and cards.
- **Ink Light** (#f4f4f5 / oklch(95% 0.005 240)): Main readable text.
- **Ink Muted** (#a1a1aa / oklch(70% 0.005 240)): Supporting captions, labels, and secondary actions.

### Named Rules
**The 10% Accent Rule.** The vibrant indigo/violet accent colors must only occupy ≤10% of any given screen's total visual area. Their impact comes from rarity, drawing the eye directly to action points.

## 3. Typography

**Display Font:** Geist Sans (with system sans-serif fallback)
**Body Font:** Geist Sans (with system sans-serif fallback)
**Label/Mono Font:** Geist Mono (with system monospace fallback)

**Character:** A pairing of clean geometric sans-serif for headings and readable body text, contrasted with a clean monospace font for metadata (IDs, connection statuses, tags).

### Hierarchy
- **Display** (800, clamp(2.5rem, 5vw, 3.75rem), 1.1): Hero titles and main banners.
- **Headline** (800, clamp(1.875rem, 4vw, 2.25rem), 1.25): Section headers.
- **Title** (700, 1.125rem, 1.5): Post headings, card titles.
- **Body** (400, 0.875rem, 1.6): Standard paragraph text, capped at 75 characters (75ch) line length for readable layouts.
- **Label** (600, 0.75rem, 1.4, tracked 0.05em): monospaced IDs, stats, and badges.

## 4. Elevation

The system is flat by default, relying on structural borders and translucency rather than drop shadows to differentiate layers.

### Depth Vocabulary
- **Backdrop**: Sanctuary Black background (#09090b).
- **Surface**: Translucent Zinc container (rgba(24, 24, 27, 0.4)) with Border Zinc outline (#27272a).
- **Interactive Hover**: Background transition to rgba(24, 24, 27, 0.6) with Border Zinc (#27272a) translating slightly upward.

### Named Rules
**The Flat-By-Default Rule.** Surfaces remain flat and unshaded at rest. Drop shadows are forbidden except on active overlays (such as modals or absolute dropdowns) which use a heavy ambient dark shadow (0 10px 25px rgba(0, 0, 0, 0.5)) to isolate them from underlying text.

## 5. Components

### Buttons
- **Shape:** Medium rounded corners (8px radius).
- **Primary:** Electric Indigo (#4f46e5) background with clean white text, padded with 6px vertical and 16px horizontal spacing.
- **Hover / Focus:** Scale-down on click (95% transform) and background shift to Indigo-700 (#4338ca).
- **Secondary:** Border Zinc outline (#27272a) with rgba(24, 24, 27, 0.3) background, transitioning to rgba(24, 24, 27, 0.8) on hover.

### Cards / Containers
- **Corner Style:** Large rounded corners (12px radius).
- **Background:** Translucent Zinc (rgba(24, 24, 27, 0.4)).
- **Border:** Precise 1px Border Zinc (#27272a).
- **Internal Padding:** Large layout padding (24px spacing).

### Inputs / Fields
- **Style:** 1px Border Zinc (#27272a) outline with rgba(24, 24, 27, 0.2) background, rounded-xl corners.
- **Focus:** Border transitions to Indigo-500 (#6366f1) with a subtle background opacity shift to 40%.

### Navigation (Header)
- **Style:** Sticky header with 1px border-b outline (#18181b), backdrop blur filter (12px), and translucent Sanctuary Black background.

## 6. Do's and Don'ts

### Do:
- **Do** stick to a maximum 75ch line length limit on article content to optimize readability.
- **Do** use Geist Mono for code snippets, IDs, connection states, and email addresses.
- **Do** respect system-level preferences by disabling slide/fade animations if `prefers-reduced-motion` is active.

### Don't:
- **Don't** use colored side-stripe borders (e.g. border-left-4) as accents on list items or cards.
- **Don't** use gradient text combinations under dark modes; use clean white or solid light gray text instead.
- **Don't** use generic, unstyled cards. Always include the explicit 1px zinc-850 border and translucent background.
