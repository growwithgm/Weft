// Pages, menus, blog articles and theme editor steps for the three demo stores. Read by
// scripts/build-demo-content.mjs next to demo-catalog.mjs. Copy is original and brand-neutral. The blog keeps
// Shopify's default handle "news" (titled Journal), which the page scenarios visit.

const policies = [
  'Refund policy', 'Privacy policy', 'Terms of service', 'Shipping policy', 'Contact information'
];

export default {
  weft: {
    menus: {
      'main-menu': [
        ['New in', '/collections/new-in'],
        ['Dresses and skirts', '/collections/dresses-skirts'],
        ['Tops and tunics', '/collections/tops-tunics'],
        ['Outerwear', '/collections/outerwear'],
        ['Accessories', '/collections/accessories'],
        ['Sale', '/collections/sale'],
        ['Wholesale', '/pages/wholesale']
      ],
      footer: [
        ['About', '/pages/about'],
        ['FAQ', '/pages/faq'],
        ['Contact', '/pages/contact'],
        ['Lookbook', '/pages/lookbook'],
        ['Delivery', '/pages/shipping-calculator'],
        ['Journal', '/blogs/news']
      ]
    },
    pages: [
      {
        title: 'About', handle: 'about', template: 'page.about',
        body: '<p>We make loose, easy clothes with embroidery stitched by hand. Every tunic and kaftan starts as plain cotton or linen and goes to a small group of embroiderers who work at home, at their own pace.</p><p>We keep the range small and restock the pieces people come back for. When a color sells out, it may take a few weeks to return, because the needlework can\'t be hurried.</p>'
      },
      {
        title: 'FAQ', handle: 'faq', template: 'page.faq',
        faq: [
          ['How do the sizes run?', 'Our pieces are cut loose. S/M fits EU 36 to 42, L/XL fits EU 44 to 48 and XXL fits EU 50 to 52. Each product page lists the model\'s height and size.'],
          ['How should I wash embroidered pieces?', 'Hand wash cold or use a gentle cycle inside a laundry bag, then dry flat in the shade. Iron on the reverse, away from the stitching.'],
          ['When will my order arrive?', 'Orders placed before 2 pm on a weekday leave the same day. Delivery takes two to four working days in Spain and four to seven across the EU.'],
          ['Can I return an item?', 'Yes, within 30 days of delivery, unworn and with the tags on. Start a return from your account.'],
          ['Do you sell to shops?', 'Yes. Apply on the Wholesale page; once your account is approved you see wholesale prices and order by the pack.']
        ]
      },
      { title: 'Contact', handle: 'contact', template: 'page.contact', body: '<p>Write to us with any question about sizes, orders or wholesale. We reply within one working day.</p>' },
      { title: 'Lookbook', handle: 'lookbook', template: 'page.lookbook', body: '<p>The summer pieces, photographed on the coast.</p>' },
      { title: 'Delivery', handle: 'shipping-calculator', template: 'page.shipping-calculator', body: '<p>Delivery takes two to four working days in Spain and four to seven across the EU. Enter your address to see the rates for your order.</p>' },
      { title: 'Wholesale', handle: 'wholesale', template: 'page.wholesale-access', body: '<p>We supply independent boutiques across Europe. Sign in with your trade account to see wholesale prices, or apply for one below.</p>' },
      { title: 'Apply for a trade account', handle: 'wholesale-request', template: 'page.wholesale-request', body: '<p>Tell us about your shop. We review every application within two working days.</p>' },
      { title: 'Quick order', handle: 'quick-order', template: 'page.quick-order', body: '<p>Order several styles at once, by the pack.</p>' }
    ],
    blog: {
      title: 'Journal', handle: 'news',
      articles: [
        {
          title: 'How a tunic is embroidered', tags: ['Making'],
          excerpt: 'Two days, one needle and a pattern passed from hand to hand.',
          body: '<p>Each Leila tunic starts as a plain cut piece of cotton voile. The pattern is traced onto the neckline with a water-soluble pen, then stitched in a chain stitch that follows the curve of the collar.</p><p>The cuffs come next, with a smaller version of the same pattern. When the stitching is done, the tunic is washed to lift the pen marks and pressed from the reverse so the embroidery stays raised.</p>'
        },
        {
          title: 'Three ways to wear a kaftan', tags: ['Styling'],
          excerpt: 'Beach, city and evening, with the same one-size piece.',
          body: '<p>Worn loose, a kaftan is a cover-up for the beach. Gather the drawstring and add sandals, and it works for lunch in town.</p><p>For the evening, belt it at the waist, roll the sleeves once and add a pair of statement earrings.</p>'
        }
      ]
    },
    editor: [
      'Home page > Featured collection (first): collection "New in"; second: "Sale".',
      'Home page > Collection list: Dresses and skirts, Tops and tunics, Outerwear, Accessories.',
      'Product page > Delivery list > Fit row: connect custom.fit_guide. Product guide: image custom.size_chart, second row custom.best_suited_for.',
      'Product page > Specifications: rows for custom.material and custom.embroidery. How to use: custom.care.',
      'Theme settings > Product cards: show subtitle on (custom.subtitle).',
      'Page "Lookbook": add image hotspots on the lookbook images, pointing at the Leila tunic, the Nour tote and the Rania hat.'
    ],
    policies
  },

  tress: {
    menus: {
      'main-menu': [
        ['Shampoo', '/collections/shampoo'],
        ['Conditioner', '/collections/conditioner'],
        ['Masks and treatments', '/collections/masks'],
        ['Styling', '/collections/styling'],
        ['Color', '/collections/color'],
        ['Find your routine', '/pages/find-your-routine'],
        ['For salons', '/pages/wholesale']
      ],
      footer: [
        ['About', '/pages/about'],
        ['FAQ', '/pages/faq'],
        ['Contact', '/pages/contact'],
        ['Journal', '/blogs/news']
      ]
    },
    pages: [
      {
        title: 'About', handle: 'about', template: 'page.about',
        body: '<p>We started in a salon back room, mixing treatments for clients whose hair had been through too much bleach and heat. The formulas that worked became the range.</p><p>Every product is sold in a home size and a salon size, and every label lists the full ingredient list, because stylists and their clients deserve to know what goes on their hair.</p>'
      },
      {
        title: 'FAQ', handle: 'faq', template: 'page.faq',
        faq: [
          ['Which products suit my hair type?', 'Each product page lists the hair types it is made for. The routine finder asks two questions and shows the products that match.'],
          ['Are the products sulfate-free?', 'The shampoos use mild, sulfate-free cleansers. Each product page has the full ingredient list.'],
          ['How does the subscription work?', 'Choose a delivery every 4, 6 or 8 weeks and save 10%. Skip or cancel any time from your account.'],
          ['Can I use the masks on color-treated hair?', 'Yes. The bond repair mask was made for hair lightened or colored in the salon.'],
          ['Do you supply salons?', 'Yes. Salons order back-bar sizes and color at trade prices. Apply on the For salons page.']
        ]
      },
      { title: 'Contact', handle: 'contact', template: 'page.contact', body: '<p>Questions about a product or a salon account? Our team answers within one working day.</p>' },
      { title: 'Find your routine', handle: 'find-your-routine', template: 'page.finder', body: '<p>Two questions, one routine.</p>' },
      { title: 'For salons', handle: 'wholesale', template: 'page.wholesale-access', body: '<p>Back-bar sizes, professional color and trade prices for salons. Sign in with your salon account, or apply for one.</p>' },
      { title: 'Apply for a salon account', handle: 'wholesale-request', template: 'page.wholesale-request', body: '<p>Tell us about your salon and the number of chairs. We reply within two working days.</p>' },
      { title: 'Quick order', handle: 'quick-order', template: 'page.quick-order', body: '<p>Restock the back bar in one go.</p>' }
    ],
    blog: {
      title: 'Journal', handle: 'news',
      articles: [
        {
          title: 'Why bonds break, and how to repair them', tags: ['Repair'],
          excerpt: 'What bleach and heat do inside the hair, in plain words.',
          body: '<p>Hair gets its strength from bonds between the keratin chains inside each strand. Lightening and high heat break some of those bonds, which is why bleached hair stretches and snaps.</p><p>Bond repair treatments link the broken ends back together. Used once a week, they make hair feel stronger and help it hold color for longer.</p>'
        },
        {
          title: 'A wash-day routine for curls', tags: ['Curly'],
          excerpt: 'Four steps from shampoo to scrunch.',
          body: '<p>Start with a gentle shampoo on the scalp only, and let the lather rinse through the lengths. Condition generously and detangle with a wide-tooth comb while the conditioner is in.</p><p>On soaking wet hair, rake the curl cream through section by section, scrunch upwards and leave it to dry. Once it is fully dry, scrunch out the cast.</p>'
        }
      ]
    },
    finder: {
      heading: 'Find your routine',
      questions: [
        ['What is your hair type?', 'filter.p.m.shopify.hair-type', ['Straight', 'Wavy', 'Curly', 'Coily']],
        ['What would you like to fix?', 'filter.p.tag', ['Damage', 'Frizz', 'Volume', 'Color care']]
      ]
    },
    editor: [
      'Home page > Featured collection: collection "Repair routine". Collection list: Shampoo, Conditioner, Masks and treatments, Styling, Color, Tools.',
      'Page "Find your routine" (template page.finder): set the finder questions as listed under "Finder answers" below; the answers match the hair types and the tags in products.csv.',
      'Product page > Ingredients > full list: connect custom.inci. How to use: custom.how_to_use. Attribute chips: Hair type (shopify.hair-type) and Concern (custom.concern).',
      'Product page: replace the Description block with a Product tabs block (Description on; first custom tab "Delivery and returns" with the delivery text from the FAQ), so the product tabs show on the demo store.',
      'Theme settings > Product labels > Custom label: custom.label ("Professional").',
      'Theme settings > Product cards: show subtitle on (custom.subtitle).'
    ],
    policies
  },

  balm: {
    menus: {
      'main-menu': [
        ['Butters and lotions', '/collections/butters-and-lotions'],
        ['Scrubs', '/collections/scrubs'],
        ['Oils', '/collections/oils'],
        ['Hand care', '/collections/hand-care'],
        ['Gift sets', '/collections/gift-sets'],
        ['Find your routine', '/pages/find-your-routine'],
        ['For shops', '/pages/wholesale']
      ],
      footer: [
        ['About', '/pages/about'],
        ['FAQ', '/pages/faq'],
        ['Contact', '/pages/contact'],
        ['Gifts under €25', '/collections/under-25'],
        ['Journal', '/blogs/news']
      ]
    },
    pages: [
      {
        title: 'About', handle: 'about', template: 'page.about',
        body: '<p>We make body care in small batches: butters whipped by the kilo, scrubs mixed by hand and oils blended to order. Nothing sits in a warehouse for months.</p><p>Each jar lists its full ingredients, its scent notes and how long it keeps once open, so you can choose with your nose and your skin in mind.</p>'
      },
      {
        title: 'FAQ', handle: 'faq', template: 'page.faq',
        faq: [
          ['How long do the products keep?', 'Each product page shows the period after opening, usually 6 or 12 months. Unopened jars keep for two years stored away from heat.'],
          ['Are the products suitable for sensitive skin?', 'Look for the Sensitive skin type on the product page. The unscented body butter is the gentlest choice.'],
          ['Can I add a gift message?', 'Yes. The gift sets have a message field on the product page; we print it on a card inside the box.'],
          ['Is the packaging recyclable?', 'The jars are glass with aluminum lids, and the refill pouch uses a quarter of the plastic of a new bottle.'],
          ['Do you sell to shops and spas?', 'Yes. Apply on the For shops page to see trade prices, testers and case sizes.']
        ]
      },
      { title: 'Contact', handle: 'contact', template: 'page.contact', body: '<p>Ask us anything about ingredients, orders or trade accounts. We reply within one working day.</p>' },
      { title: 'Find your routine', handle: 'find-your-routine', template: 'page.finder', body: '<p>Two questions for a routine that suits your skin.</p>' },
      { title: 'For shops', handle: 'wholesale', template: 'page.wholesale-access', body: '<p>Trade prices, counter testers and case sizes for shops and spas. Sign in with your trade account, or apply for one.</p>' },
      { title: 'Apply for a trade account', handle: 'wholesale-request', template: 'page.wholesale-request', body: '<p>Tell us about your shop or spa. We reply within two working days.</p>' },
      { title: 'Quick order', handle: 'quick-order', template: 'page.quick-order', body: '<p>Restock the shelves in one order.</p>' }
    ],
    blog: {
      title: 'Journal', handle: 'news',
      articles: [
        {
          title: 'The three-step body ritual', tags: ['Ritual'],
          excerpt: 'Scrub, butter, oil: what each step does and when to skip one.',
          body: '<p>Scrub twice a week on damp skin to lift dry flakes, then rinse. Straight after the shower, while the skin is still warm, press in the body butter where skin feels tight.</p><p>Finish with a few drops of dry oil on the arms and legs for a soft sheen. On busy mornings, the oil alone is enough.</p>'
        },
        {
          title: 'Reading a scent: top, heart and base notes', tags: ['Scent'],
          excerpt: 'Why a scent changes on your skin over an hour.',
          body: '<p>Top notes are what you smell first, usually bright citrus or spice that fade within minutes. Heart notes, often floral, carry the scent for the next hour.</p><p>Base notes such as vanilla, sandalwood and cedarwood last longest and stay close to the skin.</p>'
        }
      ]
    },
    finder: {
      heading: 'Find your routine',
      questions: [
        ['How does your skin feel today?', 'filter.p.m.shopify.skin-type', ['Dry', 'Sensitive', 'Normal', 'Oily']],
        ['Which scent do you like?', 'filter.p.tag', ['Warm', 'Fresh', 'Floral', 'Unscented']]
      ]
    },
    editor: [
      'Home page > Featured collection (first): "Butters and lotions"; second: "Gift sets". Collection list: Butters and lotions, Scrubs, Oils, Hand care, Gift sets, Under €25.',
      'Page "Find your routine" (template page.finder): set the finder questions as listed under "Finder answers" below; the answers match the skin types and the tags in products.csv.',
      'Product page > Scent notes: top custom.scent_top, heart custom.scent_heart, base custom.scent_base. Ingredients > full list: custom.inci. Period after opening: custom.pao_months. Warnings row: custom.warnings.',
      'Ritual gift set: product template with the Gift message custom option (Custom option block, Gift message preset).',
      'Home page > Gift guide tabs: Under €25 → collection "Under €25", €25 to €50 → "€25 to €50", Over €50 → "Over €50".',
      'Product page: replace the Description block with a Product tabs block (Description on; first custom tab "Delivery and returns" with the delivery text from the FAQ), so the product tabs show on the demo store.',
      'Theme settings > Product cards: show subtitle on (custom.subtitle).'
    ],
    policies
  }
};
