# Weft — design directions for Tress and Balm

Written in P0 (28 Sep 2026). The owner approves these before P6 (VERTICALS.md §6). Until then P1–P5 build the shared component system with tokens, so both directions can be applied through settings alone.

Weft (clothing) follows the approved prototype and is not repeated here beyond the token table in §3.

Static sketches (home page and product page, responsive: open at 1440 px and 390 px):
- `docs/sketches/tress.html`
- `docs/sketches/balm.html`

Every colour pair used for text below was checked for WCAG 2.2 contrast (ratios in the tables).

---

## 1. Tress — hair care

### Mood
Tress is the salon's back room made public: precise, confident and a little clinical. Hair care is bought on proof: what's in it, what it does to which hair type, and whether professionals use it. So the layout leads with ingredients, results and hair-type chips, not lifestyle mood boards. Type is strong and condensed-feeling, rules are hard black lines, corners are nearly square, and a single cobalt action colour cuts through a monochrome page. A small lime highlight marks professional-only information, so salon buyers recognise their world instantly when the storefront switches to wholesale.

### Palette
| Name | Hex | Role | Contrast |
|---|---|---|---|
| Ink | `#121316` | Text, headings, icons, rules, dark scheme background | 18.6:1 on Paper |
| Paper | `#FFFFFF` | Page background | — |
| Mist | `#EEF1F3` | Image backgrounds, panels, matrix header | Ink on Mist 16.4:1 |
| Rule | `#D9DDE1` | Input borders, dividers (non-text) | non-text, paired with Ink focus ring |
| Cobalt | `#2B45D6` | Primary action (Add to cart, checkout), links on hover | white text 7.2:1 |
| Signal lime | `#E4FF3A` | "Professional" tags and highlights, only on Ink | Ink on lime 16.5:1 |
| Sale red | `#C4122F` | Sale context only | 6.0:1 on Paper |
| Slate | `#5A6068` | Secondary text | 6.4:1 on Paper |

Status colours stay the shared set (ok `#15803D`, low `#B45309`, bad `#B91C1C`), always with text.

### Type
- Headings: **Archivo** 700 (`archivo_n7`), tight tracking (−0.01em), sentence case.
- Body and interface: **Instrument Sans** 400 / 500 / 600 (`instrument_sans_n4`).
- Scale (px): 12, 14, 16, 20, 28, 36, 48. Product title 36 desktop / 28 mobile. Prices Instrument Sans 600, tabular figures.
- Two font files preloaded: Instrument Sans 400 and Archivo 700.

### Shape, space, elevation, imagery
- Radius: buttons and inputs 4 px, cards 2 px, drawers 8 px, media 0.
- Density: compact — 4 px base, buy box rhythm 12/20 px, section spacing 64 px desktop / 40 px mobile.
- Elevation: flat; 1 px Ink rules instead of shadows; overlays get one shadow token.
- Imagery: product on Mist, straight-on packshots; texture close-ups (lather, strands) at 1:1; before/after pairs at identical crop; salon photography for the professional banner. No gradients, no tinted overlays over 30 %.

### Components in Tress
| Component | Look |
|---|---|
| Product guide | "Hair type guide" / "Shade guide" button with a comb/shade icon; modal shows a table with Ink header row |
| Highlights | 2-column grid of icon + bold 14 px label + 1-line text; icons 24 px line icons |
| Attribute chips | Square-cornered outline chips, Ink border; "Curly · Coily" |
| Ingredients | Key ingredients as numbered rows (01, 02…) with a one-line benefit, then "Full ingredient list (INCI)" accordion in 13 px monospace-feel spacing |
| How to use | Numbered steps with large Archivo numerals, optional video poster on Mist |
| Badges | Small Ink-on-lime pills for "Professional", outline pills for vegan / sulfate-free |
| Tabs / accordions | Hard 1 px rules, plus/minus icon, 56 px rows |
| Unit price | "€5.98 / 100 ml" under the price in Slate |
| Purchase options | Two stacked radio cards (one-time / subscribe) with Cobalt selected border; plan name + frequency shown before adding |
| Complete the routine | Horizontal row of 3 compact cards labelled "Step 1 · Wash", "Step 2 · Condition"… |
| Guided finder | Full-width Ink band; question chips in lime-outline; result is a link to the filtered collection |
| Before/after slider | Square frame, Ink handle with arrow keys hint |
| Steps / routine | 4 columns with step numerals and a product card each |
| Shop the look | Salon photo with Ink hotspot dots |
| Quick order list / order matrix | Dense table, Mist header, Ink row rules, Cobalt primary button in the summary bar |

---

## 2. Balm — body care

### Mood
Balm is quiet and tactile, like the moment after a bath. Body care is bought through the senses: scent, texture and how the skin feels. So pages are generous and slow: large texture photography (whipped butter, oil droplets, salt grain), soft corners, and a cool lavender-grey palette that feels clean and a little floral without falling into the cream-and-terracotta cliché. A deep plum carries all actions and headings, giving the calm page a confident spine. Scent notes and skin-type chips are designed as first-class, calm components rather than badges.

### Palette
| Name | Hex | Role | Contrast |
|---|---|---|---|
| Plum ink | `#2E2433` | Text, headings, icons | 14.2:1 on Porcelain |
| Porcelain | `#FAFAFB` | Page background (cool near-white) | — |
| Haze | `#ECE8F1` | Panels, image backgrounds, chips | Plum ink on Haze 12.3:1 |
| Heather | `#6B5E73` | Secondary text, captions | 5.8:1 on Porcelain |
| Aubergine | `#4B2E5A` | Primary action | white text 11.4:1 |
| Rosehip | `#B0243C` | Sale context only | 6.4:1 on Porcelain |
| Veil | `#DCD6E3` | Dividers, input borders (non-text) | non-text |

### Type
- Headings: **Instrument Serif** 400 (`instrument_serif_n4`), generous line-height 1.15, sentence case.
- Body and interface: **Figtree** 400 / 500 / 600 (`figtree_n4`).
- Scale (px): 12, 14, 16, 20, 26, 36, 52. Product title 40 desktop / 30 mobile. Prices Figtree 600, tabular.
- Two font files preloaded: Figtree 400 and Instrument Serif 400.

### Shape, space, elevation, imagery
- Radius: buttons and inputs pill (999 px), cards 20 px, media 12 px, drawers 24 px.
- Density: airy — 4 px base, buy box rhythm 20/32 px, section spacing 96 px desktop / 56 px mobile.
- Elevation: soft single shadow on drawers and sheets only (`0 16px 48px rgba(46,36,51,.14)`); surfaces flat.
- Imagery: macro texture shots at 4:5; product on Haze; hands and skin in natural light; no terracotta props or beige sets; consistent cool white balance.

### Components in Balm
| Component | Look |
|---|---|
| Product guide | "Usage chart" link with a drop icon; modal is a rounded sheet |
| Highlights | 3 soft-icon tiles on Haze, 20 px radius |
| Attribute chips | Pill chips on Haze, no border: "Dry skin · Sensitive" |
| Ingredients | Key ingredients as rounded cards with a short line each; full INCI in an accordion |
| How to use | Numbered steps with circled numerals, optional video poster with 12 px radius |
| Badges | Outline pills in Heather for "Vegan", "Dermatologically tested" (merchant text) |
| Scent notes | Three columns Top / Heart / Base, each with a small note name list and a thin Veil divider |
| Period after opening | Standard open-jar icon with "12M" inside, caption "Use within 12 months of opening" |
| Warnings | Accordion with an info icon, Plum text on Porcelain |
| Gift message | Rounded textarea with character counter, saved as a line-item property |
| Unit price | "€9.50 / 100 ml" under the price in Heather |
| Purchase options | Rounded radio cards; selected card on Haze with Aubergine border |
| Complete the ritual | Carousel of rounded cards with "Cleanse / Exfoliate / Moisturise" labels |
| Guided finder | Haze panel, large serif question, pill answers |
| Before/after slider | 12 px rounded frame, circular Aubergine handle |
| Ritual steps | Vertical timeline on mobile, 3 columns on desktop |
| Gift guide | Featured collection preset with price-band tabs |
| Quick order list / order matrix | Same structure as Weft; rows 48 px, rounded summary bar |

---

## 3. Token table (all three presets)

| Token | Weft | Tress | Balm |
|---|---|---|---|
| `--c-fg` / heading | `#2A2B2A` | `#121316` | `#2E2433` |
| `--c-bg` | `#FFFFFF` | `#FFFFFF` | `#FAFAFB` |
| `--c-surface` | `#F4F4F4` | `#EEF1F3` | `#ECE8F1` |
| `--c-line` | `#E7E7E7` | `#D9DDE1` | `#DCD6E3` |
| `--c-muted` | `#6B6B6B` | `#5A6068` | `#6B5E73` |
| `--c-primary` / on-primary | `#FBD816` / `#0F1111` | `#2B45D6` / `#FFFFFF` | `#4B2E5A` / `#FFFFFF` |
| `--c-primary-hover` | `#E8C70F` | `#2238B4` | `#3C2449` |
| `--c-sale` | `#AA1155` | `#C4122F` | `#B0243C` |
| Heading font | Cormorant 600 | Archivo 700 | Instrument Serif 400 |
| Body font | Jost 400 | Instrument Sans 400 | Figtree 400 |
| `--r-button` | 26 px | 4 px | 999 px |
| `--r-card` | 16 px | 2 px | 20 px |
| `--r-media` | 0 | 0 | 12 px |
| `--r-drawer` | 16 px | 8 px | 24 px |
| Section spacing (d / m) | 80 / 48 | 64 / 40 | 96 / 56 |
| Page width | 1260 | 1320 | 1200 |
