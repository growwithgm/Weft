// Run: node scripts/build-sketches.mjs
// Generates the static design-direction sketches for Tress and Balm (docs/sketches/*.html).
import { writeFileSync } from 'node:fs';
const presets = {
  tress: {
    name: 'Tress', store: 'Maison Tress (sample)', industry: 'Hair care',
    v: { fg:'#121316', bg:'#FFFFFF', surface:'#EEF1F3', line:'#D9DDE1', muted:'#5A6068', primary:'#2B45D6', onPrimary:'#FFFFFF', hover:'#2238B4', sale:'#C4122F', accent:'#E4FF3A',
      rButton:'4px', rCard:'2px', rMedia:'0', rDrawer:'8px', gap:'64px', gapM:'40px', width:'1320px',
      fHead:"'Archivo', 'Arial Narrow', 'Helvetica Neue', Arial, sans-serif", wHead:'700', track:'-0.01em', fBody:"'Instrument Sans', 'Helvetica Neue', Arial, sans-serif", title:'36px', titleM:'28px', h2:'36px' },
    hero: { eyebrow:'Salon-grade care', h:'Repair that you can measure.', p:'Bond-building formulas with the ingredient list up front. Tested on every hair type, used in professional salons.', cta:'Shop repair', cta2:'Find your routine' },
    marquee: ['Sulfate-free', 'Vegan formulas', 'Used in 400 salons', 'Free returns'],
    finder: { q:'What is your hair type?', a:['Straight','Wavy','Curly','Coily'] },
    cats: ['Shampoo','Conditioner','Masks','Styling','Colour','Tools'],
    prods: [['Argan repair shampoo','€14.95','250 ml · €5.98 / 100 ml'],['Bond repair mask','€22.00','200 ml · €11.00 / 100 ml'],['Curl defining cream','€18.50','300 ml · €6.17 / 100 ml'],['Colour cream 6.1','€9.90','100 ml · €9.90 / 100 ml']],
    steps: ['Wash','Condition','Treat','Style'],
    pro: { h:'For professionals', p:'Back-bar sizes, case packs and volume pricing for salons. Sign in with your wholesale account.', cta:'Wholesale sign-in' },
    pdp: { title:'Argan repair shampoo', price:'€14.95', unit:'€5.98 / 100 ml', variants:['250 ml','1 L'], chips:['Dry','Damaged','Colour-treated'], badges:['Sulfate-free','Vegan'], proBadge:'Professional size available',
      hi:[['Repairs','Bonds rebuilt from wash one'],['Protects','Colour stays vivid longer'],['Softens','No silicone build-up'],['Gentle','Safe for daily use']],
      ing:[['Argan oil','Seals the cuticle and adds shine'],['Hydrolysed keratin','Fills gaps in damaged strands'],['Panthenol','Holds moisture in the hair shaft']],
      inci:'Aqua, Sodium Cocoyl Isethionate, Cocamidopropyl Betaine, Argania Spinosa Kernel Oil, Hydrolyzed Keratin, Panthenol, Glycerin, Citric Acid, Parfum.',
      how:['Wet hair thoroughly.','Massage a coin-sized amount into the scalp.','Rinse, then follow with the repair mask.'], routine:'Complete the routine', scent:null, pao:null }
  },
  balm: {
    name: 'Balm', store: 'Balm Atelier (sample)', industry: 'Body care',
    v: { fg:'#2E2433', bg:'#FAFAFB', surface:'#ECE8F1', line:'#DCD6E3', muted:'#6B5E73', primary:'#4B2E5A', onPrimary:'#FFFFFF', hover:'#3C2449', sale:'#B0243C', accent:'#ECE8F1',
      rButton:'999px', rCard:'20px', rMedia:'12px', rDrawer:'24px', gap:'96px', gapM:'56px', width:'1200px',
      fHead:"'Instrument Serif', 'Iowan Old Style', Georgia, serif", wHead:'400', track:'0', fBody:"'Figtree', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", title:'40px', titleM:'30px', h2:'40px' },
    hero: { eyebrow:'Body rituals', h:'Soft skin, slowly.', p:'Whipped butters, oils and scrubs made in small batches. Scent notes you can read before you buy.', cta:'Shop the ritual', cta2:'Find your scent' },
    marquee: ['Vegan', 'Small batches', 'Refillable jars', 'Gift wrapping'],
    finder: { q:'How does your skin feel today?', a:['Dry','Sensitive','Normal','Oily'] },
    cats: ['Body butter','Scrubs','Oils','Hand care','Gift sets','Travel sizes'],
    prods: [['Whipped shea body butter','€19.00','200 ml · €9.50 / 100 ml'],['Coffee body scrub','€16.00','250 g · €6.40 / 100 g'],['Dry body oil','€24.00','100 ml · €24.00 / 100 ml'],['Ritual gift set','€49.00','3 products']],
    steps: ['Cleanse','Exfoliate','Moisturise'],
    pro: { h:'For spas and retailers', p:'Testers, case packs and volume pricing. Sign in with your wholesale account.', cta:'Wholesale sign-in' },
    pdp: { title:'Whipped shea body butter', price:'€19.00', unit:'€9.50 / 100 ml', variants:['200 ml','500 ml'], chips:['Dry skin','Sensitive'], badges:['Vegan','Dermatologically tested'], proBadge:null,
      hi:[['Melts in','Absorbs in under a minute'],['Nourishes','Shea and cocoa butter'],['Calms','Fragrance options for sensitive skin']],
      ing:[['Shea butter','Rich in fatty acids that soften dry skin'],['Cocoa butter','Forms a light protective layer'],['Vitamin E','Antioxidant that protects the formula']],
      inci:'Butyrospermum Parkii Butter, Theobroma Cacao Seed Butter, Caprylic/Capric Triglyceride, Tocopherol, Parfum, Linalool.',
      how:['Warm a small amount between your palms.','Massage into slightly damp skin.','Focus on elbows, knees and heels.'], routine:'Complete the ritual',
      scent:{ top:'Bergamot, pink pepper', heart:'Vanilla orchid', base:'Tonka, sandalwood' }, pao:'12M' }
  }
};
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
for (const [key, p] of Object.entries(presets)) {
  const v = p.v;
  const card = ([t, pr, u], i) => `<a class="card" href="#pdp"><div class="card-media ph" style="--tint:${['#c9b8a6','#9fb1c7','#b7c4b0','#c7a9b8'][i%4]}"><span>${p.industry} product image</span></div><span class="card-title">${esc(t)}</span><span class="price">${pr}</span><span class="unit">${u}</span></a>`;
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.name} preset — design direction sketch</title>
<style>
:root{--fg:${v.fg};--bg:${v.bg};--surface:${v.surface};--line:${v.line};--muted:${v.muted};--primary:${v.primary};--on-primary:${v.onPrimary};--hover:${v.hover};--sale:${v.sale};--accent:${v.accent};
--r-button:${v.rButton};--r-card:${v.rCard};--r-media:${v.rMedia};--r-drawer:${v.rDrawer};--gap:${v.gap};--width:${v.width};--f-head:${v.fHead};--w-head:${v.wHead};--f-body:${v.fBody}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.55 var(--f-body);-webkit-font-smoothing:antialiased}
a{color:inherit}h1,h2,h3{font-family:var(--f-head);font-weight:var(--w-head);letter-spacing:${v.track};line-height:1.1;margin:0}
.note{background:#1F2A37;color:#E6EBF1;font:12px/1.5 ui-monospace,Menlo,monospace;padding:8px 20px}
.wrap{max-width:var(--width);margin:0 auto;padding:0 32px}section{margin-top:var(--gap)}
.ann{background:var(--fg);color:var(--bg);font-size:13px;text-align:center;padding:9px}
header{border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--bg);z-index:5}
.hd{display:grid;grid-template-columns:200px 1fr auto;align-items:center;height:72px;gap:24px}
.logo{font-family:var(--f-head);font-weight:var(--w-head);font-size:28px;text-decoration:none}
nav{display:flex;gap:24px;justify-content:center;font-weight:500;font-size:15px}nav a{text-decoration:none}
.tools{display:flex;gap:8px;align-items:center}.search{height:44px;border:1px solid var(--line);border-radius:var(--r-button);padding:0 16px;display:flex;align-items:center;color:var(--muted);font-size:14px;width:220px}
.icon{width:44px;height:44px;display:grid;place-items:center;border-radius:var(--r-button)}
.btn{display:inline-flex;align-items:center;justify-content:center;height:52px;padding:0 28px;border-radius:var(--r-button);font-weight:600;text-decoration:none;border:1px solid transparent;font-size:16px}
.btn-primary{background:var(--primary);color:var(--on-primary)}.btn-primary:hover{background:var(--hover)}.btn-secondary{border-color:var(--fg);background:transparent}
.ph{background:var(--surface);position:relative;display:flex;align-items:flex-end;padding:12px;color:var(--muted);font-size:12px;border-radius:var(--r-media);overflow:hidden}
.ph::before{content:"";position:absolute;left:50%;top:48%;width:30%;aspect-ratio:1/1.5;transform:translate(-50%,-50%);background:var(--tint,#c9c1b6);border-radius:14px 14px 6px 6px;opacity:.85}.ph span{position:relative}
.hero{display:grid;grid-template-columns:1.1fr 1fr;gap:48px;align-items:center;margin-top:32px}.hero .ph{aspect-ratio:4/5}
.eyebrow{font-size:14px;font-weight:600;color:var(--muted)}.hero h1{font-size:56px;margin:12px 0 16px}.hero p{font-size:18px;max-width:34ch;margin:0 0 28px}.row{display:flex;gap:12px;flex-wrap:wrap}
.marquee{border-block:1px solid var(--line);padding:14px 0;display:flex;gap:48px;justify-content:center;font-weight:500;flex-wrap:wrap}
.sec-h{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:24px}.sec-h h2{font-size:${v.h2}}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:24px 16px}.card{display:flex;flex-direction:column;gap:6px;text-decoration:none}
.card-media{aspect-ratio:4/5}.card-title{font-weight:500}.price{font-weight:600;font-variant-numeric:tabular-nums}.unit{font-size:13px;color:var(--muted)}
.cats{display:grid;grid-template-columns:repeat(6,1fr);gap:12px}.cat{border:1px solid var(--line);border-radius:var(--r-card);padding:20px 12px;text-align:center;font-weight:500}
.finder{background:${key==='tress'?'var(--fg)':'var(--surface)'};color:${key==='tress'?'#fff':'var(--fg)'};border-radius:var(--r-card);padding:48px;display:grid;gap:20px}
.finder h2{font-size:${v.h2}}.pill{display:inline-flex;align-items:center;height:48px;padding:0 22px;border-radius:var(--r-button);border:1px solid ${key==='tress'?'var(--accent)':'var(--fg)'};font-weight:500}
.steps{display:grid;grid-template-columns:repeat(${p.steps.length},1fr);gap:16px}.step{border-top:${key==='tress'?'2px solid var(--fg)':'1px solid var(--line)'};padding-top:16px}.step b{font-family:var(--f-head);font-size:40px;font-weight:var(--w-head);display:block}
.pro{display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:center;background:var(--surface);border-radius:var(--r-card);overflow:hidden}.pro .ph{aspect-ratio:16/10;border-radius:0}.pro div.t{padding:40px}
.tag{display:inline-block;font-size:12px;font-weight:600;padding:3px 10px;border-radius:var(--r-button);background:${key==='tress'?'var(--fg)':'var(--surface)'};color:${key==='tress'?'var(--accent)':'var(--fg)'}}
footer{margin-top:var(--gap);background:var(--surface);padding:48px 0 24px;font-size:14px}.fgrid{display:grid;grid-template-columns:repeat(3,1fr) 1.4fr;gap:24px}
.divider{margin:var(--gap) 0 0;padding:14px 32px;background:var(--fg);color:var(--bg);font:600 13px/1 var(--f-body);text-align:center}
.pdp{display:grid;grid-template-columns:7fr 5fr;gap:48px;margin-top:24px}.gal{display:grid;grid-template-columns:1fr 1fr;gap:12px}.gal .ph{aspect-ratio:4/5}
.buy{display:flex;flex-direction:column;gap:18px;position:sticky;top:96px;align-self:start}.buy h1{font-size:${v.title}}
.chips{display:flex;gap:8px;flex-wrap:wrap}.chip{font-size:13px;font-weight:500;padding:6px 12px;border-radius:var(--r-button);${key==='tress'?'border:1px solid var(--fg)':'background:var(--surface)'}}
.opt{display:flex;gap:8px}.opt span{min-width:88px;height:44px;border:1px solid var(--line);border-radius:var(--r-button);display:grid;place-items:center;font-weight:500}.opt .on{border-color:var(--fg);box-shadow:inset 0 0 0 1px var(--fg)}
.po{display:grid;gap:8px}.po label{border:1px solid var(--line);border-radius:var(--r-card);padding:14px 16px;display:flex;gap:10px;align-items:flex-start}.po .on{border-color:var(--primary);${key==='balm'?'background:var(--surface)':''}}
.stepper{display:flex;align-items:center;height:52px;border:1px solid var(--line);border-radius:var(--r-button)}.stepper span{width:44px;text-align:center}
.hi{display:grid;grid-template-columns:repeat(${p.pdp.hi.length>3?2:3},1fr);gap:12px}.hi div{${key==='balm'?'background:var(--surface);border-radius:var(--r-card);padding:16px':'border-top:1px solid var(--fg);padding-top:10px'}}.hi b{display:block;font-size:14px}.hi small{color:var(--muted)}
.acc{border-top:1px solid ${key==='tress'?'var(--fg)':'var(--line)'}}.acc>div{border-bottom:1px solid ${key==='tress'?'var(--fg)':'var(--line)'};padding:16px 0}.acc h3{font-family:var(--f-body);font-weight:600;font-size:16px;display:flex;justify-content:space-between}
.ing{display:grid;gap:10px;margin-top:12px}.ing div{display:grid;grid-template-columns:${key==='tress'?'36px ':''}1fr;gap:4px}.ing em{font-style:normal;color:var(--muted);font-size:14px}.ing b{font-weight:600}.num{font-family:var(--f-head);font-weight:var(--w-head)}
.inci{font-size:13px;color:var(--muted);margin-top:12px}ol{margin:10px 0 0;padding-inline-start:20px}
.scent{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-top:4px}.scent div{padding:0 12px;border-inline-start:1px solid var(--line)}.scent div:first-child{border:0;padding-inline-start:0}.scent small{display:block;color:var(--muted);font-size:12px}
.pao{display:flex;gap:10px;align-items:center;font-size:14px}.pao svg{flex:0 0 auto}
@media (max-width:760px){.wrap{padding:0 16px}section{margin-top:${v.gapM}}.hd{grid-template-columns:1fr auto;height:60px}nav,.search{display:none}.logo{font-size:24px;white-space:nowrap}
.hero,.pdp,.pro{grid-template-columns:1fr}.hero h1{font-size:38px}.grid4{grid-template-columns:1fr 1fr}.cats{grid-template-columns:repeat(3,1fr)}.steps{grid-template-columns:1fr 1fr}.fgrid{grid-template-columns:1fr 1fr}
.gal{grid-template-columns:1fr;}.gal .ph:not(:first-child){display:none}.buy{position:static}.buy h1{font-size:${v.titleM}}.finder{padding:28px}.pro div.t{padding:24px}}
</style></head><body>
<div class="note">${p.name} preset — static design-direction sketch (docs only, not theme code). Fonts shown with fallbacks; the preset uses ${v.fHead.split(',')[0]} and ${v.fBody.split(',')[0]} from Shopify's font library. Images are placeholders.</div>
<div class="ann">${esc(p.marquee[0])} · ${esc(p.marquee[3])}</div>
<header><div class="wrap hd"><a class="logo" href="#">${esc(p.store.split(' (')[0])}</a><nav><a href="#">Shop</a><a href="#">New in</a>${p.cats.slice(0,3).map(c=>`<a href="#">${c}</a>`).join('')}<a href="#">Routines</a></nav><div class="tools"><div class="search">Search</div><span class="icon" aria-label="Account">◯</span><span class="icon" aria-label="Cart">▢</span></div></div></header>
<main>
<div class="wrap">
<div class="hero"><div><span class="eyebrow">${p.hero.eyebrow}</span><h1>${p.hero.h}</h1><p>${p.hero.p}</p><div class="row"><a class="btn btn-primary" href="#">${p.hero.cta}</a><a class="btn btn-secondary" href="#">${p.hero.cta2}</a></div></div><div class="ph" style="--tint:#b9a79a"><span>Hero: ${key==='tress'?'texture close-up of hair strands':'macro of whipped body butter'}</span></div></div>
</div>
<section class="marquee">${p.marquee.map(m=>`<span>${m}</span>`).join('')}</section>
<div class="wrap">
<section><div class="sec-h"><h2>New in</h2><a href="#">View all</a></div><div class="grid4">${p.prods.map(card).join('')}</div></section>
<section><div class="sec-h"><h2>Shop by category</h2></div><div class="cats">${p.cats.map(c=>`<a class="cat" href="#">${c}</a>`).join('')}</div></section>
<section class="finder"><span class="eyebrow" style="color:inherit;opacity:.8">Guided finder</span><h2>${p.finder.q}</h2><div class="row">${p.finder.a.map(a=>`<a class="pill" href="#">${a}</a>`).join('')}</div><small style="opacity:.8">Each answer links to the filtered collection.</small></section>
<section><div class="sec-h"><h2>${key==='tress'?'Your routine':'The ritual'}</h2></div><div class="steps">${p.steps.map((s,i)=>`<div class="step"><b>${String(i+1).padStart(2,'0')}</b><span style="font-weight:600">${s}</span><div class="ph" style="aspect-ratio:1;margin-top:12px;--tint:#c4b5a8"><span>Product</span></div></div>`).join('')}</div></section>
<section class="pro"><div class="ph"><span>${key==='tress'?'Salon photography':'Spa photography'}</span></div><div class="t"><span class="tag">${key==='tress'?'Professional':'Wholesale'}</span><h2 style="font-size:${v.h2};margin:12px 0">${p.pro.h}</h2><p>${p.pro.p}</p><a class="btn btn-secondary" href="#">${p.pro.cta}</a></div></section>
</div>
<div class="divider" id="pdp">Product page</div>
<div class="wrap pdp">
<div class="gal">${['Front','Texture','In use','Ingredients'].map((l,i)=>`<div class="ph" style="--tint:${['#c9b8a6','#b9c3cf','#c7bfb3','#b8b0c3'][i]}"><span>${l}</span></div>`).join('')}</div>
<div class="buy">
<div class="chips">${p.pdp.badges.map(b=>`<span class="chip">${b}</span>`).join('')}${p.pdp.proBadge?`<span class="tag">${p.pdp.proBadge}</span>`:''}</div>
<h1>${p.pdp.title}</h1>
<div><span class="price" style="font-size:20px">${p.pdp.price}</span><div class="unit">${p.pdp.unit} · Tax included.</div></div>
<div><div style="font-size:15px;margin-bottom:8px">Size: <b>${p.pdp.variants[0]}</b></div><div class="opt">${p.pdp.variants.map((x,i)=>`<span class="${i?'':'on'}">${x}</span>`).join('')}</div></div>
<div><div style="font-size:15px;margin-bottom:8px">${key==='tress'?'Hair type':'Skin type'}</div><div class="chips">${p.pdp.chips.map(c=>`<span class="chip">${c}</span>`).join('')}</div></div>
<div class="po"><label class="on"><input type="radio" checked> <span><b>One-time purchase</b><br><small>${p.pdp.price}</small></span></label><label><input type="radio"> <span><b>Subscribe and save 10%</b><br><small>Delivered every 6 weeks · cancel any time</small></span></label></div>
<div class="row" style="flex-wrap:nowrap"><div class="stepper"><span>−</span><span>1</span><span>+</span></div><a class="btn btn-primary" style="flex:1" href="#">Add to cart</a></div>
<div class="hi">${p.pdp.hi.map(([a,b])=>`<div><b>${a}</b><small>${b}</small></div>`).join('')}</div>
${p.pdp.scent?`<div><div style="font-weight:600;margin-bottom:8px">Scent notes</div><div class="scent"><div><small>Top</small>${p.pdp.scent.top}</div><div><small>Heart</small>${p.pdp.scent.heart}</div><div><small>Base</small>${p.pdp.scent.base}</div></div></div>`:''}
${p.pdp.pao?`<div class="pao"><svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M8 14h20v14a3 3 0 01-3 3H11a3 3 0 01-3-3V14z"/><path d="M7 10l14-5 2 5"/><text x="18" y="26" text-anchor="middle" font-size="8" fill="currentColor" stroke="none">${p.pdp.pao}</text></svg><span>Use within 12 months of opening</span></div>`:''}
<div class="acc">
<div><h3>Key ingredients <span>−</span></h3><div class="ing">${p.pdp.ing.map(([a,b],i)=>`<div>${key==='tress'?`<span class="num">${String(i+1).padStart(2,'0')}</span>`:''}<span><b>${a}</b><br><em>${b}</em></span></div>`).join('')}</div><div class="inci"><b>Full ingredient list (INCI):</b> ${p.pdp.inci}</div></div>
<div><h3>How to use <span>−</span></h3><ol>${p.pdp.how.map(s=>`<li>${s}</li>`).join('')}</ol></div>
${key==='balm'?'<div><h3>Warnings <span>+</span></h3></div>':''}
<div><h3>Description <span>+</span></h3></div>
</div>
</div></div>
<div class="wrap"><section><div class="sec-h"><h2>${p.pdp.routine}</h2></div><div class="grid4">${p.prods.slice(1).concat([p.prods[0]]).map(card).join('')}</div></section></div>
</main>
<footer><div class="wrap fgrid"><div><b>Shop</b><br>${p.cats.slice(0,4).join('<br>')}</div><div><b>Help</b><br>Shipping<br>Returns<br>Contact</div><div><b>About</b><br>Our story<br>Ingredients<br>Wholesale</div><div><b style="font-family:var(--f-head);font-weight:var(--w-head);font-size:24px">Join the list</b><div class="row" style="margin-top:12px"><span class="search" style="width:auto;flex:1">Email</span><a class="btn btn-primary" href="#" style="height:44px">Subscribe</a></div></div></div></footer>
</body></html>
`;
  writeFileSync(new URL(`../docs/sketches/${key}.html`, import.meta.url), html);
}
console.log('ok');
