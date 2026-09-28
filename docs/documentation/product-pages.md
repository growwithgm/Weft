# Product pages

This page explains how Weft product pages are built from blocks, what each block does, and how to use the alternate product templates.

## How the product page is built

The **Product** section holds the media gallery on one side and a column of blocks on the other. Every piece of product information, from the title to the buy buttons, is a block that you can add, remove, reorder and hide. The same blocks work in the Featured product section.

Below the Product section, the default product template includes the **Reviews**, **Related products** and **Recently viewed** sections. You can add others, such as **Product details**, **Product features** or **Apps**. See [Sections](sections.md).

To edit the product page:

1. In the theme editor, choose **Products > Default product** from the template selector.
2. Click the **Product** section to change gallery settings, or click a block to change its settings.
3. Click **Add block** in the Product section to add a block.

## Product section settings

| Setting | What it does |
|---|---|
| Preselect the first available variant | When off, shoppers choose every option before they can add to cart. |
| Keep product information in view while scrolling | The information column stays in view on large screens while the gallery scrolls. |
| Mobile sticky bar | Shows the selected options, stock status and Add to cart at the bottom of the screen once the main button scrolls out of view. When the variant is sold out, it offers Remind me instead. Hidden for wholesale buyers. |
| Layout on large screens | Stacked, two columns, thumbnails or carousel. On mobile the gallery is a swipe carousel. |
| Gallery width | Wide, half or narrow. |
| Media aspect ratio, Media fit, Media background | How images sit in the gallery. |
| Thumbnails | Large screens only, all screens or hidden. |
| Show media counter on mobile | Shows the current image number on phones, for example 1 / 5. |
| Zoom | Open in a lightbox, magnify on hover, both, or off. |
| Open the lightbox on mobile | Lets phone shoppers open the lightbox. |
| Loop videos | Repeats product videos. |
| Show only the media for the selected option value | Shows only the images of the selected color (or other option). Each variant's featured image starts its group, so put the images for each value together, in variant order. |
| Option names to group by | Which options group the media, for example Color. |

Videos and 3D models show their cover image first and load the player when a shopper plays them.

## Product blocks

### Core information

| Block | What it does | Notable settings |
|---|---|---|
| Labels | Sale, sold out, new, pre-order and custom labels for the selected variant. | Set up in Theme settings > Product labels. |
| Title | The product title. | Size, heading level, show weight. |
| Price | Price, compare-at price and unit price. Retail shoppers also see a tax note and, when available, Shop Pay Installments. Wholesale buyers see the price per piece and a link to volume pricing. | Show tax note, mention shipping at checkout, show Shop Pay Installments, preview the wholesale price in the editor. |
| Rating | A rating pill or stars that link to your reviews. | Score and review count (connect metafields, or leave empty to use the product's standard rating), count label, style, link target, Show to. |
| Product details line | Vendor, product type, SKU, barcode and weight. | Choose which details show. |
| Description | The product description, as an accordion or plain text. | Heading, open by default, shorten to about a number of characters with a See more link. |
| Share | Share links. | X, Facebook, Pinterest, copy link. |

### Buying

| Block | What it does | Notable settings |
|---|---|---|
| Variant picker | Swatches, buttons or dropdowns for each option. See [Variant picker and swatches](#variant-picker-and-swatches). | Style, when to mark values as unavailable, which options show the product guide link. |
| Purchase options | One-time purchase and subscription plans, with each plan's name and price shown before adding to cart. Shows only for products with selling plans. | Heading. |
| Custom option | A field saved with the cart line: text, long text, checkbox or dropdown. See [Custom options](#custom-options). | Label, type, required, character limit. |
| Buy buttons | Quantity selector, Add to cart, accelerated checkout buttons, pickup availability, gift card recipient form and backorder note. | See [Buy buttons](#buy-buttons). |
| Stock | "In stock", "Only a few left", "Sold out" or "On backorder" from real inventory, with an optional inventory bar. | Text after "In stock" (for example your dispatch time), inventory bar, custom texts, Show to. |
| Back in stock | A "Remind me" button when the selected variant is sold out, and a form that handles several sold-out options at once. | Show a link when other options are sold out, consent text, Show to. |
| Delivery list | Rows for fit, shipping, installments, sold-out options and returns. See [Delivery list](#delivery-list). | Fit row, which rows show, returns text and page, Show to. |

### Guidance and content

| Block | What it does | Notable settings |
|---|---|---|
| Product guide | A size chart, shade guide or usage chart in a pop-up. See [Product guide](#product-guide-and-size-chart). | Link label, icon, link position, image, text or table, page, two label and value rows. |
| Specifications | Label and value rows, for example material and care. Rows without a value are hidden. | Heading, show as accordion, open by default, Show to. Add a **Row** block per line. |
| Collapsible row | An accordion row with text and, optionally, a page's content. Presets: Collapsible row, Returns and Warnings. | Heading, icon, text, page, open by default, Show to. |
| Product tabs | Tabs or collapsible rows with the description, a specification from metafields, up to three custom tabs and a reviews tab. | Style, rows from metafields written as `Label = namespace.key`, custom tab text or pages, reviews app code. |
| Flash message | A short message in the column or over the product media. | Icon, closing behavior, colors. |
| Pop-up link | A link or button that opens text or a page in a pop-up. | Link text, style, text, page. |
| Highlight text | A short highlighted note. | Heading, text, color scheme. |
| Payment methods | Payment icons and up to two short texts. | Headings, texts, logo. |
| Complementary products | Products that go with this one, such as "Complete the look". | Heading, maximum products, layout, number products as steps. |

Hair care and body care blocks (Highlights, Attribute chips, Ingredients, How to use, Badges, Scent notes, Period after opening) are described in [Hair care and body care](hair-and-body-care.md). Wholesale blocks (Wholesale terms, Volume pricing, Wholesale quantity, Order matrix, Wholesale installments) are described in [Wholesale](wholesale.md). All of them work in every style.

### Launch blocks

| Block | What it does |
|---|---|
| Countdown timer | Counts down to an end date and time you set, in your store's time zone. It can hide itself or show a text when it ends. |
| Product signup | An email form, for example "Be the first to know". Emails are added to your customers with the tags `product-signup` and the product's handle. It can show only while the product is unavailable. |

### General blocks

Heading, Text, Button, Image, Group, Spacer, Divider, Email signup, Social links, Discount code, Custom Liquid and app blocks can also go in the product column.

## Show to: retail or wholesale

Several blocks have a **Show to** setting: Everyone, Retail shoppers or Wholesale buyers. Use it to show a block to one audience only. The Rating, Stock, Delivery list, Back in stock and Buy buttons blocks show to retail shoppers by default. In the theme editor every block shows, so you can style both versions.

## Dynamic sources

Many text, image and rich text settings accept dynamic sources. Connect a product metafield to show different content for each product:

1. Click the block in the theme editor.
2. Next to a setting, click the **Connect dynamic source** icon.
3. Choose the metafield. Create product metafield definitions first in **Settings > Custom data** in your Shopify admin.

Examples: connect an image metafield to the Product guide image for a different size chart per product, or a text metafield to a Specifications row. Rows and blocks with an empty value are hidden.

## Variant picker and swatches

- Options named in **Theme settings > Swatches > Color option names** show as swatches. Other options show as buttons or a dropdown.
- **Theme settings > Swatches > Swatch content** chooses what a product page swatch shows: the variant image, a color, or a text button. Colors and images come from the swatches you set on option values in Shopify. The **Fallback colors** setting fills in values that have no swatch.
- **Mark values as unavailable** controls when a value is struck through: when no variant with that value is available, or when the exact combination is unavailable. Unavailable values stay selectable, so shoppers can reach the back in stock form.
- Without JavaScript, shoppers choose from a single list of variants.

## Product guide and size chart

1. Add a **Product guide** block.
2. Add the guide content: an image, a text or table, a page, or all of them. The **Fit** and **Best suited for** rows show under the content when they have a value.
3. To show a different chart per product, connect the image to a product metafield.
4. Choose the **Link position**:
   - **Next to the matching option in the variant picker** shows the link beside the options listed in the Variant picker's **Show the product guide link next to** setting, for example Size, Shade or Volume.
   - **Where this block is placed** shows the link where the block sits. Use this when the product has no matching option.
5. Change the **Link label** to fit your products, for example Size guide, Shade guide or How to choose.

## Delivery list

The Delivery list shows short rows in this order:

1. **Fit**: text you enter or connect to a metafield, such as a fit guide.
2. **Shipping**: the rate for the shopper's country and, when there's a free shipping amount, progress towards it. Rates come from **Theme settings > Delivery information**.
3. **Installments**: the payment amount from **Theme settings > Installments**, when a provider name is set.
4. **Sold-out options**: opens the back in stock form when some options are sold out.
5. **Returns**: the returns text, with an optional link to your returns page.

Rows without content are hidden. No delivery date is shown.

## Buy buttons

| Setting | What it does |
|---|---|
| Show quantity selector | A quantity stepper next to Add to cart. It follows the variant's quantity rules. |
| Show accelerated checkout buttons | Shop Pay and other express payment methods set up in your payment settings. |
| Show pickup availability | Shows where the variant can be picked up. Needs local pickup set up in Shopify. |
| Show recipient form for gift cards | Lets shoppers send a gift card to someone else. |
| Show backorder note, Backorder note | A note when the variant is out of stock but still sold. |
| Label backorders as pre-order | Shows "Pre-order" on the button for backordered variants. |
| Always use the Pre-order label | For pre-order templates. |
| Show to | Retail shoppers by default. Wholesale buyers use the Wholesale quantity block or the order matrix. |

The button shows the variant's state: Add to cart, Pre-order, Sold out, Unavailable, or a prompt to choose an option. The form works without JavaScript.

## Custom options

The Custom option block adds a field whose value is saved with the cart line and shows in the cart and on the order.

1. Add a **Custom option** block and enter a **Label**. The label becomes the name of the saved value.
2. Choose a **Type**: text, long text, checkbox or dropdown.
3. Set **Required** and, for text, a **Character limit**. A counter shows the characters used.

The **Gift message** preset is a ready-made long text option with a 200 character limit.

## Recommendations and reviews

- **Complementary products** block: products you pick as complementary in the Shopify Search & Discovery app.
- **Related products** section: Shopify's automatic recommendations. Adjust them in the Search & Discovery app.
- **Recently viewed** section: products the shopper viewed, remembered in their browser.
- **Reviews** section: shows the product's standard rating and holds your reviews app block. Set its **Anchor** to match the Rating block, so the rating links to it.

## Alternate product templates

Assign a template to a product in the **Theme template** field of the product in your Shopify admin.

| Template | Use it for |
|---|---|
| product (default) | Standard product page. |
| product.hair-care | Hair care products: badges, hair type guide, hair type chips, complementary products labeled "Complete the routine", highlights, ingredients and how to use. |
| product.body-care | Body care products: badges, usage chart, skin type chips, gift message, "Complete the ritual", scent notes, highlights, ingredients, how to use, period after opening, and a warnings row. |
| product.preorder | Products sold before they're in stock. The button says Pre-order and an email signup sits below. |
| product.countdown | Launches: a large countdown timer and a product signup form. Set the end date in the Countdown timer block. Add a Buy buttons block if shoppers can buy during the countdown. |
| product.coming-soon | Products not on sale yet: a "Coming soon" signup form instead of buy buttons. |

Every template includes the wholesale blocks, so wholesale buyers see their prices and ordering tools on every product page.
