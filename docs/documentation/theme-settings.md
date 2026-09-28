# Theme settings

This page lists every group in Theme settings and explains what each setting controls.

To open Theme settings, click **Customize** on your theme in **Online Store > Themes**, then open **Theme settings** from the theme editor sidebar. Changes apply to the whole store.

## Logo and favicon

| Setting | What it does |
|---|---|
| Logo | Your store logo in the header. Any aspect ratio works. |
| Logo width on large screens | Logo width in pixels on desktop. Default 160. |
| Logo width on mobile | Logo width in pixels on phones. Default 100. |
| Favicon | The small icon in browser tabs. It's scaled down to 32 x 32px. |

## Colors

| Setting | What it does |
|---|---|
| Color schemes | Sets of colors that you apply to sections and blocks. See [Colors](getting-started.md#colors) for each color's role. |
| Drawers and pop-ups | The color scheme for the cart drawer, menus, quick add, search, product guide and other overlays. |
| Accents | Colors for sale prices, rating stars, stock status (in stock, low stock and backorder, sold out), success, error and information messages, the installments row tint, and disabled buttons. Status colors always show with a text label. |
| Blend product images with the background | Blends product card images into a background color, which suits product photos shot on white. |
| Blend color | The color that product images blend into. |

## Typography

| Setting | What it does |
|---|---|
| Headings: Font | Heading font from Shopify's font library. |
| Heading size | Scales every heading size up or down. |
| Uppercase headings, Uppercase subheadings | Shows headings or subheadings in capital letters. |
| Body: Font | Font for body text, prices and forms. |
| Base size | Body text size in pixels. |
| Navigation font | Uses the body font or the heading font for the menu. No extra font file loads. |
| Uppercase button text | Shows button labels in capital letters. |

## Layout and design

| Setting | What it does |
|---|---|
| Maximum page width | The widest the page content gets on large screens. |
| Space between sections | Vertical space between sections. Mobile uses 60% of this value. |
| Button and input border | 1 px or 2 px borders on buttons and form fields. |
| Button, Input, Card and panel, Image, Drawer, Pop-up corner radius | Roundness of each element's corners. |
| Accordions: Toggle icon | Plus and minus, or a chevron, on collapsible rows. |
| Breadcrumbs: Products | Shows breadcrumbs above product information. Collection pages have their own **Show breadcrumbs** setting in the Collection banner section. |
| Pagination: Style | How collection pages move to the next page: page numbers, a Load more button, or infinite scroll. |

## Collection cards

These settings style collection cards in the Collection list section and on the collections list page.

| Setting | What it does |
|---|---|
| Image aspect ratio | Natural, square, portrait, tall or landscape. |
| Image fit | Fill the frame or fit the whole image inside it. |
| Image position | Which part of the image stays visible when it's cropped. |
| Text alignment | Start or center. |
| Show "View collection" link | Adds a link under the collection name. |
| Label color, Image background, Image border | Colors of the card label and image frame. |

## Product cards

| Setting | What it does |
|---|---|
| Image aspect ratio, Image fit, Image position | How product images sit in the card. |
| Additional images | None, the second image on hover, or a slideshow on hover. |
| Show swatches | Shows color swatches under the product title. Swatch style is set in **Swatches**. |
| Show rating | Shows the product's star rating when a reviews app fills Shopify's standard rating fields. Hidden for wholesale buyers. |
| Show vendor | Shows the vendor above the title. |
| Show subtitle, Subtitle metafield | Shows a subtitle from a single-line text metafield. Default key: `custom.subtitle`. |
| Show weight | Shows the weight of the first available variant. |
| Show inventory | Shows a stock notice. When it shows is set in **Product inventory**. |
| Align price to the bottom | Lines up prices across a row of cards. |
| Keep the collection in product links | Product links keep the collection in the URL, so breadcrumbs lead back to it. |
| Enable quick add | Shows the quick add action on cards. See [Quick add](collections-search-cart.md#quick-add). |
| Style on mobile, Style on large screens | How the quick add action looks: icon button, text link, button, button on hover or hidden. |
| Dividing lines between cards, Show cards as boxes | Card layout. Box background, Box text and Box border set the box colors. |
| Highlight tag, Highlight background, Highlight text | Collection sections can highlight products that have this tag. Default tag: `highlight`. |

## Product compare

| Setting | What it does |
|---|---|
| Enable product compare | Adds a compare control to product cards. Shoppers tick products and open a comparison table. |
| Compare control on cards | Switch or checkbox. |
| Maximum products | How many products can be compared at once. |
| Column width on large screens | Narrow, medium or wide columns. |
| Show rows without data | Keeps rows that are empty for every product. |
| Text for empty fields | Shown where a product has no value. |
| Extra rows from metafields | One row per line, written as `Label = namespace.key`, for example `Material = custom.material`. |

The table also shows price, availability, vendor, product type, options, weight, SKU and a short description.

## Product inventory

| Setting | What it does |
|---|---|
| Low stock threshold | At or below this number, retail shoppers see "Only a few left". |
| Wholesale low stock threshold | Wholesale buyers see exact counts; at or below this number the count is marked as low. |
| Show stock notice on cards | Always, when low, or never. Needs **Show inventory** in Product cards. |
| Show exact count to retail shoppers | Always, when low, or never. |

Stock messages always use your real inventory.

## Product labels

Labels show on product cards and, with the Labels block, on product pages. They follow the selected variant.

| Label | Settings |
|---|---|
| Position on product cards | Top start, top end, bottom start or bottom end. |
| Sale | Show or hide; content (text, percentage saved or amount saved); icon; colors. |
| Sold out | Show or hide; icon; colors. |
| New | Show or hide; icon; colors. A product counts as new when it's in chosen collections, has a tag (default `new`), or was published within a number of days. |
| Pre-order | Icon and colors. Shows when a variant has no stock but continues selling when out of stock. |
| Custom | Show or hide; the text comes from a single-line text metafield (default `custom.label`); icon; colors. |

## Swatches

| Setting | What it does |
|---|---|
| Color option names | Options with these names show swatches. Separate names with commas. |
| Product page: Swatch content, Shape, Size | Variant image, color or text button; square, circle or portrait; size in pixels. |
| Product cards: Swatch content, Shape, Size | Variant image, color or none; circle or square; size in pixels. |
| Filters: Color filters | Show color filter values as swatches or as text. |
| Fallback colors | Used when Shopify has no swatch for a value. One per line, for example `Ecru: #E6DCC6`. |

Swatches use the colors and images you set on option values in Shopify first.

## Social media

| Setting | What it does |
|---|---|
| Network links | Links to your profiles. They show in the footer, the Social links block and on the password page. |
| Custom network: Icon, Link | One extra network with your own icon. |
| Show chat button | A floating button that opens WhatsApp with the page link filled in. It needs a link in the **WhatsApp** field. |
| Message | Text placed before the page link. |
| Hide on pages | Page handles, separated by commas, where the button stays hidden. |

## Search

| Setting | What it does |
|---|---|
| Enable predictive search | Shows results as shoppers type. |
| Results per type | How many products, collections, pages and suggestions show. |
| Show price, Show vendor | Details shown for product results. |
| Search SKUs, Search tags | Includes SKUs and product tags in predictive search. |
| Product type filter in the search field | Lets shoppers limit the search to one product type. |
| Prompt 1, 2, 3 | Prompts that rotate inside the empty search field. |
| Rotate prompts on mobile | Also rotates prompts on phones. |
| Enable voice search | Shows a microphone button in browsers that support speech recognition. |
| Listening indicator | Color shown while the microphone listens. |

## Currency format

| Setting | What it does |
|---|---|
| Show currency codes | Adds codes such as EUR or USD to prices. Useful when several currencies share a symbol. |
| Show cents as superscript | Shows cents in smaller raised text. |

## Cart

| Setting | What it does |
|---|---|
| Cart icon | Bag, cart or basket icon in the header. |
| Cart type | Drawer or page. |
| After adding to cart | Open the cart drawer, go to the cart page, or stay on the page. |
| Empty cart link | Where the "Continue shopping" button in an empty cart leads. |
| Show weight on lines | Shows each line's weight. |
| Shake the cart icon when it has items, Shake every | Draws attention to a cart with items, every set number of page views. |
| Show free shipping progress | Shows a progress bar in the cart towards free shipping. |
| Thresholds | One line per currency, for example `EUR: 69`. The bar only shows for currencies you list. Hidden for wholesale buyers. |
| Color scheme | Colors of the free shipping bar. |

Keep free shipping amounts in line with your shipping settings in Shopify. The theme doesn't read your shipping rates.

## Animations

| Setting | What it does |
|---|---|
| Reveal sections on scroll | Off, fade in, or fade and rise. Always off for visitors who ask their device for reduced motion. |
| Speed | Fast, normal or slow. |

## Wholesale

These settings control what signed-in B2B buyers see. See [Wholesale](wholesale.md) for how wholesale mode works.

| Setting | What it does |
|---|---|
| Order matrix tag | Products with this tag show the order matrix to wholesale buyers. Default: `row`. |
| Wholesale-only tag | Fallback for products that retail shoppers can still reach. Retail visitors see a sign-in page instead of the product. Default: `b2b`. Prefer leaving these products out of your retail catalogs. |
| Show SKUs to wholesale buyers | Adds the SKU to cart lines for wholesale buyers. |
| Show the installments line to wholesale buyers | Shows the installments line from **Installments** to wholesale buyers. Only turn this on when your B2B checkout offers that provider. |
| Volume price rows before "Show all" | How many volume pricing rows show before the table expands. Default 3. |
| Order from product cards in a drawer | Wholesale buyers open the order matrix or quantity box from a product card without leaving the collection. |
| Location switcher | Chip in the header, or inside the account menu. |
| Wholesale sign-in page, Wholesale application page, Quick order page | Pages the theme links to from the 404 page, the wholesale-only sign-in page, the empty cart and the wholesale access section. |
| Pack image metafield | A product image metafield that replaces the cart line image for wholesale buyers. Default: `custom.pack_image`. |
| List all colors on one-size lines | For assorted packs: cart lines list every value of the first option. |
| Exclude product types | Product types, separated by commas, that don't use the assorted pack display. |

## Delivery information

These rules feed the shipping row of the [Delivery list block](product-pages.md#delivery-list). No delivery date is ever shown.

| Setting | What it does |
|---|---|
| Shipping rules | One line per zone: `countries = rate / free from`. Example: `ES, AD = 4.95 / 69`. Leave "free from" empty when there's no free shipping. Start the amounts with a currency code to use a currency other than your store currency, for example `GB = GBP 4.95 / 99`. |
| Rule for other countries | Rate for countries you didn't list, for example `54.95`. You can add `/` and a free shipping amount. Leave empty to hide the shipping row for unlisted countries. |
| Round converted amounts up | When a shopper sees another currency, converted amounts are rounded up so the page never shows less than checkout charges. |
| Returns row | Text of the returns row, for example `14-day returns`. |

The theme shows these rules as you write them. Keep them in line with your shipping settings in Shopify.

## Installments

| Setting | What it does |
|---|---|
| Provider name | Name of your installments provider. Leave empty to hide the installments row. |
| Number of payments | How many payments the price is divided into. |
| Countries | Two-letter country codes, separated by commas, where the row shows. Leave empty for all countries. |

Shop Pay Installments shows separately, from the Price block, when it's available for your store.

## Custom code and tracking

Code added here runs on every page.

| Setting | What it does |
|---|---|
| Code for the head | Code placed in the page head. |
| Load head code | Immediately, after page load, or after first interaction. Verification tags must load immediately. |
| Code before the closing body tag | Code placed at the end of the page. |
| Load body code | Immediately, after page load, or after first interaction (default). |
| Wait for marketing consent | Code waits until the visitor gives marketing consent through Shopify's customer privacy settings. On by default. |

## Advanced

| Setting | What it does |
|---|---|
| Preload links on hover | Starts loading a page when a shopper hovers over or touches its link. When Shopify already prefetches pages for your store, the theme leaves it to Shopify. |
| Open external links in a new tab | Links to other websites open in a new tab. |
| Image resolution | Standard, or high for sharper images on large screens. High loads larger files. |
| Show attention messages, Message 1, Message 2, Delay | Changes the browser tab title while a visitor looks at another tab. |
| Vibrate on add to cart | A short vibration on phones that support it. |
