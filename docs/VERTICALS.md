# Verticals and presets

Weft ships one codebase with three presets. This file specifies what the hair care and body care verticals add, and how the presets, demo content and design directions are organised. The clothing vertical and the B2B core are specified in the brief (`reference/brief/`).

## 1. Presets

| Preset | Industry | Look | Pilot store |
|---|---|---|---|
| **Weft** (default) | Clothing and fashion | The approved prototype: editorial, ink on white, Cormorant + Jost, yellow primary action | ibBan |
| **Tress** | Hair care, including professional and salon wholesale | Design direction from P0 (`docs/design-directions.md`) | Chosen by the owner |
| **Balm** | Body care | Design direction from P0 (`docs/design-directions.md`) | Chosen by the owner |

- The theme name Weft is final. Tress and Balm are working preset names; theme and preset names can't change after the first Theme Store upload, so the owner confirms them before P8.
- Presets differ only in their `settings_data.json` preset and in `listings/<preset>/` templates and section groups. Every block and section works in every preset.
- Each preset gets its own industry and catalog-size tags, and a demo store that matches them (BUILD_SPEC §8.4).

## 2. Shared vertical components

Each component is built once and styled by the preset's tokens.

| Component | Type | Clothing | Hair care | Body care |
|---|---|---|---|---|
| Product guide (image or table) | block | Size chart | Hair type or shade guide | Usage chart |
| Highlights (icon + text) | block | Fabric, fit, craft | Key benefits | Key benefits |
| Attribute chips | block | Fit, occasion | Hair type, concern | Skin type, concern |
| Ingredients (key + full list) | block | Materials | Key ingredients + full INCI list | Key ingredients + full INCI list |
| How to use (numbered steps, optional video) | block | Care instructions | Routine steps | Application steps |
| Badges | block | e.g. organic cotton | e.g. vegan, cruelty-free, sulfate-free | e.g. vegan, dermatologically tested |
| Tabs or accordions | block group | ✓ | ✓ | ✓ |
| Unit price | part of the price block | When set | Per 100 ml or per litre | Per 100 ml or per 100 g |
| Purchase options (selling plans) | block | When set | Replenishment | Replenishment |
| Complete the look / routine / ritual | complementary recommendations | Complete the look | Complete the routine | Complete the ritual |
| Guided finder | section | Find your fit | Hair type and concern finder | Skin type and scent finder |
| Before/after comparison slider | section | Styling | Results | Results |
| Steps / routine | section | Styling steps | Wash → condition → treat → style | Cleanse → exfoliate → moisturise |
| Shop the look (image hotspots) | section | ✓ | Salon looks | Optional |
| Quick order list (wholesale) | section | ✓ | ✓ (salons) | ✓ (spas, retailers) |
| Order matrix (wholesale) | block | Colour × size | Shade × size | Scent × size |

**Rules for these components:**
- **Content sources.** Content comes from block settings that accept dynamic sources (metafields), or from Shopify's standard category metafields where the product taxonomy provides them (hair type, skin type, scent and similar; confirm the keys in the admin).
- **Metaobjects.** Metaobject settings use standard definitions only (Theme Store rule).
- **Claims.** Results, percentages and claims such as "dermatologically tested" are merchant-entered text. The theme never invents, counts up or animates numbers.
- **Finders** only build links to filtered collection URLs (Search & Discovery filters). No scoring engine and no API calls.

## 3. Hair care (Tress)

**Product page:**
- **Variants and price:** volume variants (e.g. 250 ml, 1 L) with unit price.
- **Purchase options:** one-time or subscription (selling plans). The plan name and delivery frequency are clear before adding to cart.
- **Descriptors:** highlights, hair type and concern chips, badges.
- **Ingredients:** key ingredients with a short explanation each, then the full INCI list in a tab or accordion.
- **How to use:** numbered steps, with an optional video.
- **Complete the routine:** complementary products with step labels.
- **Shade swatches** for colour products, using swatch images or standard colour metaobjects.

**Sections:**
- guided hair finder
- routine builder (steps with products)
- before/after slider
- ingredient spotlight
- a "For professionals" banner that links to the wholesale sign-in page

**Wholesale (salons):**
- Professional-only products and back-bar sizes (e.g. 1 L, 5 L) visible only to wholesale buyers, through catalogs.
- Case packs through quantity rules (increment 6 or 12), plus volume tiers.
- The quick order list is the main reorder tool, with a link to order history in the Shopify customer account.

**Filters to showcase:** hair type, concern, size, price, availability.

## 4. Body care (Balm)

**Product page:**
- **Variants and price:** size variants (e.g. 200 ml, 500 ml) with unit price, and an optional travel size.
- **Purchase options:** subscription.
- **Scent:** scent notes (top, heart, base) and scent swatches.
- **Descriptors:** skin type and concern chips, badges.
- **Ingredients and safety:** key ingredients plus the full INCI list, warnings and precautions, and a period-after-opening icon (e.g. 12M) from a metafield.
- **How to use.**
- **Gifting:** a gift message saved as a line-item property; gift sets list their components when sold as bundles.
- **Complete the ritual:** complementary products.

**Sections:**
- scent and skin finder
- ritual steps
- before/after slider
- gift guide

**Wholesale (spas, retailers):**
- Testers and display units visible only to wholesale buyers.
- Case packs, volume tiers and the quick order list.

## 5. Sample data for demo stores and tests

- **Content rules:**
  - authentic copy and licensed images (Shopify Burst or owned photography)
  - never lorem ipsum
  - never another brand's name or images without written permission
- **Storage.** Each preset's data lives in `demo-content/<preset>/`: a Shopify product CSV, metafield definitions, collections, B2B setup notes and image credits.
- **Size.** Every demo store gets enough products to match the preset's catalog-size tag.

**Clothing (Weft).** The brief §9 products: Leila tunic, Zahra kaftan, Nour tote.

**Hair care (Tress):**

| Product | Variants | Retail | Wholesale rule (min / increment) | Tiers | Notes |
|---|---|---|---|---|---|
| Argan repair shampoo | 250 ml, 1 L | €14.95 / €39.95 | 6 / 6 | 24+, 48+ | Subscription |
| Curl defining cream | 300 ml | €18.50 | 6 / 6 | 36+ | Hair type: curly, coily |
| Bond repair mask | 200 ml, 500 ml | €22.00 / €44.00 | 6 / 6 | — | No-tier state |
| Back-bar shampoo | 5 L | Wholesale only | 2 / 2 | — | Professional-only |
| Colour cream | Shades 5.0, 6.1, 7.3 × 100 ml | €9.90 | 12 / 12 | 48+ | Shade swatches, order matrix |

**Body care (Balm):**

| Product | Variants | Retail | Wholesale rule (min / increment) | Tiers | Notes |
|---|---|---|---|---|---|
| Whipped shea body butter | 200 ml, 500 ml × Vanilla, Coconut, Unscented | €19.00 / €34.00 | 6 / 6 | 24+ | Subscription, period after opening 12M |
| Coffee body scrub | 250 g | €16.00 | 6 / 6 | — | Unit price per 100 g |
| Dry body oil | 100 ml | €24.00 | 6 / 6 | 36+ | Warnings |
| Body butter tester | 200 ml | Wholesale only | 1 / 1 | — | Tester |
| Ritual gift set | Bundle | €49.00 | 3 / 3 | — | Gift message |

All wholesale rules follow Shopify's validation:
- the minimum and maximum are multiples of the increment
- tier quantities are above the minimum and multiples of the increment

## 6. Design directions for Tress and Balm

Claude Code writes these in P0 as `docs/design-directions.md`, and the owner approves them before P6. Cover each preset with:

- a one-paragraph mood grounded in the vertical, not a generic look
- a palette of 4–6 named colours with hex values and roles, meeting the contrast rules
- heading and body fonts from Shopify's font library
- radius, spacing density, shadow and imagery rules
- how each shared component (§2) looks in this preset
- one static HTML sketch each of the home page and the product page, desktop and mobile

**Starting points:**
- **Tress (hair care):** precise and confident — strong type, high contrast, ingredient- and result-forward layouts, room for professional and salon messaging.
- **Balm (body care):** calm and sensory — softer radii, texture-led imagery and generous spacing, without falling into the default cream-and-terracotta palette.
- **Weft (clothing):** the approved prototype.
