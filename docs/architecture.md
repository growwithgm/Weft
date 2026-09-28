# Weft — architecture

Status: P0 (28 Sep 2026). This is the working plan for the theme code. It is verified against shopify.dev where noted (docs fetched 28 Sep 2026); anything marked *unverified* must be re-checked before the phase that depends on it.

Contents:
1. Principles
2. File map
3. Product page block tree
4. Audience model (retail, wholesale, editor preview)
5. JavaScript modules
6. CSS layers and tokens
7. Data flows: variant change, add to cart, cart edits, location switch
8. Settings architecture
9. Localization
10. Integrations layer and packaging
11. Testing and tooling
12. Risks

---

## 1. Principles

- **Server first.** Liquid renders every state, in the buyer's context. JavaScript only enhances: it fetches re-rendered fragments (Section Rendering API) and swaps them in. JavaScript never computes a price, a tier price or a stock figure; it only reads numbers that Liquid wrote into the page.
- **One product section, many blocks.** `main-product` renders the gallery plus a blocks column. Every product element is a theme block (`blocks/`), so the Theme Store rule "product information is built entirely from blocks" holds and every block works in every preset and template.
- **Audience is decided in Liquid.** `customer.b2b?` is the only wholesale switch. In the theme editor (`request.design_mode`) both audiences render, with wholesale blocks in a labelled sample state.
- **Islands.** No JavaScript runs at first paint except the header menu, search toggle and cart count. Every other component is a custom element whose module loads on visible, idle or first interaction.
- **Budgets decide design.** Deferred markup (`<template>`), no framework, per-section CSS, and at most two preloaded font files.
- **Brand-neutral code.** No brand strings, colours, URLs or numbers in Liquid, CSS or JS. Everything store-specific is a setting, a preset, a template, a locale string or a store config.

Verified on shopify.dev (28 Sep 2026):
- Theme blocks live in `blocks/`, are rendered with `{% content_for 'blocks' %}`, and static blocks with `{% content_for 'block', type: '…', id: '…' %}`. A section either defines local blocks or accepts theme blocks (`@theme` / targeted types), never both. Private blocks start with `_`. Blocks need a preset to show in the picker. Static blocks can be rendered conditionally and receive extra parameters.
- Conditional settings use `"visible_if": "{{ block.settings.x == 'y' }}"` (also `section.settings`, `settings`).
- Preset templates go in `listings/<preset>/templates/*.json`, with optional `listings/<preset>/sections/*.json` section groups; not needed with a single preset.
  Re-checked before P6 (Theme Store requirements, "Adding presets to your theme zip submission" and the zip structure example): folder names are the preset names in lower case with hyphens (`listings/weft`, `listings/tress`, `listings/balm`); root `templates/` and `sections/` keep the complete base set; each listing file overrides the base file of the same name; the CLI and GitHub integration ignore `listings/` (it is in `.shopifyignore`), so it only matters in the Theme Store zip.
- Fonts: `cormorant_n6`, `jost_n4`, `archivo_n7`, `instrument_sans_n4`, `instrument_serif_n4`, `figtree_n4` exist in Shopify's font library.

---

## 2. File map

Names are Weft's own. Nothing mirrors the live theme's file structure or class names.

### layout/
| File | Role |
|---|---|
| `theme.liquid` | `<html lang>`, meta/SEO/social tags, token `<style>`, critical CSS, import map, `content_for_header`, section groups, wholesale-only gate hooks (`noindex`), chat button, custom-code slots |
| `password.liquid` | Password page shell |

### config/
| File | Role |
|---|---|
| `settings_schema.json` | `theme_info` plus the global groups (§8) |
| `settings_data.json` | `current` plus three presets: Weft (default), Tress, Balm |
| `markets.json` | Pilot only; never in the Theme Store package |

### sections/ — groups
| Group file | Sections |
|---|---|
| `header-group.json` | `announcement-bar` → `header` |
| `footer-group.json` | `footer` (+ `apps` slot) |
| `overlay-group.json` | `cart-drawer`, `search-drawer`, `quick-add`, `compare-drawer`, `location-sheet`, `popup` (off) |

### sections/ — templates (main)
`main-product`, `main-collection`, `collection-banner`, `main-search`, `main-cart`, `main-list-collections`, `main-blog`, `main-article`, `main-page`, `main-404`, `main-password`, `main-gift-card` (rendered by `templates/gift_card.liquid`), `main-account-classic` family for `templates/customers/*` (classic accounts fallback), `wholesale-access` (sign-in / apply card), `quick-order-list`.

### sections/ — library (every live section has an equivalent; merges in `migration-map.md`)
`slideshow`, `image-banner`, `video` (inline and background layouts), `media-with-text`, `multi-column`, `icons-with-text`, `logo-list`, `testimonials`, `promo-grid`, `promo-strip`, `scrolling-banner`, `countdown-timer`, `collection-list`, `featured-collection`, `product-list`, `featured-product`, `link-lists`, `rich-text`, `newsletter`, `contact-form`, `faq`, `navigation-slideshow`, `shoppable-image`, `media-grid`, `featured-blog`, `product-hotspots` (live "Product features"), `product-comparison-grid`, `product-details`, `product-recommendations`, `recently-viewed`, `product-reviews`, `custom-liquid`, `apps`, `shipping-calculator`.

Vertical sections (VERTICALS.md §2–4): `guided-finder`, `before-after`, `routine-steps`, `ingredient-spotlight`. "Gift guide" and "For professionals" ship as presets of `featured-collection` and `image-banner`.

Integration sections (store builds only, §10): `integration-reviews-grid` (Judge.me shop metafields, product page), `integration-reviews-wall` (reviews page).

### blocks/ — product information (public, available in `main-product`, `featured-product`, `quick-add`)
| Block | Notes |
|---|---|
| `product-title` | h1 on product page, heading level setting elsewhere |
| `product-price` | Retail and wholesale in one component; unit price; tax note; installments message (Shopify Payment Terms form); wholesale "per piece", "from X at N+" link |
| `product-labels` | Variant-aware: sale, sold out, pre-order, new, custom |
| `product-rating` | Rating pill; source: store score (setting: metafield dynamic source) or product `reviews.rating`; hidden for wholesale |
| `variant-picker` | Swatches / buttons / dropdown; dynamic availability; product guide link slot |
| `product-guide` | Size / shade / usage guide modal (image, page or rich text; dynamic sources) |
| `stock-line` | Retail stock line ("In stock · ships in 24h", "Only a few left", "Sold out"), optional urgency bar (live "Inventory status") |
| `delivery-list` | Fit, Shipping (country rules setting, free-shipping progress), Installments row, Notify row, Returns row (always last) |
| `back-in-stock` | Notify button or bell link + drawer; core form = Shopify contact form; `integration-` variant posts to the Wasify endpoint |
| `buy-buttons` | Quantity (rules-aware), yellow Add to cart states, accelerated checkout, pickup availability, gift-card recipient form, backorder note, purchase options slot |
| `purchase-options` | Selling plans (subscriptions) with plan name and frequency |
| `wholesale-terms` | Rule chips (min, packs, max) or "Minimums vary" |
| `volume-pricing` | Tier table, active row, Show all |
| `order-matrix` | Colour × size grid + summary bar + no-JS form |
| `wholesale-quantity` | One-size stepper with in-cart count and live line total |
| `installments-note` | Wholesale Klarna-style line (provider name setting), retail row lives in `delivery-list` |
| `specifications` | Label/value rows from dynamic sources (live "Main features") |
| `collapsible` | Accordion row: rich text, page, or description with See more clamp |
| `description` | Product description, optional accordion and clamp |
| `product-meta` | Vendor, SKU, barcode, weight, type toggles (merges 4 live blocks) |
| `custom-option` | Line-item property: text, long text, checkbox, dropdown; `show_in_quick_add` |
| `product-signup` | Sign-up form (countdown / coming soon), unavailable-only option |
| `share` | X, Facebook, Pinterest, copy link |
| `complementary-products` | Shopify complementary recommendations; heading label "Complete the look / routine / ritual" per preset |
| `flash-message` | Over media or in column |
| `popup-link` | Opens a page or rich text in a modal |
| `highlights` | Icon + text list (vertical) |
| `attribute-chips` | Chips from a metafield list / text (hair type, skin type, fit) |
| `ingredients` | Key ingredients + full INCI list |
| `how-to-use` | Numbered steps, optional video |
| `badges` | Merchant-entered badges (vegan, organic cotton…) |
| `scent-notes` | Top / heart / base |
| `period-after-opening` | PAO icon (e.g. 12M) from a metafield |
| `gift-message` | Line-item property textarea with character limit |
| `product-countdown` | Merchant-set end date countdown for pre-order/countdown templates |

### blocks/ — generic (public)
`heading`, `text`, `button`, `image`, `video`, `icon`, `group` (layout container), `spacer`, `divider`, `custom-liquid`, `email-signup`.

### blocks/ — private (per-section parts, `_` prefix)
`_slide`, `_column`, `_icon-item`, `_logo`, `_testimonial`, `_promo-tile`, `_media-tile`, `_marquee-item`, `_collection-tile`, `_faq-item`, `_faq-category`, `_hotspot`, `_nav-slide`, `_link-column`, `_form-field`, `_comparison-row`, `_tab`, `_finder-question`, `_finder-answer`, `_routine-step`, `_mega-menu` (header), `_footer-column`, `_footer-text`, `_footer-newsletter`, `_popup-*`, `_collection-promo` (grid promo tiles), `_spec-row`.

### snippets/
| Snippet | Role |
|---|---|
| `tokens` | Settings → CSS custom properties (inline `<style>`) |
| `meta-tags`, `social-meta` | SEO, Open Graph, Twitter card, `page_image` |
| `icon` | Inline SVG icon set (one snippet, `name` param) |
| `image` | `image_url` + `image_tag` with widths, sizes, eager/lazy, focal point |
| `price` | Money output shared by cards, cart and product (retail / wholesale variants) |
| `product-card` | Retail and wholesale card (one file), swatches, labels, quick add, compare |
| `card-swatches` | Variant image / colour swatches |
| `rule-chips` | Wholesale chips from a variant rule (shared by block, card and cart) |
| `tier-rows` | Tier rows from `variant.quantity_price_breaks` |
| `quantity-input` | Stepper with `min`/`max`/`step` from rules |
| `cart-line` | Line markup shared by drawer and page |
| `cart-summary` | Totals, discounts, tax note, note, terms, checkout |
| `location-list` | Company location radio links (`url_to_set_as_current`) |
| `wholesale-gate` | Gate content (used by `main-product` when gated) |
| `pagination`, `facets`, `breadcrumbs`, `localization-form`, `social-links`, `payment-icons`, `chat-button`, `custom-code` |

### assets/
See §5 (JS) and §6 (CSS). Also `placeholder` images come from `placeholder_svg_tag`; no binary images ship except the favicon fallback.

### templates/
JSON everywhere Shopify allows: `index`, `product` (+ `product.preorder`, `product.countdown`, `product.coming-soon`), `collection` (+ `collection.flash-sale`, `collection.banner`), `list-collections`, `search`, `cart`, `blog`, `article`, `page` (+ `page.contact`, `page.faq`, `page.about`, `page.lookbook`, `page.wholesale-access`, `page.wholesale-request`, `page.wholesale-onboarding`, `page.quick-order`, `page.reviews`, `page.shipping-calculator`, `page.coming-soon`, `page.custom-payment`, `page.policy`), `404`, `password`, `customers/*`, and `gift_card.liquid`. Context templates: `product.context.b2b-wholesale.json`, `index.context.b2b-wholesale.json`, `header-group.context.b2b-wholesale.json` as documented examples (store config), with one shared block order.

---

## 3. Product page block tree

`main-product` (section): settings for gallery layout (stacked / grid / carousel / thumbnails), media ratio, zoom and lightbox, media grouping by option, sticky info column, first-variant selection, mobile sticky bar, wholesale layout swap (gallery 7/12 → 5/12 when the order matrix renders). Accepts `@theme` product blocks and `@app`.

Default block order (Weft `product.json`, identical in every context template):

```
main-product
├─ gallery (static, section-owned; not a block — the media column)
└─ info column  {% content_for 'blocks' %}
   ├─ product-labels
   ├─ product-title
   ├─ product-price            retail: price, compare, unit price, tax, installments
   │                           wholesale: per piece, compare if higher, "from X at N+" (opens volume-pricing)
   ├─ product-rating           retail only
   ├─ wholesale-terms          wholesale only (sample in editor)
   ├─ installments-note        wholesale only, setting-controlled
   ├─ volume-pricing           wholesale only, hidden without tiers
   ├─ variant-picker           retail + wholesale non-matrix products
   │    └─ product-guide link (static child `_guide-link` when a guide block exists)
   ├─ stock-line               retail only
   ├─ delivery-list            retail only (Fit, Shipping, Installments, Notify, Returns)
   ├─ back-in-stock            retail only
   ├─ purchase-options         when the product has selling plans
   ├─ buy-buttons              retail; wholesale one-size uses wholesale-quantity instead
   ├─ wholesale-quantity       wholesale, products without the matrix tag
   ├─ order-matrix             wholesale + matrix tag (default `row`)
   ├─ specifications           (live "Main features")
   ├─ description              accordion, See more clamp
   ├─ collapsible (Returns)    retail only via "audience" setting
   └─ share
```

Every product block has an **Audience** setting (`all`, `retail`, `wholesale`) where it makes sense, so merchants can hide or show any block per audience without context templates. The wholesale-native blocks default to `wholesale` and the retail-native ones to `retail`; the brief's §4.4 table decides the defaults.

Sections below the product in `product.json`: `product-reviews` (core) or `integration-reviews-grid` (pilot), `product-recommendations` (related), `recently-viewed`, plus off-by-default `product-details`, `product-hotspots`, `product-comparison-grid`, `apps`, `collection-list`, `image-banner`.

Template variants (`preorder`, `countdown`, `coming-soon`) reuse `main-product` with different block presets: the buy button label follows the variant state (pre-order when inventory policy continues with 0 stock and a pre-order setting is on), `product-countdown` + `product-signup` replace buying for countdown/coming soon.

---

## 4. Audience model

```liquid
{%- liquid
  assign wholesale = false
  if customer.b2b?
    assign wholesale = true
  endif
  assign preview_both = request.design_mode
-%}
```

- Blocks decide visibility from their `audience` setting: render when `audience == 'all'`, or `retail` and not wholesale, or `wholesale` and wholesale. In `request.design_mode` every block renders; wholesale blocks show a labelled "Wholesale preview — sample data" state built from the product's real variants (rules default to min 1 / increment 1 when the editor session is not a B2B session).
- **Matrix products:** product has the tag from `settings.wholesale_matrix_tag` (default `row`) and has at least one option.
- **Wholesale-only products:** native first (catalog exclusion needs no code). Tag fallback `settings.wholesale_only_tag` (default `b2b`): cards skip the product in Liquid; `main-product` renders `wholesale-gate` and `theme.liquid` outputs `noindex` and no breadcrumbs.
- **Market context:** `localization.market.handle` is never used for pricing or audience. Market context templates only toggle sections (brief §2.1).
- **Locations:** `customer.current_company`, `customer.current_location`, `customer.company_available_locations` (`current?`, `url_to_set_as_current`), store credit from `customer.current_location.store_credit_account` when present.

---

## 5. JavaScript modules

All files are ES modules in `assets/`, mapped by an import map in `theme.liquid`:

```html
<script type="importmap">{"imports":{"@weft/core":"{{ 'core.js' | asset_url }}", …}}</script>
```

| Module | Loaded | Responsibility | Budget (min+gzip) |
|---|---|---|---|
| `core.js` | first paint (module, deferred) | event bus, `fetchSections()`, cart request helper, focus trap, live-region announcer, island loader (`data-load="visible|idle|interaction"`), editor event hooks | ≤ 6 KB |
| `header.js` | first paint | menu disclosure, mega-menu `<template>` hydration, mobile drawer, sticky state, cart count updates | ≤ 4 KB |
| `drawer.js` | interaction | `<weft-drawer>` / `<weft-modal>` / sheet: dialog, focus trap, return focus, Escape, scroll lock | ≤ 2 KB |
| `search.js` | interaction on search | predictive search (`/search/suggest?section_id=`), rotating placeholders, voice search (Web Speech API when present) | ≤ 3 KB |
| `cart.js` | interaction / after add | cart drawer and page: line steppers with rules, remove, note, Cart API `sections` refresh, errors inline | ≤ 5 KB |
| `rules.js` | imported by cart/product/matrix | **pure** functions: `validateLine`, `nextUp`, `nextDown`, `roundToIncrement`, `capFor`, `activeTier`, `lineIssues` — no DOM, unit tested with `node --test` | ≤ 1.5 KB |
| `product.js` | visible (product section) | variant picker → Section Rendering fetch with AbortController, swap `[data-swap]` nodes, URL `replaceState`, product form submit (`/cart/add.js` + `sections`), button states | ≤ 5 KB |
| `gallery.js` | visible | carousel counter, thumbnails, media grouping by option, lightbox, zoom, video/3D on interaction | ≤ 4 KB |
| `matrix.js` | visible (wholesale) | order matrix: keyboard grid, typed values commit on blur, rounding notes, summary bar, multi-item add, per-line Shopify errors, in-cart counts | ≤ 6 KB |
| (`matrix.js`) | visible | quick order list and quick order drawer reuse `<order-matrix>` from `matrix.js` (one validation path; decided in P3) | — |
| `sticky-bar.js` | idle (retail product, mobile) | IntersectionObserver on the real button, overlay awareness | ≤ 1 KB |
| `back-in-stock.js` | interaction | drawer, variant chips, contact-form or integration submit | ≤ 2 KB |
| `facets.js` | interaction | filters, sort, grid/list toggle via Section Rendering + history | ≤ 4 KB |
| `quick-add.js` | interaction | loads product fragment into `quick-add` drawer, reuses `product.js` | ≤ 1.5 KB |
| `compare.js` | interaction | compare checkbox, basket, drawer table (localStorage ids) | ≤ 2.5 KB |
| `recently-viewed.js` | visible | localStorage handles → `/search?q=…&section_id=` render | ≤ 1 KB |
| `carousel.js` | visible | slideshow / testimonials / product rows (scroll-snap based) | ≤ 3 KB |
| `countdown.js` | visible | countdown to merchant-set date, `hide_on_end` | ≤ 1 KB |
| `media.js` | interaction | deferred video / YouTube / Vimeo embeds, background video | ≤ 1.5 KB |
| `before-after.js`, `finder.js`, `popup.js`, `location.js`, `localization.js`, `custom-code.js` (loads merchant code per mode after consent) | on demand | — | ≤ 1.5 KB each |

Totals checked against §6.2: first interaction ≤ 15 KB (core + header ≈ 10 KB); product page with every island incl. matrix ≤ 70 KB.

Editor: `core.js` listens for `shopify:section:load|unload`, `shopify:block:select|deselect`; islands re-initialise through `connectedCallback`; selecting a block inside a drawer, tab or accordion opens it.

---

## 6. CSS layers and tokens

Cascade layers keep specificity flat:

```css
@layer reset, tokens, base, layout, components, sections, utilities;
```

| Layer | Where | Loaded |
|---|---|---|
| tokens | `snippets/tokens.liquid` inline `<style>` | render-blocking (tiny) |
| reset + base + layout + header + button + price | `assets/base.css` | render-blocking, budget-checked (≤ 14 KB with tokens) |
| components | `assets/component-*.css` (drawer, card, stepper, matrix, tiers, facets, accordion, modal…) | linked by the section/block that uses it |
| sections | `assets/section-*.css` | linked by the section; below-the-fold sections use `content-visibility:auto` |
| utilities | end of `base.css` | — |

Tokens (all from settings; every scheme redefines colour tokens on `.color-scheme-*`):

- Colour (scheme): `--c-bg`, `--c-fg`, `--c-heading`, `--c-muted`, `--c-surface` (Stone), `--c-line` (Hairline), `--c-primary`, `--c-on-primary`, `--c-primary-hover`, `--c-primary-active`, `--c-secondary` (outline button), `--c-on-secondary`.
- Colour (global): `--c-sale`, `--c-star`, `--c-ok`, `--c-low`, `--c-bad`, `--c-info`, `--c-disabled-bg`, `--c-disabled-fg`, `--c-installments-tint`.
- Type: `--f-heading`, `--f-body`, `--f-nav`, weights, scale `--t-12 … --t-44` (brief §8: 12, 14, 16, 20, 26, 34, 44) scaled by the base-size setting, `--t-title-d` / `--t-title-m`.
- Space: `--s-1` = 4 px … `--s-16`; section gap from setting.
- Shape: `--r-button` (pill 26 px in Weft), `--r-input`, `--r-card`, `--r-drawer` (16 px), `--r-media` (0 in Weft), `--border-width`.
- Elevation: `--shadow-overlay` (drawers, sheets, dropdown only).
- Layout: `--page-width` (1260 px Weft), `--gutter`, 12-column grid helpers.

Primitives: logical properties throughout (RTL), container queries for cards/blocks, `content-visibility:auto` + `contain-intrinsic-size` below the fold, `prefers-reduced-motion` guard, tabular figures for numbers.

---

## 7. Data flows

### 7.1 Variant change (product page, quick add, featured product)
1. `<variant-picker>` change → compute selected option value ids.
2. `product.js` builds `{{ product.url }}?option_values=<ids>&section_id=<section.id>` (*unverified: confirm `option_values` + Section Rendering on shopify.dev in P2*), aborts the previous request with `AbortController`.
3. Response HTML → for each `[data-swap="<key>"]` in the current section, replace with the node of the same key from the response (`price`, `labels`, `rules`, `tiers`, `stock`, `delivery`, `notify`, `buttons`, `media`, `matrix-summary`, `sku`, `pickup`, `unit-price`, `installments`, `sticky`).
4. `history.replaceState` with `?variant=<id>`; hidden `name="id"` input updated; `announce()` the new price and availability.
5. Because Liquid rendered the fragment in the buyer's session, wholesale prices, rules and tiers are correct by construction.

### 7.2 Add to cart (retail form, one-size wholesale, matrix)
- `POST /cart/add.js` with `items: [{id, quantity, properties, selling_plan}]` and `sections: "cart-drawer,cart-count,<product section if in-cart counts shown>"`, `sections_url: location.pathname`.
- Success: swap drawer + count, open drawer (setting `after_add`: drawer / page / none), cart icon shake option, announce.
- Error (422): message inline above the button (retail) or on the matrix cell + summary (wholesale). Never `alert()`.
- Matrix partial acceptance: Shopify either rejects the whole request or adjusts quantities; after the call, `/cart.js` is compared per variant to find adjusted lines, and Shopify's messages are shown on those cells (*verify behaviour of multi-item add errors in P3*).
- No JS: the product form posts to `/cart/add`; the matrix posts `items[][id]`/`items[][quantity]` (*confirm form parameter format in the Cart API docs, P3*).

### 7.3 Cart edits
- `POST /cart/change.js` (line + quantity) with `sections`. Wholesale steppers step with the line's rule (`item.variant.quantity_rule`); invalid lines are flagged by Liquid on render (`rules` computed from Liquid objects) and by `rules.js` while typing. Checkout button is `disabled` while any line is invalid (Liquid decides on render; JS mirrors after edits).

### 7.4 Location switch
- Links to `location.url_to_set_as_current` (full reload). The chip and `location-sheet` are plain links, so they work without JS. After reload, a one-time notice ("Prices and availability updated for {location}") shows when `sessionStorage` recorded the switch; without JS no notice is needed.

### 7.5 Recently viewed / compare
- localStorage holds product handles only; the markup comes from `/search?view=…` or `?section_id=` renders, so wholesale buyers see catalog prices and wholesale-only products respect catalog visibility.

---

## 8. Settings architecture

Global groups (parity list from BUILD_SPEC §4 + additions):

1. Logo and favicon (logo, logo width, favicon)
2. Colours (color_scheme_group + global accents: sale, stars, status set, installments tint, image blend)
3. Typography (heading, body, navigation font source, uppercase toggles, heading scale, base size)
4. Layout and design (page width, section spacing, border width, radii for buttons/inputs/cards/drawers/media, slider arrows, toggle icon, breadcrumbs per page type, pagination style)
5. Collection cards
6. Product cards (+ quick add, hover image, swatches on cards, rating, vendor, inventory)
7. Product compare
8. Product inventory (thresholds, notices, colours → mapped to status tokens)
9. Product labels
10. Swatches
11. Search (predictive, limits, placeholders, voice search)
12. Currency format
13. Cart (type, after add, empty link, recommendations, free-shipping bar, cart shake, terms)
14. Animations (reveal on scroll off by default, speed; always respects reduced motion)
15. Social media (+ WhatsApp number / URL used by the chat button)
16. **Wholesale** (matrix tag `row`, wholesale-only tag `b2b`, show SKU, wholesale installments line on, tier rows before Show all = 3, location switcher placement, request-form page, sign-in labels)
17. **Delivery information** (country rules, default rule, returns text, fit source)
18. **Installments** (provider name, number of payments, countries)
19. **Custom code & tracking** (head code, body-end code, loading mode per slot, consent gate)
20. **Integrations** (store builds only; stripped from the Theme Store package)
21. Advanced (preload links on hover, external links in new tab, image quality, tab-blur messages, vibrate on add)

The live theme's 41 colour settings map into schemes + global accents (see `migration-map.md` §1).

---

## 9. Localization

- Storefront: `locales/en.default.json` (source of truth), `es.json`; customer-facing complete in `de`, `fr`, `it`, `nl`, `pt-PT`, `ja`.
- Editor: `locales/en.default.schema.json`, `es.schema.json`; every schema label is a `t:` key.
- Spanish-for-Spain rule of the pilot: handled by Shopify Markets (Spain market default language `es`), not by theme logic. The pilot store config documents it. *Owner review item: the live theme forced Spanish by country in custom modules; Weft follows the storefront language instead, which is the Theme Store-compliant behaviour.*
- Money: Shopify formats currency (`money`, `money_with_currency` per the currency-format setting).
- RTL: logical properties, `dir` from `request.locale` when the locale is RTL.

---

## 10. Integrations layer and packaging

- Files prefixed `integration-` (sections, blocks, snippets) + settings in the "Integrations" group.
- `scripts/package-theme.mjs --store ibban` → `dist/ibban/` (theme + `store-configs/ibban/*` + integrations) and `dist/weft-ibban.zip`.
- `scripts/package-theme.mjs --themestore` → removes `integration-*` files and every reference (the integration group is written into `settings_schema.json` between marker comments the script can strip; templates in the package never reference integration sections), removes `config/markets.json`, keeps the three presets and `listings/`, runs `shopify theme package` when the CLI is present.

---

## 11. Testing and tooling

| Check | Where | Runs in cloud session |
|---|---|---|
| `scripts/theme-lint.mjs` | JSON validity, schema validity, translation keys (`t:` and `| t`), locale parity, missing snippets/blocks/sections/assets, Liquid tag balance, forbidden tags (`include`, `all_products`), brand-string scan | yes |
| Theme Check (`shopify theme check`) | CI (`.github/workflows/theme-check.yml`); locally once npm is reachable | when CLI installs |
| `node --test tests/unit` | `rules.js`: validation, rounding, caps, tier selection, cart line issues | yes |
| Component tests (Playwright + fixtures) | `tests/components/*.spec.mjs` load static HTML fixtures that mirror Liquid output and exercise matrix keyboard/rounding, steppers, drawers | yes (Chromium pre-installed) |
| `scripts/i18n-check.mjs` | locale key parity + hard-coded string scan | yes |
| Lighthouse CI | CI against the dev store preview; skips without secrets | no |
| Scenario suite (Playwright) | CI against the dev store with a B2B company; skips without secrets | no |

---

## 12. Risks

| Risk | Mitigation |
|---|---|
| No Shopify CLI / Theme Check in the cloud session (npm registry blocked by the environment's network policy on 28 Sep 2026) | `theme-lint.mjs` covers the checks that matter locally; CI runs real Theme Check; owner action to allow the npm registry |
| No store: Liquid can't be rendered locally | Liquid kept simple and reviewed; component tests use fixtures; real rendering only in CI/preview |
| B2B preview returning default rules and no tiers in some preview setups (brief §11) | Scenario suite runs signed in as a company contact on a preview; editor sample state doesn't depend on B2B data |
| Multi-item add partial failures are under-documented | Diff `/cart.js` before/after; show Shopify's message per cell |
| Budget pressure from 40+ sections | Per-section CSS, islands, `<template>` deferral; perf-log per phase |
| Theme Store app-like rules vs. integrations | Integrations physically removed from the Theme Store zip |
