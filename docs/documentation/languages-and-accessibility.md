# Languages and accessibility

This page lists the languages included with Weft, explains how to change the theme's default text, and describes the accessibility and performance features built into the theme.

## Storefront languages

Weft includes storefront translations for these languages:

| Language | Code |
|---|---|
| English (default) | en |
| Spanish | es |
| German | de |
| French | fr |
| Italian | it |
| Dutch | nl |
| Portuguese (Portugal) | pt-PT |
| Japanese | ja |

Storefront translations cover the text that the theme itself shows, such as button labels, cart messages, stock messages and wholesale notices. To sell in one of these languages:

1. In your Shopify admin, go to **Settings > Languages**.
2. Add and publish the language.
3. Turn on the language selector in the announcement bar, footer or header's mobile menu. See [Country and language selectors](getting-started.md#country-and-language-selectors).

The text you enter yourself, such as product descriptions, section headings and button labels in the theme editor, needs its own translation. Use a translation app for that content.

## Theme editor languages

The theme editor's labels and help text are translated into the same eight languages. Shopify shows them in the language of your Shopify admin when it's one of these.

## Edit default theme content

You can change any storefront text that comes with the theme, for example "Add to cart" or "Your cart is empty".

1. In your Shopify admin, go to **Online Store > Themes**.
2. On the Weft theme, click the **...** button and choose **Edit default theme content**.
3. Choose the language to edit, then search for the text you want to change.
4. Enter your text and save.

Some text is set in the theme editor instead, for example section headings and block labels.

## Accessibility

Weft is built to be usable with a keyboard, a screen reader and other assistive technology.

### Built into the theme

- **Skip link**: a "Skip to content" link is the first thing keyboard users reach.
- **Keyboard access**: menus, mega menus, drawers, pop-ups, tabs, accordions, carousels, the variant picker, steppers, the guided finder, the before and after slider and the order matrix all work with a keyboard. In the order matrix, arrow keys move between cells.
- **Visible focus**: every interactive element shows a focus outline when reached with the keyboard.
- **Drawers and pop-ups**: focus moves into a drawer when it opens and returns to the button that opened it when it closes.
- **Announcements**: screen readers hear updates such as a product added to the cart, a new price after a variant change, filter results, rounding notes and errors in the order matrix, and a location switch.
- **Labeled fields**: every form field has a label, and errors are announced.
- **Status with text**: stock and error colors always come with a text label, so color is never the only signal.
- **Reduced motion**: when a visitor asks their device for reduced motion, reveal animations are off, slideshows don't change on their own, and the scrolling banner stops.
- **Pause controls**: slideshows, testimonials and videos that play on their own have a pause button.
- **Works without JavaScript**: navigation, variant selection, the product form, filters, the cart and the wholesale order forms still work when JavaScript is off.

### What you can do

- Add **alt text** to images in your Shopify admin and in the theme editor. The theme uses it for every image.
- Check text contrast when you change a color scheme. Text should stay easy to read against its background, including text over images. Use the image overlay settings to darken busy images.
- Fill in the descriptions read by screen readers: the **Slideshow description**, **Video description**, the **Pop-up name** and the **Brand name** of each logo in a Logo list.
- Keep autoplay off, or choose a slow speed, for slideshows and testimonials.
- Write button labels that say where they lead, for example "Shop dresses" rather than "Click here".

## Performance

Weft is built to keep pages light:

- **Images** are sized for each screen. Images at the top of the page, such as the first banner or the first product image, load right away; the rest load as shoppers scroll.
- **Videos and 3D models** show a cover image and load the player when played.
- **Scripts** load only when a feature needs them, for example when a drawer opens or a section scrolls into view.
- **Menus and drawers** load their contents when first opened.
- **Fonts**: the theme uses your heading and body fonts only, and navigation reuses one of them.
- **No apps needed for core features**: wholesale ordering, the delivery list, product guides, swatches, quick add, product compare and the chat button are part of the theme.

Apps and custom code can add their own scripts. Use the loading options in **Theme settings > Custom code and tracking** to load your code after the page or after the first interaction.
