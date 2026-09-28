# Weft demo store: metafield definitions

Create these in Settings > Custom data > Products before importing `products.csv`, so the import fills them. Category metafields (`shopify.*`) come with the product category and need no definition.

| Name | Namespace and key | Type | In the CSV | Where the theme uses it |
|---|---|---|---|---|
| Subtitle | `custom.subtitle` | single_line_text_field | yes | Product card subtitle (Theme settings > Product cards) |
| Fit guide | `custom.fit_guide` | single_line_text_field | yes | Delivery list > Fit row (dynamic source) |
| Best suited for | `custom.best_suited_for` | single_line_text_field | yes | Product guide > second row (dynamic source) |
| Embroidery | `custom.embroidery` | single_line_text_field | yes | Specifications row (dynamic source) |
| Material | `custom.material` | single_line_text_field | yes | Specifications row and Ingredients > full list for clothing |
| Care | `custom.care` | multi_line_text_field | yes | How to use block (care steps) |
| Label | `custom.label` | single_line_text_field | yes | Custom product label (Theme settings > Product labels) |
| Size chart | `custom.size_chart` | file_reference | no, set in the admin | Product guide > image (dynamic source) |
| Pack image | `custom.pack_image` | file_reference | no, set in the admin | Wholesale pack image on cart lines (Theme settings > Wholesale) |

Dynamic sources: connect each field in the theme editor where the last column says so. The theme reads nothing from a metafield until it is connected, except the theme settings that name a metafield key (product card subtitle, custom label, wholesale pack image), whose defaults already match these keys.
