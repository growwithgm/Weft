# Weft demo store: B2B setup

Native Shopify B2B only: companies, catalogs, price lists, quantity rules and volume pricing. The theme reads them through `customer.b2b?`, the company location and each variant's quantity rule and price breaks, so nothing here is copied into the theme.

## Company and test contact

| Field | Value |
|---|---|
| Company | Boutique Luna S.L. |
| Buyer (test contact) | Lucía Márquez, with an email address the owner controls (the reviewer signs in with it; see the testing instructions in `docs/theme-store-listing.md`) |
| Locations | Madrid Serrano (ordering location), Valencia Ruzafa |
| Payment terms | Net 30 on both locations |
| Checkout | Orders go straight to checkout (no draft review), so reviewers see the full flow |
| Store credit | €150.00 store credit on Madrid Serrano (optional state) |

Give the contact the "Ordering only" role on both locations, so the location switcher appears.

## Catalog "Wholesale"

Assign it to both locations. Include every product below, including the wholesale-only ones. Price list in EUR with the fixed per-piece prices below; no overall adjustment. To show the location switcher changing prices, optionally give Valencia Ruzafa a second catalog with the same products and a 5% overall discount on its price list.

| Product | Variant | Fixed price | Minimum | Increment | Maximum | Volume pricing |
|---|---|---|---|---|---|---|
| Leila hand-embroidered long tunic | Ecru / S/M | €31.50 | 4 | 2 | 60 | 24+ €29.90, 48+ €28.50 |
| Leila hand-embroidered long tunic | Ecru / L/XL | €31.50 | 4 | 2 | 60 | 24+ €29.90, 48+ €28.50 |
| Leila hand-embroidered long tunic | Ecru / XXL | €31.50 | 4 | 2 | 60 | 24+ €29.90, 48+ €28.50 |
| Leila hand-embroidered long tunic | Indigo / S/M | €31.50 | 4 | 2 | 60 | 24+ €29.90, 48+ €28.50 |
| Leila hand-embroidered long tunic | Indigo / L/XL | €31.50 | 4 | 2 | 60 | 24+ €29.90, 48+ €28.50 |
| Leila hand-embroidered long tunic | Indigo / XXL | €31.50 | 4 | 2 | 60 | 24+ €29.90, 48+ €28.50 |
| Leila hand-embroidered long tunic | Black / S/M | €31.50 | 4 | 2 | 60 | 24+ €29.90, 48+ €28.50 |
| Leila hand-embroidered long tunic | Black / L/XL | €31.50 | 4 | 2 | 60 | 24+ €29.90, 48+ €28.50 |
| Leila hand-embroidered long tunic | Black / XXL | €31.50 | 4 | 2 | 60 | 24+ €29.90, 48+ €28.50 |
| Leila hand-embroidered long tunic | Sage / S/M | €31.50 | 4 | 2 | 60 | 24+ €29.90, 48+ €28.50 |
| Leila hand-embroidered long tunic | Sage / L/XL | €31.50 | 4 | 2 | 60 | 24+ €29.90, 48+ €28.50 |
| Zahra embroidered kaftan | Coral | €34.00 | 6 | 6 | — | 36+ €32.00, 72+ €30.50 |
| Zahra embroidered kaftan | Turquoise | €34.00 | 6 | 6 | — | 36+ €32.00, 72+ €30.50 |
| Zahra embroidered kaftan | White | €34.00 | 6 | 6 | — | 36+ €32.00, 72+ €30.50 |
| Zahra embroidered kaftan | Navy | €34.00 | 6 | 6 | — | 36+ €32.00, 72+ €30.50 |
| Nour embroidered tote | Natural | €22.00 | 3 | 3 | — | — |
| Nour embroidered tote | Black | €22.00 | 3 | 3 | — | — |
| Amira embroidered maxi dress | Sand / S/M | €46.00 | 4 | 2 | 40 | 24+ €44.00 |
| Amira embroidered maxi dress | Sand / L/XL | €46.00 | 4 | 2 | 40 | 24+ €44.00 |
| Amira embroidered maxi dress | Sand / XXL | €46.00 | 4 | 2 | 40 | 24+ €44.00 |
| Amira embroidered maxi dress | Terracotta / S/M | €46.00 | 4 | 2 | 40 | 24+ €44.00 |
| Amira embroidered maxi dress | Terracotta / L/XL | €46.00 | 4 | 2 | 40 | 24+ €44.00 |
| Amira embroidered maxi dress | Terracotta / XXL | €46.00 | 4 | 2 | 40 | 24+ €44.00 |
| Salma linen shirt | White / S/M | €27.00 | 4 | 2 | — | — |
| Salma linen shirt | White / L/XL | €27.00 | 4 | 2 | — | — |
| Salma linen shirt | White / XXL | €27.00 | 4 | 2 | — | — |
| Salma linen shirt | Olive / S/M | €27.00 | 4 | 2 | — | — |
| Salma linen shirt | Olive / L/XL | €27.00 | 4 | 2 | — | — |
| Salma linen shirt | Olive / XXL | €27.00 | 4 | 2 | — | — |
| Yasmin wrap skirt | Indigo / S/M | €19.00 | 4 | 2 | — | — |
| Yasmin wrap skirt | Indigo / L/XL | €19.00 | 4 | 2 | — | — |
| Yasmin wrap skirt | Ecru / S/M | €19.00 | 4 | 2 | — | — |
| Yasmin wrap skirt | Ecru / L/XL | €19.00 | 4 | 2 | — | — |
| Farah beach cover-up | White | €19.00 | 6 | 6 | — | 36+ €17.50 |
| Farah beach cover-up | Black | €19.00 | 6 | 6 | — | 36+ €17.50 |
| Layla embroidered jacket | S/M | €55.00 | 2 | 2 | — | 12+ €52.00 |
| Layla embroidered jacket | L/XL | €55.00 | 2 | 2 | — | 12+ €52.00 |
| Layla embroidered jacket | XXL | €55.00 | 2 | 2 | — | 12+ €52.00 |
| Hana silk scarf | Ivory | €15.00 | 6 | 6 | — | — |
| Hana silk scarf | Rose | €15.00 | 6 | 6 | — | — |
| Hana silk scarf | Navy | €15.00 | 6 | 6 | — | — |
| Rania straw hat | One size | €18.00 | 3 | 3 | — | — |
| Tunic sample pack | Default Title | €110.00 | 1 | 1 | 2 | — |
| Embroidery swatch card | Default Title | €6.00 | 1 | 1 | 5 | — |

Quantity rules and volume pricing are set per variant in the catalog's price list (Catalogs > the catalog > Products > Volume pricing / Quantity rules). They follow Shopify's validation: the minimum and maximum are multiples of the increment, and each volume price starts above the minimum at a multiple of the increment. `npm run test:unit` checks every row above.

## Wholesale-only products

| Product | How it stays wholesale-only | What a retail visitor sees |
|---|---|---|
| Tunic sample pack | Left out of the retail market catalog (Markets > the primary market > Catalog: every product except the wholesale-only ones); in "Wholesale" | 404 page with the wholesale sign-in line |
| Embroidery swatch card | Kept in the retail catalog with the tag "b2b" (Theme settings > Wholesale > Wholesale-only tag); in "Wholesale" | Wholesale gate page with noindex; hidden from cards and search results |

## Order matrix and pack image

- Products tagged "row" (Theme settings > Wholesale > Order matrix tag) use the order matrix: Leila tunic and Amira maxi dress.
- Zahra kaftan is the one-size product (stepper from 6 in steps of 6). Upload its pack image to `custom.pack_image`.
