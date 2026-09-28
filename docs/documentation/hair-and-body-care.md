# Hair care and body care

This page explains the blocks and sections built for hair care and body care products, and how to set up unit prices, subscriptions, gift messages and bundles.

These features are part of every style. The Tress and Balm styles use them on their home page and default product page, and the **product.hair-care** and **product.body-care** templates include them in every style. See [Product pages](product-pages.md#alternate-product-templates).

## Product blocks

Add these blocks to the Product section in the theme editor. Most text settings accept dynamic sources, so you can connect product metafields and show different content for each product. Attribute chips, Scent notes and Period after opening are hidden when they have no value, and the full ingredient list is hidden when it's empty.

| Block | What it shows | How to set it up |
|---|---|---|
| Highlights | Short points with an icon, such as key benefits, or fabric and fit. | Add a **Highlight** block per point. Pick an icon or upload a custom icon. Choose a list or two columns. |
| Attribute chips | Chips for hair type, skin type, concern, fit or occasion. | Enter a **Label**, then either type **Values** separated by commas or enter a metafield key in **Or read a product metafield**, for example `shopify.hair-type`. See [Attribute chips from category metafields](#attribute-chips-from-category-metafields). |
| Ingredients | Key ingredients with a short explanation each, then the full ingredient list (INCI) in a collapsible row. | Add an **Ingredient** block per key ingredient (name, optional image, explanation). Connect **Full list** to a metafield that holds the full INCI list. Rename **Full list label** if needed. |
| How to use | Numbered steps, with an optional video. | Add a **Step** block per step (heading, text, optional image). Add an uploaded video or a YouTube or Vimeo URL, and a cover image. The video loads only when played. |
| Badges | Short badges such as vegan or cruelty-free. | Add a **Badge** block per badge, with text and an icon, or an image for a certification logo. Choose outline or filled. |
| Scent notes | Top, heart and base notes in three columns. | Enter notes separated by commas, or connect text metafields. |
| Period after opening | The open-jar symbol with the number of months, for example 12M, and the text "Use within 12 months of opening". | Enter the number of months, or connect a number metafield. |
| Collapsible row (Warnings preset) | Warnings and precautions in an accordion row. | Add the block with the **Warnings** preset and connect its text to a metafield. |
| Product guide | A hair type guide, shade guide or usage chart in a pop-up. | See [Product guide](product-pages.md#product-guide-and-size-chart). |
| Complementary products | Products that complete a routine or ritual. | Pick complementary products in the Shopify Search & Discovery app. Turn on **Number the products as steps** to label them Step 1, Step 2 and so on. |

Badges, results and claims such as "dermatologically tested" are text you enter. The theme doesn't add claims of its own, so only add claims you can support.

### Attribute chips from category metafields

Shopify's product categories come with category metafields such as hair type and skin type.

1. In your Shopify admin, choose a product category for the product, for example a hair care category.
2. Fill in the category metafield, such as hair type, in the product's category metafields.
3. In the theme editor, add an **Attribute chips** block and enter the key in **Or read a product metafield**, for example `shopify.hair-type` or `shopify.skin-type`.

The block reads list metafields and category metafields, and shows each value as a chip. Check the exact key in **Settings > Custom data** in your Shopify admin.

### Shade and scent swatches

Shade and scent options can show as swatches, like colors. Add the option name, for example Shade or Scent, to **Theme settings > Swatches > Color option names**. Then set swatches on the option values in Shopify, or list colors in **Theme settings > Swatches > Fallback colors**. See [Variant picker and swatches](product-pages.md#variant-picker-and-swatches).

## Sections

| Section | What it's for |
|---|---|
| Guided finder | A few questions whose answers open a filtered collection, for example hair type and concern. See [Set up the guided finder](#set-up-the-guided-finder). |
| Before and after | Two images with a slider that reveals one over the other. It works with a mouse, touch and the keyboard (arrow keys, Home and End). Without JavaScript both images show side by side. |
| Routine steps | Numbered steps such as cleanse, treat and protect, each with an optional product. Up to six steps, in a row or a list. |
| Ingredient spotlight | An image beside up to eight key ingredients with short explanations. |
| Image banner (For professionals preset) | A banner for salon and spa buyers. Link its button to your wholesale sign-in page. |
| Featured collection (Gift guide preset) | Products in tabs, one collection per tab, with a promotion tile. For price bands, use automated collections with a price condition. |

For the Before and after section, use two images of the same size and crop. Use the **Note** setting to explain how the result was achieved. Results are your own claim.

### Set up the guided finder

The finder sends shoppers to a collection with filters applied. It uses your Search & Discovery filters, so set up the filters first. See [Filters](collections-search-cart.md#filters).

1. Add a **Guided finder** section and choose the **Collection to filter**. When empty, the finder uses all products.
2. Open the collection on your storefront, apply the filter you want the question to use, and look at the page URL. It contains the filter parameter and the value, for example `filter.p.tag=curly`.
3. Add a **Question** block. Enter the question, an optional hint, and paste the parameter part, such as `filter.p.tag`, `filter.v.option.size` or `filter.p.m.shopify.hair-type`, into **Filter parameter**.
4. In **Answers**, enter one answer per line. Use the label on its own when it's the same as the filter value, for example `Curly`. When the value in the URL differs from the label, write `Label = filter value`. URLs encode some characters, for example a space shows as `+` or `%20`, so write the value with the plain characters.
5. Add more questions as needed and set the **Button label**.

Shoppers see one question at a time with Back and Next buttons. Without JavaScript, all questions show at once. The finder only builds a filtered collection link; it doesn't score answers.

## Unit prices

Unit prices, such as a price per 100 ml or per 100 g, show under the price on the product page, on product cards and in the cart.

1. In your Shopify admin, open the product variant.
2. Add the unit price details: the total amount in the variant, for example 250 ml, and the base unit, for example 100 ml.
3. Save. The theme shows the unit price that Shopify calculates.

Check Shopify Help for where unit prices are available.

## Subscriptions

Subscriptions use Shopify selling plans, which need a subscription app.

1. Install a subscription app and create a subscription plan for the product.
2. Add the **Purchase options** block to the product page, above the Buy buttons block. The default templates already include it.

Shoppers choose between one-time purchase and each plan. Every plan shows its name and price before adding to cart, and the cart line shows the plan name. When a product can only be bought as a subscription, the one-time option is hidden.

## Gift messages

1. Add a **Custom option** block with the **Gift message** preset. The body care template already includes one.
2. Change the label or character limit if needed.

The message is saved with the cart line and shows in the cart and on the order. See [Custom options](product-pages.md#custom-options).

## Bundles

When you sell bundles made with a bundles app, the cart line lists the products included in the bundle with their quantities and options.

## Wholesale for salons and spas

Hair care and body care stores often sell professional sizes, testers and case packs to salons and spas. Use the wholesale features for this:

- Keep professional-only products, back-bar sizes and testers out of your retail catalogs, and include them in your B2B catalog.
- Use quantity rules for case packs, for example an increment of 6 or 12, and add volume pricing.
- Add a quick order list page so buyers can reorder many products from one table.
- Tag shade or scent products with the Order matrix tag to show a shade by size or scent by size grid.

See [Wholesale](wholesale.md).
