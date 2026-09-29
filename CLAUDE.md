# Weft — Shopify Theme Store theme for DTC + B2B (clothing, hair care, body care)

This file is Claude Code's project memory and loads at the start of every session. The full specs are imported below.

## Mission

Build **Weft**, an original Shopify Online Store 2.0 theme for the Shopify Theme Store. It focuses on three industries, with one preset each:

- **Weft** — clothing (default preset)
- **Tress** — hair care, including professional/salon wholesale
- **Balm** — body care

Every preset sells retail (DTC) and wholesale (Shopify's native B2B) from one storefront. ibBan (clothing) is the first pilot store, not the target: the code must serve any brand in these three industries.

The theme must be:

- **Theme Store-ready:** every requirement met, with three presets and a demo store for each.
- **Complete:** every feature and theme-editor capability of the pilot's live theme, plus the vertical features.
- **Fast:** Lighthouse 100 is the target, and the budgets in the spec are hard gates.
- **Accessible:** WCAG 2.2 AA.

Specs (always loaded):

- @docs/BUILD_SPEC.md
- @docs/VERTICALS.md

## Reference material (read on demand, never edit)

- `reference/brief/ibban-theme-claude-design-brief.md` — spec for the B2B core and the clothing preset, written for the ibBan pilot. Its §5 "approved decisions" apply to the Weft preset and the ibBan pilot only.
- `reference/brief/live-theme-editor-inventory.md` — every global setting, section, block, section group and template in the pilot's live theme editor.
- `reference/prototype/ibban-prototype.template.html` and `ibban-prototype.logic.js` — unpacked source of the approved Claude Design prototype. It defines the Weft preset's look and the shared component system. The original bundle is `ibBan_Storefront_Prototype.html`.
- `reference/live-theme/` — the pilot's current live theme (Enterprise 2.0.1 by Clean Canvas).

`reference/live-theme/` is licensed third-party code, so this repository stays private. Use it only to learn what a feature does and which settings merchants rely on. Never copy, adapt or paraphrase its code, CSS, JS, class names, file structure or comments. The same rule applies to every other theme.

## Non-negotiables

1. **Native B2B only.** Wholesale mode means `customer.b2b?` is true. There are no customer-tag checks, no SparkLayer or BSS markup, and no app dependency for core features.
2. **Shopify owns the numbers.** Prices, quantity rules, price breaks, stock and cart totals come from Liquid objects and Shopify responses. Never compute a price.
3. **No lost features.** Every row of brief §14 and every item of the editor inventory exists in Weft or is deliberately merged. Every merge or rename is recorded in `docs/migration-map.md`.
4. **Brand-neutral code.** No brand names, numbers, URLs, colours or copy in Liquid, CSS or JS. Brand and store values live in presets, store configs, templates and locale files.
5. **One codebase, three presets.** Every block and section works in every preset. Presets differ only in settings, templates and section groups.
6. **Theme Store requirements are hard requirements** (BUILD_SPEC §5.6 and §7.4):
   - no app-dependent or app-like features in the Theme Store package
   - no fake urgency and no invented claims
   - metaobject settings use standard definitions only
7. **All text translatable.** Storefront strings use the `t` filter, with complete `en.default.json` and `es.json`. Editor labels live in `*.schema.json` locale files.
8. **Performance budgets are release gates** for every preset (spec §6). Work that breaks a budget isn't done.
9. **Progressive enhancement.** Navigation, variant selection, the product form and the wholesale order forms all work without JavaScript.
10. **Accessibility floor:**
    - keyboard access and visible focus
    - labelled inputs
    - 4.5:1 text contrast
    - 44 px touch targets
    - reduced motion respected
11. **Only Shopify-hosted code.** No CDNs, no jQuery, no front-end frameworks. Plain Liquid, CSS and ES modules served from `assets/`.

## How we work (autonomous mode)

The owner sends the kickoff prompt (`docs/KICKOFF.md`) once. From then on, work without waiting for approval.

- Work through the phases in spec §9 in order. Start each session by reading `docs/progress.md`, and keep it current.
- Before each phase or large feature, write a short plan (files, approach, risks) into `docs/progress.md`, then carry on.
- After each unit of work:
  1. Run Theme Check (0 errors, 0 warnings).
  2. Run the tests that can run in this environment.
  3. Update `docs/progress.md`, commit with a message that names the feature, and push.
- If your working branch isn't `main`, keep one draft pull request into `main` for the whole build, and refresh its description at the end of each phase.
- **Don't stop to ask.** When you would normally ask, pick the option that best fits the specs, record it with your reasoning under "For owner review" in `docs/progress.md`, and continue. That covers:
  - adding a dependency or an external service
  - adding a global settings group
  - changing an approved decision
  - choosing between design options
- **Stop only when:**
  - a required input file is missing (say exactly which), or
  - the next step would publish a theme or change a live store, or
  - the definition of done (spec §0) is met.
- **Owner-only work never blocks you.** Work that needs the owner's accounts or secrets (dev store, GitHub secrets, demo stores, Partner Dashboard): prepare everything, list the exact steps under "Owner actions" in `docs/progress.md`, and move on.
- Never push to a live theme, never publish, and never run anything against a production store.
- **Unclear Shopify behaviour or Theme Store rules:** check shopify.dev if the network allows it. Otherwise follow the specs and note "not verified against docs" in the commit message.
- Before the context gets tight or a session ends, make sure "Next" in `docs/progress.md` says exactly where to resume. When the owner writes "continue", resume from there.
- Resolve conflicts in this order:
  1. brief §2 hard rules
  2. Theme Store requirements
  3. this file
  4. the specs
  5. prototype visuals and design directions

## Commands

```
bash scripts/cloud-setup.sh                    # cloud sessions: installs Shopify CLI (also runs at session start)
shopify theme check                            # from the repo root; .theme-check.yml skips non-theme folders
npm run test:unit                              # validation, rounding and tier logic; runs without a store
node scripts/package-theme.mjs --store ibban   # pilot build: dist/ibban + zip
node scripts/package-theme.mjs --themestore    # Theme Store zip (runs shopify theme package)
node scripts/migrate-from-live.mjs             # Phase 7: port the pilot's content and settings
# GitHub Actions (need the dev-store secrets): Theme Check, Lighthouse CI, Playwright
# Owner's machine only: shopify theme dev --store <dev-store>.myshopify.com
```

## Files you maintain

- `docs/progress.md` — current phase, next step, done, For owner review, Owner actions, open questions.
- `docs/feature-map.md` — brief §14, the editor inventory and VERTICALS.md mapped to Weft files and settings.
- `docs/migration-map.md` — every live section, block and setting mapped to its Weft equivalent.
- `docs/design-directions.md` — the Tress and Balm looks.
- `docs/theme-store-listing.md` — listing copy, feature tags and testing instructions per preset.
- `docs/perf-log.md` — Lighthouse and budget results per preset, page and phase.
