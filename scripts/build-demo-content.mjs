#!/usr/bin/env node
// Writes demo-content/<preset>/ for the three demo stores (VERTICALS §5, BUILD_SPEC §8.4) from
// scripts/src/demo-catalog.mjs and scripts/src/demo-pages.mjs:
//   products.csv    Shopify product CSV (current column names), ready for Products > Import
//   products.md     catalog overview and the product settings a CSV can't carry
//   metafields.md   metafield definitions to create before the import, and where each one is used
//   collections.md  smart collections and menus
//   b2b-setup.md    company, locations, catalog, price list, quantity rules, volume pricing
//   pages.md        pages, blog articles, policies, finder answers and theme editor steps
//   images.md       shot list with alt text, and the image credits table
//   README.md       setup order for the store
//
//   node scripts/build-demo-content.mjs            write the files
//   node scripts/build-demo-content.mjs --check    exit 1 when a file is out of date or a rule fails
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import catalogs from './src/demo-catalog.mjs';
import content from './src/demo-pages.mjs';
import { variantsOf, wholesaleOf, skuOf, catalogProblems } from './src/demo-rules.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'demo-content');
const check = process.argv.includes('--check');
const PRESET_NAME = { weft: 'Weft', tress: 'Tress', balm: 'Balm' };

const COMPANY = {
  weft: {
    company: 'Boutique Luna S.L.', buyer: 'Lucía Márquez', catalog: 'Wholesale',
    locations: ['Madrid Serrano', 'Valencia Ruzafa'], credit: '€150.00 store credit on Madrid Serrano (optional state)'
  },
  tress: {
    company: 'Salón Onda S.L.', buyer: 'Marta Ruiz', catalog: 'Salon',
    locations: ['Barcelona Gràcia', 'Girona Centre'], credit: null
  },
  balm: {
    company: 'Casa Alma Concept Store S.L.', buyer: 'Elena Vidal', catalog: 'Trade',
    locations: ['Seville Triana', 'Málaga Centro'], credit: null
  }
};

// Scene images the home page and pages use, besides the product images.
const SCENES = {
  weft: [
    ['home-banner', 'Two women walking on a pale beach in long embroidered tunics, late afternoon light', 'Home page > Image banner'],
    ['home-story', 'Hands stitching a chain-stitch pattern on cotton voile', 'Home page > Media with text'],
    ['collection-dresses', 'Terracotta maxi dress hanging on a wooden rail', 'Collection image: Dresses and skirts'],
    ['collection-tops', 'Ecru tunic folded on a linen sheet', 'Collection image: Tops and tunics'],
    ['collection-outerwear', 'Cropped quilted jacket over a chair back', 'Collection image: Outerwear'],
    ['collection-accessories', 'Straw hat, silk scarf and canvas tote on a table', 'Collection image: Accessories'],
    ['lookbook-1', 'Model in the Zahra kaftan on rocks by the sea', 'Lookbook > Image banner and shoppable image'],
    ['lookbook-2', 'Model with the Nour tote and Rania hat at a market stall', 'Lookbook > Promo grid'],
    ['journal-embroidery', 'Close-up of a needle pulling thread through a traced pattern', 'Journal article: How a tunic is embroidered'],
    ['journal-kaftan', 'Kaftan belted at the waist, evening light', 'Journal article: Three ways to wear a kaftan']
  ],
  tress: [
    ['home-banner', 'Stylist blow-drying a client\'s long wavy hair in a bright salon', 'Home page > Image banner (first)'],
    ['home-salon', 'Back-bar basins with refill containers on a shelf', 'Home page > Image banner (second), salon message'],
    ['before', 'Lengths of bleached hair, frizzy and dull, photographed against a gray card', 'Home page > Before and after (before)'],
    ['after', 'The same lengths after four weeks of the bond repair mask, same light and crop', 'Home page > Before and after (after)'],
    ['ingredient', 'Argan kernels and a drop of oil on a spoon', 'Home page > Ingredient spotlight'],
    ['collection-shampoo', 'Row of shampoo bottles on a mist background', 'Collection image: Shampoo'],
    ['collection-color', 'Color tubes and a mixing bowl with a brush', 'Collection image: Color'],
    ['journal-bonds', 'Macro of a hair strand under raking light', 'Journal article: Why bonds break'],
    ['journal-curls', 'Defined curls from behind, drying in the air', 'Journal article: A wash-day routine for curls']
  ],
  balm: [
    ['home-banner', 'Glass jars of body butter on a stone ledge in soft morning light', 'Home page > Image banner (first)'],
    ['home-gift', 'Wrapped gift box with a handwritten card', 'Home page > Image banner (second), gifting'],
    ['before', 'Dry skin on a forearm, photographed against a warm neutral card', 'Home page > Before and after (before)'],
    ['after', 'The same forearm after two weeks of scrub and butter, same light and crop', 'Home page > Before and after (after)'],
    ['collection-butter', 'Whipped butter in an open jar, scooped with a spatula', 'Collection image: Butters and lotions'],
    ['collection-scrub', 'Coffee scrub scattered on a slate', 'Collection image: Scrubs'],
    ['collection-oil', 'Dropper bottle catching the light', 'Collection image: Oils'],
    ['journal-ritual', 'Scrub, butter and oil lined up by a bath', 'Journal article: The three-step body ritual'],
    ['journal-scent', 'Vanilla pods, orange blossom and cedar shavings', 'Journal article: Reading a scent']
  ]
};

// CSV
const CSV_HEAD = [
  'Title', 'URL handle', 'Description', 'Vendor', 'Product category', 'Type', 'Tags', 'Published on online store', 'Status',
  'SKU', 'Barcodes', 'Option1 name', 'Option1 value', 'Option1 LinkedTo', 'Option2 name', 'Option2 value', 'Option2 LinkedTo',
  'Price', 'Compare-at price', 'Cost per item', 'Charge tax', 'Inventory tracker', 'Inventory quantity',
  'Continue selling when out of stock', 'Weight value (grams)', 'Weight unit for display', 'Requires shipping',
  'Fulfillment service', 'Product image URL', 'Image position', 'Image alt text', 'Variant image URL', 'Gift card',
  'SEO title', 'SEO description'
];
// Metafield types the product CSV imports (file and metaobject references are set in the admin).
const CSV_TYPES = /^(single_line_text_field|multi_line_text_field|number_integer|number_decimal|boolean|url|list\.single_line_text_field)$/;
const cell = (v) => {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const money = (n) => (n == null ? '' : n.toFixed(2));
const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const seo = (html) => {
  const t = text(html);
  if (t.length <= 155) return t;
  const cut = t.slice(0, 155);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
};
const euro = (n) => `€${n.toFixed(2)}`;
const paras = (html) => html.split('</p>').map(text).filter(Boolean).join('\n\n');

function productsCsv(preset, catalog) {
  const fields = catalog.metafields.filter((m) => CSV_TYPES.test(m.type));
  const head = [...CSV_HEAD, ...fields.map((m) => `${m.name} (product.metafields.${m.key})`)];
  const rows = [head];
  catalog.products.forEach((p, index) => {
    variantsOf(p).forEach((v, i) => {
      const first = i === 0;
      const row = {
        'URL handle': p.handle,
        SKU: skuOf(preset, index, v),
        'Option1 value': v.values[0],
        'Option2 value': v.values[1] ?? '',
        Price: money(v.price),
        'Compare-at price': money(p.compareAt),
        'Charge tax': 'TRUE',
        'Inventory tracker': v.stock === null ? '' : 'shopify',
        'Inventory quantity': v.stock ?? '',
        'Continue selling when out of stock': 'deny',
        'Weight value (grams)': p.grams,
        'Weight unit for display': p.grams >= 1000 ? 'kg' : 'g',
        'Requires shipping': 'TRUE',
        'Fulfillment service': 'manual'
      };
      if (first) {
        Object.assign(row, {
          Title: p.title, Description: p.description, Vendor: catalog.vendor, Type: p.type, Tags: p.tags.join(', '),
          'Published on online store': 'TRUE', Status: 'active', 'Option1 name': p.options[0], 'Option2 name': p.options[1] ?? '',
          'Gift card': 'FALSE', 'SEO title': p.title, 'SEO description': seo(p.description)
        });
        for (const m of fields) row[`${m.name} (product.metafields.${m.key})`] = p.metafields?.[m.key] ?? '';
      }
      rows.push(head.map((h) => row[h] ?? ''));
    });
  });
  if (catalog.giftCard) {
    const g = catalog.giftCard;
    g.denominations.forEach((d, i) => {
      const row = {
        'URL handle': g.handle, 'Option1 value': `€${d}`, Price: money(d), 'Charge tax': 'FALSE', 'Continue selling when out of stock': 'deny',
        'Requires shipping': 'FALSE', 'Fulfillment service': 'manual'
      };
      if (i === 0) {
        Object.assign(row, {
          Title: g.title, Description: g.description, Vendor: catalog.vendor, Type: 'Gift card', 'Published on online store': 'TRUE',
          Status: 'active', 'Option1 name': 'Denominations', 'Gift card': 'TRUE', 'SEO title': g.title, 'SEO description': seo(g.description)
        });
      }
      rows.push(head.map((h) => row[h] ?? ''));
    });
  }
  return `${rows.map((r) => r.map(cell).join(',')).join('\n')}\n`;
}

const table = (head, rows) => [
  `| ${head.join(' | ')} |`,
  `|${head.map(() => '---').join('|')}|`,
  ...rows.map((r) => `| ${r.map((c) => String(c ?? '').replace(/\|/g, '\\|').replace(/\n/g, '<br>')).join(' | ')} |`)
].join('\n');

const rule = (w) => `${w.min} / ${w.increment}${w.max ? ` / max ${w.max}` : ''}`;
const tiers = (list) => (list.length ? list.map(([q, pr]) => `${q}+ ${euro(pr)}`).join(', ') : '—');
const retail = (p) => [...new Set(variantsOf(p).map((v) => euro(v.price)))].join(' / ');
const onlyLabel = { catalog: 'Wholesale only (catalog)', tag: 'Wholesale only (tag)' };

function productsMd(preset, catalog) {
  const name = PRESET_NAME[preset];
  const out = [`# ${name} demo store: products`, '', `Generated by \`scripts/build-demo-content.mjs\` from \`scripts/src/demo-catalog.mjs\`. Edit the source, not this file.`, ''];
  out.push(`${catalog.products.length} products${catalog.giftCard ? ' and a gift card' : ''}, vendor "${catalog.vendor}", prices in EUR. Import \`products.csv\` from Products > Import after the metafield definitions exist (\`metafields.md\`).`, '');
  out.push(table(
    ['Product', 'Handle', 'Variants', 'Retail', 'Wholesale per piece', 'Rule (min / increment)', 'Tiers', 'Notes'],
    catalog.products.map((p) => {
      const vs = variantsOf(p);
      const prices = [...new Set(vs.map((v) => euro(wholesaleOf(p, v).price)))].join(' / ');
      return [
        p.title, `\`${p.handle}\``, vs.length, p.wholesale.only && vs.every((v) => v.price === 0) ? '—' : retail(p) + (p.compareAt ? ` (was ${euro(p.compareAt)})` : ''),
        prices, rule(p.wholesale), tiers(p.wholesale.tiers || []), [onlyLabel[p.wholesale.only], p.note].filter(Boolean).join('. ')
      ];
    })
  ), '');

  out.push('## Set in the admin after the import', '', 'The product CSV leaves these out (unsupported columns or app features). Set them product by product.', '');
  out.push('### Product category', '', 'Pick the category Shopify suggests, or the one below (check it against Shopify\'s product taxonomy; the names were not verified against it). The category also unlocks the category metafields (hair type, skin type, color).', '');
  out.push(table(['Product', 'Category'], catalog.products.map((p) => [p.title, p.category])), '');
  const hair = catalog.products.filter((p) => p.hairType || p.skinType);
  if (hair.length) {
    const label = preset === 'tress' ? 'Hair type' : 'Skin type';
    out.push(`### ${label}`, '', 'Category metafield, used by the attribute chips, the finder and the collection filters.', '');
    out.push(table(['Product', label], hair.map((p) => [p.title, p.hairType || p.skinType])), '');
  }
  if (catalog.unitNote) {
    out.push('### Unit prices', '', catalog.unitNote, '');
    const rows = [];
    for (const p of catalog.products) for (const v of variantsOf(p)) if (v.unit) rows.push([p.title, v.values.join(' / '), v.unit.measure, v.unit.base]);
    out.push(table(['Product', 'Variant', 'Total measure', 'Base measure'], rows), '');
  }
  const plans = catalog.products.filter((p) => p.sellingPlan);
  const bundles = catalog.products.filter((p) => p.bundle);
  const swatches = catalog.products.filter((p) => p.swatches);
  const files = catalog.metafields.filter((m) => !CSV_TYPES.test(m.type) && !m.key.startsWith('shopify.'));
  const extras = [];
  if (plans.length) extras.push(`**Selling plans** need the Shopify Subscriptions app: ${plans.map((p) => `${p.title} (${p.sellingPlan})`).join('; ')}. Demo stores run without apps, so leave them out there unless Shopify allows the app; the dev store used for the scenario tests needs them (scenarios 17 and 22).`);
  if (bundles.length) extras.push(`**Bundles** need the Shopify Bundles app: ${bundles.map((p) => `${p.title}: ${p.bundle}`).join(' ')} The same no-apps rule applies to demo stores.`);
  if (swatches.length) extras.push(`**Swatches:** ${swatches.map((p) => `${p.title}: ${p.swatches}`).join(' ')}`);
  if (files.length) extras.push(`**File metafields** (${files.map((m) => `\`${m.key}\``).join(', ')}): upload the images listed in \`images.md\` and pick them on each product.`);
  if (catalog.giftCard) extras.push(`**Gift card:** the CSV creates "${catalog.giftCard.title}" with ${catalog.giftCard.denominations.map((d) => `€${d}`).join(', ')}.`);
  extras.push('**Images:** upload the shots in `images.md` in the listed order, with the alt text given there.');
  out.push('### Also', '');
  extras.forEach((e) => out.push(`- ${e}`));
  out.push('');
  return out.join('\n');
}

function metafieldsMd(preset, catalog) {
  const out = [`# ${PRESET_NAME[preset]} demo store: metafield definitions`, '', 'Create these in Settings > Custom data > Products before importing `products.csv`, so the import fills them. Category metafields (`shopify.*`) come with the product category and need no definition.', ''];
  out.push(table(['Name', 'Namespace and key', 'Type', 'In the CSV', 'Where the theme uses it'],
    catalog.metafields.map((m) => [m.name, `\`${m.key}\``, m.type, CSV_TYPES.test(m.type) ? 'yes' : 'no, set in the admin', m.use])), '');
  out.push('Dynamic sources: connect each field in the theme editor where the last column says so. The theme reads nothing from a metafield until it is connected, except the theme settings that name a metafield key (product card subtitle, custom label, wholesale pack image), whose defaults already match these keys.', '');
  return out.join('\n');
}

function collectionsMd(preset, catalog, page) {
  const out = [`# ${PRESET_NAME[preset]} demo store: collections and menus`, '', 'Create every collection as an automated (smart) collection with the conditions below, so new products join on their own. Add the collection images from `images.md`.', ''];
  out.push(table(['Collection', 'Handle', 'Conditions', 'Description'], catalog.collections.map((c) => [c.title, `\`${c.handle}\``, c.rule, c.description])), '');
  out.push('## Menus', '', 'Online Store > Navigation.', '');
  for (const [handle, items] of Object.entries(page.menus)) {
    out.push(`**${handle === 'main-menu' ? 'Main menu' : 'Footer menu'}** (\`${handle}\`)`, '');
    out.push(table(['Label', 'Link'], items.map(([l, u]) => [l, `\`${u}\``])), '');
  }
  return out.join('\n');
}

function b2bMd(preset, catalog) {
  const c = COMPANY[preset];
  const out = [`# ${PRESET_NAME[preset]} demo store: B2B setup`, ''];
  out.push('Native Shopify B2B only: companies, catalogs, price lists, quantity rules and volume pricing. The theme reads them through `customer.b2b?`, the company location and each variant\'s quantity rule and price breaks, so nothing here is copied into the theme.', '');
  out.push('## Company and test contact', '');
  out.push(table(['Field', 'Value'], [
    ['Company', c.company],
    ['Buyer (test contact)', `${c.buyer}, with an email address the owner controls (the reviewer signs in with it; see the testing instructions in \`docs/theme-store-listing.md\`)`],
    ['Locations', c.locations.map((l, i) => `${l}${i === 0 ? ' (ordering location)' : ''}`).join(', ')],
    ['Payment terms', 'Net 30 on both locations'],
    ['Checkout', 'Orders go straight to checkout (no draft review), so reviewers see the full flow'],
    ...(c.credit ? [['Store credit', c.credit]] : [])
  ]), '');
  out.push('Give the contact the "Ordering only" role on both locations, so the location switcher appears.', '');
  out.push(`## Catalog "${c.catalog}"`, '');
  out.push(`Assign it to both locations. Include every product below, including the wholesale-only ones. Price list in EUR with the fixed per-piece prices below; no overall adjustment. To show the location switcher changing prices, optionally give ${c.locations[1]} a second catalog with the same products and a 5% overall discount on its price list.`, '');
  const rows = [];
  for (const p of catalog.products) {
    for (const v of variantsOf(p)) {
      const w = wholesaleOf(p, v);
      rows.push([p.title, v.values.join(' / '), euro(w.price), p.wholesale.min, p.wholesale.increment, p.wholesale.max ?? '—', tiers(w.tiers)]);
    }
  }
  out.push(table(['Product', 'Variant', 'Fixed price', 'Minimum', 'Increment', 'Maximum', 'Volume pricing'], rows), '');
  out.push('Quantity rules and volume pricing are set per variant in the catalog\'s price list (Catalogs > the catalog > Products > Volume pricing / Quantity rules). They follow Shopify\'s validation: the minimum and maximum are multiples of the increment, and each volume price starts above the minimum at a multiple of the increment. `npm run test:unit` checks every row above.', '');
  out.push('## Wholesale-only products', '');
  const only = catalog.products.filter((p) => p.wholesale.only);
  out.push(table(['Product', 'How it stays wholesale-only', 'What a retail visitor sees'], only.map((p) => p.wholesale.only === 'catalog'
    ? [p.title, `Left out of the retail market catalog (Markets > the primary market > Catalog: every product except the wholesale-only ones); in "${c.catalog}"`, '404 page with the wholesale sign-in line']
    : [p.title, `Kept in the retail catalog with the tag "b2b" (Theme settings > Wholesale > Wholesale-only tag); in "${c.catalog}"`, 'Wholesale gate page with noindex; hidden from cards and search results'])), '');
  if (preset === 'weft') {
    out.push('## Order matrix and pack image', '', '- Products tagged "row" (Theme settings > Wholesale > Order matrix tag) use the order matrix: Leila tunic and Amira maxi dress.', '- Zahra kaftan is the one-size product (stepper from 6 in steps of 6). Upload its pack image to `custom.pack_image`.', '');
  }
  if (preset === 'tress') {
    out.push('## Salon specifics', '', '- Color cream is the order matrix product (tag "row"): shade by size, case of 12.', '- Back-bar shampoo is professional-only (scenario 19).', '- Custom label "Professional" (`custom.label`) marks salon products for retail visitors.', '');
  }
  if (preset === 'balm') {
    out.push('## Trade specifics', '', '- Body butter tester: one to three per scent per order, at €4.50, for shop counters.', '- Case sizes: lip balm by 24; hand cream, konjac sponge and exfoliating mitt by 12; the gift set by 3; everything else by 6.', '');
  }
  return out.join('\n');
}

function pagesMd(preset, page) {
  const out = [`# ${PRESET_NAME[preset]} demo store: pages, blog and editor`, ''];
  out.push('## Pages', '', 'Online Store > Pages. Pick the template named in each row. Templates built from sections (about, FAQ, lookbook) take their copy in the theme editor: the text below goes into the sections named.', '');
  for (const pg of page.pages) {
    out.push(`### ${pg.title}`, '', `Handle \`${pg.handle}\`, template \`${pg.template}\`.`, '');
    if (pg.body) out.push(paras(pg.body), '');
    if (pg.template === 'page.about') out.push('_Copy goes into the Story section (media with text)._', '');
    if (pg.faq) {
      out.push('Put these into the FAQ section\'s question blocks:', '');
      for (const [q, a] of pg.faq) out.push(`- **${q}** ${a}`);
      out.push('');
    }
  }
  if (page.finder) {
    out.push('## Finder answers', '', `The home page finder in the ${PRESET_NAME[preset]} preset already asks these; set the same on the "Find your routine" page (template \`page.finder\`):`, '');
    out.push(table(['Question', 'Filter parameter', 'Answers'], page.finder.questions.map(([q, f, a]) => [q, `\`${f}\``, a.join(', ')])), '');
    out.push('The tag answers match product tags in `products.csv`, and the type answers match the category metafield values in `products.md`, so every answer leads to a filled collection page. The filters need the matching collection filters in the Shopify Search & Discovery app (see README).', '');
  }
  out.push(`## Blog "${page.blog.title}"`, '', `Handle \`${page.blog.handle}\`.`, '');
  for (const a of page.blog.articles) {
    out.push(`### ${a.title}`, '', `Tags: ${a.tags.join(', ')}. Excerpt: ${a.excerpt}`, '', paras(a.body), '');
  }
  out.push('## Policies', '', `Settings > Policies: ${page.policies.join(', ')}. Use Shopify's templates and fill in the store's details; the footer and checkout link to them.`, '');
  out.push('## Theme editor', '', 'After installing the theme with this preset, in Online Store > Themes > Customize:', '');
  page.editor.forEach((e, i) => out.push(`${i + 1}. ${e}`));
  out.push('');
  return out.join('\n');
}

function imagesMd(preset, catalog) {
  const out = [`# ${PRESET_NAME[preset]} demo store: images`, ''];
  out.push('Licensed images only: Shopify Burst (free under its license) or photography the owner commissioned. No other brand\'s products, logos or packaging in frame, and no people who haven\'t signed a model release. Record every image in the credits table before the store goes to review.', '');
  out.push('Sizes: product images square or 4:5, 2048px on the long side; banners 2880 x 1280px or larger; collection images 1200 x 1200px.', '');
  out.push('## Product images', '');
  const rows = [];
  for (const p of catalog.products) {
    p.images.forEach((d, i) => rows.push([`${p.handle}-${i + 1}.jpg`, p.title, i + 1, d, `${p.title}, ${d.charAt(0).toLowerCase()}${d.slice(1)}`]));
  }
  out.push(table(['File', 'Product', 'Position', 'Shot', 'Alt text'], rows), '');
  out.push('## Home page, collections, pages and journal', '');
  out.push(table(['File', 'Shot', 'Used in'], SCENES[preset].map(([f, d, u]) => [`${f}.jpg`, d, u])), '');
  out.push('## Credits', '', 'Fill in one row per file above.', '');
  out.push(table(['File', 'Source (Burst / owned)', 'Photographer', 'License or release', 'Permission on file'], [['', '', '', '', '']]), '');
  return out.join('\n');
}

function readme(preset, catalog, page) {
  const name = PRESET_NAME[preset];
  const out = [`# ${name} demo store`, ''];
  out.push(`Demo content for the ${name} preset (primary industry: ${catalog.industry}). Generated by \`scripts/build-demo-content.mjs\`; change \`scripts/src/demo-catalog.mjs\` or \`scripts/src/demo-pages.mjs\` and run it again.`, '');
  out.push('Every step below needs the owner\'s Shopify accounts, so each one is listed under "Owner actions" in `docs/progress.md`. Nothing here touches the ibBan store.', '');
  out.push('## Setup order', '');
  const steps = [
    `**Create the store** "${catalog.store}" from the Partner Dashboard (or on a plan that includes B2B, if wholesale mode should show). Store currency EUR.`,
    '**Password:** Online Store > Preferences > Password protection on, with the same password on all three demo stores.',
    '**Payments:** Bogus Gateway (or Shopify Payments in test mode) only; turn every other payment method and express checkout off.',
    '**Shipping and pickup:** one shipping zone for Spain and one for the rest of Europe; enable local pickup at the store\'s location so the product page shows pickup availability.',
    '**Metafield definitions:** create the ones in `metafields.md`.',
    `**Products:** import \`products.csv\` (Products > Import), then do the admin steps in \`products.md\` (category, ${catalog.unitNote ? 'unit prices, ' : ''}images${preset === 'tress' ? ', hair type' : preset === 'balm' ? ', skin type' : ''}).`,
    '**Collections and menus:** `collections.md`.',
    '**Filters:** in the Shopify Search & Discovery app, add filters for availability, price, product type and tag' + (preset === 'tress' ? ', plus Hair type' : preset === 'balm' ? ', plus Skin type' : ', plus Color and Size') + '. The app is Shopify\'s own; confirm with Shopify that it is allowed on a demo store (owner review).',
    '**Pages, blog, policies:** `pages.md`.',
    `**Theme:** upload the Theme Store zip (\`dist/weft-themestore.zip\` from CI) to the demo store, choose the ${name} style, then follow "Theme editor" in \`pages.md\`.`,
    '**B2B:** `b2b-setup.md` (company, test contact, catalog, wholesale-only products).',
    '**Check:** browse as a guest and as the test contact; every home page section has content, no placeholder images remain, and checkout reaches the Bogus Gateway.',
    '**Screenshots:** follow the shot list in `docs/theme-store-listing.md`.'
  ];
  steps.forEach((s, i) => out.push(`${i + 1}. ${s}`));
  out.push('', '## Files', '');
  out.push(table(['File', 'What it holds'], [
    ['`products.csv`', 'Shopify product CSV: products, variants, prices, stock, weights, SKUs, tags and the text metafields'],
    ['`products.md`', 'Catalog overview and the settings the CSV can\'t carry'],
    ['`metafields.md`', 'Metafield definitions and where the theme uses each one'],
    ['`collections.md`', 'Smart collections and menus'],
    ['`b2b-setup.md`', 'Company, test contact, catalog, price list, quantity rules, volume pricing, wholesale-only products'],
    ['`pages.md`', 'Pages, blog articles, policies, finder answers and theme editor steps'],
    ['`images.md`', 'Shot list with alt text, and the credits table']
  ]), '');
  return out.join('\n');
}

const indexMd = () => {
  const out = ['# Demo content', '', 'One folder per preset, each a complete recipe for its Theme Store demo store (BUILD_SPEC §8.4, VERTICALS §5). Generated by `node scripts/build-demo-content.mjs` from `scripts/src/demo-catalog.mjs` and `scripts/src/demo-pages.mjs`; `--check` fails when a file is out of date.', ''];
  out.push(table(['Preset', 'Folder', 'Products', 'Primary industry'], Object.entries(catalogs).map(([k, c]) => [PRESET_NAME[k], `[\`${k}/\`](${k}/README.md)`, c.products.length + (c.giftCard ? ' + gift card' : ''), c.industry])), '');
  out.push('Content rules: authentic copy, never lorem ipsum, no other brand\'s names or images, licensed images only (Burst or owned photography, credited in each `images.md`).', '');
  return out.join('\n');
};

// Build
const problems = [];
const files = new Map([['README.md', indexMd()]]);
for (const [preset, catalog] of Object.entries(catalogs)) {
  problems.push(...catalogProblems(preset, catalog));
  const page = content[preset];
  files.set(`${preset}/README.md`, readme(preset, catalog, page));
  files.set(`${preset}/products.csv`, productsCsv(preset, catalog));
  files.set(`${preset}/products.md`, productsMd(preset, catalog));
  files.set(`${preset}/metafields.md`, metafieldsMd(preset, catalog));
  files.set(`${preset}/collections.md`, collectionsMd(preset, catalog, page));
  files.set(`${preset}/b2b-setup.md`, b2bMd(preset, catalog));
  files.set(`${preset}/pages.md`, pagesMd(preset, page));
  files.set(`${preset}/images.md`, imagesMd(preset, catalog));
}

for (const [rel, body] of files) {
  const file = join(OUT, rel);
  if (check) {
    if (!existsSync(file) || readFileSync(file, 'utf8') !== body) problems.push(`demo-content/${rel} is out of date (run node scripts/build-demo-content.mjs)`);
  } else {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, body);
  }
}

for (const p of problems) console.log(`WARNING ${p}`);
console.log(`build-demo-content: ${files.size} files${check ? ' checked' : ' written'}, ${problems.length} problems`);
process.exit(problems.length ? 1 : 0);
