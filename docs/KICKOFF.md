# Weft — kickoff prompt (send once)

You are building **Weft**, an original Shopify theme for the Shopify Theme Store. It has three presets:
- **Weft** — clothing
- **Tress** — hair care
- **Balm** — body care

Each preset sells retail (DTC) and wholesale (Shopify's native B2B) from one storefront.

This is a long, autonomous job. Work through every phase without waiting for me, until the definition of done in `docs/BUILD_SPEC.md` §0 is met.

## Step 0 — set up the repository (first session only)

1. **Check the repo** for everything below:
   - `CLAUDE.md`, `docs/BUILD_SPEC.md`, `docs/VERTICALS.md`, `docs/progress.md`
   - `reference/brief/ibban-theme-claude-design-brief.md` and `reference/brief/live-theme-editor-inventory.md`
   - `reference/prototype/`: template, logic and the original bundle
   - the live theme under `reference/live-theme/`: folders such as `config/`, `sections/`, `templates/`
2. **Starter zip.** If `weft-starter.zip` is in the repo or attached to this message:
   - extract it into the repo root
   - if everything sits inside a single `weft-starter/` folder, move that folder's contents up to the root
   - delete the zip afterwards
3. **Live theme zip.** If `reference/live-theme/` holds a `theme_export_*.zip` (or one is attached):
   - extract it there, so `config/`, `sections/` and the rest sit directly inside `reference/live-theme/`
   - delete the zip afterwards
4. **Tools.** Run `bash scripts/cloud-setup.sh` to install Shopify CLI.
5. **Missing files or commit.** If anything from step 1 is still missing, stop and tell me exactly which file to upload. Otherwise commit ("chore: add Weft specs and references") and push.
6. **Read.** Read `CLAUDE.md`, `docs/BUILD_SPEC.md` and `docs/VERTICALS.md` completely, then the brief, the editor inventory and the prototype source. Read `reference/live-theme/` only to understand behaviour; never reuse its code.

## Then: build, phase by phase

Follow CLAUDE.md ("How we work", autonomous mode) and BUILD_SPEC §9:

1. **P0** — architecture, feature map, migration map, design directions for Tress and Balm
2. **P1** — foundation, including CI (Theme Check, Lighthouse CI, Playwright) and unit tests
3. **P2** — product page, retail
4. **P3** — wholesale
5. **P4** — collection, search, cart
6. **P5** — section library and pages
7. **P6** — verticals, presets, localization, packaging
8. **P7** — ibBan pilot migration
9. **P8** — demo content and the Theme Store package

## Rules that matter most

- **No waiting for approval.** Record decisions and open questions under "For owner review" in `docs/progress.md`, and continue.
- **Owner actions.** Anything that needs my accounts or secrets goes under "Owner actions" and never blocks you.
- **After each unit of work:**
  1. Theme Check 0/0
  2. the tests that can run here
  3. update `docs/progress.md`
  4. commit and push
- **One draft pull request.** Keep one draft pull request into `main`, and refresh its description after every phase.
- **Resume point.** Before a session ends, make sure "Next" in `docs/progress.md` is exact. When I write "continue", pick up from there.
- **When to stop.** Only for:
  - a missing input
  - a step that would publish or change a live store
  - the definition of done being met

Start with Step 0 now.
