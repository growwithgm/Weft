# Progress

## Current phase
Step 0 — repository setup (docs/KICKOFF.md)

## Next
- Step 0, then P0 (BUILD_SPEC §9)

## Done

## For owner review
Decisions made autonomously, with reasoning. The owner reads these asynchronously.

## Owner actions
- **Optional, recommended now: Shopify docs access.** In Claude Code, open the environment (cloud icon) → settings, set Network access to Custom, tick "Also include default list of common package managers", and add these domains: shopify.dev, *.shopify.dev, shopify.com, *.shopify.com, *.myshopify.com.
- **After P1: GitHub repository secrets.** Add the dev-store secrets (store domain, Theme Access token, storefront password) so Lighthouse CI and Playwright can run.
- **After P1, optional: preview.** Connect the working branch to an unpublished theme on a dev store via Shopify's GitHub integration.
- **P8: Theme Store submission.** Create the three demo stores, take the screenshots, and submit in the Partner Dashboard.

## Open questions
- **Names.** The theme name Weft is final. Tress and Balm are working preset names; confirm them before P8, because names can't change after the first upload.
- **Pilot stores** for the Tress and Balm presets.
- **ibBan pilot, Klarna.** Test a wholesale checkout to see whether Klarna is offered (brief §13).
- **ibBan pilot, request form.** Confirm the page handle behind "Apply for Access" (`bn2b-request-form`).
