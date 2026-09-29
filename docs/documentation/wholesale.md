# Wholesale

This page explains how Weft serves wholesale buyers with Shopify's native B2B features, what those buyers see, and how to set up B2B in your Shopify admin.

## How wholesale mode works

Wholesale mode turns on when a customer signs in as a contact of a Shopify B2B company location. The theme checks this with Shopify's `customer.b2b?` property. There are no customer tags to manage and no app to install.

Prices, quantity rules and volume pricing come from your B2B catalogs, stock comes from your inventory, and Shopify calculates the cart totals. The theme only displays them, and Shopify's cart response is always final. Everyone else, including signed-in retail customers, sees the retail storefront.

## What wholesale buyers see

| Area | Retail shoppers | Wholesale buyers |
|---|---|---|
| Prices | Retail price, compare-at price, tax note | Price per piece from their catalog, labeled as the wholesale price, with a "From ... at ... pieces" link when volume pricing exists |
| Quantity rules | Not shown | Chips such as "Min. 6", "Packs of 6" or "Max. 48", or "Minimums vary" when rules differ between variants |
| Volume pricing | Not shown | A table of volume prices for the selected variant, with the active row highlighted |
| Buying | Buy buttons, accelerated checkout, mobile sticky bar | The order matrix on tagged products, or the wholesale quantity box on other products |
| Retail blocks | Rating, stock line, delivery list, back in stock | Hidden by default (each has a **Show to** setting) |
| Header | Account icon | Account icon plus a chip with the company and location, with a location switcher when the company has several locations |
| Product cards | Retail price, rating, quick add | Price per piece, "From" price, quantity rule chips and a **Choose quantities** action. With **Show inventory** on, cards show the exact stock count. |
| Cart | Free shipping bar, promoted products, accelerated checkout | Company and location, per-piece prices, rule messages, pack images; checkout disabled until every line is valid |

## Wholesale product blocks

All product templates include these blocks. They show only to wholesale buyers. In the theme editor they also show, so you can style them, and most carry a "Wholesale preview — sample data" badge.

| Block | What it does |
|---|---|
| Wholesale terms | Quantity rule chips for the selected variant: minimum, pack size (increment) and maximum. Default rules (minimum 1, increment 1) show nothing. |
| Volume pricing | Rows from the selected variant's volume pricing, starting at the minimum. The row that matches the quantity being entered is highlighted. Rows beyond the number set in **Theme settings > Wholesale** hide behind "Show all". Hidden when the product has no volume pricing. |
| Wholesale quantity | The buy box for products without the order matrix. The stepper starts at the minimum, steps by the increment, shows how many are already in the cart, and shows a live line total using Shopify's volume prices. |
| Order matrix | A grid for ordering many variants at once. See [Order matrix](#order-matrix). |
| Wholesale installments | An installments line for wholesale buyers, based on the variant's minimum order. It shows when **Theme settings > Wholesale > Show the installments line to wholesale buyers** is on and **Theme settings > Installments** has a provider name. |

The **Price** block has a **Preview the wholesale price in the editor** setting to style the wholesale price in the theme editor.

## Order matrix

The order matrix shows to wholesale buyers on products tagged with the **Order matrix tag** (default `row`).

1. In your Shopify admin, add the tag `row` to the product. To use another tag, change **Theme settings > Wholesale > Order matrix tag**.
2. The first option becomes the rows, for example Color or Shade. The other options become the columns, for example Size.
3. Each cell is one variant with its own quantity rule, stock limit and in-cart count.

How the matrix helps buyers:

- Arrow keys move between cells, and typed quantities are checked when the buyer leaves a cell.
- Quantities that don't match the pack size are rounded to a valid quantity, with a note.
- Cells below the minimum are flagged, and cells with too little stock for the minimum are disabled.
- Cells can't go above available stock when inventory is tracked and overselling is off.
- A summary shows the total pieces and a subtotal preview. On mobile it's a bar at the bottom of the screen and each row is a collapsible card.
- When Shopify rejects or adjusts a line, Shopify's message shows on that cell and in the summary.

Without JavaScript the matrix still works: the quantities entered replace what's in the cart for each variant.

On products with the matrix tag, wholesale buyers see the matrix instead of the variant picker, and the gallery narrows to give the matrix more room.

## Location switcher

When a buyer's company has two or more locations they can order for, the buyer can switch locations. Switching reloads the page with that location's catalog prices and shows a notice.

- **Chip in the header** (default): a chip next to the account icon shows the company and location. With several locations, it opens the list of locations, store credit when available, and links to the account and sign out. With one location, it links to the account.
- **Inside the account menu**: the header chip is hidden. Buyers switch locations from the mobile menu and from the **Change** link in the cart.

The cart drawer and cart page always show which location the buyer is ordering for.

## Wholesale-only products

Use Shopify catalogs first:

1. Leave the product out of the catalogs your retail markets use.
2. Include it in your B2B catalog.

Retail visitors who follow a link to the product get the 404 page. It includes the line "Wholesale customer? Sign in to see trade-only products", which links to your wholesale sign-in page, or to the login page when none is set. Turn the line off in the **404 page** section.

If a product must stay in a retail catalog, use the tag fallback:

1. Add the tag `b2b` to the product. To use another tag, change **Theme settings > Wholesale > Wholesale-only tag**.
2. Retail visitors then don't see the product on collection pages, in product grids and carousels, in search results or in predictive search. Small product cards still show it, for example in Complementary products, the cart drawer's promoted products, Shoppable image hotspots and Routine steps, so don't pick the product there.
3. If they open its link, they see a "Wholesale-only product" page instead of the product, with a button to log in and, when you've set a wholesale application page, a button to apply. The page tells search engines not to index it.

## The wholesale cart

- The cart shows the company and location, with a **Change** link when the buyer has several locations.
- Each line shows the price per piece and, when a volume price applies, a label such as "24+ price" that matches Shopify's line price.
- Each line's stepper follows the variant's quantity rule. A line that breaks the rule shows a message, for example that the quantity isn't a multiple of the pack size.
- Checkout stays disabled until every line is valid.
- **Pack image metafield**: an image metafield on the product that replaces the line image for wholesale buyers.
- **List all colors on one-size lines**: for assorted packs, lines list every value of the first option.
- **Show SKUs to wholesale buyers** adds the SKU to each line.
- Payment terms and store credit are applied at checkout.

## Quick order list

The quick order list lets a buyer order several products from one table. Each variant is one row, with its own quantity rule, stock limit and volume pricing, and the same checks as the order matrix.

1. In your Shopify admin, go to **Online Store > Pages** and add a page, for example "Quick order".
2. Set its **Theme template** to **page.quick-order** and save.
3. In **Theme settings > Wholesale**, choose this page as the **Quick order page**, so the empty cart and the wholesale access section link to it.
4. In the theme editor, open the page and set the Quick order list section: a collection (all products when empty), products per page, a filter by name or SKU, images, SKUs, sold-out variants and a link to order history.

Retail visitors see a sign-in prompt instead of the list.

## Wholesale page templates

Create a page for each template in **Online Store > Pages**, then assign the template in the page's **Theme template** field.

| Template | What it's for |
|---|---|
| page.wholesale-access | The wholesale sign-in page: a heading, text, a **Log in** button, an **Apply for wholesale access** button and an optional chat line. Signed-in wholesale buyers see links to the catalog, the quick order list and their account instead. |
| page.wholesale-request | The application page: your page content plus an Apps section for a form app block. You can add a Contact form section instead. |
| page.wholesale-onboarding | A landing page for prospective buyers: an image banner with an apply button, a "How it works" text section, the wholesale access card and an Apps section. |
| page.quick-order | The quick order list. |

Then set the pages in **Theme settings > Wholesale**: **Wholesale sign-in page**, **Wholesale application page** and **Quick order page**.

## Wholesale settings

All wholesale options are in **Theme settings > Wholesale**. See [Theme settings](theme-settings.md#wholesale).

## Set up B2B in Shopify

Names and locations in the Shopify admin can change over time. Check Shopify Help for the current steps, and check that B2B is available on your plan.

1. **Create a company.** Add a company in the Companies area of your admin, with at least one location. Each location can have its own payment terms and checkout settings.
2. **Add contacts.** Add the buyers as contacts of the company and give them access to the locations they order for. A contact with two or more locations sees the location switcher.
3. **Create a catalog.** Create a catalog with a price list, using fixed prices or a percentage adjustment, and assign it to the company locations. Include every product the buyers can order, including wholesale-only products.
4. **Add quantity rules.** In the catalog, set a minimum, an increment (pack size) and an optional maximum per variant. Shopify requires the minimum and maximum to be multiples of the increment.
5. **Add volume pricing.** In the catalog, add price breaks per variant, for example 24+ and 48+. Each break starts above the minimum at a multiple of the increment.
6. **Keep wholesale-only products out of retail.** Leave them out of the catalogs your retail markets use.
7. **Tag matrix products.** Add the Order matrix tag (default `row`) to products that should show the order matrix.
8. **Test.** Sign in on your storefront as a company contact and check prices, rules, volume pricing and the cart.

## Checking wholesale in the theme editor

The theme editor doesn't sign you in as a B2B customer, so it shows retail prices. Wholesale blocks show sample content with a "Wholesale preview — sample data" badge, based on the product's real variants. To see real wholesale prices, rules and volume pricing, sign in on your storefront as a contact of a company location.
