# Weft demo store: collections and menus

Create every collection as an automated (smart) collection with the conditions below, so new products join on their own. Add the collection images from `images.md`.

| Collection | Handle | Conditions | Description |
|---|---|---|---|
| New in | `new-in` | Tag is equal to new | The latest pieces from the studio. |
| Dresses and skirts | `dresses-skirts` | Type is equal to Dress, or Type is equal to Kaftan, or Type is equal to Skirt | Long, easy shapes with hand embroidery. |
| Tops and tunics | `tops-tunics` | Type is equal to Tunic, or Type is equal to Shirt | Tunics and shirts to wear loose or belted. |
| Outerwear | `outerwear` | Type is equal to Jacket | Light layers for cool evenings. |
| Accessories | `accessories` | Type is equal to Bag, or Type is equal to Scarf, or Type is equal to Hat | Totes, scarves and hats to finish the look. |
| Sale | `sale` | Compare-at price is not empty | Pieces at their last price of the season. |

## Menus

Online Store > Navigation.

**Main menu** (`main-menu`)

| Label | Link |
|---|---|
| New in | `/collections/new-in` |
| Dresses and skirts | `/collections/dresses-skirts` |
| Tops and tunics | `/collections/tops-tunics` |
| Outerwear | `/collections/outerwear` |
| Accessories | `/collections/accessories` |
| Sale | `/collections/sale` |
| Wholesale | `/pages/wholesale` |

**Footer menu** (`footer`)

| Label | Link |
|---|---|
| About | `/pages/about` |
| FAQ | `/pages/faq` |
| Contact | `/pages/contact` |
| Lookbook | `/pages/lookbook` |
| Delivery | `/pages/shipping-calculator` |
| Journal | `/blogs/news` |
