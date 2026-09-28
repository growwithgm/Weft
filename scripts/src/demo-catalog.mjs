// Demo catalogs for the three preset demo stores (VERTICALS §5, brief §9). scripts/build-demo-content.mjs
// writes demo-content/<preset>/ from this file. Copy is original; no brand names; prices in EUR.
// Wholesale: price per piece, quantity rules (min / increment / max) and volume tiers per variant,
// all following Shopify's validation (min and max are multiples of the increment; tiers are above the
// minimum and multiples of the increment). `only` marks wholesale-only products: 'catalog' (left out of
// the retail market catalogs) or 'tag' (kept in them, gated by the wholesale-only tag). Images are
// described, not included (demo-content/*/images.md).

export default {
  weft: {
    store: 'Weft demo',
    vendor: 'Weft Studio',
    industry: 'Clothing',
    unitNote: null,
    metafields: [
      { key: 'custom.subtitle', type: 'single_line_text_field', name: 'Subtitle', use: 'Product card subtitle (Theme settings > Product cards)' },
      { key: 'custom.fit_guide', type: 'single_line_text_field', name: 'Fit guide', use: 'Delivery list > Fit row (dynamic source)' },
      { key: 'custom.best_suited_for', type: 'single_line_text_field', name: 'Best suited for', use: 'Product guide > second row (dynamic source)' },
      { key: 'custom.embroidery', type: 'single_line_text_field', name: 'Embroidery', use: 'Specifications row (dynamic source)' },
      { key: 'custom.material', type: 'single_line_text_field', name: 'Material', use: 'Specifications row and Ingredients > full list for clothing' },
      { key: 'custom.care', type: 'multi_line_text_field', name: 'Care', use: 'How to use block (care steps)' },
      { key: 'custom.label', type: 'single_line_text_field', name: 'Label', use: 'Custom product label (Theme settings > Product labels)' },
      { key: 'custom.size_chart', type: 'file_reference', name: 'Size chart', use: 'Product guide > image (dynamic source)' },
      { key: 'custom.pack_image', type: 'file_reference', name: 'Pack image', use: 'Wholesale pack image on cart lines (Theme settings > Wholesale)' }
    ],
    collections: [
      { title: 'New in', handle: 'new-in', rule: 'Tag is equal to new', description: 'The latest pieces from the studio.' },
      { title: 'Dresses and skirts', handle: 'dresses-skirts', rule: 'Type is equal to Dress, or Type is equal to Kaftan, or Type is equal to Skirt', description: 'Long, easy shapes with hand embroidery.' },
      { title: 'Tops and tunics', handle: 'tops-tunics', rule: 'Type is equal to Tunic, or Type is equal to Shirt', description: 'Tunics and shirts to wear loose or belted.' },
      { title: 'Outerwear', handle: 'outerwear', rule: 'Type is equal to Jacket', description: 'Light layers for cool evenings.' },
      { title: 'Accessories', handle: 'accessories', rule: 'Type is equal to Bag, or Type is equal to Scarf, or Type is equal to Hat', description: 'Totes, scarves and hats to finish the look.' },
      { title: 'Sale', handle: 'sale', rule: 'Compare-at price is not empty', description: 'Pieces at their last price of the season.' }
    ],
    products: [
      {
        handle: 'leila-embroidered-tunic', title: 'Leila hand-embroidered long tunic', type: 'Tunic', category: 'Apparel & Accessories > Clothing > Clothing Tops > Tunics', tags: ['row', 'new', 'embroidered'],
        description: '<p>A long cotton voile tunic with embroidery at the neckline and cuffs, stitched by hand. It falls straight from the shoulder and reaches mid-calf, so it works over trousers or on its own with a belt.</p><p>Each piece takes about two days of needlework, so the stitches vary slightly from one tunic to the next.</p>',
        options: ['Color', 'Size'],
        variants: [
          ['Ecru', 'S/M', 42], ['Ecru', 'L/XL', 18], ['Ecru', 'XXL', 6],
          ['Indigo', 'S/M', 9], ['Indigo', 'L/XL', 0], ['Indigo', 'XXL', 23],
          ['Black', 'S/M', null], ['Black', 'L/XL', null], ['Black', 'XXL', null],
          ['Sage', 'S/M', 14], ['Sage', 'L/XL', 3]
        ],
        price: 79.95, compareAt: 99.95, grams: 320,
        metafields: { 'custom.subtitle': 'Cotton voile, hand embroidery', 'custom.fit_guide': 'Model is 170 cm, wearing S/M', 'custom.best_suited_for': 'US 8-14, UK/AU 12-18, EU 40-46, IT 44-50', 'custom.embroidery': 'Hand-embroidered neckline and cuffs', 'custom.material': '100% cotton voile', 'custom.care': 'Hand wash cold\nDry flat in the shade\nIron on the reverse' },
        wholesale: { price: 31.5, min: 4, increment: 2, max: 60, tiers: [[24, 29.9], [48, 28.5]] },
        images: ['Front view on a model, ecru, full length', 'Close-up of the neckline embroidery', 'Indigo and sage folded side by side', 'Back view on a model, indigo'],
        note: 'Order matrix product (tag "row"): Indigo L/XL sold out, Sage L/XL below the wholesale minimum, Black untracked, Sage XXL not offered.'
      },
      {
        handle: 'zahra-embroidered-kaftan', title: 'Zahra embroidered kaftan', type: 'Kaftan', category: 'Apparel & Accessories > Clothing > Dresses', tags: ['embroidered'],
        description: '<p>A one-size kaftan in soft cotton with a band of embroidery down the front. Wide sleeves and side slits keep it cool; a hidden drawstring gathers the waist when you want shape.</p>',
        options: ['Color'],
        variants: [['Coral', 60], ['Turquoise', 12], ['White', 0], ['Navy', 30]],
        price: 89.95, grams: 380,
        metafields: { 'custom.subtitle': 'One size, cotton', 'custom.fit_guide': 'One size, fits EU 36-48', 'custom.material': '100% cotton', 'custom.care': 'Machine wash cold on a gentle cycle\nLine dry' },
        wholesale: { price: 34, min: 6, increment: 6, tiers: [[36, 32], [72, 30.5]] },
        images: ['Coral kaftan on a model, front', 'All four colors folded together (pack image)', 'Detail of the front embroidery band'],
        note: 'One-size wholesale product: starts at 6, steps by 6; White sold out. Upload the pack image to custom.pack_image.'
      },
      {
        handle: 'nour-embroidered-tote', title: 'Nour embroidered tote', type: 'Bag', category: 'Apparel & Accessories > Handbags, Wallets & Cases > Handbags > Tote Handbags', tags: ['accessories'],
        description: '<p>A sturdy cotton canvas tote with an embroidered front panel and leather-look handles. It holds a laptop, a towel and a day at the beach.</p>',
        options: ['Color'],
        variants: [['Natural', 25], ['Black', 7]],
        price: 59.95, grams: 450,
        metafields: { 'custom.subtitle': 'Canvas, embroidered panel', 'custom.material': 'Cotton canvas, embroidered front' },
        wholesale: { price: 22, min: 3, increment: 3 },
        images: ['Natural tote on a white background', 'Tote carried on the shoulder', 'Inside pocket detail'],
        note: 'Wholesale product without tiers (the "no tiers" state).'
      },
      {
        handle: 'amira-maxi-dress', title: 'Amira embroidered maxi dress', type: 'Dress', category: 'Apparel & Accessories > Clothing > Dresses', tags: ['new', 'row', 'embroidered', 'highlight'],
        description: '<p>A floor-length dress with a tiered skirt and a yoke of tonal embroidery. The cotton gauze is light enough for summer and layers well under a jacket in autumn.</p>',
        options: ['Color', 'Size'],
        variants: [['Sand', 'S/M', 20], ['Sand', 'L/XL', 16], ['Sand', 'XXL', 5], ['Terracotta', 'S/M', 12], ['Terracotta', 'L/XL', 9], ['Terracotta', 'XXL', 2]],
        price: 119, grams: 420,
        metafields: { 'custom.subtitle': 'Cotton gauze, tonal embroidery', 'custom.fit_guide': 'Model is 172 cm, wearing S/M', 'custom.material': '100% cotton gauze' },
        wholesale: { price: 46, min: 4, increment: 2, max: 40, tiers: [[24, 44]] },
        images: ['Sand dress on a model, walking', 'Terracotta dress, front', 'Yoke embroidery close-up']
      },
      {
        handle: 'salma-linen-shirt', title: 'Salma linen shirt', type: 'Shirt', category: 'Apparel & Accessories > Clothing > Clothing Tops > Shirts', tags: ['linen'],
        description: '<p>A relaxed linen shirt with a band collar and mother-of-pearl buttons. Washed for softness, so it looks lived-in from the first wear.</p>',
        options: ['Color', 'Size'],
        variants: [['White', 'S/M', 30], ['White', 'L/XL', 24], ['White', 'XXL', 8], ['Olive', 'S/M', 18], ['Olive', 'L/XL', 11], ['Olive', 'XXL', 4]],
        price: 69, grams: 260,
        metafields: { 'custom.subtitle': 'Washed linen', 'custom.material': '100% linen' },
        wholesale: { price: 27, min: 4, increment: 2 },
        images: ['White shirt worn open over a tank', 'Olive shirt, flat lay', 'Collar and button detail']
      },
      {
        handle: 'yasmin-wrap-skirt', title: 'Yasmin wrap skirt', type: 'Skirt', category: 'Apparel & Accessories > Clothing > Skirts', tags: ['sale'],
        description: '<p>A midi wrap skirt that ties at the waist, cut from cotton poplin with a scalloped hem. Adjustable, so the fit follows you through the day.</p>',
        options: ['Color', 'Size'],
        variants: [['Indigo', 'S/M', 14], ['Indigo', 'L/XL', 10], ['Ecru', 'S/M', 12], ['Ecru', 'L/XL', 6]],
        price: 49, compareAt: 64, grams: 240,
        metafields: { 'custom.subtitle': 'Cotton poplin', 'custom.material': '100% cotton poplin' },
        wholesale: { price: 19, min: 4, increment: 2 },
        images: ['Indigo skirt on a model, tied at the side', 'Scalloped hem detail']
      },
      {
        handle: 'farah-beach-cover-up', title: 'Farah beach cover-up', type: 'Kaftan', category: 'Apparel & Accessories > Clothing > Swimwear > Cover Ups', tags: ['new'],
        description: '<p>A sheer cotton cover-up with open sides and a tasseled tie. It packs down to nothing and dries in minutes.</p>',
        options: ['Color'],
        variants: [['White', 40], ['Black', 22]],
        price: 49, grams: 160,
        metafields: { 'custom.subtitle': 'Sheer cotton, one size', 'custom.fit_guide': 'One size, fits EU 36-46' },
        wholesale: { price: 19, min: 6, increment: 6, tiers: [[36, 17.5]] },
        images: ['White cover-up over a swimsuit, beach', 'Tassel tie detail']
      },
      {
        handle: 'layla-embroidered-jacket', title: 'Layla embroidered jacket', type: 'Jacket', category: 'Apparel & Accessories > Clothing > Outerwear > Coats & Jackets', tags: ['embroidered'],
        description: '<p>A cropped cotton jacket with a quilted lining and embroidered sleeves. It closes with fabric-covered buttons and has two deep pockets.</p>',
        options: ['Size'],
        variants: [['S/M', 10], ['L/XL', 6], ['XXL', 2]],
        price: 139, compareAt: 159, grams: 610,
        metafields: { 'custom.subtitle': 'Quilted cotton', 'custom.fit_guide': 'Cropped; size up to wear over knits', 'custom.material': 'Cotton, quilted cotton lining' },
        wholesale: { price: 55, min: 2, increment: 2, tiers: [[12, 52]] },
        images: ['Jacket on a model over a dress', 'Sleeve embroidery close-up', 'Back view']
      },
      {
        handle: 'hana-silk-scarf', title: 'Hana silk scarf', type: 'Scarf', category: 'Apparel & Accessories > Clothing Accessories > Scarves & Shawls', tags: ['accessories'],
        description: '<p>A square silk scarf with a hand-rolled hem, printed with a pattern drawn from the embroidery on our tunics.</p>',
        options: ['Color'],
        variants: [['Ivory', 35], ['Rose', 18], ['Navy', 9]],
        price: 39, grams: 60,
        metafields: { 'custom.subtitle': '90 x 90 cm silk twill', 'custom.material': '100% silk twill' },
        wholesale: { price: 15, min: 6, increment: 6 },
        images: ['Scarf knotted at the neck', 'Scarf laid flat showing the full print']
      },
      {
        handle: 'rania-straw-hat', title: 'Rania straw hat', type: 'Hat', category: 'Apparel & Accessories > Clothing Accessories > Hats', tags: ['new', 'accessories'],
        description: '<p>A wide-brim hat woven from natural straw, with an embroidered cotton band. The brim holds its shape and folds for travel.</p>',
        options: ['Size'],
        variants: [['One size', 28]],
        price: 45, grams: 180,
        metafields: { 'custom.subtitle': 'Natural straw' },
        wholesale: { price: 18, min: 3, increment: 3 },
        images: ['Hat on a model in sunlight', 'Band embroidery detail']
      },
      {
        handle: 'tunic-sample-pack', title: 'Tunic sample pack', type: 'Sample pack', category: 'Apparel & Accessories > Clothing > Clothing Tops > Tunics', tags: ['b2b'],
        description: '<p>One Leila tunic in each color, size S/M, for shop owners who want to see the fabric and embroidery before ordering.</p>',
        options: ['Title'],
        variants: [['Default Title', 15]],
        price: 150, grams: 1300,
        metafields: {},
        wholesale: { price: 110, min: 1, increment: 1, max: 2, only: 'catalog' },
        images: ['Four tunics folded in a stack'],
        note: 'In the B2B catalog, left out of the retail market catalogs, so retail visitors get a 404 with the wholesale sign-in line (scenario 13).'
      },
      {
        handle: 'embroidery-swatch-card', title: 'Embroidery swatch card', type: 'Sample pack', category: 'Apparel & Accessories > Clothing Accessories', tags: ['b2b'],
        description: '<p>A card with fabric cuttings and thread samples for every color in the range, so shops can match stock to their displays.</p>',
        options: ['Title'],
        variants: [['Default Title', 40]],
        price: 12, grams: 40,
        metafields: {},
        wholesale: { price: 6, min: 1, increment: 1, max: 5, only: 'tag' },
        images: ['Swatch card with fabric cuttings and threads'],
        note: 'Stays in the retail catalog with the tag "b2b", so retail visitors see the wholesale gate page with noindex (scenario 13).'
      }
    ],
    giftCard: { handle: 'gift-card', title: 'Gift card', denominations: [25, 50, 100], description: '<p>A gift card for any piece in the shop, delivered by email.</p>' }
  },

  tress: {
    store: 'Tress demo',
    vendor: 'Maison Tress',
    industry: 'Beauty (hair care)',
    unitNote: 'Unit prices per 100 ml (per 1 l for back-bar sizes); set them on each variant in the admin (Unit price section).',
    metafields: [
      { key: 'shopify.hair-type', type: 'list.metaobject_reference (category metafield)', name: 'Hair type', use: 'Attribute chips (Hair type) and collection filters; set values in the admin from the Hair care category' },
      { key: 'custom.subtitle', type: 'single_line_text_field', name: 'Subtitle', use: 'Product card subtitle' },
      { key: 'custom.concern', type: 'list.single_line_text_field', name: 'Concern', use: 'Attribute chips (Concern) and a collection filter' },
      { key: 'custom.inci', type: 'multi_line_text_field', name: 'Full ingredient list (INCI)', use: 'Ingredients > full list (dynamic source)' },
      { key: 'custom.how_to_use', type: 'multi_line_text_field', name: 'How to use', use: 'How to use steps' },
      { key: 'custom.label', type: 'single_line_text_field', name: 'Label', use: 'Custom label, for example "Professional"' }
    ],
    collections: [
      { title: 'Shampoo', handle: 'shampoo', rule: 'Type is equal to Shampoo', description: 'Cleansers for every hair type.' },
      { title: 'Conditioner', handle: 'conditioner', rule: 'Type is equal to Conditioner', description: 'Detangle and seal the cuticle.' },
      { title: 'Masks and treatments', handle: 'masks', rule: 'Type is equal to Mask, or Type is equal to Treatment', description: 'Weekly repair and scalp care.' },
      { title: 'Styling', handle: 'styling', rule: 'Type is equal to Styling', description: 'Define, protect and finish.' },
      { title: 'Color', handle: 'color', rule: 'Type is equal to Color', description: 'Permanent color for the salon.' },
      { title: 'Tools', handle: 'tools', rule: 'Type is equal to Tool', description: 'Combs and accessories.' },
      { title: 'Repair routine', handle: 'repair-routine', rule: 'Tag is equal to repair', description: 'Wash, condition, treat and style damaged hair.' }
    ],
    products: [
      {
        handle: 'argan-repair-shampoo', title: 'Argan repair shampoo', type: 'Shampoo', category: 'Health & Beauty > Personal Care > Hair Care > Shampoo & Conditioner > Shampoo', tags: ['repair', 'sulfate-free', 'vegan', 'Damage', 'highlight'],
        description: '<p>A sulfate-free shampoo with argan oil and plant keratin for dry and damaged hair. It lathers gently, rinses clean and leaves the lengths soft without weighing them down.</p>',
        options: ['Size'], variants: [['250 ml', 80, 14.95, { measure: '250 ml', base: '100 ml' }], ['1 l', 30, 39.95, { measure: '1 l', base: '100 ml' }]],
        grams: 300,
        metafields: { 'custom.subtitle': 'Dry and damaged hair', 'custom.concern': 'Damage; Dryness', 'custom.inci': 'Aqua, Sodium Cocoyl Isethionate, Cocamidopropyl Betaine, Glycerin, Argania Spinosa Kernel Oil, Hydrolyzed Wheat Protein, Panthenol, Parfum, Citric Acid, Sodium Benzoate', 'custom.how_to_use': 'Apply to wet hair and massage into the scalp\nWork through the lengths for one minute\nRinse well and follow with conditioner' },
        hairType: 'Straight, Wavy, Curly, Coily',
        wholesale: { price: 6.9, perVariant: { '1 l': 18.5 }, min: 6, increment: 6, tiers: [[24, 6.5], [48, 6.1]] },
        sellingPlan: 'Delivery every 4, 6 or 8 weeks, 10% off',
        images: ['250 ml bottle on a mist background', 'Lather texture close-up', '1 l salon bottle with pump'],
        note: 'Subscription product (selling plan) with unit price; two tiers.'
      },
      {
        handle: 'curl-defining-cream', title: 'Curl defining cream', type: 'Styling', category: 'Health & Beauty > Personal Care > Hair Care > Hair Styling Products', tags: ['curly', 'vegan', 'Frizz'],
        description: '<p>A light cream that clumps curls and coils without crunch. Shea butter and flaxseed extract hold definition through humid days.</p>',
        options: ['Size'], variants: [['300 ml', 60, 18.5, { measure: '300 ml', base: '100 ml' }]],
        grams: 340,
        metafields: { 'custom.subtitle': 'Curly and coily hair', 'custom.concern': 'Frizz; Definition', 'custom.inci': 'Aqua, Butyrospermum Parkii Butter, Glycerin, Linum Usitatissimum Seed Extract, Cetearyl Alcohol, Behentrimonium Chloride, Parfum, Phenoxyethanol', 'custom.how_to_use': 'Apply to soaking wet hair, section by section\nScrunch upwards and let dry\nScrunch out the cast once fully dry' },
        hairType: 'Curly, Coily',
        wholesale: { price: 8.3, min: 6, increment: 6, tiers: [[36, 7.8]] },
        images: ['Jar on a mist background', 'Cream texture swatch', 'Defined curls, back of the head']
      },
      {
        handle: 'bond-repair-mask', title: 'Bond repair mask', type: 'Mask', category: 'Health & Beauty > Personal Care > Hair Care > Hair Masks', tags: ['repair', 'Damage', 'Color care'],
        description: '<p>A weekly mask that works on hair broken by bleach, heat and color. Leave it on for five minutes; the lengths feel stronger and snap less when brushed.</p>',
        options: ['Size'], variants: [['200 ml', 45, 22, { measure: '200 ml', base: '100 ml' }], ['500 ml', 20, 44, { measure: '500 ml', base: '100 ml' }]],
        grams: 260,
        metafields: { 'custom.subtitle': 'Weekly treatment', 'custom.concern': 'Damage; Breakage', 'custom.inci': 'Aqua, Cetearyl Alcohol, Behentrimonium Methosulfate, Bis-Aminopropyl Diglycol Dimaleate, Hydrolyzed Keratin, Glycerin, Panthenol, Parfum, Phenoxyethanol', 'custom.how_to_use': 'After shampoo, squeeze out excess water\nApply from mid-lengths to ends\nLeave for five minutes and rinse' },
        hairType: 'Straight, Wavy, Curly, Coily',
        wholesale: { price: 9.9, perVariant: { '500 ml': 19.8 }, min: 6, increment: 6 },
        images: ['200 ml tube on a mist background', 'Texture close-up'],
        note: 'Wholesale without tiers.'
      },
      {
        handle: 'back-bar-shampoo', title: 'Back-bar shampoo', type: 'Shampoo', category: 'Health & Beauty > Personal Care > Hair Care > Shampoo & Conditioner > Shampoo', tags: ['b2b', 'professional'],
        description: '<p>The salon size of our argan repair shampoo, in a 5 l refill with a tap for the backwash.</p>',
        options: ['Size'], variants: [['5 l', 40, 95, { measure: '5 l', base: '1 l' }]],
        grams: 5300,
        metafields: { 'custom.label': 'Professional', 'custom.inci': 'Aqua, Sodium Cocoyl Isethionate, Cocamidopropyl Betaine, Glycerin, Argania Spinosa Kernel Oil, Hydrolyzed Wheat Protein, Panthenol, Parfum, Citric Acid, Sodium Benzoate' },
        hairType: 'Straight, Wavy, Curly, Coily',
        wholesale: { price: 58, min: 2, increment: 2, only: 'catalog' },
        images: ['5 l refill container with tap'],
        note: 'Professional-only: in the salon catalog only, so retail visitors get a 404 (scenario 19).'
      },
      {
        handle: 'color-cream', title: 'Color cream', type: 'Color', category: 'Health & Beauty > Personal Care > Hair Care > Hair Color', tags: ['row', 'professional', 'Color care'],
        description: '<p>A permanent color cream with even coverage and low odor, mixed 1:1.5 with developer. Shown here in three shades from the salon range.</p>',
        options: ['Shade', 'Size'], variants: [['5.0 Light brown', '100 ml', 120, 9.9, { measure: '100 ml', base: '100 ml' }], ['6.1 Dark ash blonde', '100 ml', 96, 9.9, { measure: '100 ml', base: '100 ml' }], ['7.3 Golden blonde', '100 ml', 8, 9.9, { measure: '100 ml', base: '100 ml' }]],
        grams: 130,
        metafields: { 'custom.subtitle': 'Permanent color', 'custom.label': 'Professional', 'custom.how_to_use': 'Mix 1 part color with 1.5 parts developer\nApply to dry hair\nLeave 35 minutes, then rinse and shampoo' },
        wholesale: { price: 4.2, min: 12, increment: 12, tiers: [[48, 3.9]] },
        swatches: 'Use swatch images or the standard color metaobjects for the Shade option.',
        images: ['Three tubes fanned out', 'Shade swatches on hair strands'],
        note: 'Order matrix (tag "row"): shade by size; 7.3 has 8 in stock, below the case of 12.'
      },
      {
        handle: 'hydrating-conditioner', title: 'Hydrating conditioner', type: 'Conditioner', category: 'Health & Beauty > Personal Care > Hair Care > Shampoo & Conditioner > Conditioner', tags: ['repair', 'vegan', 'Frizz'],
        description: '<p>A creamy conditioner with aloe and panthenol that detangles in seconds and keeps ends smooth.</p>',
        options: ['Size'], variants: [['250 ml', 70, 15.95, { measure: '250 ml', base: '100 ml' }], ['1 l', 25, 42.95, { measure: '1 l', base: '100 ml' }]],
        grams: 300,
        metafields: { 'custom.subtitle': 'All hair types', 'custom.concern': 'Dryness', 'custom.inci': 'Aqua, Cetearyl Alcohol, Aloe Barbadensis Leaf Juice, Behentrimonium Chloride, Panthenol, Glycerin, Parfum, Phenoxyethanol' },
        hairType: 'Straight, Wavy, Curly, Coily',
        wholesale: { price: 7.2, perVariant: { '1 l': 19.8 }, min: 6, increment: 6, tiers: [[24, 6.8]] },
        images: ['Bottle on a mist background', 'Conditioner texture']
      },
      {
        handle: 'scalp-detox-scrub', title: 'Scalp detox scrub', type: 'Treatment', category: 'Health & Beauty > Personal Care > Hair Care > Scalp Treatments', tags: ['scalp', 'Volume'],
        description: '<p>A fine sugar scrub with salicylic acid that lifts build-up from dry shampoo and styling products. Use it once a week before shampoo.</p>',
        options: ['Size'], variants: [['150 ml', 36, 19, { measure: '150 ml', base: '100 ml' }]],
        grams: 200,
        metafields: { 'custom.subtitle': 'Weekly scalp care', 'custom.concern': 'Build-up', 'custom.inci': 'Sucrose, Aqua, Glycerin, Salicylic Acid, Menthol, Cocamidopropyl Betaine, Parfum, Sodium Benzoate' },
        wholesale: { price: 8.6, min: 6, increment: 6 },
        images: ['Tube on a mist background', 'Scrub texture on a fingertip']
      },
      {
        handle: 'heat-protect-spray', title: 'Heat protect spray', type: 'Styling', category: 'Health & Beauty > Personal Care > Hair Care > Hair Styling Products', tags: ['styling', 'Damage', 'Frizz'],
        description: '<p>A weightless mist that protects to 230 °C and cuts drying time. Spray it on damp hair before the dryer or on dry hair before tongs.</p>',
        options: ['Size'], variants: [['150 ml', 50, 16.5, { measure: '150 ml', base: '100 ml' }]],
        grams: 190,
        metafields: { 'custom.subtitle': 'Protects to 230 °C', 'custom.concern': 'Heat damage' },
        wholesale: { price: 7.4, min: 6, increment: 6, tiers: [[24, 7]] },
        images: ['Spray bottle on a mist background', 'Mist in motion']
      },
      {
        handle: 'volume-dry-shampoo', title: 'Volume dry shampoo', type: 'Styling', category: 'Health & Beauty > Personal Care > Hair Care > Dry Shampoo', tags: ['styling', 'Volume'],
        description: '<p>A rice-starch dry shampoo that soaks up oil at the roots and adds lift, with no white cast once brushed through.</p>',
        options: ['Size'], variants: [['200 ml', 0, 13.9, { measure: '200 ml', base: '100 ml' }]],
        grams: 180,
        metafields: { 'custom.subtitle': 'Rice starch, no white cast' },
        wholesale: { price: 6.2, min: 6, increment: 6 },
        images: ['Can on a mist background'],
        note: 'Sold out, to show the Remind me state.'
      },
      {
        handle: 'purple-toning-shampoo', title: 'Purple toning shampoo', type: 'Shampoo', category: 'Health & Beauty > Personal Care > Hair Care > Shampoo & Conditioner > Shampoo', tags: ['Color care', 'sulfate-free'],
        description: '<p>A violet-pigmented shampoo that cancels brassy yellow tones in blonde, silver and highlighted hair. Leave it on for one to three minutes, depending on how cool you want the result.</p>',
        options: ['Size'], variants: [['250 ml', 44, 16.5, { measure: '250 ml', base: '100 ml' }], ['1 l', 18, 44, { measure: '1 l', base: '100 ml' }]],
        grams: 300,
        metafields: { 'custom.subtitle': 'Blonde and silver hair', 'custom.concern': 'Brassiness', 'custom.inci': 'Aqua, Sodium Cocoyl Isethionate, Cocamidopropyl Betaine, Glycerin, Hydrolyzed Rice Protein, Panthenol, Parfum, Citric Acid, CI 60730, Sodium Benzoate', 'custom.how_to_use': 'Apply to wet hair and lather\nLeave for one to three minutes\nRinse well; use once or twice a week' },
        hairType: 'Straight, Wavy, Curly',
        wholesale: { price: 7.6, perVariant: { '1 l': 20.2 }, min: 6, increment: 6, tiers: [[24, 7.2]] },
        images: ['250 ml bottle on a mist background', 'Violet lather on blonde lengths']
      },
      {
        handle: 'leave-in-conditioner', title: 'Leave-in conditioner', type: 'Conditioner', category: 'Health & Beauty > Personal Care > Hair Care > Shampoo & Conditioner > Conditioner', tags: ['Frizz', 'Damage', 'vegan'],
        description: '<p>A light milk spray that detangles, softens frizz and protects the ends between washes. Mist it on damp or dry hair; there is nothing to rinse.</p>',
        options: ['Size'], variants: [['200 ml', 52, 17, { measure: '200 ml', base: '100 ml' }]],
        grams: 240,
        metafields: { 'custom.subtitle': 'No-rinse detangler', 'custom.concern': 'Frizz; Tangles', 'custom.inci': 'Aqua, Cetearyl Alcohol, Glycerin, Behentrimonium Chloride, Hydrolyzed Quinoa, Panthenol, Parfum, Phenoxyethanol', 'custom.how_to_use': 'Shake well\nMist over damp or dry lengths\nComb through and style as usual' },
        hairType: 'Wavy, Curly, Coily',
        wholesale: { price: 7.8, min: 6, increment: 6, tiers: [[24, 7.4]] },
        images: ['Spray bottle on a mist background', 'Comb gliding through wavy hair']
      },
      {
        handle: 'wide-tooth-comb', title: 'Wide-tooth comb', type: 'Tool', category: 'Health & Beauty > Personal Care > Hair Care > Hair Care Tools > Combs & Brushes', tags: ['tools'],
        description: '<p>A saw-cut comb with rounded teeth for detangling wet hair without pulling.</p>',
        options: ['Title'], variants: [['Default Title', 90, 9]],
        grams: 40,
        metafields: { 'custom.subtitle': 'For wet hair' },
        wholesale: { price: 3.8, min: 12, increment: 12 },
        images: ['Comb on a mist background']
      }
    ]
  },

  balm: {
    store: 'Balm demo',
    vendor: 'Balm Atelier',
    industry: 'Beauty (body care)',
    unitNote: 'Unit prices per 100 ml or per 100 g; set them on each variant in the admin (Unit price section).',
    metafields: [
      { key: 'shopify.skin-type', type: 'list.metaobject_reference (category metafield)', name: 'Skin type', use: 'Attribute chips (Skin type) and collection filters; set values in the admin from the Skin care category' },
      { key: 'custom.subtitle', type: 'single_line_text_field', name: 'Subtitle', use: 'Product card subtitle' },
      { key: 'custom.scent_top', type: 'single_line_text_field', name: 'Top notes', use: 'Scent notes > Top (dynamic source)' },
      { key: 'custom.scent_heart', type: 'single_line_text_field', name: 'Heart notes', use: 'Scent notes > Heart (dynamic source)' },
      { key: 'custom.scent_base', type: 'single_line_text_field', name: 'Base notes', use: 'Scent notes > Base (dynamic source)' },
      { key: 'custom.inci', type: 'multi_line_text_field', name: 'Full ingredient list (INCI)', use: 'Ingredients > full list (dynamic source)' },
      { key: 'custom.warnings', type: 'multi_line_text_field', name: 'Warnings', use: 'Warnings and precautions row (dynamic source)' },
      { key: 'custom.pao_months', type: 'number_integer', name: 'Period after opening (months)', use: 'Period after opening block (dynamic source)' }
    ],
    collections: [
      { title: 'Butters and lotions', handle: 'butters-and-lotions', rule: 'Type is equal to Body butter, or Type is equal to Body lotion', description: 'Whipped butters and light lotions for dry skin.' },
      { title: 'Scrubs', handle: 'scrubs', rule: 'Type is equal to Scrub', description: 'Polish away dry skin twice a week.' },
      { title: 'Oils', handle: 'oils', rule: 'Type is equal to Oil', description: 'Fast-absorbing dry oils.' },
      { title: 'Hand care', handle: 'hand-care', rule: 'Type is equal to Hand care', description: 'Creams for hands that wash often.' },
      { title: 'Gift sets', handle: 'gift-sets', rule: 'Type is equal to Gift set', description: 'Rituals wrapped and ready to give.' },
      { title: 'Under €25', handle: 'under-25', rule: 'Price is less than 25', description: 'Small gifts.' },
      { title: '€25 to €50', handle: '25-to-50', rule: 'Price is greater than 24.99 and price is less than 50.01', description: 'Treats.' },
      { title: 'Over €50', handle: 'over-50', rule: 'Price is greater than 50', description: 'Big gestures.' }
    ],
    products: [
      {
        handle: 'whipped-shea-body-butter', title: 'Whipped shea body butter', type: 'Body butter', category: 'Health & Beauty > Personal Care > Cosmetics > Skin Care > Lotions & Moisturizers', tags: ['vegan', 'dry-skin', 'Warm', 'Unscented', 'highlight'],
        description: '<p>Shea and cocoa butter whipped until light, so it melts at skin temperature and sinks in without a greasy film. Choose vanilla, coconut or unscented.</p>',
        options: ['Size', 'Scent'],
        variants: [['200 ml', 'Vanilla', 50, 19, { measure: '200 ml', base: '100 ml' }], ['200 ml', 'Coconut', 44, 19, { measure: '200 ml', base: '100 ml' }], ['200 ml', 'Unscented', 30, 19, { measure: '200 ml', base: '100 ml' }], ['500 ml', 'Vanilla', 18, 34, { measure: '500 ml', base: '100 ml' }], ['500 ml', 'Coconut', 12, 34, { measure: '500 ml', base: '100 ml' }], ['500 ml', 'Unscented', 6, 34, { measure: '500 ml', base: '100 ml' }]],
        grams: 260,
        metafields: { 'custom.subtitle': 'Dry and sensitive skin', 'custom.scent_top': 'Bergamot, Pink pepper', 'custom.scent_heart': 'Orange blossom, Jasmine', 'custom.scent_base': 'Vanilla, Sandalwood', 'custom.inci': 'Butyrospermum Parkii Butter, Theobroma Cacao Seed Butter, Prunus Amygdalus Dulcis Oil, Caprylic/Capric Triglyceride, Tocopherol, Parfum, Linalool, Limonene', 'custom.pao_months': '12' },
        skinType: 'Dry, Sensitive',
        wholesale: { price: 8.6, perVariant: { '500 ml': 15.4 }, min: 6, increment: 6, tiers: [[24, 8.1]] },
        sellingPlan: 'Delivery every 6 or 8 weeks, 10% off',
        images: ['200 ml glass jar on a haze background', 'Whipped texture macro', 'Hands warming the butter'],
        note: 'Subscription, scent notes, period after opening 12M, size × scent.'
      },
      {
        handle: 'coffee-body-scrub', title: 'Coffee body scrub', type: 'Scrub', category: 'Health & Beauty > Personal Care > Cosmetics > Skin Care > Body Scrubs', tags: ['vegan', 'Warm'],
        description: '<p>Fine-ground coffee and sugar in a base of sweet almond oil. It buffs rough patches and leaves a light, comforting scent.</p>',
        options: ['Size'], variants: [['250 g', 40, 16, { measure: '250 g', base: '100 g' }]],
        grams: 290,
        metafields: { 'custom.subtitle': 'Coffee and sugar', 'custom.scent_top': 'Coffee', 'custom.scent_heart': 'Cacao', 'custom.scent_base': 'Brown sugar', 'custom.inci': 'Sucrose, Coffea Arabica Seed Powder, Prunus Amygdalus Dulcis Oil, Cocos Nucifera Oil, Tocopherol', 'custom.pao_months': '6' },
        skinType: 'Normal, Dry',
        wholesale: { price: 7.2, min: 6, increment: 6 },
        images: ['Jar with lid open', 'Scrub texture on the palm'],
        note: 'Unit price per 100 g; no tiers.'
      },
      {
        handle: 'dry-body-oil', title: 'Dry body oil', type: 'Oil', category: 'Health & Beauty > Personal Care > Cosmetics > Skin Care > Body Oil', tags: ['vegan', 'Floral'],
        description: '<p>A blend of squalane and camellia oil that absorbs in a minute and leaves a soft sheen. Press it into damp skin after the shower.</p>',
        options: ['Size'], variants: [['100 ml', 36, 24, { measure: '100 ml', base: '100 ml' }]],
        grams: 180,
        metafields: { 'custom.subtitle': 'Absorbs in a minute', 'custom.scent_top': 'Neroli', 'custom.scent_heart': 'Rose geranium', 'custom.scent_base': 'Cedarwood', 'custom.inci': 'Squalane, Camellia Oleifera Seed Oil, Caprylic/Capric Triglyceride, Tocopherol, Parfum, Geraniol, Citronellol', 'custom.warnings': 'For external use only.\nAvoid contact with eyes.\nSurfaces can become slippery; wipe the shower floor after use.', 'custom.pao_months': '12' },
        skinType: 'Normal, Dry, Sensitive',
        wholesale: { price: 10.8, min: 6, increment: 6, tiers: [[36, 10.2]] },
        images: ['Glass bottle with dropper on a haze background', 'Oil droplets on skin'],
        note: 'Warnings row.'
      },
      {
        handle: 'body-butter-tester', title: 'Body butter tester', type: 'Tester', category: 'Health & Beauty > Personal Care > Cosmetics > Skin Care > Lotions & Moisturizers', tags: ['b2b', 'tester'],
        description: '<p>A 200 ml tester of the whipped shea body butter for shop counters, labeled "Tester, not for sale".</p>',
        options: ['Scent'], variants: [['Vanilla', 20, 0], ['Coconut', 20, 0], ['Unscented', 20, 0]],
        grams: 260,
        metafields: { 'custom.inci': 'Butyrospermum Parkii Butter, Theobroma Cacao Seed Butter, Prunus Amygdalus Dulcis Oil, Caprylic/Capric Triglyceride, Tocopherol, Parfum, Linalool, Limonene' },
        wholesale: { price: 4.5, min: 1, increment: 1, max: 3, only: 'catalog' },
        images: ['Tester jar with label'],
        note: 'Counter tester for shops.'
      },
      {
        handle: 'ritual-gift-set', title: 'Ritual gift set', type: 'Gift set', category: 'Health & Beauty > Personal Care > Cosmetics > Bath & Body > Bath & Body Gift Sets', tags: ['gift', 'Warm'],
        description: '<p>The three steps of the ritual in one box: coffee body scrub, whipped shea body butter (200 ml, vanilla) and dry body oil, wrapped with a card for your message.</p>',
        options: ['Title'], variants: [['Default Title', 25, 49]],
        grams: 800,
        metafields: { 'custom.subtitle': 'Scrub, butter and oil' },
        wholesale: { price: 22, min: 3, increment: 3 },
        bundle: 'Create it as a bundle (Shopify Bundles) of the three products, so the cart lists the components.',
        images: ['Gift box open showing three products', 'Wrapped box with a card'],
        note: 'Gift message line item property; bundle components in the cart.'
      },
      {
        handle: 'repair-hand-cream', title: 'Repair hand cream', type: 'Hand care', category: 'Health & Beauty > Personal Care > Cosmetics > Skin Care > Hand Cream', tags: ['vegan', 'Fresh'],
        description: '<p>A rich hand cream with shea and urea for hands that wash often. Non-greasy, so you can type straight after.</p>',
        options: ['Size'], variants: [['75 ml', 80, 12, { measure: '75 ml', base: '100 ml' }]],
        grams: 100,
        metafields: { 'custom.subtitle': 'For hands that wash often', 'custom.scent_top': 'Lemon', 'custom.scent_heart': 'Green tea', 'custom.scent_base': 'Musk', 'custom.pao_months': '12' },
        skinType: 'Dry',
        wholesale: { price: 5.2, min: 12, increment: 12, tiers: [[48, 4.9]] },
        images: ['Tube on a haze background']
      },
      {
        handle: 'sea-salt-soak', title: 'Sea salt soak', type: 'Bath', category: 'Health & Beauty > Personal Care > Cosmetics > Bath & Body > Bath Salts', tags: ['bath', 'Fresh'],
        description: '<p>Coarse sea salt and magnesium flakes with a few drops of lavender oil. Dissolve a handful in a warm bath.</p>',
        options: ['Size'], variants: [['500 g', 30, 18, { measure: '500 g', base: '100 g' }]],
        grams: 540,
        metafields: { 'custom.subtitle': 'Salt and magnesium', 'custom.scent_top': 'Lavender', 'custom.scent_heart': 'Eucalyptus', 'custom.scent_base': 'Vetiver' },
        wholesale: { price: 7.9, min: 6, increment: 6 },
        images: ['Salt in a glass jar', 'Salt dissolving in water']
      },
      {
        handle: 'gentle-body-wash', title: 'Gentle body wash', type: 'Body wash', category: 'Health & Beauty > Personal Care > Cosmetics > Bath & Body > Body Wash', tags: ['vegan', 'refill', 'Fresh'],
        description: '<p>A mild, low-foam wash that cleans without tightness. The refill fills the bottle three times.</p>',
        options: ['Size'], variants: [['300 ml', 55, 14, { measure: '300 ml', base: '100 ml' }], ['1 l refill', 20, 32, { measure: '1 l', base: '100 ml' }]],
        grams: 340,
        metafields: { 'custom.subtitle': 'Mild and low-foam', 'custom.scent_top': 'Bergamot', 'custom.scent_heart': 'Fig leaf', 'custom.scent_base': 'Cedarwood' },
        skinType: 'Normal, Oily, Sensitive',
        wholesale: { price: 6.2, perVariant: { '1 l refill': 14.4 }, min: 6, increment: 6 },
        images: ['Pump bottle and refill pouch']
      },
      {
        handle: 'nourishing-lip-balm', title: 'Nourishing lip balm', type: 'Lip care', category: 'Health & Beauty > Personal Care > Cosmetics > Lip Care > Lip Balm', tags: ['vegan', 'Warm'],
        description: '<p>Candelilla wax and shea in a slim tin, with a hint of vanilla.</p>',
        options: ['Size'], variants: [['15 ml', 120, 6.5, { measure: '15 ml', base: '100 ml' }]],
        grams: 30,
        metafields: { 'custom.subtitle': 'Candelilla and shea', 'custom.pao_months': '12' },
        wholesale: { price: 2.6, min: 24, increment: 24 },
        images: ['Open tin on a haze background']
      },
      {
        handle: 'rose-body-lotion', title: 'Rose body lotion', type: 'Body lotion', category: 'Health & Beauty > Personal Care > Cosmetics > Skin Care > Lotions & Moisturizers', tags: ['vegan', 'Floral'],
        description: '<p>A fluid lotion with rose water and oat that sinks in within a minute, for mornings when a butter feels too rich.</p>',
        options: ['Size'], variants: [['250 ml', 38, 21, { measure: '250 ml', base: '100 ml' }]],
        grams: 290,
        metafields: { 'custom.subtitle': 'Light daily lotion', 'custom.scent_top': 'Pink grapefruit', 'custom.scent_heart': 'Rose, Peony', 'custom.scent_base': 'White musk', 'custom.inci': 'Rosa Damascena Flower Water, Aqua, Caprylic/Capric Triglyceride, Glycerin, Avena Sativa Kernel Extract, Cetearyl Alcohol, Parfum, Phenoxyethanol, Citronellol, Geraniol', 'custom.pao_months': '12' },
        skinType: 'Normal, Dry',
        wholesale: { price: 9.4, min: 6, increment: 6, tiers: [[24, 8.9]] },
        images: ['Pump bottle on a haze background', 'Lotion texture on the back of a hand']
      },
      {
        handle: 'exfoliating-mitt', title: 'Exfoliating mitt', type: 'Tool', category: 'Health & Beauty > Personal Care > Cosmetics > Bath & Body > Bath Sponges & Loofahs', tags: ['tools', 'Unscented'],
        description: '<p>A woven mitt that lifts dry skin in the shower without a scrub. Rinse it after use and hang it to dry by its loop.</p>',
        options: ['Title'], variants: [['Default Title', 60, 10]],
        grams: 40,
        metafields: { 'custom.subtitle': 'Woven, machine washable' },
        wholesale: { price: 4.2, min: 12, increment: 12 },
        images: ['Mitt hanging by its loop beside a towel']
      },
      {
        handle: 'konjac-sponge', title: 'Konjac sponge', type: 'Tool', category: 'Health & Beauty > Personal Care > Cosmetics > Bath & Body > Bath Sponges & Loofahs', tags: ['tools', 'Unscented'],
        description: '<p>A plant-fiber sponge that softens in water for gentle daily exfoliation. Replace it every two to three months.</p>',
        options: ['Title'], variants: [['Default Title', 70, 8]],
        grams: 20,
        metafields: { 'custom.subtitle': 'Plant fiber' },
        wholesale: { price: 3.2, min: 12, increment: 12 },
        images: ['Sponge beside a folded towel']
      }
    ]
  }
};
