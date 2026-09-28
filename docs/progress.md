# Progress

## Current phase
P2 — Product page, retail (BUILD_SPEC §9). P1 items still open are listed under Next.

## Next
- P2 remaining: `main-cart` page (shares `cart-line`/`cart-summary`, lands in P4 with the shipping calculator), gallery and sticky-bar component tests, quick-add component test, `docs/perf-log.md` P2 entry, then refresh the PR description.
- Then P3 (wholesale): blocks `wholesale-terms`, `volume-pricing`, `order-matrix`, `wholesale-quantity`, `installments-note`; `assets/matrix.js` (keyboard grid, typed values, summary bar, multi-line add, per-line Shopify errors, in-cart counts); no-JS matrix form; `sections/wholesale-access`; `sections/quick-order-list`; wholesale templates; add the P3 blocks to `templates/product.json` block order (they're held out of the templates until the files exist).
- P1 leftovers: classic customer templates (`templates/customers/*`, moved to P5 with the other page templates).

## P2 plan (done unless noted)
- Files: `sections/main-product`, `snippets/product-gallery|product-media|product-sticky-bar|product-labels|price|quantity-input|audience-check|breadcrumbs|wholesale-gate|product-card|product-card-mini|rule-chips|cart-line|cart-summary|free-shipping-bar|gift-card-recipient|product-guide-link|accordion-icon`, product blocks (22), `sections/cart-drawer|quick-add|card-fragment|product-recommendations|recently-viewed|product-reviews|pickup-availability`, JS `product|gallery|quantity|sticky-bar|back-in-stock|pickup|recommendations|countdown|cart|quick-add|recently-viewed`, CSS `section-product|component-card|component-cart`, templates `product`, `product.preorder`, `product.countdown`, `product.coming-soon`.
- Approach: blocks read `closest.product` (documented Liquid object); variant change fetches `<product url>?option_values=<ids>&section_id=<id>` (documented high-variant pattern) and swaps `[data-swap]` nodes; islands are custom elements, so swapped markup upgrades itself.

## P1 plan
- **Files:** `layout/`, `config/`, `locales/`, `snippets/{tokens,meta-tags,social-meta,icon,image,price,localization-form,social-links,payment-icons,chat-button,custom-code,breadcrumbs}`, `sections/{announcement-bar,header,footer,cart-count,cart-drawer (shell),search-drawer (shell),location-sheet,main-404,main-password,main-gift-card,main-page}`, `assets/{base.css,core.js,header.js,drawer.js,rules.js,component-*.css}`, `templates/{index,page,404,password,gift_card.liquid}`, `.github/workflows/*`, `tests/`.
- **Approach:** tokens from settings in one inline style; base.css holds only critical CSS; islands through `core.js`; every string through `t`.
- **Risks:** no Shopify CLI in the session (npm blocked) → `theme-lint.mjs` substitutes locally, real Theme Check in CI; Liquid can't be rendered locally → component tests on fixtures.

## Done
- **P2 core (28 Sep 2026):** product section with gallery (stacked / grid / thumbnails / carousel, mobile swipe with counter, lightbox, hover magnify, grouping by option value, video / external video / 3D on interaction), 22 product blocks (title, price with Shop Pay Installments and unit price, labels, rating pill, variant picker with swatches and availability, product guide modal, stock line, delivery list with country shipping rules / free-shipping progress / installments / notify / returns, back-in-stock drawer on the contact form, buy buttons with rules-aware stepper, accelerated checkout, pickup, gift-card recipient, backorder note, purchase options, specifications, collapsible rows, description with See more clamp, product details line, custom options, product sign-up, share, complementary products, flash message, pop-up link, countdown), mobile sticky bar, wholesale-only gate, product card (retail and wholesale), cart drawer (retail and wholesale lines with rule hints and errors), quick add, related products, recently viewed, reviews section, four product templates. Component tests: 8/8. Lint 0/0, i18n 0.
- **P1 steps 1–3 (28 Sep 2026):**
  - Tooling: `package.json` (scripts only, no dependencies), `scripts/theme-lint.mjs` (local Theme Check stand-in), `scripts/i18n-check.mjs`, `scripts/build-locales.mjs` (schema labels → `t:` keys, en/es schema locales, 8 storefront locales from `scripts/src/strings.mjs`), `scripts/build-presets.mjs` (three presets from `scripts/src/presets.mjs`), `tests/lighthouse/budgets.json` (asset budgets enforced by lint).
  - Logic: `assets/rules.js` (quantity rules, rounding, caps, tiers, stock hints, summaries) with 10 unit tests (`npm run test:unit`).
  - Tests: component harness `tests/components/run.mjs` (Chromium on static fixtures) with 4 header/dialog tests; store scenario suite scaffold `tests/e2e/` with P1 scenarios (runs in CI when secrets exist).
  - CI: `.github/workflows/theme-check.yml` (lint, i18n, unit, component tests, real Theme Check), `lighthouse.yml` and `e2e.yml` (skip cleanly without store secrets).
  - Theme: `config/settings_schema.json` (20 groups; Integrations group comes in P6), `settings_data.json` (Weft, Tress, Balm presets with 7 colour schemes each), `layout/theme.liquid`, `layout/password.liquid`, `snippets/tokens.liquid`, `assets/base.css` (4.6 KB gz), `assets/core.js` (4.5 KB gz: bus, Section Rendering + Cart helpers, dialogs, islands, editor events), header (menus + mega menus on `<details>`, `<shopify-account>`, wholesale chip + location list), announcement bar, footer (menus, text/socials/Follow on Shop, newsletter, payment icons, selectors), search drawer shell, location sheet, localization form, chat button, custom code loader, generic theme blocks (heading, text, button, image, group, spacer, divider, custom Liquid, email signup), image banner, rich text, custom Liquid, apps, page, 404 (wholesale line), password, gift card.
  - Checks at this commit: theme-lint 0 errors / 0 warnings, i18n-check 0 problems, unit 10/10, components 4/4. Theme Check itself not run (CLI not installable here).
- **Step 0 (28 Sep 2026):** starter zip and live theme export extracted, zips deleted, all inputs present, committed and pushed. Shopify CLI could not be installed: the environment's network policy returns 403 for `registry.npmjs.org` (see Owner actions). shopify.dev is reachable, so docs were checked directly.
- **P0 Discovery & plan (28 Sep 2026):** read CLAUDE.md, BUILD_SPEC, VERTICALS, brief, editor inventory, prototype template + logic, and the live theme for behaviour only. Wrote:
  - `docs/architecture.md` — file map, product-page block tree, audience model, JS module list with budgets, CSS layers and tokens, data flows (variant change, add to cart, cart edits, location switch), settings groups, localization, packaging, tooling, risks.
  - `docs/feature-map.md` — brief §14, BUILD_SPEC §5.6 and VERTICALS mapped to Weft files, phases and status.
  - `docs/migration-map.md` — first version: all 16 live setting groups (211 settings), 70 sections, product blocks, section groups and templates mapped to Weft.
  - `docs/design-directions.md` + `docs/sketches/tress.html`, `docs/sketches/balm.html` (generated by `scripts/build-sketches.mjs`; home + product, responsive, checked at 1440 and 390 px with no horizontal overflow).

## For owner review
Decisions made autonomously, with reasoning. The owner reads these asynchronously.

1. **Design directions (P0 exit criterion).** Tress: Ink/Paper/Mist with Cobalt `#2B45D6` action and Signal lime for professional tags, Archivo 700 + Instrument Sans, 4 px radii, compact. Balm: Plum ink on Porcelain with Haze panels and Aubergine `#4B2E5A` action, Instrument Serif + Figtree, pill buttons and 20 px cards, airy, deliberately not cream-and-terracotta. All text pairs pass 4.5:1. Approve or adjust before P6 (`docs/design-directions.md`, sketches in `docs/sketches/`).
2. **Spanish for Spain.** The live theme forced Spanish in custom modules by visitor country. Weft follows the storefront language (Shopify Markets sets Spanish as the Spain market's default language), which is the Theme Store-compliant behaviour and keeps one code path. The pilot's Spain market must have Spanish as its default language for the same result.
3. **Navigation font.** The live theme had a third font picker for navigation. Weft offers "Navigation font: body or heading" instead, because a third font file breaks the ≤ 3 font files / ≤ 2 preloaded budget.
4. **Retail low-stock threshold.** Brief §7.4 says "Only a few left" at 8 or fewer; the live inventory setting is 10. Weft uses the global `stock_low_threshold` setting with default 8 on the Weft preset; the matrix "Low: N" hint (brief 4.5 / prototype) uses 10 via the same group's wholesale threshold setting.
5. **Merges** (all recorded in `migration-map.md`): age-verification pop-up + pop-up → `popup` (mode setting); background video + video → `video` (layout setting); product compare + basket → `compare-drawer`; vendor/SKU/barcode + weight + type blocks → `product-meta`; the theme's own sticky add-to-cart panel is replaced by the approved mobile sticky bar (brief §14.4 says so).
6. **Installments naming.** The retail row and wholesale line are generic "installments" features with a provider-name setting (default "Klarna" only in the pilot store config), so the Theme Store package makes no provider claim.
7. **Core fallbacks for integrations.** Back-in-stock without Wasify submits through Shopify's contact form (tagged with the variant); rating pill without Judge.me reads the product's standard `reviews.rating` metafield; store-score source is a dynamic-source setting the pilot points at the Judge.me shop metafields.
8. **Variant selection without JavaScript** uses a `<noscript>` variant `<select name="id">`; with JavaScript the option inputs drive Section Rendering. This is the standard progressive pattern and keeps one form.
12. **Quick add options.** Quick add renders title, price, variant picker and buy buttons from static blocks. Custom options live in each product's own template, which a card can't reach, so they aren't shown in quick add; products that need them open the product page from "View full details".
13. **Back-in-stock core.** Without an integration the request goes through Shopify's contact form (email required). The Wasify integration in P6 adds phone/WhatsApp delivery for the pilot.
14. **Installments row maths.** The retail row shows the variant price divided by the number of payments, rounded up to the cent (brief §4.4). It's a display of Shopify's price, not a price calculation, and only appears when a provider name is set.
10. **Font files.** To keep first load at ≤ 3 font files, Weft loads the heading weight, body regular and body bold. Text set in medium (500) renders with the regular file. The prototype's Jost 500 labels therefore look like 400 until the owner prefers a fourth font file.
11. **Menus on `<details>`.** Dropdowns and mega menus are `<details>` elements, so navigation works without JavaScript and the mobile drawer reuses the same markup (no duplicate DOM). Mega-menu images and promotions load only when a menu opens.
9. **Local quality tooling.** Because Theme Check can't be installed here, `scripts/theme-lint.mjs` (P1) checks JSON, schema, translation keys, missing files, tag balance and forbidden tags on every commit; real Theme Check runs in CI. "Theme Check 0/0" is reported from CI until the npm registry is reachable.

## Owner actions
- **Recommended now: allow the npm registry.** The session's network policy returns 403 for `registry.npmjs.org`, so Shopify CLI (Theme Check) can't be installed in cloud sessions. In Claude Code, open the environment (cloud icon) → Edit → Network access: add `registry.npmjs.org` (or choose the level that includes common package managers). shopify.dev is already reachable.
- **After P1: GitHub repository secrets.** Add `SHOPIFY_STORE` (dev store domain), `SHOPIFY_CLI_THEME_TOKEN` (Theme Access password), `SHOPIFY_STOREFRONT_PASSWORD` and `SHOPIFY_THEME_ID` (unpublished preview theme) so Lighthouse CI and Playwright can run.
- **After P1, optional: preview.** Connect the working branch to an unpublished theme on a dev store via Shopify's GitHub integration (Online Store → Themes → Add theme → Connect from GitHub). Shopify commits editor changes back to the branch.
- **P8: Theme Store submission.** Create the three demo stores, take the screenshots, and submit in the Partner Dashboard.

## Open questions
- **Names.** The theme name Weft is final. Tress and Balm are working preset names; confirm them before P8, because names can't change after the first upload.
- **Pilot stores** for the Tress and Balm presets.
- **ibBan pilot, Klarna.** Test a wholesale checkout to see whether Klarna is offered (brief §13).
- **ibBan pilot, request form.** Confirm the page handle behind "Apply for Access" (`bn2b-request-form`).
- **ibBan pilot, templates.** Products assigned to `product.dress`, `product.hand-bag` and `product.perfume` move to the default product template (brief §11); the migration report will list them.

## Conflicts noted in P0
- Brief §4.1 hard-codes a WhatsApp number in the layout; BUILD_SPEC and brief §11 say theme setting only → setting only.
- Brief §5 says Spanish for Spain "in every custom module"; Theme Store rules favour storefront-language translation → see owner review 2.
- Live "Inventory status" urgency bar vs "no fake urgency" → kept as an option that only shows real inventory counts.
