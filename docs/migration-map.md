# Weft — migration map (live theme → Weft)

Source: `reference/live-theme/` (Enterprise 2.0.1) and `reference/brief/live-theme-editor-inventory.md`. First version written in P0; Weft setting IDs are final from P1 onwards and changes are recorded here. `scripts/migration-map.json` (P7) is generated from these tables and must stay in sync.

Legend: **=** same ID kept · **→** renamed · **⊕** merged into another setting/section/block · **✕** removed on purpose (brief §4.9 or duplicate) · **store** value moves to `store-configs/ibban/` rather than a theme setting.

---

## 1. Global settings (`config/settings_schema.json`)

### 1.1 Colors (41) → colour schemes + global accents

Weft uses `color_scheme_group` with these roles per scheme: `background`, `background_gradient`, `text`, `heading`, `muted`, `surface`, `line`, `link`, `button_bg`, `button_text`, `button_hover`, `button_secondary_bg`, `button_secondary_text`. Default schemes: `scheme-1` Page, `scheme-2` Panel, `scheme-3` Inverse, `scheme-4`/`scheme-5`/`scheme-6` Accents, `scheme-7` Drawer.

| Live | Weft | Note |
|---|---|---|
| `bg_color` | → `scheme-1.background` | |
| `heading_color` | → `scheme-1.heading` | |
| `text_color` | → `scheme-1.text` | |
| `link_color` | → `scheme-1.link` | |
| `star_color` | → `color_star` | global accent |
| `button_bg_color`, `button_text_color` | → `scheme-1.button_bg`, `scheme-1.button_text` | pilot: #FBD816 / #0F1111 (brief §5) |
| `button_alt_bg_color`, `button_alt_text_color` | → `scheme-1.button_secondary_bg`, `scheme-1.button_secondary_text` | |
| `color_scheme_1_bg/_bg_grad/_heading/_text/_btn_bg/_btn_text` | → `scheme-4.*` | section `color_scheme: 1` values map to `scheme-4` |
| `color_scheme_2_*` | → `scheme-5.*` | brief §8 proposes retiring the orange; pilot keeps the scheme but no section uses it after migration unless a template does |
| `color_scheme_3_*` | → `scheme-6.*` | |
| `panel_bg_color`, `panel_heading_color`, `panel_text_color` | → `scheme-2.background/heading/text` | |
| `drawer_bg_color`, `drawer_text_color` | → `scheme-7.background/text`; `drawer_color_scheme` = `scheme-7` | |
| `error_bg_color`, `error_text_color` | → `color_error_bg`, `color_error` | |
| `success_bg_color`, `success_text_color` | → `color_success_bg`, `color_success` | |
| `info_bg_color`, `info_text_color` | → `color_info_bg`, `color_info` | |
| `blend_product_images`, `blend_collection_images`, `blend_bg_color` | → `image_blend_products`, `image_blend_collections`, `image_blend_color` | |

New in Weft (no live equivalent): `color_sale`, `color_stock_ok`, `color_stock_low`, `color_stock_out`, `color_installments_tint`, `color_disabled_bg`, `color_disabled_text`, `scheme-*.button_hover`.

### 1.2 Typography (8)
| Live | Weft |
|---|---|
| `heading_font` | = |
| `heading_uppercase` | = |
| `subheading_uppercase` | = |
| `button_text_uppercase` | → `button_uppercase` |
| `heading_scale_start` | → `heading_scale` (percentage range) |
| `body_font` | = |
| `body_font_size` | → `body_size` |
| `navigation_font` | → `navigation_font_source` (select: body / heading) — a third font file would break the 3-file budget; pilot value `heading`→ see "For owner review" |

### 1.3 Design (18) → "Layout and design"
| Live | Weft |
|---|---|
| `max_page_width` | → `page_width` |
| `section_gap` | → `section_spacing` |
| `input_button_border_width` | → `border_width` |
| `input_button_border_radius` | → `radius_button` and `radius_input` (both take the live value) |
| `slider_show_arrows` | → `carousel_arrows` |
| `slider_button_style` | → `carousel_arrow_style` |
| `slider_items_per_nav` | → `carousel_step` |
| `drawer_border_radius` | → `radius_drawer` |
| `overlay_border_radius` | → `radius_modal` |
| `disclosure_toggle` | → `accordion_icon` |
| `show_breadcrumbs_product/collection/collection_list/article/blog` | → `breadcrumbs_product`, `breadcrumbs_collection`, `breadcrumbs_list_collections`, `breadcrumbs_article`, `breadcrumbs_blog` |
| `show_breadcrumbs_blog_rss` | → `breadcrumbs_blog_rss` |
| `pagination_style` | = |
| `pagination_infinite` | → `pagination_style` value `infinite` ⊕ |

New: `radius_card`, `radius_media`, `logo`, `logo_width` (moved from header section to global "Logo" group; header keeps overrides).

### 1.4 Collection cards (8)
`coll_card_image_ratio` → `collection_card_ratio`; `coll_card_image_fit` → `collection_card_fit`; `coll_image_align` → `collection_card_image_position`; `coll_text_align` → `collection_card_text_align`; `coll_show_link` → `collection_card_show_link`; `coll_label_color` → `collection_card_label_color`; `coll_bg_color` → `collection_card_bg`; `coll_border_color` → `collection_card_border`.

### 1.5 Product cards (23)
| Live | Weft |
|---|---|
| `prod_card_image_ratio`, `prod_card_image_fit`, `prod_card_image_align` | → `card_ratio`, `card_fit`, `card_image_position` |
| `card_hover_action` | → `card_hover` (none / second image / slideshow) |
| `card_show_weight`, `card_show_vendor`, `card_show_subtitle`, `card_show_rating`, `card_show_inventory` | = (prefix `card_show_` kept) |
| `card_price_bottom` | = |
| `card_url_within_coll` | → `card_url_in_collection` |
| `enable_quick_add` | → `quick_add_enable` |
| `card_atc_mobile`, `card_atc_desktop` | → `quick_add_style_mobile`, `quick_add_style_desktop` |
| `quick_add_sticky_buttons` | → `quick_add_sticky_footer` |
| `show_dividers` | → `card_dividers` |
| `card_contain`, `card_bg_color`, `card_text_color`, `card_border_color` | → `card_boxed`, `card_bg`, `card_text`, `card_border` |
| `card_highlight_bg_color`, `card_highlight_text_color`, `card_highlight_border_color` | → `card_highlight_bg`, `card_highlight_text`, `card_highlight_border` |

### 1.6 Product compare (6)
`enable_compare` → `compare_enable`; `compare_toggle` = ; `compare_max` = (max 5); `compare_column_width` = ; `compare_show_empty_metafields` → `compare_show_empty`; `compare_empty_field_text` → `compare_empty_text`.

### 1.7 Product inventory (10)
`inventory_threshold_low` → `stock_low_threshold` (pilot: brief says "Only a few left" at 8 or fewer on the product page; live card threshold 10 — see owner review); `inventory_threshold_very_low` → `stock_very_low_threshold`; `inventory_show_notice` → `stock_notice`; `hide_no_stock_backordered` → `stock_hide_backorder_notice`; `inventory_show_count` → `stock_show_count`; `in_stock_text_color` ⊕ `color_stock_ok`; `low_stock_text_color` ⊕ `color_stock_low`; `very_low_stock_text_color` ⊕ `color_stock_out`; `no_stock_text_color` ⊕ `scheme muted`; `no_stock_backordered_text_color` ⊕ `color_stock_low`.

### 1.8 Product labels (27)
All kept with prefix `label_`: `product_label_card_position` → `label_card_position`; `show_sale_label` → `label_sale_show`; `sale_label_bg_color` → `label_sale_bg`; `sale_label_text_color` → `label_sale_text`; `sale_label_icon` → `label_sale_icon`; `sale_label_type` → `label_sale_type`; `show_sold_out_label` → `label_sold_out_show`; `sold_out_label_icon/bg/text` → `label_sold_out_icon/bg/text`; `show_new_label` → `label_new_show`; `new_label_icon/bg/text` → `label_new_icon/bg/text`; `show_new_label_collection` → `label_new_by_collection`; `new_label_collections` → `label_new_collections`; `show_new_label_tag` → `label_new_by_tag`; `new_label_tag` → `label_new_tag`; `show_new_label_days` → `label_new_by_age`; `new_label_date_limit` → `label_new_days`; `preorder_label_icon/bg/text` → `label_preorder_icon/bg/text`; `show_custom_label` → `label_custom_show`; `custom_label_icon/bg/text` → `label_custom_icon/bg/text`.

### 1.9 Swatches (9)
`swatch_option_name` → `swatch_option_names`; `variant_picker_color_style` → `swatch_product_style`; `variant_picker_swatch_shape` → `swatch_product_shape`; `variant_picker_swatch_size` → `swatch_product_size`; `card_colors_style` → `swatch_card_style`; `card_swatch_shape` → `swatch_card_shape`; `card_swatch_size` → `swatch_card_size`; `filter_color_style` → `swatch_filter_style`; `swatch_colors` → `swatch_color_list` (fallback when Shopify's native swatch data is missing).

### 1.10 Social media (19)
All `social_*_url` kept (=). `social_whatsapp_url` also drives the chat button (brief §11). `social_custom_icon`, `social_custom_url` =.

### 1.11 Search (14)
`show_search_types` → `search_type_filter`; `enable_predictive_search` → `predictive_search_enable`; `predictive_search_limit` =; `predictive_search_show_vendor` =; `predictive_search_show_price` =; `predictive_search_include_skus` → `predictive_search_skus`; `predictive_search_include_tags` → `predictive_search_tags`; `search_input_placeholder_1..3` → `search_placeholder_1..3`; `search_input_font` → `search_font`; `prompts_mobile` → `search_placeholders_mobile`; `enable_speech_search` → `voice_search_enable`; `speech_icon_color` → `voice_search_color`.

### 1.12 Currency format (2)
`show_currency_code` → `currency_code_enable`; `superscript_decimals` → `currency_superscript`.

### 1.13 Cart (14)
`cart_icon` =; `cart_type` =; `after_add_to_cart` → `cart_after_add`; `cart_empty_shop_link` → `cart_empty_link`; `cart_show_weight` =; `show_recommendations` → `cart_recommendations`; `recommendations_heading` → `cart_recommendations_heading`; `recommendations_to_show` → `cart_recommendations_limit`; `recommendations_layout` → `cart_recommendations_layout`; `cart_shaking` → `cart_shake`; `cart_shaking_frequency` → `cart_shake_every`; `show_free_shipping_notice` → `cart_free_shipping_bar`; `free_shipping_minimum` → `cart_free_shipping_rules` (same "currency:amount" per line idea, Weft format documented in the setting info); `free_shipping_color_scheme` → `cart_free_shipping_scheme`.

### 1.14 Animations (2)
`animations_enabled` → `reveal_on_scroll`; `animation_speed` → `reveal_speed`.

### 1.15 Favicon (1)
`favicon` = (moved into "Logo and favicon").

### 1.16 Advanced (9)
`preload_links` =; `external_links_new_tab` =; `image_quality` =; `show_blur_messages` → `tab_messages_enable`; `blur_message_1/2` → `tab_message_1/2`; `blur_message_delay` → `tab_message_delay`; `vibrate_on_atc` → `vibrate_on_add`; `custom_html_head` → `custom_code_head` (moved to "Custom code & tracking", loading mode `immediately` for migrated verification tags).

---

## 2. Sections

| Live section | Weft | Kind | Notes |
|---|---|---|---|
| `age-verification-popup` | `popup` (mode `age_verification`) | ⊕ | all settings kept; blocks heading/subheading/text/image/button map to popup blocks |
| `announcement` | `announcement-bar` | → | blocks → `_announcement`; links 1–2 kept; selectors kept; `read_time` → `rotate_seconds` |
| `apps` | `apps` | = | |
| `article-comments` | `main-article` (comments part, `comments_per_page`) | ⊕ | |
| `background-video` | `video` (layout `background`) | ⊕ | overlay text blocks → theme blocks heading/text/button |
| `cart-drawer` | `cart-drawer` | = | all 31 settings kept (IDs normalised in §4) |
| `cart-icon-bubble` | `cart-count` | → | Section Rendering target |
| `collection-list` | `collection-list` | = | `collection` blocks → `_collection-tile` |
| `contact-form` | `contact-form` | = | field blocks → `_form-field` (type setting: name/email/phone/message/custom/dropdown/text/checkbox) |
| `countdown-timer` | `countdown-timer` | = | countdown block settings kept; merchant date only |
| `country-selector` | `snippets/localization-form` | ⊕ | |
| `custom-liquid` | `custom-liquid` | = | |
| `faq` | `faq` | = | `question` → `_faq-item`, `category` → `_faq-category`, `button` → `button` |
| `featured-blog` | `featured-blog` | = | |
| `featured-collection` | `featured-collection` | = | promo info settings kept |
| `featured-product` | `featured-product` | = | blocks → product theme blocks (same set as main-product) |
| `footer` | `footer` (footer-group) | = | `link_list` → `_footer-column`, `text` → `_footer-text`, `newsletter` → `_footer-newsletter`, `@app` kept |
| `free-shipping-notice` | cart free-shipping bar (`cart_free_shipping_bar`) | ⊕ | |
| `gn-product-reviews` | `product-reviews` (core) / `integration-reviews-grid` (pilot) | → | all 25 settings kept in the integration section; core section keeps heading, layout, chips, counts |
| `gn-reviews-wall` | `integration-reviews-wall` (pilot) / `product-reviews` wall layout (core) | → | |
| `header` | `header` | = | `columns`/`pills`/`sidebar` mega blocks → `_mega-menu` with `style` setting; logo settings reference global logo with overrides |
| `icons-with-text` | `icons-with-text` | = | `item` → `_icon-item` |
| `image-banner` | `image-banner` | = | |
| `link-lists` | `link-lists` | = | `column` → `_link-column` |
| `logo-list` | `logo-list` | = | `logo` → `_logo` |
| `main-404` | `main-404` | = | + wholesale sign-in line |
| `main-account`, `main-activate_account`, `main-addresses`, `main-login`, `main-order`, `main-register`, `main-reset_password` | `main-account-*` classic fallback | = | untouched behaviour; new customer accounts are primary |
| `main-article` | `main-article` | = | |
| `main-blog` | `main-blog` | = | |
| `main-cart` | `main-cart` | = | `summary-and-checkout` → static part; `@app` kept |
| `main-collection-banner` | `collection-banner` | → | |
| `main-collection-products` | `main-collection` | → | promo blocks → `_collection-promo` (style: wide / media / card / filter) |
| `main-contact` | `main-page` (contact variant) + `contact-form` | ⊕ | |
| `main-gift-card` | `main-gift-card` | = | |
| `main-list-collections` | `main-list-collections` | = | promo blocks → `_collection-promo` |
| `main-page` | `main-page` | = | |
| `main-password-header`, `main-password` | `main-password` (header settings included) | ⊕ | |
| `main-product` | `main-product` | = | see §3 for blocks |
| `main-search` | `main-search` | = | |
| `media-grid` | `media-grid` | = | `media` → `_media-tile` |
| `media-with-text` | `media-with-text` | = | |
| `multi-column` | `multi-column` | = | `column` → `_column` |
| `navigation-slideshow` | `navigation-slideshow` | = | `slide` → `_nav-slide` |
| `newsletter` | `newsletter` | = | `form` → `email-signup` block |
| `pickup-availability` | `pickup-availability` | = | |
| `pop-up` | `popup` (mode `newsletter`/`promo`) | ⊕ | countdown, discount code, social blocks kept |
| `predictive-search` | `predictive-search` | = | |
| `product-compare-basket`, `product-compare` | `compare-drawer` | ⊕ | compare field blocks → `_compare-field` |
| `product-comparison-grid` | `product-comparison-grid` | = | rows → `_comparison-row` (type setting) |
| `product-details` | `product-details` | = | tabs → `_tab`; highlight text and payment methods blocks kept |
| `product-features` | `product-hotspots` | → | `feature` → `_hotspot` |
| `product-list` | `product-list` | = | |
| `product-recommendations` | `product-recommendations` | = | |
| `promo-grid` | `promo-grid` | = | `media` → `_promo-tile` |
| `promo-strip` | `promo-strip` | = | discount code block kept |
| `recently-viewed` | `recently-viewed` | = | |
| `rich-text` | `rich-text` | = | |
| `scrolling-banner` | `scrolling-banner` | = | text/icon/image/button → `_marquee-item` (type setting) |
| `shoppable-image` | `shoppable-image` | = | `hotspot` → `_hotspot` |
| `slideshow` | `slideshow` | = | `slide` → `_slide` (countdown settings kept) |
| `testimonials` | `testimonials` | = | `testimonial` → `_testimonial` |
| `video` | `video` | = | |

Theme block `ai_gen_block_5d29ae5` (B2B login page) → `wholesale-access` section (brief §4.9: rebuilt as a normal section). Its 34 style settings collapse into scheme + layout settings; content settings map: `heading`, `subheading` → `heading`, `text`; `button_text`/`button_link` → `sign_in_label` (link comes from `routes.account_login_url`); `request_text`/`request_link` → `apply_label`/`apply_page`.

---

## 3. Product blocks (main-product and featured-product)

| Live block | Weft block | Kind |
|---|---|---|
| `@app` | `@app` | = |
| `buy-buttons` | `buy-buttons` | = (settings: `show_qty_selector` → `show_quantity`, `enable_dynamic_checkout` → `show_accelerated`, `show_pickup_availability` → `show_pickup`, `show_gift_card_recipient` → `show_gift_card_recipient`) |
| `collapsible-content` | `collapsible` | → |
| `custom-liquid` | `custom-liquid` | = |
| `divider` | `divider` | = |
| `link` | `button` | → |
| `image` | `image` | = |
| `inventory-status` | `stock-line` (urgency bar options) | → |
| `product-signup` | `product-signup` | = |
| `newsletter-signup` | `email-signup` | → |
| `pop-up` | `popup-link` | → |
| `weight`, `barcode`, `type`, `vendor-sku` | `product-meta` (toggles: vendor, sku, barcode, weight, type) | ⊕ |
| `price` | `product-price` | → |
| `rating` | `product-rating` (pill style or stars) | → |
| `complementary` | `complementary-products` | → |
| `richtext` | `text` | → |
| `share` | `share` | = |
| `title` | `product-title` | → |
| `variant-picker` | `variant-picker` (+ `product-guide` for the size chart page/image) | → (size chart settings move to `product-guide`) |
| `message` | `flash-message` | → |
| `description` | `description` (+ clamp setting, live "See more" custom code becomes the `clamp` option) | → |
| `product-labels` | `product-labels` | = |
| `custom-option` | `custom-option` | = |
| `view-more-button` | `button` preset "View more" | ⊕ |
| custom-liquid `gn-rating` | `product-rating` | → first-class block |
| custom-liquid `gn-shipping-bar` | `delivery-list` | → first-class block; country rules → Delivery information group (**store** values) |
| custom-liquid `back-in-stock` (Wasify) | `back-in-stock` (+ `integration-back-in-stock`) | → |
| custom-liquid `gn-see-more` | `description` clamp | ⊕ |
| custom-liquid `gn-atc-button` | `buy-buttons` (primary colour via scheme) | ⊕ |
| custom-liquid `gn-sticky-atc` | `main-product` mobile sticky bar setting | ⊕ |
| `size-guide-warning` (empty) | — | ✕ (brief §4.9) |
| recommended-size-range block, old Klarna badge, `killOldKlarna` | — | ✕ (brief §4.9) |
| SparkLayer Wholesale Details card, `data-spark` wrappers | `wholesale-terms` | ✕ legacy / replaced |
| customer-tag B2B checks | `customer.b2b?` | ✕ |

---

## 4. Section settings renames (selected; full list generated in P7)

| Section | Live → Weft |
|---|---|
| cart-drawer | `show_cart_page_link` → `show_view_cart`; `show_backorder_text` → `show_backorder_note`; `position_cart_summary` → `summary_position`; `stick_footer` → `sticky_footer`; `show_shipping_text_notice` → `show_tax_note`; `show_additional_checkout_buttons` → `show_accelerated`; `cart_terms_page` → `terms_page`; `promoted_products_*` → `promoted_*`; `show_media_promotion` / `media_promotion_*` → `promo_*` |
| main-product | `stick_on_scroll` → `sticky_info`; `select_first_variant` =; `sticky_atc_panel`/`sticky_atc_position`/`sticky_atc_mobile` → `sticky_bar_mobile` (the approved mobile sticky bar replaces the theme's own sticky panel, brief §14.4); `media_layout` → `gallery_layout`; `media_size` → `gallery_width`; `media_ratio` → `media_ratio`; `enable_zoom`/`zoom_mode`/`hover_zoom` → `zoom`; `enable_lightbox_mobile` → `lightbox_mobile`; `media_thumbs` → `thumbnails`; `enable_media_grouping`/`media_grouping_option` → `group_media_by_option` / `group_media_option_names`; `bg_color` → `media_bg` |
| header | `enable_sticky` → `sticky`; `mobile_menu_position` =; `logo*` → global logo + `logo_width_override`; `menu_center` → `menu_align`; `quicklinks_menu` → `quick_links_menu`; `cta_*` = |
| main-collection | `products_per_page` = (max 50); `show_layout_toggle` =; `enable_filtering` =; `enable_sorting` =; `sort_show_*` → `sort_options` (checkboxes kept as individual settings) |

---

## 5. Section groups and templates

| Live | Weft | Notes |
|---|---|---|
| `header-group.json` (announcement > header) | = | |
| `header-group.context.b2b-wholesale.json`, `.context.rest-of-world.json` | **store** (`store-configs/ibban/sections/`) | overrides only |
| `footer-group.json` (apps > footer) | = | |
| `overlay-group.json` (cart-drawer > product-compare > pop-up) | = + `search-drawer`, `quick-add`, `location-sheet` | |
| `404.json`, `article.json`, `blog.json`, `cart.json`, `search.json`, `password.json`, `list-collections.json`, `customers/*` | = | |
| `collection.json` | = (`collection-banner` > `main-collection`) | |
| `collection.flash-sale.json` | = | |
| `collection.party-wear`, `summer-dress`, `summer-hand-bag`, `summer-jacket-vests`, `summer-sale`, `winter-dresses`, `winter-jacket-and-vest`, `winter-last-chance`, `winter-long-coats` | **store**; Weft ships the generic `collection.banner.json` they are built from | |
| `index.json`, `index.context.b2b-wholesale.json` | Weft `index.json` per preset; pilot content **store** | |
| `page.json`, `page.contact.json`, `page.faqs.json` → `page.faq.json`, `page.about-us.json` → `page.about.json`, `page.lookbook.json`, `page.comming-soon.json` → `page.coming-soon.json`, `page.custom-payment-page.json` → `page.custom-payment.json`, `page.reviews.json`, `page.shipping-calculator.json` | Weft templates; pilot content **store** | custom-liquid content moves unchanged (BUILD_SPEC §8.2) |
| `page.privacy-policy`, `return-refund-and-exchan`, `shipping-policy`, `terms-of-service` | `page.policy.json` (generic) + **store** copies keep their custom-liquid content | |
| `page.b2b-login.json` | `page.wholesale-access.json` | |
| `page.b2b-request-form.json` | `page.wholesale-request.json` | handle to confirm (open question) |
| `page.b2b-en-onbord.json` | **store** `page.wholesale-onboarding.json` | Klaviyo + Judge.me embeds stay store-specific |
| `page.perfume.json`, `page.summer-dress.json` | **store** landing templates on `page.landing.json` | |
| `product.json` | = | |
| `product.dress`, `product.hand-bag`, `product.perfume` | ⊕ `product.json` (one layout, brief §11) | pilot products assigned to these templates are re-pointed to the default template in the migration report |
| `product.preorder`, `product.countdown`, `product.coming-soon` | = | |
| `product.context.b2b-wholesale.json`, `product.context.rest-of-world.json` | **store**, same block order as `product.json` | |
| `gift_card.liquid` | = (Weft's own) | |
| `search.bss.b2b.liquid` | ✕ | brief §4.9 |

## 6. Locales
Live: de, en.default, es, fr, it, ja, nl, pt-PT → Weft: same eight storefront locales (Weft's own strings; no live strings copied), plus `en.default.schema.json` and `es.schema.json`.
