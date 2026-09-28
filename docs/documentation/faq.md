# FAQ

Short answers to questions merchants often ask about Weft.

## Why don't wholesale prices show in the theme editor?

The theme editor doesn't sign you in as a B2B customer, so it shows retail prices. Wholesale blocks show sample content with a "Wholesale preview — sample data" badge so you can style them. To see real wholesale prices, quantity rules and volume pricing, sign in on your storefront as a contact of a company location. See [Checking wholesale in the theme editor](wholesale.md#checking-wholesale-in-the-theme-editor).

## How do I hide a product from retail shoppers?

Leave the product out of the catalogs your retail markets use and include it in your B2B catalog. Retail visitors who follow its link see the 404 page, which offers a wholesale sign-in link. If the product has to stay in a retail catalog, add the tag `b2b` (or the tag set in **Theme settings > Wholesale > Wholesale-only tag**). See [Wholesale-only products](wholesale.md#wholesale-only-products).

## How do I add a size chart?

Add a **Product guide** block to the product page and add an image, a text or table, or a page. To show a different chart per product, connect the image to a product image metafield. The link shows next to the Size option by default. See [Product guide and size chart](product-pages.md#product-guide-and-size-chart).

## Why doesn't the order matrix show?

The order matrix shows only to signed-in wholesale buyers, and only on products that have the Order matrix tag (default `row`) and at least one option. Check the product's tags, or change the tag in **Theme settings > Wholesale > Order matrix tag**. Products without the tag show the wholesale quantity box instead.

## How do I show unit prices?

Add unit price details to the product variant in your Shopify admin, for example 250 ml with a base unit of 100 ml. The theme then shows the unit price under the price on the product page, on product cards and in the cart. See [Unit prices](hair-and-body-care.md#unit-prices).

## Why doesn't a filter appear on my collection page?

Check that:

- the Shopify Search & Discovery app is installed and the filter is added in the app
- **Enable filtering** is on in the Collection products section (or the Search results section for search)
- at least one product in the collection has a value for that filter

See [Filters](collections-search-cart.md#filters).

## Why is checkout disabled in a wholesale cart?

At least one line breaks a quantity rule: it's below the minimum, above the maximum, or not a multiple of the pack size. The line shows a message. When the buyer fixes every line, checkout turns back on. Shopify checks the cart again at checkout.

## How do I show a block to retail shoppers or wholesale buyers only?

Blocks such as Rating, Stock, Delivery list, Back in stock, Buy buttons, Specifications and Collapsible row have a **Show to** setting: Everyone, Retail shoppers or Wholesale buyers. The wholesale blocks show to wholesale buyers only.

## Why doesn't the shipping row show in the delivery list?

The shipping row uses the rules in **Theme settings > Delivery information**. It shows only when the shopper's country is in your **Shipping rules**, or when **Rule for other countries** has a rate. Also check that **Show shipping row** is on in the Delivery list block.

## How do back in stock requests reach me?

The back in stock form sends a message through Shopify's contact form, so it arrives at your store's contact email. It names the product and the options the shopper chose. Let those shoppers know when the product is back.

## How do I sell subscriptions?

Install a subscription app and create a plan for the product. The **Purchase options** block, included on every product template, then shows one-time purchase and each plan with its name and price. See [Subscriptions](hair-and-body-care.md#subscriptions).

## Why don't complementary products show?

The Complementary products block shows products that you pick as complementary for each product in the Shopify Search & Discovery app. It stays empty until you set them.
