---
version: alpha
name: Quiet Workspace Design Language
description: |
  A monochrome product-first design language built around SpaceMono, calm document-like surfaces, and behaviour-led personality. The system sits between a quiet thinking workspace and an organised desk: restrained, legible, functional, and deliberately low-noise. It uses black, white, and greys only. There are no decorative colour accents, no gradient branding, and no visual theatrics. The interface earns personality through how it behaves: clear states, precise spacing, predictable controls, useful affordances, and a sense that every element has been placed to help the user think, write, edit, sort, and act.

colors:
  primary: "#000000"
  primary-active: "#111111"
  on-primary: "#ffffff"
  canvas: "#ffffff"
  canvas-soft: "#f7f7f5"
  surface: "#ffffff"
  surface-soft: "#f4f4f2"
  surface-muted: "#e9e9e6"
  surface-elevated: "#ffffff"
  ink: "#000000"
  ink-secondary: "#2c2c2c"
  ink-muted: "#666666"
  ink-faint: "#9a9a9a"
  hairline: "#e2e2df"
  hairline-strong: "#cfcfcc"
  code-bg: "#0b0b0b"
  code-ink: "#f8f8f8"
  code-muted: "#a8a8a8"
  selection: "rgba(0,0,0,0.08)"
  focus-ring: "rgba(0,0,0,0.28)"

typography:
  display-1:
    fontFamily: SpaceMono
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: -1.2px
  heading-1:
    fontFamily: SpaceMono
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.6px
  heading-2:
    fontFamily: SpaceMono
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.32
    letterSpacing: -0.3px
  heading-3:
    fontFamily: SpaceMono
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.44
    letterSpacing: -0.1px
  title:
    fontFamily: SpaceMono
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0
  body-md:
    fontFamily: SpaceMono
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.72
    letterSpacing: -0.05px
  body-sm:
    fontFamily: SpaceMono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  body-sm-strong:
    fontFamily: SpaceMono
    fontSize: 13px
    fontWeight: 700
    lineHeight: 1.55
    letterSpacing: 0
  caption:
    fontFamily: SpaceMono
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0.1px
  button:
    fontFamily: SpaceMono
    fontSize: 13px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0
  code-md:
    fontFamily: SpaceMono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  code-sm:
    fontFamily: SpaceMono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0

rounded:
  none: 0px
  xs: 3px
  sm: 5px
  md: 8px
  lg: 12px
  xl: 18px
  xxl: 24px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  xxxl: 48px
  section: 72px
  shell: 264px
  content: 760px

components:
  app-shell:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
  sidebar:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.body-sm}"
    width: "{spacing.shell}"
    borderColor: "{colors.hairline}"
  sidebar-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "8px 10px"
  sidebar-row-active:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.md}"
  top-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
    height: "52px"
    borderColor: "{colors.hairline}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "9px 16px"
    height: "36px"
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "9px 16px"
    height: "36px"
    borderColor: "{colors.hairline-strong}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "8px 10px"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.full}"
    size: "36px"
  icon-button-active:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.ink}"
  composer:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xxl}"
    padding: "12px 14px"
    borderColor: "{colors.hairline-strong}"
  composer-focused:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xxl}"
    focusRing: "{colors.focus-ring}"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
    borderColor: "{colors.hairline}"
  text-area:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "12px 14px"
    borderColor: "{colors.hairline}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "24px"
    borderColor: "{colors.hairline}"
  card-muted:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "24px"
    borderColor: "{colors.hairline}"
  document-block:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    maxWidth: "{spacing.content}"
  table-cell:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    padding: "10px 12px"
    borderColor: "{colors.hairline}"
  table-header:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
    padding: "10px 12px"
    borderColor: "{colors.hairline}"
  code-block:
    backgroundColor: "{colors.code-bg}"
    textColor: "{colors.code-ink}"
    typography: "{typography.code-md}"
    rounded: "{rounded.lg}"
    padding: "16px"
  inline-code:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.code-sm}"
    rounded: "{rounded.xs}"
    padding: "2px 5px"
  popover:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: "8px"
    borderColor: "{colors.hairline}"
  modal-card:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "24px"
    borderColor: "{colors.hairline-strong}"
  toast:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: "10px 14px"
---

# Quiet Workspace Design Language

## Overview

This design language is a monochrome product system for focused thinking, writing, organising, editing, and decision-making. It sits between a quiet thinking workspace and an organised desk. The interface should feel calm, clear, useful, and deliberately undesigned in the best sense: nothing ornamental, nothing theatrical, nothing added only to signal brand energy.

The primary typeface is **SpaceMono**. This gives the system a technical, precise, slightly editorial voice while remaining highly legible. SpaceMono should not be treated as a novelty typeface. It is the system's main structural material: headings, body text, controls, labels, code, metadata, navigation, and captions all use the same family. Hierarchy comes from scale, weight, spacing, alignment, and contrast, not from mixing typefaces.

The colour system is exclusively black, white, and greys. No chromatic accent colour is used for brand, success, error, warning, links, buttons, or decorative emphasis. Interaction states are communicated through weight, fill, border strength, underline, focus rings, opacity, shape, and motion. This keeps the product visually stable and prevents the interface from becoming emotionally loud.

Personality comes from product behaviour. The system should feel intelligent because it responds cleanly, organises information well, reduces friction, remembers context where appropriate, exposes useful controls at the right moment, and avoids unnecessary interface noise. It should not rely on illustration, mascot, gradient, colour, or expressive decoration to feel distinctive.

## Core Principles

### 1. Function before decoration

Every visible element must support orientation, input, reading, editing, selection, navigation, or confirmation. Decorative elements should be avoided unless they also clarify structure.

### 2. Monochrome discipline

Use only black, white, and greys. Do not introduce blue links, green success states, red errors, orange warnings, or coloured badges. State must be communicated through monochrome variation.

### 3. Product behaviour is the personality

The brand character is not visual ornament. It appears through calm transitions, precise states, useful empty states, readable generated content, predictable controls, and clear system feedback.

### 4. Workspace, not campaign

The product should feel like a place to work, not a landing page trying to sell itself. Avoid large marketing gestures unless they directly improve comprehension.

### 5. Organised desk logic

The interface should feel arranged, not decorated. Related items sit together. Active objects are clear. Secondary tools recede. The user should always understand where they are, what they can do, and what has changed.

### 6. Typographic legibility over typographic expression

SpaceMono gives the system enough personality. Do not over-style it. Use generous line-height, controlled measure, clear grouping, and consistent rhythm.

## Colour Language

The base palette is monochrome with a slightly warm neutral canvas. Use pure white for the main work surface, soft greys for secondary surfaces, and black for primary actions and high-emphasis text.

Primary actions use black fill with white text. Secondary actions use white or soft grey fills with black text and a visible hairline. Disabled states use low-contrast grey fills and faint text. Destructive or warning actions should not become red or orange; instead, use stronger framing, clear copy, confirmation steps, or black-on-white warning panels.

Links should be black and underlined on interaction or when embedded in long-form prose. Persistent blue link styling is not part of this system.

### Recommended usage

- Main canvas: `#ffffff`
- Soft page background: `#f7f7f5`
- Cards and panels: `#ffffff`
- Muted controls: `#f4f4f2`
- Active rows: `#e9e9e6`
- Primary text: `#000000`
- Secondary text: `#2c2c2c`
- Muted text: `#666666`
- Faint text: `#9a9a9a`
- Borders: `#e2e2df`
- Strong borders: `#cfcfcc`

## Typography

SpaceMono is the primary and only required typeface. It gives the interface a measured, systematic, slightly coded quality. Because monospaced type can become tiring if set too tightly, body copy needs generous line-height and controlled widths.

Body text should usually sit at 15px with a line-height around 1.72. Dense labels can use 13px. Captions can use 11px. Headings should avoid excessive scale. A restrained hierarchy keeps the system usable and avoids turning the product into a poster.

### Type hierarchy

| Role | Size | Weight | Line height | Use |
|---|---:|---:|---:|---|
| Display | 40px | 700 | 1.12 | Empty states, rare hero moments |
| Heading 1 | 28px | 700 | 1.25 | Major page titles |
| Heading 2 | 22px | 700 | 1.32 | Section titles |
| Heading 3 | 18px | 700 | 1.44 | Card titles, grouped panels |
| Title | 16px | 700 | 1.5 | Compact object headings |
| Body | 15px | 400 | 1.72 | Main reading text |
| Small body | 13px | 400 | 1.55 | Navigation, helper text, dense UI |
| Caption | 11px | 400 | 1.45 | Metadata, disclaimers, timestamps |
| Button | 13px | 700 | 1 | Button labels |

### Typographic rules

Use sentence case for most interface labels. Avoid all-caps except for small technical tags, file extensions, or intentionally machine-like metadata. Avoid decorative punctuation. Avoid wide tracking in headings. Use bold sparingly; weight should signal structure, not excitement.

## Layout

The layout uses a two-part logic: a focused work canvas and an organising shell. The work canvas contains the main document, conversation, editor, or task. The shell contains navigation, file lists, settings, saved items, filters, or secondary actions.

The preferred desktop structure is a fixed-width left sidebar around 264px and a flexible main canvas. The main reading or editing column should stay around 720–760px. This creates enough width for dense, monospaced text without making lines too long.

Whitespace should feel deliberate but not luxurious. This is not a glossy marketing system. Use large gaps to separate major regions, not to create visual drama. Use hairlines when a boundary needs to be explicit. Avoid stacked cards unless the user needs to compare multiple objects.

### Layout rhythm

- Base spacing: 8px
- Compact gaps: 4px / 8px
- Standard UI gaps: 12px / 16px
- Card padding: 24px
- Major section gaps: 48px / 72px
- Reading width: 720–760px
- Sidebar width: 264px

## Components

### App shell

The app shell should be quiet and stable. Use a white main canvas and a soft-grey sidebar. Navigation rows are transparent by default. Active rows use a muted grey fill and stronger text weight. Do not use coloured active indicators.

### Composer / command input

The composer is the main action surface. It should feel like a controlled work object, not a decorative chat bubble. Use a white surface, strong hairline, large radius, and clear internal grouping. Attachments, tools, send actions, and mode switches should sit inside or immediately beside the composer.

Default: white surface, black text, grey placeholder, strong hairline.
Focused: same surface, darker border or monochrome focus ring.
Disabled: soft grey surface, faint text, no animation.

### Cards

Cards should be used for grouped information, not decoration. Default cards are white with a 1px hairline and 12px radius. Muted cards use soft grey backgrounds. Avoid heavy shadows. If elevation is needed, use border contrast and spatial separation before shadow.

### Buttons

Primary buttons are black pills with white SpaceMono text. Secondary buttons are white pills with black text and a hairline. Ghost buttons are text/icon-only controls with muted text.

No colour states. Active and pressed states darken, invert, increase border strength, or use a soft grey fill.

### Tables

Tables should feel precise and utilitarian. Headers use soft grey fill, strong small text, and hairline dividers. Body rows stay white with subtle horizontal rules. Avoid zebra striping unless the table is dense enough to require row tracking.

### Empty states

Empty states should be calm and useful. Use a short heading, one clear sentence, and one primary next action. Avoid illustration unless it directly explains the product. The empty state should feel like a clean desk, not a billboard.

### Code and technical content

Code can either appear as black-on-white inline notation or as inverted black code blocks. Use SpaceMono for all code. Code blocks may use a black background because they represent a distinct content mode, not a brand accent.

## Interaction Behaviour

Interaction states are precise and understated. The interface should never feel inert, but it should not perform for attention.

Hover states may use soft grey fills or underline. Focus states use a monochrome focus ring. Active states use stronger fill or weight. Loading states should be minimal: small inline progress indicators, skeleton rows, or quiet pulsing surfaces in grey. Avoid colourful spinners.

Feedback should be immediate and useful. Confirmation toasts use black pills with white text. Errors use clear copy, stronger border, and proximity to the affected field. Warnings use plain language and structure, not colour.

## Motion

Motion should clarify state changes only. Use short transitions between 120ms and 220ms. Easing should be simple and non-bouncy. Avoid decorative parallax, floating graphics, liquid transitions, animated gradients, or personality animations.

Recommended motion uses:

- Fade in for newly generated content
- Subtle height expansion for panels
- Soft background fill transition on active rows
- Cursor or caret emphasis for writing surfaces
- Minimal skeleton loading for pending content

## Imagery and Decoration

The system does not require illustration, photography, stickers, mascots, or brand graphics. When imagery appears, it should be content rather than chrome. Product screenshots, uploaded files, previews, diagrams, thumbnails, and user-generated assets are allowed because they serve the workspace.

Decoration should be structural if used: rules, grids, alignment marks, file metadata, timestamps, object outlines, and document previews. Avoid decorative icons unless they improve scanning.

## Voice and Copy

Copy should be plain, useful, and specific. The tone is calm and operational. Avoid hype, motivational phrasing, personality-led microcopy, or playful empty-state jokes.

Good labels:

- New document
- Upload file
- Save version
- Compare changes
- Open workspace
- Export markdown
- Review sources

Avoid labels like:

- Let’s get started
- Supercharge your workflow
- Magic happens here
- Unlock your creativity
- Your ideas, amplified

## Implementation Notes

Use CSS custom properties for all tokens. Keep the system portable and easy to adjust. The design should work without images, gradients, or third-party animation libraries.

```css
:root {
  --font-main: "Space Mono", SpaceMono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  --color-primary: #000000;
  --color-on-primary: #ffffff;
  --color-canvas: #ffffff;
  --color-canvas-soft: #f7f7f5;
  --color-surface: #ffffff;
  --color-surface-soft: #f4f4f2;
  --color-surface-muted: #e9e9e6;
  --color-ink: #000000;
  --color-ink-secondary: #2c2c2c;
  --color-ink-muted: #666666;
  --color-ink-faint: #9a9a9a;
  --color-hairline: #e2e2df;
  --color-hairline-strong: #cfcfcc;

  --radius-sm: 5px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 18px;
  --radius-xxl: 24px;
  --radius-full: 9999px;

  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;
  --space-xxl: 32px;
  --space-section: 72px;

  --content-width: 760px;
  --sidebar-width: 264px;
}
```

## Design Summary

This design language should feel like a precise monochrome workspace: part thinking environment, part organised desk. Its strength is not visual spectacle. Its strength is disciplined structure, legible SpaceMono typography, calm surfaces, predictable controls, and intelligent behaviour. The system should disappear when the user is focused and become visible only when it helps them act.
