# Tress demo store: B2B setup

Native Shopify B2B only: companies, catalogs, price lists, quantity rules and volume pricing. The theme reads them through `customer.b2b?`, the company location and each variant's quantity rule and price breaks, so nothing here is copied into the theme.

## Company and test contact

| Field | Value |
|---|---|
| Company | Salón Onda S.L. |
| Buyer (test contact) | Marta Ruiz, with an email address the owner controls (the reviewer signs in with it; see the testing instructions in `docs/theme-store-listing.md`) |
| Locations | Barcelona Gràcia (ordering location), Girona Centre |
| Payment terms | Net 30 on both locations |
| Checkout | Orders go straight to checkout (no draft review), so reviewers see the full flow |

Give the contact the "Ordering only" role on both locations, so the location switcher appears.

## Catalog "Salon"

Assign it to both locations. Include every product below, including the wholesale-only ones. Price list in EUR with the fixed per-piece prices below; no overall adjustment. To show the location switcher changing prices, optionally give Girona Centre a second catalog with the same products and a 5% overall discount on its price list.

| Product | Variant | Fixed price | Minimum | Increment | Maximum | Volume pricing |
|---|---|---|---|---|---|---|
| Argan repair shampoo | 250 ml | €6.90 | 6 | 6 | — | 24+ €6.50, 48+ €6.10 |
| Argan repair shampoo | 1 l | €18.50 | 6 | 6 | — | — |
| Curl defining cream | 300 ml | €8.30 | 6 | 6 | — | 36+ €7.80 |
| Bond repair mask | 200 ml | €9.90 | 6 | 6 | — | — |
| Bond repair mask | 500 ml | €19.80 | 6 | 6 | — | — |
| Back-bar shampoo | 5 l | €58.00 | 2 | 2 | — | — |
| Color cream | 5.0 Light brown / 100 ml | €4.20 | 12 | 12 | — | 48+ €3.90 |
| Color cream | 6.1 Dark ash blonde / 100 ml | €4.20 | 12 | 12 | — | 48+ €3.90 |
| Color cream | 7.3 Golden blonde / 100 ml | €4.20 | 12 | 12 | — | 48+ €3.90 |
| Hydrating conditioner | 250 ml | €7.20 | 6 | 6 | — | 24+ €6.80 |
| Hydrating conditioner | 1 l | €19.80 | 6 | 6 | — | — |
| Scalp detox scrub | 150 ml | €8.60 | 6 | 6 | — | — |
| Heat protect spray | 150 ml | €7.40 | 6 | 6 | — | 24+ €7.00 |
| Volume dry shampoo | 200 ml | €6.20 | 6 | 6 | — | — |
| Purple toning shampoo | 250 ml | €7.60 | 6 | 6 | — | 24+ €7.20 |
| Purple toning shampoo | 1 l | €20.20 | 6 | 6 | — | — |
| Leave-in conditioner | 200 ml | €7.80 | 6 | 6 | — | 24+ €7.40 |
| Wide-tooth comb | Default Title | €3.80 | 12 | 12 | — | — |

Quantity rules and volume pricing are set per variant in the catalog's price list (Catalogs > the catalog > Products > Volume pricing / Quantity rules). They follow Shopify's validation: the minimum and maximum are multiples of the increment, and each volume price starts above the minimum at a multiple of the increment. `npm run test:unit` checks every row above.

## Wholesale-only products

| Product | How it stays wholesale-only | What a retail visitor sees |
|---|---|---|
| Back-bar shampoo | Left out of the retail market catalog (Markets > the primary market > Catalog: every product except the wholesale-only ones); in "Salon" | 404 page with the wholesale sign-in line |

## Salon specifics

- Color cream is the order matrix product (tag "row"): shade by size, case of 12.
- Back-bar shampoo is professional-only (scenario 19).
- Custom label "Professional" (`custom.label`) marks salon products for retail visitors.
