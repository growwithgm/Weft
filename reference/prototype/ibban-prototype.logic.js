
const P = {
  row: { title: 'Leila hand-embroidered long tunic', cat: 'Long tunics', colours: ['Ecru', 'Indigo', 'Black', 'Sage'], sizes: ['S/M', 'L/XL', 'XXL'],
    stock: { Ecru: [42, 18, 6], Indigo: [9, 0, 23], Black: [null, null, null], Sage: [14, 3, 'x'] },
    retail: { EUR: [79.95, 99.95], GBP: [69.95, 85.95], USD: [89.95, 109.95] }, ws: 31.5, rule: { min: 4, inc: 2, max: 60 }, tiers: [[24, 29.9], [48, 28.5]],
    fabric: 'Cotton voile', emb: 'Hand-embroidered neckline and cuffs', fit: 'Model is 170 cm, wearing S/M', fitEs: 'La modelo mide 170 cm y lleva S/M' },
  onesize: { title: 'Zahra embroidered kaftan', cat: 'Kaftans', colours: ['Coral', 'Turquoise', 'White', 'Navy'], sizes: ['One Size'],
    stock: { Coral: [60], Turquoise: [12], White: [0], Navy: [30] },
    retail: { EUR: [89.95, null], GBP: [77.95, null], USD: [99.95, null] }, ws: 34, rule: { min: 6, inc: 6, max: null }, tiers: [[36, 32], [72, 30.5]],
    fabric: 'Viscose crepe', emb: 'Hand-embroidered yoke', fit: null },
  bag: { title: 'Nour embroidered tote', cat: 'Bags', colours: ['Natural', 'Black'], sizes: null,
    stock: { Natural: [25], Black: [7] },
    retail: { EUR: [59.95, null], GBP: [51.95, null], USD: [64.95, null] }, ws: 22, rule: { min: 3, inc: 3, max: null }, tiers: [],
    fabric: 'Cotton canvas', emb: 'Hand-embroidered front panel', fit: null }
};
const CUR = { ES: { sym: '€', code: 'EUR', f: 1, name: 'Spain', nameEs: 'España' }, DE: { sym: '€', code: 'EUR', f: 1, name: 'Germany' }, UK: { sym: '£', code: 'GBP', f: 0.86, name: 'United Kingdom' }, US: { sym: '$', code: 'USD', f: 1.12, name: 'United States' } };
const SHIP = { ES: [4.95, 69], DE: [4.95, 99], UK: [4.95, 99], US: [4.95, 99] };
const SW = { Ecru: '#E6DCC6', Indigo: '#3B4877', Black: '#262626', Sage: '#A3AE8C', Coral: '#E98970', Turquoise: '#3AA9A3', White: '#FBFAF6', Navy: '#25314E', Natural: '#D6C4A0' };
const LOCS = ['Madrid Serrano', 'Valencia Ruzafa'];
const ANN = ['Hand-embroidered by our artisans · Handmade since 1982', 'Order by 4pm Madrid for same-day dispatch, Mon–Fri'];
const SPH = ['Search long dresses, kaftans…', 'Search tunics, jackets, coats…', 'Search bikinis, bags & more…'];
const DESC = 'A long tunic in airy cotton voile, with embroidery worked by hand around the neckline and cuffs by our artisans. Cut straight and loose through the body with side slits for easy movement, it layers over swimwear on the beach and over trousers in town. Each piece takes several days to embroider, so small variations in the stitching are part of its character.';
const REVIEWS = [
  { name: 'Carmen R. · Madrid', stars: 5, piece: true, photo: false, text: 'The embroidery is even more beautiful in person. Light enough for August and it washed perfectly.' },
  { name: 'Sophie L. · Amsterdam', stars: 5, product: 'Zahra embroidered kaftan', photo: true, text: 'Arrived in two days. The colours are exactly as pictured and the fit is generous.' },
  { name: 'Anna K. · Berlin', stars: 4, product: 'Nour embroidered tote', photo: false, text: 'Sturdy and well made. I use it every day for work; the handles could be a little longer.' }
];
const EXTRA = [
  { title: 'Amira embroidered long dress', retail: { EUR: 109.95, GBP: 94.95, USD: 119.95 }, ws: 42, min: 4, tint: '#B5643F' },
  { title: 'Samira embroidered short jacket', retail: { EUR: 94.95, GBP: 81.95, USD: 104.95 }, ws: 37, min: 4, tint: '#E9E2D2' }
];
const T = {
  en: { addToCart: 'Add to cart', addShort: 'Add to cart', buyNow: 'Buy now', remind: 'Remind me when in stock', inStock: 'In stock · ships in 24h', low: 'Only a few left', soldOut: 'Sold out', sizeGuide: 'Size guide', storeReviews: 'store reviews', seeMore: 'See more', seeLess: 'See less', free: 'Free', returns: '14-day returns', fit: 'Fit', shipping: 'Shipping', notify: 'Notify', returnsL: 'Returns', wsPrice: 'Wholesale price', perPiece: 'per piece', tiers: 'Volume pricing', current: 'Current', tierCaption: 'Price per piece. The cart shows the final price for each line.', colour: 'Colour', size: 'Size', total: 'Total', subtotal: 'Subtotal', clear: 'Clear', adding: 'Adding…', added: 'Added', features: 'Main features', description: 'Description', share: 'Share', revTitle: 'What customers say', revNote: 'Store-wide score from all our reviews. Only 4★ and 5★ reviews are shown here.', readAll: 'Read all reviews', writeReview: 'Write a review', alsoLike: 'You may also like', orderingForLabel: 'Ordering for', storeCredit: 'Store credit', accountOrders: 'Account and orders', signOut: 'Sign out', change: 'Change', gateTitle: 'Wholesale-only product', gateText: 'This product is reserved for B2B customers. Please log in with your wholesale account to view it.', signIn: 'Log in', apply: 'Apply for wholesale access', backToShop: 'Back to the shop', portalTitle: 'Welcome to our wholesale portal', portalText: 'Sign in to view your wholesale account, special pricing and trade-only access.', waLine: 'Questions about wholesale? Message us on', bestSuited: 'Best suited for', bisTitle: 'Get notified when it’s back', bisPick: 'Choose the options you want', bisDone: 'Done. We’ll message you on WhatsApp and email as soon as it’s back in stock.', name: 'Name', phone: 'Phone (WhatsApp)', waConsent: 'I agree to receive this stock alert on WhatsApp.', notifyMe: 'Notify me', checkout: 'Check out', orderNote: 'Add order note', viewCart: 'View cart', termsNote: 'Payment terms and store credit are applied at checkout.', browseCatalogue: 'Browse the catalogue', quickOrder: 'Open the quick order list', youMightLike: 'You might like', emptyRetail: 'Your cart is empty', emptyWs: 'Your wholesale cart is empty', account: 'Account', orderSizes: 'Order sizes', addLink: 'Add to cart', newsTitle: 'News from the atelier', subscribe: 'Subscribe', backTop: 'Back to top' },
  es: { addToCart: 'Añadir al carrito', addShort: 'Añadir', buyNow: 'Comprar ya', remind: 'Avísame cuando vuelva', inStock: 'En stock · sale en 24h', low: 'Quedan pocas', soldOut: 'Agotado', sizeGuide: 'Guía de tallas', storeReviews: 'reseñas de la tienda', seeMore: 'Ver más', seeLess: 'Ver menos', free: 'Gratis', returns: 'Devoluciones en 14 días', fit: 'Ajuste', shipping: 'Envío', notify: 'Aviso', returnsL: 'Devoluciones', wsPrice: 'Precio mayorista', perPiece: 'por unidad', tiers: 'Precios por volumen', current: 'Actual', tierCaption: 'Precio por unidad. El carrito muestra el precio final de cada línea.', colour: 'Color', size: 'Talla', total: 'Total', subtotal: 'Subtotal', clear: 'Vaciar', adding: 'Añadiendo…', added: 'Añadido', features: 'Características', description: 'Descripción', share: 'Compartir', revTitle: 'Lo que dicen nuestras clientas', revNote: 'Puntuación de todas las reseñas de la tienda. Aquí solo se muestran las de 4★ y 5★.', readAll: 'Ver todas las reseñas', writeReview: 'Escribir una reseña', alsoLike: 'También te puede gustar', orderingForLabel: 'Pedido para', storeCredit: 'Saldo a favor', accountOrders: 'Cuenta y pedidos', signOut: 'Cerrar sesión', change: 'Cambiar', gateTitle: 'Producto exclusivo para mayoristas', gateText: 'Este producto está reservado para clientes B2B. Inicia sesión con tu cuenta mayorista para verlo.', signIn: 'Iniciar sesión', apply: 'Solicitar acceso mayorista', backToShop: 'Volver a la tienda', portalTitle: 'Bienvenido a nuestro portal mayorista', portalText: 'Inicia sesión para ver tu cuenta mayorista, precios especiales y acceso exclusivo.', waLine: '¿Dudas sobre mayorista? Escríbenos por', bestSuited: 'Ideal para', bisTitle: 'Te avisamos cuando vuelva', bisPick: 'Elige las opciones que quieres', bisDone: 'Listo. Te escribiremos por WhatsApp y email en cuanto vuelva a estar disponible.', name: 'Nombre', phone: 'Teléfono (WhatsApp)', waConsent: 'Acepto recibir este aviso de stock por WhatsApp.', notifyMe: 'Avísame', checkout: 'Tramitar pedido', orderNote: 'Añadir nota al pedido', viewCart: 'Ver carrito', termsNote: 'Las condiciones de pago y el saldo a favor se aplican al pagar.', browseCatalogue: 'Ver el catálogo', quickOrder: 'Abrir el pedido rápido', youMightLike: 'Te puede gustar', emptyRetail: 'Tu carrito está vacío', emptyWs: 'Tu carrito mayorista está vacío', account: 'Cuenta', orderSizes: 'Pedir tallas', addLink: 'Añadir al carrito', newsTitle: 'Novedades del taller', subscribe: 'Suscribirme', backTop: 'Volver arriba' }
};
const F = {
  en: { shipTo: c => `Shipping to ${c}`, freeFrom: a => `free from ${a}`, toGo: a => `${a} to go`, optSold: n => `${n} option${n > 1 ? 's' : ''} sold out · Notify me`, min: (n, os) => `Min. ${n} per colour${os ? '' : ' and size'}`, packs: n => `Packs of ${n}`, max: n => `Max. ${n}`, fromTier: (p, n) => `From ${p} at ${n}+ pieces`, inCart: n => `${n} in cart`, addPieces: n => `Add ${n} piece${n === 1 ? '' : 's'} to cart`, belowMin: n => `Below minimum (${n})`, rounded: (l, n, m) => `${l} rounded to ${n} (packs of ${m})`, capped: (l, n) => `${l} set to ${n}, the most available`, notMult: (n, m, a, b) => `${n} isn't a multiple of ${m}. Use ${a} or ${b}.`, stockBelow: n => `Only ${n}, below minimum`, locUpdated: l => `Prices and availability updated for ${l}.`, each: p => `${p} each`, lowN: n => `Low: ${n}`, inStockN: n => `${n} in stock`, available: 'Available', maxN: n => `Max ${n}`, attention: n => `${n} line${n > 1 ? 's need' : ' needs'} attention`, sum: (p, l) => `${p} piece${p === 1 ? '' : 's'}, ${l} line${l === 1 ? '' : 's'}`, rejected: n => `Shopify didn't add this line: only ${n} can be added right now.`, rejSum: l => `1 line wasn't added: ${l}. See the message on that cell.`, addedSum: n => `${n} pieces added to your cart.`, tierLabel: n => `${n}+ price`, onlyMore: n => `Only ${n} more can be added.`, fixLines: n => `Fix ${n} line${n > 1 ? 's' : ''} before checking out.`, cartTitle: n => `Cart (${n})`, colours: c => `Colours: ${c}`, ruleHint: (m, i) => [m > 1 ? `Min. ${m}` : null, i > 1 ? `packs of ${i}` : null].filter(Boolean).join(', '), onlyLeft: (n, c) => `Only ${n} left, and ${c} ${c === 1 ? 'is' : 'are'} already in your cart.`, orderingFor: (c, l) => `Ordering for ${c} · ${l}` },
  es: { shipTo: c => `Envío a ${c}`, freeFrom: a => `envío gratis a partir de ${a}`, toGo: a => `faltan ${a}`, optSold: n => `${n} opci${n > 1 ? 'ones agotadas' : 'ón agotada'} · Avísame`, min: (n, os) => `Mín. ${n} por color${os ? '' : ' y talla'}`, packs: n => `Packs de ${n}`, max: n => `Máx. ${n}`, fromTier: (p, n) => `Desde ${p} a partir de ${n} unidades`, inCart: n => `${n} en el carrito`, addPieces: n => `Añadir ${n} unidad${n === 1 ? '' : 'es'} al carrito`, belowMin: n => `Por debajo del mínimo (${n})`, rounded: (l, n, m) => `${l} redondeado a ${n} (packs de ${m})`, capped: (l, n) => `${l} ajustado a ${n}, el máximo disponible`, notMult: (n, m, a, b) => `${n} no es múltiplo de ${m}. Usa ${a} o ${b}.`, stockBelow: n => `Solo ${n}, por debajo del mínimo`, locUpdated: l => `Precios y disponibilidad actualizados para ${l}.`, each: p => `${p} c/u`, lowN: n => `Pocas: ${n}`, inStockN: n => `${n} en stock`, available: 'Disponible', maxN: n => `Máx. ${n}`, attention: n => `${n} línea${n > 1 ? 's necesitan' : ' necesita'} revisión`, sum: (p, l) => `${p} unidad${p === 1 ? '' : 'es'}, ${l} línea${l === 1 ? '' : 's'}`, rejected: n => `Shopify no añadió esta línea: ahora solo se pueden añadir ${n}.`, rejSum: l => `1 línea no se añadió: ${l}. Revisa el mensaje en esa celda.`, addedSum: n => `${n} unidades añadidas al carrito.`, tierLabel: n => `precio ${n}+`, onlyMore: n => `Solo se pueden añadir ${n} más.`, fixLines: n => `Corrige ${n} línea${n > 1 ? 's' : ''} para tramitar el pedido.`, cartTitle: n => `Carrito (${n})`, colours: c => `Colores: ${c}`, ruleHint: (m, i) => [m > 1 ? `Mín. ${m}` : null, i > 1 ? `packs de ${i}` : null].filter(Boolean).join(', '), onlyLeft: (n, c) => `Solo quedan ${n} y ya tienes ${c} en el carrito.`, orderingFor: (c, l) => `Pedido para ${c} · ${l}` }
};
const fmt = (n, c) => c.sym + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const conv = (e, f) => Math.round(e * f * 100) / 100;
const key = (p, c, s) => `${p}-${c}-${s || 0}`;
const RT_SAMPLE = () => [{ p: 'bag', c: 0, s: 0, q: 1 }];
const WS_SAMPLE = () => [{ p: 'onesize', c: 0, s: 0, q: 36 }, { p: 'row', c: 0, s: 1, q: 6 }, { p: 'row', c: 1, s: 0, q: 4 }];
const merge = (cart, l) => { const k = key(l.p, l.c, l.s); const i = cart.findIndex(x => key(x.p, x.c, x.s) === k); if (i < 0) return [...cart, l]; return cart.map((x, j) => j === i ? { ...x, q: x.q + l.q } : x); };
const YEL = { bg: '#FBD816', color: '#0F1111', hover: '#E8C70F', active: '#D4B50E', cursor: 'pointer', disabled: false };
const DIS = { bg: '#E5E5E5', color: '#767676', hover: '#E5E5E5', active: '#E5E5E5', cursor: 'not-allowed', disabled: true };
const STRIKE = 'linear-gradient(to top right, transparent calc(50% - 0.75px), #767676 calc(50% - 0.75px), #767676 calc(50% + 0.75px), transparent calc(50% + 0.75px))';

class Component extends DCLogic {
  state = { aud: 'A', country: 'ES', prod: 'row', stock: 'some', tiers: true, page: 'product', vp: 'desktop', cartPreset: 'sample', reject: false,
    forced: [0, 0], selC: 0, selS: 0, rQty: 1, rState: 'idle', rErr: null,
    mx: {}, mxRaw: {}, mxMsg: {}, rejected: {}, mxFocus: null, mxOpen: { 0: true }, wsState: 'idle', wsNote: null,
    oSel: 0, oQty: null, oRaw: null, oErr: null, oState: 'idle',
    rCart: RT_SAMPLE(), wCart: WS_SAMPLE(),
    cartOpen: false, sgOpen: false, bisOpen: false, bisSel: {}, bisDone: false,
    locOpen: false, loc: 0, notice: null, menuOpen: false, sheetOpen: false,
    wsKlarna: true, retOpen: false, shopOpen: false,
    descMore: false, featOpen: false, descOpen: true, tierOpen: false, imgIdx: 0, btnVis: false, ann: 0, revF: 'all', noteOpen: false };
  scRef = React.createRef(); btnRef = React.createRef(); revRef = React.createRef();
  componentDidMount() { this.t = setInterval(() => this.setState(s => ({ ann: s.ann + 1 })), 5000); }
  componentWillUnmount() { clearInterval(this.t); clearTimeout(this.to); clearTimeout(this.to2); }
  componentDidUpdate(pp, ps) { const s = this.state; if (ps.vp !== s.vp || ps.prod !== s.prod || ps.aud !== s.aud || ps.page !== s.page) setTimeout(this.checkBtn, 80); }
  checkBtn = () => { const sc = this.scRef.current, b = this.btnRef.current; if (!sc || !b) { if (this.state.btnVis) this.setState({ btnVis: false }); return; } const r = b.getBoundingClientRect(), v = sc.getBoundingClientRect(); const vis = r.bottom > v.top && r.top < v.bottom; if (vis !== this.state.btnVis) this.setState({ btnVis: vis }); };
  isWs(s = this.state) { return s.aud === 'C' || s.aud === 'D'; }
  L(s = this.state) { return s.country === 'ES' ? F.es : F.en; }
  info(pk, ci, si, s = this.state) {
    const p = P[pk], raw = p.stock[p.colours[ci]][si || 0];
    if (raw === 'x' || raw === undefined) return { exists: false };
    let tracked = raw !== null, qty = raw;
    if (tracked && s.stock === 'all') qty = Math.max(qty, 40);
    const hit = s.forced[0] === ci && s.forced[1] === (si || 0);
    if (s.stock === 'selected' && hit) { tracked = true; qty = 0; }
    if (s.stock === 'backorder' && hit) return { exists: true, tracked: false, qty: 0, backorder: true };
    return { exists: true, tracked, qty };
  }
  resetProduct(prod) { return { prod, selC: 0, selS: 0, rQty: 1, mx: {}, mxRaw: {}, mxMsg: {}, rejected: {}, mxFocus: null, mxOpen: { 0: true }, oSel: 0, oQty: null, oRaw: null, oErr: null, forced: [0, 0], imgIdx: 0, rErr: null, wsNote: null, tierOpen: false, descMore: false }; }
  scrollTop(y) { const sc = this.scRef.current; if (this.state.vp === 'mobile' && sc) sc.scrollTo({ top: y, behavior: 'smooth' }); else window.scrollTo({ top: y, behavior: 'smooth' }); }
  wsUnit(pk, q, s = this.state) { const pr = P[pk]; let b = pr.ws; if (s.tiers) pr.tiers.forEach(t => { if (q >= t[0]) b = t[1]; }); return conv(b, CUR[s.country].f); }
  tierOf(pk, q, s = this.state) { return s.tiers ? P[pk].tiers.filter(t => q >= t[0]).pop() || null : null; }

  setAud = e => this.setState({ aud: e.target.value, locOpen: false, notice: null, cartOpen: false, sheetOpen: false, menuOpen: false, bisOpen: false });
  setCountry = e => this.setState({ country: e.target.value });
  setProd = e => this.setState(this.resetProduct(e.target.value));
  setStock = e => { const v = e.target.value; this.setState(s => ({ stock: v, forced: v === 'selected' || v === 'backorder' ? (this.isWs(s) && s.prod !== 'row' ? [s.oSel, 0] : [s.selC, s.selS]) : s.forced, rErr: null, oErr: null })); };
  setTiers = e => this.setState({ tiers: e.target.value === 'on' });
  setPage = e => this.setState({ page: e.target.value });
  setVp = e => this.setState({ vp: e.target.value, menuOpen: false, sheetOpen: false, locOpen: false });
  setCart = e => { const v = e.target.value; this.setState({ cartPreset: v, rCart: v === 'empty' ? [] : RT_SAMPLE(), wCart: v === 'empty' ? [] : v === 'error' ? [...WS_SAMPLE(), { p: 'onesize', c: 3, s: 0, q: 40 }] : WS_SAMPLE(), cartOpen: true }); };
  setReject = e => this.setState({ reject: e.target.value === 'reject' });

  onScroll = () => this.checkBtn();
  onGalScroll = e => { const el = e.currentTarget; const i = Math.round(el.scrollLeft / el.clientWidth); if (i !== this.state.imgIdx) this.setState({ imgIdx: i }); };
  pickLoc = i => { this.setState({ loc: i, locOpen: false, sheetOpen: false, menuOpen: false, notice: this.L().locUpdated(LOCS[i]) }); };

  addRetail = () => {
    const s = this.state; const L = this.L();
    this.setState({ rState: 'adding', rErr: null });
    this.to = setTimeout(() => {
      const st = this.state; const inf = this.info(st.prod, st.selC, st.selS); const k = key(st.prod, st.selC, st.selS);
      const ex = (st.rCart.find(l => key(l.p, l.c, l.s) === k) || { q: 0 }).q;
      if (inf.tracked && ex + st.rQty > inf.qty) { this.setState({ rState: 'idle', rErr: L.onlyLeft(inf.qty, ex) }); return; }
      this.setState({ rCart: merge(st.rCart, { p: st.prod, c: st.selC, s: st.selS, q: st.rQty }), rState: 'added', cartOpen: true, rQty: 1 });
      this.to2 = setTimeout(() => this.setState({ rState: 'idle' }), 1800);
    }, 600);
  };

  mxSet(id, v, msg) { this.setState(s => ({ mx: { ...s.mx, [id]: v }, mxRaw: { ...s.mxRaw, [id]: undefined }, mxMsg: { ...s.mxMsg, [id]: msg || undefined }, rejected: { ...s.rejected, [id]: undefined }, wsNote: null })); }
  focusNext(ci, si, d, target) {
    const p = P[this.state.prod], R = p.colours.length, C = p.sizes.length;
    const ok = (r, c) => { const el = document.getElementById(`mx-${r}-${c}`); return el && !el.disabled ? el : null; };
    if (d === 'next') { for (let i = ci * C + si + 1; i < R * C; i++) { const el = ok(Math.floor(i / C), i % C); if (el) { el.focus(); return; } } target.blur(); return; }
    let r = ci + d[0], c = si + d[1];
    while (r >= 0 && r < R && c >= 0 && c < C) { const el = ok(r, c); if (el) { el.focus(); return; } r += d[0]; c += d[1]; }
  }
  addMatrix = () => {
    this.setState({ wsState: 'adding' });
    this.to = setTimeout(() => {
      const s = this.state, pk = s.prod, p = P[pk], L = this.L();
      const entries = Object.entries(s.mx).filter(([, v]) => v > 0);
      const rk = s.reject && entries.length ? entries[entries.length - 1][0] : null;
      let cart = s.wCart, added = 0, rejLabel = null; const mx = {}, rej = {};
      entries.forEach(([k, v]) => { const parts = k.split('-'); const c = +parts[1], si = +parts[2];
        if (k === rk) { mx[k] = v; rej[k] = L.rejected(Math.max(0, v - p.rule.inc)); rejLabel = `${p.colours[c]} ${p.sizes[si]}`; return; }
        cart = merge(cart, { p: pk, c, s: si, q: v }); added += v; });
      this.setState({ wCart: cart, mx, mxMsg: {}, mxRaw: {}, rejected: rej, wsState: 'idle', cartOpen: added > 0, wsNote: { added, rejLabel } });
    }, 700);
  };
  clearMx = () => this.setState({ mx: {}, mxRaw: {}, mxMsg: {}, rejected: {}, wsNote: null });
  addOne = () => {
    this.setState({ oState: 'adding', oErr: null });
    this.to = setTimeout(() => {
      const s = this.state, p = P[s.prod], q = s.oQty ?? p.rule.min;
      if (s.reject) { this.setState({ oState: 'idle', oErr: this.L().rejected(Math.max(0, q - p.rule.inc)) }); return; }
      this.setState({ wCart: merge(s.wCart, { p: s.prod, c: s.oSel, s: 0, q }), oState: 'idle', oQty: null, cartOpen: true });
    }, 700);
  };
  cartStep(i, dir) {
    const ws = this.isWs(); const field = ws ? 'wCart' : 'rCart';
    this.setState(s => { const cart = [...s[field]]; const l = cart[i]; const r = ws ? P[l.p].rule : { min: 1, inc: 1 }; let q = l.q;
      if (dir > 0) q = q % r.inc ? Math.ceil(q / r.inc) * r.inc : (q < r.min ? r.min : q + r.inc);
      else q = q % r.inc ? Math.floor(q / r.inc) * r.inc : (q <= r.min ? 0 : q - r.inc);
      if (q > 0 && q < r.min) q = dir > 0 ? r.min : 0;
      if (q <= 0) cart.splice(i, 1); else cart[i] = { ...l, q };
      return { [field]: cart }; });
  }
  cartRemove(i) { const f = this.isWs() ? 'wCart' : 'rCart'; this.setState(s => ({ [f]: s[f].filter((_, j) => j !== i) })); }

  renderVals() {
    const s = this.state, es = s.country === 'ES', t = es ? T.es : T.en, L = es ? F.es : F.en, cur = CUR[s.country];
    const ws = this.isWs(), mobile = s.vp === 'mobile', pk = s.prod, p = P[pk], rule = p.rule;
    const money = n => fmt(n, cur);
    const gate = s.aud === 'E' && s.page === 'product';
    const showProduct = s.page === 'product' && !gate;
    const hasSizes = !!(p.sizes && p.sizes.length > 1);
    const isRow = pk === 'row';
    const showMatrix = showProduct && ws && isRow;
    const showOne = showProduct && ws && !isRow;
    const inCartOf = k => (s.wCart.find(l => key(l.p, l.c, l.s) === k) || { q: 0 }).q;
    const status = inf => {
      if (!inf.exists) return { text: '—', color: '#6B6B6B' };
      if (inf.backorder) return { text: es ? 'Bajo pedido' : 'On backorder', color: '#B45309', short: es ? 'Bajo pedido' : 'Backorder' };
      if (inf.tracked && inf.qty <= 0) return { text: t.soldOut, color: '#B91C1C', short: t.soldOut };
      if (inf.tracked && inf.qty <= 8) return { text: t.low, color: '#B45309', short: t.low };
      return { text: t.inStock, color: '#15803D', short: es ? 'En stock' : 'In stock' };
    };
    const wsHint = (inf, cap) => {
      if (inf.tracked && inf.qty <= 0) return { text: t.soldOut, color: '#B91C1C' };
      if (inf.tracked && inf.qty < rule.min) return { text: L.stockBelow(inf.qty), color: '#B91C1C' };
      if (!inf.tracked) return { text: L.available, color: '#4A4B4A' };
      if (inf.qty <= 10) return { text: L.lowN(inf.qty), color: '#B45309' };
      return { text: L.inStockN(inf.qty), color: '#15803D' };
    };

    // gallery colour
    let galC = s.selC;
    if (showMatrix) galC = s.mxFocus ? +s.mxFocus.split('-')[1] : 0;
    if (showOne) galC = s.oSel;
    const cName = p.colours[galC];
    const shots = es ? ['Delante', 'Espalda', 'Detalle del bordado', 'Con modelo'] : ['Front', 'Back', 'Embroidery detail', 'On model'];
    const gallery = shots.map(x => ({ label: `${cName} · ${x}`, tint: SW[cName] }));

    // retail selection
    const selInfo = this.info(pk, s.selC, s.selS);
    const selSoldR = selInfo.exists && selInfo.tracked && selInfo.qty <= 0;
    let soldCount = 0; const soldList = [];
    p.colours.forEach((c, ci) => (p.sizes || [null]).forEach((z, si) => { const inf = this.info(pk, ci, si); if (inf.exists && inf.tracked && inf.qty <= 0) { soldCount++; soldList.push({ ci, si, label: z && hasSizes ? `${c} · ${z}` : c }); } }));
    const stockLine = status(selInfo);
    const rp = p.retail[cur.code];
    const rCap = selInfo.tracked ? selInfo.qty : 99;
    const rBtn = !selInfo.exists ? { ...DIS, label: es ? 'No disponible' : 'Unavailable' } : selSoldR ? { ...DIS, label: t.soldOut } : s.rState === 'adding' ? { ...YEL, label: t.adding } : s.rState === 'added' ? { ...YEL, label: t.added } : { ...YEL, label: t.addToCart };

    const swatchSel = ws ? s.oSel : s.selC;
    const swatches = p.colours.map((c, ci) => {
      const allSold = (p.sizes || [null]).every((z, si) => { const inf = this.info(pk, ci, si); return !inf.exists || (inf.tracked && inf.qty <= 0); });
      const sel = ci === swatchSel;
      return { name: c, bg: SW[c], selected: sel, border: sel ? '#2A2B2A' : '#E7E7E7', sold: allSold, aria: allSold ? `${c}, ${t.soldOut}` : c,
        onClick: () => { if (ws) this.setState({ oSel: ci, oQty: null, oRaw: null, oErr: null }); else { let si = s.selS; if (!this.info(pk, ci, si).exists) si = (p.sizes || [0]).findIndex((z, j) => this.info(pk, ci, j).exists); this.setState({ selC: ci, selS: Math.max(0, si), rErr: null, rQty: 1 }); } } };
    });
    const sizeBtns = hasSizes ? p.sizes.map((z, si) => {
      const inf = this.info(pk, s.selC, si), sel = si === s.selS, na = !inf.exists, sold = inf.exists && inf.tracked && inf.qty <= 0;
      return { name: z, selected: sel, na, strike: na || sold, sr: na ? (es ? 'no disponible' : 'not offered') : sold ? t.soldOut : '',
        bg: sel ? '#2A2B2A' : '#fff', color: sel ? '#fff' : na ? '#767676' : '#2A2B2A', border: sel ? '#2A2B2A' : '#E7E7E7', cursor: na ? 'not-allowed' : 'pointer',
        onClick: () => this.setState({ selS: si, rErr: null, rQty: 1 }) };
    }) : [];

    // retail cart & shipping
    const rSub = s.rCart.reduce((a, l) => a + P[l.p].retail[cur.code][0] * l.q, 0);
    const [shipRate, shipFree] = SHIP[s.country];
    const shipCountry = es ? cur.nameEs : cur.name;
    const toGo = Math.max(0, shipFree - rSub);
    const shipText = toGo <= 0 ? `${L.shipTo(shipCountry)} · ${t.free}` : `${L.shipTo(shipCountry)} · ${money(shipRate)}, ${L.freeFrom(money(shipFree))}`;
    const shipPct = Math.min(100, Math.round(rSub / shipFree * 100));

    // wholesale price & chips
    const baseWs = conv(p.ws, cur.f);
    const tiers = s.tiers ? p.tiers : [];
    const lastTier = tiers[tiers.length - 1];
    const oneSize = !hasSizes;
    const ruleSet = rule;
    const chips = ws && showProduct ? [ruleSet.min > 1 ? L.min(ruleSet.min, oneSize) : null, ruleSet.inc > 1 ? L.packs(ruleSet.inc) : null, ruleSet.max ? L.max(ruleSet.max) : null].filter(Boolean) : [];

    // matrix
    const mxRows = []; let pieces = 0, lines = 0, invalidN = 0, subtotal = 0;
    if (showMatrix) {
      p.colours.forEach((c, ci) => {
        let rowTotal = 0, rowFlag = false;
        const cells = p.sizes.map((z, si) => {
          const id = key(pk, ci, si), domId = `mx-${ci}-${si}`, inf = this.info(pk, ci, si), label = `${c} ${z}`;
          if (!inf.exists) return { id, domId, size: z, na: true, live: false, hint: es ? 'No disponible' : 'Not offered', hintColor: '#6B6B6B', cellBg: '#FAFAFA' };
          const inC = inCartOf(id);
          const cap = Math.min(rule.max || Infinity, inf.tracked ? inf.qty : Infinity) - inC;
          const disabled = (inf.tracked && inf.qty < rule.min) || cap < rule.min;
          const v = s.mx[id] || 0, raw = s.mxRaw[id];
          const invalid = v > 0 && v < rule.min;
          const tier = this.tierOf(pk, v);
          const h = wsHint(inf, cap);
          const notes = [];
          if (inC) notes.push(L.inCart(inC));
          if (v > 0 && tier) notes.push(L.each(money(conv(tier[1], cur.f))));
          if (!disabled && isFinite(cap) && v >= rule.min && v + rule.inc > cap) notes.push(L.maxN(v));
          const err = invalid ? L.belowMin(rule.min) : (s.rejected[id] || null);
          if (v > 0) { pieces += v; lines++; rowTotal += v; subtotal += v * this.wsUnit(pk, v); }
          if (invalid) { invalidN++; rowFlag = true; }
          if (err) rowFlag = true;
          const plusDis = disabled || (v < rule.min ? rule.min > cap : v + rule.inc > cap);
          const minusDis = disabled || v === 0;
          const commit = e => { const rv = s.mxRaw[id]; if (rv === undefined) return; let n = parseInt(rv, 10); if (isNaN(n)) n = 0;
            if (n === 0 || n < rule.min) { this.mxSet(id, n); return; }
            let r = n % rule.inc ? Math.ceil(n / rule.inc) * rule.inc : n; let msg = null;
            if (r > cap) { r = Math.floor(cap / rule.inc) * rule.inc; if (r < rule.min) r = 0; msg = L.capped(label, r); } else if (r !== n) msg = L.rounded(label, r, rule.inc);
            this.mxSet(id, r, msg); };
          return { id, domId, size: z, na: false, live: true, disabled, display: raw !== undefined ? raw : String(v), weight: v > 0 ? 600 : 400,
            hint: h.text, hintColor: h.color, note: notes.join(' · ') || null, error: err,
            border: err ? '#B91C1C' : v > 0 ? '#2A2B2A' : '#E7E7E7', cellBg: v > 0 ? '#F4F4F4' : '#fff', op: disabled ? 0.45 : 1,
            plusDis, minusDis, plusOp: plusDis ? 0.3 : 1, minusOp: minusDis ? 0.3 : 1,
            aria: `${label}, ${h.text}`, plusAria: `Add ${v === 0 ? rule.min : rule.inc} to ${label}`, minusAria: `Remove from ${label}`,
            plus: () => this.mxSet(id, v < rule.min ? rule.min : v + rule.inc),
            minus: () => this.mxSet(id, v <= rule.min ? 0 : (v % rule.inc ? Math.floor(v / rule.inc) * rule.inc : v - rule.inc)),
            onChange: e => { const val = e.target.value.replace(/\D/g, '').slice(0, 4); this.setState(st => ({ mxRaw: { ...st.mxRaw, [id]: val } })); },
            onBlur: commit,
            onFocus: e => { const el = e.target; this.setState({ mxFocus: id }); setTimeout(() => el.select && el.select(), 0); },
            onKey: e => { const k = e.key; let d = null; if (k === 'ArrowRight') d = [0, 1]; else if (k === 'ArrowLeft') d = [0, -1]; else if (k === 'ArrowDown') d = [1, 0]; else if (k === 'ArrowUp') d = [-1, 0]; else if (k === 'Enter') d = 'next'; if (!d) return; e.preventDefault(); this.focusNext(ci, si, d, e.target); } };
        });
        const open = !!s.mxOpen[ci];
        mxRows.push({ name: c, bg: SW[c], cells, total: String(rowTotal), pcs: `${rowTotal} ${es ? 'uds' : 'pcs'}`, open, chev: open ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6', flag: rowFlag ? (es ? 'Necesita revisión' : 'Needs attention') : null, topBorder: ci ? '1px solid #E7E7E7' : '0',
          toggle: () => this.setState(st => ({ mxOpen: { ...st.mxOpen, [ci]: !st.mxOpen[ci] } })) });
      });
    }
    const sumMsgs = [];
    if (showMatrix) {
      if (invalidN) sumMsgs.push({ text: L.attention(invalidN), color: '#B91C1C' });
      Object.values(s.mxMsg).filter(Boolean).forEach(m => sumMsgs.push({ text: m, color: '#2A2B2A' }));
      if (s.wsNote) { if (s.wsNote.added) sumMsgs.push({ text: L.addedSum(s.wsNote.added), color: '#15803D' }); if (s.wsNote.rejLabel) sumMsgs.push({ text: L.rejSum(s.wsNote.rejLabel), color: '#B91C1C' }); }
    }
    const mxDis = pieces === 0 || invalidN > 0 || s.wsState === 'adding';
    const mxBtn = { ...(mxDis ? DIS : YEL), label: s.wsState === 'adding' ? t.adding : L.addPieces(pieces), labelShort: s.wsState === 'adding' ? t.adding : invalidN ? L.attention(invalidN) : t.addToCart };

    // one-size wholesale
    let o = {};
    if (showOne) {
      const inf = this.info(pk, s.oSel, 0), id = key(pk, s.oSel, 0), inC = inCartOf(id);
      const cap = Math.min(rule.max || Infinity, inf.tracked ? inf.qty : Infinity) - inC;
      const sold = inf.tracked && inf.qty <= 0, below = inf.tracked && inf.qty > 0 && inf.qty < rule.min;
      const q = s.oQty ?? rule.min;
      let err = null;
      if (q % rule.inc) err = L.notMult(q, rule.inc, Math.floor(q / rule.inc) * rule.inc || rule.inc, Math.ceil(q / rule.inc) * rule.inc);
      else if (q < rule.min) err = L.belowMin(rule.min);
      else if (!sold && !below && q > cap) err = L.onlyMore(Math.max(0, cap));
      const errText = s.oErr || err;
      const unit = this.wsUnit(pk, q);
      const nextUp = q % rule.inc ? Math.ceil(q / rule.inc) * rule.inc : q + rule.inc;
      const nextDn = q % rule.inc ? Math.floor(q / rule.inc) * rule.inc : q - rule.inc;
      const plusDis = sold || below || nextUp > cap, minusDis = sold || below || nextDn < rule.min;
      const h = wsHint(inf, cap);
      const blocked = sold || below || !!err || s.oState === 'adding';
      o = { oHint: h, oDisplay: s.oRaw ?? String(q), oInCart: inC ? L.inCart(inC) : null, oLine: `${q} × ${money(unit)} = ${money(q * unit)}`, oErrText: sold || below ? null : errText, oBorder: errText && !sold ? '#B91C1C' : '#E7E7E7',
        oPlusDis: plusDis, oMinusDis: minusDis, oPlusOp: plusDis ? 0.3 : 1, oMinusOp: minusDis ? 0.3 : 1,
        oPlus: () => this.setState({ oQty: nextUp, oErr: null }), oMinus: () => this.setState({ oQty: nextDn, oErr: null }),
        oChange: e => this.setState({ oRaw: e.target.value.replace(/\D/g, '').slice(0, 4) }),
        oBlur: () => { if (s.oRaw === null || s.oRaw === undefined) return; const n = parseInt(s.oRaw, 10); this.setState({ oQty: isNaN(n) ? rule.min : n, oRaw: null, oErr: null }); },
        oBtn: { ...(blocked ? DIS : YEL), label: sold ? t.soldOut : below ? L.stockBelow(inf.qty) : s.oState === 'adding' ? t.adding : L.addPieces(q) } };
      o._q = q;
    }

    // tiers table
    const activeQ = showMatrix ? (s.mxFocus ? (s.mx[s.mxFocus] || 0) : 0) : (o._q || 0);
    const tierRows = tiers.length ? [[rule.min, tiers[0][0] - 1, p.ws], ...tiers.map((tt, i) => [tt[0], tiers[i + 1] ? tiers[i + 1][0] - 1 : null, tt[1]])].map(([a, b, pr]) => {
      const active = activeQ >= a && (b === null || activeQ <= b) && activeQ > 0;
      return { range: b === null ? `${a}+` : `${a}–${b}`, price: money(conv(pr, cur.f)), active, bg: active ? '#F4F4F4' : 'transparent', weight: active ? 600 : 400 };
    }) : [];

    // cart
    const cartSrc = ws ? s.wCart : s.rCart;
    let errN = 0;
    const cartLines = cartSrc.map((l, i) => {
      const lp = P[l.p], cn = lp.colours[l.c];
      const opts = [cn, lp.sizes && lp.sizes.length > 1 ? lp.sizes[l.s] : null].filter(Boolean).join(' / ');
      const base = { title: lp.title, tint: SW[cn], single: true, pack: false, packSw: [], q: l.q, border: '#E7E7E7', removeAria: `Remove ${lp.title}`,
        minus: () => this.cartStep(i, -1), plus: () => this.cartStep(i, 1), remove: () => this.cartRemove(i), plusDis: false, plusOp: 1 };
      if (!ws) { const pr = lp.retail[cur.code]; return { ...base, opts, priceLine: money(pr[0]), compare: pr[1] ? money(pr[1]) : null, total: money(pr[0] * l.q), hint: null, err: null }; }
      const r = lp.rule, unit = this.wsUnit(l.p, l.q), tier = this.tierOf(l.p, l.q);
      const assorted = l.p === 'onesize';
      let err = null;
      if (l.q % r.inc) err = L.notMult(l.q, r.inc, Math.floor(l.q / r.inc) * r.inc, Math.ceil(l.q / r.inc) * r.inc);
      else if (l.q < r.min) err = L.belowMin(r.min);
      else if (r.max && l.q > r.max) err = L.max(r.max);
      if (err) errN++;
      const plusDis = !!(r.max && l.q + r.inc > r.max);
      return { ...base, opts: assorted ? L.colours(lp.colours.join(', ')) : opts, pack: assorted, single: !assorted, packSw: lp.colours.map(c => SW[c]),
        priceLine: `${money(unit)} ${t.perPiece}${tier ? `, ${L.tierLabel(tier[0])}` : ''}`, compare: null, total: money(unit * l.q), hint: L.ruleHint(r.min, r.inc) || null, err, border: err ? '#B91C1C' : '#E7E7E7', plusDis, plusOp: plusDis ? 0.3 : 1 };
    });
    const cartSub = cartSrc.reduce((a, l) => a + (ws ? this.wsUnit(l.p, l.q) : P[l.p].retail[cur.code][0]) * l.q, 0);
    const cartCount = cartSrc.reduce((a, l) => a + l.q, 0);
    const checkoutDis = errN > 0;

    // reviews & recs
    const revChips = [['all', es ? 'Todas' : 'All'], ['5', '5★'], ['4', '4★'], ['photo', es ? 'Con fotos' : 'With photos']].map(([k, lab]) => ({ label: lab, on: s.revF === k, bg: s.revF === k ? '#2A2B2A' : '#fff', color: s.revF === k ? '#fff' : '#2A2B2A', border: s.revF === k ? '#2A2B2A' : '#E7E7E7', onClick: () => this.setState({ revF: k }) }));
    const reviews = REVIEWS.filter(r => s.revF === 'all' || (s.revF === 'photo' ? r.photo : String(r.stars) === s.revF)).map(r => ({ ...r, stars: '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars), aria: `${r.stars} out of 5`, tag: r.piece ? (es ? 'Esta pieza' : 'This piece') : r.product, tagBg: r.piece ? '#2A2B2A' : '#F4F4F4', tagColor: r.piece ? '#fff' : '#2A2B2A' }));
    const recSrc = [...Object.keys(P).filter(k => k !== pk).map(k => ({ pk: k, title: P[k].title, retail: P[k].retail[cur.code][0], ws: P[k].ws, min: P[k].rule.min, tiers: P[k].tiers, tint: SW[P[k].colours[0]], os: !(P[k].sizes && P[k].sizes.length > 1) })), ...EXTRA.map(x => ({ ...x, retail: x.retail[cur.code], tiers: [], os: false }))].slice(0, 4);
    const recs = recSrc.map(r => ({ title: r.title, tint: r.tint, price: ws ? `${money(conv(r.ws, cur.f))} ${t.perPiece}` : money(r.retail),
      sub: ws && s.tiers && r.tiers.length ? `${es ? 'desde' : 'from'} ${money(conv(r.tiers[r.tiers.length - 1][1], cur.f))}` : null,
      chip: ws ? L.min(r.min, r.os) : null, action: ws ? t.orderSizes : t.addLink,
      onClick: () => { if (r.pk) { this.setState(this.resetProduct(r.pk)); this.scrollTop(0); } } }));
    const promoted = ['onesize', 'row'].map(k => ({ title: P[k].title, tint: SW[P[k].colours[1]], price: money(P[k].retail[cur.code][0]) }));

    const features = [[es ? 'Tejido' : 'Fabric', p.fabric], [es ? 'Bordado' : 'Embroidery', p.emb], [t.colour, p.colours.join(', ')], [es ? 'Tallas' : 'Sizes', p.sizes ? p.sizes.join(', ') : null]].filter(x => x[1]).map(([k, v]) => ({ k, v }));
    const descText = s.descMore ? DESC : DESC.slice(0, 200).replace(/\s+\S*$/, '') + '…';
    const bisChips = soldList.map(x => { const k = `${x.ci}-${x.si}`; const on = !!s.bisSel[k]; return { label: x.label, on, bg: on ? '#2A2B2A' : '#fff', color: on ? '#fff' : '#2A2B2A', border: on ? '#2A2B2A' : '#E7E7E7', onClick: () => this.setState(st => ({ bisSel: { ...st.bisSel, [k]: !st.bisSel[k] } })) }; });
    const bisNone = !Object.values(s.bisSel).some(Boolean);
    const overlay = s.cartOpen || s.sgOpen || s.bisOpen || s.menuOpen || s.sheetOpen;
    const showSticky = mobile && showProduct && !ws && !s.btnVis && !overlay;
    const showMobileSummary = mobile && showMatrix && !overlay;
    const labelText = !ws && rp[1] ? 'Sale' : null;

    return {
      ...s, t, p, ...o,
      wsKlarnaVal: s.wsKlarna ? 'on' : 'off', setWsKlarna: e => this.setState({ wsKlarna: e.target.value === 'on' }),
      wsKlarnaText: ws && showMatrix && s.wsKlarna ? (es ? `Paga en 3 plazos sin intereses de ${money(Math.ceil(baseWs * rule.min * 100 / 3) / 100)} (pedido mínimo por línea)` : `Pay in 3 interest-free instalments of ${money(Math.ceil(baseWs * rule.min * 100 / 3) / 100)} on a minimum line`) : null,
      backorderNote: !ws && selInfo.backorder ? (es ? 'Sin stock ahora mismo. Puedes pedirlo y lo enviaremos en cuanto vuelva.' : 'Out of stock right now. You can still order it and we’ll ship it as soon as it’s back.') : null,
      retOpen: s.retOpen, retSign: s.retOpen ? '−' : '+', toggleRet: () => this.setState({ retOpen: !s.retOpen }),
      retText: es ? 'Tienes 14 días desde la entrega para devolver cualquier pieza sin usar y con sus etiquetas. Las devoluciones se tramitan desde tu cuenta.' : 'You have 14 days from delivery to return any unworn piece with its tags. Start a return from your account.',
      shopUnderline: s.shopOpen ? 'underline' : 'none', searchW: ws ? '190px' : '250px',
      shopOpen: s.shopOpen, toggleShop: () => this.setState({ shopOpen: !s.shopOpen }), closeShop: () => this.setState({ shopOpen: false }),
      shopCats: ['Long dresses', 'Short dresses', 'Long tunics', 'Short tunics', 'Long coats', 'Jackets', 'Gilets', 'Holiday', 'Swimwear', 'Bags'],
      footCols: [{ h: es ? 'Tienda' : 'Shop', l: ['New in', 'Dresses', 'Tunics', 'Outerwear', 'Bags'] }, { h: es ? 'Ayuda' : 'Help', l: [es ? 'Envíos' : 'Shipping', es ? 'Devoluciones' : 'Returns', es ? 'Guía de tallas' : 'Size guide', 'FAQ', es ? 'Contacto' : 'Contact'] }, { h: 'ibBan', l: [es ? 'Nuestra historia' : 'Our story', es ? 'Reseñas' : 'Reviews', es ? 'Mayoristas' : 'Wholesale', 'Lookbook'] }],
      footCols4: mobile ? 'repeat(2, minmax(0,1fr))' : 'repeat(3, minmax(0,1fr)) minmax(0,1.4fr)',
      scrollTopFn: () => this.scrollTop(0),
      setAud: this.setAud, setCountry: this.setCountry, setProd: this.setProd, setStock: this.setStock, setTiers: this.setTiers, setPage: this.setPage, setVp: this.setVp, setCart: this.setCart, setReject: this.setReject,
      tiersVal: s.tiers ? 'on' : 'off', rejectVal: s.reject ? 'reject' : 'ok',
      isDesktop: !mobile, isMobile: mobile, isWs: ws, isRetail: !ws,
      canvasBg: mobile ? '#E9E9E7' : '#fff', stagePad: mobile ? '32px 16px' : '0', frameW: mobile ? '390px' : '1440px', frameH: mobile ? '844px' : 'auto', frameOverflow: mobile ? 'hidden' : 'visible', frameRadius: mobile ? '28px' : '0', frameShadow: mobile ? '0 20px 60px rgba(15,17,17,0.18), 0 0 0 1px #D6D6D4' : 'none', scrollY: mobile ? 'auto' : 'visible', scrollPadB: mobile && (showSticky || showMatrix) ? '96px' : '0',
      sidePad: mobile ? '16px' : '32px', annAlign: mobile ? 'center' : 'left', layerPos: mobile ? 'absolute' : 'fixed',
      annText: ANN[s.ann % 2], searchPh: SPH[s.ann % 3], countryLabel: `${es ? cur.nameEs : cur.name} · ${cur.code}`, langLabel: es ? 'Español' : 'English',
      showAccountIcon: !ws, signedInRetail: s.aud === 'B', accountTitle: s.aud === 'B' ? 'Your account' : 'Log in',
      chipLabel: `Boutique Luna · ${LOCS[s.loc]}`, multiLoc: s.aud === 'D', storeCredit: money(conv(150, cur.f)),
      locOptions: LOCS.map((n, i) => ({ name: n, checked: i === s.loc, onPick: () => this.pickLoc(i) })),
      toggleLoc: () => { if (s.aud === 'D') this.setState({ locOpen: !s.locOpen }); },
      openCart: () => this.setState({ cartOpen: true, locOpen: false }), closeCart: () => this.setState({ cartOpen: false }),
      hasCartCount: cartCount > 0, cartCount: String(cartCount), cartAria: `Cart, ${cartCount} items`,
      closeNotice: () => this.setState({ notice: null }),
      openMenu: () => this.setState({ menuOpen: true }), closeMenu: () => this.setState({ menuOpen: false }),
      mobileChip: () => { if (s.aud === 'D') this.setState({ sheetOpen: true, menuOpen: false }); },
      closeSheet: () => this.setState({ sheetOpen: false }),
      menuLinks: ['Shop', 'New in', 'Dresses', 'Tunics', 'Outerwear', 'Bags'],
      showGate: gate, showSignin: s.page === 'signin', showProduct,
      gatePad: mobile ? '56px 16px' : '120px 32px', cardPad: mobile ? '24px' : '40px', h1Size: mobile ? '34px' : '44px',
      pdpLabel: ws ? (isRow ? 'S2 Product, wholesale row' : 'S3 Product, wholesale one-size') : 'S1 Product, retail',
      gridCols: mobile ? 'minmax(0,1fr)' : (showMatrix ? 'minmax(0,5fr) minmax(0,7fr)' : 'minmax(0,65fr) minmax(0,25fr)'), gridGap: mobile ? '16px' : (showMatrix ? '48px' : '40px'),
      pdpPad: mobile ? '16px' : '5%', galCols: showMatrix ? 'minmax(0,1fr)' : 'repeat(2, minmax(0,1fr))',
      buyPos: mobile || showMatrix ? 'static' : 'sticky', buyPadTop: mobile ? '4px' : '0', titleSize: mobile ? '26px' : '34px',
      gallery, galCounter: `${s.imgIdx + 1} / ${gallery.length}`, onGalScroll: this.onGalScroll,
      hasLabel: !!labelText, labelText, labelBg: '#AA1155', labelColor: '#fff',
      priceMain: ws ? money(baseWs) : money(rp[0]), priceCompare: !ws && rp[1] ? money(rp[1]) : null, priceColor: !ws && rp[1] ? '#AA1155' : '#2A2B2A',
      fromTierText: ws && showProduct && lastTier ? L.fromTier(money(conv(lastTier[1], cur.f)), lastTier[0]) : null,
      toggleTier: () => this.setState({ tierOpen: !s.tierOpen }), tierChevron: (showOne || s.tierOpen) ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6',
      showTierTable: tierRows.length > 0 && ws && (showOne || s.tierOpen), tierRows,
      taxNote: s.country === 'US' ? 'Taxes calculated at checkout.' : es ? 'IVA incluido.' : 'Tax included.',
      goReviews: () => { const el = this.revRef.current; if (!el) return; if (mobile && this.scRef.current) this.scRef.current.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' }); else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' }); },
      pillStars: !(mobile && es), hasChips: chips.length > 0, chips,
      showSwatches: showProduct && !showMatrix, swatches, colourName: p.colours[ws ? s.oSel : s.selC], strikeBg: STRIKE,
      showSizes: showProduct && !ws && hasSizes, sizeBtns, sizeName: hasSizes ? p.sizes[s.selS] : '',
      openSG: () => this.setState({ sgOpen: true }), closeSG: () => this.setState({ sgOpen: false }), stop: e => e.stopPropagation(),
      stockLine, rowFit: p.fit ? (es ? p.fitEs : p.fit) : null, fitFull: es ? (P.row.fitEs) : P.row.fit,
      shipText, shipProgress: toGo > 0, shipPct, shipPctW: `${shipPct}%`, shipToGo: L.toGo(money(toGo)),
      klarnaText: `3 × ${money(Math.ceil(rp[0] * 100 / 3) / 100)}`,
      notifyRow: soldCount > 0 && !selSoldR ? L.optSold(soldCount) : null, selSold: selSoldR, selAvail: !selSoldR && selInfo.exists,
      openBis: () => this.setState({ bisOpen: true, bisDone: false, bisSel: selSoldR ? { [`${s.selC}-${s.selS}`]: true } : {} }), closeBis: () => this.setState({ bisOpen: false }),
      submitBis: () => this.setState({ bisDone: true }), bisChips, bisForm: !s.bisDone, bisNone, bisBtnBg: bisNone ? '#E5E5E5' : '#FBD816', bisBtnColor: bisNone ? '#767676' : '#0F1111',
      bisAlign: mobile ? 'flex-end' : 'center', bisW: mobile ? '100%' : '460px', bisRadius: mobile ? '16px 16px 0 0' : '16px',
      modalW: mobile ? '100%' : '640px', modalH: mobile ? '100%' : 'auto', modalRadius: mobile ? '0' : '16px',
      rErr: s.rErr, rQty: String(s.rQty), rBtn, showShopPay: selInfo.exists && !selSoldR,
      rMinusDis: s.rQty <= 1, rPlusDis: s.rQty >= rCap, rMinusOp: s.rQty <= 1 ? 0.3 : 1, rPlusOp: s.rQty >= rCap ? 0.3 : 1,
      rMinus: () => this.setState({ rQty: Math.max(1, s.rQty - 1), rErr: null }), rPlus: () => this.setState({ rQty: Math.min(rCap, s.rQty + 1), rErr: null }),
      addRetail: this.addRetail, btnRef: this.btnRef, scRef: this.scRef, revRef: this.revRef, onScroll: this.onScroll,
      showOne, selectAll: e => { const el = e.target; setTimeout(() => el.select && el.select(), 0); }, addOne: this.addOne,
      showMatrix, mxRows, mxCols: `minmax(140px,1.3fr) repeat(${p.sizes ? p.sizes.length : 1}, minmax(0,1fr)) 64px`, sizesHead: p.sizes || [], opt1Name: t.colour,
      sumLine: L.sum(pieces, lines), sumPcsShort: `${pieces} ${es ? 'uds' : 'pcs'}`, sumSubtotal: money(subtotal), sumMsgs, mxBtn, addMatrix: this.addMatrix, clearMx: this.clearMx,
      featOpen: s.featOpen, featSign: s.featOpen ? '−' : '+', toggleFeat: () => this.setState({ featOpen: !s.featOpen }), features,
      descOpen: s.descOpen, descSign: s.descOpen ? '−' : '+', toggleDesc: () => this.setState({ descOpen: !s.descOpen }), descText, moreLabel: s.descMore ? t.seeLess : t.seeMore, toggleMore: () => this.setState({ descMore: !s.descMore }),
      secGap: mobile ? '48px' : '96px', secGapSm: mobile ? '32px' : '56px', revCols: mobile ? 'minmax(0,1fr)' : '300px minmax(0,1fr)', revGrid: mobile ? 'minmax(0,1fr)' : 'repeat(3, minmax(0,1fr))', revChips, reviews,
      recCols: mobile ? 'repeat(2, minmax(0,1fr))' : 'repeat(4, minmax(0,1fr))', recs,
      showSticky, showMobileSummary, showBubble: !showSticky && !showMobileSummary && !overlay,
      cartTitle: L.cartTitle(cartCount), orderingFor: L.orderingFor('Boutique Luna', LOCS[s.loc]), changeFromCart: () => this.setState(mobile ? { cartOpen: false, sheetOpen: true } : { cartOpen: false, locOpen: true }),
      cartEmpty: cartSrc.length === 0, cartHasLines: cartSrc.length > 0, emptyTitle: ws ? t.emptyWs : t.emptyRetail, promoted, cartLines,
      cartSubtotal: money(cartSub), cartTaxNote: ws ? (es ? 'Impuestos y envío se calculan al pagar.' : 'Taxes and shipping are calculated at checkout.') : (s.country === 'US' ? 'Taxes and shipping calculated at checkout.' : es ? 'IVA incluido. Envío calculado al pagar.' : 'Tax included. Shipping calculated at checkout.'),
      toggleNote: () => this.setState({ noteOpen: !s.noteOpen }), cartBlock: checkoutDis ? L.fixLines(errN) : null, checkoutDis,
      checkoutBg: checkoutDis ? '#E5E5E5' : '#FBD816', checkoutColor: checkoutDis ? '#767676' : '#0F1111', checkoutHover: checkoutDis ? '#E5E5E5' : '#E8C70F',
      drawerW: mobile ? '100%' : '440px', drawerRadius: mobile ? '0' : '16px 0 0 16px'
    };
  }
}
