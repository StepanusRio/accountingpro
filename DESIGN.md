---
name: Akuntansi Pro
description: Solutekno's internal accounting system for service businesses.
colors:
  ledger-indigo: "#6366f1"
  ledger-indigo-light: "#818cf8"
  ledger-indigo-deep: "#4f46e5"
  ledger-indigo-darkest: "#4338ca"
  surface-base: "#0c0e14"
  surface-raised: "#13151e"
  surface-overlay: "#1a1d2b"
  surface-input: "#10121a"
  surface-hover: "#1e2133"
  text-primary: "#eef0f6"
  text-secondary: "#8b8fa7"
  text-muted: "#5c5f77"
  border-default: "#1f2235"
  border-subtle: "#16182a"
  semantic-success: "#34d399"
  semantic-warning: "#fbbf24"
  semantic-danger: "#f87171"
  semantic-info: "#60a5fa"
typography:
  page-title:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.02em"
  stat-value:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  table-header:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.06em"
  mono:
    fontFamily: "JetBrains Mono, Fira Code, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  xl: "20px"
  pill: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  section: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.ledger-indigo}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
  button-primary-hover:
    backgroundColor: "{colors.ledger-indigo-deep}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
  button-ghost-hover:
    backgroundColor: "{colors.surface-hover}"
    textColor: "{colors.text-primary}"
  button-danger:
    backgroundColor: "transparent"
    textColor: "{colors.semantic-danger}"
  input-default:
    backgroundColor: "{colors.surface-input}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.75rem"
  badge-accent:
    backgroundColor: "rgba(99, 102, 241, 0.12)"
    textColor: "{colors.ledger-indigo-light}"
    rounded: "{rounded.pill}"
    padding: "0.125rem 0.5rem"
  card-default:
    backgroundColor: "{colors.surface-raised}"
    rounded: "{rounded.lg}"
    padding: "1.25rem 1.5rem"
  tab-active:
    backgroundColor: "{colors.ledger-indigo}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "0.5rem 1rem"
---

# Design System: Akuntansi Pro

## 1. Overview

**Creative North Star: "The Accounting Ledger"**

A meticulous double-entry ledger, translated from ruled paper and fountain-pen ink into a digital control surface. Every element exists to serve the numbers. The interface is dark because the user's attention should land on data, not on the container. Surfaces recede; figures advance. Decoration is absent not because it was removed, but because it was never considered.

The system inherits its discipline from traditional bookkeeping: columns align, totals anchor to the bottom-right, and balance indicators give instant feedback. PRODUCT.md's personality ("precise, reliable, professional") governs every decision. This is not a consumer app. It is not playful. It does not use color to entertain. Color confirms state (balanced, unbalanced, error) and nothing more.

The Accounting Ledger rejects the overly colorful warmth of consumer productivity tools (Notion, Trello, Asana) and the visual clutter of enterprise ERP dashboards (SAP, Oracle). It also rejects generic SaaS dashboard templates with hero-metric cards, gradient accents, and stock illustrations.

**Key Characteristics:**
- Data-dense, not decorative. Financial figures are the primary visual content.
- Dark tonal layering with a single restrained accent.
- Tabular numeric alignment across all financial displays.
- Indonesian-language UI with id-ID number formatting.
- Quiet motion: state transitions only, no choreography.

## 2. Colors: The Ledger Palette

A restrained palette: tinted dark neutrals plus one accent at less than 10% of surface area. Semantic colors carry functional meaning exclusively.

### Primary

- **Ledger Indigo** (#6366f1): The ink of a formal entry. Used for primary actions (buttons, active tabs, focus rings) and active navigation states. Its rarity on any given screen is the point; when it appears, it means "this is actionable" or "this is selected." Never decorative.
- **Ledger Indigo Light** (#818cf8): De-emphasized primary, used for active sidebar text and badge foregrounds. Softer than the full accent.
- **Ledger Indigo Deep** (#4f46e5): Hover state for primary buttons. Darkening on press, not lightening.
- **Ledger Indigo Darkest** (#4338ca): Active/pressed state. The deepest commitment of the accent.

### Neutral

- **Surface Base** (#0c0e14): The darkest ground. Body background, the paper the ledger sits on. Tinted toward indigo (not pure black).
- **Surface Raised** (#13151e): Cards, sidebar, table body. One step above base.
- **Surface Overlay** (#1a1d2b): Table headers, modal overlays, tab bar backgrounds. Two steps above base.
- **Surface Input** (#10121a): Form field backgrounds. Slightly darker than raised to create a subtle inset effect.
- **Surface Hover** (#1e2133): Row hover, interactive feedback. Appears only on interaction.
- **Text Primary** (#eef0f6): Headings, financial figures, account names. Warm off-white, never pure #fff.
- **Text Secondary** (#8b8fa7): Supporting text, table cell defaults. Readable but recessive.
- **Text Muted** (#5c5f77): Labels, placeholders, disabled states. The quietest voice.
- **Border Default** (#1f2235): Card borders, table row separators, input strokes. Visible but not competing.
- **Border Subtle** (#16182a): Inner separators within components. Nearly invisible.

### Semantic

- **Balanced Green** (#34d399): Trial balance matches. "Seimbang" indicator. Profit figures.
- **Alert Amber** (#fbbf24): Warnings, caution states. Used with muted background (12% opacity).
- **Error Red** (#f87171): Unbalanced state, validation errors, destructive actions. "Neraca tidak seimbang" indicator.
- **Info Blue** (#60a5fa): Informational badges, asset-type indicators.

Each semantic color has a muted variant at 12% opacity for background tinting. Semantic colors never appear as decoration; they always carry functional meaning.

### Named Rules

**The Ink Discipline Rule.** Ledger Indigo occupies less than 10% of any screen. Its scarcity is what makes it meaningful. If a screen feels "too indigo," elements have been promoted beyond their importance.

**The No Pure Black/White Rule.** Every neutral is tinted toward the indigo hue family. #000 and #fff are prohibited. The darkest surface is #0c0e14; the lightest text is #eef0f6.

## 3. Typography

**Body Font:** Inter (with ui-sans-serif, system-ui fallbacks)
**Mono Font:** JetBrains Mono (with Fira Code, ui-monospace fallbacks)

**Character:** Inter's tabular figures and OpenType features (cv02, cv03, cv04, cv11) give numeric columns the precision of a printed ledger. The font is workmanlike, not expressive. It never draws attention to itself; it draws attention to the data it carries.

### Hierarchy

- **Page Title** (700, 1.375rem, line-height 1.3, tracking -0.02em): One per page. "Dashboard", "Bagan Akun", "Jurnal Umum". Concise, authoritative.
- **Page Subtitle** (400, 0.8125rem, line-height 1.6): One sentence below the title. Muted color. Describes the page's purpose.
- **Stat Value** (700, 1.625rem, line-height 1.2, tracking -0.02em, tabular-nums): Financial headline figures on the dashboard. Always paired with a stat label.
- **Stat Label** (500, 0.75rem, uppercase, tracking 0.05em): Above stat values. Muted. "LABA BERSIH", "TOTAL ASET".
- **Body** (400, 0.8125rem, line-height 1.6): Default prose, table cells, form descriptions.
- **Label** (500, 0.75rem, line-height 1.5, tracking 0.02em): Form field labels, secondary text. Text-secondary color.
- **Table Header** (600, 0.6875rem, uppercase, tracking 0.06em): Column headers. Muted color. Small and authoritative.
- **Badge** (600, 0.6875rem, tracking 0.02em): Category tags (Aset, Kewajiban, Pendapatan). Pill-shaped.

### Named Rules

**The Tabular Figures Rule.** Every element that displays a financial amount uses `font-variant-numeric: tabular-nums` and `font-feature-settings: "tnum"`. Columns of numbers must align vertically without exception. The `.nums` utility class enforces this.

**The 65ch Rule.** No body text line exceeds 65 characters. In this product, most text is short (labels, descriptions, table cells), so the rule is rarely tested, but it applies to any prose block that appears.

## 4. Elevation

The system uses tonal layering as its primary depth mechanism: three surface tiers (base → raised → overlay) create hierarchy without shadows. Subtle ambient shadows appear on elevated interactive elements to reinforce state.

### Shadow Vocabulary

- **Ambient Low** (`0 4px 12px rgba(0, 0, 0, 0.15)`): Cards on hover. A barely-perceptible lift that confirms interactivity without dramatizing it.
- **Accent Glow** (`0 0 20px rgba(99, 102, 241, 0.25)`): Primary button hover. The indigo glow is functional, indicating the primary action is within reach.
- **Focus Ring** (`0 0 0 2px var(--color-surface-base), 0 0 0 4px var(--color-accent-500)`): Double-ring focus indicator for keyboard navigation. The gap (surface-base color) separates the ring from the element.
- **Tab Active** (`0 1px 4px rgba(99, 102, 241, 0.3)`): Active tab pill. A controlled lift within the tab bar container.
- **Modal Deep** (`0 24px 48px rgba(0, 0, 0, 0.4)`): Modal dialog. The heaviest shadow in the system, justified by the modal's z-index position.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, focus, active, elevated z-index). If a shadow is visible without user interaction, it must be a modal or a floating element.

## 5. Components

### Buttons

Refined and restrained. Small text (0.8125rem, 500 weight), tight padding, smooth transitions.

- **Shape:** Gently curved edges (10px radius).
- **Primary:** Ledger Indigo background, white text, 8px 16px padding. The only high-contrast element on most screens.
- **Hover:** Deepens to Ledger Indigo Deep with a subtle accent glow. No scale transform.
- **Focus:** Double-ring focus indicator (2px gap + 4px accent ring).
- **Active:** Darkens to Ledger Indigo Darkest. Immediate, no delay.
- **Ghost:** Transparent background, text-secondary foreground, 1px border-default stroke. The secondary action.
- **Ghost Hover:** Surface-hover background, text-primary foreground, border darkens.
- **Danger:** Transparent background, semantic-danger text. Hover adds 12% danger background tint.

### Cards / Containers

- **Corner Style:** Generously curved (14px radius).
- **Background:** Surface Raised (#13151e).
- **Border:** 1px solid border-default. Present at rest.
- **Shadow Strategy:** Flat by default. Ambient Low shadow appears on hover only.
- **Internal Padding:** 1.25rem vertical, 1.5rem horizontal (stat cards). 1.25rem uniform (standard cards).
- **Glass variant exists** (card-glass) but is reserved for exceptional use: frosted overlay on non-standard backgrounds. Never the default.

### Inputs / Fields

- **Style:** Surface Input background (darker than card), 1px border-default stroke, 10px radius.
- **Padding:** 0.5rem 0.75rem. Compact.
- **Focus:** Border shifts to Ledger Indigo, 3px accent glow ring at 15% opacity.
- **Placeholder:** Text Muted color.
- **Select:** Custom chevron (SVG data URI), same styling as text input.

### Tables

The workhorse component. Most screens are table-driven.

- **Container:** 14px radius, 1px border, surface-raised background. Horizontal scroll on overflow.
- **Header Row:** Surface Overlay background, uppercase 11px labels, 0.06em tracking. Muted color. Bottom border.
- **Body Cells:** 0.75rem vertical padding, 1rem horizontal. Text-secondary by default; text-primary for important data (account codes, financial figures).
- **Row Hover:** Surface Hover background. 0.1s transition.
- **Footer:** Surface Overlay background, top border, 600 weight text. Used for totals.

### Badges

- **Shape:** Full pill (9999px radius).
- **Size:** 11px text, 600 weight, 2px 8px padding.
- **Variants:** Accent (indigo, for Ekuitas), Success (green, for Pendapatan/Piutang), Warning (amber, for Kewajiban/Hutang), Danger (red, for Beban), Info (blue, for Aset). Each uses 12% opacity background with full-saturation text.

### Navigation (Sidebar)

- **Width:** Fixed 260px.
- **Background:** Surface Raised, right border.
- **Logo Block:** 64px height, indigo icon mark, "Akuntansi" title + "PRO EDITION" subtitle.
- **Section Label:** 10px uppercase, text-muted, wide tracking. "MENU".
- **Nav Item:** 13px medium weight, text-secondary. 3px left-right padding, 8px top-bottom. Rounded-lg (14px).
- **Active State:** 12% indigo background tint, ledger-indigo-light text, right chevron indicator.
- **Hover State:** Surface Hover background, text-primary foreground.
- **Footer:** Version string, text-muted, top border.

### Tabs

- **Container (Tab Bar):** Surface Overlay background, 10px radius, 1px border, 4px padding. Acts as a pill container.
- **Inactive Tab:** Transparent background, text-muted, 6px radius.
- **Active Tab:** Ledger Indigo background, white text, subtle accent shadow. The pill slides between options.
- **Hover (inactive):** Surface Hover background, text-secondary.

### Modal

- **Overlay:** Black at 60% opacity, 8px backdrop blur. Fade-in animation (0.15s).
- **Content:** Surface Raised background, 1px border, 20px radius. 1.5rem padding. Max-width 28rem. Slide-up animation (0.2s, from 8px below with 0.98 scale).
- **Shadow:** Modal Deep (the heaviest in the system).

### Status Dot

- **Live Indicator:** 6px circle, semantic-success color, 8px success glow, pulse animation (2s cycle). Used for WebSocket connection status.

### Empty State

- **Layout:** Centered column, 3rem vertical padding.
- **Icon:** 20% opacity, 1rem bottom margin.
- **Text:** Text-muted, 13px, centered.

### Error Banner

- **Background:** Danger at 12% opacity.
- **Border:** Danger at 20% opacity, 1px solid.
- **Text:** Semantic Danger, 13px.
- **Radius:** 10px.

### Skeleton Loader

- **Style:** Shimmer gradient (overlay → hover → overlay), 200% background-size, 1.5s animation. 6px radius.

## 6. Do's and Don'ts

### Do:

- **Do** use tabular figures (`font-variant-numeric: tabular-nums`) on every financial amount, balance, and total. Columns of numbers must align.
- **Do** keep Ledger Indigo under 10% of any screen's surface area. Primary buttons, active tabs, focus rings, and active nav items are the only sanctioned uses.
- **Do** use the three-tier tonal surface system (base → raised → overlay) to establish hierarchy. The tier tells the user what's ground, what's content, and what's context.
- **Do** show balance status immediately. If debit equals kredit, show a green "Seimbang" indicator. If not, show the selisih in red. The user should never have to calculate mentally.
- **Do** format all numbers with `id-ID` locale and `minimumFractionDigits: 2`. Consistency in number formatting is non-negotiable for a financial tool.
- **Do** keep all UI copy in Bahasa Indonesia. Accounting terms follow Indonesian standards: Neraca, Laba Rugi, Buku Besar, Jurnal Umum, Debit, Kredit.

### Don't:

- **Don't** use overly playful or colorful design patterns. PRODUCT.md explicitly rejects consumer-app aesthetics (Notion, Trello, Asana). Whimsy undermines trust in a financial tool.
- **Don't** use `#000` or `#fff` anywhere. Every neutral is tinted toward the indigo hue family. The darkest is #0c0e14; the lightest is #eef0f6.
- **Don't** use border-left or border-right greater than 1px as a colored accent stripe on cards, alerts, or list items. Use full borders, background tints, or badges instead.
- **Don't** use gradient text (`background-clip: text` with a gradient). Emphasis is through weight and size, never through decorative gradients.
- **Don't** use glassmorphism as the default surface treatment. The glass card variant exists for edge cases only; the standard card is opaque surface-raised with a solid border.
- **Don't** build hero-metric templates (big number, small label, supporting stats, gradient accent). Stat cards use a restrained radial gradient at 6% opacity, not a decorative gradient band.
- **Don't** create identical card grids with icon + heading + text repeated. If content is tabular, use a table. If content is a list, use a list.
- **Don't** use modals as the first solution. Inline editing, progressive disclosure, and page navigation are preferred. Modals are reserved for confirmations and short creation forms.
- **Don't** bloat the interface with enterprise-ERP density. Dense is acceptable; cluttered is not. PRODUCT.md explicitly rejects SAP/Oracle-style dashboards.
- **Don't** animate CSS layout properties. Use opacity and transform only. Easing is ease-out; no bounce, no elastic.
