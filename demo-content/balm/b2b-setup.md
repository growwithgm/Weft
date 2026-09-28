# Balm demo store: B2B setup

Native Shopify B2B only: companies, catalogs, price lists, quantity rules and volume pricing. The theme reads them through `customer.b2b?`, the company location and each variant's quantity rule and price breaks, so nothing here is copied into the theme.

## Company and test contact

| Field | Value |
|---|---|
| Company | Casa Alma Concept Store S.L. |
| Buyer (test contact) | Elena Vidal, with an email address the owner controls (the reviewer signs in with it; see the testing instructions in `docs/theme-store-listing.md`) |
| Locations | Seville Triana (ordering location), Málaga Centro |
| Payment terms | Net 30 on both locations |
| Checkout | Orders go straight to checkout (no draft review), so reviewers see the full flow |

Give the contact the "Ordering only" role on both locations, so the location switcher appears.

## Catalog "Trade"

Assign it to both locations. Include every product below, including the wholesale-only ones. Price list in EUR with the fixed per-piece prices below; no overall adjustment. To show the location switcher changing prices, optionally give Málaga Centro a second catalog with the same products and a 5% overall discount on its price list.

| Product | Variant | Fixed price | Minimum | Increment | Maximum | Volume pricing |
|---|---|---|---|---|---|---|
| Whipped shea body butter | 200 ml / Vanilla | €8.60 | 6 | 6 | — | 24+ €8.10 |
| Whipped shea body butter | 200 ml / Coconut | €8.60 | 6 | 6 | — | 24+ €8.10 |
| Whipped shea body butter | 200 ml / Unscented | €8.60 | 6 | 6 | — | 24+ €8.10 |
| Whipped shea body butter | 500 ml / Vanilla | €15.40 | 6 | 6 | — | — |
| Whipped shea body butter | 500 ml / Coconut | €15.40 | 6 | 6 | — | — |
| Whipped shea body butter | 500 ml / Unscented | €15.40 | 6 | 6 | — | — |
| Coffee body scrub | 250 g | €7.20 | 6 | 6 | — | — |
| Dry body oil | 100 ml | €10.80 | 6 | 6 | — | 36+ €10.20 |
| Body butter tester | Vanilla | €4.50 | 1 | 1 | 3 | — |
| Body butter tester | Coconut | €4.50 | 1 | 1 | 3 | — |
| Body butter tester | Unscented | €4.50 | 1 | 1 | 3 | — |
| Ritual gift set | Default Title | €22.00 | 3 | 3 | — | — |
| Repair hand cream | 75 ml | €5.20 | 12 | 12 | — | 48+ €4.90 |
| Sea salt soak | 500 g | €7.90 | 6 | 6 | — | — |
| Gentle body wash | 300 ml | €6.20 | 6 | 6 | — | — |
| Gentle body wash | 1 l refill | €14.40 | 6 | 6 | — | — |
| Nourishing lip balm | 15 ml | €2.60 | 24 | 24 | — | — |
| Rose body lotion | 250 ml | €9.40 | 6 | 6 | — | 24+ €8.90 |
| Exfoliating mitt | Default Title | €4.20 | 12 | 12 | — | — |
| Konjac sponge | Default Title | €3.20 | 12 | 12 | — | — |

Quantity rules and volume pricing are set per variant in the catalog's price list (Catalogs > the catalog > Products > Volume pricing / Quantity rules). They follow Shopify's validation: the minimum and maximum are multiples of the increment, and each volume price starts above the minimum at a multiple of the increment. `npm run test:unit` checks every row above.

## Wholesale-only products

| Product | How it stays wholesale-only | What a retail visitor sees |
|---|---|---|
| Body butter tester | Left out of the retail market catalog (Markets > the primary market > Catalog: every product except the wholesale-only ones); in "Trade" | 404 page with the wholesale sign-in line |

## Trade specifics

- Body butter tester: one to three per scent per order, at €4.50, for shop counters.
- Case sizes: lip balm by 24; hand cream, konjac sponge and exfoliating mitt by 12; the gift set by 3; everything else by 6.
