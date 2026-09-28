# Balm demo store: pages, blog and editor

## Pages

Online Store > Pages. Pick the template named in each row. Templates built from sections (about, FAQ, lookbook) take their copy in the theme editor: the text below goes into the sections named.

### About

Handle `about`, template `page.about`.

We make body care in small batches: butters whipped by the kilo, scrubs mixed by hand and oils blended to order. Nothing sits in a warehouse for months.

Each jar lists its full ingredients, its scent notes and how long it keeps once open, so you can choose with your nose and your skin in mind.

_Copy goes into the Story section (media with text)._

### FAQ

Handle `faq`, template `page.faq`.

Put these into the FAQ section's question blocks:

- **How long do the products keep?** Each product page shows the period after opening, usually 6 or 12 months. Unopened jars keep for two years stored away from heat.
- **Are the products suitable for sensitive skin?** Look for the Sensitive skin type on the product page. The unscented body butter is the gentlest choice.
- **Can I add a gift message?** Yes. The gift sets have a message field on the product page; we print it on a card inside the box.
- **Is the packaging recyclable?** The jars are glass with aluminum lids, and the refill pouch uses a quarter of the plastic of a new bottle.
- **Do you sell to shops and spas?** Yes. Apply on the For shops page to see trade prices, testers and case sizes.

### Contact

Handle `contact`, template `page.contact`.

Ask us anything about ingredients, orders or trade accounts. We reply within one working day.

### Find your routine

Handle `find-your-routine`, template `page.finder`.

Two questions for a routine that suits your skin.

### For shops

Handle `wholesale`, template `page.wholesale-access`.

Trade prices, counter testers and case sizes for shops and spas. Sign in with your trade account, or apply for one.

### Apply for a trade account

Handle `wholesale-request`, template `page.wholesale-request`.

Tell us about your shop or spa. We reply within two working days.

### Quick order

Handle `quick-order`, template `page.quick-order`.

Restock the shelves in one order.

## Finder answers

The home page finder in the Balm preset already asks these; set the same on the "Find your routine" page (template `page.finder`):

| Question | Filter parameter | Answers |
|---|---|---|
| How does your skin feel today? | `filter.p.m.shopify.skin-type` | Dry, Sensitive, Normal, Oily |
| Which scent do you like? | `filter.p.tag` | Warm, Fresh, Floral, Unscented |

The tag answers match product tags in `products.csv`, so they filter as they are. Hair and skin type filters use metaobject values, not the labels: after adding the filter in the Shopify Search & Discovery app, open the collection, choose each type in the filter, copy the value after `filter.p.m.shopify.hair-type=` (or `skin-type=`) from the address bar, and enter the answer as `Curly = <value>`. Every answer then leads to a filled collection page.

## Blog "Journal"

Handle `news`.

### The three-step body ritual

Tags: Ritual. Excerpt: Scrub, butter, oil: what each step does and when to skip one.

Scrub twice a week on damp skin to lift dry flakes, then rinse. Straight after the shower, while the skin is still warm, press in the body butter where skin feels tight.

Finish with a few drops of dry oil on the arms and legs for a soft sheen. On busy mornings, the oil alone is enough.

### Reading a scent: top, heart and base notes

Tags: Scent. Excerpt: Why a scent changes on your skin over an hour.

Top notes are what you smell first, usually bright citrus or spice that fade within minutes. Heart notes, often floral, carry the scent for the next hour.

Base notes such as vanilla, sandalwood and cedarwood last longest and stay close to the skin.

## Policies

Settings > Policies: Refund policy, Privacy policy, Terms of service, Shipping policy, Contact information. Use Shopify's templates and fill in the store's details; the footer and checkout link to them.

## Theme editor

After installing the theme with this preset, in Online Store > Themes > Customize:

1. Home page > Featured collection (first): "Butters and lotions"; second: "Gift sets". Collection list: Butters and lotions, Scrubs, Oils, Hand care, Gift sets, Under €25.
2. Page "Find your routine" (template page.finder): set the finder questions as listed under "Finder answers" below; the answers match the skin types and the tags in products.csv.
3. Product page > Scent notes: top custom.scent_top, heart custom.scent_heart, base custom.scent_base. Ingredients > full list: custom.inci. Period after opening: custom.pao_months. Warnings row: custom.warnings.
4. Ritual gift set: product template with the Gift message custom option (Custom option block, Gift message preset).
5. Home page > Gift guide tabs: Under €25 → collection "Under €25", €25 to €50 → "€25 to €50", Over €50 → "Over €50".
6. Product page: replace the Description block with a Product tabs block (Description on; first custom tab "Delivery and returns" with the delivery text from the FAQ), so the product tabs show on the demo store.
7. Theme settings > Product cards: show subtitle on (custom.subtitle).
