# Weft — build specification for Claude Code

Version 1.1, 28 Sep 2026. Theme author: GROW NEST.

Weft is a Shopify Theme Store theme for three industries, with one preset each:
- **Weft** — clothing
- **Tress** — hair care
- **Balm** — body care

Every preset sells retail (DTC) and wholesale (native B2B) from one storefront. ibBan is the first pilot store.

`theme_info`: name Weft, version 1.0.0, author GROW NEST, documentation and support URL https://grownest.pro. The owner can change these.

---

## 0. Definition of done

Weft 1.0 is done when all of the following are true:

1. Every row of brief §14 and every item of the editor inventory is implemented, or deliberately merged and recorded in `docs/migration-map.md`.
2. The P1–P3 screens in brief §6 match the prototype (Weft preset) in layout, states, copy and behaviour at 1440 px and 390 px. The Tress and Balm presets match their approved design directions.
3. Every vertical feature in `docs/VERTICALS.md` works in every preset.
4. The performance, accessibility and quality gates in §6 and §7 pass for each preset on the clean benchmark profile.
5. The scenario suite (§7.3) passes against a dev store with a real B2B company.
6. Theme Check reports 0 errors and 0 warnings, and the Theme Store readiness list (§7.4) is complete.
7. Each preset has a demo store and listing assets that meet the Theme Store requirements (§8.4).
8. The ibBan pilot's content and settings are migrated, and its launch runbook (§8.3) has been rehearsed on an unpublished theme.

---

## 1. Inputs and how to use them

| Input | Use it for | Never use it for |
|---|---|---|
| Brief (`reference/brief/ibban-theme-claude-design-brief.md`) | The B2B core and the clothing vertical: behaviour, states, copy, Liquid sources, approved decisions (§5, for the Weft preset and the ibBan pilot only), parity register (§14) | — |
| Verticals (`docs/VERTICALS.md`) | Presets, hair care and body care features, demo content, design directions | — |
| Editor inventory (`reference/brief/live-theme-editor-inventory.md`) | The editor capabilities Weft must offer | Setting IDs: rename freely, but record every rename in the migration map |
| Prototype (`reference/prototype/*`) | Visual design of the Weft preset and the shared component system: layout, spacing, type, component states, micro-copy | Code: it's a React simulation built with inline styles |
| Live theme (`reference/live-theme/`) | What a feature does, and which settings merchants rely on | Any code (licensed third-party theme) |

### 1.1 Prototype → theme translation

The prototype's control bar is a testing tool. Each control maps to real data:

| Prototype control | Real source in Weft |
|---|---|
| Viewing as | `customer`, `customer.b2b?`, `customer.company_available_locations` |
| Country | `localization.country` and the active market |
| Product | Product data: option count and the order-matrix tag setting (default `row`) |
| Stock | Variant inventory, inventory policy, `available` |
| Volume pricing | `product.quantity_price_breaks_configured?` |
| Wholesale Klarna | Theme setting |
| Viewport | Responsive CSS |
| Cart states, "Shopify response" | Real Cart API responses |

- Take exact values from the template and logic files: spacing, font sizes, colours, radii, shadows and copy. Turn them into design tokens, and turn the inline styles into token-based component CSS.
- Some screens don't exist in the prototype: collection, home, search, quick add, pre-order, countdown, coming soon, quick order list, content sections and pages. Design them in the same visual language, following the brief. The hair care and body care components in VERTICALS.md use the same component system, styled by each preset's tokens.
- When the prototype and the brief disagree, the brief wins on behaviour and the prototype wins on looks.

---

## 2. Repository layout

```
/                   theme folders at the repo root, so Shopify's GitHub integration can connect a branch:
  assets/ blocks/ config/ layout/ locales/ sections/ snippets/ templates/
  listings/weft/ listings/tress/ listings/balm/   per-preset templates and section groups
/CLAUDE.md /README.md
/.claude/           settings.json: SessionStart hook for cloud sessions
/.shopifyignore     keeps non-theme folders out of CLI pushes
/.theme-check.yml   Theme Check skips non-theme folders
/docs/              BUILD_SPEC.md, VERTICALS.md, KICKOFF.md, progress.md, architecture.md, feature-map.md,
                    migration-map.md, design-directions.md, theme-store-listing.md, perf-log.md
/reference/         read-only inputs; the live theme is licensed code, so the repository stays private
/store-configs/     pilot store configurations (first: ibban/); never in the Theme Store package
/demo-content/      weft/ tress/ balm/: product CSVs, metafield definitions, B2B setup notes, image credits
/scripts/           cloud-setup.sh, migrate-from-live.mjs, package-theme.mjs, i18n-check.mjs
/tests/             unit/ (node --test), e2e/ (Playwright), a11y/, lighthouse/ (lighthouserc + budgets)
/.github/workflows/ theme-check.yml, lighthouse.yml, e2e.yml
```

- The theme folders are plain files that Shopify serves as-is, and the theme needs no build step to run.
- An optional step may minify into `assets/`, but sources stay readable and the unminified theme must work.
- Shopify's GitHub integration ignores folders that don't match the theme structure, so `docs/`, `reference/`, `scripts/` and the rest never reach a store. The Theme Store package contains theme folders only.

---

## 3. Architecture

### 3.1 Theme structure

- **Templates.** Online Store 2.0, with JSON templates wherever Shopify allows them.
- **Section groups:**
  - `header-group`: announcement bar, header
  - `footer-group`
  - `overlay-group`: cart drawer, search drawer, quick add, compare, pop-ups, location switcher sheet
- **Theme blocks** in `blocks/` for every repeatable element.
  - Product information is built entirely from blocks, which the Theme Store requires: title, price, rating, variant picker, size guide, stock line, delivery list, back-in-stock, buy buttons, wholesale terms, tier table, order matrix, installments message, accordions, share, custom Liquid and app blocks.
  - Use private (underscore-prefixed) blocks for sub-parts that shouldn't appear in the block picker, and static blocks where an element must always exist.
  - Confirm the current theme-block syntax (`content_for 'blocks'`, `content_for 'block'`) on shopify.dev before Phase 1.
- **App blocks (`@app`)** in main product, featured product, cart, footer and product details, plus an Apps section usable anywhere. Add a Custom Liquid block wherever an app block is allowed.
- **Market context templates** (`*.context.<market-handle>.json`) are supported and documented, including a wholesale-market example like the ibBan pilot's `b2b-wholesale`.
- **Presets.**
  - `config/settings_data.json` holds three presets: Weft (clothing, default), Tress (hair care) and Balm (body care).
  - Templates that differ per preset, such as the home page, live in `listings/<preset>/templates/`, with optional section groups in `listings/<preset>/sections/`.
  - Confirm the preset folder structure on shopify.dev before Phase 6.
- **Theme editor preview.** When `request.design_mode` is true, both retail and wholesale blocks render (wholesale ones with a clearly labelled sample state) so merchants can see and style everything. On the storefront, only the audience's blocks render.

### 3.2 CSS

- **Tokens.** CSS custom properties generated from settings, in one small inline `<style>` in `layout/theme.liquid`. They cover colour schemes (`color_scheme_group`), type scale, spacing scale, radii, shadows and container widths.
- **Critical CSS.** Tokens, reset, base type, header and above-the-fold layout. Everything render-blocking, inline or linked, stays within the §6 budget.
- **Component and section CSS** lives in its own asset, loaded only by the section or block that uses it. Below-the-fold styles don't block rendering.
- **Layout primitives:**
  - logical properties (`margin-inline`, `inset-inline`) for RTL
  - container queries for component layout
  - `content-visibility: auto` with `contain-intrinsic-size` on below-the-fold sections
- **Don't use:** `@import`, unused CSS, or `!important` outside utilities.

### 3.3 JavaScript

- **No frameworks.** Native custom elements and ES modules only; no jQuery.
- **Core module.** `assets/core.js` (≤ 6 KB compressed) provides: event bus, fetch helpers, Section Rendering helper, focus trap, live-region announcer, module loader.
- **Islands.** Each interactive component loads its module only when needed:
  - on visible (IntersectionObserver)
  - on idle (`requestIdleCallback`)
  - on first interaction (pointerdown or focus)
  At first paint, only the header menu, the search toggle and the cart count need JS.
- **Import map.** An import map in `theme.liquid` maps module names to `asset_url`, so modules stay cacheable.
- **Variant changes** use the Section Rendering API (`section_id` plus `variant`):
  - replace only what changes: price, rules, tiers, stock, media, buttons
  - drop stale responses with `AbortController`
  - update the URL with `history.replaceState`
  The server renders these fragments in the buyer's context, so wholesale prices, rules and tiers stay correct.
- **Cart updates** use the Cart API with the `sections` parameter, so the drawer, the header count and any open product form refresh in one request.
- **Theme editor events** (`shopify:section:load`, `section:unload`, `block:select`, `block:deselect`) re-initialise components. Selecting a block opens the drawer, tab or accordion that contains it.
- **Main-thread budget:**
  - no long tasks over 50 ms from theme code
  - debounced input handlers
  - passive listeners

### 3.4 Liquid

- Use `render` only; never `include` or `all_products`.
- Bound every loop with `limit`, and paginate every product list.
- Compute expensive values once per section and pass them into snippets.
- Make above-the-fold decisions with `section.index`: the first sections get eager images.
- Pass data to scripts only with the `json` filter; keep JavaScript logic out of Liquid.

### 3.5 Images and media

- **Sizing.** `image_url` plus `image_tag` with `widths` and accurate `sizes` everywhere. Explicit `width`/`height` or `aspect-ratio` so nothing shifts.
- **LCP image** (first section media, first product image): `loading: 'eager'`, `fetchpriority: 'high'` and `preload: true`. Everything else is lazy.
- **Video and 3D.** Video shows its poster first and loads the player on interaction; 3D models also load on interaction.
- **Missing media** uses `placeholder_svg_tag`.

### 3.6 Fonts

- **Choice.** Font picker settings. The Weft preset and the ibBan pilot use Cormorant for headings and Jost for body text, both from Shopify's font library. Tress and Balm fonts come from their approved design directions.
- **Loading:**
  - `font_face` with `font_display: 'swap'`
  - preload only the body regular and the heading weight used above the fold
  - at most 3 font files on first load
- **Fallback metrics.** Fallback font overrides (`size-adjust`, `ascent-override`) prevent layout shift.

### 3.7 Third-party code and tracking

- The theme itself loads no third-party script, and outputs `content_for_header` unmodified.
- **"Custom code & tracking" settings group:**
  - head code and body-end code settings
  - a loading mode per snippet: Immediately, After page load, or After first interaction (default)
  - marketing scripts wait for consent through Shopify's Customer Privacy API

### 3.8 Localization and markets

- **Storefront strings.** `en.default.json` and `es.json` are complete. `de`, `fr`, `it`, `nl`, `pt-PT` and `ja` are complete for everything customer-facing, matching the 8 locales the live theme ships.
- **Editor strings** live in `en.default.schema.json` and `es.schema.json`.
- **Selectors.** Country and language selectors use the `localization` form, and Shopify formats currency.
- **Markets.** Context templates cover the B2B market. `config/markets.json` is never part of the Theme Store package.

### 3.9 Integrations layer (store-specific)

- Features tied to one app or external service are built as optional blocks and snippets prefixed `integration-`.
- Each is switched on by a setting in the "Integrations" group.
- `scripts/package-theme.mjs` produces the store build (`dist/ibban/` and `dist/weft-ibban.zip`, with integrations) and `dist/weft-themestore.zip` (integrations removed, no `config/markets.json`, neutral presets). See §8.1.

| Integration | What it powers | Core fallback when removed |
|---|---|---|
| Judge.me shop metafields | "store reviews" rating pill and the GN-style reviews section | Rating from the standard `reviews.rating` metafield, plus a reviews app block |
| Wasify back-in-stock webhook | Back-in-stock drawer that submits to Wasify | Notify-me form through Shopify's contact form, plus an app block slot |
| Tracking tags (GTM, Clarity, Meta and Google verification) | Analytics | Custom code settings (§3.7) |

These stay in the core theme because they need no app:
- delivery list (country rules as a setting)
- installments message (provider name, number of payments and countries as settings)
- WhatsApp chat button (phone number setting)
- size guide
- mobile sticky bar
- every wholesale feature

---

## 4. Theme editor — parity and quality

**Parity rule:** a merchant who knows the live theme's editor must find every capability they use today in Weft, in an equally obvious place.

- **Global settings.**
  - Cover all 16 live groups: Colors, Typography, Design, Collection cards, Product cards, Product compare, Product inventory, Product labels, Swatches, Social media, Search, Currency format, Cart, Animations, Favicon, Advanced.
  - Add these groups: Wholesale, Delivery information, Installments, Custom code & tracking, Integrations.
  - Map the live theme's 41 colour settings into colour schemes plus a few global accents, and record each mapping.
- **Sections.**
  - Every live section type (inventory §2) has an equivalent.
  - Merging is allowed only when the merged section offers every capability, e.g. several banner types becoming one flexible banner.
  - Record every merge in the migration map.
- **Blocks.** Every live block type has an equivalent. The features that live in custom-Liquid code today become first-class blocks with settings:
  - rating pill
  - delivery list
  - back-in-stock
  - size warning
  - See more
- **Merchant experience.**
  - Every section and block has presets, useful defaults (no lorem ipsum), clear labels and info text.
  - Settings that don't apply are hidden with conditional visibility. Confirm the current `visible_if` syntax on shopify.dev.
- **Metafield-driven content** uses settings that accept dynamic sources, so merchants connect metafields in the editor. Hair care and body care blocks follow the same rule (VERTICALS.md §2). The ibBan pilot configuration connects:
  - size chart image `custom.size_chart`
  - fit guide `custom.fit_guide`
  - best suited for `custom.best_suited_for`
  - pack image `custom.pack_image`
  - features `shopify.fabric`, `custom.embroidery`, `shopify.color-pattern`, `shopify.size`
- **Wholesale group settings:**
  - tag that turns on the order matrix (default `row`)
  - tag for the wholesale-only fallback (default `b2b`)
  - show SKU to wholesale buyers
  - wholesale Klarna line (on by default)
  - tier rows shown before "Show all" (default 3)
  - location switcher placement
- **Editor stability.** Every change shows in the editor preview immediately, with no console errors.
- **Vertical-neutral wording.** Labels work for all three industries. For example, "Product guide" covers size charts, shade charts and usage charts.

---

## 5. Feature specification

The brief is the feature spec. Build in this order.

### 5.1 Global (brief 4.1, 7.14, 7.15; §14.1)

- announcement bar
- header with mega menus
- predictive search with the voice button
- account chip and location switcher
- cart drawer
- footer
- country and language selectors
- WhatsApp chat button
- wholesale-only visibility, gate page and 404 line
- breadcrumbs
- custom code settings

### 5.2 Product page — retail (brief 4.4, 5, 7.1–7.7, 7.17, 7.18; §14.4)

- **Product info:** built entirely from blocks.
- **Gallery:**
  - stacked on desktop, carousel on mobile
  - thumbnails and lightbox, with a zoom option
  - media grouped by colour
  - video and 3D models
- **Variant picker:** swatches, buttons or dropdown, with dynamic availability.
- **Guidance:** size guide, stock line, delivery list and back-in-stock.
- **Buy area:**
  - yellow Add to cart and Shop Pay
  - pickup availability and backorder note
  - gift card recipient form and custom options
- **Around the buy box:** mobile sticky bar, accordions with See more, share.
- **Below the product:** reviews, recommendations, recently viewed, complementary products.

The approved decisions in brief §5 are fixed.

### 5.3 Wholesale (brief §2, §3, 4.5–4.7, 7.8–7.16, §13)

- **Mode and pricing:** detection, B2B market sections, the wholesale price component, rule chips and the tier table.
- **Order matrix:**
  - keyboard support
  - rounding to pack size and per-line validation
  - stock caps and in-cart counts
  - summary bar
  - a form fallback that works without JavaScript; confirm the multi-item parameter format for `/cart/add` in the Cart API docs
- **One-size products:** stepper that follows the rules.
- **Locations:** location chip and switcher (links from `url_to_set_as_current`).
- **Wholesale pages:** sign-in page, request-form page and onboarding page.
- **Browsing:** wholesale cards and the optional quick-order drawer.
- **Wholesale cart:**
  - rule hints and errors, tier labels
  - pack image and assorted-pack colour display
  - company and location header
  - checkout disabled while any line is invalid
- **Validation mirrors Shopify's:**
  - a line is 0, or it is at least the minimum, at most the maximum, and a multiple of the increment
  - when inventory is tracked and overselling is off, a line also stays within available stock
  - Shopify's cart response is final, and its message is shown inline on the affected line

### 5.4 Collections, search and cart (brief 4.3, 4.6, 7.12, 7.13; §14.3, §14.5)

- **Collection page:**
  - banner, grid/list toggle, sorting
  - filters as a setting
  - promo tiles
  - compare and the quick-add drawer
  - retail and wholesale cards, pagination
- **Search:** results page and predictive search.
- **Cart:** drawer and page with every live option: order note, terms checkbox, shipping calculator, promoted products, media promotion.

### 5.5 Section library and pages (§14.6)

- **Sections.** An equivalent for every live section, including:
  - countdown timer (merchant-set end date only; no fake urgency)
  - shoppable image, media grid
  - promo grid and promo strip
  - testimonials, logo list
  - FAQ, contact form
  - navigation slideshow
  - video and background video
- **Page templates:**
  - contact, FAQ, about, lookbook
  - landing pages and policies
  - custom payment page, coming soon, shipping calculator
  - reviews wall and the wholesale pages
  - blog and article with comments
  - 404, password, gift card

### 5.6 Theme Store required features

These are required by the Theme Store requirements on shopify.dev (re-check them before submission). Several are missing from the pilot's live theme, so add them:

- **Header:** the `<shopify-account>` account component, visible on desktop and mobile, next to the wholesale location chip.
- **Follow on Shop** through the `login_button` filter, with unmodified branded colours.
- **Unit pricing** on collection, product and cart pages.
- **Subscriptions:** selling-plan options on the product page, and the selling-plan name on cart lines.
- **Shop Pay Installments** banner on the product page.
- **Accelerated checkout buttons** on product and cart pages: enabled by default, with unmodified branded colours.
- **Faceted filtering** on collection and search pages: availability, price, type, vendor, variant options and metafield filters.
- **Cart discounts** shown per item and per order.
- **Product page:** pickup availability, plus related and complementary product recommendations.
- **Site features:** newsletter forms and multi-level menus.
- **Images:** image focal points, and `page_image` for social sharing.
- **Selectors:** country and language selectors that follow Shopify's UX guidelines.
- **Templates:** a gift card template and a contact-form page template.
- **Cart page:**
  - every line shows title, unit price, image, final price, quantity and options
  - cart total and a tax-included note
  - a checkout button that submits the cart form
  - an empty-cart message
  - cart notes and automatic discounts
- **Blog and article pages:**
  - blog: title, and each article's title, image and excerpt, with pagination
  - article: title, `published_at`, and paginated comments with success and error messages

### 5.7 Vertical features

Hair care and body care features, presets, demo content and design directions are in `docs/VERTICALS.md`. Every vertical block and section is available in every preset.

---

## 6. Performance

### 6.1 Targets and release gates

Measure with Lighthouse on the **clean benchmark profile**:
- a dev store loaded with Shopify's Theme Store testing data
- products shaped like brief §9
- no apps, each preset's default settings (Weft, Tress and Balm are measured separately)

| Metric | Target | Release gate |
|---|---|---|
| Lighthouse Performance, mobile — home, collection, product, cart | 100 | ≥ 95 on each |
| Lighthouse Performance, desktop — same pages | 100 | ≥ 98 on each |
| Lighthouse Accessibility | 100 | 100 |
| Lighthouse Best Practices | 100 | ≥ 95 |
| Lighthouse SEO | 100 | 100 |
| Largest Contentful Paint, mobile lab | ≤ 1.8 s | ≤ 2.5 s |
| Cumulative Layout Shift | 0 | ≤ 0.02 |
| Total Blocking Time, mobile lab | ≤ 50 ms | ≤ 150 ms |
| Interaction to Next Paint, field data | ≤ 100 ms | ≤ 200 ms |

### 6.2 Budgets

Theme-owned bytes, compressed. These are starting values; tighten them once the targets are met.

| Resource | Budget |
|---|---|
| Render-blocking CSS (inline + linked) | ≤ 14 KB |
| Theme CSS per page, total | ≤ 45 KB |
| JavaScript executed before first interaction | ≤ 15 KB |
| Theme JavaScript on the product page after every island has loaded, order matrix included | ≤ 70 KB |
| Preloaded font files | ≤ 2 |
| Theme-owned requests before LCP | ≤ 6 |
| DOM nodes at default settings | ≤ 1,400 on home and product, ≤ 1,800 on collection |

### 6.3 Required techniques

- Everything in §3.2–§3.6.
- **Deferred markup.** Mega-menu panels, the mobile menu and drawer contents stay in `<template>` elements until first opened, which keeps the initial DOM small.
- **Hints.** Resource hints only for origins actually used before LCP.
- **No render-blocking JavaScript.** Scripts load only as modules or with `defer`.
- **Prefetching.** Keep the live theme's link-preloading option. Check on shopify.dev how it interacts with Shopify's own prefetching, so pages are never fetched twice.
- **Reserved space.** Late-loading UI gets its space reserved: rating pill, delivery rows, reviews and app blocks.
- **Hero media.**
  - Only the first slideshow slide loads eagerly.
  - No autoplay video above the fold on mobile unless its poster is the LCP element.
- **Image formats.** Let Shopify's CDN pick image formats; never force one.

### 6.4 Measuring

- **Lighthouse CI.** `tests/lighthouse/` holds the config and budgets. Shopify's Lighthouse CI GitHub Action runs on every pull request against the dev store's preview theme, with the release gates as thresholds. The workflow skips cleanly while the store secrets aren't set.
- **Two profiles.**
  - **Clean** is the release gate.
  - **Pilot realistic** (a pilot store such as ibBan, with its apps and tracking switched on) is report-only and is used to tune the integrations and loading modes. Shopify's scripts in `content_for_header` and app scripts are outside the theme's control, so this profile is reported, not gated.
- **Log.** Record every run in `docs/perf-log.md`: date, commit, page, device, score, LCP, CLS, TBT, bytes.
- **INP traces.** If Claude Code's Chrome integration is available, record DevTools performance traces for the order matrix, the cart drawer and a variant change.

---

## 7. Quality gates and tests

### 7.1 Static checks (CI)

- Theme Check: 0 errors, 0 warnings.
- `scripts/i18n-check.mjs`:
  - every key in `en.default.json` exists in every other locale
  - no hard-coded customer-facing strings in Liquid output
- Valid JSON in every template and section group.
- Valid HTML on rendered pages.
- Unit tests (`node --test`) cover quantity validation, pack rounding and tier selection. They run in cloud sessions without a store.

### 7.2 Accessibility

- **axe (via Playwright), 0 violations,** on:
  - home and collection
  - product, retail and wholesale
  - cart drawer and search
  - wholesale-only gate and wholesale sign-in
- **Keyboard walkthroughs:**
  - header and mega menu
  - drawers (focus trap, and focus returns to the opener)
  - variant picker and steppers
  - order matrix (arrow keys)
  - accordions and modals
- **Live-region announcements** for: add to cart, rounding notices, errors, location switch.
- **With JavaScript disabled,** navigation, variant selection, the product form and the order-matrix fallback all work.

### 7.3 Scenario suite (Playwright against the dev store)

**Setup:**
- B2B enabled
- one company with two locations, each on a catalog with a different price list
- quantity rules and volume pricing on the sample products from brief §9 and VERTICALS.md §5
- one product excluded from every Region catalog, and one product with the `b2b` fallback tag
- retail markets for ES, DE, GB and US, plus the `b2b-wholesale` market

| # | Scenario | Expected |
|---|---|---|
| 1 | Retail guest, Spain | Retail modules shown, Spanish copy, delivery row for Spain, no wholesale blocks |
| 2 | Retail guest, UK and US | Correct currency, shipping rows and Klarna country rule |
| 3 | Retail, selected variant sold out / on backorder | Notify button and sticky "Remind me" / backorder note |
| 4 | Retail add to cart | Drawer opens, count and free-shipping row update |
| 5 | Wholesale, one location | Per-piece price, rule chips, tiers, B2B home sections, retail modules hidden |
| 6 | Order matrix | Below-minimum flag, pack rounding, stock cap, stock-below-minimum cell disabled, untracked stock, missing variant, add → drawer and in-cart counts |
| 7 | Shopify rejects or adjusts a line | Shopify's message on the cell and in the summary |
| 8 | One-size stepper | Starts at minimum, steps by increment, highlights the active tier, shows the live line total |
| 9 | Rules differ per variant; default rules; maximum set | Chips and cells reflect each case |
| 10 | No tiers; four or more tiers | No table; three rows plus "Show all" |
| 11 | Wholesale cart | Invalid line shows an error and disables checkout; fixing it re-enables checkout; tier label matches Shopify's line price; pack image; assorted-pack colours |
| 12 | Two locations | Switcher lists the other location; switching reloads with that location's prices and shows the notice |
| 13 | Retail visitor opens a wholesale-only link | Catalog-excluded product: 404 page with the wholesale sign-in line. Tag fallback product: gate page with `noindex` |
| 14 | Wholesale Klarna setting | Line appears and disappears |
| 15 | JavaScript disabled | Navigation, variant selection, product form and order-matrix fallback work |
| 16 | Theme editor | Every preset renders with defaults, wholesale blocks show their sample state, selecting a block reveals it, no console errors |
| 17 | Hair care product (Tress) | Volume variants with unit price, subscription option, highlights, hair type chips, ingredients and how-to-use, complete-the-routine products |
| 18 | Body care product (Balm) | Scent notes, skin type chips, full INCI list, warnings, period-after-opening icon, gift message property, unit price |
| 19 | Professional-only product | Visible only to wholesale buyers through catalogs; back-bar size and case-pack rules enforced |
| 20 | Quick order list | Wholesale buyer orders several SKUs across products in one table, with the same validation as the matrix |
| 21 | Guided finder and comparison slider | Finder answers lead to the right filtered collection; the slider works by keyboard and touch |
| 22 | Theme Store features (§5.6) | Account component, Follow on Shop, unit prices, selling-plan name in cart, filters on search, pickup availability |

### 7.4 Theme Store readiness

Taken from shopify.dev; re-read the live requirements page before submitting.

- **Blocks.** Product page elements are blocks, `@app` blocks work in main product and featured product, and a Custom Liquid block exists wherever apps may go.
- **Minimum scores.**
  - Average Lighthouse performance ≥ 60 and accessibility ≥ 90 across home, product and collection, on desktop and mobile.
  - The §6 gates are far above these minimums.
- **Accessibility requirements:**
  - keyboard access and visible focus
  - alt text through `image_tag`
  - labelled inputs with unique IDs
  - valid HTML
  - contrast of 4.5:1 for text, and 3:1 for large text and non-text elements
  - focus order that matches the DOM
  - touch targets of at least 24 × 24 px
  - visually distinct headings
- **Social.** Social icons, Open Graph and Twitter card tags, and empty social placeholder text.
- **Settings.**
  - favicon setting
  - logo works at any aspect ratio
  - header and footer `link_list` defaults are `main-menu` and `footer`
  - `theme_info` is present
  - editor changes show in the preview
- **Markup and URLs.**
  - `<html lang="{{ request.locale.iso_code }}">`
  - URLs come from the `routes` object
  - payment icons come from `shop.enabled_payment_types` with `payment_type_svg_tag`
  - `content_for_header` stays untouched
- **Scripts and links.** Scripts are hosted on Shopify, and links to Shopify domains carry `rel="nofollow"`.
- **Apps and honesty.**
  - No app-dependent or app-like API features in the Theme Store package, which is why §3.9 exists.
  - No fake urgency: countdowns use merchant-set dates and stock messages use real inventory.
- **Package contents.** Browser and webview support per §7.5, and no `config/markets.json` in the package.
- **Review checklist.** Run Shopify's Theme Store review checklist with the official testing assets: a home page with 25 sections, long menus, several logo aspect ratios, and the rest.
- **Required features.** Everything in §5.6 is present.
- **Metaobject settings** use standard definitions only.
- **Names.** Theme and preset names can't change after the first upload. Follow Shopify's naming guidelines and confirm the names are free before packaging.
- **Package.** Build it with `shopify theme package` (run by `package-theme.mjs --themestore`). The ZIP validator checks `theme_name`, `settings_schema.json` and the presets.

### 7.5 Browsers and webviews

- **Desktop:** Safari (latest 2), Chrome (latest 3), Firefox (latest 3), Edge (latest 2).
- **Mobile:** iOS Safari (latest 2), Chrome (latest 3), Samsung Internet (latest 2).
- **In-app webviews:** Instagram, Facebook, Pinterest.

---

## 8. Migration and launch

### 8.1 Store configurations and packaging

- **The theme folders** hold neutral defaults.
- **`store-configs/<store>/`** holds a pilot store's templates, section groups and `settings_data.json`. The first pilot is `ibban`.
- **`scripts/package-theme.mjs --store <store>`** builds `dist/<store>/` and `dist/weft-<store>.zip`: theme, store config and integrations. Push pilot builds with `--path dist/<store>`.
- **`scripts/package-theme.mjs --themestore`** builds `dist/weft-themestore.zip`:
  - excludes integrations, `config/markets.json` and store configs
  - includes the three presets and `listings/`
  - runs `shopify theme package`

### 8.2 Migration script (`scripts/migrate-from-live.mjs`)

- **Reads** from `reference/live-theme/`:
  - `config/settings_data.json`
  - every template, including context templates
  - every section group
- **Maps** sections, blocks and settings through `scripts/migration-map.json`, kept in sync with `docs/migration-map.md`, and writes the result into `store-configs/ibban/`.
- **Moves content across.** Content that lives in custom-Liquid sections today (about, policies, onboarding landing, custom payment page) moves across unchanged. Legacy app markup (SparkLayer, BSS) is dropped.
- **Reports** every unmapped section, block or setting. Nothing is dropped silently.

### 8.3 Pilot launch runbook (ibBan first)

1. In Shopify admin, duplicate the live theme as a dated backup.
2. Run `node scripts/package-theme.mjs --store ibban`, then `shopify theme push --path dist/ibban --unpublished`.
3. QA on preview links:
   - retail in ES, EN, GB and US
   - a wholesale contact at each location
   - B2B market home, gate page and cart
   - hand-off into checkout for retail and wholesale
   - theme editor
4. Run both Lighthouse profiles and fix regressions.
5. Confirm every app embed and app block still renders: Judge.me, Klaviyo, Shopify Forms, Wasify.
6. Publish in a low-traffic window, then watch orders, B2B checkouts and Shopify's web performance report for 48 hours.
7. Rollback: republish the backup theme.

### 8.4 Theme Store submission runbook

Write all listing text in `docs/theme-store-listing.md` first.

1. **Read the current rules** on shopify.dev: Theme Store requirements, naming themes and theme styles, Theme Store exclusivity, demo stores, and supporting your theme.
2. **Build one demo store per preset**, matching its primary industry and catalog-size tag:
   - authentic content, licensed images, and written brand permission for any brand content
   - Bogus Gateway or Shopify Payments test mode, with all other checkout options off
   - no apps: only theme features (free review or translation apps only under Shopify's special consideration)
   - the same password on every demo store
   - if B2B is available on the demo store, a test company contact so reviewers can see wholesale mode, described in the testing instructions
3. **Take screenshots** per demo store:
   - desktop home page at 1000 × 1248 or 2000 × 2496 px
   - mobile home page at 750 × 1334 px
   - no browser chrome or added text, and alt text for each
4. **Prepare each preset's listing:**
   - listing copy
   - feature tags (clothing: size chart, color swatches, lookbooks, image hotspot; hair and body care: ingredients, usage information, product tabs)
   - a documentation site and a support contact form (an email address alone isn't enough)
   - review-notification and submission-contact emails
5. **Submit.** Run `node scripts/package-theme.mjs --themestore`, then in the Partner Dashboard go to Themes → Submit a theme. Upload the ZIP and complete one listing form per preset.
6. **Handle review feedback** by email. Never resubmit without fixing every listed issue.

---

## 9. Phases

After every phase:
1. Update `docs/progress.md` and `docs/perf-log.md`.
2. Commit, push, and refresh the draft pull request's description.
3. Write the phase summary and any open decisions under "For owner review" in `docs/progress.md`.
4. Continue with the next phase (autonomous mode, `docs/KICKOFF.md`).

| Phase | Scope | Exit criteria |
|---|---|---|
| **P0 Discovery & plan** (no theme code) | Read every input. Write `architecture.md` (file map, product-page block tree, JS module list, CSS layers, data flow for variant change and cart), `feature-map.md`, a first `migration-map.md`, `progress.md`, a list of questions and conflicts, and `docs/design-directions.md` for Tress and Balm | Documents written; both design directions chosen and listed under "For owner review" |
| **P1 Foundation** | Repo, CI (Theme Check, Lighthouse CI, Playwright), `layout/theme.liquid`, tokens, all global settings groups, colour schemes, typography, section groups, localization, base components (button, input, stepper, drawer, modal, sheet, badge, price, icons), 404, password and gift card | Theme Check 0/0; clean-profile gates met on a basic home and product page; global-settings parity ticked |
| **P2 Product page, retail** (S1, S12, S13) | Every retail block and approved decision, variant change via Section Rendering, no-JS product form, sticky bar, reviews, recommendations, recently viewed, pre-order / countdown / coming-soon variants, quick-add drawer | S1 states match the prototype at 1440 and 390; scenarios 1–4 pass; product-page budgets met |
| **P3 Wholesale** (S2, S3, S5, S7, S8) | Everything in §5.3 | Scenarios 5–14 pass; wholesale product page within budget with the matrix loaded |
| **P4 Collection, search, cart** (S4, S6, S11, optional S10) | Everything in §5.4 | Cart scenario 11 passes; collection and search budgets met |
| **P5 Section library & pages** | Everything in §5.5 | Every inventory section and template has an equivalent; scenario 16 passes |
| **P6 Verticals, presets, localization, packaging** | Everything in VERTICALS.md, the three presets and `listings/`, locales and schema translations, integrations layer, `package-theme.mjs` | Scenarios 17–22 pass; each preset meets the §6 gates; i18n check clean; both packages build; §7.4 list ticked |
| **P7 Pilot migration & rehearsal (ibBan)** | `migrate-from-live.mjs`, full scenario suite, both Lighthouse profiles, runbook rehearsal | `dist/ibban` reproduces the live store's content and settings, with no unexplained items in the migration report |
| **P8 Demo content & submission package** | `demo-content/` for all three presets, listing copy, documentation content, a screenshot shot list, the Theme Store zip, and "Owner actions" for the steps that need the owner's accounts (demo stores, Partner Dashboard) | `shopify theme package` builds the zip; every §8.4 step is done or listed under Owner actions |

---

## 10. Kickoff and continuation

- The one-time kickoff prompt is `docs/KICKOFF.md`. The owner sends it once; after that, work autonomously (CLAUDE.md, "How we work").
- If a session ends, the owner writes "continue". Read `docs/progress.md` and resume from "Next".

## 11. Cloud sessions (Claude Code on the web)

- **Fresh clone.** Every cloud session starts from a fresh clone of the repository, so commit everything later sessions need.
- **Tools.** `.claude/settings.json` runs `scripts/cloud-setup.sh` at session start. It installs Shopify CLI (Theme Check included) from npm.
- **Network.** The Default environment's Trusted network access reaches package registries and GitHub, but not Shopify. If shopify.dev can't be reached, rely on the specs, note "not verified against docs" in the commit message, and keep going.
- **Store-dependent checks** (Lighthouse CI, Playwright against a dev store, theme pushes) run in GitHub Actions with repository secrets, never in the session. Until the secrets exist, the workflows skip and the missing secrets are listed under Owner actions.
- **Previews.** Once P1 has produced a valid theme, the owner can connect the working branch to an unpublished theme on a dev store through Shopify's GitHub integration (Online Store → Themes → Add theme → Connect from GitHub). Shopify commits theme-editor changes back to that branch, so pull before every push.
