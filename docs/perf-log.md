# Performance log

Every Lighthouse / budget run: date, commit, preset, page, device, score, LCP, CLS, TBT, bytes. Clean benchmark profile is the release gate (BUILD_SPEC §6).

| Date | Commit | Preset | Page | Device | Perf | A11y | BP | SEO | LCP | CLS | TBT | Theme CSS | Theme JS | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2026-09-28 | P0 | — | — | — | — | — | — | — | — | — | — | — | — | P0 has no theme code; no runs |
| 2026-09-28 | P2 | Weft | product | — | — | — | — | — | — | — | — | section-product.css 5.1 KB | core 5.2 + header 1.7 + product 3.3 + gallery 1.9 + quantity 0.9 + sticky-bar 0.7 KB | Budget check only (gzip, lint); Lighthouse CI needs store secrets |
| 2026-09-28 | P3 | Weft | product (wholesale) | — | — | — | — | — | — | — | — | + component-matrix.css 2.0 KB (wholesale only) | + matrix 5.8 + rules 3.3 KB → ≈ 22.8 KB on a wholesale product page (budget 70 KB) | Budget check only; retail pages load no wholesale JS or CSS |
| 2026-09-28 | P4 | Weft | collection | — | — | — | — | — | — | — | — | base 4.7 + card 2.3 + section-collection 2.6 KB | core 5.4 + header 1.7 + facets 2.9 KB (+ compare 2.1 KB when enabled) | Budget check only; Lighthouse CI needs store secrets |
| 2026-09-28 | P6 step 3 | Tress / Balm | product | — | — | — | — | — | — | — | — | section-product.css 5.5 KB (budget 6 KB) + component-blocks.css 0.8 KB when tabs / highlight / payment / discount blocks are used | product 3.2 KB (+ character counter) | Budget check only; section-product.css is near its budget, so later product blocks get their own file |
