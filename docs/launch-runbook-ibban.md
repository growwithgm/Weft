# ibBan launch runbook (rehearsed)

BUILD_SPEC §8.3, rehearsed on 28 Sep 2026 against the store build only. Nothing was pushed to a store and nothing was published: every step that touches the store is marked **Owner** and waits for the owner.

## 0. What the rehearsal checked

| Check | Command | Result (28 Sep 2026) |
|---|---|---|
| Migration from the live theme export | `node scripts/migrate-from-live.mjs` | 60 files in `store-configs/ibban/`; 390 explained items, 0 unexplained |
| Coverage: every live section, block and content value accounted for | part of the command above (`migration-report.md`, first lines) | sections 173 of 174 carried (the article comments section is part of Weft's article section), blocks 341 of 356 carried (the rest dropped with reasons), content values 372 of 372 found in the output |
| Store build | `node scripts/package-theme.mjs --store ibban` | `dist/ibban/` and `dist/weft-ibban.zip`; lint 0 errors / 0 warnings on the build, context templates checked merged onto their parent |
| Unit tests for the migration | `npm run test:unit` | pass, including a full `--check` run and contrast of every colour scheme in the store config |
| Theme Check on the store build | `shopify theme check --path dist/ibban` | runs in CI once Shopify CLI is available in the session; the Theme Store build already passes it in CI |

`store-configs/ibban/migration-report.md` lists every change with its reason. Read it before step 3.

## 1. Before launch day (Owner)

1. Add the dev-store secrets (`SHOPIFY_STORE`, `SHOPIFY_CLI_THEME_TOKEN`, `SHOPIFY_STOREFRONT_PASSWORD`, `SHOPIFY_THEME_ID`) and `B2B_STORAGE_STATE`, so the scenario suite and both Lighthouse profiles run in CI.
2. In the live admin, check the settings the theme export can't carry:
   - Theme settings > Wholesale > **Wholesale sign-in page**: the page that uses the B2B login template (its handle isn't in the export).
   - Products assigned to `product.dress`, `product.hand-bag` or `product.perfume`: they fall back to the default product template, which now covers all three (brief §11). Nothing to do unless a product should look different.
   - Shopify Markets: the Spain market's default language stays Spanish (the live theme forced it in code; Weft follows the storefront language).
3. Confirm the colour decisions in `docs/progress.md` (owner review 37–38): header white instead of #f8f8f8, announcement bar and footer #2A2B2A instead of #141414, dark button text on the orange accent.

## 2. Build and push (Owner, never to the live theme)

1. In Shopify admin, duplicate the live theme and name the copy with today's date (the backup).
2. On a fresh checkout of this branch:
   ```
   node scripts/migrate-from-live.mjs      # only if reference/live-theme was refreshed
   node scripts/package-theme.mjs --store ibban
   shopify theme push --path dist/ibban --unpublished
   ```
   `--unpublished` creates a new theme; it never touches the published one.

## 3. QA on the preview links

| Area | What to check |
|---|---|
| Retail ES | Spanish copy, EUR, delivery row for Spain (€4.95, free from €69), Klarna row, rating pill with "reseñas de la tienda", yellow Add to cart, description "Ver más" at 200 characters |
| Retail EN / GB / US | English copy, GBP and USD, delivery rows (GB £4.95 / £99, US $4.95 / $99), Klarna in GB and US |
| Retail, sold-out variant | Remind me button, back-in-stock drawer sends to Wasify (Integrations), success message |
| Mobile | Sticky bar appears after Add to cart scrolls away, WhatsApp bubble hides while it shows |
| Wholesale, each location | Per-piece prices, rule chips, tiers, order matrix, one-size stepper, location switcher, B2B home (`index.context.b2b-wholesale`) |
| Wholesale-only products | Catalog-excluded product: 404 with the wholesale sign-in line; tag fallback product: gate page with `noindex` |
| Cart | Retail drawer and page, free-shipping bar off (as live), wholesale invalid lines disable checkout |
| Checkout hand-off | Retail and wholesale reach checkout with the right lines and prices |
| Pages | About, policies, contact, custom payment, B2B onboarding and request form render their Custom Liquid unchanged |
| Reviews | Product page reviews grid and the reviews page read Judge.me data (Integrations > Judge.me on) |
| Theme editor | Every template opens without errors; wholesale blocks show their sample state |

## 4. Performance

Run both Lighthouse profiles in CI (clean benchmark and pilot realistic) and log them in `docs/perf-log.md`. The clean profile is the gate; the pilot profile includes the apps below and is reported.

## 5. Apps

Confirm each still renders on the preview:

| App | Where | How it carries over |
|---|---|---|
| Judge.me | app embed (`judgeme_core`); product page review widget, preview badge (disabled, as live) and cards carousel; B2B onboarding featured carousel | app embed and app blocks kept as they were |
| Judge.me data | product reviews grid and reviews wall | `integration-reviews-grid` / `-wall` (Theme settings > Integrations) |
| Shopify Forms | app embed; inline forms in the footer, the overlay group and the B2B request page | kept as they were |
| Klaviyo | app embed (`klaviyo-onsite-embed`) | kept |
| Wasify | app embed (`popup`) and the back-in-stock drawer | app embed kept; drawer posts to the Wasify URL in Integrations |
| Microsoft Clarity | app embed (`clarity_js`) | kept; the duplicate loader from the live layout is left out |
| Blockify fraud filter | app embed | kept |
| Google Tag Manager | Integrations (GTM-55DG66F6) | loads after page load and marketing consent |

## 6. Publish (Owner)

Publish the new theme in a low-traffic window, then for 48 hours watch orders, B2B checkouts and Shopify's web performance report.

## 7. Rollback (Owner)

Republish the dated backup theme from step 2.1. Nothing in the store's data changes when switching themes, so rollback is immediate.
