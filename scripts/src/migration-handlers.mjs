// Migration steps that a mapping table can't express (scripts/migrate-from-live.mjs). Each
// handler receives the live item and returns Weft items; anything left behind is noted.

const blocksFrom = (pairs) => pairs.filter(Boolean);

export default {
  /** Global: the live head code moves to Custom code, loaded immediately like before. */
  customHead({ value, note }) {
    note({ item: 'setting custom_html_head', action: 'moved', reason: 'Moved unchanged to Theme settings > Custom code and tracking (head, loaded immediately). It styles live-theme class names, so review whether it is still needed.', explained: true });
    return { custom_code_head: value, custom_code_head_mode: 'immediately' };
  },

  /** Global: Weft's navigation uses the body or the heading font (no third font file). */
  navigationFont({ value, live, note }) {
    if (value === live.heading_font) return { navigation_font_source: 'heading' };
    if (value === (live.body_font || 'jost_n4')) return { navigation_font_source: 'body' };
    note({ item: 'setting navigation_font', action: 'changed', reason: `The live navigation font (${value}) is neither the heading nor the body font; Weft uses the body font so pages load two font families at most.`, explained: true });
    return { navigation_font_source: 'body' };
  },

  /** Image banner button block: up to two buttons become one Weft button block each. */
  bannerButtons({ id, block, note }) {
    const s = block.settings || {};
    const style = (v) => (String(v || '').includes('secondary') ? 'secondary' : 'primary');
    const out = [];
    for (const n of [1, 2]) {
      const label = s[`button_${n}_label`];
      if (!label) continue;
      out.push({ id: n === 1 ? id : `${id}-2`, block: { type: 'button', disabled: block.disabled, settings: { label, link: s[`button_${n}_link`] || '', style: style(s[`button_${n}_style`]) } } });
    }
    if (!out.length) note({ item: 'block', action: 'dropped', reason: 'Button block with no labels.', explained: true });
    else if (out.length === 2) note({ item: 'block', action: 'changed', reason: 'The two buttons of the live block became two Weft button blocks.', explained: true });
    return out;
  },

  /** Variant picker: the live size chart settings become a product-guide block after the picker. */
  variantPicker({ id, block, note }) {
    const s = block.settings || {};
    const out = [{ id, block: { ...block, type: 'variant-picker' } }];
    if (s.enable_size_chart && s.size_chart_page) {
      out.push({ id: `${id}-guide`, block: { type: 'product-guide', disabled: block.disabled, settings: { page: s.size_chart_page, link_position: 'picker' } } });
      note({ item: 'size chart', action: 'changed', reason: 'The size chart page moved to a product-guide block linked from the picker.', explained: true });
    } else if (s.enable_size_chart) {
      note({ item: 'size chart', action: 'changed', reason: 'Size chart was on without a page in the live block; Weft shows the guide link once a product-guide block has content.', explained: true });
    }
    return out;
  },

  /** Slide: content settings of a live slide become nested theme blocks inside the Weft slide. */
  slide({ id, block, note }) {
    const s = block.settings || {};
    const style = (v) => (String(v || '').includes('secondary') ? 'secondary' : 'primary');
    const nested = {};
    const order = [];
    const add = (key, b) => {
      nested[key] = b;
      order.push(key);
    };
    if (s.subheading) add('subheading', { type: 'text', settings: { text: s.subheading, style: 'subheading' } });
    if (s.heading) add('heading', { type: 'heading', settings: { heading: s.heading, heading_size: s.heading_size, heading_h1: s.heading_h1 } });
    if (s.text) add('text', { type: 'text', settings: { text: s.text, enlarge_text: s.enlarge_text } });
    for (const n of [1, 2]) if (s[`button_${n}_label`]) add(`button_${n}`, { type: 'button', settings: { label: s[`button_${n}_label`], link: s[`button_${n}_link`] || '', style: style(s[`button_${n}_style`]) } });
    if (s.countdown_show && s.countdown_end_date) add('countdown', { type: 'product-countdown', settings: { end_date: s.countdown_end_date, end_time: s.countdown_end_time, end_text: s.countdown_end_text, hide_on_end: s.countdown_hide_on_end } });
    note({ item: 'slide', action: 'changed', reason: 'Slide text, buttons and countdown became blocks inside the Weft slide; per-slide colours (bg_color, text colour) follow the slideshow section.', explained: true });
    return [{ id, block: { type: '_slide', disabled: block.disabled, settings: { image_desktop: s.image_desktop, image_mobile: s.image_mobile, link: s.url, overlay_position: s.overlay_position, text_align: s.overlay_text_align, mobile_center: s.mob_center_text }, blocks: nested, block_order: order } }];
  },

  /**
   * Section of AI-generated theme blocks: the live B2B login card becomes Weft's wholesale-access
   * section (brief §4.9); its 34 style settings collapse into the colour scheme.
   */
  aiBlocksSection({ id, section, migrate, schemas, note }) {
    const block = Object.values(section.blocks || {})[0];
    const s = (block && block.settings) || {};
    if (!block || !('button_text' in s)) {
      note({ item: 'section', action: 'dropped', reason: 'AI-generated blocks section that isn\'t the B2B login card.', explained: false });
      return null;
    }
    const page = String(s.request_link || '').startsWith('shopify://pages/') ? s.request_link.replace('shopify://pages/', '') : '';
    note({ item: 'section', action: 'changed', reason: 'AI-generated B2B login card → wholesale-access section: heading, text and labels kept; sign-in uses Shopify\'s customer account link instead of the store-specific redirect URL; style settings collapse into the colour scheme.', explained: true });
    const out = { type: 'wholesale-access', settings: migrate.settings({ heading: s.heading, text: s.subheading, sign_in_label: s.button_text, apply_label: s.request_text, apply_page: page || undefined }, schemas.sections['wholesale-access'].settings, {}, `section "${id}" → wholesale-access`, 'templates/page.b2b-login.json') };
    if (section.disabled) out.disabled = true;
    return out;
  },

  /**
   * Product page Custom Liquid that only rendered a live snippet becomes the Weft block that does
   * the same job; other Custom Liquid stays as it is.
   */
  productLiquid({ id, block, note }) {
    const code = String((block.settings || {}).custom_liquid || '');
    const renders = [...code.matchAll(/render\s+'([^']+)'/g)].map((m) => m[1]);
    if (!renders.length) return [{ id, block: { ...block, type: 'custom-liquid' } }];
    const retailOnly = /customer\.b2b\?/.test(code);
    const audience = retailOnly ? 'retail' : 'all';
    const produced = [];
    for (const snippet of renders) {
      switch (snippet) {
        case 'gn-rating':
          produced.push({ id, block: { type: 'product-rating', disabled: block.disabled, settings: { rating_value: '{{ shop.metafields.judgeme.all_reviews_rating.value }}', rating_count: '{{ shop.metafields.judgeme.all_reviews_count.value }}', count_label: 'store', audience } } });
          note({ item: 'custom liquid', action: 'changed', reason: 'gn-rating → product-rating block reading the Judge.me store rating and count (dynamic sources), retail only as before.', explained: true });
          break;
        case 'back-in-stock':
          produced.push({ id, block: { type: 'back-in-stock', disabled: block.disabled, settings: { audience } } });
          note({ item: 'custom liquid', action: 'changed', reason: 'Wasify back-in-stock snippet → back-in-stock block; the service URL is Theme settings > Integrations.', explained: true });
          break;
        case 'gn-shipping-bar':
          produced.push({ id: `${id}-delivery`, block: { type: 'delivery-list', disabled: block.disabled, settings: { audience: 'retail', fit_text: '{{ product.metafields.custom.fit_guide.value }}' } } });
          note({ item: 'custom liquid', action: 'changed', reason: 'gn-shipping-bar → delivery-list block (fit row from the custom.fit_guide metafield as before; the live second fit line, custom.best_suited_for, can go in the product guide); country rules are Theme settings > Delivery information (store values).', explained: true });
          break;
        case 'gn-see-more':
          note({ item: 'custom liquid', action: 'changed', reason: 'gn-see-more → the description block\'s "shorten long text" option (clamp), set on the migrated description.', explained: true });
          break;
        case 'size-guide-warning':
          note({ item: 'custom liquid', action: 'dropped', reason: 'Size guide warning snippet is removed on purpose (brief §4.9).', explained: true });
          break;
        default:
          note({ item: 'custom liquid', action: 'dropped', reason: `Renders the live snippet "${snippet}", which Weft doesn't have.`, explained: false });
      }
    }
    return blocksFrom(produced);
  }
};
