# Weft — feature map

Every row of brief §14, BUILD_SPEC §5.6 (Theme Store required features) and VERTICALS.md mapped to the Weft files and settings that implement it. The editor inventory (live sections, blocks and settings) is mapped item by item in `migration-map.md`.

Status: `planned` (P0) → `built` (with phase) → `verified` (scenario or check that proves it). Phase column = where it's built.

## 1. Brief §14.1 Global and layout

| Feature | Weft implementation | Phase | Status |
|---|---|---|---|
| Announcement bar, rotating messages, country + language selectors | `sections/announcement-bar` (`_announcement` blocks via theme blocks `text`), `snippets/localization-form` | P1 | done |
| Sticky header, logo, centred menu, mega menus (column, button, sidebar), CTA button, quick links | `sections/header` (settings: sticky, logo, menu, menu alignment, quick-links menu, CTA), `blocks/_mega-menu` (style: columns / buttons / sidebar), panels deferred in `<template>`; `assets/header.js` | P1 | done |
| Predictive search with price and vendor, rotating placeholders, voice search | `sections/search-drawer`, `sections/predictive-search` (rendered via `/search/suggest`), `assets/search.js` (ARIA combobox, SKU / tag fields, type filter); settings group Search | P4 (shell P1) | done |
| Account icon → wholesale chip with company, location, switcher | `sections/header` + `snippets/location-list` + `sections/location-sheet`; `<shopify-account>` component | P1/P3 | done |
| Cart drawer, count bubble, cart icon shake on add | `sections/cart-drawer`, `sections/cart-count` (section for Cart API refresh), `assets/cart.js`; setting `cart_shake` | P1/P4 | done |
| Floating WhatsApp bubble, hidden on the onboarding page, number from setting | `snippets/chat-button` in `layout/theme.liquid`; settings `social_whatsapp_url`, `chat_button_enable`, `chat_button_hide_on` (page handles) ; pre-filled with page URL | P1 | done |
| Wholesale-only gate with noindex and login prompt | Native catalogs first; tag fallback `settings.wholesale_only_tag`; `snippets/wholesale-gate`, `main-product` gate state, `noindex` in `theme.liquid`; 404 line in `main-404` | P3 | done |
| Breadcrumbs | `snippets/breadcrumbs`, settings per page type | P1/P4 | done |
| Tag Manager, Clarity, Facebook + Google verification | Core: Custom code & tracking group (`custom_code_head`, `custom_code_body`, loading modes, consent). Pilot: `integration-tracking` snippet + store config values (duplicate Google tag dropped) | P1/P6 | partial |
| 8 languages, RTL, market-specific templates | `locales/*` ×8, schema locales en/es, logical CSS, context templates | P1/P6 | partial |
| Link preloading, lazy images | setting `preload_links` (hover/touch prefetch that defers to Shopify's own speculation rules — verify P1), `snippets/image` | P1 | done |
| Footer menus, text + socials, newsletter, payment icons, back to top, Follow on Shop, selectors | `sections/footer` with `_footer-column`, `_footer-text` (Follow on Shop via `login_button`), `_footer-newsletter`; `snippets/payment-icons` (`shop.enabled_payment_types`) | P1 | done |
| Email pop-up, age verification pop-up, free-shipping notice (off) | `sections/popup` (mode: newsletter / age verification / promo), cart free-shipping bar setting | P5 | done |

## 2. Brief §14.2 Home

| Feature | Weft implementation | Phase | Status |
|---|---|---|---|
| Retail home set (hero, marquee, New in, categories, outerwear, craft story, holiday, video, trust strip) | `templates/index.json` built from `image-banner`, `scrolling-banner`, `featured-collection`, `collection-list`, `media-with-text`, `video`, `icons-with-text`; pilot content in `store-configs/ibban/templates/index.json` | P5/P7 | planned |
| B2B market home set | `store-configs/ibban/templates/index.context.b2b-wholesale.json` (documented example `templates/index.context.b2b-wholesale.json` omitted from the Theme Store package) | P5/P7 | planned |

## 3. Brief §14.3 Collections and cards

| Feature | Weft implementation | Phase | Status |
|---|---|---|---|
| Banner with title, count, description | `sections/collection-banner` | P4 | done |
| 50 per page, grid/list toggle, sorting | `sections/main-collection` (products_per_page up to 50, layout toggle, sort options) | P4 | done |
| Filters (off in pilot, on by default in Weft) | `snippets/facets`, `assets/facets.js`, setting `enable_filtering` | P4 | done |
| Promo tiles in grid (wide, media, card, filter) | section blocks `promo_wide` / `promo_media` / `promo_card` / `promo_filter` in `main-collection`, `snippets/collection-promo` (owner review 20) | P4 | done |
| Seasonal templates, flash sale with countdown + promo strip + collection list | `templates/collection.banner.json`, `collection.flash-sale.json` | P5 | done |
| Product compare (checkbox, drawer, up to 5) | `sections/compare-drawer`, `assets/compare.js`, Product compare group | P4 | done |
| Retail quick add + drawer | `sections/quick-add`, `assets/quick-add.js` | P2 | done |
| Card: hover image, swatches, rating, labels, highlight | `snippets/product-card` (swatches inline; second image or slideshow on hover) | P4 | done |
| Wholesale card note → rule chips + from price | `snippets/product-card` wholesale branch + `snippets/rule-chips` | P3 | done |
| Hide wholesale-only products from retail | native catalogs; tag fallback skip in Liquid (no JS, no empty cells) | P3/P4 | done |

## 4. Brief §14.4 Product page

| Feature | Weft implementation | Phase | Status |
|---|---|---|---|
| Gallery: stacked, thumbnails, lightbox (mobile too), hover zoom, media grouped by colour, looping video, 3D/AR | `main-product` gallery + `assets/gallery.js`; settings: layout, ratio, zoom mode, lightbox on mobile, grouping option name | P2 | done |
| Variant-aware labels | `blocks/product-labels` | P2 | done |
| Title with optional weight; vendor, SKU, barcode, type | `blocks/product-title` (show weight), `blocks/product-meta` | P2 | done |
| Retail price, tax note, Shop Pay Installments | `blocks/product-price` (`form 'product'` + `payment_terms`) | P2 | done |
| Wholesale price (same component, per piece, tiers) | `blocks/product-price` wholesale branch | P3 | done |
| Rating pill (store score) | `blocks/product-rating` (score/count settings accept dynamic sources: shop metafield for pilot; product `reviews.rating` default) | P2 | done |
| Variant picker: swatches, buttons, dropdown, availability, URL update, first-variant setting | `blocks/variant-picker`, `assets/product.js` | P2 | done |
| Size guide modal (metafield image or page) | `blocks/product-guide` + link in picker | P2 | done |
| "This size is ideal for" | Removed (Fit row covers it) | — | n/a |
| Delivery list | `blocks/delivery-list` + Delivery information / Installments groups | P2 | done |
| Back-in-stock drawer | `blocks/back-in-stock` (core: contact form), `integration-back-in-stock` (Wasify) | P2/P6 | partial |
| Retail stock line | `blocks/stock-line` | P2 | done |
| Backorder note | `blocks/buy-buttons` (`show_backorder_note`) | P2 | done |
| Inventory urgency bar (off) | `blocks/stock-line` option `show_bar` (real inventory only) | P2 | done |
| Quantity, yellow Add to cart, pre-order label, Shop Pay, pickup | `blocks/buy-buttons`, `sections/pickup-availability` (rendered via `/variants/:id/?section_id=`) | P2 | done |
| Gift card recipient form | `blocks/buy-buttons` (`gift_card_recipient`) | P2 | done |
| Mobile sticky bar | `main-product` static part + `assets/sticky-bar.js` | P2 | done |
| Custom options as line-item properties | `blocks/custom-option` | P2 | done |
| Product sign-up and newsletter sign-up blocks | `blocks/product-signup`, `blocks/email-signup` | P2 | done |
| Complementary, flash message, page pop-up, image, link, divider, rich text, custom Liquid, app blocks | `blocks/complementary-products`, `flash-message`, `popup-link`, `image`, `button`, `divider`, `text`, `custom-liquid`, `@app` | P2 | done |
| Main features, Description with See more, Returns accordions | `blocks/specifications`, `blocks/description`, `blocks/collapsible` | P2 | done |
| Share | `blocks/share` | P2 | done |
| Wholesale Details card → rule chips | `blocks/wholesale-terms` | P3 | done |
| Bulk-order grid → order matrix | `blocks/order-matrix`, `assets/matrix.js`, `assets/rules.js` | P3 | done |
| Wholesale Klarna line (setting) | `blocks/installments-note` + `settings.wholesale_installments` | P3 | done |
| Wholesale rules on stepper, updates on variant change, in-cart count | `blocks/wholesale-quantity` + Section Rendering | P3 | done |
| Volume pricing | `blocks/volume-pricing` | P3 | done |
| Reviews section | `sections/product-reviews` (core) / `integration-reviews-grid` (pilot) | P2/P6 | partial |
| You may also like, Recently viewed | `sections/product-recommendations`, `sections/recently-viewed` | P2 | done |
| Product details tabs, feature hotspots, comparison grid | `sections/product-details` (+ `product-tabs`, `highlight-text`, `payment-methods` blocks), `product-hotspots`, `product-comparison-grid` | P5 | done |
| One layout for all templates | `main-product` for every product template | P2 | done |
| Pre-order, countdown, coming-soon | `templates/product.preorder|countdown|coming-soon.json` | P2 | done |
| Market overrides with one block order | context templates share `product.json` block order; P7 migration checks it | P7 | planned |
| Product structured data | `main-product` JSON-LD (`product | structured_data`) | P2 | done |

## 5. Brief §14.5 Cart

| Feature | Weft implementation | Phase | Status |
|---|---|---|---|
| Drawer: summary position, sticky footer, note, View cart, accelerated buttons, Checkout | `sections/cart-drawer`, `snippets/cart-summary` | P4 | done |
| Terms checkbox, shipping calculator, media promotion | cart-drawer + main-cart settings | P4 | done |
| Promoted products in empty cart | cart-drawer `promoted_products` | P4 | done |
| Cart page | `sections/main-cart` | P4 | done |
| Line details: discounts, properties, selling plan, backorder, vendor, weight | `snippets/cart-line` | P4 | done |
| Wholesale pack image | `snippets/cart-line` (pack image setting accepts a product metafield key; pilot `custom.pack_image`) | P4 | done |
| Wholesale assorted-pack colours | `snippets/cart-line` (rule: one-size product that is neither matrix nor excluded type lists all option-1 values; exclusion list setting, pilot excludes bags) | P4 | done |
| Rules, hints and errors on lines | `snippets/cart-line` + `assets/cart.js` + `rules.js` | P4 | done |
| Company and location in cart header | `sections/cart-drawer`, `main-cart` | P4 | done |

## 6. Brief §14.6 Pages and templates

| Feature | Weft implementation | Phase | Status |
|---|---|---|---|
| Wholesale sign-in page | `sections/wholesale-access`, `templates/page.wholesale-access.json` | P3 | done |
| Request form (Shopify Forms app) | `templates/page.wholesale-request.json` with `apps` section | P3 | done |
| Onboarding landing (Klaviyo, Judge.me) | pilot: `store-configs/ibban` page template with `custom-liquid` content moved unchanged | P7 | planned |
| Reviews wall | core: `page.reviews.json` (testimonials + app blocks); pilot: `integration-reviews-wall` | P5/P6 | partial |
| Contact, FAQ, About, Lookbook, landings, policies, custom payment, coming soon, shipping calculator | page templates in §2 of architecture | P5 | done |
| Blog and articles with comments | `main-blog`, `main-article` (comments paginated, success/error) | P5 | done |
| Search page (sort, filters, articles, pages) | `main-search`, `templates/search.json` | P4 | done |
| 404, password, gift card; 404 wholesale sign-in line | `main-404`, `main-password`, `gift_card.liquid` | P1/P3 | done |
| Classic customer-account templates | `templates/customers/*` minimal, untouched fallback | P5 | done |
| Section library | architecture §2 list | P5 | done |

## 7. BUILD_SPEC §5.6 Theme Store required features

| Requirement | Weft implementation | Phase | Status |
|---|---|---|---|
| `<shopify-account>` in header, desktop + mobile | `sections/header` | P1 | done |
| Follow on Shop (`login_button`, unmodified colours) | `_footer-text` block + `main-password` | P1 | done |
| Unit pricing on collection, product, cart | `snippets/price`, `product-price`, `cart-line` | P2/P4 | done |
| Selling plans on product; plan name in cart | `purchase-options`, `cart-line` | P2/P4 | done |
| Shop Pay Installments banner | `product-price` (`payment_terms` in product form) | P2 | done |
| Accelerated checkout on product and cart, on by default | `buy-buttons`, `cart-summary` (`content_for_additional_checkout_buttons`) | P2/P4 | done |
| Faceted filtering on collection + search | `snippets/facets` | P4 | done |
| Cart discounts per item and per order | `cart-line`, `cart-summary` | P4 | done |
| Pickup availability; related + complementary recommendations | `buy-buttons`, `product-recommendations`, `complementary-products` | P2 | done |
| Newsletter forms and multi-level menus | `newsletter`, `email-signup`, header 3-level menus | P1/P5 | done |
| Image focal points; `page_image` for social | `snippets/image` (`image.presentation.focal_point`), `snippets/meta-tags` | P1 | done |
| Country/language selectors per UX guidelines | `snippets/localization-form` | P1 | done |
| Gift card template, contact page template | `gift_card.liquid`, `page.contact.json` | P1/P5 | done |
| Cart page line + totals requirements | `main-cart` | P4 | done |
| Blog and article requirements | `main-blog`, `main-article` | P5 | done |

## 8. VERTICALS.md

| Feature | Weft implementation | Phase | Status |
|---|---|---|---|
| Product guide (image or table) | `blocks/product-guide` (image, page, rich text, metaobject-free table via rich text) | P2 | done |
| Highlights | `blocks/highlights` (`_highlight`) | P6 | done |
| Attribute chips | `blocks/attribute-chips` | P6 | done |
| Ingredients (key + INCI) | `blocks/ingredients` (`_ingredient`) | P6 | done |
| How to use | `blocks/how-to-use` (`_step`) | P6 | done |
| Badges | `blocks/badges` (`_badge`) | P6 | done |
| Tabs / accordions | `blocks/collapsible`, `blocks/product-tabs`, `sections/product-details` | P2/P5 | done |
| Unit price | `product-price` | P2 | done |
| Purchase options | `blocks/purchase-options` | P2 | done |
| Complete the look / routine / ritual | `blocks/complementary-products` (heading per preset) | P2 | done |
| Guided finder | `sections/guided-finder` (links to filtered collection URLs only) | P6 | planned |
| Before/after slider | `sections/before-after` (keyboard + touch) | P6 | planned |
| Steps / routine | `sections/routine-steps` (optional product per step) | P6 | planned |
| Shop the look (hotspots) | `sections/shoppable-image` | P5 | done |
| Quick order list | `sections/quick-order-list` (reuses `<order-matrix>` from `assets/matrix.js`), `templates/page.quick-order.json`; quick order drawer from wholesale cards (`sections/quick-add`, setting `wholesale_quick_order_drawer`) | P3 | done |
| Order matrix (any two options) | `blocks/order-matrix` | P3 | done |
| Shade swatches | `variant-picker` swatches (swatch images / standard colour metaobject `shopify.color-pattern` swatch) | P2 | done |
| Scent notes | `blocks/scent-notes` | P6 | planned |
| Warnings and precautions | `blocks/collapsible` preset "Warnings" | P6 | planned |
| Period after opening icon | `blocks/pao-icon` | P6 | done |
| Gift message line-item property | `blocks/gift-message` | P6 | planned |
| Gift sets list components (bundles) | `cart-line` + product block reads `product.metafields` / bundle components via `item.item_components` (*verify P6*) | P6 | planned |
| Ingredient spotlight | `sections/ingredient-spotlight` | P6 | planned |
| "For professionals" banner | `image-banner` preset linking to wholesale sign-in page | P6 | planned |
| Gift guide | `featured-collection` preset "Gift guide" | P6 | planned |
| Professional-only products, testers | native catalogs (no code) + tag fallback + scenario 19 | P3/P6 | partial |
| Case packs (increment 6/12), volume tiers | quantity rules (native) — matrix, stepper, cart | P3 | done |
| Link to order history in customer account | `quick-order-list` + account links (`routes.account_url`) | P3 | done |
| Filters showcase (hair type, concern, size, price, availability) | demo store Search & Discovery setup (`demo-content/tress/`) | P8 | planned |
