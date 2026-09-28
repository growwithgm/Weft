# Collections, search and cart

This page covers collection pages, filters and sorting, search, the cart page, the cart drawer and quick add.

## Collection pages

The default collection template has two sections:

- **Collection banner**: breadcrumbs, the collection title, product count, description and, optionally, the collection image beside or behind the text. When a collection has no image, it can use the first product's image.
- **Collection products**: the product grid with filters, sorting, promotion tiles and pagination.

Two alternate collection templates are included. Assign them in the **Theme template** field of a collection in your Shopify admin.

| Template | What it adds |
|---|---|
| collection.banner | An Image banner above the products, for a campaign image with your own heading and text. |
| collection.flash-sale | A countdown timer to a date you set, the products, a promo strip with a discount code, and a collection list. |

### Collection products settings

| Setting | What it does |
|---|---|
| Products per page | How many products load per page. |
| Columns on large screens, Columns on mobile | Grid columns. |
| Show grid and list toggle | Lets shoppers switch between a grid and a list. |
| Enable filtering | Shows filters. See [Filters](#filters). |
| Show filters beside products on large screens | When off, filters open in a drawer on every screen size. |
| Keep filters in view while scrolling | The filter column stays in view on large screens. |
| Show product counts | Shows how many products match each filter value. |
| Open all filters | Expands every filter group. |
| Values before "Show more" | How many values show before a filter group expands. |
| Enable sorting, and Show "Featured", "Best selling", alphabetical, price and date options | Which sort options shoppers can choose. |

Product cards follow **Theme settings > Product cards**, **Product labels**, **Swatches** and **Product compare**. The pagination style (page numbers, a Load more button or infinite scroll) is set in **Theme settings > Layout and design**.

### Filters

Filters come from Shopify's storefront filtering. You choose which filters show, and in which order, in the Shopify Search & Discovery app.

1. Install the Shopify Search & Discovery app.
2. In the app, add the filters you need: availability, price, product type, vendor, variant options such as size and color, tags and product or variant metafields.
3. In the theme editor, make sure **Enable filtering** is on in the Collection products section and, for search, in the Search results section.

Color filters show as swatches when Shopify has a swatch for the value, or when **Theme settings > Swatches > Color filters** is set to Swatches. Filters work without JavaScript through an Apply button.

### Promotion tiles

Add promotion blocks to the Collection products section to place content between products. Promotions show on the first page only, and they can hide while filters are active.

| Block | What it is |
|---|---|
| Wide promotion | A full-width tile with an image or video, text and a button. |
| Media promotion | A tile one or two columns wide with an image or video, text and a button. |
| Card promotion | A card with an image, heading, text and button, on its own color scheme. |
| Filter promotion | A tile under the filters on large screens. |

Set **Before product number** to choose where a tile appears in the grid.

## Collections list page

The collections list page (`/collections`) shows every collection, paginated, or a list you choose. It has the same promotion blocks as collection pages, except the filter promotion.

## Search

### Predictive search

When **Theme settings > Search > Enable predictive search** is on, the search icon opens a search panel that shows products, collections, pages, blog posts and search suggestions as shoppers type. In **Theme settings > Search** you can:

- set how many results show per type
- show price and vendor on product results
- include SKUs and tags
- add a product type filter to the search field
- add up to three rotating prompts
- turn on voice search, which shows a microphone in browsers that support speech recognition

Shoppers can move through the results with the arrow keys.

### Search results page

The **Search results** section shows products as product cards, then pages and blog posts. Settings: results per page, columns, **Search products only**, and the same filter and sorting options as collection pages.

## Cart

Choose the cart type in **Theme settings > Cart**: a **Drawer** that slides in, or a **Page**. **After adding to cart** chooses whether the drawer opens, the shopper goes to the cart page, or stays on the page.

### What each cart line shows

- product image, title and options
- values from [custom options](product-pages.md#custom-options), such as a gift message
- the subscription plan name for subscription products
- the products included in a bundle
- price, unit price and final line price
- discounts applied to the line
- a backorder note, when turned on
- weight, when **Show weight on lines** is on

Order-level discounts show in the cart summary with the subtotal. Shoppers enter discount codes at checkout.

### Cart page settings

| Setting | What it does |
|---|---|
| Show page title, Heading alignment | The cart heading. |
| Show vendor | Vendor above each product title. |
| Show backorder note | A note on lines that are on backorder. |
| Show order note | A field for a note with the order. |
| Show tax and shipping note | A line explaining taxes and shipping at checkout. |
| Show accelerated checkout buttons | Express payment buttons. Retail shoppers only. |
| Terms and conditions link | When set, shoppers tick a box to accept the terms before checkout. |
| Continue shopping link | Where the continue shopping link leads. |
| Show shipping calculator, Default country | Lets shoppers estimate shipping rates for the cart. |

You can also add app blocks and a Custom Liquid block to the cart page.

### Cart drawer settings

Select the **Cart drawer** section in the Overlays group to edit it.

| Setting | What it does |
|---|---|
| Show "View cart" link | A link to the cart page. |
| Show vendor, Show backorder note on lines | Line details. |
| Summary position | Summary at the bottom or top of the drawer. |
| Keep the checkout area in view | The summary and checkout button stay visible while the lines scroll. |
| Show order note, Show tax and shipping note | Summary details. |
| Show accelerated checkout buttons, Show checkout button | Checkout buttons. Express payment buttons show to retail shoppers only. |
| Terms and conditions page | Adds a required checkbox. |
| Promoted products | Products to show when the cart is empty, always or never, as a list or grid. Hidden for wholesale buyers. |
| Media promotion | An image with text and a button, shown when the cart is empty or always. |

### Free shipping bar

Turn on **Theme settings > Cart > Show free shipping progress** and enter one threshold per currency, for example `EUR: 69`. The bar shows how much is left to reach free shipping in the cart drawer and on the cart page. It's hidden for wholesale buyers. Keep the thresholds in line with your shipping settings in Shopify.

### Shipping calculator

The cart page has a shipping calculator. You can also create a page with the **page.shipping-calculator** template, which shows the calculator for the items in the cart.

### Wholesale carts

Wholesale buyers see their company and location at the top of the cart, per-piece prices with volume pricing labels, and a message on any line that breaks a quantity rule. Checkout stays disabled until every line is valid. See [Wholesale](wholesale.md#the-wholesale-cart).

## Quick add

Quick add lets shoppers add a product from a product card.

1. Turn on **Theme settings > Product cards > Enable quick add**.
2. Choose how the action looks on mobile and large screens.

Products with a single variant are added straight to the cart. For products with options, a drawer opens with the product image, title, price, variant picker and buy buttons, plus a link to the full product page.

Wholesale buyers see an **Order** action on product cards that opens the product page. When **Theme settings > Wholesale > Order from product cards in a drawer** is on, it opens a drawer with the order matrix or the wholesale quantity box instead.

## Product compare

Turn on **Theme settings > Product compare > Enable product compare** to add a compare control to product cards. When shoppers tick products, a bar appears. It opens a table that compares price, availability, vendor, type, options, weight, SKU, a short description and any metafield rows you add. The chosen products are remembered in the shopper's browser.
