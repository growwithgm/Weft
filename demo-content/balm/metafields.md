# Balm demo store: metafield definitions

Create these in Settings > Custom data > Products before importing `products.csv`, so the import fills them. Category metafields (`shopify.*`) come with the product category and need no definition.

| Name | Namespace and key | Type | In the CSV | Where the theme uses it |
|---|---|---|---|---|
| Skin type | `shopify.skin-type` | list.metaobject_reference (category metafield) | no, set in the admin | Attribute chips (Skin type) and collection filters; set values in the admin from the Skin care category |
| Subtitle | `custom.subtitle` | single_line_text_field | yes | Product card subtitle |
| Top notes | `custom.scent_top` | single_line_text_field | yes | Scent notes > Top (dynamic source) |
| Heart notes | `custom.scent_heart` | single_line_text_field | yes | Scent notes > Heart (dynamic source) |
| Base notes | `custom.scent_base` | single_line_text_field | yes | Scent notes > Base (dynamic source) |
| Full ingredient list (INCI) | `custom.inci` | multi_line_text_field | yes | Ingredients > full list (dynamic source) |
| Warnings | `custom.warnings` | multi_line_text_field | yes | Warnings and precautions row (dynamic source) |
| Period after opening (months) | `custom.pao_months` | number_integer | yes | Period after opening block (dynamic source) |

Dynamic sources: connect each field in the theme editor where the last column says so. The theme reads nothing from a metafield until it is connected, except the theme settings that name a metafield key (product card subtitle, custom label, wholesale pack image), whose defaults already match these keys.
