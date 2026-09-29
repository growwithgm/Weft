# Tress demo store: metafield definitions

Create these in Settings > Custom data > Products before importing `products.csv`, so the import fills them. Category metafields (`shopify.*`) come with the product category and need no definition.

| Name | Namespace and key | Type | In the CSV | Where the theme uses it |
|---|---|---|---|---|
| Hair type | `shopify.hair-type` | list.metaobject_reference (category metafield) | no, set in the admin | Attribute chips (Hair type) and collection filters; set values in the admin from the Hair care category |
| Subtitle | `custom.subtitle` | single_line_text_field | yes | Product card subtitle |
| Concern | `custom.concern` | list.single_line_text_field | yes | Attribute chips (Concern) and a collection filter |
| Full ingredient list (INCI) | `custom.inci` | multi_line_text_field | yes | Ingredients > full list (dynamic source) |
| How to use | `custom.how_to_use` | multi_line_text_field | yes | How to use steps |
| Label | `custom.label` | single_line_text_field | yes | Custom label, for example "Professional" |

Dynamic sources: connect each field in the theme editor where the last column says so. The theme reads nothing from a metafield until it is connected, except the theme settings that name a metafield key (product card subtitle, custom label, wholesale pack image), whose defaults already match these keys.
