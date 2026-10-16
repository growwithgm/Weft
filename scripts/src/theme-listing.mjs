// Theme Store listing content for the three presets (BUILD_SPEC §8.4). scripts/build-listing.mjs checks
// it against the listing rules read on shopify.dev (28 Sep 2026) and writes docs/theme-store-listing.md.
// Taglines describe the style or purpose, not features; no hyperbole; no Shopify name in highlights.

export const rules = {
  source: 'https://shopify.dev/docs/storefronts/themes/store/review-process/listings',
  read: '28 Sep 2026',
  taglineMax: 70,
  highlightTitleMax: 30,
  highlightTextMax: 140,
  highlightImage: '1600 x 1200px, no animated GIF, no Shopify logo or name',
  desktop: ['1000 x 1248px', '2000 x 2496px'],
  mobile: '750 x 1334px',
  industries: ['Art', 'Auto', 'Bags', 'Beauty', 'Clothing', 'Electronics', 'Entertainment', 'Food and drink', 'Garden', 'Hardware', 'Home', 'Jewelry and accessories', 'Kids', 'Office', 'Pets', 'Services', 'Shoes', 'Sports', 'Toys', 'Wellness'],
  catalogSizes: ['1 product', 'Few (2-10)', 'Some (11-100+)', 'Lots (500+)'],
  features: {
    Merchandising: ['High resolution images', 'Image galleries', 'Image hotspot', 'Image rollover', 'Image zoom', 'Lookbooks', 'Slideshow', 'Color swatches', 'Ingredients/nutritional information', 'Product options', 'Product tabs', 'Product videos', 'Shipping/delivery information', 'Size chart', 'Usage information', 'Animation'],
    'Marketing and conversion': ['Cross-selling (complete the look)', 'Quick view', 'Recently viewed', 'Recommended products', 'Stock counter', 'Store locator', 'Back-in-stock alert', 'Customizable contact form', 'Blogs', 'Event calendar', 'In-menu promos', 'Press coverage', 'Product badges', 'Promo banners', 'Promo popups', 'Promo tiles', 'Age verifier', 'FAQ page', 'Product reviews', 'Trust badges'],
    'Cart and checkout optimization': ['Cart notes', 'Gift wrapping', 'In-store pickups', 'Quick buy', 'Slide-out cart', 'Sticky cart'],
    'Product discovery': ['Back-to-top button', 'Breadcrumbs', 'Collection page navigation', 'Enhanced search', 'Infinite scroll', 'Mega menu', 'Product filtering and sorting', 'Sticky header', 'Recently viewed', 'Recommended products']
  },
  // Features Weft doesn't offer, so no preset may select them.
  notOffered: ['Store locator', 'Event calendar', 'Gift wrapping']
};

// Where each selectable feature lives in the theme (checked against the code in P8).
export const featureSources = {
  'High resolution images': 'image_url / image_tag with responsive widths everywhere',
  'Image galleries': 'main-product media gallery (thumbnails, carousel, stacked)',
  'Image hotspot': 'product-hotspots and shoppable-image sections',
  'Image rollover': 'Theme settings > Product cards > hover: second image',
  'Image zoom': 'main-product and featured-product zoom setting',
  Lookbooks: 'page.lookbook template (banner, promo grid, shoppable image, media grid)',
  Slideshow: 'slideshow and navigation-slideshow sections',
  'Color swatches': 'variant-picker swatches (Shopify swatches or color names)',
  'Ingredients/nutritional information': 'ingredients block with full list; ingredient-spotlight section',
  'Product options': 'custom-option block (text, long text, select, checkbox) as line item properties',
  'Product tabs': 'product-tabs block',
  'Product videos': 'product media (Shopify video, YouTube, Vimeo, 3D)',
  'Shipping/delivery information': 'delivery-list block, shipping-calculator section',
  'Size chart': 'product-guide block (image, page or metafield)',
  'Usage information': 'how-to-use block',
  Animation: 'reveal on scroll theme setting (off for visitors who prefer reduced motion)',
  'Cross-selling (complete the look)': 'complementary-products block, product-hotspots',
  'Quick view': 'quick-add drawer with media, price and options',
  'Recently viewed': 'recently-viewed section',
  'Recommended products': 'product-recommendations section',
  'Stock counter': 'stock-line block (real inventory only)',
  'Back-in-stock alert': 'back-in-stock block (contact form request)',
  'Customizable contact form': 'contact-form section with field blocks',
  Blogs: 'main-blog, main-article, featured-blog',
  'In-menu promos': 'header mega menu promotion images',
  'Press coverage': 'logo-list and testimonials sections',
  'Product badges': 'product-labels (sale, sold out, new, pre-order, custom metafield) and badges block',
  'Promo banners': 'image-banner, promo-strip, announcement-bar',
  'Promo popups': 'popup section',
  'Promo tiles': 'promo-grid section, collection promotion tiles',
  'Age verifier': 'popup section, age verification mode',
  'FAQ page': 'faq section, page.faq template',
  'Product reviews': 'product-rating block and product-reviews section (reads the standard reviews metafields; review app blocks)',
  'Trust badges': 'icons-with-text section, payment-methods block',
  'Cart notes': 'cart summary note field',
  'In-store pickups': 'pickup-availability',
  'Quick buy': 'quick add from product cards',
  'Slide-out cart': 'cart-drawer section',
  'Sticky cart': 'mobile sticky add to cart bar on the product page',
  'Back-to-top button': 'footer back to top setting',
  Breadcrumbs: 'Theme settings > Breadcrumbs (product, collection, blog, article)',
  'Collection page navigation': 'collection-list, main-list-collections, collection banner with breadcrumbs',
  'Enhanced search': 'predictive-search and search drawer',
  'Infinite scroll': 'Theme settings > pagination style: infinite',
  'Mega menu': 'header mega menus',
  'Product filtering and sorting': 'main-collection and main-search filters (Search & Discovery) and sorting',
  'Sticky header': 'header sticky setting'
};

export default {
  weft: {
    name: 'Weft',
    tagline: 'Calm, image-led stores for clothing brands with shop buyers',
    industry: 'Clothing',
    catalogSize: 'Some (11-100+)',
    metaDescription: 'Weft is a clothing theme for brands that sell to shoppers and to boutiques from one store, with size charts, color swatches, lookbooks and wholesale ordering by size and color.',
    highlights: [
      { title: 'Wholesale on one storefront', text: 'Company buyers see their own prices, pack rules and volume tiers, and order sizes and colors in one grid.', image: 'Product page as a wholesale buyer: the order matrix with sizes by colors, rule chips and the tier table beside the gallery.' },
      { title: 'Size and fit, answered', text: 'Size charts, fit notes and color swatches sit next to the buy button, so shoppers choose with confidence.', image: 'Product page as a shopper: swatches, the size chart drawer open and the delivery list.' },
      { title: 'Lookbooks that shop', text: 'Image hotspots and lookbook pages link every outfit to the pieces in it.', image: 'Lookbook page with hotspots on a beach photo and the product card of the tunic open.' }
    ],
    features: ['High resolution images', 'Image galleries', 'Image hotspot', 'Image rollover', 'Image zoom', 'Lookbooks', 'Slideshow', 'Color swatches', 'Product options', 'Product videos', 'Shipping/delivery information', 'Size chart', 'Animation', 'Cross-selling (complete the look)', 'Quick view', 'Recently viewed', 'Recommended products', 'Stock counter', 'Back-in-stock alert', 'In-menu promos', 'Product badges', 'Promo banners', 'Promo popups', 'Promo tiles', 'FAQ page', 'Blogs', 'Cart notes', 'In-store pickups', 'Quick buy', 'Slide-out cart', 'Sticky cart', 'Breadcrumbs', 'Enhanced search', 'Infinite scroll', 'Mega menu', 'Product filtering and sorting', 'Sticky header'],
    screenshots: {
      desktop: 'Weft home page: full-width banner of two women in embroidered tunics on a beach, the new-in product row and the category tiles below.',
      mobile: 'Weft home page on a phone: the beach banner with its heading and button, and the start of the new-in product row.'
    },
    testing: [
      'Retail: open the Leila hand-embroidered long tunic to see color swatches, the size chart (Size guide link), fit notes, the delivery list, pickup availability and the mobile sticky bar. Indigo L/XL is sold out and shows Remind me when in stock.',
      'Lookbook: Pages > Lookbook has image hotspots linked to products.',
      'Wholesale: sign in as the test company contact (below). The same product shows per-piece prices, quantity rule chips, volume pricing and the order matrix; the header shows the company and the location switcher (Madrid Serrano, Valencia Ruzafa). Pages > Quick order has the quick order list.',
      'Wholesale-only products: as a guest, /products/tunic-sample-pack returns 404 with a wholesale sign-in line (left out of the retail catalog) and /products/embroidery-swatch-card shows the wholesale gate page with noindex (tag fallback).'
    ]
  },
  tress: {
    name: 'Tress',
    tagline: 'Precise, high-contrast stores for hair care brands and salons',
    industry: 'Beauty',
    catalogSize: 'Some (11-100+)',
    metaDescription: 'Tress is a hair care theme with ingredient lists, usage steps, hair type filters and a routine finder, plus salon ordering with case sizes and trade prices from the same store.',
    highlights: [
      { title: 'Ingredients up front', text: 'Key ingredients, the full ingredient list and step-by-step use come straight from product metafields.', image: 'Product page of the argan repair shampoo with highlights, hair type chips, the ingredient list open and the how to use steps.' },
      { title: 'A routine for each hair type', text: 'A guided finder and hair type chips take shoppers from their hair type to a filtered collection.', image: 'Home page finder with the hair type question and four answers, next to the filtered collection it leads to.' },
      { title: 'Salon ordering built in', text: 'Salon accounts order back-bar sizes by the case at their own prices, with volume tiers and a quick order list.', image: 'Quick order list as a salon buyer with case quantities entered and the line totals.' }
    ],
    features: ['High resolution images', 'Image galleries', 'Image zoom', 'Color swatches', 'Ingredients/nutritional information', 'Product options', 'Product tabs', 'Product videos', 'Shipping/delivery information', 'Usage information', 'Animation', 'Cross-selling (complete the look)', 'Quick view', 'Recently viewed', 'Recommended products', 'Stock counter', 'Back-in-stock alert', 'Product badges', 'Promo banners', 'FAQ page', 'Blogs', 'Cart notes', 'In-store pickups', 'Quick buy', 'Slide-out cart', 'Sticky cart', 'Breadcrumbs', 'Enhanced search', 'Mega menu', 'Product filtering and sorting', 'Sticky header'],
    screenshots: {
      desktop: 'Tress home page: a stylist blow-drying wavy hair in a bright salon, benefit icons below and the product row on a white background.',
      mobile: 'Tress home page on a phone: the salon banner with its heading and button, and the benefit icons below.'
    },
    testing: [
      'Retail: open the Argan repair shampoo for unit prices, highlights, hair type chips, ingredients with the full list, how to use steps and complete the routine products.',
      'Finder: the home page and Pages > Find your routine ask for hair type and concern and open a filtered collection.',
      'Before and after: the home page slider works with the keyboard (arrow keys).',
      'Wholesale: sign in as the salon contact (below). Products show trade prices and case rules; Color cream shows the shade matrix; Back-bar shampoo is visible only to the salon (a guest gets 404); Pages > Quick order has the quick order list.'
    ]
  },
  balm: {
    name: 'Balm',
    tagline: 'Soft, airy stores for body care and small-batch skincare',
    industry: 'Beauty',
    catalogSize: 'Some (11-100+)',
    metaDescription: 'Balm is a body care theme with scent notes, ingredient lists, period after opening, routines and gift messages, plus trade ordering for shops and spas from the same store.',
    highlights: [
      { title: 'Scent, told clearly', text: 'Top, heart and base notes, the ingredient list and the period after opening sit on every product page.', image: 'Product page of the whipped shea body butter with scent notes, the period after opening icon and the ingredient list.' },
      { title: 'Rituals and gifts', text: 'Routine steps, gift messages and gift guides help shoppers build a ritual or send one.', image: 'Home page routine steps above the gift guide tabs, with the gift set product card.' },
      { title: 'Stockists welcome', text: 'Shop and spa accounts order testers and cases at their own prices from the same store.', image: 'Product page as a trade buyer: tester and case quantity with the trade price and volume tiers.' }
    ],
    features: ['High resolution images', 'Image galleries', 'Image zoom', 'Ingredients/nutritional information', 'Product options', 'Product tabs', 'Product videos', 'Shipping/delivery information', 'Usage information', 'Animation', 'Cross-selling (complete the look)', 'Quick view', 'Recently viewed', 'Recommended products', 'Stock counter', 'Back-in-stock alert', 'Product badges', 'Promo banners', 'Promo tiles', 'FAQ page', 'Blogs', 'Cart notes', 'In-store pickups', 'Quick buy', 'Slide-out cart', 'Sticky cart', 'Breadcrumbs', 'Enhanced search', 'Mega menu', 'Product filtering and sorting', 'Sticky header'],
    screenshots: {
      desktop: 'Balm home page: glass jars of body butter on a stone ledge in morning light, benefit icons and the product row on a porcelain background.',
      mobile: 'Balm home page on a phone: the body butter banner with its heading and button, and the benefit icons below.'
    },
    testing: [
      'Retail: open the Whipped shea body butter for size by scent options, unit prices, scent notes, the period after opening, ingredients and the routine products. Dry body oil shows the warnings row.',
      'Gifts: the Ritual gift set has a gift message field with a character counter; the home page gift guide has price tabs.',
      'Finder: the home page and Pages > Find your routine ask for skin type and scent and open a filtered collection.',
      'Wholesale: sign in as the trade contact (below). Products show trade prices and case rules; the body butter tester is visible only to trade accounts (a guest gets 404).'
    ]
  }
};

export const reviewNotes = 'Weft is built for brands that sell to shoppers and to other businesses from one Shopify store, starting with clothing (Weft), hair care (Tress) and body care (Balm). Retail visitors get a fast, image-led store; buyers signed in to a company account see the same pages with their catalog prices, quantity rules, volume pricing, an order matrix, a quick order list and a location switcher, all read from native B2B data (customer.b2b?), so the theme never calculates a price. The vertical styles add the product information their shoppers look for: size charts, swatches and lookbooks for clothing; ingredients, usage steps, hair and skin types, scent notes, period after opening and a routine finder for hair and body care. Everything is theme blocks, works without JavaScript first, and meets the Theme Store performance and accessibility requirements.';
