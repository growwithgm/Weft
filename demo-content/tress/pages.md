# Tress demo store: pages, blog and editor

## Pages

Online Store > Pages. Pick the template named in each row. Templates built from sections (about, FAQ, lookbook) take their copy in the theme editor: the text below goes into the sections named.

### About

Handle `about`, template `page.about`.

We started in a salon back room, mixing treatments for clients whose hair had been through too much bleach and heat. The formulas that worked became the range.

Every product is sold in a home size and a salon size, and every label lists the full ingredient list, because stylists and their clients deserve to know what goes on their hair.

_Copy goes into the Story section (media with text)._

### FAQ

Handle `faq`, template `page.faq`.

Put these into the FAQ section's question blocks:

- **Which products suit my hair type?** Each product page lists the hair types it is made for. The routine finder asks two questions and shows the products that match.
- **Are the products sulfate-free?** The shampoos use mild, sulfate-free cleansers. Each product page has the full ingredient list.
- **How does the subscription work?** Choose a delivery every 4, 6 or 8 weeks and save 10%. Skip or cancel any time from your account.
- **Can I use the masks on color-treated hair?** Yes. The bond repair mask was made for hair lightened or colored in the salon.
- **Do you supply salons?** Yes. Salons order back-bar sizes and color at trade prices. Apply on the For salons page.

### Contact

Handle `contact`, template `page.contact`.

Questions about a product or a salon account? Our team answers within one working day.

### Find your routine

Handle `find-your-routine`, template `page.finder`.

Two questions, one routine.

### For salons

Handle `wholesale`, template `page.wholesale-access`.

Back-bar sizes, professional color and trade prices for salons. Sign in with your salon account, or apply for one.

### Apply for a salon account

Handle `wholesale-request`, template `page.wholesale-request`.

Tell us about your salon and the number of chairs. We reply within two working days.

### Quick order

Handle `quick-order`, template `page.quick-order`.

Restock the back bar in one go.

## Finder answers

The home page finder in the Tress preset already asks these; set the same on the "Find your routine" page (template `page.finder`):

| Question | Filter parameter | Answers |
|---|---|---|
| What is your hair type? | `filter.p.m.shopify.hair-type` | Straight, Wavy, Curly, Coily |
| What would you like to fix? | `filter.p.tag` | Damage, Frizz, Volume, Color care |

The tag answers match product tags in `products.csv`, and the type answers match the category metafield values in `products.md`, so every answer leads to a filled collection page. The filters need the matching collection filters in the Shopify Search & Discovery app (see README).

## Blog "Journal"

Handle `news`.

### Why bonds break, and how to repair them

Tags: Repair. Excerpt: What bleach and heat do inside the hair, in plain words.

Hair gets its strength from bonds between the keratin chains inside each strand. Lightening and high heat break some of those bonds, which is why bleached hair stretches and snaps.

Bond repair treatments link the broken ends back together. Used once a week, they make hair feel stronger and help it hold color for longer.

### A wash-day routine for curls

Tags: Curly. Excerpt: Four steps from shampoo to scrunch.

Start with a gentle shampoo on the scalp only, and let the lather rinse through the lengths. Condition generously and detangle with a wide-tooth comb while the conditioner is in.

On soaking wet hair, rake the curl cream through section by section, scrunch upwards and leave it to dry. Once it is fully dry, scrunch out the cast.

## Policies

Settings > Policies: Refund policy, Privacy policy, Terms of service, Shipping policy, Contact information. Use Shopify's templates and fill in the store's details; the footer and checkout link to them.

## Theme editor

After installing the theme with this preset, in Online Store > Themes > Customize:

1. Home page > Featured collection: collection "Repair routine". Collection list: Shampoo, Conditioner, Masks and treatments, Styling, Color, Tools.
2. Page "Find your routine" (template page.finder): set the finder questions as listed under "Finder answers" below; the answers match the hair types and the tags in products.csv.
3. Product page > Ingredients > full list: connect custom.inci. How to use: custom.how_to_use. Attribute chips: Hair type (shopify.hair-type) and Concern (custom.concern).
4. Theme settings > Product labels > Custom label: custom.label ("Professional").
5. Theme settings > Product cards: show subtitle on (custom.subtitle).
