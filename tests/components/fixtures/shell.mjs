// Shared page shell for fixtures: tokens-like CSS variables, base.css, import map, core.js.
export const shell = (body, { modules = [], head = '' } = {}) => `<!doctype html>
<html class="no-js" lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<script>document.documentElement.className = 'js';</script>
<style>:root{--f-heading:Georgia,serif;--f-body:Arial,sans-serif;--fw-heading:600;--fw-body:400;--fw-medium:500;--fw-bold:600;--t-12:12px;--t-13:13px;--t-14:14px;--t-15:15px;--t-16:16px;--t-20:20px;--h-26:26px;--h-34:34px;--h-44:44px;--h-56:56px;--page-width:1260px;--gutter:16px;--section-gap:48px;--border-width:1px;--r-button:26px;--r-input:26px;--r-card:16px;--r-media:0px;--r-drawer:16px;--r-modal:16px;--c-bg:#fff;--c-fg:#2A2B2A;--c-heading:#2A2B2A;--c-muted:#6B6B6B;--c-surface:#F4F4F4;--c-line:#E7E7E7;--c-link:#2A2B2A;--c-primary:#FBD816;--c-on-primary:#0F1111;--c-primary-hover:#E8C70F;--c-secondary:#fff;--c-on-secondary:#2A2B2A;--c-ok:#15803D;--c-low:#B45309;--c-bad:#B91C1C;--c-error:#B91C1C;--c-error-bg:#FCEDEE;--c-success:#15803D;--c-success-bg:#EAF6EE;--c-disabled-bg:#E5E5E5;--c-disabled-fg:#767676;--shadow-overlay:0 12px 40px rgb(0 0 0/.16)}</style>
<link rel="stylesheet" href="/assets/base.css"><link rel="stylesheet" href="/assets/component-drawer.css"><link rel="stylesheet" href="/assets/component-menu.css">
<script type="importmap">{"imports":{"@weft/core":"/assets/core.js","@weft/rules":"/assets/rules.js","@weft/quantity":"/assets/quantity.js"}}</script>
<script>window.Weft={routes:{cart:'/cart',predictiveSearch:'/search/suggest'},settings:{},strings:{error:'Error',locationUpdated:'Prices and availability updated for __location__.'},designMode:false};</script>
${head}
<script type="module" src="/assets/core.js"></script>
${modules.map((m) => `<script type="module" src="/assets/${m}"></script>`).join('\n')}
</head><body>${body}<div class="visually-hidden" aria-live="polite" data-announcer></div></body></html>`;
