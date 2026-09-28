// Source for config/settings_schema.json. Labels are plain English here; scripts/build-schema.mjs
// turns them into t: keys and writes locales/en.default.schema.json (+ es via scripts/i18n/es-schema.json).
const opt = (pairs) => pairs.map(([value, label]) => ({ value, label }));
const range = (id, label, min, max, step, def, unit, info) => ({ type: 'range', id, label, min, max, step, default: def, ...(unit ? { unit } : {}), ...(info ? { info } : {}) });
const check = (id, label, def = false, info) => ({ type: 'checkbox', id, label, default: def, ...(info ? { info } : {}) });
const color = (id, label, def) => ({ type: 'color', id, label, default: def });
const text = (id, label, def, info) => ({ type: 'text', id, label, ...(def != null ? { default: def } : {}), ...(info ? { info } : {}) });
const select = (id, label, options, def, info) => ({ type: 'select', id, label, options: opt(options), default: def, ...(info ? { info } : {}) });
const header = (content, info) => ({ type: 'header', content, ...(info ? { info } : {}) });
const para = (content) => ({ type: 'paragraph', content });

const labelIcons = [['none', 'None'], ['tag', 'Tag'], ['percent', 'Percent'], ['star', 'Star'], ['clock', 'Clock'], ['check', 'Check'], ['sparkle', 'Sparkle']];
const ratios = [['natural', 'Natural'], ['square', 'Square (1:1)'], ['portrait', 'Portrait (4:5)'], ['tall', 'Tall (3:4)'], ['landscape', 'Landscape (4:3)']];

export default [
  {
    name: 'theme_info',
    theme_name: 'Weft',
    theme_version: '1.0.0',
    theme_author: 'GROW NEST',
    theme_documentation_url: 'https://grownest.pro',
    theme_support_url: 'https://grownest.pro'
  },
  {
    name: 'Logo and favicon',
    settings: [
      { type: 'image_picker', id: 'logo', label: 'Logo' },
      range('logo_width', 'Logo width on large screens', 50, 300, 5, 160, 'px'),
      range('logo_width_mobile', 'Logo width on mobile', 40, 200, 4, 100, 'px'),
      { type: 'image_picker', id: 'favicon', label: 'Favicon', info: 'Scaled down to 32 x 32px.' }
    ]
  },
  {
    name: 'Colors',
    settings: [
      {
        type: 'color_scheme_group',
        id: 'color_schemes',
        definition: [
          color('background', 'Background', '#FFFFFF'),
          { type: 'color_background', id: 'background_gradient', label: 'Background gradient', info: 'Replaces the background color where supported.' },
          color('text', 'Text', '#2A2B2A'),
          color('heading', 'Headings', '#2A2B2A'),
          color('muted', 'Secondary text', '#6B6B6B'),
          color('surface', 'Panels and image backgrounds', '#F4F4F4'),
          color('line', 'Borders and dividers', '#E7E7E7'),
          color('link', 'Links', '#2A2B2A'),
          color('button_bg', 'Primary button', '#FBD816'),
          color('button_text', 'Primary button text', '#0F1111'),
          color('button_hover', 'Primary button hover', '#E8C70F'),
          color('button_secondary_bg', 'Secondary button', '#FFFFFF'),
          color('button_secondary_text', 'Secondary button text and border', '#2A2B2A')
        ],
        role: {
          text: 'text',
          background: { solid: 'background', gradient: 'background_gradient' },
          links: 'link',
          icons: 'text',
          primary_button: 'button_bg',
          on_primary_button: 'button_text',
          primary_button_border: 'button_bg',
          secondary_button: 'button_secondary_bg',
          on_secondary_button: 'button_secondary_text',
          secondary_button_border: 'button_secondary_text'
        }
      },
      { type: 'color_scheme', id: 'drawer_color_scheme', label: 'Drawers and pop-ups', default: 'scheme-1' },
      header('Accents', 'Status colors are always shown together with a text label.'),
      color('color_sale', 'Sale', '#AA1155'),
      color('color_star', 'Rating stars', '#FBD816'),
      color('color_stock_ok', 'In stock', '#15803D'),
      color('color_stock_low', 'Low stock and backorder', '#B45309'),
      color('color_stock_out', 'Sold out and errors', '#B91C1C'),
      color('color_success', 'Success text', '#15803D'),
      color('color_success_bg', 'Success background', '#EAF6EE'),
      color('color_error', 'Error text', '#B91C1C'),
      color('color_error_bg', 'Error background', '#FCEDEE'),
      color('color_info', 'Information text', '#2A2B2A'),
      color('color_info_bg', 'Information background', '#F4F4F4'),
      color('color_installments_tint', 'Installments row tint', '#FFF5F8'),
      color('color_disabled_bg', 'Disabled button', '#E5E5E5'),
      color('color_disabled_text', 'Disabled button text', '#767676'),
      header('Images'),
      check('image_blend_products', 'Blend product images with the background'),
      check('image_blend_collections', 'Blend collection images with the background'),
      color('image_blend_color', 'Blend color', '#F4F4F4')
    ]
  },
  {
    name: 'Typography',
    settings: [
      header('Headings'),
      { type: 'font_picker', id: 'heading_font', label: 'Font', default: 'cormorant_n6' },
      range('heading_scale', 'Heading size', 80, 130, 5, 100, '%'),
      check('heading_uppercase', 'Uppercase headings'),
      check('subheading_uppercase', 'Uppercase subheadings'),
      header('Body'),
      { type: 'font_picker', id: 'body_font', label: 'Font', default: 'jost_n4' },
      range('body_size', 'Base size', 14, 18, 1, 16, 'px'),
      header('Navigation and buttons'),
      select('navigation_font_source', 'Navigation font', [['body', 'Body font'], ['heading', 'Heading font']], 'body', 'Uses one of the two fonts above, so pages load no extra font file.'),
      check('button_uppercase', 'Uppercase button text')
    ]
  },
  {
    name: 'Layout and design',
    settings: [
      range('page_width', 'Maximum page width', 1000, 2000, 20, 1260, 'px'),
      select('page_width_wide', 'Page width on wide screens', [['off', 'Same as maximum page width'], ['1920', '1920 px'], ['2000', '2000 px'], ['full', 'Full width']], 'off', 'Takes over from 1440 px wide, so large monitors use the extra space. 2000 px starts at 1700 px wide, with 1920 px before that.'),
      range('gutter_desktop', 'Side padding on large screens', 32, 80, 8, 32, 'px', 'From 1280 px wide. Smaller screens use 20 or 32 px.'),
      range('section_spacing', 'Space between sections', 24, 120, 4, 80, 'px', 'Mobile uses 60% of this value.'),
      header('Shapes'),
      select('border_width', 'Button and input border', [['1', '1 px'], ['2', '2 px']], '1'),
      range('radius_button', 'Button corner radius', 0, 30, 2, 26, 'px'),
      range('radius_input', 'Input corner radius', 0, 30, 2, 26, 'px'),
      range('radius_card', 'Card and panel corner radius', 0, 24, 2, 16, 'px'),
      range('radius_media', 'Image corner radius', 0, 24, 2, 0, 'px'),
      range('radius_drawer', 'Drawer corner radius', 0, 24, 2, 16, 'px'),
      range('radius_modal', 'Pop-up corner radius', 0, 24, 2, 16, 'px'),
      header('Carousels'),
      select('carousel_arrows', 'Arrow buttons on large screens', [['always', 'Always'], ['hover', 'On hover'], ['never', 'Never']], 'always'),
      select('carousel_arrow_style', 'Arrow button style', [['outline', 'Outline'], ['solid', 'Solid']], 'outline'),
      select('carousel_step', 'Scroll per arrow click', [['slide', 'One item'], ['page', 'One page']], 'slide'),
      header('Accordions'),
      select('accordion_icon', 'Toggle icon', [['plus', 'Plus and minus'], ['chevron', 'Chevron']], 'plus'),
      header('Breadcrumbs'),
      check('breadcrumbs_product', 'Products', true),
      check('breadcrumbs_collection', 'Collections', true),
      check('breadcrumbs_list_collections', 'Collection list', true),
      check('breadcrumbs_article', 'Blog posts', true),
      check('breadcrumbs_blog', 'Blogs', true),
      check('breadcrumbs_blog_rss', 'RSS link in blog breadcrumbs', true),
      header('Pagination'),
      select('pagination_style', 'Style', [['numbers', 'Page numbers'], ['load_more', 'Load more button'], ['infinite', 'Infinite scroll']], 'numbers')
    ]
  },
  {
    name: 'Collection cards',
    settings: [
      select('collection_card_ratio', 'Image aspect ratio', ratios, 'square'),
      select('collection_card_fit', 'Image fit', [['cover', 'Fill'], ['contain', 'Fit']], 'cover'),
      select('collection_card_image_position', 'Image position', [['center', 'Center'], ['top', 'Top'], ['bottom', 'Bottom']], 'center'),
      select('collection_card_text_align', 'Text alignment', [['start', 'Start'], ['center', 'Center']], 'center'),
      check('collection_card_show_link', 'Show "View collection" link', true),
      color('collection_card_label_color', 'Label color', '#2A2B2A'),
      color('collection_card_bg', 'Image background', '#F4F4F4'),
      color('collection_card_border', 'Image border', '#E7E7E7')
    ]
  },
  {
    name: 'Product cards',
    settings: [
      select('card_ratio', 'Image aspect ratio', ratios, 'tall'),
      select('card_fit', 'Image fit', [['cover', 'Fill'], ['contain', 'Fit']], 'cover'),
      select('card_image_position', 'Image position', [['center', 'Center'], ['top', 'Top'], ['bottom', 'Bottom']], 'center'),
      select('card_hover', 'Additional images', [['none', 'None'], ['second_image', 'Second image on hover'], ['slideshow', 'Slideshow on hover']], 'second_image'),
      check('card_show_swatches', 'Show swatches', true),
      check('card_show_rating', 'Show rating', true),
      check('card_show_vendor', 'Show vendor'),
      check('card_show_subtitle', 'Show subtitle'),
      text('card_subtitle_metafield', 'Subtitle metafield', 'custom.subtitle', 'Namespace and key of a single-line text metafield.'),
      check('card_show_weight', 'Show weight'),
      check('card_show_inventory', 'Show inventory'),
      check('card_price_bottom', 'Align price to the bottom'),
      check('card_url_in_collection', 'Keep the collection in product links', true),
      header('Quick add'),
      check('quick_add_enable', 'Enable quick add', true),
      select('quick_add_style_mobile', 'Style on mobile', [['icon', 'Icon button'], ['text', 'Text link'], ['none', 'Hidden']], 'text'),
      select('quick_add_style_desktop', 'Style on large screens', [['text', 'Text link'], ['button', 'Button'], ['hover_button', 'Button on hover']], 'text'),
      check('quick_add_sticky_footer', 'Keep the quick add buttons in view', true),
      header('Style'),
      check('card_dividers', 'Dividing lines between cards'),
      check('card_boxed', 'Show cards as boxes'),
      color('card_bg', 'Box background', '#FFFFFF'),
      color('card_text', 'Box text', '#2A2B2A'),
      color('card_border', 'Box border', '#E7E7E7'),
      header('Highlighted products', 'Collection sections can highlight products with a tag.'),
      text('card_highlight_tag', 'Highlight tag', 'highlight'),
      color('card_highlight_bg', 'Highlight background', '#F4F4F4'),
      color('card_highlight_text', 'Highlight text', '#2A2B2A'),
      color('card_highlight_border', 'Highlight border', '#E7E7E7')
    ]
  },
  {
    name: 'Product compare',
    settings: [
      check('compare_enable', 'Enable product compare'),
      select('compare_toggle', 'Compare control on cards', [['switch', 'Switch'], ['checkbox', 'Checkbox']], 'checkbox'),
      range('compare_max', 'Maximum products', 2, 5, 1, 4),
      select('compare_column_width', 'Column width on large screens', [['narrow', 'Narrow'], ['medium', 'Medium'], ['wide', 'Wide']], 'medium'),
      check('compare_show_empty', 'Show rows without data', true),
      text('compare_empty_text', 'Text for empty fields', '–'),
      { type: 'textarea', id: 'compare_metafields', label: 'Extra rows from metafields', info: 'One per line: Label = namespace.key, for example "Material = custom.material".' }
    ]
  },
  {
    name: 'Product inventory',
    settings: [
      range('stock_low_threshold', 'Low stock threshold', 1, 50, 1, 8, null, 'Retail shoppers see "Only a few left" at or below this number. Exact counts are never shown to retail shoppers unless you choose so below.'),
      range('stock_very_low_threshold', 'Very low stock threshold', 1, 10, 1, 2),
      range('stock_wholesale_low_threshold', 'Wholesale low stock threshold', 1, 50, 1, 10, null, 'Wholesale buyers see exact counts; at or below this number the count is marked as low.'),
      select('stock_notice', 'Show stock notice on cards', [['always', 'Always'], ['low', 'When low'], ['never', 'Never']], 'low'),
      select('stock_show_count', 'Show exact count to retail shoppers', [['always', 'Always'], ['low', 'When low'], ['never', 'Never']], 'never'),
      check('stock_hide_backorder_notice', 'Hide the backorder notice')
    ]
  },
  {
    name: 'Product labels',
    settings: [
      select('label_card_position', 'Position on product cards', [['top_start', 'Top start'], ['top_end', 'Top end'], ['bottom_start', 'Bottom start'], ['bottom_end', 'Bottom end']], 'top_start'),
      header('Sale'),
      check('label_sale_show', 'Show sale label', true),
      select('label_sale_type', 'Content', [['text', 'Text'], ['percent', 'Percentage saved'], ['amount', 'Amount saved']], 'text'),
      select('label_sale_icon', 'Icon', labelIcons, 'none'),
      color('label_sale_bg', 'Background', '#AA1155'),
      color('label_sale_text', 'Text', '#FFFFFF'),
      header('Sold out'),
      check('label_sold_out_show', 'Show sold out label', true),
      select('label_sold_out_icon', 'Icon', labelIcons, 'none'),
      color('label_sold_out_bg', 'Background', '#2A2B2A'),
      color('label_sold_out_text', 'Text', '#FFFFFF'),
      header('New'),
      check('label_new_show', 'Show new label', true),
      select('label_new_icon', 'Icon', labelIcons, 'none'),
      color('label_new_bg', 'Background', '#FFFFFF'),
      color('label_new_text', 'Text', '#2A2B2A'),
      check('label_new_by_collection', 'Products in these collections'),
      { type: 'collection_list', id: 'label_new_collections', label: 'Collections', limit: 10 },
      check('label_new_by_tag', 'Products with this tag', true),
      text('label_new_tag', 'Tag', 'new'),
      check('label_new_by_age', 'Products published recently'),
      range('label_new_days', 'Published within', 1, 90, 1, 14, 'd'),
      header('Pre-order'),
      select('label_preorder_icon', 'Icon', labelIcons, 'none'),
      color('label_preorder_bg', 'Background', '#F4F4F4'),
      color('label_preorder_text', 'Text', '#2A2B2A'),
      header('Custom'),
      check('label_custom_show', 'Show custom label', true),
      text('label_custom_metafield', 'Label metafield', 'custom.label', 'Namespace and key of a single-line text metafield. Its text becomes the label.'),
      select('label_custom_icon', 'Icon', labelIcons, 'none'),
      color('label_custom_bg', 'Background', '#F4F4F4'),
      color('label_custom_text', 'Text', '#2A2B2A')
    ]
  },
  {
    name: 'Swatches',
    settings: [
      text('swatch_option_names', 'Color option names', 'Color,Colour,Couleur,Farbe,Colore,Kleur,Cor,色', 'Separate names with commas. Options with these names show swatches.'),
      header('Product page'),
      select('swatch_product_style', 'Swatch content', [['variant_image', 'Variant image'], ['color', 'Color'], ['button', 'Text button']], 'variant_image'),
      select('swatch_product_shape', 'Shape', [['square', 'Square'], ['circle', 'Circle'], ['portrait', 'Portrait']], 'square'),
      range('swatch_product_size', 'Size', 32, 72, 4, 48, 'px'),
      header('Product cards'),
      select('swatch_card_style', 'Swatch content', [['variant_image', 'Variant image'], ['color', 'Color'], ['none', 'None']], 'color'),
      select('swatch_card_shape', 'Shape', [['circle', 'Circle'], ['square', 'Square']], 'circle'),
      range('swatch_card_size', 'Size', 16, 40, 2, 20, 'px'),
      header('Filters'),
      select('swatch_filter_style', 'Color filters', [['color', 'Swatches'], ['none', 'Text only']], 'color'),
      { type: 'textarea', id: 'swatch_color_list', label: 'Fallback colors', info: 'Used when Shopify has no swatch for a value. One per line, for example "Ecru: #E6DCC6".' }
    ]
  },
  {
    name: 'Social media',
    settings: [
      para('Links show in the footer and on the password page.'),
      text('social_instagram_url', 'Instagram'),
      text('social_facebook_url', 'Facebook'),
      text('social_tiktok_url', 'TikTok'),
      text('social_pinterest_url', 'Pinterest'),
      text('social_youtube_url', 'YouTube'),
      text('social_twitter_url', 'X (formerly Twitter)'),
      text('social_threads_url', 'Threads'),
      text('social_linkedin_url', 'LinkedIn'),
      text('social_snapchat_url', 'Snapchat'),
      text('social_whatsapp_url', 'WhatsApp', null, 'A wa.me link, for example https://wa.me/34600000000. Also used by the chat button.'),
      text('social_wechat_url', 'WeChat'),
      text('social_vimeo_url', 'Vimeo'),
      text('social_tumblr_url', 'Tumblr'),
      text('social_twitch_url', 'Twitch'),
      text('social_spotify_url', 'Spotify'),
      text('social_discord_url', 'Discord'),
      text('social_mastodon_url', 'Mastodon'),
      header('Custom network'),
      { type: 'image_picker', id: 'social_custom_icon', label: 'Icon' },
      text('social_custom_url', 'Link'),
      header('Chat button', 'A floating button that opens WhatsApp with the page link filled in.'),
      check('chat_button_enable', 'Show chat button'),
      text('chat_button_message', 'Message', 'Hello, I have a question about this page:'),
      text('chat_button_hide_on', 'Hide on pages', null, 'Page handles separated by commas.')
    ]
  },
  {
    name: 'Search',
    settings: [
      check('predictive_search_enable', 'Enable predictive search', true),
      range('predictive_search_limit', 'Results per type', 2, 10, 1, 5),
      check('predictive_search_show_price', 'Show price', true),
      check('predictive_search_show_vendor', 'Show vendor', true),
      check('predictive_search_skus', 'Search SKUs', true),
      check('predictive_search_tags', 'Search tags', true),
      check('search_type_filter', 'Product type filter in the search field'),
      header('Prompts', 'Prompts rotate inside the empty search field.'),
      text('search_placeholder_1', 'Prompt 1', 'Search products'),
      text('search_placeholder_2', 'Prompt 2'),
      text('search_placeholder_3', 'Prompt 3'),
      check('search_placeholders_mobile', 'Rotate prompts on mobile'),
      select('search_font', 'Search field font', [['body', 'Body font'], ['heading', 'Heading font']], 'body'),
      header('Voice search'),
      check('voice_search_enable', 'Enable voice search', true, 'Shows a microphone button in browsers that support speech recognition.'),
      color('voice_search_color', 'Listening indicator', '#B91C1C')
    ]
  },
  {
    name: 'Currency format',
    settings: [
      check('currency_code_enable', 'Show currency codes', false, 'Useful when you sell in several currencies with the same symbol.'),
      check('currency_superscript', 'Show cents as superscript')
    ]
  },
  {
    name: 'Cart',
    settings: [
      select('cart_icon', 'Cart icon', [['bag', 'Bag'], ['cart', 'Cart'], ['basket', 'Basket']], 'bag'),
      select('cart_type', 'Cart type', [['drawer', 'Drawer'], ['page', 'Page']], 'drawer'),
      select('cart_after_add', 'After adding to cart', [['drawer', 'Open the cart drawer'], ['page', 'Go to the cart page'], ['stay', 'Stay on the page']], 'drawer'),
      { type: 'url', id: 'cart_empty_link', label: 'Empty cart link', default: '/collections/all' },
      check('cart_show_vendor', 'Show vendor on lines'),
      check('cart_show_weight', 'Show weight on lines'),
      header('Recommendations'),
      check('cart_recommendations', 'Show related products'),
      text('cart_recommendations_heading', 'Heading', 'You may also like'),
      range('cart_recommendations_limit', 'Maximum products', 2, 10, 1, 4),
      select('cart_recommendations_layout', 'Layout', [['carousel', 'Carousel'], ['list', 'List']], 'carousel'),
      header('Cart icon'),
      check('cart_shake', 'Shake the cart icon when it has items'),
      range('cart_shake_every', 'Shake every', 1, 10, 1, 5, null, 'Number of page views between shakes.'),
      header('Free shipping bar'),
      check('cart_free_shipping_bar', 'Show free shipping progress'),
      { type: 'textarea', id: 'cart_free_shipping_rules', label: 'Thresholds', info: 'One line per currency, for example "EUR: 69". The bar only shows for currencies you list.' },
      { type: 'color_scheme', id: 'cart_free_shipping_scheme', label: 'Color scheme', default: 'scheme-2' }
    ]
  },
  {
    name: 'Animations',
    settings: [
      select('reveal_on_scroll', 'Reveal sections on scroll', [['none', 'Off'], ['fade', 'Fade in'], ['rise', 'Fade and rise']], 'none', 'Always off for visitors who ask for reduced motion.'),
      select('reveal_speed', 'Speed', [['fast', 'Fast'], ['normal', 'Normal'], ['slow', 'Slow']], 'fast')
    ]
  },
  {
    name: 'Wholesale',
    settings: [
      para('Wholesale mode is on for customers signed in to a Shopify B2B company location. Prices, quantity rules and volume pricing always come from your B2B catalogs.'),
      text('wholesale_matrix_tag', 'Order matrix tag', 'row', 'Products with this tag show the color and size order matrix to wholesale buyers.'),
      text('wholesale_only_tag', 'Wholesale-only tag', 'b2b', 'Fallback for products that are still visible to retail. Prefer excluding them from your retail catalogs.'),
      check('wholesale_show_sku', 'Show SKUs to wholesale buyers'),
      check('wholesale_installments', 'Show the installments line to wholesale buyers', true, 'Only turn this on when your B2B checkout offers the installments provider.'),
      range('wholesale_tier_rows', 'Volume price rows before "Show all"', 1, 10, 1, 3),
      check('wholesale_quick_order_drawer', 'Order from product cards in a drawer', false, 'Wholesale buyers open the order matrix or quantity box from a card without leaving the collection.'),
      select('wholesale_location_placement', 'Location switcher', [['chip', 'Chip in the header'], ['menu', 'Inside the account menu']], 'chip'),
      { type: 'page', id: 'wholesale_access_page', label: 'Wholesale sign-in page' },
      { type: 'page', id: 'wholesale_request_page', label: 'Wholesale application page' },
      { type: 'page', id: 'wholesale_quick_order_page', label: 'Quick order page' },
      header('Cart'),
      text('wholesale_pack_image_metafield', 'Pack image metafield', 'custom.pack_image', 'Product metafield with an image that replaces the line image for wholesale buyers.'),
      check('wholesale_assorted_packs', 'List all colors on one-size lines', false, 'For products sold as assorted packs: one-size lines show every color value.'),
      text('wholesale_assorted_exclude_types', 'Exclude product types', null, 'Product types separated by commas.')
    ]
  },
  {
    name: 'Delivery information',
    settings: [
      para('Rules for the delivery list on product pages. No delivery date is ever shown.'),
      { type: 'textarea', id: 'delivery_rules', label: 'Shipping rules', info: 'One line per zone: countries = rate / free from, with an optional currency. Example: "ES, AD = 4.95 / 69". Leave "free from" empty when there is no free shipping. Amounts use your store currency unless the line starts with a currency code, for example "GB = GBP 4.95 / 99".' },
      text('delivery_default_rule', 'Rule for other countries', null, 'Example: "54.95". Leave empty to hide the shipping row for unlisted countries.'),
      check('delivery_round_up', 'Round converted amounts up', true, 'Keeps converted amounts at or above what checkout charges.'),
      text('delivery_returns_text', 'Returns row', '14-day returns')
    ]
  },
  {
    name: 'Installments',
    settings: [
      para('The installments row on product pages. Shopify Payments installments show separately when available.'),
      text('installments_provider', 'Provider name', null, 'Leave empty to hide the row.'),
      range('installments_count', 'Number of payments', 2, 12, 1, 3),
      text('installments_countries', 'Countries', null, 'Two-letter country codes separated by commas. Leave empty for all countries.')
    ]
  },
  {
    name: 'Custom code and tracking',
    settings: [
      para('Code runs on every page. Marketing code waits for consent through Shopify\'s customer privacy settings.'),
      { type: 'html', id: 'custom_code_head', label: 'Code for the head' },
      select('custom_code_head_mode', 'Load head code', [['immediately', 'Immediately'], ['after_load', 'After page load'], ['after_interaction', 'After first interaction']], 'immediately', 'Verification tags must load immediately.'),
      { type: 'html', id: 'custom_code_body', label: 'Code before the closing body tag' },
      select('custom_code_body_mode', 'Load body code', [['immediately', 'Immediately'], ['after_load', 'After page load'], ['after_interaction', 'After first interaction']], 'after_interaction'),
      check('custom_code_consent', 'Wait for marketing consent', true)
    ]
  },
  // Store builds only: scripts/package-theme.mjs --themestore removes this group, every
  // integration-* file and every marked integration region.
  {
    name: 'Integrations',
    settings: [
      para('Connections to outside services for this store. They are not part of the Theme Store version of Weft.'),
      header('Reviews (Judge.me)'),
      check('integration_reviews_enable', 'Show reviews from Judge.me data', false, 'Used by the "Reviews grid" and "Reviews wall" sections. Reads the reviews Judge.me keeps in shop metafields.'),
      header('Back in stock'),
      check('integration_bis_enable', 'Send back-in-stock requests to a service'),
      text('integration_bis_endpoint', 'Subscribe URL', null, 'The service receives the request as JSON. Without a URL, requests go through the contact form.'),
      header('Tracking'),
      text('integration_gtm_id', 'Google Tag Manager container ID', null, 'For example GTM-XXXXXXX.'),
      text('integration_clarity_id', 'Microsoft Clarity project ID'),
      text('integration_google_verification', 'Google site verification code'),
      text('integration_meta_verification', 'Meta domain verification code'),
      select('integration_tracking_mode', 'Load tracking', [['after_load', 'After page load'], ['after_interaction', 'After first interaction']], 'after_load', 'Tracking also waits for marketing consent when "Wait for marketing consent" is on in Custom code and tracking.')
    ]
  },
  {
    name: 'Advanced',
    settings: [
      check('preload_links', 'Preload links on hover', true),
      check('external_links_new_tab', 'Open external links in a new tab', true),
      select('image_quality', 'Image resolution', [['standard', 'Standard'], ['high', 'High']], 'standard'),
      header('Attention messages', 'Shown in the browser tab title while visitors look at another tab.'),
      check('tab_messages_enable', 'Show attention messages'),
      text('tab_message_1', 'Message 1', 'Still thinking it over?'),
      text('tab_message_2', 'Message 2', 'Your cart is waiting'),
      range('tab_message_delay', 'Delay', 1, 10, 1, 3, 's'),
      header('Mobile'),
      check('vibrate_on_add', 'Vibrate on add to cart')
    ]
  }
];
