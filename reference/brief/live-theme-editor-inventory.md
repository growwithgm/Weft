# Live theme — theme editor inventory (parity checklist)

Generated 28 Sep 2026 from `theme_export__ibban-com-copy-of-4-live-ibban__27SEP2026-0502pm.zip` (Enterprise 2.0.1 by Clean Canvas).
Every global setting group, section, block type, section group and template below needs an equivalent in the new theme editor. The only exceptions are the legacy leftovers listed in section 4.9 of `ibban-theme-claude-design-brief.md`.
Use this file for behaviour and editor coverage only. Setting IDs may be renamed; `docs/migration-map.md` must record every rename.

**Counts:** 16 global setting groups (211 settings), 70 sections, 1 theme block file(s), 54 JSON templates, 8 locale files.

## 1. Global settings (config/settings_schema.json)

### Colors — 41 settings
- `bg_color` (color) Page background [default: #ffffff]
- `heading_color` (color) Headings [default: #333333]
- `text_color` (color) Body text [default: #555555]
- `link_color` (color) Links [default: #0000ee]
- `star_color` (color) Rating stars [default: #f7c346]
- `button_bg_color` (color) Background [default: #333333]
- `button_text_color` (color) Text [default: #ffffff]
- `button_alt_bg_color` (color) Background [default: #ffffff]
- `button_alt_text_color` (color) Border and text [default: #333333]
- `color_scheme_1_bg` (color) Background [default: #eeeeee]
- `color_scheme_1_bg_grad` (color_background) Background gradient
- `color_scheme_1_heading` (color) Headings [default: #333333]
- `color_scheme_1_text` (color) Text [default: #333333]
- `color_scheme_1_btn_bg` (color) Button background [default: #333333]
- `color_scheme_1_btn_text` (color) Button text [default: #ffffff]
- `color_scheme_2_bg` (color) Background [default: #FF580D]
- `color_scheme_2_bg_grad` (color_background) Background gradient
- `color_scheme_2_heading` (color) Headings [default: #ffffff]
- `color_scheme_2_text` (color) Text [default: #ffffff]
- `color_scheme_2_btn_bg` (color) Button background [default: #292F36]
- `color_scheme_2_btn_text` (color) Button text [default: #ffffff]
- `color_scheme_3_bg` (color) Background [default: #1a66d2]
- `color_scheme_3_bg_grad` (color_background) Background gradient
- `color_scheme_3_heading` (color) Headings [default: #ffffff]
- `color_scheme_3_text` (color) Text [default: #ffffff]
- `color_scheme_3_btn_bg` (color) Button background [default: #333333]
- `color_scheme_3_btn_text` (color) Button text [default: #ffffff]
- `panel_bg_color` (color) Background [default: #f6f7f7]
- `panel_heading_color` (color) Headings [default: #333333]
- `panel_text_color` (color) Text [default: #555555]
- `drawer_bg_color` (color) Background [default: #ffffff]
- `drawer_text_color` (color) Text [default: #555555]
- `error_bg_color` (color) Error background [default: #fcedee]
- `error_text_color` (color) Error text [default: #b40c1c]
- `success_bg_color` (color) Success background [default: #e8f6ea]
- `success_text_color` (color) Success text [default: #2c7e3f]
- `info_bg_color` (color) Info background [default: #E4EDFA]
- `info_text_color` (color) Info text [default: #1A66D2]
- `blend_product_images` (checkbox) Blend product images [default: False]
- `blend_collection_images` (checkbox) Blend collection images [default: False]
- `blend_bg_color` (color) Blend background color [default: #fefefe]

### Typography — 8 settings
- `heading_font` (font_picker) Font [default: nunito_sans_n7]
- `heading_uppercase` (checkbox) Make headings uppercase [default: False]
- `subheading_uppercase` (checkbox) Make subheadings uppercase [default: False]
- `button_text_uppercase` (checkbox) Make button text uppercase [default: False]
- `heading_scale_start` (select) Heading text scale [default: 4]
- `body_font` (font_picker) Font [default: nunito_sans_n4]
- `body_font_size` (range) Font size [default: 16]
- `navigation_font` (font_picker) Font [default: nunito_sans_n7]

### Design — 18 settings
- `max_page_width` (range) Maximum page width [default: 1320]
- `section_gap` (select) Section height [default: 48]
- `input_button_border_width` (select) Border [default: 1]
- `input_button_border_radius` (range) Corner radius [default: 21]
- `slider_show_arrows` (select) Arrow buttons visibility on large screens [default: always]
- `slider_button_style` (select) Arrow button style [default: btn--secondary]
- `slider_items_per_nav` (select) Slides to scroll per navigation [default: slide]
- `drawer_border_radius` (range) Corner radius [default: 0]
- `overlay_border_radius` (range) Corner radius [default: 20]
- `disclosure_toggle` (select) Toggle icon [default: arrow]
- `show_breadcrumbs_product` (checkbox) Products [default: True]
- `show_breadcrumbs_collection` (checkbox) Collections [default: True]
- `show_breadcrumbs_collection_list` (checkbox) Collection list [default: True]
- `show_breadcrumbs_article` (checkbox) Blog posts [default: True]
- `show_breadcrumbs_blog` (checkbox) Blogs [default: True]
- `show_breadcrumbs_blog_rss` (checkbox) Show RSS icon in blogs breadcrumb [default: True]
- `pagination_style` (select) Pagination style [default: traditional]
- `pagination_infinite` (checkbox) Enable infinite scroll [default: False]

### Collection cards — 8 settings
- `coll_card_image_ratio` (select) Image aspect ratio [default: 1]
- `coll_card_image_fit` (select) Image fit [default: cover]
- `coll_image_align` (select) Image alignment [default: ]
- `coll_text_align` (select) Text alignment [default: text-center]
- `coll_show_link` (checkbox) Show "View collection" link [default: True]
- `coll_label_color` (color) Label color [default: #007E12]
- `coll_bg_color` (color) Image background color [default: #F9F9F9]
- `coll_border_color` (color) Image border color [default: #E1E1E1]

### Product cards — 23 settings
- `prod_card_image_ratio` (select) Image aspect ratio [default: shortest]
- `prod_card_image_fit` (select) Image fit [default: contain]
- `prod_card_image_align` (select) Image alignment [default: ]
- `card_hover_action` (select) Additional product images [default: slideshow]
- `card_show_weight` (checkbox) Show product weight [default: False]
- `card_show_vendor` (checkbox) Show product vendor [default: False]
- `card_show_subtitle` (checkbox) Show product subtitle [default: True]
- `card_show_rating` (checkbox) Show product rating [default: False]
- `card_show_inventory` (checkbox) Show product inventory [default: False]
- `card_price_bottom` (checkbox) Align price to the bottom of the card [default: False]
- `card_url_within_coll` (checkbox) Include the collection within the URL [default: True]
- `enable_quick_add` (checkbox) Enable Quick Buy [default: True]
- `card_atc_mobile` (select) Add to Cart appearance on mobile [default: icon]
- `card_atc_desktop` (select) Add to Cart appearance on large screens [default: text_button_hover]
- `quick_add_sticky_buttons` (checkbox) Fix the Quick Buy footer to the bottom of the drawer when it scrolls [default: True]
- `show_dividers` (checkbox) Show dividing lines [default: True]
- `card_contain` (checkbox) Show as a box [default: False]
- `card_bg_color` (color) Box background color [default: #F9F9F9]
- `card_text_color` (color) Box text color [default: #555555]
- `card_border_color` (color) Box border color [default: #E1E1E1]
- `card_highlight_bg_color` (color) Highlight background color [default: #F9F9F9]
- `card_highlight_text_color` (color) Highlight text color [default: #555555]
- `card_highlight_border_color` (color) Highlight border color [default: #E1E1E1]

### Product compare — 6 settings
- `enable_compare` (checkbox) Enable product compare [default: True]
- `compare_toggle` (select) Compare toggle [default: toggle_on]
- `compare_max` (range) Maximum products in compare [default: 3]
- `compare_column_width` (select) Maximum column width on large screens [default: medium]
- `compare_show_empty_metafields` (checkbox) Show empty metafield rows [default: True]
- `compare_empty_field_text` (text) Text to use for empty fields [default: -]

### Product inventory — 10 settings
- `inventory_threshold_low` (range) Low inventory threshold [default: 10]
- `inventory_threshold_very_low` (range) Very low inventory threshold [default: 2]
- `inventory_show_notice` (select) Show inventory notice [default: low]
- `hide_no_stock_backordered` (checkbox) Hide backordered inventory notice [default: False]
- `inventory_show_count` (select) Show product count [default: low]
- `in_stock_text_color` (color) In stock [default: #2c7e3f]
- `low_stock_text_color` (color) Low stock [default: #d2861a]
- `very_low_stock_text_color` (color) Very low stock [default: #b40c1c]
- `no_stock_text_color` (color) No stock [default: #777777]
- `no_stock_backordered_text_color` (color) Backordered [default: #777777]

### Product labels — 27 settings
- `product_label_card_position` (select) Visibility on product cards [default: top-0 start]
- `show_sale_label` (checkbox) Show "Sale" label [default: True]
- `sale_label_bg_color` (color) Sale background [default: #d52f5a]
- `sale_label_text_color` (color) Sale text [default: #ffffff]
- `sale_label_icon` (select) Icon [default: none]
- `sale_label_type` (select) Sale label type [default: standard]
- `show_sold_out_label` (checkbox) Show "Sold out" label [default: True]
- `sold_out_label_icon` (select) Icon [default: none]
- `sold_out_label_bg_color` (color) Sold out background [default: #555555]
- `sold_out_label_text_color` (color) Sold out text [default: #ffffff]
- `show_new_label` (checkbox) Show "New" label [default: True]
- `new_label_icon` (select) Icon [default: none]
- `new_label_bg_color` (color) New background [default: #212b36]
- `new_label_text_color` (color) New text [default: #ffffff]
- `show_new_label_collection` (checkbox) Show "New" label for products in the following collections [default: False]
- `new_label_collections` (collection_list) "New" collections
- `show_new_label_tag` (checkbox) Show "New" label for products with the following tag [default: True]
- `new_label_tag` (text) "New" tag [default: New]
- `show_new_label_days` (checkbox) Show "New" label for products created within this many days [default: False]
- `new_label_date_limit` (range) Days ago created [default: 7]
- `preorder_label_icon` (select) Icon [default: none]
- `preorder_label_bg_color` (color) Preorder background [default: #007E12]
- `preorder_label_text_color` (color) Preorder text [default: #ffffff]
- `show_custom_label` (checkbox) Show custom label [default: True]
- `custom_label_icon` (select) Icon [default: none]
- `custom_label_bg_color` (color) Custom background [default: #2C7E3F]
- `custom_label_text_color` (color) Custom text [default: #ffffff]

### Swatches — 9 settings
- `swatch_option_name` (text) Color option name [default: Color,Colour,Couleur,Farbe]
- `variant_picker_color_style` (radio) Style [default: native]
- `variant_picker_swatch_shape` (select) Icon shape [default: circle]
- `variant_picker_swatch_size` (range) Icon size [default: 64]
- `card_colors_style` (radio) Style [default: native]
- `card_swatch_shape` (select) Icon shape [default: circle]
- `card_swatch_size` (range) Icon size [default: 24]
- `filter_color_style` (radio) Style [default: none]
- `swatch_colors` (textarea) Swatch color list

### Social media — 19 settings
- `social_facebook_url` (text) Facebook
- `social_youtube_url` (text) YouTube
- `social_instagram_url` (text) Instagram
- `social_whatsapp_url` (text) WhatsApp
- `social_tiktok_url` (text) TikTok
- `social_snapchat_url` (text) Snapchat
- `social_pinterest_url` (text) Pinterest
- `social_twitter_url` (text) X (formerly Twitter)
- `social_linkedin_url` (text) LinkedIn
- `social_wechat_url` (text) WeChat
- `social_vimeo_url` (text) Vimeo
- `social_tumblr_url` (text) Tumblr
- `social_twitch_url` (text) Twitch
- `social_spotify_url` (text) Spotify
- `social_discord_url` (text) Discord
- `social_mastodon_url` (text) Mastodon
- `social_threads_url` (text) Threads
- `social_custom_icon` (image_picker) Icon
- `social_custom_url` (text) URL

### Search — 14 settings
- `show_search_types` (checkbox) Enable product type dropdown [default: True]
- `enable_predictive_search` (checkbox) Enable predictive search [default: True]
- `predictive_search_limit` (range) Maximum number of items to show per result type [default: 10]
- `predictive_search_show_vendor` (checkbox) Show product vendor [default: False]
- `predictive_search_show_price` (checkbox) Show product price [default: False]
- `predictive_search_include_skus` (checkbox) Search SKUs [default: True]
- `predictive_search_include_tags` (checkbox) Search tags [default: True]
- `search_input_placeholder_1` (text) Prompt text 1 (default) [default: Search for products]
- `search_input_placeholder_2` (text) Prompt text 2 [default: Search for blog posts]
- `search_input_placeholder_3` (text) Prompt text 3 [default: Search for collections]
- `search_input_font` (select) Font [default: body]
- `prompts_mobile` (checkbox) Enable search prompts on mobile [default: False]
- `enable_speech_search` (checkbox) Enable speech search [default: True]
- `speech_icon_color` (color) Speech pulse color [default: #ff0000]

### Currency format — 2 settings
- `show_currency_code` (checkbox) Show currency codes [default: False]
- `superscript_decimals` (checkbox) Show cents as superscript [default: False]

### Cart — 14 settings
- `cart_icon` (select) Cart icon [default: bag]
- `cart_type` (select) Cart type [default: drawer]
- `after_add_to_cart` (select) After adding to cart [default: drawer]
- `cart_empty_shop_link` (url) Empty cart shopping link [default: /collections/all]
- `cart_show_weight` (checkbox) Show product weight [default: False]
- `show_recommendations` (checkbox) Show related products [default: False]
- `recommendations_heading` (text) Heading [default: You may also like]
- `recommendations_to_show` (range) Maximum products to show [default: 4]
- `recommendations_layout` (select) Layout [default: carousel]
- `cart_shaking` (checkbox) Enable cart shaking [default: False]
- `cart_shaking_frequency` (range) Shake the cart icon every X page changes [default: 5]
- `show_free_shipping_notice` (checkbox) Show free shipping bar [default: False]
- `free_shipping_minimum` (textarea) Minimum order amount
- `free_shipping_color_scheme` (select) Color scheme [default: none]

### Animations — 2 settings
- `animations_enabled` (radio) Animate text and images on scroll [default: disabled]
- `animation_speed` (select) Animation speed [default: fast]

### Favicon — 1 settings
- `favicon` (image_picker) Image

### Advanced — 9 settings
- `preload_links` (checkbox) Preload links on hover [default: True]
- `external_links_new_tab` (checkbox) Open external links in a new tab [default: True]
- `image_quality` (select) Image quality [default: 1]
- `show_blur_messages` (checkbox) Show attention messages when the browser tab loses focus [default: False]
- `blur_message_1` (text) Message 1 [default: Something we said?]
- `blur_message_2` (text) Message 2 [default: We're still here!]
- `blur_message_delay` (range) Message delay [default: 3]
- `vibrate_on_atc` (checkbox) Vibrate on "Add to Cart" [default: False]
- `custom_html_head` (html) HTML for <head> tag

## 2. Sections

### age-verification-popup — “Age verification pop-up” (tag: section; class: cc-pop-up; limit: 1; enabled_on: {"groups": ["aside"]}; presets: Age verification pop-up)
- settings (10): position(select), text_align(select), padding(select), shrink_width(checkbox), bg_image(image_picker), heading_color(color), text_color(color), bg_color(color), bg_grad(color_background), tint_opacity(range)
- block `@app` “”
- block `heading` “Heading” limit 1: heading(text), heading_size(select)
- block `subheading` “Subheading” limit 1: text(text)
- block `text` “Text” limit 2: text(richtext), text_size(select)
- block `image` “Image” limit 1: image(image_picker), image_position_desktop(select), image_position_mobile(select)
- block `button` “Button” limit 1: button_proceed_label(text), button_proceed_style(select), button_proceed_bg_color(color), button_proceed_text_color(color), button_cancel_label(text), button_cancel_style(select), button_cancel_bg_color(color), button_cancel_text_color(color), cancel_text(richtext)

### announcement — “Announcement” (class: cc-announcement; max_blocks: 3)
- settings (10): link1(url), link1_label(text), link2(url), link2_label(text), enable_country_selector(checkbox), enable_language_selector(checkbox), bg_color(color), text_color(color), text_type_scale(select), read_time(range)
- block `announcement` “Announcement”: text(richtext)

### apps — “Apps” (class: cc-apps; presets: Apps)
- settings (2): full_width(checkbox), show_space(checkbox)
- block `@app` “”

### article-comments — “Blog post comments” (class: cc-article-comments section)
- settings (1): comments_per_page(range)

### background-video — “Background video” (class: cc-background-video; disabled_on: {"groups": ["header", "footer", "aside"]}; presets: Background video)
- settings (14): video_shopify(video), video_external(text), video_description(text), poster_image(image_picker), video_height(select), overlay_text_align(select), overlay_position(select), mob_center_text(checkbox), color_scheme(select), transparent_content_color(color), tint_color(color), tint_opacity(range), lazyload(checkbox), prevent_animation(checkbox)
- block `heading` “Heading” limit 1: heading(text), heading_size(select), heading_h1(checkbox)
- block `subheading` “Subheading” limit 1: text(text)
- block `text` “Text” limit 1: text(richtext), enlarge_text(checkbox)
- block `button` “Button” limit 1: button_label(text), button_link(url), button_style(select)

### cart-drawer — “Cart drawer” (class: cc-cart-drawer)
- settings (31): show_cart_page_link(checkbox), show_backorder_text(checkbox), show_vendor(checkbox), position_cart_summary(select), stick_footer(checkbox), show_order_note(checkbox), show_shipping_text_notice(checkbox), show_additional_checkout_buttons(checkbox), show_checkout_button(checkbox), cart_terms_page(url), show_shipping_calculator(checkbox), shipping_calculator_default_country(text), promoted_products_visibility(select), promoted_products_heading(text), promoted_products_list(product_list), promoted_products_layout(select), show_media_promotion(checkbox), media_promotion_visibility(select), image(image_picker), video_shopify(video), link_url(url), media_promotion_min_height(range), content(richtext), text_type_scale(select), text_width(range), text_alignment(select), button_label(text), button_style(select), text_color(color), tint_color(color), tint_opacity(range)

### cart-icon-bubble — no schema

### collection-list — “Collection list” (tag: section; class: cc-collection-list; max_blocks: 16; disabled_on: {"groups": ["header", "footer", "aside"]}; presets: Collection list)
- settings (11): title(text), heading_align(select), button_label(text), button_link(url), layout(select), card_size(select), use_product_image(checkbox), circle_image(checkbox), show_border(checkbox), color_scheme(select), full_width(checkbox)
- block `collection` “Collection”: collection(collection), image(image_picker)

### contact-form — “Contact form” (tag: section; class: cc-contact-form; disabled_on: {"groups": ["header", "footer", "aside"]}; presets: Contact form)
- settings (7): heading(text), heading_align(select), image(image_picker), image_position(select), color_scheme(select), full_width(checkbox), button_style(select)
- block `name` “Name” limit 1: required(checkbox), half_width(checkbox)
- block `email` “Email” limit 1: required(checkbox), half_width(checkbox)
- block `phone` “Phone” limit 1: required(checkbox), half_width(checkbox)
- block `body` “Message” limit 1: required(checkbox), half_width(checkbox)
- block `custom` “Custom input”: title(text), type(select), required(checkbox), half_width(checkbox)
- block `dropdown` “Dropdown”: title(text), options(textarea), half_width(checkbox)
- block `text` “Text”: text(richtext), half_width(checkbox)
- block `checkbox` “Checkbox”: title(text), value_no(text), value_yes(text), half_width(checkbox), required(checkbox)

### countdown-timer — “Countdown timer” (class: cc-countdown-timer; disabled_on: {"groups": ["header", "footer", "aside"]}; presets: Countdown timer)
- settings (15): image(image_picker), height_mode(select), fixed_height_desktop(range), fixed_height_mobile(range), overlay_position(select), text_align(select), mob_center_text(checkbox), countdown_size(select), use_custom_colors(checkbox), count_color(color), bg_color(color), color_scheme(select), full_width(checkbox), tint_color(color), tint_opacity(range)
- block `subheading` “Subheading” limit 1: text(text)
- block `heading` “Heading” limit 1: heading(text), heading_size(select), heading_h1(checkbox)
- block `text` “Text” limit 1: text(richtext), enlarge_text(checkbox)
- block `countdown` “Countdown timer” limit 1: end_date(text), end_time(text), end_text(richtext), enlarge_end_text(checkbox), hide_on_end(checkbox)
- block `button` “Button” limit 1: button_1_label(text), button_1_link(url), button_1_style(select), button_2_label(text), button_2_link(url), button_2_style(select)

### country-selector — no schema

### custom-liquid — “Custom HTML/Liquid” (tag: section; class: cc-custom-liquid; disabled_on: {"groups": ["aside"]}; presets: Custom HTML/Liquid)
- settings (5): custom_liquid(liquid), section_height(select), full_width(checkbox), dividers(select), prevent_animation(checkbox)

### faq — “Collapsible content” (tag: section; class: cc-faq; disabled_on: {"groups": ["header", "footer", "aside"]}; presets: Collapsible content)
- settings (4): heading(text), heading_align(select), color_scheme(select), full_width(checkbox)
- block `question` “Collapsible item”: icon(select), heading(text), text(richtext)
- block `category` “Category”: text(text)
- block `button` “Button”: button_label(text), button_link(url), button_style(select)

### featured-blog — “Blog posts” (tag: section; class: cc-featured-blog; disabled_on: {"groups": ["header", "footer", "aside"]}; presets: Blog posts)
- settings (15): title(text), heading_align(select), show_view_all(checkbox), blog(blog), layout(select), posts_to_show(range), show_featured_image(checkbox), show_tags(checkbox), show_excerpt(checkbox), show_author(checkbox), show_date(checkbox), show_button(checkbox), color_scheme(select), image_ratio(select), button_style(select)

### featured-collection — “Featured collection” (tag: section; class: cc-featured-collection cc-product-card-grid; disabled_on: {"templates": ["password"], "groups": ["header", "footer", "aside"]}; presets: Featured collection)
- settings (18): title(text), heading_align(select), show_view_all(checkbox), collection(collection), layout(select), card_size_mobile(select), card_size(select), products_to_show(range), show_highlight_products(checkbox), show_promo_info(checkbox), image(image_picker), image_ratio(select), promo_title(text), content(richtext), link_url(url), button_label(text), color_scheme(select), button_style(select)

### featured-product — “Featured product” (tag: section; class: cc-featured-product; disabled_on: {"templates": ["cart", "password"], "groups": ["header", "footer", "aside"]}; presets: Featured product)
- settings (12): product(product), select_first_variant(checkbox), media_ratio(select), media_crop(select), media_width(range), enable_video_looping(checkbox), enable_zoom(checkbox), zoom_mode(select), hover_zoom(select), color_scheme(select), border_color(color), bg_color(color)
- block `@app` “”
- block `buy-buttons` “Buy buttons” limit 1: show_qty_selector(checkbox), enable_dynamic_checkout(checkbox), show_gift_card_recipient(checkbox)
- block `custom-liquid` “Custom Liquid”: custom_liquid(liquid)
- block `description` “Description” limit 1: show_as_collapsible_content(checkbox), text(richtext), icon(select), open(checkbox)
- block `collapsible-content` “Collapsible content”: heading(text), icon(select), text(richtext), page(page), open(checkbox)
- block `divider` “Divider”: show_line(checkbox), spacing(select)
- block `image` “Image”: title(text), image(image_picker), image_width(range), image_align(select), url(url)
- block `link` “Link”: button_label(text), button_link(url), open_in_new_tab(checkbox), button_style(select)
- block `inventory-status` “Inventory status” limit 1: show_indicator_bar(checkbox), show_urgency_message(checkbox), text_very_low(richtext), text_low(richtext), text_normal(richtext), text_no_stock(richtext), text_no_stock_backordered(richtext)
- block `pop-up` “Pop-up”: link_text(text), link_style(select), text(richtext), page(page)
- block `weight` “Weight” limit 1
- block `barcode` “Barcode (ISBN, UPC, etc)” limit 1
- block `price` “Price” limit 1: show_tax_and_shipping(checkbox)
- block `rating` “Product rating” limit 1
- block `share` “Share” limit 1: show_twitter(checkbox), show_facebook(checkbox), show_pinterest(checkbox)
- block `title` “Title” limit 1: show_weight(checkbox)
- block `richtext` “Rich text”: richtext(richtext)
- block `variant-picker` “Variant picker” limit 1: selector_style(select), enable_dynamic_availability(checkbox), dynamic_availability_downwards(checkbox), show_backorder_text(checkbox), enable_size_chart(checkbox), size_chart_variant(text), size_chart_page(page)
- block `vendor-sku` “Vendor / SKU / Barcode” limit 1: show_vendor(checkbox), show_sku(checkbox), show_barcode(checkbox)
- block `type` “Product type” limit 1
- block `product-labels` “Product labels” limit 1: show_variant_icon(checkbox)
- block `complementary` “Complementary products” limit 1: heading(text), products_to_show(range), layout(select)
- block `view-more-button` “View more link” limit 1: button_label(text), text_align(select)
- block `custom-option` “Custom option”: label(text), type(select), text_required(checkbox), long_text_required(checkbox), checkbox_checked_value(text), checkbox_unchecked_value(text), dropdown_options(textarea)

### footer — “Footer” (class: cc-footer; max_blocks: 4)
- settings (8): show_back_to_top(checkbox), show_payment_icons(checkbox), show_powered_by(checkbox), enable_country_selector(checkbox), enable_language_selector(checkbox), secondary_menu(link_list), bg_color(color), text_color(color)
- block `@app` “”
- block `link_list` “Footer menu”: heading(text), menu(link_list)
- block `text` “Image, Text and Socials” limit 3: image(image_picker), image_width(range), heading(text), text(richtext), button_label(text), button_link(url), enable_follow_on_shop(checkbox), show_social(checkbox), text_align(select)
- block `newsletter` “Email signup” limit 1: heading(text), text(richtext), collapse_mobile(checkbox)

### free-shipping-notice — no schema

### gn-product-reviews — “GN Product Reviews” (tag: section; enabled_on: {"templates": ["product"]}; presets: GN Product Reviews)
- settings (25): heading(text), total_label(text), note(textarea), min_rating(select), min_length(range), max_reviews(range), first_batch(range), show_product(checkbox), this_label(text), verified_label(text), photo_label(text), chip_all(text), chip_5(text), chip_4(text), chip_photos(text), showing_label(text), of_label(text), more_label(text), see_all_url(text), see_all_label(text), write_url(text), write_label(text), columns(range), padding_top(range), padding_bottom(range)

### gn-reviews-wall — “GN Reviews Wall” (tag: section; presets: GN Reviews Wall)
- settings (17): heading(text), subheading(textarea), total_label(text), min_rating(select), min_length(range), max_reviews(range), first_batch(range), more_label(text), show_photos(checkbox), show_product(checkbox), verified_label(text), photo_label(text), all_reviews_url(url), all_reviews_label(text), columns(range), padding_top(range), padding_bottom(range)

### header — “Header” (class: cc-header)
- settings (26): enable_sticky(checkbox), mobile_menu_position(select), logo_text(text), logo_type_scale(select), logo(image_picker), logo_width(range), logo_h1(checkbox), logo_center(checkbox), enable_search(checkbox), minimise_search_mobile(checkbox), minimise_search_desktop(checkbox), menu(link_list), menu_center(checkbox), repeat_links(checkbox), menu_featured_link(text), quicklinks_menu(link_list), cta_show(checkbox), cta_icon(select), cta_label(text), cta_link(url), cta_border_color(color), cta_bg_color(color), cta_text_color(color), bg_color(color), text_color(color), accent_color(color)
- block `columns` “Column Mega Menu”: title(text), collection_images(select), collection_use_product_image(checkbox), collection_circle_image(checkbox), show_underline(checkbox), promo_position(select), promo_min_height(range), promo_text_color(color), promo_tint_color(color), promo_tint_opacity(range), promo1_image(image_picker), promo1_content(richtext), promo1_link_url(url), promo1_text_size(range), promo1_text_width(range), promo1_text_alignment(select), promo2_image(image_picker), promo2_content(richtext), promo2_link_url(url), promo2_text_size(range), promo2_text_width(range), promo2_text_alignment(select), promo3_image(image_picker), promo3_content(richtext), promo3_link_url(url), promo3_text_size(range), promo3_text_width(range), promo3_text_alignment(select), badge1_color(color), badge1_link(text), badge1_text(text), badge2_color(color), badge2_link(text), badge2_text(text), badge3_color(color), badge3_link(text), badge3_text(text)
- block `pills` “Button Mega Menu”: title(text), collection_images(select), collection_use_product_image(checkbox), promo_position(select), promo_min_height(range), promo_text_color(color), promo_tint_color(color), promo_tint_opacity(range), promo1_image(image_picker), promo1_content(richtext), promo1_link_url(url), promo1_text_size(range), promo1_text_width(range), promo1_text_alignment(select), promo2_image(image_picker), promo2_content(richtext), promo2_link_url(url), promo2_text_size(range), promo2_text_width(range), promo2_text_alignment(select), promo3_image(image_picker), promo3_content(richtext), promo3_link_url(url), promo3_text_size(range), promo3_text_width(range), promo3_text_alignment(select)
- block `sidebar` “Sidebar Mega Menu”: title(text), collection_images(select), collection_use_product_image(checkbox), collection_circle_image(checkbox), show_underline(checkbox), show_collection_images(checkbox), sidebar_link_use_product_image(checkbox), show_product_images(checkbox), aspect_ratio(select), badge1_color(color), badge1_link(text), badge1_text(text), badge2_color(color), badge2_link(text), badge2_text(text), badge3_color(color), badge3_link(text), badge3_text(text)

### icons-with-text — “Icons with text” (tag: section; class: cc-icons-with-text; max_blocks: 8; disabled_on: {"groups": ["aside"]}; presets: Icons with text)
- settings (12): heading(text), heading_align(select), icon_size(range), title_type_scale(select), text_type_scale(select), icon_position(select), mobile_stack(checkbox), section_height(select), color_scheme(select), full_width(checkbox), dividers(select), prevent_animation(checkbox)
- block `item` “Item”: icon(select), custom_icon(image_picker), heading(text), text(richtext), link(url)

### image-banner — “Image banner” (class: cc-image-banner; disabled_on: {"groups": ["header", "footer", "aside"]}; presets: Image banner)
- settings (16): image_desktop(image_picker), image_mobile(image_picker), url(url), height_mode(select), fixed_height_desktop(range), fixed_height_mobile(range), overlay_position(select), overlay_text_align(select), mob_center_text(checkbox), mobile_stacked(checkbox), color_scheme(select), full_width(checkbox), transparent_content_color(color), tint_color(color), tint_opacity(range), prevent_animation(checkbox)
- block `subheading` “Subheading” limit 1: text(text)
- block `heading` “Heading” limit 1: heading(text), heading_size(select), heading_h1(checkbox)
- block `text` “Text” limit 1: text(richtext), enlarge_text(checkbox)
- block `button` “Button” limit 1: button_1_label(text), button_1_link(url), button_1_style(select), button_2_label(text), button_2_link(url), button_2_style(select)

### link-lists — “Link lists” (class: cc-link-list; disabled_on: {"groups": ["header", "footer", "aside"]}; presets: Link lists)
- settings (10): title(text), heading_align(select), button_label(text), button_link(url), layout(select), column_size(select), column_align(select), color_scheme(select), image_ratio(select), button_style(select)
- block `column` “Column”: image(image_picker), heading(text), heading_bg_color(color), heading_text_color(color), menu(link_list), button_label(text), button_link(url)

### logo-list — “Logo list” (tag: section; class: cc-logo-list; max_blocks: 50; disabled_on: {"groups": ["header", "footer", "aside"]}; presets: Logo list)
- settings (9): title(text), heading_align(select), button_label(text), button_link(url), layout(select), spacing(range), logo_grid_align(select), color_scheme(select), full_width(checkbox)
- block `logo` “Logo”: image(image_picker), url(url), logo_width(range), text(text)

### main-404 — “404” (class: cc-main-404 section section--template)

### main-account — no schema

### main-activate_account — no schema

### main-addresses — no schema

### main-article — “Blog post” (class: cc-main-article section section--template)
- settings (10): show_tags(checkbox), show_author(checkbox), show_date(checkbox), featured_image_width(select), heading_align(select), show_share_buttons(checkbox), show_twitter(checkbox), show_facebook(checkbox), show_pinterest(checkbox), pagination(select)

### main-blog — “Blog page” (class: cc-main-blog section section--template)
- settings (22): show_blog_title(checkbox), description(richtext), show_share_links(checkbox), show_twitter(checkbox), show_facebook(checkbox), text_align(select), posts_per_page(range), three_columns(checkbox), show_tag_filter(checkbox), show_featured_image(checkbox), image_ratio(select), show_tags(checkbox), show_excerpt(checkbox), show_author(checkbox), show_date(checkbox), show_button(checkbox), button_style(select), show_featured_post(checkbox), show_featured_excerpt(checkbox), show_featured_button(checkbox), color_scheme(select), featured_button_style(select)

### main-cart — “Cart” (class: cc-main-cart section section--template)
- settings (11): show_page_title(checkbox), heading_align(select), show_backorder_text(checkbox), show_vendor(checkbox), show_order_note(checkbox), show_tax_and_shipping(checkbox), show_additional_checkout_buttons(checkbox), cart_terms_page(url), continue_shopping_page(url), show_shipping_calculator(checkbox), shipping_calculator_default_country(text)
- block `@app` “”
- block `summary-and-checkout` “Summary and checkout” limit 1

### main-collection-banner — “Collection banner” (class: cc-collection-banner section section--template)
- settings (8): show_collection_title(checkbox), show_product_count(checkbox), show_collection_description(checkbox), text_align(select), collection_image(select), use_product_image(checkbox), text_width(select), color_scheme(select)

### main-collection-products — “Collection products” (class: cc-collection-products section section--template mb-0)
- settings (17): products_per_page(range), card_size_mobile(select), card_size(select), show_layout_toggle(checkbox), enable_filtering(checkbox), filters_open_lg(checkbox), stick_on_scroll(checkbox), show_filter_counts(checkbox), expand_filters(checkbox), max_filter_options(range), enable_sorting(checkbox), sort_show_featured(checkbox), sort_show_best(checkbox), sort_show_alpha(checkbox), sort_show_price(checkbox), sort_show_date(checkbox), sort_first(checkbox)
- block `wide-promotion` “Wide promotion”: position(select), view(select), hide_on_filter(checkbox), min_height(range), image(image_picker), video_shopify(video), link_url(url), content(richtext), text_type_scale(select), text_width(range), text_alignment(select), button_label(text), button_style(select), text_color(color), tint_color(color), tint_opacity(range)
- block `image-promotion` “Media promotion”: position(range), view(select), hide_on_filter(checkbox), min_height(range), image(image_picker), video_shopify(video), link_url(url), content(richtext), text_type_scale(select), text_width(range), text_alignment(select), button_label(text), button_style(select), text_color(color), tint_color(color), tint_opacity(range)
- block `card-promotion` “Card promotion”: position(range), view(select), hide_on_filter(checkbox), color_scheme(select), image(image_picker), image_ratio(select), link_url(url), title(text), content(richtext), button_label(text), button_style(select), button_bottom_align(checkbox)
- block `facet-image-promotion` “Filter promotion” limit 1: image(image_picker), video_shopify(video), link_url(url), content(richtext), text_type_scale(select), min_height(range), text_alignment(select), button_label(text), button_style(select), text_color(color), tint_color(color), tint_opacity(range)

### main-contact — “Contact page” (class: cc-contact section section--template)
- settings (2): show_contact_title(checkbox), heading_align(select)

### main-gift-card — “Gift card” (class: cc-gift-card)
- settings (1): image(image_picker)

### main-list-collections — “Collection list” (class: cc-list-collections section section--template)
- settings (8): title(text), description(richtext), text_align(select), display_type(select), selected_collections(collection_list), collections_per_page(range), card_size(select), use_product_image(checkbox)
- block `wide-promotion` “Wide promotion”: position(select), min_height(range), image(image_picker), video_shopify(video), link_url(url), content(richtext), text_type_scale(select), text_width(range), text_alignment(select), button_label(text), button_style(select), text_color(color), tint_color(color), tint_opacity(range)
- block `image-promotion` “Media promotion”: position(range), min_height(range), image(image_picker), video_shopify(video), link_url(url), content(richtext), text_type_scale(select), text_width(range), text_alignment(select), button_label(text), button_style(select), text_color(color), tint_color(color), tint_opacity(range)
- block `card-promotion` “Card promotion”: position(range), color_scheme(select), image(image_picker), image_ratio(select), link_url(url), title(text), content(richtext), button_label(text), button_style(select), button_bottom_align(checkbox)

### main-login — “Login” (class: cc-main-login section section--template)
- settings (1): enable_shop_login_button(checkbox)

### main-order — no schema

### main-page — “Page” (class: cc-main-page section section--template)
- settings (2): show_page_title(checkbox), heading_align(select)

### main-password-header — “Password header” (class: cc-password-header)
- settings (3): logo(image_picker), logo_width(range), logo_position(select)

### main-password — “Password page” (class: cc-main-password section section--template)
- settings (6): heading(text), text(richtext), show_signup(checkbox), signup_heading(text), show_social(checkbox), show_powered_by(checkbox)

### main-product — “Product” (class: cc-main-product product-main)
- settings (26): stick_on_scroll(checkbox), select_first_variant(checkbox), sticky_atc_panel(checkbox), sticky_atc_position(select), sticky_atc_mobile(checkbox), media_layout(select), media_size(select), media_ratio(select), media_crop(select), enable_video_looping(checkbox), enable_zoom(checkbox), zoom_mode(select), enable_lightbox_mobile(checkbox), hover_zoom(select), stacked_scroll(radio), underline_active(checkbox), media_arrows(select), show_slide_count(checkbox), media_thumbs(select), lightbox_thumbnails(checkbox), thumb_ratio(select), thumb_crop(select), border_color(color), bg_color(color), enable_media_grouping(checkbox), media_grouping_option(text)
- block `@app` “”
- block `buy-buttons` “Buy buttons” limit 1: show_qty_selector(checkbox), enable_dynamic_checkout(checkbox), show_pickup_availability(checkbox), show_gift_card_recipient(checkbox)
- block `collapsible-content` “Collapsible content”: heading(text), icon(select), text(richtext), page(page), open(checkbox)
- block `custom-liquid` “Custom Liquid”: custom_liquid(liquid)
- block `divider` “Divider”: show_line(checkbox), spacing(select)
- block `link` “Link”: button_label(text), button_link(url), open_in_new_tab(checkbox), button_style(select)
- block `image` “Image”: title(text), image(image_picker), image_width(range), image_align(select), url(url)
- block `inventory-status` “Inventory status” limit 1: show_indicator_bar(checkbox), show_urgency_message(checkbox), text_very_low(richtext), text_low(richtext), text_normal(richtext), text_no_stock(richtext), text_no_stock_backordered(richtext)
- block `product-signup` “Product sign-up” limit 1: unavailable_only(checkbox), heading(text), text(richtext), divider(checkbox)
- block `newsletter-signup` “Newsletter sign-up” limit 1: heading(text), text(richtext)
- block `pop-up` “Pop-up”: link_text(text), link_style(select), text(richtext), page(page)
- block `weight` “Weight” limit 1
- block `barcode` “Barcode (ISBN, UPC, etc)” limit 1
- block `price` “Price” limit 1: show_tax_and_shipping(checkbox)
- block `rating` “Product rating” limit 1
- block `complementary` “Complementary products” limit 1: heading(text), products_to_show(range), layout(select)
- block `richtext` “Rich text”: text(richtext)
- block `share` “Share” limit 1: show_twitter(checkbox), show_facebook(checkbox), show_pinterest(checkbox)
- block `title` “Title” limit 1: show_weight(checkbox)
- block `variant-picker` “Variant picker” limit 1: selector_style(select), enable_dynamic_availability(checkbox), dynamic_availability_downwards(checkbox), show_backorder_text(checkbox), enable_size_chart(checkbox), size_chart_variant(text), size_chart_page(page)
- block `vendor-sku` “Vendor / SKU / Barcode” limit 1: show_vendor(checkbox), show_sku(checkbox), show_barcode(checkbox)
- block `type` “Product type” limit 1
- block `message` “Flash message”: icon(select), title(richtext), close(select), show_over_media(checkbox), visibility_duration(range), bg_color(color), text_color(color)
- block `description` “Description” limit 1: show_as_collapsible_content(checkbox), icon(select), open(checkbox)
- block `product-labels` “Product labels” limit 1: show_variant_icon(checkbox)
- block `custom-option` “Custom option”: show_in_quickbuy(checkbox), label(text), type(select), text_required(checkbox), long_text_required(checkbox), checkbox_checked_value(text), checkbox_unchecked_value(text), dropdown_options(textarea)

### main-register — “Register” (class: cc-main-register section section--template)

### main-reset_password — no schema

### main-search — “Search page” (class: cc-main-search section section--template)
- settings (21): show_search_title(checkbox), show_search_input(checkbox), heading_align(select), products_per_page(range), card_size(select), show_layout_toggle(checkbox), enable_filtering(checkbox), filters_open_lg(checkbox), stick_on_scroll(checkbox), show_filter_counts(checkbox), expand_filters(checkbox), max_filter_options(range), enable_sorting(checkbox), sort_first(checkbox), show_article_featured_image(checkbox), show_article_tags(checkbox), show_article_excerpt(checkbox), show_article_author(checkbox), show_article_date(checkbox), show_page_date(checkbox), show_page_excerpt(checkbox)

### media-grid — “Media grid” (tag: section; class: cc-gallery; disabled_on: {"groups": ["header", "footer", "aside"]}; presets: Media grid)
- settings (12): title(text), heading_align(select), button_label(text), button_link(url), gallery_cols_max(range), mobile_carousel(checkbox), gallery_cols_min(select), fixed_height_desktop(range), fixed_height_mobile(range), section_color_scheme(select), color_scheme(select), transparent_content_color(color)
- block `media` “Media” limit 16: image(image_picker), video_shopify(video), link_url(url), columns(range), rows(range), subheading(text), title(richtext), heading_size(select), button_label(text), button_link(url), overlay_position(select), text_alignment(select), button_style(select), tint_color(color), tint_opacity(range)

### media-with-text — “Media with text” (class: cc-media-with-text; disabled_on: {"groups": ["header", "footer", "aside"]}; presets: Media with text)
- settings (12): image(image_picker), video_shopify(video), video_external(text), video_description(text), video_autoplay(checkbox), layout(select), image_fit(select), media_width(range), media_scale(range), text_align(select), color_scheme(select), only_content_color_scheme(checkbox)
- block `subheading` “Subheading” limit 1: text(text)
- block `heading` “Heading” limit 1: heading(text), heading_size(select), heading_h1(checkbox)
- block `text` “Text” limit 1: text(richtext), enlarge_text(checkbox)
- block `button` “Button” limit 1: button_label(text), button_link(url), button_style(select)

### multi-column — “Multi-column” (class: cc-multi-column; disabled_on: {"groups": ["header", "footer", "aside"]}; presets: Multi-column)
- settings (11): title(text), heading_align(select), button_label(text), button_link(url), layout(select), column_size(select), column_align(select), media_align(select), image_ratio(select), color_scheme(select), button_style(select)
- block `column` “Column”: enable_media(checkbox), image(image_picker), video_shopify(video), media_scale(range), heading(text), text(richtext), button_label(text), button_link(url)

### navigation-slideshow — “Navigation slideshow” (tag: section; class: cc-nav-slideshow; disabled_on: {"groups": ["header", "footer", "aside"]}; presets: Navigation slideshow)
- settings (28): height_mode(select), fixed_height_desktop(range), fixed_height_mobile(range), quick_nav_menu(link_list), quick_nav_title(text), quick_nav_image_ratio(select), quick_nav_image_fit(select), quick_nav_use_product_image(checkbox), quick_nav_color_scheme(select), quick_nav_show_price(checkbox), menu_1_text(text), menu_1_display(select), menu_2_text(text), menu_2_display(select), menu_3_text(text), menu_3_display(select), nav_style(select), pagination_color(color), transition(select), autoplay(checkbox), slider_pause(checkbox), autoplay_speed(range), color_scheme(select), full_width(checkbox), tint_color(color), tint_opacity(range), accessibility_info(text), prevent_animation(checkbox)
- block `slide` “Slide” limit 5: image_desktop(image_picker), image_mobile(image_picker), overlay_text_align(select), mob_center_text(checkbox), subheading(text), heading(text), heading_size(select), heading_h1(checkbox), text(richtext), enlarge_text(checkbox), button_1_label(text), button_1_link(url), button_1_style(select), button_2_label(text), button_2_link(url), button_2_style(select), transparent_content_color(color)

### newsletter — “Email signup” (class: cc-newsletter; disabled_on: {"groups": ["header", "footer", "aside"]}; presets: Email signup)
- settings (8): overlay_position(select), text_align(select), image(image_picker), color_scheme(select), full_width(checkbox), transparent_content_color(color), tint_color(color), tint_opacity(range)
- block `subheading` “Subheading” limit 1: text(text)
- block `heading` “Heading” limit 1: heading(text), heading_size(select)
- block `text` “Text” limit 1: text(richtext), enlarge_text(checkbox)
- block `form` “Form” limit 1

### pickup-availability — no schema

### pop-up — “Pop-up” (tag: section; class: cc-pop-up; disabled_on: {"groups": ["header", "footer"]}; presets: Pop-up)
- settings (15): trigger(select), delay(range), show_to_guests_only(checkbox), show_on_mobile(checkbox), dismiss_days(range), position(select), text_align(select), padding(select), shrink_width(checkbox), bg_image(image_picker), heading_color(color), text_color(color), bg_color(color), bg_grad(color_background), tint_opacity(range)
- block `@app` “”
- block `heading` “Heading” limit 1: heading(text), heading_size(select)
- block `subheading` “Subheading” limit 1: text(text)
- block `text` “Text” limit 2: text(richtext), text_size(select)
- block `image` “Image” limit 1: image(image_picker), image_position_desktop(select), image_position_mobile(select)
- block `button` “Button” limit 1: button_1_label(text), button_1_style(select), button_1_link(url), btn_1_bg_color(color), btn_1_text_color(color), button_2_label(text), button_2_style(select), button_2_link(url), btn_2_bg_color(color), btn_2_text_color(color)
- block `newsletter-signup` “Email sign-up” limit 1
- block `social` “Social links” limit 1
- block `countdown` “Countdown timer” limit 1: end_date(text), end_time(text), end_text(richtext), enlarge_end_text(checkbox), hide_on_end(checkbox), countdown_size(select), use_custom_colors(checkbox), count_color(color), count_bg_color(color), count_bg_grad(color_background)
- block `discount` “Discount code” limit 1: discount_code(text)

### predictive-search — no schema

### product-compare-basket — no schema

### product-compare — “Product compare” (class: cc-compare; max_blocks: 16)
- block `image` “Featured image” limit 1: show_line(checkbox)
- block `vendor` “Vendor” limit 1: show_line(checkbox)
- block `title` “Title” limit 1: show_line(checkbox)
- block `type` “Type” limit 1: show_line(checkbox)
- block `price` “Price” limit 1: show_line(checkbox)
- block `variants` “Variants” limit 1: show_line(checkbox)
- block `description` “Description” limit 1: truncate_description(checkbox), words_to_show(range), show_line(checkbox)
- block `weight` “Weight” limit 1: show_line(checkbox)
- block `rating` “Rating” limit 1: show_line(checkbox)
- block `metafield` “Metafields” limit 1: metafields(textarea), line(select)

### product-comparison-grid — “Product comparison grid” (tag: section; class: cc-product-comparison-grid; disabled_on: {"groups": ["header", "footer", "aside"]}; presets: Product comparison grid)
- settings (12): heading(text), text(richtext), heading_align(select), view_more_label(text), view_more_link(url), product_list(product_list), empty_field_text(text), image_ratio(select), image_crop(select), num_rows(range), color_scheme(select), highlight_row(checkbox)
- block `product` “Product summary” limit 1: show_image(checkbox), show_title(checkbox), show_button(checkbox)
- block `vendor` “Vendor” limit 1
- block `title` “Title” limit 1
- block `type` “Type” limit 1
- block `price` “Price” limit 1
- block `variants` “All variant options” limit 1
- block `variant_option` “Variant option”: title(text)
- block `description` “Description” limit 1: truncate_description(checkbox), words_to_show(range)
- block `rating` “Rating” limit 1
- block `weight` “Weight” limit 1
- block `text` “Text”: title(text), value(text)
- block `metafield` “Metafield”: title(text), metafield_key(text)

### product-details — “Product details” (class: cc-product-details product-details section)
- block `@app` “”
- block `custom-liquid` “Custom Liquid”: custom_liquid(liquid)
- block `divider` “Divider”: show_line(checkbox), spacing(select)
- block `richtext` “Rich text”: text(richtext)
- block `tabs` “Tabs” limit 1: style(select), open_first(checkbox), show_description(checkbox), show_reviews(checkbox), custom_reviews(liquid), show_specification(checkbox), spec_metafields(textarea), spec_right_align(checkbox), spec_show_empty_metafields(checkbox), spec_empty_field_text(text), tab_1_title(text), tab_1_text(richtext), tab_1_page(page), tab_2_title(text), tab_2_text(richtext), tab_2_page(page), tab_3_title(text), tab_3_text(richtext), tab_3_page(page)
- block `highlight-text` “Highlight text”: title(text), text(richtext)
- block `payment-methods` “Payment methods” limit 1: title(text), title1(text), show_payment_icons(checkbox), text1(richtext), title2(text), image(image_picker), text2(richtext)

### product-features — “Product features” (tag: section; class: cc-product-features; max_blocks: 5; disabled_on: {"groups": ["header", "footer", "aside"]}; presets: Product features)
- settings (15): product(product), show_content(checkbox), layout(select), text_align(select), mob_center_text(checkbox), heading_size(select), enlarge_text(checkbox), image(image_picker), title(text), description(richtext), button_label(text), button_link(url), hotspot_color(color), color_scheme(select), button_style(select)
- block `feature` “Feature”: image(image_picker), heading(text), text(richtext), content_align(select), hotspot_x(range), hotspot_y(range)

### product-list — “Product list” (tag: section; class: cc-featured-collection cc-product-card-grid; disabled_on: {"templates": ["password"], "groups": ["header", "footer", "aside"]}; presets: Product list)
- settings (17): title(text), heading_align(select), view_all_url(url), product_list(product_list), layout(select), card_size_mobile(select), card_size(select), show_highlight_products(checkbox), show_promo_info(checkbox), image(image_picker), image_ratio(select), promo_title(text), content(richtext), link_url(url), button_label(text), color_scheme(select), button_style(select)

### product-recommendations — “Related products” (tag: section; class: cc-product-recommendations cc-product-card-grid)
- settings (6): heading(text), heading_align(select), layout(select), card_size_mobile(select), card_size(select), products_to_show(range)

### promo-grid — “Promo grid” (tag: section; class: cc-gallery cc-promo-gallery; disabled_on: {"groups": ["header", "footer", "aside"]}; presets: Promo grid)
- settings (11): title(text), heading_align(select), button_label(text), button_link(url), gallery_cols_max(range), mobile_carousel(checkbox), gallery_cols_min(select), fixed_height_desktop(range), fixed_height_mobile(range), text_overlay_font(select), color_scheme(select)
- block `media` “Media” limit 16: image(image_picker), video_shopify(video), link_url(url), columns(range), rows(range), line1_text(text), line1_text_type_scale(select), line2_text(text), line2_text_type_scale(select), line3_text(text), line3_text_type_scale(select), overlay_position(select), text_alignment(select), promo_circle(checkbox), background_color(color), text_color(color), subheading(text), link_text(text), text_type_scale(select), tint_color(color), tint_opacity(range)

### promo-strip — “Promo strip” (class: cc-promo-strip; disabled_on: {"groups": ["aside"]}; presets: Promo strip)
- settings (5): section_height(select), color_scheme(select), full_width(checkbox), dividers(select), prevent_animation(checkbox)
- block `heading` “Heading” limit 1: heading(text), heading_size(select), show_on_mobile(checkbox), show_on_desktop(checkbox)
- block `text` “Text” limit 1: text(richtext), enlarge_text(checkbox), show_on_mobile(checkbox), show_on_desktop(checkbox)
- block `button` “Button” limit 1: button_label(text), button_link(url), button_style(select)
- block `discount` “Discount code” limit 1: discount_code(text)

### recently-viewed — “Recently viewed products” (tag: section; class: cc-recently-viewed cc-product-card-grid; disabled_on: {"groups": ["header", "footer", "aside"]}; presets: Recently viewed products)
- settings (6): heading(text), heading_align(select), layout(select), card_size_mobile(select), card_size(select), limit(range)

### rich-text — “Rich text” (class: cc-rich-text; disabled_on: {"groups": ["header", "footer", "aside"]}; presets: Rich text)
- settings (7): text_position(select), text_align(select), mob_center_text(checkbox), wide(checkbox), color_scheme(select), full_width(checkbox), prevent_animation(checkbox)
- block `heading` “Heading” limit 1: heading(text), heading_size(select), heading_h1(checkbox)
- block `subheading` “Subheading” limit 1: text(text)
- block `text` “Text” limit 1: text(richtext), enlarge_text(checkbox)
- block `button` “Button” limit 1: button_1_label(text), button_1_link(url), button_1_style(select), button_2_label(text), button_2_link(url), button_2_style(select)

### scrolling-banner — “Scrolling banner” (tag: section; class: cc-scrolling-banner; max_blocks: 16; disabled_on: {"groups": ["aside"]}; presets: Scrolling banner)
- settings (8): section_height(select), spacing(range), speed(range), direction(select), pausable(checkbox), color_scheme(select), dividers(select), prevent_animation(checkbox)
- block `text` “Text”: text(text), link(url), font(select), heading_size(select)
- block `icon` “Icon”: icon(select), icon_size(range)
- block `image` “Image”: image(image_picker), image_height(range), link(url)
- block `button` “Button”: button_label(text), button_link(url), button_style(select)

### shoppable-image — “Shoppable image” (tag: section; class: cc-shoppable-image; max_blocks: 3; disabled_on: {"groups": ["header", "footer", "aside"]}; presets: Shoppable image)
- settings (12): image(image_picker), layout(select), show_vendor(checkbox), show_content(checkbox), mob_center_text(checkbox), heading(text), text(richtext), button_label(text), button_link(url), hotspot_color(color), color_scheme(select), button_style(select)
- block `hotspot` “Hotspot”: product(product), hotspot_x(range), hotspot_y(range)

### slideshow — “Slideshow” (tag: section; class: cc-slideshow; disabled_on: {"groups": ["header", "footer", "aside"]}; presets: Slideshow)
- settings (17): height_mode(select), fixed_height_desktop(range), fixed_height_mobile(range), mobile_stacked(checkbox), nav_style(select), pagination_color(color), nav_position(select), transition(select), autoplay(checkbox), slider_pause(checkbox), autoplay_speed(range), color_scheme(select), full_width(checkbox), tint_color(color), tint_opacity(range), accessibility_info(text), prevent_animation(checkbox)
- block `slide` “Slide” limit 5: image_desktop(image_picker), image_mobile(image_picker), url(url), overlay_position(select), overlay_text_align(select), mob_center_text(checkbox), subheading(text), heading(text), heading_size(select), heading_h1(checkbox), text(richtext), enlarge_text(checkbox), button_1_label(text), button_1_link(url), button_1_style(select), button_2_label(text), button_2_link(url), button_2_style(select), transparent_content_color(color), countdown_show(checkbox), countdown_end_date(text), countdown_end_time(text), countdown_end_text(richtext), enlarge_end_text(checkbox), countdown_hide_on_end(checkbox), use_custom_colors(checkbox), count_color(color), bg_color(color), bg_grad(color_background)

### testimonials — “Testimonials” (tag: section; class: cc-testimonials; disabled_on: {"groups": ["header", "footer", "aside"]}; presets: Testimonials)
- settings (12): heading(text), show_quotes(checkbox), testimonial_size(select), text_position(select), text_align(select), nav_style(select), transition(select), autoplay(checkbox), slider_pause(checkbox), autoplay_speed(range), color_scheme(select), full_width(checkbox)
- block `testimonial` “Testimonial” limit 5: testimonial(richtext), author(text), author_info(text), author_image(image_picker), show_star_rating(checkbox), star_rating(range)

### video — “Video” (class: cc-video; disabled_on: {"groups": ["header", "footer", "aside"]}; presets: Video)
- settings (8): video_shopify(video), video_external(text), video_description(text), poster_image(image_picker), video_size(select), video_autoplay(checkbox), text_align(select), color_scheme(select)
- block `heading` “Heading” limit 1: heading(text), heading_size(select), heading_h1(checkbox)
- block `subheading` “Subheading” limit 1: text(text)
- block `text` “Text” limit 1: text(richtext), enlarge_text(checkbox)
- block `button` “Button” limit 1: button_label(text), button_link(url), button_style(select)

## 3. Theme blocks (blocks/)

- `ai_gen_block_5d29ae5` “B2B login page”: heading(inline_richtext), subheading(inline_richtext), button_text(text), button_link(url), request_text(text), request_link(url), desktop_width_percent(range), max_content_width(range), vertical_padding(range), horizontal_padding(range), content_padding(range), border_radius(range), box_shadow_enabled(checkbox), background_color(color), heading_color(color), subheading_color(color), heading_size(range), heading_spacing(range), subheading_size(range), subheading_spacing(range), button_bg_color(color), button_text_color(color), button_hover_bg_color(color), button_hover_text_color(color), button_border_color(color), button_hover_border_color(color), button_font_size(range), button_padding_vertical(range), button_padding_horizontal(range), button_border_radius(range), button_border_width(range), button_spacing(range), link_color(color), link_hover_color(color), link_font_size(range)

## 4. Section groups

- `footer-group.json`: apps > footer
- `header-group.context.b2b-wholesale.json` (context: {'market': 'b2b-wholesale'}): overrides only
- `header-group.context.rest-of-world.json` (context: {'market': 'rest-of-world'}): overrides only
- `header-group.json`: announcement > header
- `overlay-group.json`: cart-drawer > product-compare > pop-up [off]

## 5. Templates

- `404.json`: main-404
- `article.json`: main-article > article-comments
- `blog.json`: main-blog
- `cart.json`: main-cart
- `collection.flash-sale.json`: main-collection-banner [off] > countdown-timer > main-collection-products > promo-strip > collection-list
- `collection.json`: main-collection-banner > main-collection-products
- `collection.party-wear.json`: image-banner > main-collection-banner [off] > main-collection-products
- `collection.summer-dress.json`: image-banner > main-collection-banner [off] > main-collection-products
- `collection.summer-hand-bag.json`: image-banner > main-collection-banner [off] > main-collection-products
- `collection.summer-jacket-vests.json`: image-banner > main-collection-banner [off] > main-collection-products
- `collection.summer-sale.json`: image-banner > main-collection-banner [off] > main-collection-products
- `collection.winter-dresses.json`: image-banner > main-collection-banner [off] > main-collection-products
- `collection.winter-jacket-and-vest.json`: image-banner > main-collection-banner [off] > main-collection-products
- `collection.winter-last-chance.json`: image-banner > main-collection-banner [off] > main-collection-products
- `collection.winter-long-coats.json`: image-banner > main-collection-banner [off] > main-collection-products
- `customers/account.json`: main-account
- `customers/activate_account.json`: main-activate_account
- `customers/addresses.json`: main-addresses
- `customers/login.json`: main-login
- `customers/order.json`: main-order
- `customers/register.json`: main-register
- `customers/reset_password.json`: main-reset_password
- `index.context.b2b-wholesale.json`: override of index.json for {'market': 'b2b-wholesale'}
- `index.json`: background-video [off] > collection-list [off] > video [off] > featured-collection [off] > slideshow [off] > image-banner > scrolling-banner > featured-collection > collection-list > image-banner > featured-collection > media-with-text > image-banner > featured-collection > video > icons-with-text > apps
- `list-collections.json`: main-list-collections
- `page.about-us.json`: main-page [off] > custom-liquid
- `page.b2b-en-onbord.json`: main-page [off] > custom-liquid > apps > custom-liquid > custom-liquid [off]
- `page.b2b-login.json`: _blocks > main-page
- `page.b2b-request-form.json`: main-page [off] > apps
- `page.comming-soon.json`: main-page [off] > image-banner
- `page.contact.json`: main-contact [off] > contact-form > custom-liquid
- `page.custom-payment-page.json`: main-page [off] > custom-liquid
- `page.faqs.json`: main-page [off] > image-banner > faq > contact-form > featured-collection > newsletter
- `page.json`: main-page
- `page.lookbook.json`: main-page [off] > image-banner > rich-text > promo-grid > shoppable-image > featured-collection > media-grid > featured-collection > promo-grid > image-banner
- `page.perfume.json`: main-page [off] > image-banner > featured-collection
- `page.privacy-policy.json`: main-page [off] > custom-liquid
- `page.return-refund-and-exchan.json`: main-page [off] > custom-liquid
- `page.reviews.json`: main-page [off] > gn-reviews-wall
- `page.shipping-calculator.json`: main-page
- `page.shipping-policy.json`: main-page [off] > custom-liquid
- `page.summer-dress.json`: main-page
- `page.terms-of-service.json`: main-page [off] > custom-liquid
- `password.json`: main-password
- `product.coming-soon.json`: main-product > video > product-details > scrolling-banner > newsletter > product-recommendations
- `product.context.b2b-wholesale.json`: override of product.json for {'market': 'b2b-wholesale'}
- `product.context.rest-of-world.json`: override of product.json for {'market': 'rest-of-world'}
- `product.countdown.json`: countdown-timer > main-product > video > product-details > scrolling-banner > newsletter > product-recommendations
- `product.dress.json`: main-product > product-details [off] > product-features [off] > product-comparison-grid [off] > collection-list [off] > image-banner [off] > product-recommendations > recently-viewed
- `product.hand-bag.json`: main-product > product-details [off] > product-features [off] > product-comparison-grid [off] > collection-list [off] > image-banner [off] > product-recommendations > recently-viewed
- `product.json`: main-product > product-details [off] > product-features [off] > product-comparison-grid [off] > apps [off] > collection-list [off] > image-banner [off] > apps [off] > gn-product-reviews > product-recommendations > recently-viewed
- `product.perfume.json`: main-product > product-details [off] > product-features [off] > product-comparison-grid [off] > collection-list [off] > image-banner [off] > product-recommendations > recently-viewed
- `product.preorder.json`: main-product > product-details > product-recommendations
- `search.json`: main-search
- `gift_card.liquid` (Liquid template; legacy app endpoint, see brief 4.9)
- `search.bss.b2b.liquid` (Liquid template; legacy app endpoint, see brief 4.9)

## 6. Locales

de.json, en.default.json, es.json, fr.json, it.json, ja.json, nl.json, pt-PT.json
