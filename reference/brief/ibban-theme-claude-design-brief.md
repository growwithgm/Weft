# ibBan storefront redesign — Claude Design brief

**One Shopify theme, two audiences: retail shoppers (DTC) and wholesale buyers (Shopify's native B2B).**

Prepared 27 Sep 2026 from a file-by-file audit of the live theme export `ibban-com-copy-of-4-live-ibban`, which is Enterprise 2.0.1 by Clean Canvas (380 files: 75 sections, 116 snippets, 50 templates, 119 assets).

This file has two jobs. First, it is the brief for a clickable mockup in Claude Design. Second, once the mockup is approved, it is the functional spec for coding the real theme.

**Version 2 (27 Sep 2026).** Checked against Shopify's documentation, with the answers in section 13. Section 14 is the feature parity register: every feature of the current theme is kept, improved or replaced by its native Shopify equivalent, and nothing is dropped.

---

## 0. Instructions for Claude Design

- Build a clickable, responsive prototype at 1440 px (desktop) and 390 px (mobile) for every screen in section 6, P1 screens first.
- Every screen shows both audiences. Put the prototype-only control bar from 6.0 at the top so a tester can switch audience, country, product type, stock scenario and volume pricing live.
- Read section 2 (hard rules) and section 5 (decisions already approved) before designing. Section 4 describes today's theme: use it for behaviour, not for looks.
- Use the sample data in section 9 and the copy in section 10. Don't add features, apps or data sources that aren't in this brief.
- Don't design checkout or customer-account pages, because Shopify hosts them; show only the buttons that lead there.
- Section 8 is the design direction to start from, and section 4.10 lists the UX gaps the redesign must fix.
- Section 14 lists every existing feature. Anything it marks for the mockup must appear, and nothing in it may be dropped.

---

## 1. Context

**Brand.** ibBan makes hand-embroidered women's clothing and bags, worked by its own artisans since 1982. Orders ship from Madrid (warehouse in San Sebastián de los Reyes), with same-day dispatch Monday to Friday for orders placed before 16:00 Madrid time. Categories: long dresses, short dresses, long tunics, short tunics, long coats, jackets, gilets, holiday, swimwear, bags.

**Languages.** English by default. Visitors whose country is Spain get Spanish in the custom modules (delivery list, rating pill, mobile sticky bar, See more, wholesale gate). Theme locales: en, es, de, fr, it, nl, pt-PT, ja.

**Markets.** `b2b-wholesale` for wholesale buyers, and `rest-of-world` with `es`, `us`, `nl` and `uk` nested under it. Product, home and header have market-specific overrides.

**B2B.** Shopify's own B2B only:

- companies and company locations
- catalogs with price lists
- quantity rules (min, max and increment per variant)
- volume pricing (quantity price breaks)
- payment terms and store credit at checkout
- new customer accounts (sign-in through `/customer_authentication/redirect`)

This setup is already live: wholesale buyers are Shopify companies with locations, and the new theme must work with it as it is, with no data changes. No B2B app is installed or wanted. The old SparkLayer and BSS B2B leftovers in the theme are listed in 4.9 and must not come back.

---

## 2. Hard rules

1. **One theme, two modes.** Wholesale mode is on when `customer.b2b?` is true, meaning a signed-in customer is buying for a company location. The `b2b-wholesale` market only switches which sections and blocks are enabled, through the `*.context.b2b-wholesale.json` templates. Customer tags, SparkLayer metafields or any other flag never decide B2B.
2. **Prices come from Shopify.** For wholesale buyers `variant.price` already returns the company location's catalog price. The theme displays prices and never calculates its own wholesale discounts. Tier previews come from the variant's quantity price breaks, and the cart always shows the price Shopify actually applied. Once a product has volume pricing, Shopify fixes its price and the catalog's overall adjustment no longer applies to it.
3. **Quantity rules are per variant**, i.e. per colour and size combination: `min`, `max` (optional) and `increment`.
   - A line is valid when it is 0, or when it is at least `min`, at most `max`, and a multiple of `increment`.
   - Shopify's own validation makes `min` and `max` multiples of `increment`, and volume-price break quantities must be above the minimum and multiples of the increment. Rounding to a pack size therefore never skips a tier.
   - Shopify enforces the rules when items are added to the cart and checks them again at checkout. The theme's job is to guide the buyer to valid quantities before that happens.
   - Rules that span several variants, such as "6 per colour across all sizes" or "30 pieces per product", can't be enforced natively, so the UI must not promise them.
4. **Stock caps.** If a variant tracks inventory and doesn't allow overselling, its quantity can't exceed available stock. Untracked or oversell-allowed variants have no cap.
5. **Shopify-hosted areas stay out of the design:** checkout (payment terms, store credit, order review) and customer accounts (orders, addresses, company profile).
6. **Nothing breaks when data is missing.** Every module must still look finished with:
   - no tiers
   - default rules (min 1, increment 1, no max)
   - untracked stock
   - single-variant products
   - empty metafields
   - zero reviews
7. **Quality floor:**
   - keyboard-operable steppers and order matrix, with visible focus
   - 44 px touch targets and WCAG AA contrast
   - `prefers-reduced-motion` respected
   - no layout shift from late-loading widgets
   - no hiding markup with CSS or JS sweeps
   - status never carried by colour alone
8. **No feature is lost.** Every feature in section 14 is kept, improved or replaced by its native Shopify equivalent. Only the leftovers in 4.9 are removed.

---

## 3. Audiences and states

| ID | Who | Detected by | Experience |
|---|---|---|---|
| A | Retail guest | no `customer` | Retail everywhere |
| B | Retail, signed in | `customer` and not `customer.b2b?` | Retail; the account icon opens the Shopify account |
| C | Wholesale buyer, one location | `customer.b2b?` | Wholesale mode on every page; B2B market home, header and product overrides |
| D | Wholesale buyer, several locations | as C, and `customer.company_available_locations.size > 1` | As C, plus the location switcher |
| E | Non-wholesale visitor on a wholesale-only product | product tag `b2b` and not `customer.b2b?` | Wholesale-only gate page (noindex) |

Country matters in both modes. ES visitors get Spanish copy in the custom modules, and shipping rows and currency follow the visitor's country.

---

## 4. Current theme audit (what exists today)

### Where things live

| File | What it does |
|---|---|
| `sections/main-product.liquid` | Product page blocks; wholesale price; legacy Wholesale Details card; both Klarna badges; size guide; wholesale grid trigger; hides the buy form for wholesale `row` products |
| `snippets/b2b-row-grid.liquid` | Wholesale bulk-order grid |
| `snippets/product-card.liquid` | Product cards; hides wholesale-only products; wholesale note; quick add |
| `snippets/cart-items.liquid` | Cart lines; pack image; assorted-pack colour display |
| `snippets/quantity-input.liquid`, `snippets/variant-picker.liquid`, `assets/variant-picker.js` | Quantity rules on the product page; variant switching |
| `layout/theme.liquid` | Wholesale-only gate; WhatsApp bubble; tracking tags |
| `snippets/gn-rating`, `gn-shipping-bar`, `gn-see-more`, `gn-atc-button`, `gn-sticky-atc`, `back-in-stock` | Custom modules: rating pill, delivery list, description clamp, yellow Add to cart, mobile sticky bar, Wasify back-in-stock |
| `sections/gn-product-reviews`, `sections/gn-reviews-wall` | Reviews on the product page and on the reviews page, built from Judge.me metafields |
| `templates/*.context.*.json`, `sections/header-group.context.*.json` | Market overrides for product, home and header |

### 4.1 Global

- **Announcement bar** (near-black). It rotates two messages, "Hand-embroidered by our artisans · Handmade since 1982" and "Order by 4pm Madrid for same-day dispatch, Mon–Fri", and carries the country and language selectors.
- **Header:**
  - logo on the left (160 px) and a centred main menu with a sidebar mega menu ("Shop")
  - search with rotating placeholders: "Search long dresses, kaftans…", "Search tunics, jackets, coats…", "Search bikinis, bags & more…"
  - account icon and cart icon with count
  - sticky; burger menu on the left on mobile
  - the B2B market uses the same menu, and nothing in the header shows the company or location
- **Predictive search** shows 5 results with price and vendor.
- **Floating WhatsApp bubble** sits bottom-right on every page except `/pages/b2b-onboarding` and is pre-filled with the page URL. The number is hard-coded in the layout, separately from the theme setting.
- **Wholesale-only gate.** When a non-wholesale visitor opens a product tagged `b2b`:
  - the page gets `noindex` and no breadcrumbs
  - the content is replaced by "Wholesale-only product — This product is reserved for B2B customers. Please log in with your wholesale account to view it."
  - a Log in button is shown (Spanish version for ES)
- **Tracking in `<head>`** is carried over in the build but is not part of the mockup: Google Tag Manager, Microsoft Clarity, Facebook domain verification and Google site verification (that tag is duplicated).
- **Cart** opens as a drawer.

### 4.2 Home

- **Retail**, in order:
  1. hero banner
  2. brand marquee (Hand-embroidered, Since 1982, Made by our artisans, Shipped from Madrid)
  3. New in row
  4. Shop by category (10 tiles)
  5. outerwear banner and row
  6. craft story ("Every stitch by hand")
  7. holiday banner and row
  8. brand video ("The world of ibBan")
  9. trust strip (Hand-embroidered, Since 1982, Ships from Madrid, Simple returns)
- **B2B market.** Every retail section above is switched off, and five wholesale sections switch on:
  - background video
  - collection tiles (summer dresses, pareos, swimwear, summer jackets and vests)
  - brand-story video
  - featured jackets collection
  - slideshow

### 4.3 Collection page and product cards

- **Collection page:**
  - banner with title, product count and description
  - 50 products per page, small cards, grid/list toggle
  - sorting by best selling, A–Z, price and date; filters currently off
  - optional promo tiles
- **Retail card:**
  - second image on hover, colour swatches from variant images, star rating when the product has one, price
  - labels: sold out, pre-order, custom
  - an "Add to cart" text button at the bottom, which opens the quick-add drawer when the product has options
- **Wholesale card:**
  - no quick add
  - a black pill "Min Order X Pcs Each Colour • (Y Pcs in Packet)", read from SparkLayer metafields with the native rule as fallback
  - the price still sits inside a leftover SparkLayer wrapper
- **Wholesale-only products** (tag `b2b`) are removed from grids for non-wholesale visitors. This uses a CSS `:has()` rule plus a JS pass that deletes the empty cell.

### 4.4 Product page — retail vs wholesale

Block order today:
1. labels
2. title
3. price
4. rating pill
5. variant picker (with size guide)
6. back-in-stock
7. delivery list
8. buy buttons
9. Main features
10. Description
11. share

Below the product: reviews, You may also like, Recently viewed.

| Module | Retail (DTC) | Wholesale (B2B) |
|---|---|---|
| Gallery | Stacked images on desktop, natural ratio on #F4F4F4, thumbnails, lightbox zoom (mobile too), media grouped by colour (`shopify.color-pattern`), looping video | Same |
| Labels | Variant-aware labels (sold out, pre-order, custom) | Same |
| Title | Cormorant, h5 size | Same |
| Price | Current price and struck compare-at; tax note; Shop Pay Installments message where Shopify offers it | Catalog price; when compare-at is higher, bold price plus grey strikethrough (inline styles) |
| Rating pill (`gn-rating`) | Under the price; store-wide Judge.me score labelled "store reviews"; click scrolls to the reviews section | Hidden |
| Klarna | Row inside the delivery list: "3 × (variant price ÷ 3)", follows the selected variant, only in 21 listed countries | Only on `row` products: pink badge "Pay in 3 interest-free installments of (price × minimum ÷ 3)" above the grid |
| Colour and size picker | Colour as 48 px variant-image swatches, size as buttons, sold-out options marked, URL updates on change | Same picker; on `row` products it sits under the grid and only changes the image, because the buy form is hidden |
| Size guide | "Size Guide" link with ruler icon beside the Size label; modal with the `custom.size_chart` image (full screen on mobile) | Same |
| "This size is ideal for" | Duplicate of the delivery list's Fit row; hidden by a CSS patch | Same (hidden) |
| Delivery list (`gn-shipping-bar`) | Hairline list: Fit, then Shipping to country (rate, free-shipping threshold and progress), then Klarna, then Notify (sold-out count), then 14-day returns as the last row directly above Add to cart | Hidden (by market and by customer) |
| Back-in-stock (Wasify) | Selected variant sold out: full-width "Notify me" button. Otherwise: a bell link with the sold-out count. Drawer with sold-out variant chips, name, phone, email, WhatsApp consent | Hidden |
| Quantity and Add to cart | Stepper (starts at the rule minimum, steps by the increment); yellow Add to cart with "Pre-order", "Sold out" and "Select a variant" states; Shop Pay button below; pickup availability | Non-row products: same form, and the stepper uses the wholesale rules. Row products: the whole form is hidden |
| Wholesale Details card | — | "Minimum Order X Pcs Each Colours / Packing: X Pcs in Packet" from SparkLayer variant metafields (legacy) |
| Bulk-order grid | — | Row products only; see 4.5 |
| Mobile sticky bar (`gn-sticky-atc`) | Colour and size chips, stock status, Add to cart / Buy now / WhatsApp. Sold out: Remind me + WhatsApp. Hidden while the real button is on screen or an overlay is open | Hidden |
| Main features | Fabric (`shopify.fabric`), Embroidery (`custom.embroidery`), Colour (`shopify.color-pattern`), Sizes (`shopify.size`) | Same |
| Description | "Descripción" accordion ("Description" in rest-of-world), clamped to about 200 characters with See more / Ver más | Same |
| Share | X, Facebook, Pinterest | Same |
| Reviews (`gn-product-reviews`) | Aside: heading, big score, stars, "N store reviews", note, Read all / Write a review. Grid: this product's reviews first with a "This piece" badge, then others with a product pill; 4★ and up only; chips All / 5★ / 4★ / With photos; 6 shown, Show more up to 40 | Same |
| You may also like, Recently viewed | Carousels of 8 small cards | Same, with wholesale cards |

**Market overrides:**
- The B2B market template switches off back-in-stock, the size-warning block and the returns accordion.
- The rest-of-world template switches back-in-stock on, renames "Descripción" to "Description", and keeps its own block order, so any new block must be added there too.

**Other product templates:**
- `dress`, `hand-bag` and `perfume` use an older block set without the rating pill, delivery list or back-in-stock.
- `preorder` shows a Pre-order button and a newsletter sign-up.
- `countdown` and `coming-soon` show a sign-up form instead of buying.

### 4.5 Wholesale bulk-order grid (today)

Shown when the customer is wholesale **and** the product is tagged `row`.

- **Banner:** "Min Order X Pcs | Pack Y Pcs", taken from the first variant's native `min` and `increment`, with a SparkLayer fallback.
- **One row per variant:** thumbnail, colour, size pill, stock, stepper, price and line total.
  - Stock colours: green over 10, amber "Low" up to 10, red at 0, ∞ when untracked.
  - The stepper steps by the increment and is capped at stock when overselling is off.
  - Price shows as "€X/ea" with struck compare-at, or "Sold Out".
- **Footer:**
  - View Cart, Clear All, item count and subtotal
  - the button stays disabled, with "Please select at least X units total.", until the product total reaches the minimum
- **Add to Cart:**
  - sends all rows in one `/cart/add.js` call, shows "Adding…" then "✓ Added!", updates the cart count and refreshes the drawer
  - failures show a browser `alert()`

### 4.6 Cart (drawer and page)

- **Drawer:**
  - summary at the top and a sticky footer
  - order note and backorder note
  - View cart link, Shop Pay and other accelerated buttons, Checkout
  - a promoted-products slot for the empty cart, currently with no products assigned
- **Line:** image, title, options, properties, discounts, stepper, remove, and line total with compare-at. The stepper goes from 0 up to available stock when overselling is off.
- **Wholesale extras:**
  - The product's `custom.pack_image` replaces the line image when set.
  - One-size products that aren't bags or `row` products list *all* colour values on the line ("Color: Coral, Turquoise, White, Navy"), which reads as an assorted pack.
- **Missing:** quantity-rule hints and validation, tier information, and any company or location context.

### 4.7 Wholesale pages

- **`/pages/b2b-login`:** a centred card with:
  - "Welcome to Our Wholesale Portal" / "Sign in to view your wholesale account, special pricing, and trade-only access."
  - a Sign In button to `/customer_authentication/redirect?locale=en&region_country=ES`
  - an "Apply for Access" link to `/pages/bn2b-request-form`. The template is named `b2b-request-form`, so check that handle.
- **Request form page:** a Shopify Forms app form.
- **Onboarding landing** (`page.b2b-en-onbord`): a long custom-code page in Cormorant and Jost, black and white, with:
  - a Klaviyo embedded form
  - a Judge.me featured-reviews carousel
  - a closing CTA

### 4.8 Other storefront features

- product compare drawer (collection and search)
- recently viewed
- reviews wall page (`/pages/reviews`)
- shipping-calculator page
- countdown timer section
- age-verification and email pop-ups (off)
- Judge.me app blocks (disabled; reviews come from the GN sections)

### 4.9 Leftovers to ignore — never design or rebuild these

- `templates/search.bss.b2b.liquid`, the JSON endpoint of the removed BSS B2B app.
- SparkLayer remains:
  - every `data-spark="b2c-only"` wrapper (product page buy form and rich text, product-card price and quick add, featured product)
  - the `<spark-product-price>` element on cards
  - the variant metafields `sparklayer.min_order_quantity` and `sparklayer.pack_size`, and the customer metafield `sparklayer.authentication`
  - the "B2B WIDGET CODE" Wholesale Details card
- Customer-tag B2B checks (`customer.tags` containing `b2b` or `B2B`) in main-product, product-card, the layout and the product template's custom-liquid blocks.
- Patched-over code:
  - the recommended-size-range block and the old pink retail Klarna badge, hidden with CSS plus a JS text sweep (`killOldKlarna`, re-run for 15 s)
  - `size-guide-warning`, an empty snippet whose block renders nothing
- The AI-generated B2B login block works but is all inline styles; rebuild it as a normal section.

### 4.10 Gaps the redesign must fix

1. The grid checks the minimum against the product total, while Shopify checks each variant line. Orders the grid allows can therefore be rejected or adjusted in the cart.
2. The grid reads minimum and increment from the first variant only, so different rules per variant are ignored.
3. Volume pricing is never shown: not on the product page, the cards or the cart.
4. Changing variant doesn't update the stepper's min, step or max. The rules are written into the variant JSON (`quantityRule`), but no script reads them.
5. The cart stepper ignores the rules (min 0, step 1) and shows no hint or error text.
6. Nothing shows how many of a variant are already in the cart, which matters for wholesale re-orders.
7. There is no company or location context anywhere, and no way to switch location for multi-location buyers.
8. Errors use `alert()`, and success feedback is only a temporary button label.
9. Grid columns rely on the option names "Color", "Colour" and "Size", so other option names or translations break the layout.
10. The wholesale price is inline-styled and doesn't match the retail price component.
11. There are three different wholesale checks, plus a tag-based product gate that removes cards with JS and causes layout shift.
12. The dress, hand-bag and perfume templates miss the rating pill, delivery list and back-in-stock, so product pages behave differently.
13. On wholesale `row` products, the variant picker under the grid only changes the image, which makes it a redundant control.
14. The wholesale Klarna badge assumes Klarna is offered at B2B checkout (see section 13).

---

## 5. Keep — decisions already approved

These were decided and shipped in August–September 2026. Improve the layout around them, but don't redesign them away.

- **Yellow primary button.** Add to cart is a full-width pill that sits above the Shop Pay button so it outranks it.
  - default: #FBD816 background, #0F1111 text
  - hover: #E8C70F
  - pressed: #D4B50E
  - disabled: #E5E5E5 background, #767676 text
- **Rating pill:**
  - grey pill with a black score badge (gold star), a five-star row, the review count and a chevron
  - shows the store-wide Judge.me score labelled "store reviews", because about 40% of products have no reviews of their own; never says "verified buyers"
  - links to the reviews section on the same page, or to `/pages/reviews`
  - under 430 px the Spanish pill drops the star row; under 340 px every language does
- **Delivery list:**
  - borderless, with a hairline between rows and no card
  - order: Fit, Shipping, Klarna, Notify, Returns; rows disappear when empty
  - Returns is always last, directly above Add to cart
  - no delivery date or arrival window is shown
  - shipping rate and free-shipping threshold follow the visitor's country, and converted amounts are rounded up so the page never quotes less than checkout
- **Mobile sticky bar:**
  - off screen while the real Add to cart is visible or any drawer or menu is open
  - colour and size chips plus stock status
  - Add to cart / Buy now / WhatsApp; in the sold-out state, Remind me + WhatsApp
  - the floating WhatsApp bubble hides while the bar is up
- **Back-in-stock:**
  - full-width Notify button when the selected variant is sold out, otherwise a small bell link with the sold-out count
  - the drawer handles several sold-out variants at once and sends name, phone, email and WhatsApp consent to Wasify
- **One WhatsApp number** for the whole site, from the theme setting.
- **Description clamp** at about 200 characters, with See more / Ver más.
- **Spanish for Spain** in every custom module.
- **Brand fonts:** Cormorant for headings, Jost for body and interface.

---

## 6. Screens to design

### 6.0 Prototype control bar (demo only)

A slim bar pinned above the site, visually separate from the store and labelled "Prototype controls — not part of the store".

| Control | Options |
|---|---|
| Viewing as | Retail guest, Retail signed in, Wholesale (1 location), Wholesale (2 locations), Retail visitor on a wholesale-only product |
| Country | Spain (Spanish copy, EUR), Germany (EUR), United Kingdom (GBP), United States (USD) |
| Product | Row product (colour × size), One-size product, Bag |
| Stock | All in stock, Some low or sold out, Selected variant sold out |
| Volume pricing | On, Off |

### 6.1 Screen list

| ID | Screen | Priority | States to show |
|---|---|---|---|
| S1 | Product page, retail | P1 | Default; low stock; another variant sold out (Notify row with count); selected variant sold out (Notify button, sticky bar "Remind me"); size guide open; back-in-stock drawer open; added to cart (drawer opens); Spanish |
| S2 | Product page, wholesale `row` product | P1 | Empty order; one line below minimum; a value rounded to the pack size; tier reached on a line; stock-capped cell; stock below minimum; untracked stock; variant that doesn't exist; adding; added (drawer opens); a line rejected by Shopify, shown inline; "in cart" counts after adding |
| S3 | Product page, wholesale one-size product | P1 | Stepper at minimum; tier table with the active tier; invalid typed value; in-cart count; version without tiers |
| S4 | Cart drawer, retail and wholesale | P1 | Retail with 2 lines. Wholesale with company and location header, pack image, assorted-pack line, tier label, a line breaking its rule. Empty state for both |
| S5 | Header and location switcher | P1 | Retail; wholesale with one location (chip, no dropdown); wholesale with two locations (dropdown on desktop, bottom sheet on mobile); notice after switching |
| S6 | Collection page | P2 | Retail cards; wholesale cards; sort open; list layout; optional wholesale quick-order drawer from a card |
| S7 | Wholesale-only gate | P2 | English and Spanish |
| S8 | Wholesale sign-in and apply page | P2 | Default |
| S9 | Home | P3 | Retail sections; B2B market sections |
| S10 | Quick order list (optional) | P3 | Every wholesale product in one table grouped by category, with the same cell rules as S2 |
| S11 | Search: predictive panel and results page | P3 | Retail and wholesale prices; voice search button; no results |
| S12 | Product page variants: pre-order, countdown, coming soon | P3 | Pre-order button; countdown timer with sign-up; coming-soon sign-up |
| S13 | Retail quick-add drawer | P3 | Product with options opened from a card; added state |

---

## 7. Component specs

### 7.1 Product page layout

**Retail, desktop.** 12-column grid, max width 1260 px. The gallery spans 7 columns (stacked images) and the buy box 5 columns (sticky).

```
+-------------------------------------------------------------------------------+
| Hand-embroidered by our artisans · Handmade since 1982          ES   EUR      |
| LOGO    Shop  New in  Dresses  Tunics  Outerwear  Bags   Search Account Cart(1)|
+-----------------------------------------+-------------------------------------+
| GALLERY 7/12 (stacked, Stone bg)        | BUY BOX 5/12 (sticky)               |
| +-------------------------------------+ | Leila hand-embroidered long tunic   |
| |                                     | | €79.95   €99.95 (struck)            |
| |              image 1                | | Tax included.                       |
| |                                     | | (4.7 ★ ★★★★★ 1,083 store reviews >) |
| +-------------------------------------+ |                                     |
| +-------------------------------------+ | Colour: Indigo                      |
| |              image 2                | | [sw] [sw] [sw] [sw]                 |
| +-------------------------------------+ | Size: S/M                Size guide |
|                                         | [S/M] [L/XL] [XXL]                  |
|                                         | In stock · ships in 24h             |
|                                         | ----------------------------------- |
|                                         | Fit       Model is 170 cm, S/M      |
|                                         | Shipping  Spain €4.95, free from €69|
|                                         |           [######----] €9.05 to go  |
|                                         | Klarna    3 × €26.65                |
|                                         | Notify    1 option sold out         |
|                                         | Returns   14-day returns            |
|                                         | [- 1 +]  [      Add to cart       ] |
|                                         | [            Shop Pay             ] |
|                                         | + Main features                     |
|                                         | + Description                       |
+-----------------------------------------+-------------------------------------+
| Reviews / You may also like / Recently viewed                                 |
+-------------------------------------------------------------------------------+
```

**Wholesale `row` product, desktop.** The order matrix needs width, so the gallery narrows to 5 columns and the buy box widens to 7. The order summary sticks to the bottom of the buy box.

```
+-------------------------------+-------------------------------------------------+
| GALLERY 5/12                  | BUY BOX 7/12                                    |
| +---------------------------+ | Leila hand-embroidered long tunic               |
| |                           | | €31.50 per piece   Wholesale price              |
| |          image            | | From €28.50 at 48+ pieces   (opens tier table)  |
| |                           | | [Min. 4 per colour and size] [Packs of 2] [Max. 60]
| +---------------------------+ |                                                 |
|                               |              S/M         L/XL        XXL   Total|
|                               | [img] Ecru   [- 0 +]     [- 6 +]     [- 0 +]  6 |
|                               |              42 in stock 18 in stock Low: 6     |
|                               | [img] Indigo [- 4 +]     Sold out    [- 0 +]  4 |
|                               |              Low: 9                  23 in stock|
|                               | [img] Black  [- 0 +]     [- 0 +]     [- 0 +]  0 |
|                               |              Available   Available   Available  |
|                               | [img] Sage   [- 0 +]     Only 3      —        0 |
|                               |              14 in stock below min.  not offered|
|                               | ----------------------------------------------- |
|                               | 10 pieces, 2 lines            Subtotal €315.00  |
|                               | Ecru L/XL rounded to 6 (packs of 2)             |
|                               | [Clear]              [ Add 10 pieces to cart ]  |
+-------------------------------+-------------------------------------------------+
```

**Mobile (both).** Gallery carousel with a "1 / 6" counter, then the buy box. Retail uses the sticky bar from section 5; wholesale replaces it with the order summary bar (7.10).

```
+------------------------------+
| [ gallery            1 / 6 ] |
| Leila hand-embroidered tunic |
| €31.50 per piece             |
| From €28.50 at 48+  >        |
| [Min. 4 per colour and size] |
| [Packs of 2] [Max. 60]       |
| +--------------------------+ |
| | [img] Ecru      6 pcs  ^ | |
| | S/M   42 in stock [- 0 +]| |
| | L/XL  18 in stock [- 6 +]| |
| | XXL   Low: 6      [- 0 +]| |
| +--------------------------+ |
| | [img] Indigo    4 pcs  v | |
| +--------------------------+ |
| | [img] Black     0 pcs  v | |
| +--------------------------+ |
|==============================|
| 10 pcs  €315.00 [Add to cart]|
+------------------------------+
```

### 7.2 Price

- **Retail:**
  - current price in Jost 600 and struck compare-at
  - the tax line follows `cart.taxes_included`
  - Shopify's installments message when present
- **Wholesale:**
  - "€31.50 per piece" with a "Wholesale price" caption, and struck compare-at only when it's higher
  - when tiers exist, a short line "From €28.50 at 48+ pieces" that opens the tier table
  - it is the same component as retail, not a separate inline-styled block
  - a Klarna line for wholesale (price × minimum ÷ 3), controlled by a theme setting (see section 13)

### 7.3 Rating pill

As in section 5. Hidden in wholesale mode.

### 7.4 Colour and size picker

- The colour label shows the selected value ("Colour: Indigo"), and swatches are variant images.
- Size buttons sit in one row, with a "Size guide" link aligned right on the Size label row. It opens a modal with the chart image (full screen on mobile).
- Unavailable options stay selectable so shoppers can reach Notify. They show a diagonal strike plus a text label for screen readers.
- New retail stock line under the picker: "In stock · ships in 24h", "Only a few left" at 8 or fewer, or "Sold out". Retail never sees exact counts.

### 7.5 Delivery list (retail only)

Rows and rules as in section 5; sample values are in section 9.

### 7.6 Retail buy area

- Stepper (compact, left) and yellow Add to cart (fills the rest) on one row.
- Shop Pay button below at full width, then a pickup line only when Shopify has pickup locations.
- Button states: Add to cart, Pre-order, Sold out (disabled), Select a size (disabled), Adding…, Added (drawer opens).
- Errors appear as an inline message above the button, never as `alert()`.
- The backorder note (the theme's existing text) appears when the selected variant has no stock but can still be ordered.
- Gift cards keep the recipient form (recipient email, name, message, send date).

### 7.7 Back-in-stock drawer

Bottom sheet on mobile, centred modal on desktop, with the behaviour in section 5.

### 7.8 Wholesale terms (replaces the Wholesale Details card, the card pill and the grid banner)

Up to three quiet chips under the wholesale price, built only from native rules: "Min. 4 per colour and size", "Packs of 2", "Max. 60".

- Leave out any chip whose rule is the default (min 1, increment 1, no max).
- If rules differ between variants, show "Minimums vary by colour and size" and show each rule in its matrix cell.
- One-size products say "per colour" instead of "per colour and size".

### 7.9 Volume pricing table

- **Rows:** quantity range and price per piece, e.g. "4–23: €31.50", "24–47: €29.90", "48+: €28.50". The first row starts at the rule minimum.
- **Active row:** highlighted from the quantity entered for the selected variant (S3) or the focused cell (S2).
- **Caption:** "Price per piece. The cart shows the final price for each line."
- **Length:** with more than 3 tiers, show 3 and a "Show all" toggle. With no tiers, the component isn't rendered.

### 7.10 Wholesale order matrix (`row` products) — the core wholesale component

**Desktop layout.** Rows are the first option (colours, with thumbnail and name) and columns are the second option (sizes). Each cell is a quantity input with a stepper, and a row-total column sits at the end. Option names always come from the product's own options, never from hard-coded names.

**Cell hint** (one line under the stepper):
- "42 in stock"
- "Low: 6"
- "Sold out"
- "Available" for untracked stock
- "Only 3, below minimum" when stock is under the rule minimum (cell disabled)
- "—" when the variant doesn't exist

After adding, a small "12 in cart" hint appears. When a cell reaches a tier, its tier price appears under it ("€29.90 each").

**Cell behaviour:**
- Plus and minus move by the increment. The first plus jumps from 0 to the minimum, and minus from the minimum goes back to 0.
- Typed values are checked on blur. If the value isn't a multiple of the increment, round up to the next valid value (or down, if up would pass max or stock). Say so under the row: "Ecru L/XL rounded to 6 (packs of 2)".
- Values from 1 to one below the minimum are flagged with a red outline and "Below minimum (4)". The buyer fixes or clears them.
- Plus disables at max or stock, whichever is lower, with a "Max 8" hint.
- Keyboard: arrow keys move between cells, Enter moves to the next cell, and typing replaces the value.

**Order summary.** On desktop it is sticky at the bottom of the buy box; on mobile it is a bar at the bottom of the screen. It contains:
- total pieces, number of lines, and a subtotal built from each line's tier preview
- messages, e.g. "2 lines need attention"
- Clear
- the yellow "Add 10 pieces to cart" button, disabled while any line is invalid or every line is 0

**After adding:**
- the cart drawer opens with the new lines, inputs reset to 0, and cells show "in cart" counts
- if Shopify rejects or adjusts a line, show Shopify's message on that cell and in the summary

**Mobile.** Each colour is a collapsible card (thumbnail, colour, pieces chosen). Inside, each size gets one row with its stock hint and stepper.

**Single-option products** (colour only): the matrix becomes a one-column list.

### 7.11 Wholesale one-size product buy box

Order of elements:
1. wholesale terms chips
2. tier table
3. stepper (starts at the minimum, steps by the increment) with "In cart: 12"
4. live line "6 × €34.00 = €204.00"
5. yellow Add to cart
6. inline errors

A variant change re-renders rules, tiers and the in-cart count from Shopify.

### 7.12 Product card

- **Retail:**
  - image with second image on hover, labels, title, price
  - colour swatches (variant images) and rating
  - an "Add to cart" text button (quick-add drawer for products with options)
- **Wholesale:**
  - same visual frame
  - price as "€31.50 per piece", plus "from €28.50" when tiers exist
  - rule chips (7.8) and a stock hint
  - action "Order sizes", which opens the order matrix in a drawer (P2, optional) or links to the product page
- Wholesale-only products never render for retail visitors, with no empty cells and no layout shift.

### 7.13 Cart drawer

- **Header:** "Cart (3)". Wholesale adds "Ordering for Boutique Luna · Madrid Serrano", with a Change link when there are several locations.
- **Line (retail):** image, title, options, unit price with struck compare-at, stepper, remove, line total.
- **Line (wholesale):**
  - pack image when set, and title
  - options, or "Colours: Coral, Turquoise, White, Navy" for assorted packs (current rule in 4.6)
  - unit price with a tier label when a tier applies ("€32.00 per piece, 36+ price")
  - a stepper that follows the rules, with the hint "Min. 6, packs of 6"
  - an inline error on an invalid line ("40 isn't a multiple of 6. Use 36 or 42.")
  - line total
- **Summary:**
  - subtotal, discounts, tax line, order note, Checkout
  - Shop Pay and accelerated buttons for retail; Shopify decides what appears for wholesale
  - Checkout is disabled, with a message, while any line breaks its rule
- **Empty:** retail shows promoted products; wholesale shows "Your wholesale cart is empty" with links to the catalogue and the quick order list.

```
+--------+----------------------------------------------+
| pack   | Zahra embroidered kaftan                     |
| image  | Colours: Coral, Turquoise, White, Navy       |
|        | €32.00 per piece (36+ price)                 |
|        | [- 36 +]  Min. 6, packs of 6      €1,152.00  |
+--------+----------------------------------------------+
```

### 7.14 Header account and location switcher (wholesale)

- **Desktop:** the account icon becomes a chip, "Boutique Luna · Madrid Serrano ▾". The dropdown contains:
  - "Ordering for", with the company's locations as radio options (current one checked)
  - an optional store credit balance
  - "Account and orders" (Shopify account)
  - "Sign out"
- **One location:** the chip has no dropdown arrow, and clicking it goes to the account.
- **Mobile:** the chip sits at the top of the menu drawer, and switching opens a bottom sheet.
- **After switching:** the page reloads and shows the notice "Prices and availability updated for Valencia Ruzafa."

```
LOGO   Shop  New in  Dresses ...     Search  [ Boutique Luna · Madrid Serrano v ]  Cart(3)
                                             +----------------------------------+
                                             | Ordering for                     |
                                             | (o) Madrid Serrano               |
                                             | ( ) Valencia Ruzafa              |
                                             | Store credit: €150.00            |
                                             | Account and orders               |
                                             | Sign out                         |
                                             +----------------------------------+
```

### 7.15 Wholesale-only products and gate

- **Native visibility first.** On a blended store with Markets, Shopify's documented way to make a product wholesale-only is to publish it to the online store and to the B2B catalogs, then exclude it from every Region catalog. Retail visitors then never see it in grids, search or recommendations, and the theme needs no code for it.
- **Tag fallback.** While a product still carries the `b2b` tag and is visible to retail, the theme skips its card in Liquid (no JS removal, no empty cells).
- **Gate page** for a retail visitor who opens a wholesale-only link that still resolves. It is a centred block with:
  - "Wholesale-only product" and one sentence of explanation
  - Sign in (primary) and "Apply for wholesale access" (secondary)
  - a "Back to the shop" link
  - no breadcrumbs, no product data, and `noindex`
- **404 page** gets one line, "Wholesale customer? Sign in to see trade-only products", so a buyer following an old link still finds the way in.

### 7.16 Wholesale sign-in and apply page

A card with:
- heading and a one-line explanation
- a Sign in button (new customer accounts)
- an "Apply for wholesale access" link to the request form
- a WhatsApp contact line

### 7.17 Reviews, accordions and home

Keep the behaviour described in 4.2 and 4.4, and restyle only. Home shows the retail or B2B market section set depending on the audience.

### 7.18 Other product page blocks that stay available

These exist in today's theme and must remain as blocks in the new product section, even where the current templates don't use them:
- vendor, SKU and barcode line (optional: show SKU to wholesale buyers in the matrix and on cart lines)
- weight and product type
- custom options saved as line-item properties (text, long text, checkbox, dropdown), optionally shown in quick add
- product sign-up form (used by countdown and coming-soon)
- newsletter sign-up
- complementary products
- flash message (over the media or in the info column)
- pop-up link that opens a page in a modal
- image, link button, divider, rich text and custom Liquid blocks
- app blocks

---

## 8. Design direction

This is a starting point. Refine it freely, but keep the approved items in section 5.

**Principles**
- Photography carries the brand, and the interface stays quiet: ink on white, hairlines, generous space.
- There is one primary action per view, and it is always the yellow button.
- Wholesale is the same house in working mode. It keeps the same header, footer, fonts and photography, with denser layouts, aligned numbers and visible rules.
- Every number says what it is (per piece, per line, in cart, total) where it appears.
- States are part of the design. Stock, rules, errors and confirmations are shown inline, never as pop-up alerts.

**Colour**

| Name | Hex | Use |
|---|---|---|
| Ink | #2A2B2A | Text, icons, outlines, secondary buttons |
| Paper | #FFFFFF | Page background |
| Stone | #F4F4F4 | Image backgrounds, quiet panels, matrix header |
| Hairline | #E7E7E7 | Dividers, input borders |
| Thread yellow | #FBD816 | Primary action only (states in section 5) |
| Sale | #AA1155 | Sale context only |

Status colours are always paired with a text label: in stock #15803D, low #B45309, sold out or error #B91C1C. The Klarna row keeps its light pink tint (#FFF5F8).

Proposal: retire the orange accent (#FF580D) and the green and blue label colours. The only colours in the interface would then be yellow for action, magenta for sale, and the status set.

**Type**
- Cormorant 600 is for display, section headings and product titles, never for numbers, prices, labels or buttons.
- Jost 400, 500 and 600 cover body, interface, prices and tables.
- Scale (px): 12, 14, 16 (body), 20, 26, 34, 44. Product title is 34 on desktop and 26 on mobile; price is 20.
- Use sentence case everywhere. Today's grid header, Size Guide modal title and wholesale pill are all caps; drop that.
- Numbers in the matrix, tiers and cart are right-aligned, with tabular figures where the font supports them.

**Shape and space**
- Spacing uses a 4 px base; the buy box rhythm is 16 and 24 px; matrix cells are at least 44 px tall.
- Buttons and inputs are pills (today's 26 px radius), images have square corners, and drawers and sheets keep today's 16 px radius.
- Surfaces are flat. Only drawers, sheets and the location dropdown get a shadow.

**Motion.** Use motion only in answer to an action: drawer open, add-to-cart confirmation, the rounding hint on a cell. Respect reduced motion.

**Avoid:**
- all-caps eyebrow labels
- gradient washes
- identical shadowed cards
- arrows appended to every button
- scattered entrance animations
- emoji in the interface
- alert pop-ups

---

## 9. Sample data (placeholders for the mockup)

**Company (wholesale states C and D).**
- Company: Boutique Luna S.L.
- Buyer: Lucía Márquez
- Locations: Madrid Serrano (current), Valencia Ruzafa
- Store credit (optional state): €150.00

**Product 1: row product (tag `row`).** Leila hand-embroidered long tunic.
- Options: Colour (Ecru, Indigo, Black, Sage) × Size (S/M, L/XL, XXL).
- Retail: €79.95, compare-at €99.95.
- Wholesale: €31.50 per piece. Rules: min 4, increment 2, max 60. Tiers: 24+ at €29.90, 48+ at €28.50.
- Metafields:
  - fabric "Cotton voile"
  - embroidery "Hand-embroidered neckline and cuffs"
  - fit guide "Model is 170 cm, wearing S/M"
  - best suited for "US 8-14, UK/AU 12-18, EU 40-46, IT 44-50"
  - size chart image
- Stock:

| Colour | S/M | L/XL | XXL |
|---|---|---|---|
| Ecru | 42 | 18 | 6 |
| Indigo | 9 | 0 (sold out) | 23 |
| Black | untracked | untracked | untracked |
| Sage | 14 | 3 (below the wholesale minimum) | not offered |

**Product 2: one-size product.** Zahra embroidered kaftan.
- Colours: Coral, Turquoise, White, Navy. One Size.
- Retail: €89.95.
- Wholesale: €34.00 per piece. Rules: min 6, increment 6. Tiers: 36+ at €32.00, 72+ at €30.50.
- Pack image: all four colours folded together.
- Stock: Coral 60, Turquoise 12, White 0 (sold out), Navy 30.

**Product 3: bag.** Nour embroidered tote.
- Colours: Natural, Black. Retail €59.95.
- Wholesale: €22.00, min 3, increment 3, no tiers (the "no tiers" state).
- Stock: Natural 25, Black 7.

**Reviews (placeholders).** Store score 4.7 from 1,083 store reviews. Three short review cards: one "This piece", two from other products with a product pill, one with a photo.

**Shipping rows.** These are the current rules in the delivery list:

| Country | Rate | Free from |
|---|---|---|
| Spain | €4.95 | €69 |
| Germany | €4.95 | €99 |
| United Kingdom | £4.95 | £99 |
| United States | $4.95 | $99 |

**Retail cart.** Before adding, the cart holds 1 × Nour tote Natural (€59.95), so Spain shows "€9.05 to go" for free shipping. After adding the tunic the subtotal is €139.90 and the shipping row reads Free.

**Wholesale cart.**

| Line | Qty | Price | Line total |
|---|---|---|---|
| Zahra Coral | 36 | €32.00 (36+ tier) | €1,152.00 |
| Leila Ecru L/XL | 6 | €31.50 | €189.00 |
| Leila Indigo S/M | 4 | €31.50 | €126.00 |
| **Subtotal** | | | **€1,467.00** |

Error state: Zahra Navy × 40, which isn't a multiple of 6.

---

## 10. Copy deck (EN / ES)

| Key | English | Spanish | Already in theme |
|---|---|---|---|
| Add to cart | Add to cart | Añadir al carrito (sticky bar: Añadir) | EN yes; ES sticky bar only |
| Buy now | Buy now | Comprar ya | yes |
| Remind me | Remind me when in stock | Avísame cuando vuelva | yes |
| In stock | In stock · ships in 24h | En stock · sale en 24h | yes |
| Low stock | Only a few left | Quedan pocas | ES only |
| Sold out | Sold out | Agotado | yes |
| Size guide | Size guide | Guía de tallas | EN only |
| Store reviews | store reviews | reseñas de la tienda | yes |
| See more | See more | Ver más | yes |
| Shipping to | Shipping to {country} | Envío a {country} | ES yes |
| Free shipping from | Free shipping from {amount} | Envío gratis a partir de {amount} | ES yes |
| Free | Free | Gratis (today: GRATIS) | ES yes |
| Returns | 14-day returns | Devoluciones en 14 días | EN similar |
| Wholesale price | Wholesale price | Precio mayorista | no |
| Per piece | per piece | por unidad | no |
| Minimum | Min. {n} per colour and size | Mín. {n} por color y talla | no |
| Packs | Packs of {n} | Packs de {n} | no |
| Maximum | Max. {n} | Máx. {n} | no |
| Tiers | Volume pricing | Precios por volumen | no |
| From tier | From {price} at {n}+ pieces | Desde {price} a partir de {n} unidades | no |
| In cart | {n} in cart | {n} en el carrito | no |
| Add pieces | Add {n} pieces to cart | Añadir {n} unidades al carrito | no |
| Below minimum | Below minimum ({n}) | Por debajo del mínimo ({n}) | no |
| Rounded | Rounded to {n} (packs of {m}) | Redondeado a {n} (packs de {m}) | no |
| Not a multiple | {n} isn't a multiple of {m}. Use {a} or {b}. | {n} no es múltiplo de {m}. Usa {a} o {b}. | no |
| Stock below minimum | Only {n}, below minimum | Solo {n}, por debajo del mínimo | no |
| Ordering for | Ordering for {company} · {location} | Pedido para {company} · {location} | no |
| Location updated | Prices and availability updated for {location} | Precios y disponibilidad actualizados para {location} | no |
| Gate title | Wholesale-only product | Producto exclusivo para mayoristas | yes |
| Gate text | This product is reserved for B2B customers. Please log in with your wholesale account to view it. | Este producto está reservado para clientes B2B. Inicia sesión con tu cuenta mayorista para verlo. | yes |
| Sign in | Log in | Iniciar sesión | yes |
| Apply | Apply for wholesale access | Solicitar acceso mayorista | no |
| Empty wholesale cart | Your wholesale cart is empty | Tu carrito mayorista está vacío | no |

---

## 11. Build hand-off: Liquid sources

| UI element | Liquid or source |
|---|---|
| Wholesale mode | `customer.b2b?` |
| B2B market sections | `localization.market.handle == 'b2b-wholesale'` and the `*.context.b2b-wholesale.json` templates |
| Company | `customer.current_company.name` |
| Current location | `customer.current_location.name` |
| Location list and switching | `customer.company_available_locations`, each with `name`, `current?` and `url_to_set_as_current` |
| Store credit (optional) | `customer.current_location.store_credit_account` (nil when there is none) |
| Price per piece | `variant.price` (the catalog price for wholesale buyers) |
| Compare-at | `variant.compare_at_price` |
| Quantity rules | `variant.quantity_rule.min`, `.max`, `.increment` |
| Tiers | `product.quantity_price_breaks_configured?` and `variant.quantity_price_breaks` (`minimum_quantity`, `price`) |
| In cart | the `item_count_for_variant` filter on `cart`, with the variant id |
| Stock | `variant.inventory_management`, `.inventory_policy`, `.inventory_quantity`, `.available` |
| Row product | product tag `row` |
| Wholesale-only product | product tag `b2b`, or publish the product only to the B2B catalog |
| Pack image | `product.metafields.custom.pack_image` |
| Size chart | `product.metafields.custom.size_chart` |
| Fit row | `product.metafields.custom.fit_guide`, `custom.best_suited_for` |
| Main features | `shopify.fabric`, `custom.embroidery`, `shopify.color-pattern`, `shopify.size` |
| Store rating | `shop.metafields.judgeme.all_reviews_rating`, `all_reviews_count` |
| Product rating | `product.metafields.reviews.rating`, `rating_count` |
| Review cards | `shop.metafields.judgeme.reviews_grid` |
| Back-in-stock | Wasify `POST /api/stock/subscribe` (payload shape is fixed by the backend) |
| WhatsApp | `settings.social_whatsapp_url` only; remove the number hard-coded in the layout and in the size-help link |
| Add to cart | `/cart/add.js` with `items[]`; refresh the cart and product info through the Section Rendering API |

**Build notes**
- On variant change, re-render the product info with the Section Rendering API so rules, tiers, stock and in-cart counts come from Shopify.
- Test wholesale values signed in as a real company contact on the published theme's preview. A Shopify community report describes some preview setups returning default rules and no tiers for B2B buyers.
- Keep block order in sync across `product.json` and every `product.context.*.json`.
- Move the dress, hand-bag and perfume templates onto the main product layout.
- Optional: move the delivery list's country rules out of the hard-coded string in `gn-shipping-bar` into a theme setting, so they can be updated without code when shipping changes.

**Shopify documentation used**
- Support B2B customers in your theme (location picker, `customer.b2b?`, company and location objects): https://shopify.dev/docs/storefronts/themes/pricing-payments/b2b
- `company_location` Liquid object: https://shopify.dev/docs/api/liquid/objects/company_location
- Displaying quantity rules and volume pricing in a theme: https://help.shopify.com/en/manual/b2b/theme-code/quantity-pricing
- Quantity rules and volume pricing in catalogs: https://help.shopify.com/en/manual/b2b/catalogs/quantity-pricing
- B2B catalogs with Markets, including wholesale-only products: https://help.shopify.com/en/manual/b2b/markets/catalogs
- B2B checkout, payment methods and payment terms: https://help.shopify.com/es/manual/b2b/checkout-and-orders

---

## 12. Mockup acceptance checklist

- [ ] The control bar switches audience, country, product, stock scenario and tiers on every screen.
- [ ] Retail product page:
  - [ ] rating pill sits under the price
  - [ ] delivery-list rows drop out when empty, and Returns sits directly above Add to cart
  - [ ] the yellow button sits above Shop Pay
  - [ ] no delivery dates are shown
- [ ] The wholesale product page hides the rating pill, delivery list, back-in-stock and retail sticky bar.
- [ ] The wholesale price reads "per piece". Tiers, rule chips and in-cart counts appear only when data exists.
- [ ] The matrix:
  - [ ] validates each variant line
  - [ ] explains rounding and errors inline
  - [ ] covers sold-out, not-offered, untracked and below-minimum stock cells
- [ ] Mobile wholesale uses colour cards and a sticky order summary.
- [ ] Wholesale cart lines show rules, tier label, pack image, assorted-pack colours and inline errors, and the header shows company and location.
- [ ] The location switcher appears only with two or more locations.
- [ ] Gate page and sign-in page exist in English and Spanish.
- [ ] Nothing from section 4.9 appears: no SparkLayer, BSS, customer tags or hidden legacy blocks.
- [ ] Keyboard, focus, contrast and reduced motion are checked.
- [ ] Every row of section 14 that names a screen is visible in the prototype.

---

## 13. Checked against Shopify documentation

| Question | What the documentation says | What the new theme does |
|---|---|---|
| Are quantity rules per variant? | Yes. Minimum, maximum and increment are set per variant, or for all variants of a product at once, and Shopify checks them again at checkout. | Validate each line. Every non-zero line must reach the variant minimum, so a valid order always meets the old grid's product minimum when the variants share one rule. The old check isn't lost. |
| How do volume prices relate to the rules? | Break quantities must be above the minimum and multiples of the increment. Once a product has volume pricing, its price is fixed and the catalog's overall adjustment no longer applies. | Show breaks exactly as Shopify returns them; never calculate prices. |
| How do multi-location buyers switch location? | Show the current company and location, and when there are two or more locations list the others, each linking to `url_to_set_as_current`. | Location chip and switcher (7.14). |
| Can a product be wholesale-only without an app? | Yes: publish it to the online store and the B2B catalogs, and exclude it from every Region catalog. | Native visibility first, with the tag fallback and gate kept (7.15). |
| Is Klarna offered at B2B checkout? | The B2B checkout docs don't name Klarna. Payment methods can be set up differently for B2B and D2C buyers. | Keep the wholesale Klarna line behind a theme setting, on by default as today. Turn it off if a test wholesale checkout doesn't offer Klarna. |

**Still to confirm in the store (documentation can't answer these):**
1. Place one test wholesale checkout and check whether Klarna appears; this decides the setting above.
2. The "Apply for Access" link points to `bn2b-request-form` while the template is named `b2b-request-form`. Confirm the page handle.

---

## 14. Feature parity register — nothing from the current theme is lost

Status meanings:
- **Keep** — same behaviour, new styling.
- **Improve** — same job, better behaviour.
- **New** — didn't exist.
- **Remove** — only duplicates and legacy leftovers.

"In mockup" names the screen from section 6 where it must appear; "No" means it stays in the build but needs no mockup screen.

### 14.1 Global and layout

| Feature | Today | New theme | In mockup |
|---|---|---|---|
| Announcement bar with rotating messages, country and language selectors | On | Keep | Yes |
| Sticky header, logo, centred menu, mega menus (column, button and sidebar types), optional CTA button and quick links | On (sidebar mega menu) | Keep | Yes |
| Predictive search with price and vendor, rotating placeholders, voice search button | On | Keep; wholesale buyers see their catalog prices | S11 |
| Account icon | On | Improve: wholesale chip with company, location and switcher | S5 |
| Cart drawer, count bubble, cart icon shake on add | On | Keep | S4 |
| Floating WhatsApp bubble, hidden on the onboarding page | On | Keep; number from the theme setting | Yes |
| Wholesale-only gate with noindex and login prompt (EN/ES) | On | Improve: native catalog visibility, tag fallback, gate, 404 line | S7 |
| Breadcrumbs on collection pages | On | Keep | Yes |
| Tag Manager, Clarity, Facebook and Google verification tags | On | Keep (drop the duplicate Google tag) | No |
| 8 languages, RTL support, market-specific templates | On | Keep | ES and EN |
| Link preloading, lazy-loaded images | On | Keep | No |
| Footer menus, text and socials block, newsletter, payment icons, back to top, Follow on Shop option, selectors | On | Keep | Yes |
| Email pop-up, age-verification pop-up, theme free-shipping notice | Off | Keep as options | No |

### 14.2 Home

| Feature | Today | New theme | In mockup |
|---|---|---|---|
| Retail section set (hero, marquee, New in, categories, outerwear, craft story, holiday, brand video, trust strip) | On | Keep | S9 |
| B2B market section set (video, tiles, story, jackets, slideshow) | On for the B2B market | Keep | S9 |

### 14.3 Collections and cards

| Feature | Today | New theme | In mockup |
|---|---|---|---|
| Collection banner with title, count and description | On | Keep | S6 |
| 50 products per page, grid/list toggle, sorting | On | Keep | S6 |
| Filters | Off | Keep as option | No |
| Promo tiles inside the grid (wide, media, card, filter) | Available | Keep | No |
| Seasonal collection templates; flash sale with countdown, promo strip and collection list | On | Keep | No |
| Product compare (card checkbox, drawer, up to 5) | Available | Keep | No |
| Retail quick add and quick-add drawer | On | Keep | S13 |
| Card: hover image, variant-image swatches, rating, labels, highlight style | On | Keep | S6 |
| Wholesale card note (minimum, pack) | SparkLayer data | Improve: native rule chips and "from" tier price | S6 |
| Hiding wholesale-only products from retail | Tag + JS | Improve: native catalogs, tag fallback in Liquid | S6 |

### 14.4 Product page

| Feature | Today | New theme | In mockup |
|---|---|---|---|
| Gallery: stacked layout, thumbnails, lightbox (mobile too), hover-zoom option, media grouped by colour, looping video, 3D and AR models | On | Keep | S1 |
| Variant-aware labels | On | Keep | S1 |
| Title with optional weight; vendor, SKU, barcode and product type blocks | Partly off | Keep as blocks (7.18) | Title only |
| Retail price, tax note, Shop Pay Installments message | On | Keep | S1 |
| Wholesale price | Inline-styled | Improve: same component, per piece, tiers | S2, S3 |
| Rating pill (store score) | On | Keep (approved) | S1 |
| Variant picker: swatches, buttons or dropdown, availability, URL update, first-variant setting | On | Keep | S1 |
| Size guide modal (metafield image or page) | On | Keep | S1 |
| "This size is ideal for" block | Hidden duplicate | Remove; the Fit row covers it | — |
| Delivery list: fit, shipping and free-shipping progress per country, Klarna, notify, returns | On (retail) | Keep (approved) | S1 |
| Back-in-stock drawer (Wasify) | On (retail) | Keep (approved) | S1 |
| Retail stock line | Sticky bar only | Improve: also under the picker | S1 |
| Backorder note | On | Keep | S1 |
| Inventory urgency bar block | Off | Keep as option | No |
| Quantity, yellow Add to cart, pre-order label, Shop Pay button, pickup availability | On | Keep (approved button) | S1 |
| Gift card recipient form | Available | Keep | No |
| Mobile sticky bar | On (retail) | Keep (approved) | S1 |
| Theme's own sticky Add to cart prompt | Off | Replaced by the mobile sticky bar | — |
| Custom options as line-item properties | Available | Keep (7.18) | No |
| Product sign-up and newsletter sign-up blocks | Used on countdown, coming soon, pre-order | Keep | S12 |
| Complementary products, flash message, page pop-up, image, link, divider, rich text, custom Liquid and app blocks | Available | Keep (7.18) | No |
| Main features, Description with See more, Returns accordions | On | Keep | S1 |
| Share buttons | On | Keep | S1 |
| Wholesale Details card | SparkLayer data | Improve: native rule chips (7.8) | S2, S3 |
| Wholesale bulk-order grid | On (`row` products) | Improve: order matrix (7.10) | S2 |
| Wholesale Klarna line | On (`row` products) | Keep behind a setting (section 13) | S2 |
| Wholesale quantity rules on the stepper | First load only | Improve: updates on variant change, shows in-cart count | S3 |
| Volume pricing | Not shown | New: tier table and tier previews | S2, S3 |
| GN reviews section | On | Keep | S1 |
| You may also like, Recently viewed | On | Keep | S1 |
| Product details tabs, feature hotspots, comparison grid sections | Available | Keep | No |
| Default, dress, hand-bag and perfume templates | On | Improve: one layout for all | S1 |
| Pre-order, countdown and coming-soon templates | On | Keep | S12 |
| Market overrides (B2B, rest of world) | On | Keep, with one shared block order | — |
| Product structured data (SEO) | On | Keep | No |

### 14.5 Cart

| Feature | Today | New theme | In mockup |
|---|---|---|---|
| Drawer: summary position, sticky footer, order note, View cart link, accelerated buttons, Checkout | On | Keep | S4 |
| Terms checkbox, shipping calculator, media promotion | Off | Keep as options | No |
| Promoted products in the empty cart | On (no products assigned) | Keep | S4 |
| Cart page | On | Keep | No |
| Line details: discounts, properties, selling plan name, backorder note, optional vendor and weight | On | Keep | S4 |
| Wholesale pack image | On | Keep | S4 |
| Wholesale assorted-pack colour display | On | Keep | S4 |
| Quantity rules, hints and errors on cart lines | Missing | New | S4 |
| Company and location in the cart header | Missing | New | S4 |

### 14.6 Pages and other templates

| Feature | Today | New theme | In mockup |
|---|---|---|---|
| Wholesale sign-in page | AI-generated block | Improve: normal section | S8 |
| Wholesale request form (Shopify Forms) | On | Keep | No |
| Wholesale onboarding landing (Klaviyo form, Judge.me carousel) | On | Keep | No |
| Reviews wall page | On | Keep | No |
| Contact (form and store location), FAQ, About, Lookbook, Perfume and Summer dress landings, policy pages, custom payment page, coming-soon page, shipping calculator page | On | Keep content and sections | No |
| Blog and articles with comments | On | Keep | No |
| Search page with sorting, filters option, articles and pages | On | Keep | S11 |
| 404, password and gift card pages | On | Keep; 404 gets the wholesale sign-in line | No |
| Classic customer-account templates | Unused (new customer accounts) | Keep untouched as fallback | No |
| Section library: slideshow, banners, video, media with text, multi-column, icons, logos, testimonials, promo grid and strip, scrolling banner, countdown, collection list, featured collection and product, product list, link lists, rich text, newsletter, contact form, navigation slideshow, shoppable image, media grid, FAQ | Available | Keep all | No |

### 14.7 Removed on purpose (not features)

The following are removed; all are listed in 4.9:
- SparkLayer markup and metafields
- the BSS search template
- customer-tag B2B checks
- the CSS and JS patches that hide legacy blocks (`killOldKlarna`)
- the empty `size-guide-warning` snippet
