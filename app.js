/* Cuaderno de Economía II — núcleo de la app (navegación, progreso, quizzes, gráficos interactivos).
   El contenido de cada unidad vive en u1.js ... u5.js y se registra con App.UNITS.push({...}). */
(function () {
  'use strict';

  const App = { UNITS: [], W: {} };
  window.App = App;

  /* ============================== utilidades ============================== */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function f(x, d = 2) {
    if (x === null || x === undefined || !isFinite(x)) return '—';
    const m = Math.pow(10, d);
    let r = Math.round(x * m) / m;
    if (Object.is(r, -0)) r = 0;
    return r.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: d });
  }
  const ft = (x, d = 2) => f(x, d).replace(/,/g, '{,}');
  const pct = (x, d = 2) => f(x * 100, d) + ' %';
  const pt = (x, d = 2) => ft(x * 100, d) + '\\%';
  const sgn = (x, tol = 1e-9) => (x > tol ? '↑' : x < -tol ? '↓' : '=');
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const randInt = (R, a, b) => a + Math.floor(R() * (b - a + 1));
  const pick = (R, arr) => arr[Math.floor(R() * arr.length)];
  const shuffle = (R, arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function table(head, rows, opts = {}) {
    let s = '<div class="tbl-wrap"><table>';
    if (head) s += '<thead><tr>' + head.map((x) => `<th>${x}</th>`).join('') + '</tr></thead>';
    s += '<tbody>' + rows.map((r) => '<tr>' + r.map((x) => `<td>${x}</td>`).join('') + '</tr>').join('') + '</tbody></table></div>';
    return s;
  }
  App.h = { f, ft, pct, pt, sgn, rng, randInt, pick, shuffle, table, esc };

  /* ============================== progreso ============================== */
  const Store = {
    key: 'eco2-cuaderno-v1',
    d: { cards: {}, lessons: {}, quiz: {}, ex: {}, last: '', all: false },
    load() {
      try { const raw = localStorage.getItem(this.key); if (raw) Object.assign(this.d, JSON.parse(raw)); } catch (e) { /* sin almacenamiento */ }
    },
    save() { try { localStorage.setItem(this.key, JSON.stringify(this.d)); } catch (e) { /* sin almacenamiento */ } },
  };
  App.Store = Store;

  /* ============================== matemática ============================== */
  function wrapTables(el) {
    $$('table', el).forEach((t) => {
      if (t.closest('.tbl-wrap, .w-out, .arrows')) return;
      const w = document.createElement('div'); w.className = 'tbl-wrap';
      t.parentElement.insertBefore(w, t); w.appendChild(t);
    });
  }
  function renderMath(el) {
    if (el) wrapTables(el);
    if (!el || !window.renderMathInElement) return;
    try {
      window.renderMathInElement(el, {
        delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }],
        output: 'mathml', throwOnError: false, strict: false,
        ignoredClasses: ['no-math'],
      });
    } catch (e) { /* deja el texto crudo */ }
    $$('math[display="block"]', el).forEach((m) => {
      if (!m.parentElement.classList.contains('math-block')) {
        const w = document.createElement('div'); w.className = 'math-block';
        m.parentElement.insertBefore(w, m); w.appendChild(m);
      }
    });
  }
  App.renderMath = renderMath;

  function toast(msg) {
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; t.setAttribute('role', 'status');
    document.body.appendChild(t); setTimeout(() => t.remove(), 2600);
  }

  /* ============================== gráficos (SVG) ============================== */
  const NS = 'http://www.w3.org/2000/svg';
  let uid = 0;
  function Plot(opt) {
    const o = Object.assign({ w: 440, h: 300, ml: 48, mr: 20, mt: 18, mb: 40, xmin: 0, xmax: 10, ymin: 0, ymax: 10, xl: '', yl: '' }, opt);
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${o.w} ${o.h}`);
    svg.setAttribute('class', 'plot');
    svg.setAttribute('role', 'img');
    if (o.aria) svg.setAttribute('aria-label', o.aria);
    const iw = o.w - o.ml - o.mr, ih = o.h - o.mt - o.mb;
    const sx = (x) => o.ml + ((x - o.xmin) / (o.xmax - o.xmin)) * iw;
    const sy = (y) => o.mt + ih - ((y - o.ymin) / (o.ymax - o.ymin)) * ih;
    function add(tag, a, parent) {
      const e = document.createElementNS(NS, tag);
      for (const k in a) e.setAttribute(k, a[k]);
      (parent || svg).appendChild(e);
      return e;
    }
    const cid = 'pc' + ++uid;
    const defs = add('defs', {});
    const cp = add('clipPath', { id: cid }, defs);
    add('rect', { x: o.ml, y: o.mt - 2, width: iw + 2, height: ih + 2 }, cp);
    const gBase = add('g', {});
    const gArea = add('g', { 'clip-path': `url(#${cid})` });
    const gCurve = add('g', { 'clip-path': `url(#${cid})` });
    const gTop = add('g', {});
    const P = {
      svg, o, sx, sy, iw, ih,
      axes() {
        const x0 = o.ml, y0 = o.mt + ih;
        add('line', { x1: x0, y1: y0, x2: x0 + iw + 8, y2: y0, class: 'ax' }, gBase);
        add('line', { x1: x0, y1: y0, x2: x0, y2: o.mt - 8, class: 'ax' }, gBase);
        add('path', { d: `M${x0 + iw + 8},${y0} l-7,-4 v8 z`, fill: 'currentColor', class: 'ax', style: 'fill:var(--ink)' }, gBase);
        add('path', { d: `M${x0},${o.mt - 8} l-4,7 h8 z`, class: 'ax', style: 'fill:var(--ink)' }, gBase);
        if (o.xl) { const t = add('text', { x: x0 + iw + 4, y: y0 + 30, 'text-anchor': 'end', class: 'lbl-ax' }, gTop); t.textContent = o.xl; }
        if (o.yl) { const t = add('text', { x: x0 + 6, y: o.mt - 4, 'text-anchor': 'start', class: 'lbl-ax' }, gTop); t.textContent = o.yl; }
        return P;
      },
      line(x1, y1, x2, y2, cls = 'c-k') { add('line', { x1: sx(x1), y1: sy(y1), x2: sx(x2), y2: sy(y2), class: cls }, gCurve); return P; },
      hline(y, cls = 'guide') { return P.line(o.xmin, y, o.xmax, y, cls); },
      vline(x, cls = 'guide') { return P.line(x, o.ymin, x, o.ymax, cls); },
      fn(fun, a, b, cls = 'c-k', n = 160) {
        let d = '', pen = false;
        const span = o.ymax - o.ymin;
        for (let i = 0; i <= n; i++) {
          const x = a + ((b - a) * i) / n; let y = fun(x);
          if (!isFinite(y)) { pen = false; continue; }
          y = Math.max(o.ymin - 4 * span, Math.min(o.ymax + 4 * span, y));
          d += (pen ? 'L' : 'M') + sx(x).toFixed(2) + ',' + sy(y).toFixed(2); pen = true;
        }
        if (d) add('path', { d, class: cls }, gCurve);
        return P;
      },
      pts(arr, cls = 'c-k') { if (arr.length) add('polyline', { points: arr.map((p) => sx(p[0]).toFixed(2) + ',' + sy(p[1]).toFixed(2)).join(' '), class: cls, fill: 'none' }, gCurve); return P; },
      poly(arr, cls = 'a-b') { add('polygon', { points: arr.map((p) => sx(p[0]).toFixed(2) + ',' + sy(p[1]).toFixed(2)).join(' '), class: cls }, gArea); return P; },
      rect(x1, y1, x2, y2, cls = 'a-b') { add('rect', { x: Math.min(sx(x1), sx(x2)), y: Math.min(sy(y1), sy(y2)), width: Math.abs(sx(x2) - sx(x1)), height: Math.abs(sy(y2) - sy(y1)), class: cls }, gArea); return P; },
      dot(x, y, cls = 'd-b', r = 4.5) { add('circle', { cx: sx(x), cy: sy(y), r, class: cls }, gTop); return P; },
      text(x, y, s, cls = '', anchor = 'start', dx = 0, dy = 0) { const t = add('text', { x: sx(x) + dx, y: sy(y) + dy, 'text-anchor': anchor, class: cls }, gTop); t.textContent = s; return P; },
      guide(x, y, cls = 'guide') { add('polyline', { points: `${sx(o.xmin)},${sy(y)} ${sx(x)},${sy(y)} ${sx(x)},${sy(o.ymin)}`, class: cls, fill: 'none' }, gCurve); return P; },
      tickX(x, s, cls = 'lbl-ax') { add('line', { x1: sx(x), y1: sy(o.ymin), x2: sx(x), y2: sy(o.ymin) + 5, class: 'ax' }, gBase); const t = add('text', { x: sx(x), y: sy(o.ymin) + 17, 'text-anchor': 'middle', class: cls }, gTop); t.textContent = s; return P; },
      tickY(y, s, cls = 'lbl-ax') { add('line', { x1: sx(o.xmin) - 5, y1: sy(y), x2: sx(o.xmin), y2: sy(y), class: 'ax' }, gBase); const t = add('text', { x: sx(o.xmin) - 8, y: sy(y) + 4, 'text-anchor': 'end', class: cls }, gTop); t.textContent = s; return P; },
      bar(x, w, y, cls = 'bar-b') { add('rect', { x: sx(x - w / 2), y: sy(Math.max(0, y)), width: Math.abs(sx(x + w / 2) - sx(x - w / 2)), height: Math.abs(sy(0) - sy(y)), class: cls }, gArea); return P; },
    };
    return P;
  }
  App.Plot = Plot;

  /* ============================== controles ============================== */
  let ctl = 0;
  function slider(host, o, cb) {
    const id = 'ctl' + ++ctl;
    const wrap = document.createElement('label');
    wrap.className = 'sl'; wrap.htmlFor = id;
    const fm = o.fmt || ((v) => f(v, 2));
    wrap.innerHTML = `<span class="nm">${o.label}</span><output for="${id}"></output><input type="range" id="${id}" min="${o.min}" max="${o.max}" step="${o.step}" value="${o.value}">`;
    const inp = $('input', wrap), out = $('output', wrap);
    out.textContent = fm(+o.value);
    inp.addEventListener('input', () => { out.textContent = fm(+inp.value); cb && cb(); });
    host.appendChild(wrap);
    return { get: () => +inp.value, set(v) { inp.value = v; out.textContent = fm(+inp.value); }, el: wrap };
  }
  function seg(host, opts, val, cb) {
    const w = document.createElement('div'); w.className = 'seg'; w.setAttribute('role', 'group');
    let cur = val;
    opts.forEach(([v, lbl]) => {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = lbl; b.dataset.v = v;
      if (v === cur) b.classList.add('on');
      b.setAttribute('aria-pressed', v === cur ? 'true' : 'false');
      b.addEventListener('click', () => { cur = v; $$('button', w).forEach((x) => { x.classList.toggle('on', x.dataset.v === v); x.setAttribute('aria-pressed', x.dataset.v === v ? 'true' : 'false'); }); cb && cb(v); });
      w.appendChild(b);
    });
    host.appendChild(w);
    return { get: () => cur, set(v) { cur = v; $$('button', w).forEach((x) => x.classList.toggle('on', x.dataset.v === v)); }, el: w };
  }
  function shell(el, title, extra = '') {
    el.innerHTML = `<div class="widget-h"><span>${title}</span>${extra}</div><div class="w-grid"><div class="w-plot"></div><div class="ctrls"></div></div>`;
    return { pl: $('.w-plot', el), c: $('.ctrls', el) };
  }
  function outBox(host) { const d = document.createElement('div'); d.className = 'w-out'; host.appendChild(d); return d; }
  function btn(host, label, cb, cls = 'btn small') { const b = document.createElement('button'); b.type = 'button'; b.className = cls; b.textContent = label; b.addEventListener('click', cb); host.appendChild(b); return b; }
  App.ui = { slider, seg, shell, outBox, btn };

  const W = App.W;

  /* ---------- 1. Flujo vs stock: la bañadera del capital ---------- */
  W.stock = (el) => {
    const { pl, c } = shell(el, 'Flujo y stock: la bañadera del capital');
    const sI = slider(c, { label: 'Inversión por año (entra)', min: 0, max: 20, step: 1, value: 8, fmt: (v) => f(v, 0) }, draw);
    const sd = slider(c, { label: 'Depreciación δ (sale)', min: 0, max: 0.3, step: 0.01, value: 0.1, fmt: (v) => pct(v, 0) }, draw);
    const out = outBox(c);
    function draw() {
      const I = sI.get(), d = sd.get();
      let K = 50; const ks = [K];
      for (let t = 1; t <= 12; t++) { K = K + I - d * K; ks.push(K); }
      const ss = d > 0 ? I / d : null;
      const ymax = Math.max(60, ...ks, ss && ss < 400 ? ss : 0) * 1.12;
      const P = Plot({ xmin: -0.7, xmax: 12.7, ymin: 0, ymax, xl: 'año', yl: 'stock de capital K', aria: 'Evolución del stock de capital' }).axes();
      ks.forEach((k, t) => P.bar(t, 0.62, k, t === 0 ? 'bar-m' : 'bar-b'));
      [0, 3, 6, 9, 12].forEach((t) => P.tickX(t, String(t)));
      P.tickY(50, '50');
      if (ss && ss < ymax) { P.hline(ss, 'c-rd'); P.text(12.6, ss, 'K = I/δ', 'lbl-r', 'end', 0, -6); }
      pl.innerHTML = ''; pl.appendChild(P.svg);
      out.innerHTML = `Arrancás con <b>K = 50</b> (stock). Cada año entran <b>${f(I, 0)}</b> de inversión y se pierde <b>${pct(d, 0)}</b> del stock por depreciación (flujos).<br>En el año 12 el stock es <b>${f(ks[12], 1)}</b>.` +
        (ss ? ` Con estos flujos el stock se estabiliza en <b>I/δ = ${f(ss, 1)}</b>.` : ' Sin depreciación, el stock crece para siempre.');
    }
    draw();
  };

  /* ---------- 2. Crecimiento compuesto vs suma de tasas ---------- */
  W.growth = (el) => {
    const { pl, c } = shell(el, 'Suma de tasas vs tasa acumulada');
    const sg = slider(c, { label: 'Tasa anual g', min: 0, max: 0.6, step: 0.01, value: 0.1, fmt: (v) => pct(v, 0) }, draw);
    const sn = slider(c, { label: 'Cantidad de años', min: 2, max: 10, step: 1, value: 5, fmt: (v) => f(v, 0) }, draw);
    const out = outBox(c);
    function draw() {
      const g = sg.get(), n = sn.get();
      const comp = Math.pow(1 + g, n) - 1, sum = n * g;
      const ymax = Math.max(0.2, comp) * 1.15 * 100;
      const P = Plot({ xmin: 0, xmax: n, ymin: 0, ymax, xl: 'años', yl: 'crecimiento acumulado (%)' }).axes();
      P.fn((t) => (Math.pow(1 + g, t) - 1) * 100, 0, n, 'c-b');
      P.fn((t) => t * g * 100, 0, n, 'c-m');
      P.dot(n, comp * 100, 'd-b').dot(n, sum * 100, 'd-m');
      P.text(n, comp * 100, 'acumulada ' + f(comp * 100, 1) + '%', 'lbl-b', 'end', -8, -8);
      P.text(n, sum * 100, 'suma ' + f(sum * 100, 1) + '%', 'lbl-m', 'end', -8, 16);
      for (let t = 0; t <= n; t++) P.tickX(t, String(t));
      pl.innerHTML = ''; pl.appendChild(P.svg);
      out.innerHTML = `<table><tr><td>Suma de tasas (n·g)</td><td>${pct(sum, 1)}</td></tr><tr><td>Tasa acumulada (1+g)<sup>n</sup>−1</td><td>${pct(comp, 1)}</td></tr><tr><td><b>Diferencia</b></td><td><b>${pct(comp - sum, 1)}</b></td></tr></table><p style="margin:8px 0 0">La diferencia es el <mark>interés compuesto</mark>: cada año crecés sobre lo que ya creciste. Con tasas chicas casi no se nota; con tasas grandes o muchos años, sí.</p>`;
    }
    draw();
  };

  /* ---------- 3. Regla del producto: el rectángulo P×Q ---------- */
  W.rect = (el) => {
    const { pl, c } = shell(el, 'Por qué gV ≈ gP + gQ (y cuándo falla)');
    const sq = slider(c, { label: 'Crecimiento de la cantidad gQ', min: 0, max: 0.6, step: 0.01, value: 0.08, fmt: (v) => pct(v, 0) }, draw);
    const sp = slider(c, { label: 'Crecimiento del precio gP', min: 0, max: 0.6, step: 0.01, value: 0.2, fmt: (v) => pct(v, 0) }, draw);
    const out = outBox(c);
    function draw() {
      const gq = sq.get(), gp = sp.get();
      const P = Plot({ w: 380, h: 320, xmin: 0, xmax: 1.75, ymin: 0, ymax: 1.75, xl: 'cantidad Q', yl: 'precio P', ml: 40 }).axes();
      P.rect(0, 0, 1, 1, 'a-x');
      P.rect(1, 0, 1 + gq, 1, 'a-b');
      P.rect(0, 1, 1, 1 + gp, 'a-g');
      P.rect(1, 1, 1 + gq, 1 + gp, 'a-y');
      P.pts([[0, 1 + gp], [1 + gq, 1 + gp], [1 + gq, 0]], 'c-k c-thin');
      P.pts([[0, 1], [1, 1], [1, 0]], 'c-m');
      P.text(0.5, 0.5, 'valor inicial = 1', 'lbl-m', 'middle');
      if (gq > 0.06) P.text(1 + gq / 2, 0.5, 'gQ', 'lbl-b', 'middle');
      if (gp > 0.06) P.text(0.5, 1 + gp / 2, 'gP', 'lbl-g', 'middle', 0, 4);
      if (gq > 0.1 && gp > 0.1) P.text(1 + gq / 2, 1 + gp / 2, 'gQ·gP', 'lbl-k', 'middle', 0, 4);
      P.tickX(1, '1').tickY(1, '1');
      pl.innerHTML = ''; pl.appendChild(P.svg);
      const ex = (1 + gq) * (1 + gp) - 1;
      out.innerHTML = `<table><tr><td>gQ + gP (aproximación)</td><td>${pct(gq + gp, 2)}</td></tr><tr><td>Crecimiento exacto del valor</td><td>${pct(ex, 2)}</td></tr><tr><td><b>Discrepancia = gQ·gP</b></td><td><b>${pct(gq * gp, 2)}</b></td></tr></table><p style="margin:8px 0 0">El valor de la producción es el área P×Q. Las franjas azul y verde son la aproximación; el <mark>cuadradito amarillo</mark> es lo que la aproximación se olvida. Crece cuando las dos tasas son grandes.</p>`;
    }
    draw();
  };

  /* ---------- 4. Cadena de valor agregado ---------- */
  W.chain = (el) => {
    el.innerHTML = `<div class="widget-h"><span>Valor agregado: trigo → harina → pan</span></div><div class="w-grid"><div class="w-plot"></div><div class="ctrls"></div></div>`;
    const pl = $('.w-plot', el), c = $('.ctrls', el);
    const sT = slider(c, { label: 'Ventas del productor de trigo al molino', min: 10, max: 60, step: 5, value: 30, fmt: (v) => f(v, 0) }, draw);
    const sH = slider(c, { label: 'Ventas del molino (harina) a la panadería', min: 40, max: 110, step: 5, value: 70, fmt: (v) => f(v, 0) }, draw);
    const sP = slider(c, { label: 'Ventas de pan a los consumidores', min: 90, max: 200, step: 5, value: 120, fmt: (v) => f(v, 0) }, draw);
    const out = outBox(c);
    function draw() {
      let t = sT.get(), hh = Math.max(sH.get(), t), p = Math.max(sP.get(), hh);
      const va = [t, hh - t, p - hh];
      const P = Plot({ w: 420, h: 300, xmin: 0, xmax: 3, ymin: 0, ymax: Math.max(400, t + hh + p) * 1.05, xl: '', yl: 'pesos' }).axes();
      // barra 1: suma de ventas (doble conteo)
      let acc = 0; [[t, 'bar-m'], [hh, 'bar-m'], [p, 'bar-m']].forEach(([v, cl], i) => { P.rect(0.4, acc, 1.2, acc + v, i === 0 ? 'a-x' : i === 1 ? 'a-r' : 'a-x'); acc += v; });
      P.text(0.8, acc, 'suma de ventas ' + f(acc, 0), 'lbl-r', 'middle', 0, -8);
      acc = 0; va.forEach((v, i) => { P.rect(1.8, acc, 2.6, acc + v, ['a-g', 'a-b', 'a-y'][i]); acc += v; });
      P.text(2.2, acc, 'PBI ' + f(acc, 0), 'lbl-g', 'middle', 0, -8);
      P.text(0.8, -0, 'mal: doble conteo', 'lbl-m', 'middle', 0, 16).text(2.2, 0, 'bien: suma de VA', 'lbl-m', 'middle', 0, 16);
      pl.innerHTML = ''; pl.appendChild(P.svg);
      out.innerHTML = `<table><tr><th>Etapa</th><th>Ventas</th><th>Insumos</th><th>VA</th></tr><tr><td>Trigo</td><td>${t}</td><td>0</td><td>${va[0]}</td></tr><tr><td>Harina</td><td>${hh}</td><td>${t}</td><td>${va[1]}</td></tr><tr><td>Pan</td><td>${p}</td><td>${hh}</td><td>${va[2]}</td></tr><tr><td><b>Total</b></td><td>${t + hh + p}</td><td></td><td><b>${p}</b></td></tr></table><p style="margin:8px 0 0">La suma de valores agregados da <mark>exactamente el valor del bien final</mark> (${p}). Sumar todas las ventas cuenta el trigo tres veces.</p>`;
    }
    draw();
  };

  /* ---------- 5. PBI nominal, real, deflactor e IPC ---------- */
  W.deflator = (el) => {
    el.innerHTML = `<div class="widget-h"><span>Peras y manzanas: ¿crecimos o subieron los precios?</span></div><div class="ctrls"></div><div class="w-out" style="margin-top:10px"></div>`;
    const c = $('.ctrls', el), out = $('.w-out', el);
    const data = { b: { pp: 5, pm: 4, qp: 1000, qm: 5000 }, A: { pp: 7.5, pm: 6, qp: 800, qm: 4000 }, B: { pp: 3.5, pm: 2.5, qp: 1600, qm: 9760 } };
    seg(c, [['A', 'Caso A'], ['B', 'Caso B']], 'A', draw);
    function draw(k = 'A') {
      const b = data.b, x = data[k];
      const n0 = b.pp * b.qp + b.pm * b.qm, n1 = x.pp * x.qp + x.pm * x.qm;
      const r1 = b.pp * x.qp + b.pm * x.qm;
      const defl = (n1 / r1) * 100, ipc = ((x.pp * b.qp + x.pm * b.qm) / n0) * 100;
      out.innerHTML = `<div class="tbl-wrap"><table><tr><th></th><th>2007 (base)</th><th>2008 · caso ${k}</th></tr>
      <tr><td>Precio pera / manzana</td><td>${f(b.pp)} / ${f(b.pm)}</td><td>${f(x.pp)} / ${f(x.pm)}</td></tr>
      <tr><td>Kilos pera / manzana</td><td>${f(b.qp, 0)} / ${f(b.qm, 0)}</td><td>${f(x.qp, 0)} / ${f(x.qm, 0)}</td></tr>
      <tr><td>PBI nominal (Σ p<sub>t</sub>·q<sub>t</sub>)</td><td>${f(n0, 0)}</td><td>${f(n1, 0)} <span class="chip">${pct(n1 / n0 - 1, 0)}</span></td></tr>
      <tr><td>PBI real a precios 2007 (Σ p<sub>2007</sub>·q<sub>t</sub>)</td><td>${f(n0, 0)}</td><td>${f(r1, 0)} <span class="chip ${r1 > n0 ? 'ok' : 'warn'}">${pct(r1 / n0 - 1, 1)}</span></td></tr>
      <tr><td>Deflactor = nominal / real × 100</td><td>100</td><td>${f(defl, 1)}</td></tr>
      <tr><td>IPC (canasta fija 2007)</td><td>100</td><td>${f(ipc, 1)}</td></tr></table></div>
      <p style="margin:8px 0 0">En los dos casos el PBI nominal sube 20 %. Pero en el caso A <mark>${k === 'A' ? 'subieron los precios y cayeron las cantidades' : 'cayeron los precios y subieron mucho las cantidades'}</mark>. Por eso el crecimiento se mide con el PBI <b>real</b>.</p>`;
    }
    draw('A');
  };

  /* ---------- 6. Consumo–ocio con efecto sustitución e ingreso (Hicks) ---------- */
  const PREF = { es: { sig: 1.5, a: 0.3, lbl: 'Domina el efecto sustitución' }, ei: { sig: 0.5, a: 0.85, lbl: 'Domina el efecto ingreso' } };
  function cesDem(w, P, M, pr) {
    const s = pr.sig, a = pr.a;
    const D = Math.pow(a, s) * Math.pow(P, 1 - s) + Math.pow(1 - a, s) * Math.pow(w, 1 - s);
    return { c: (M * Math.pow(a, s) * Math.pow(P, -s)) / D, o: (M * Math.pow(1 - a, s) * Math.pow(w, -s)) / D };
  }
  function cesU(c, o, pr) { const rho = 1 - 1 / pr.sig; return Math.pow(pr.a * Math.pow(c, rho) + (1 - pr.a) * Math.pow(o, rho), 1 / rho); }
  function cesIC(U, pr) { const rho = 1 - 1 / pr.sig; return (o) => { const z = (Math.pow(U, rho) - (1 - pr.a) * Math.pow(o, rho)) / pr.a; return z > 0 ? Math.pow(z, 1 / rho) : NaN; }; }
  function ocioSolve(s, pr) {
    const M = s.w * s.N + s.B; let d = cesDem(s.w, s.P, M, pr); let corner = false;
    if (d.o > s.N) { d = { o: s.N, c: s.B / s.P }; corner = true; }
    return { c: d.c, o: d.o, l: s.N - d.o, U: cesU(Math.max(d.c, 1e-6), d.o, pr), corner, M };
  }
  W.ocio = (el, opt) => {
    el.innerHTML = `<div class="widget-h"><span>Elección consumo–ocio</span></div>
      <div class="row" style="margin-bottom:10px"><span style="font-size:.85rem;color:var(--ink-2)">Probá un cambio:</span><span class="presets row"></span></div>
      <div class="w-grid"><div class="w-plot"></div><div class="ctrls"></div></div><div class="w-out wo2" style="margin-top:10px"></div>`;
    const pl = $('.w-plot', el), c = $('.ctrls', el), out = $('.wo2', el), pre = $('.presets', el);
    const base = { w: 10, P: 1, B: 20, N: 16 };
    let init = Object.assign({}, base);
    let pk = 'es';
    const sw = slider(c, { label: 'Salario nominal w', min: 2, max: 30, step: 0.5, value: 10 }, draw);
    const sP = slider(c, { label: 'Precio del consumo P', min: 0.5, max: 3.5, step: 0.05, value: 1 }, draw);
    const sB = slider(c, { label: 'Ingreso no laboral B', min: 0, max: 100, step: 1, value: 20, fmt: (v) => f(v, 0) }, draw);
    const sN = slider(c, { label: 'Horas disponibles N', min: 10, max: 24, step: 1, value: 16, fmt: (v) => f(v, 0) }, draw);
    seg(c, [['es', 'ES domina'], ['ei', 'EI domina']], 'es', (v) => { pk = v; draw(); });
    const bb = document.createElement('div'); bb.className = 'row'; c.appendChild(bb);
    btn(bb, 'Fijar como inicial', () => { init = cur(); draw(); });
    btn(bb, 'Volver al inicio', () => { init = Object.assign({}, base); set(base); draw(); });
    const cases = [['Sube P', { P: 1.5 }], ['Sube w', { w: 15 }], ['P +200% y w +100%', { P: 3, w: 20 }], ['Sube B', { B: 60 }], ['Sube N', { N: 20 }]];
    cases.forEach(([lbl, ch]) => btn(pre, lbl, () => { init = Object.assign({}, base); set(Object.assign({}, base, ch)); draw(); }));
    function cur() { return { w: sw.get(), P: sP.get(), B: sB.get(), N: sN.get() }; }
    function set(s) { sw.set(s.w); sP.set(s.P); sB.set(s.B); sN.set(s.N); }
    if (opt && opt.includes('=')) { const ch = {}; opt.split(';').forEach((kv) => { const [k, v] = kv.split('='); ch[k.trim()] = +v; }); set(Object.assign({}, base, ch)); }
    else if (opt && cases[+opt]) { set(Object.assign({}, base, cases[+opt][1])); }
    function draw() {
      const pr = PREF[pk], s = cur();
      const A = ocioSolve(init, pr), B = ocioSolve(s, pr);
      const samePrice = Math.abs(s.w / s.P - init.w / init.P) < 1e-9;
      let H;
      if (samePrice) H = { c: A.c, o: A.o, l: A.l };
      else {
        const v = cesU(cesDem(s.w, s.P, 1, pr).c, cesDem(s.w, s.P, 1, pr).o, pr);
        const MH = A.U / v; const d = cesDem(s.w, s.P, MH, pr);
        H = { c: d.c, o: d.o, l: s.N - d.o, MH };
      }
      const ymax = Math.max((init.w * init.N + init.B) / init.P, (s.w * s.N + s.B) / s.P, A.c, B.c, H.c) * 1.12;
      const xmax = Math.max(init.N, s.N) + 3;
      const Pl = Plot({ ml: 78, xmin: 0, xmax, ymin: 0, ymax, xl: 'ocio o (horas)', yl: 'consumo c' }).axes();
      const changed = JSON.stringify(s) !== JSON.stringify(init);
      // restricción inicial
      if (changed) {
        Pl.pts([[0, (init.w * init.N + init.B) / init.P], [init.N, init.B / init.P], [init.N, 0]], 'c-m');
        Pl.fn(cesIC(A.U, pr), 0.05, xmax, 'c-m c-thin');
      }
      Pl.pts([[0, (s.w * s.N + s.B) / s.P], [s.N, s.B / s.P], [s.N, 0]], 'c-b');
      Pl.fn(cesIC(B.U, pr), 0.05, xmax, 'c-bd');
      if (changed && !samePrice && !A.corner) {
        const MH = H.MH; Pl.line(0, MH / s.P, MH / s.w, 0, 'c-rd');
        Pl.dot(H.o, H.c, 'd-r'); Pl.text(H.o, H.c, 'H', 'lbl-r', 'start', 7, -6);
      }
      if (changed) { Pl.dot(A.o, A.c, 'd-m'); Pl.text(A.o, A.c, 'A', 'lbl-m', 'end', -7, -6); }
      Pl.guide(B.o, B.c); Pl.dot(B.o, B.c, 'd-b'); Pl.text(B.o, B.c, changed ? 'B' : 'E', 'lbl-b', 'start', 7, -6);
      Pl.tickX(s.N, 'N'); Pl.tickY((s.w * s.N + s.B) / s.P, '(wN+B)/P');
      if (s.B > 0) Pl.tickY(s.B / s.P, 'B/P');
      pl.innerHTML = ''; pl.appendChild(Pl.svg);
      const row = (n, a, h, b) => `<tr><td>${n}</td><td>${f(a, 1)}</td>${changed ? `<td>${samePrice ? '—' : f(h, 1)}</td><td>${f(b, 1)}</td><td>${samePrice ? '=' : sgn(h - a, 0.05)}</td><td>${samePrice ? sgn(b - a, 0.05) : sgn(b - h, 0.05)}</td><td><b>${sgn(b - a, 0.05)}</b></td>` : ''}</tr>`;
      out.innerHTML = `<div class="tbl-wrap"><table><tr><th></th><th>${changed ? 'A (inicial)' : 'Óptimo E'}</th>${changed ? '<th>H (Hicks)</th><th>B (final)</th><th>ES</th><th>EI</th><th>ET</th>' : ''}</tr>${row('Consumo c', A.c, H.c, B.c)}${row('Ocio o', A.o, H.o, B.o)}${row('Trabajo l = N − o', A.l, H.l, B.l)}</table></div>
      <p style="margin:8px 0 0">Pendiente de la restricción: <b>−w/P = −${f(s.w / s.P)}</b> (precio del ocio en unidades de consumo). ${B.corner ? '<b>Solución de esquina:</b> con estos números no le conviene trabajar.' : ''} ${changed ? (samePrice ? 'El precio relativo w/P no cambió: <mark>sólo hay efecto ingreso</mark> (desplazamiento paralelo).' : 'La recta roja punteada es la restricción compensada: precios nuevos, utilidad vieja. <mark>A→H es el efecto sustitución, H→B el efecto ingreso.</mark>') : 'Mové un control o elegí un caso arriba para comparar.'}</p>`;
    }
    draw();
  };

  /* ---------- 7. Demanda de trabajo: función de producción y PML ---------- */
  W.pml = (el) => {
    const { pl, c } = shell(el, 'La firma contrata hasta PML = w/P');
    const sA = slider(c, { label: 'Productividad A', min: 0.5, max: 2, step: 0.05, value: 1 }, draw);
    const sK = slider(c, { label: 'Capital K', min: 25, max: 300, step: 5, value: 100, fmt: (v) => f(v, 0) }, draw);
    const sa = slider(c, { label: 'α (participación del capital)', min: 0.2, max: 0.8, step: 0.05, value: 0.5 }, draw);
    const sw = slider(c, { label: 'Salario real w/P', min: 0.15, max: 1.5, step: 0.01, value: 0.5 }, draw);
    const out = outBox(c);
    function draw() {
      const A = sA.get(), K = sK.get(), a = sa.get(), wp = sw.get();
      const Y = (L) => A * Math.pow(K, a) * Math.pow(L, 1 - a);
      const PML = (L) => (1 - a) * A * Math.pow(K, a) * Math.pow(L, -a);
      const Ls = K * Math.pow(((1 - a) * A) / wp, 1 / a);
      const Lmax = 300;
      const top = Plot({ h: 230, mb: 26, xmin: 0, xmax: Lmax, ymin: 0, ymax: Math.max(Y(Lmax), 60) * 1.08, xl: '', yl: 'Y = F(K, L)' }).axes();
      top.fn(Y, 0, Lmax, 'c-k');
      if (Ls < Lmax) { const y0 = Y(Ls); top.line(Ls - 60, y0 - 60 * wp, Ls + 60, y0 + 60 * wp, 'c-rd'); top.guide(Ls, y0); top.dot(Ls, y0, 'd-b'); top.text(Ls, y0, 'pendiente = PML = w/P', 'lbl-r', 'start', 8, 16); }
      const bot = Plot({ h: 230, mt: 10, xmin: 0, xmax: Lmax, ymin: 0, ymax: 2, xl: 'L', yl: 'PML, w/P' }).axes();
      bot.fn(PML, 1, Lmax, 'c-b');
      bot.hline(wp, 'c-r'); bot.text(Lmax, wp, 'w/P', 'lbl-r', 'end', -4, -6);
      if (Ls < Lmax) { bot.guide(Ls, wp); bot.dot(Ls, wp, 'd-b'); bot.tickX(Ls, 'L* = ' + f(Ls, 0)); }
      bot.text(30, PML(30), 'PML = demanda de trabajo', 'lbl-b', 'start', 8, -6);
      pl.innerHTML = ''; pl.appendChild(top.svg); pl.appendChild(bot.svg);
      out.innerHTML = Ls < Lmax ? `<table><tr><td>Trabajo óptimo L*</td><td><b>${f(Ls, 1)}</b></td></tr><tr><td>Producción Y*</td><td>${f(Y(Ls), 1)}</td></tr><tr><td>Masa salarial (w/P)·L</td><td>${f(wp * Ls, 1)}</td></tr><tr><td>Participación del trabajo wL/PY</td><td>${f((wp * Ls) / Y(Ls), 3)} = 1 − α</td></tr></table><p style="margin:8px 0 0">A la izquierda de L*, PML &gt; w/P: contratar uno más <mark>suma beneficio</mark>. A la derecha, resta. Subí K o A: la PML se corre a la derecha y la firma contrata más.</p>` : '<p>Con este salario real tan bajo la firma querría contratar más de 300 unidades de trabajo. Subí w/P.</p>';
    }
    draw();
  };

  /* ---------- 8. Equilibrio en el mercado de trabajo ---------- */
  W.labor = (el, opt) => {
    el.innerHTML = `<div class="widget-h"><span>Mercado de trabajo y producto</span></div>
      <div class="row presets" style="margin-bottom:10px"></div><div class="w-grid"><div class="w-plot"></div><div class="ctrls"></div></div>`;
    const pl = $('.w-plot', el), c = $('.ctrls', el), pre = $('.presets', el);
    const b0 = { A: 1, K: 100, ls: 1, add: false };
    let s = Object.assign({}, b0);
    if (opt) opt.split(';').forEach((kv) => { const [k, v] = kv.split('='); if (k === 'add') s.add = v === '1'; else if (k) s[k.trim()] = +v; });
    const fm = seg(c, [['cd', 'Cobb-Douglas AK^αL^(1−α)'], ['ad', 'Aditiva A(K^α + L^(1−α))']], s.add ? 'ad' : 'cd', (v) => { s.add = v === 'ad'; draw(); });
    const out = outBox(c);
    [['K↑ (más capital)', { K: 140 }], ['A↑ (mejor tecnología)', { A: 1.3 }], ['K↑ y A↑', { K: 140, A: 1.3 }], ['Más gente ofrece trabajo', { ls: 1.4 }], ['Shock adverso (A↓)', { A: 0.75 }], ['Volver al inicio', {}]].forEach(([l, ch]) => btn(pre, l, () => { s = Object.assign({}, b0, { add: s.add }, ch); draw(); }));
    const a = 0.5;
    const pml = (st) => (L) => (st.add ? (1 - a) * st.A * Math.pow(L, -a) * 10 : (1 - a) * st.A * Math.pow(st.K, a) * Math.pow(L, -a));
    const Yf = (st) => (L) => (st.add ? st.A * (Math.pow(st.K, a) + 10 * Math.pow(L, 1 - a) * 1) * 1 : st.A * Math.pow(st.K, a) * Math.pow(L, 1 - a));
    const Lsup = (st) => (w) => st.ls * 160 * w; // oferta: L = 160·ls·(w/P)
    function eq(st) {
      let lo = 0.01, hi = 5;
      for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; const L = Lsup(st)(m); const ex = pml(st)(L) - m; if (ex > 0) lo = m; else hi = m; }
      const w = (lo + hi) / 2, L = Lsup(st)(w); return { w, L, Y: Yf(st)(L) };
    }
    function draw() {
      const e0 = eq(Object.assign({}, b0, { add: s.add })), e1 = eq(s);
      const changed = JSON.stringify(Object.assign({}, s, { add: 0 })) !== JSON.stringify(Object.assign({}, b0, { add: 0 }));
      const Lmax = 200;
      const top = Plot({ h: 220, mb: 24, xmin: 0, xmax: Lmax, ymin: 0, ymax: 230, yl: 'Y' }).axes();
      if (changed) top.fn(Yf(Object.assign({}, b0, { add: s.add })), 0.01, Lmax, 'c-m');
      top.fn(Yf(s), 0.01, Lmax, 'c-b');
      if (changed) { top.dot(e0.L, e0.Y, 'd-m'); }
      top.guide(e1.L, e1.Y); top.dot(e1.L, e1.Y, 'd-b'); top.text(e1.L, e1.Y, 'Y*', 'lbl-b', 'start', 6, -6);
      const bot = Plot({ h: 240, mt: 10, xmin: 0, xmax: Lmax, ymin: 0, ymax: 1.6, xl: 'L', yl: 'w/P' }).axes();
      // distribución funcional
      const P1 = pml(s);
      const area = [[1, e1.w]]; for (let i = 0; i <= 60; i++) { const L = 1 + ((e1.L - 1) * i) / 60; area.push([L, Math.min(P1(L), 1.6)]); } area.push([e1.L, e1.w]);
      bot.poly(area, 'a-y'); bot.rect(0, 0, e1.L, e1.w, 'a-b');
      if (changed) { if (s.A !== b0.A || s.K !== b0.K) bot.fn(pml(Object.assign({}, b0, { add: s.add })), 1, Lmax, 'c-m'); if (s.ls !== b0.ls) bot.fn((L) => L / (160 * b0.ls), 0, Lmax, 'c-m'); }
      bot.fn(P1, 1, Lmax, 'c-b'); bot.fn((L) => L / (160 * s.ls), 0, Lmax, 'c-k');
      bot.text(Lmax, Lmax / (160 * s.ls), 'Ls', 'lbl-k', 'end', -4, -6).text(Lmax, P1(Lmax), 'Ld = PML', 'lbl-b', 'end', -4, -8);
      bot.guide(e1.L, e1.w); bot.dot(e1.L, e1.w, 'd-b');
      if (changed) bot.dot(e0.L, e0.w, 'd-m');
      bot.text(e1.L / 2, e1.w / 2, 'wL', 'lbl-b', 'middle');
      pl.innerHTML = ''; pl.appendChild(top.svg); pl.appendChild(bot.svg);
      const r = (n, x0, x1, d) => `<tr><td>${n}</td><td>${f(x0, d)}</td><td>${f(x1, d)}</td><td><b>${sgn(x1 - x0, 1e-3)}</b></td></tr>`;
      out.innerHTML = `<table><tr><th></th><th>Inicial</th><th>Ahora</th><th></th></tr>${r('Empleo L*', e0.L, e1.L, 1)}${r('Salario real (w/P)*', e0.w, e1.w, 3)}${r('Producto Y*', e0.Y, e1.Y, 1)}${r('Masa salarial wL/P', e0.w * e0.L, e1.w * e1.L, 1)}</table>
      <p style="margin:8px 0 0">Rectángulo azul: lo que cobran los trabajadores (wL). Zona amarilla: retribución al capital. ${s.add ? 'Con la función <b>aditiva</b>, la PML no depende de K: <mark>más capital sube Y pero no mueve el mercado de trabajo</mark>.' : 'Con Cobb-Douglas, más K o más A suben la PML y corren la demanda de trabajo.'}</p>`;
    }
    draw();
  };

  /* ---------- 9. Ecuación de Fisher ---------- */
  W.fisher = (el) => {
    el.innerHTML = `<div class="widget-h"><span>Calculadora de Fisher</span></div><div class="row" style="gap:16px"><label>Tasa nominal R (%) <input class="num-in" id="fR" type="number" value="60" step="1"></label><label>Inflación π (%) <input class="num-in" id="fP" type="number" value="50" step="1"></label></div><div class="w-out" style="margin-top:10px"></div>`;
    const R = $('#fR', el), Pi = $('#fP', el), out = $('.w-out', el);
    R.id = 'fR' + ++ctl; Pi.id = 'fP' + ++ctl;
    function draw() {
      const r = (1 + R.value / 100) / (1 + Pi.value / 100) - 1;
      out.innerHTML = `<table><tr><td>Tasa real exacta: (1+R)/(1+π) − 1</td><td class="big">${pct(r, 2)}</td></tr><tr><td>Aproximación R − π</td><td>${pct(R.value / 100 - Pi.value / 100, 2)}</td></tr></table><p style="margin:6px 0 0">Si depositás 100 pesos te devuelven ${f(100 * (1 + R.value / 100), 1)}, pero las cosas cuestan ${pct(Pi.value / 100, 0)} más: te alcanza para ${f(100 * (1 + r), 2)} unidades de lo que hoy compran 100. Con inflación alta, la aproximación <mark>se equivoca bastante</mark>.</p>`;
    }
    R.addEventListener('input', draw); Pi.addEventListener('input', draw); draw();
  };

  /* ---------- 10. Elección intertemporal ---------- */
  function interSolve(s) {
    const b = s.b;
    if (s.mode === 'rates') {
      const C1p = (s.Y1 + s.Y2 / (1 + s.rp)) / (1 + b);
      if (C1p <= s.Y1) return { C1: C1p, C2: b * (1 + s.rp) * C1p, tipo: 'ahorrista (usa la tasa pasiva)', rr: s.rp };
      const C1a = (s.Y1 + s.Y2 / (1 + s.ra)) / (1 + b);
      if (C1a >= s.Y1) return { C1: C1a, C2: b * (1 + s.ra) * C1a, tipo: 'deudor (usa la tasa activa)', rr: s.ra };
      return { C1: s.Y1, C2: s.Y2, tipo: 'ni ahorra ni pide (queda en la dotación, en el quiebre)', rr: null };
    }
    const W0 = s.Y1 + s.Y2 / (1 + s.r);
    let C1 = W0 / (1 + b), C2 = b * (1 + s.r) * C1, bind = false;
    if (s.mode === 'limit' && C1 > s.Y1 + s.M) { C1 = s.Y1 + s.M; C2 = s.Y2 - (1 + s.r) * s.M; bind = true; }
    const S = s.Y1 - C1;
    return { C1, C2, bind, tipo: S > 1e-6 ? 'ahorrista (acreedor)' : S < -1e-6 ? 'deudor' : 'ni ahorra ni pide', rr: s.r };
  }
  const lnU = (c1, c2, b) => Math.log(c1) + b * Math.log(c2);
  W.inter = (el, opt) => {
    el.innerHTML = `<div class="widget-h"><span>Consumo hoy vs mañana</span></div><div class="row modes" style="margin-bottom:10px"></div><div class="w-grid"><div class="w-plot"></div><div class="ctrls"></div></div><div class="w-out wo2" style="margin-top:10px"></div>`;
    const pl = $('.w-plot', el), c = $('.ctrls', el), out = $('.wo2', el), md = $('.modes', el);
    let mode = opt === 'limit' || opt === 'rates' ? opt : 'base';
    let init = null;
    const sY1 = slider(c, { label: 'Ingreso hoy Y1', min: 0, max: 200, step: 5, value: 100, fmt: (v) => f(v, 0) }, draw);
    const sY2 = slider(c, { label: 'Ingreso mañana Y2', min: 0, max: 200, step: 5, value: 110, fmt: (v) => f(v, 0) }, draw);
    const sr = slider(c, { label: 'Tasa real r', min: 0, max: 1, step: 0.01, value: 0.1, fmt: (v) => pct(v, 0) }, draw);
    const sb = slider(c, { label: 'Paciencia β (o b)', min: 0.3, max: 1, step: 0.01, value: 0.9 }, draw);
    const sM = slider(c, { label: 'Máximo que puede pedir M', min: 0, max: 100, step: 1, value: 10, fmt: (v) => f(v, 0) }, draw);
    const sra = slider(c, { label: 'Tasa activa ra (préstamos)', min: 0, max: 1, step: 0.01, value: 0.4, fmt: (v) => pct(v, 0) }, draw);
    const srp = slider(c, { label: 'Tasa pasiva rp (depósitos)', min: 0, max: 1, step: 0.01, value: 0.05, fmt: (v) => pct(v, 0) }, draw);
    const bb = document.createElement('div'); bb.className = 'row'; c.appendChild(bb);
    const bFix = btn(bb, 'Fijar como inicial', () => { init = cur(); draw(); });
    btn(bb, 'Borrar comparación', () => { init = null; draw(); });
    seg(md, [['base', 'Básico'], ['limit', 'Con límite de deuda'], ['rates', 'Tasa activa ≠ pasiva']], mode, (v) => { mode = v; init = null; draw(); });
    if (opt && opt.includes('=')) { const m = { Y1: sY1, Y2: sY2, r: sr, b: sb, M: sM, ra: sra, rp: srp }; opt.split(';').forEach((kv) => { const [k, v] = kv.split('='); if (m[k.trim()]) m[k.trim()].set(+v); }); }
    function cur() { return { Y1: sY1.get(), Y2: sY2.get(), r: sr.get(), b: sb.get(), M: sM.get(), ra: sra.get(), rp: srp.get(), mode }; }
    function draw() {
      const s = cur();
      sM.el.hidden = mode !== 'limit'; sra.el.hidden = srp.el.hidden = mode !== 'rates'; sr.el.hidden = mode === 'rates'; bFix.hidden = mode === 'rates';
      if (mode === 'limit') { const mx = s.Y2 / (1 + s.r); if (s.M > mx) { sM.set(Math.floor(mx)); s.M = sM.get(); } }
      const o = interSolve(s);
      const rLo = mode === 'rates' ? s.ra : s.r, rHi = mode === 'rates' ? s.rp : s.r;
      let xmax = s.Y1 + s.Y2 / (1 + rLo), ymax = s.Y2 + s.Y1 * (1 + rHi);
      let oi = null;
      if (init) { oi = interSolve(init); xmax = Math.max(xmax, init.Y1 + init.Y2 / (1 + init.r)); ymax = Math.max(ymax, init.Y2 + init.Y1 * (1 + init.r)); }
      xmax = Math.max(xmax, 20) * 1.08; ymax = Math.max(ymax, 20) * 1.08;
      const P = Plot({ xmin: 0, xmax, ymin: 0, ymax, xl: 'C1 (hoy)', yl: 'C2 (mañana)' }).axes();
      if (init && oi) {
        P.line(0, init.Y2 + init.Y1 * (1 + init.r), init.Y1 + init.Y2 / (1 + init.r), 0, 'c-m');
        P.fn((x) => Math.exp((lnU(oi.C1, oi.C2, init.b) - Math.log(x)) / init.b), 0.5, xmax, 'c-m c-thin');
        P.dot(oi.C1, oi.C2, 'd-m'); P.text(oi.C1, oi.C2, 'A', 'lbl-m', 'end', -7, -6);
      }
      if (mode === 'rates') {
        P.pts([[0, s.Y2 + s.Y1 * (1 + s.rp)], [s.Y1, s.Y2], [s.Y1 + s.Y2 / (1 + s.ra), 0]], 'c-b');
        P.line(0, s.Y2 + s.Y1 * (1 + s.rp), s.Y1 + s.Y2 / (1 + s.rp), 0, 'c-bd');
      } else {
        P.line(0, s.Y2 + s.Y1 * (1 + s.r), s.Y1 + s.Y2 / (1 + s.r), 0, 'c-b');
      }
      if (mode === 'limit') { const K = s.Y1 + s.M; P.rect(K, 0, xmax, ymax, 'a-r'); P.vline(K, 'c-r'); P.text(K, ymax * 0.92, 'C1 ≤ Y1 + M', 'lbl-r', 'start', 6, 0); }
      const U = lnU(Math.max(o.C1, 1e-6), Math.max(o.C2, 1e-6), s.b);
      P.fn((x) => Math.exp((U - Math.log(x)) / s.b), 0.5, xmax, 'c-bd');
      // Hicks
      let H = null;
      if (init && oi && mode === 'base' && init.mode === 'base' && init.Y1 === s.Y1 && init.Y2 === s.Y2 && init.b === s.b && init.r !== s.r) {
        const U0 = lnU(oi.C1, oi.C2, s.b);
        const WH = Math.exp((U0 - Math.log(1 / (1 + s.b)) - s.b * Math.log((s.b * (1 + s.r)) / (1 + s.b))) / (1 + s.b));
        H = { C1: WH / (1 + s.b), C2: (s.b * (1 + s.r) * WH) / (1 + s.b) };
        P.line(0, WH * (1 + s.r), WH, 0, 'c-rd'); P.dot(H.C1, H.C2, 'd-r'); P.text(H.C1, H.C2, 'H', 'lbl-r', 'start', 7, 12);
      }
      P.dot(s.Y1, s.Y2, 'd-k'); P.text(s.Y1, s.Y2, 'D (dotación)', 'lbl-k', 'start', 7, 14);
      P.guide(o.C1, o.C2); P.dot(o.C1, o.C2, 'd-b'); P.text(o.C1, o.C2, init ? 'B' : 'óptimo', 'lbl-b', 'start', 7, -7);
      pl.innerHTML = ''; pl.appendChild(P.svg);
      const S = s.Y1 - o.C1;
      let tx = `<table><tr><td>C1*</td><td><b>${f(o.C1, 2)}</b></td><td>C2*</td><td><b>${f(o.C2, 2)}</b></td></tr><tr><td>Ahorro S = Y1 − C1</td><td>${f(S, 2)}</td><td>Utilidad</td><td>${f(U, 3)}</td></tr></table>`;
      tx += `<p style="margin:8px 0 0">Es <mark>${o.tipo}</mark>. ` + (mode === 'base' ? `Riqueza en valor presente: Y1 + Y2/(1+r) = ${f(s.Y1 + s.Y2 / (1 + s.r), 2)}. Pendiente de la recta: −(1+r) = −${f(1 + s.r)}.` : '') +
        (mode === 'limit' ? (o.bind ? ' <b>La restricción está activa</b>: quería endeudarse más que M, así que pide exactamente M: C1 = Y1 + M, C2 = Y2 − (1+r)M.' : ' La restricción <b>no está activa</b>: elige lo mismo que sin límite.') : '') +
        (mode === 'rates' ? ' Primero probá con rp: si sale C1 ≤ Y1, es ahorrista. Si no, probá con ra: si sale C1 ≥ Y1, es deudor. Si con ra sale C1 &lt; Y1, se queda en el quiebre.' : '') + '</p>';
      if (H && oi) tx += `<div class="tbl-wrap"><table style="margin-top:8px"><tr><th></th><th>ES (A→H)</th><th>EI (H→B)</th><th>ET</th></tr><tr><td>C1</td><td>${sgn(H.C1 - oi.C1, 0.01)}</td><td>${sgn(o.C1 - H.C1, 0.01)}</td><td><b>${sgn(o.C1 - oi.C1, 0.01)}</b></td></tr><tr><td>C2</td><td>${sgn(H.C2 - oi.C2, 0.01)}</td><td>${sgn(o.C2 - H.C2, 0.01)}</td><td><b>${sgn(o.C2 - oi.C2, 0.01)}</b></td></tr><tr><td>S</td><td>${sgn(oi.C1 - H.C1, 0.01)}</td><td>${sgn(H.C1 - o.C1, 0.01)}</td><td><b>${sgn(oi.C1 - o.C1, 0.01)}</b></td></tr></table></div>`;
      else if (mode === 'base') tx += '<p style="margin:6px 0 0;color:var(--ink-3)">Tip: tocá «Fijar como inicial», después mové sólo r, y vas a ver el efecto sustitución (A→H) y el efecto ingreso (H→B).</p>';
      out.innerHTML = tx;
    }
    draw();
  };

  /* ---------- 11. Demanda de capital: PMK2 = r + δ ---------- */
  W.pmk = (el) => {
    const { pl, c } = shell(el, 'Cuánto capital quiere la firma para mañana');
    const sr = slider(c, { label: 'Tasa real r', min: 0, max: 0.5, step: 0.01, value: 0.1, fmt: (v) => pct(v, 0) }, draw);
    const sd = slider(c, { label: 'Depreciación δ', min: 0, max: 1, step: 0.05, value: 0.1, fmt: (v) => pct(v, 0) }, draw);
    const sA = slider(c, { label: 'Productividad futura A2', min: 0.5, max: 1.6, step: 0.05, value: 1 }, draw);
    const sK = slider(c, { label: 'Capital que ya tiene K1', min: 0, max: 10, step: 0.5, value: 5 }, draw);
    const out = outBox(c);
    function draw() {
      const r = sr.get(), d = sd.get(), A = sA.get(), K1 = sK.get();
      const PMK = (K) => 0.5 * A / Math.sqrt(K);
      const K2 = Math.pow((0.5 * A) / (r + d), 2), I = K2 - (1 - d) * K1;
      const P = Plot({ xmin: 0, xmax: 30, ymin: 0, ymax: 1.2, xl: 'K2', yl: 'PMK2, r + δ' }).axes();
      P.fn(PMK, 0.05, 30, 'c-b'); P.text(2.2, PMK(2.2), 'PMK2', 'lbl-b', 'start', 6, -4);
      P.hline(r + d, 'c-r'); P.text(30, r + d, 'r + δ', 'lbl-r', 'end', -4, -6);
      if (K2 < 30) { P.guide(K2, r + d); P.dot(K2, r + d, 'd-b'); P.tickX(K2, 'K2*'); }
      pl.innerHTML = ''; pl.appendChild(P.svg);
      out.innerHTML = `<table><tr><td>Capital deseado K2*</td><td><b>${f(K2, 2)}</b></td></tr><tr><td>Lo que queda de K1: (1−δ)K1</td><td>${f((1 - d) * K1, 2)}</td></tr><tr><td>Inversión I = K2* − (1−δ)K1</td><td><b>${f(I, 2)}</b></td></tr></table><p style="margin:8px 0 0">Subí r: la línea roja sube y <mark>K2* e I bajan</mark>. Por eso la inversión es decreciente en r.</p>`;
    }
    draw();
  };

  /* ---------- 12. Equilibrio general en dos períodos (los 7 gráficos del TP 6) ---------- */
  const GE_SC = {
    pmk2down: {
      name: 'Shock adverso a la PMK esperada',
      st: [
        { k: 0.7, rK: 'init', sS: 6, sI: -14, txt: 'Cae la PMK2: a cada tasa la firma quiere menos K2 → I(r) se corre a la izquierda. Menos K2 baja la PML2 → caen L2, w2/p2 e Y2. Como Y2 cae, el consumidor ahorra más para suavizar: S(r) a la derecha. Resultado parcial: r baja.' },
        { k: 0.74, rK: 'own', sS: 4, sI: -8, txt: 'Segunda vuelta: con r más baja el capital se abarata → la firma elige algo más de K2 que en rojo → sube un poco la PML2 → L2 y w2/p2 se recuperan parcialmente → PMK2 sube un poco. Y2 se recupera algo: S vuelve parcialmente. r sube respecto del rojo, pero queda debajo del inicial.' },
      ],
      res: [['Y1, L1, w1/p1', '='], ['Y2, K2, L2, w2/p2', '↓'], ['r', '↓'], ['S = I', '?']],
    },
    pml1down: {
      name: 'Shock adverso y transitorio a la PML corriente',
      st: [
        { d1: 0.8, rK: 'own', sS: -10, sI: 0, txt: 'Cae la PML1: Ld1 a la izquierda → caen L1, w1/p1 e Y1. Con menos ingreso hoy el consumidor ahorra menos (suaviza): S(r) a la izquierda → r sube. El capital se encarece → menos K2 (movimiento sobre la PMK) → cae la PML2 → bajan L2, w2/p2 e Y2.' },
        { d1: 0.8, k: 0.945, rK: 'own', sS: -6, sI: -5, txt: 'Segunda vuelta: Y2 cae → el consumidor ahorra algo más (S vuelve parcialmente a la derecha). Con menos L2 la PMK2 cae → I(r) a la izquierda. Ambas cosas bajan r respecto del rojo. El efecto final sobre r es ambiguo; S = I cae.' },
      ],
      res: [['Y1, L1, w1/p1, C1', '↓'], ['Y2, K2, L2, w2/p2', '↓'], ['r', '?'], ['S = I', '↓']],
    },
    y1up: {
      name: 'Aumento transitorio y paralelo de la función de producción',
      st: [
        { p1: 15, rK: 'own', sS: 10, sI: 0, txt: 'Y1 sube sin cambiar la PML1 → L1 y w1/p1 no se mueven. El consumidor ahorra parte del ingreso extra: S(r) a la derecha → r baja → más K2 (movimiento sobre la PMK) → sube la PML2 → suben L2, w2/p2 e Y2.' },
        { p1: 15, k: 1.071, rK: 'prev', sS: 6, sI: 5, txt: 'Segunda vuelta: más L2 sube la PMK2 → I(r) a la derecha. Y2 más alto hace que el consumidor ahorre un poco menos → S vuelve parcialmente. r sube respecto del rojo pero queda debajo del inicial.' },
      ],
      res: [['Y1', '↑'], ['L1, w1/p1', '='], ['Y2, K2, L2, w2/p2', '↑'], ['r', '↓'], ['S = I', '↑']],
    },
    pmk2up: {
      name: 'Shock favorable a la PMK esperada',
      st: [
        { k: 1.3, rK: 'init', sS: -6, sI: 14, txt: 'Sube la PMK2: a cada tasa la firma quiere más K2 → I(r) a la derecha. Más K2 sube la PML2 → suben L2, w2/p2 e Y2. Como Y2 sube, el consumidor ahorra menos: S(r) a la izquierda. r sube.' },
        { k: 1.26, rK: 'own', sS: -4, sI: 8, txt: 'Segunda vuelta: con r más alta el capital se encarece → K2 algo menor que en rojo → L2 y w2/p2 bajan un poco respecto del rojo. r baja respecto del rojo, pero queda arriba del inicial.' },
      ],
      res: [['Y1, L1, w1/p1', '='], ['Y2, K2, L2, w2/p2', '↑'], ['r', '↑'], ['S = I', '?']],
    },
    pml1up: {
      name: 'Shock favorable y transitorio a la PML corriente',
      st: [
        { d1: 1.2, rK: 'own', sS: 10, sI: 0, txt: 'Sube la PML1: Ld1 a la derecha → suben L1, w1/p1 e Y1. El consumidor ahorra parte: S(r) a la derecha → r baja → más K2 → sube PML2 → suben L2, w2/p2 e Y2.' },
        { d1: 1.2, k: 1.05, rK: 'own', sS: 6, sI: 5, txt: 'Segunda vuelta: Y2 más alto → ahorra un poco menos (S vuelve parcialmente). Más L2 sube PMK2 → I(r) a la derecha. r sube respecto del rojo: el efecto final sobre r es ambiguo; S = I sube.' },
      ],
      res: [['Y1, L1, w1/p1, C1', '↑'], ['Y2, K2, L2, w2/p2', '↑'], ['r', '?'], ['S = I', '↑']],
    },
    y1down: {
      name: 'Caída transitoria y paralela de la función de producción',
      st: [
        { p1: -15, rK: 'own', sS: -10, sI: 0, txt: 'Y1 cae sin cambiar la PML1 → L1 y w1/p1 no se mueven. El consumidor ahorra menos para no bajar tanto C1: S(r) a la izquierda → r sube → menos K2 → cae PML2 → bajan L2, w2/p2 e Y2.' },
        { p1: -15, k: 0.94, rK: 'prev', sS: -6, sI: -5, txt: 'Segunda vuelta: menos L2 baja la PMK2 → I(r) a la izquierda. Y2 más bajo → ahorra un poco más → S vuelve parcialmente. r baja respecto del rojo pero queda arriba del inicial.' },
      ],
      res: [['Y1', '↓'], ['L1, w1/p1', '='], ['Y2, K2, L2, w2/p2', '↓'], ['r', '↑'], ['S = I', '↓']],
    },
  };
  App.GE_SC = GE_SC;
  function geCalc(p, init, prev) {
    const d1 = p.d1 || 1, p1 = p.p1 || 0, k = p.k || 1, sS = p.sS || 0, sI = p.sI || 0;
    const L1 = Math.pow(300 * d1, 2 / 3), w1 = 0.02 * L1, Y1 = d1 * 12 * Math.sqrt(L1) + p1;
    const r = (40 + sI - sS) / 140, Q = 20 + 60 * r + sS;
    const rk = p.rK === 'init' && init ? init.r : p.rK === 'prev' && prev ? prev.r : r;
    const K2 = Math.pow((1.2 * k) / (rk + 0.1), 2);
    const K20 = init ? init.K2 : K2;
    const d2 = Math.sqrt(K2 / K20);
    const L2 = Math.pow(300 * d2, 2 / 3), w2 = 0.02 * L2, Y2 = d2 * 12 * Math.sqrt(L2);
    return { d1, p1, k, sS, sI, L1, w1, Y1, r, Q, rk, K2, d2, L2, w2, Y2, cK: Y2 / Math.sqrt(K2) };
  }
  W.ge = (el, opt) => {
    const sc = GE_SC[opt] || GE_SC.pmk2down;
    el.innerHTML = `<div class="widget-h"><span>Equilibrio general · ${sc.name}</span></div><div class="row stg" style="margin-bottom:10px"></div><div class="ge-grid"></div><div class="w-out wo2" style="margin-top:10px"></div>
      <div class="legend"><span><i style="background:var(--ink)"></i>inicial</span><span><i style="background:var(--red)"></i>1ª vuelta</span><span><i style="background:var(--green)"></i>2ª vuelta</span></div>`;
    const grid = $('.ge-grid', el), out = $('.wo2', el), stg = $('.stg', el);
    const S0 = geCalc({}, null, null);
    const S1 = geCalc(sc.st[0], S0, S0);
    const S2 = geCalc(sc.st[1], S0, S1);
    const states = [S0, S1, S2], cls = ['k', 'r', 'g'];
    let stage = 2;
    const sg = seg(stg, [['0', 'Equilibrio inicial'], ['1', '1ª vuelta'], ['2', '2ª vuelta']], '2', (v) => { stage = +v; draw(); });
    function mini(title, o) { const d = document.createElement('div'); d.className = 'ge-cell'; d.innerHTML = `<div class="t">${title}</div>`; const P = Plot(Object.assign({ w: 260, h: 200, ml: 30, mr: 10, mt: 14, mb: 26 }, o)).axes(); d.appendChild(P.svg); grid.appendChild(d); return P; }
    function same(a, b, keys) { return keys.every((k) => Math.abs(a[k] - b[k]) < 1e-6); }
    function draw() {
      grid.innerHTML = '';
      const vis = states.slice(0, stage + 1);
      // 1 Trabajo 1
      let P = mini('Trabajo · período 1', { xmin: 0, xmax: 80, ymin: 0, ymax: 2.4, xl: 'L1', yl: 'w1/p1' });
      P.fn((L) => 0.02 * L, 0, 80, 'c-k c-thin');
      vis.forEach((s, i) => { if (i === 0 || !same(s, vis[i - 1], ['d1'])) P.fn((L) => s.d1 * 6 / Math.sqrt(L), 1, 80, 'c-' + cls[i]); P.guide(s.L1, s.w1); P.dot(s.L1, s.w1, 'd-' + cls[i], 3.5); });
      // 2 Y1
      P = mini('Producción Y1(L1)', { xmin: 0, xmax: 80, ymin: 0, ymax: 140, xl: 'L1', yl: 'Y1' });
      vis.forEach((s, i) => { if (i === 0 || !same(s, vis[i - 1], ['d1', 'p1'])) P.fn((L) => s.d1 * 12 * Math.sqrt(L) + s.p1, 0, 80, 'c-' + cls[i]); P.guide(s.L1, s.Y1); P.dot(s.L1, s.Y1, 'd-' + cls[i], 3.5); });
      // 3 Trabajo 2
      P = mini('Trabajo · período 2', { xmin: 0, xmax: 80, ymin: 0, ymax: 2.4, xl: 'L2', yl: 'w2/p2' });
      P.fn((L) => 0.02 * L, 0, 80, 'c-k c-thin');
      vis.forEach((s, i) => { if (i === 0 || !same(s, vis[i - 1], ['d2'])) P.fn((L) => s.d2 * 6 / Math.sqrt(L), 1, 80, 'c-' + cls[i]); P.guide(s.L2, s.w2); P.dot(s.L2, s.w2, 'd-' + cls[i], 3.5); });
      // 4 Y2(L2)
      P = mini('Producción Y2(L2)', { xmin: 0, xmax: 80, ymin: 0, ymax: 140, xl: 'L2', yl: 'Y2' });
      vis.forEach((s, i) => { if (i === 0 || !same(s, vis[i - 1], ['d2'])) P.fn((L) => s.d2 * 12 * Math.sqrt(L), 0, 80, 'c-' + cls[i]); P.guide(s.L2, s.Y2); P.dot(s.L2, s.Y2, 'd-' + cls[i], 3.5); });
      // 5 PMK
      P = mini('Capital: PMK2 = r + δ', { xmin: 0, xmax: 30, ymin: 0, ymax: 0.9, xl: 'K2', yl: 'PMK2' });
      vis.forEach((s, i) => { if (i === 0 || !same(s, vis[i - 1], ['k'])) P.fn((K) => s.k * 1.2 / Math.sqrt(K), 0.2, 30, 'c-' + cls[i]); if (i === 0 || Math.abs(s.rk - vis[i - 1].rk) > 1e-6) P.hline(s.rk + 0.1, 'c-' + cls[i] + ' c-thin'); P.guide(s.K2, s.rk + 0.1); P.dot(s.K2, s.rk + 0.1, 'd-' + cls[i], 3.5); });
      // 6 Y2(K2)
      P = mini('Producción Y2(K2)', { xmin: 0, xmax: 30, ymin: 0, ymax: 140, xl: 'K2', yl: 'Y2' });
      vis.forEach((s, i) => { if (i === 0 || Math.abs(s.cK - vis[i - 1].cK) > 0.01) P.fn((K) => s.cK * Math.sqrt(K), 0, 30, 'c-' + cls[i]); P.guide(s.K2, s.Y2); P.dot(s.K2, s.Y2, 'd-' + cls[i], 3.5); });
      // 7 Crédito
      P = mini('Mercado de crédito', { xmin: 0, xmax: 70, ymin: 0, ymax: 0.6, xl: 'S, I', yl: 'r' });
      vis.forEach((s, i) => {
        if (i === 0 || Math.abs(s.sS - vis[i - 1].sS) > 1e-6) P.fn((Q) => (Q - 20 - s.sS) / 60, 0, 70, 'c-' + cls[i]);
        if (i === 0 || Math.abs(s.sI - vis[i - 1].sI) > 1e-6) P.fn((Q) => (60 + s.sI - Q) / 80, 0, 70, 'c-' + cls[i]);
        P.guide(s.Q, s.r); P.dot(s.Q, s.r, 'd-' + cls[i], 3.5);
      });
      P.text(68, (68 - 20) / 60, 'S', 'lbl-k', 'end', 0, -4); P.text(68, (60 - 68) / 80 + 0.03, 'I', 'lbl-k', 'end', 0, 0);
      const txt = stage === 0 ? 'Equilibrio inicial: en cada período el mercado de trabajo fija L y w/p, y con ese L se lee Y en la función de producción. El crédito fija r, y con r la firma elige K2 donde PMK2 = r + δ.' : sc.st[stage - 1].txt;
      out.innerHTML = `<p style="margin:0">${txt}</p>` + (stage === 2 ? `<div class="tbl-wrap"><table style="margin-top:8px"><tr><th>Resultado final vs inicial</th><th></th></tr>${sc.res.map((r) => `<tr><td>${r[0]}</td><td><b>${r[1]}</b></td></tr>`).join('')}</table></div>` : '');
    }
    draw();
  };

  /* ---------- 13. Mercado de crédito con shocks (política fiscal / economía abierta) ---------- */
  const CR_SC = {
    g1t1: { n: 'G1↑ financiado con T1', sS: -14, sI: 0, t: 'El ahorro público no cambia (ΔT1 = ΔG1), pero el consumidor, con menos ingreso disponible, baja C1 menos que el impuesto: cae el ahorro privado. S total a la izquierda → r↑, I↓ (crowding out).' },
    g1b: { n: 'G1↑ financiado con deuda', sS: -14, sI: 0, t: 'Equivalencia ricardiana: el consumidor sabe que T2 va a subir en (1+r)·ΔG1. Su riqueza cae lo mismo que con impuestos hoy, así que el ahorro total cae igual: mismo resultado que G1↑ con T1.' },
    tcut: { n: 'Baja T1 y sube T2 (mismo VP)', sS: 0, sI: 0, t: 'Equivalencia ricardiana: el consumidor ahorra toda la baja de impuestos. SP sube lo mismo que cae SG: el ahorro total no se mueve. Nada cambia.' },
    g2t2: { n: 'G2↑ financiado con T2', sS: 8, sI: 0, t: 'Cae el ingreso disponible de mañana. Para suavizar, el consumidor consume menos hoy y ahorra más: S a la derecha → r↓, I↑.' },
    gboth_hi: { n: 'G1 y G2 ↑ con impuestos, b < 1/(1+r)', sS: 6, sI: 0, t: 'ΔSP = K/(1+b)·(1/(1+r) − b) > 0: el consumidor es impaciente relativo al mercado y ahorra más. S a la derecha → r↓, I↑.' },
    gboth_lo: { n: 'G1 y G2 ↑ con impuestos, b > 1/(1+r)', sS: -6, sI: 0, t: 'ΔSP = K/(1+b)·(1/(1+r) − b) < 0: ahorra menos. S a la izquierda → r↑, I↓.' },
  };
  W.credit = (el, opt) => {
    const keys = (opt || 'g1t1,g1b,tcut,g2t2,gboth_hi,gboth_lo').split(',');
    el.innerHTML = `<div class="widget-h"><span>Mercado de fondos prestables: S total = I</span></div><div class="row presets" style="margin-bottom:10px"></div><div class="w-grid"><div class="w-plot"></div><div class="w-out"></div></div>`;
    const pl = $('.w-plot', el), out = $('.w-out', el), pre = $('.presets', el);
    let cur = keys[0];
    const sg = seg(pre, keys.map((k) => [k, CR_SC[k].n]), cur, (v) => { cur = v; draw(); });
    function draw() {
      const sc = CR_SC[cur];
      const r0 = 40 / 140, Q0 = 20 + 60 * r0, r1 = (40 + sc.sI - sc.sS) / 140, Q1 = 20 + 60 * r1 + sc.sS;
      const P = Plot({ xmin: 0, xmax: 70, ymin: 0, ymax: 0.6, xl: 'S, I', yl: 'r' }).axes();
      P.fn((Q) => (Q - 20) / 60, 0, 70, sc.sS ? 'c-m' : 'c-b'); P.fn((Q) => (60 - Q) / 80, 0, 70, sc.sI ? 'c-m' : 'c-k');
      if (sc.sS) P.fn((Q) => (Q - 20 - sc.sS) / 60, 0, 70, 'c-b');
      if (sc.sI) P.fn((Q) => (60 + sc.sI - Q) / 80, 0, 70, 'c-k');
      P.guide(Q0, r0); P.dot(Q0, r0, 'd-m');
      if (sc.sS || sc.sI) { P.guide(Q1, r1); P.dot(Q1, r1, 'd-b'); P.text(Q1, r1, 'nuevo', 'lbl-b', 'start', 7, -6); }
      P.text(68, (68 - 20 - sc.sS) / 60, 'S total', 'lbl-b', 'end', 0, -6).text(66, (60 + sc.sI - 66) / 80, 'I', 'lbl-k', 'end', 0, -6);
      pl.innerHTML = ''; pl.appendChild(P.svg);
      out.innerHTML = `<p style="margin:0 0 8px"><b>${sc.n}</b></p><p style="margin:0 0 8px">${sc.t}</p><table><tr><td>r</td><td><b>${sgn(r1 - r0)}</b></td><td>S = I</td><td><b>${sgn(Q1 - Q0)}</b></td></tr></table>`;
    }
    draw();
  };

  /* ---------- 14. Equivalencia ricardiana y restricción de crédito (TP 7.5) ---------- */
  W.ricardo = (el) => {
    el.innerHTML = `<div class="widget-h"><span>Baja de impuestos hoy, suba mañana: ¿cambia algo?</span></div><div class="row presets" style="margin-bottom:10px"></div><div class="w-grid"><div class="w-plot"></div><div class="ctrls"></div></div><div class="w-out wo2" style="margin-top:10px"></div>`;
    const pl = $('.w-plot', el), c = $('.ctrls', el), out = $('.wo2', el), pre = $('.presets', el);
    const sets = { a: { Y1: 100, Y2: 200, T1: 50, T2: 50, r: 0.5, b: 2 / 3 }, b: { Y1: 200, Y2: 100, T1: 50, T2: 50, r: 0.5, b: 2 / 3 } };
    let ds = 'a', lim = true;
    seg(pre, [['a', 'Datos TP 7.5: Y1=100, Y2=200'], ['b', 'Inciso 7: Y1=200, Y2=100']], 'a', (v) => { ds = v; draw(); });
    const sc = slider(c, { label: 'Baja de impuestos hoy (−ΔT1)', min: 0, max: 40, step: 1, value: 10, fmt: (v) => f(v, 0) }, draw);
    seg(c, [['1', 'Con restricción de crédito'], ['0', 'Sin restricción']], '1', (v) => { lim = v === '1'; draw(); });
    function solve(s, cut) {
      const T1 = s.T1 - cut, T2 = s.T2 + (1 + s.r) * cut, Yd1 = s.Y1 - T1, Yd2 = s.Y2 - T2;
      const Wd = Yd1 + Yd2 / (1 + s.r);
      let C1 = Wd / (1 + s.b), C2 = s.b * (1 + s.r) * C1, bind = false;
      if (lim && C1 > Yd1) { C1 = Yd1; C2 = Yd2; bind = true; }
      return { T1, T2, Yd1, Yd2, Wd, C1, C2, bind, SP: Yd1 - C1, U: lnU(C1, C2, s.b) };
    }
    function draw() {
      const s = sets[ds], cut = sc.get();
      const A = solve(s, 0), B = solve(s, cut);
      const xmax = A.Wd * 1.1, ymax = A.Wd * (1 + s.r) * 1.1;
      const P = Plot({ xmin: 0, xmax, ymin: 0, ymax, xl: 'C1', yl: 'C2' }).axes();
      P.line(0, A.Wd * (1 + s.r), A.Wd, 0, 'c-k');
      if (lim) { P.rect(B.Yd1, 0, xmax, ymax, 'a-r'); P.vline(B.Yd1, 'c-r'); if (cut) P.vline(A.Yd1, 'c-rd'); }
      P.fn((x) => Math.exp((A.U - Math.log(x)) / s.b), 1, xmax, 'c-m c-thin');
      P.fn((x) => Math.exp((B.U - Math.log(x)) / s.b), 1, xmax, 'c-bd');
      P.dot(A.Yd1, A.Yd2, 'd-k'); P.text(A.Yd1, A.Yd2, 'D', 'lbl-k', 'start', 7, 14);
      if (cut) { P.dot(B.Yd1, B.Yd2, 'd-k'); P.text(B.Yd1, B.Yd2, "D'", 'lbl-k', 'start', 7, 14); }
      P.dot(A.C1, A.C2, 'd-m'); P.dot(B.C1, B.C2, 'd-b'); P.text(B.C1, B.C2, 'óptimo', 'lbl-b', 'end', -8, -8);
      pl.innerHTML = ''; pl.appendChild(P.svg);
      const dSP = B.SP - A.SP, dSG = -cut, dST = dSP + dSG;
      out.innerHTML = `<div class="tbl-wrap"><table><tr><th></th><th>T1</th><th>T2</th><th>Y<sup>d</sup>1</th><th>Y<sup>d</sup>2</th><th>C1</th><th>C2</th><th>SP</th><th>U</th></tr>
      <tr><td>Antes</td><td>${f(A.T1)}</td><td>${f(A.T2)}</td><td>${f(A.Yd1)}</td><td>${f(A.Yd2)}</td><td>${f(A.C1)}</td><td>${f(A.C2)}</td><td>${f(A.SP)}</td><td>${f(A.U, 3)}</td></tr>
      <tr><td>Después</td><td>${f(B.T1)}</td><td>${f(B.T2)}</td><td>${f(B.Yd1)}</td><td>${f(B.Yd2)}</td><td>${f(B.C1)}</td><td>${f(B.C2)}</td><td>${f(B.SP)}</td><td>${f(B.U, 3)}</td></tr></table></div>
      <p style="margin:8px 0 0">ΔSP = ${f(dSP)}, ΔSG = ${f(dSG)}, <b>ΔST = ${f(dST)}</b>. ${Math.abs(dST) < 1e-6 && Math.abs(B.C1 - A.C1) < 1e-6 ? '<mark>Se cumple la equivalencia ricardiana</mark>: la dotación se mueve sobre la misma recta y el óptimo no cambia.' : '<mark>No se cumple la equivalencia ricardiana</mark>: el consumidor estaba trabado por la restricción de crédito y usa la baja de impuestos para consumir más hoy.'}</p>`;
    }
    draw();
  };

  /* ---------- 15. Economía abierta, cuenta corriente y riesgo país ---------- */
  W.open = (el) => {
    el.innerHTML = `<div class="widget-h"><span>Economía chica y abierta: CA = S − I</span></div><div class="row presets" style="margin-bottom:10px"></div><div class="w-grid"><div class="w-plot"></div><div class="ctrls"></div></div>`;
    const pl = $('.w-plot', el), c = $('.ctrls', el), pre = $('.presets', el);
    let sh = { sS: 0, sI: 0, n: 'Sin shock' };
    const sw = slider(c, { label: 'Tasa mundial rW', min: 0, max: 0.4, step: 0.01, value: 0.08, fmt: (v) => pct(v, 0) }, draw);
    const sp = slider(c, { label: 'Probabilidad de default p (riesgo país)', min: 0, max: 0.3, step: 0.01, value: 0, fmt: (v) => pct(v, 0) }, draw);
    const out = outBox(c);
    [['Sin shock', 0, 0], ['A1↑ transitorio', 12, 0], ['G1↑ con T1', -12, 0], ['PMK2↓ esperada', 6, -14], ['PMK2↑ esperada', -6, 14], ['G2↑ con T2', 7, 0]].forEach(([n, a, b]) => btn(pre, n, () => { sh = { sS: a, sI: b, n }; draw(); }));
    function draw() {
      const rW = sw.get(), p = sp.get(), rA = (rW + p) / (1 - p);
      const Sf = (r) => 30 + 100 * r + sh.sS, If = (r) => Math.max(0, 70 - 120 * r + sh.sI);
      const rc = (40 + sh.sI - sh.sS) / 220;
      const S = Sf(rW), I = If(rA), CA = S - I;
      const P = Plot({ xmin: 0, xmax: 90, ymin: 0, ymax: 0.6, xl: 'S, I', yl: 'r' }).axes();
      if (sh.sS) P.fn((Q) => (Q - 30) / 100, 0, 90, 'c-m'); if (sh.sI) P.fn((Q) => (70 - Q) / 120, 0, 90, 'c-m');
      P.fn((Q) => (Q - 30 - sh.sS) / 100, 0, 90, 'c-b'); P.fn((Q) => (70 + sh.sI - Q) / 120, 0, 90, 'c-k');
      P.text(88, (88 - 30 - sh.sS) / 100, 'S', 'lbl-b', 'end', 0, -6).text(6, (70 + sh.sI - 6) / 120, 'I', 'lbl-k', 'start', 0, -6);
      P.hline(rW, 'c-g'); P.text(90, rW, 'rW', 'lbl-g', 'end', -2, -6);
      if (p > 0) { P.hline(rA, 'c-r'); P.text(90, rA, 'rARG', 'lbl-r', 'end', -2, -6); }
      P.dot(S, rW, 'd-b'); P.dot(I, rA, 'd-k');
      P.line(Math.min(S, I), 0.03, Math.max(S, I), 0.03, CA >= 0 ? 'c-g' : 'c-r');
      P.text((S + I) / 2, 0.03, CA >= 0 ? 'CA > 0' : 'CA < 0', CA >= 0 ? 'lbl-g' : 'lbl-r', 'middle', 0, -6);
      P.hline(rc, 'guide'); P.text(2, rc, 'r* cerrada', 'lbl-m', 'start', 0, -4);
      pl.innerHTML = ''; pl.appendChild(P.svg);
      out.innerHTML = `<table><tr><td>Ahorro (a rW)</td><td>${f(S, 1)}</td></tr><tr><td>Inversión (a ${p > 0 ? 'rARG' : 'rW'})</td><td>${f(I, 1)}</td></tr><tr><td><b>Cuenta corriente</b></td><td><b>${f(CA, 1)}</b></td></tr>${p > 0 ? `<tr><td>rARG = (rW + p)/(1 − p)</td><td>${pct(rA, 1)}</td></tr><tr><td>Riesgo país λ</td><td>${f((rA - rW) * 10000, 0)} pb</td></tr>` : ''}</table><p style="margin:8px 0 0">${CA < 0 ? 'Déficit: el país <mark>se endeuda con el mundo</mark> para financiar inversión.' : 'Superávit: el país <mark>le presta al mundo</mark>.'} Como el país es chico, la tasa no se mueve: los shocks se ven directo en S, I y CA.</p>`;
    }
    draw();
  };

  /* ---------- 16. Flujo circular (diagrama) ---------- */
  W.flujo = (el, opt) => {
    const gov = opt === 'gob' || opt === 'abierta', ab = opt === 'abierta';
    el.innerHTML = `<div class="widget-h"><span>Flujo circular de la renta${gov ? ' con gobierno' : ''}${ab ? ' y resto del mundo' : ''}</span></div><div class="w-plot"></div>`;
    const P = Plot({ w: 520, h: gov ? 330 : 250, ml: 10, mr: 10, mt: 10, mb: 10, xmin: 0, xmax: 52, ymin: 0, ymax: gov ? 33 : 25 });
    const box = (x, y, t) => { P.rect(x - 7, y - 2.4, x + 7, y + 2.4, 'a-b'); P.text(x, y, t, 'lbl-b', 'middle', 0, 4); };
    const top = gov ? 30 : 22;
    box(8, top - 10, 'Hogares'); box(44, top - 10, 'Empresas');
    P.line(15, top - 7.5, 37, top - 7.5, 'c-b'); P.text(26, top - 7.5, 'gasto en bienes →', '', 'middle', 0, -6);
    P.line(15, top - 12.5, 37, top - 12.5, 'c-g'); P.text(26, top - 12.5, '← salarios, beneficios, alquiler del K', '', 'middle', 0, 15);
    P.text(26, top - 1, 'trabajo y capital (hogares → empresas)', 'lbl-m', 'middle');
    if (gov) { box(26, 4, 'Gobierno'); P.line(10, top - 13, 21, 6, 'c-r'); P.text(12, 9, 'impuestos', 'lbl-r', 'start'); P.line(42, top - 13, 31, 6, 'c-r'); P.text(40, 9, 'compras G', 'lbl-r', 'end'); }
    if (ab) { P.text(51, top - 1, 'X − M ↔ resto del mundo', 'lbl-g', 'end'); }
    $('.w-plot', el).appendChild(P.svg);
  };

  function mountWidgets(root) {
    $$('[data-w]', root).forEach((el) => {
      if (el.dataset.mounted) return;
      el.dataset.mounted = '1';
      el.classList.add('widget');
      const fn = W[el.dataset.w];
      if (fn) { try { fn(el, el.dataset.o); } catch (e) { el.innerHTML = '<p>No se pudo dibujar este gráfico.</p>'; console.error(e); } }
    });
  }
  App.mountWidgets = mountWidgets;

  /* ============================== componentes ============================== */
  function mountCheck(host, q, onAnswer) {
    const vf = q.vf !== undefined || q.k === 'vf';
    const opts = vf ? ['Verdadero', 'Falso'] : q.o;
    const ans = vf ? (q.a ? 0 : 1) : q.a;
    host.innerHTML = `<div class="q">${q.q}</div><div class="${vf ? 'vf' : 'opts'}">${opts.map((o, i) => `<button type="button" class="opt" data-i="${i}">${o}</button>`).join('')}</div><div class="why" hidden></div>`;
    const why = $('.why', host);
    $$('.opt', host).forEach((b) => b.addEventListener('click', () => {
      const i = +b.dataset.i, ok = i === ans;
      $$('.opt', host).forEach((x) => { x.disabled = true; if (+x.dataset.i === ans) x.classList.add('right'); });
      if (!ok) b.classList.add('wrong');
      why.hidden = false;
      why.innerHTML = `<b class="${ok ? 'ok' : 'no'}">${ok ? 'Bien.' : 'No.'}</b> ${q.why || ''}`;
      renderMath(why);
      onAnswer && onAnswer(ok);
    }));
    renderMath(host);
  }

  function arrowsTable(host, spec) {
    // spec: {title, cols:[...], rows:[[label, ans1, ans2...]]}
    const sym = ['·', '↑', '↓', '=', '?'];
    const id = ++ctl;
    let s = `${spec.title ? `<p style="margin:10px 0 4px"><b>${spec.title}</b></p>` : ''}<div class="tbl-wrap"><table class="arrows"><tr><th></th>${spec.cols.map((c) => `<th>${c}</th>`).join('')}</tr>`;
    spec.rows.forEach((r, ri) => { s += `<tr><td>${r[0]}</td>${r.slice(1).map((_, ci) => `<td><button type="button" class="arr-btn" id="ab${id}-${ri}-${ci}" data-v="0" aria-label="${r[0]} ${spec.cols[ci]}">·</button></td>`).join('')}</tr>`; });
    s += '</table></div>';
    const d = document.createElement('div'); d.innerHTML = s; host.appendChild(d);
    $$('.arr-btn', d).forEach((b) => b.addEventListener('click', () => { const v = (+b.dataset.v % 4) + 1; b.dataset.v = v; b.textContent = sym[v]; b.classList.remove('right', 'wrong'); }));
    return {
      check() {
        let ok = 0, tot = 0;
        spec.rows.forEach((r, ri) => r.slice(1).forEach((a, ci) => { const b = $(`#ab${id}-${ri}-${ci}`, d); tot++; const g = sym[+b.dataset.v]; const good = g === a || (a === '=' && g === '–'); b.classList.toggle('right', good); b.classList.toggle('wrong', !good); if (good) ok++; }));
        return [ok, tot];
      },
      reveal() { spec.rows.forEach((r, ri) => r.slice(1).forEach((a, ci) => { const b = $(`#ab${id}-${ri}-${ci}`, d); b.textContent = a; b.dataset.v = sym.indexOf(a); b.classList.add('right'); b.classList.remove('wrong'); })); },
    };
  }

  function classifyGame(host, spec) {
    const d = document.createElement('div'); d.className = 'cls-grid'; host.appendChild(d);
    const picks = {};
    spec.items.forEach(([name], i) => {
      const r = document.createElement('div'); r.className = 'cls-row'; r.innerHTML = `<span>${name}</span>`; d.appendChild(r);
      seg(r, spec.options.map((o) => [o, o]), null, (v) => { picks[i] = v; r.classList.remove('right', 'wrong'); });
    });
    return {
      check() { let ok = 0; spec.items.forEach(([, a], i) => { const good = picks[i] === a; d.children[i].classList.toggle('right', good); d.children[i].classList.toggle('wrong', !good); if (good) ok++; }); return [ok, spec.items.length]; },
      reveal() { spec.items.forEach(([, a], i) => { d.children[i].classList.add('right'); d.children[i].classList.remove('wrong'); const s = d.children[i].querySelector('.seg'); $$('button', s).forEach((b) => b.classList.toggle('on', b.dataset.v === a)); }); },
    };
  }

  function stepsReveal(host, steps, opt = {}) {
    // revela pasos de a uno
    host.innerHTML = '<div class="steps-sol"></div><div class="row" style="margin-top:12px"></div>';
    const list = $('.steps-sol', host), bar = $('.row', host);
    let n = opt.start || 0;
    const next = btn(bar, '', () => { n++; paint(); }, 'btn primary');
    const all = btn(bar, 'Mostrar todo', () => { n = steps.length; paint(); }, 'btn');
    function paint() {
      list.innerHTML = steps.slice(0, n).map((s, i) => `<div class="sol-step"><span class="sn">Paso ${i + 1} de ${steps.length}</span><h4>${s.t}</h4><div class="prose">${s.b}</div></div>`).join('');
      next.textContent = n === 0 ? (opt.firstLabel || 'Mostrar el primer paso') : `Siguiente paso (${Math.min(n + 1, steps.length)}/${steps.length})`;
      next.hidden = n >= steps.length; all.hidden = n >= steps.length;
      renderMath(list); mountWidgets(list);
      if (n >= steps.length && opt.onDone) opt.onDone();
    }
    paint();
  }

  /* ============================== vistas ============================== */
  const main = () => $('#main');
  const unitById = (n) => App.UNITS.find((u) => u.n === n);
  function exById(id) { for (const u of App.UNITS) for (const e of u.exercises || []) if (e.id === id) return { u, e }; return null; }

  function unitProgress(u) {
    const L = u.lessons.length, E = (u.exercises || []).length;
    const ld = u.lessons.filter((l) => Store.d.lessons[l.id]).length;
    const qd = Store.d.quiz[u.id] != null ? 1 : 0;
    const ed = (u.exercises || []).filter((e) => Object.keys(Store.d.ex).some((k) => k.startsWith(e.id + ':') && Store.d.ex[k] === 'ok')).length;
    const tot = L + 1 + E;
    return { pct: tot ? (ld + qd + ed) / tot : 0, ld, L, qd, ed, E };
  }

  function sideNav(active) {
    const s = $('#side');
    let h = `<button type="button" class="tb-btn side-close" id="sideClose">Cerrar menú</button><nav class="nav-top" aria-label="General"><a href="#inicio" class="${active === 'inicio' ? 'on' : ''}">Inicio y plan de estudio</a><a href="#feed" class="${/^feed/.test(active) ? 'on' : ''}">Aprender scrolleando</a><a href="#formulas" class="${active === 'formulas' ? 'on' : ''}">Hoja de fórmulas</a><a href="#simulacro" class="${active === 'simulacro' ? 'on' : ''}">Simulacro de examen</a></nav>`;
    App.UNITS.forEach((u) => {
      const p = unitProgress(u);
      h += `<div class="nav-unit"><a class="nav-unit-h" href="#u${u.n}"><span class="n">U${u.n}</span>${u.title}</a><div class="nav-links">
        <a href="#u${u.n}" class="${active === 'u' + u.n ? 'on' : ''}"><span>Teoría</span><span class="mini-bar"><i style="width:${(p.ld / Math.max(1, p.L)) * 100}%"></i></span></a>
        <a href="#u${u.n}-quiz" class="${active === 'u' + u.n + '-quiz' ? 'on' : ''}"><span>Practicar</span>${p.qd ? '<span class="chip ok">hecho</span>' : ''}</a>
        <a href="#u${u.n}-tps" class="${active === 'u' + u.n + '-tps' || (active.startsWith('tp') && (u.exercises || []).some((e) => e.id === active)) ? 'on' : ''}"><span>TPs: ${u.tps}</span></a></div></div>`;
    });
    s.innerHTML = h;
    const cl = $('#sideClose'); if (cl) cl.addEventListener('click', () => s.classList.remove('open'));
    $$('a', s).forEach((a) => a.addEventListener('click', () => s.classList.remove('open')));
  }

  function viewHome() {
    const last = Store.d.last && Store.d.last !== 'inicio' ? Store.d.last : '';
    let h = `<div class="home-hero"><span class="eyebrow">Universidad Torcuato Di Tella · Economía II</span><h1>Economía II</h1>
      <p>Toda la teoría de los capítulos 1 a 6, con gráficos que podés mover, preguntas rápidas y cada ejercicio de los TP explicado como lo resuelve el profe. Después, 5 variantes de cada ejercicio para hacer en papel.</p>
      <div class="row" style="margin-top:16px"><a class="btn primary" href="#feed">Aprender scrolleando</a>${last && !/^feed/.test(last) ? `<a class="btn" href="#${last}">Seguir donde quedé</a>` : `<a class="btn" href="#u1-l1">Empezar por la Unidad 1</a>`}<a class="btn" href="#simulacro">Hacer un simulacro</a></div></div>
      <div class="sec-h"><h2>Cómo estudiar con esta web</h2></div>
      <div class="steps">
        <div class="step"><h4>Teoría en tarjetas</h4><p>Una idea por tarjeta. Mové los gráficos y contestá la pregunta del final antes de pasar.</p></div>
        <div class="step"><h4>Practicar</h4><p>Verdadero/falso y opción múltiple de la unidad, con la explicación de cada respuesta.</p></div>
        <div class="step"><h4>TP guiado</h4><p>La consigna, la receta para encararlo y la solución del profe revelada paso a paso.</p></div>
        <div class="step"><h4>Variantes en papel</h4><p>Resolvé las 5 variantes en hoja. Recién después mirá la solución y marcá si te salió.</p></div>
      </div>
      <div class="note"><span class="lbl">si te desconcentrás</span>Prendé el timer de arriba (25 minutos de foco, 5 de pausa). Hacé una lección entera por bloque y no más: el progreso queda guardado en este navegador.</div>
      <div class="sec-h"><h2>Unidades</h2><span class="eyebrow">Capítulos 1 a 6 · TP 1 a 8</span></div><div class="units">`;
    App.UNITS.forEach((u) => {
      const p = unitProgress(u);
      h += `<a class="unit-card" href="#u${u.n}"><div class="top"><span class="big">${u.n}</span><span class="chip">${u.caps}</span></div><h3>${u.title}</h3><p>${u.blurb}</p><div class="bar" aria-hidden="true"><i style="width:${p.pct * 100}%"></i></div><div class="bar-lbl"><span>${p.ld}/${p.L} lecciones · ${p.ed}/${p.E} ejercicios</span><span>${Math.round(p.pct * 100)} %</span></div></a>`;
    });
    h += `</div><p class="foot">Hecho a partir de los apuntes de la cátedra (capítulos 1–6) y las soluciones de los TP. El TP 8 no tiene solución publicada: está resuelto con el método del capítulo 6.</p>`;
    main().innerHTML = h;
  }

  function unitHeader(u, tab) {
    return `<div class="page-h"><span class="eyebrow">Unidad ${u.n} · ${u.caps}</span><h1>${u.title}</h1><p>${u.blurb}</p></div>
      <div class="tabs" role="tablist"><a class="tab-a ${tab === 't' ? 'on' : ''}" href="#u${u.n}">Teoría</a><a class="tab-a ${tab === 'q' ? 'on' : ''}" href="#u${u.n}-quiz">Practicar</a><a class="tab-a ${tab === 'e' ? 'on' : ''}" href="#u${u.n}-tps">TPs: ${u.tps}</a></div>`;
  }

  function viewUnit(u) {
    let h = unitHeader(u, 't') + `<div class="lesson-list">`;
    u.lessons.forEach((l, i) => {
      const done = Store.d.lessons[l.id], seen = Store.d.cards[l.id];
      h += `<a class="lesson-item" href="#u${u.n}-l${i + 1}"><span class="idx">${u.n}.${i + 1}</span><div><h4>${l.t}</h4><p>${l.d || ''}</p></div><span class="st">${done ? '<span class="chip ok">completa</span>' : seen != null ? `<span class="chip blue">${seen + 1}/${l.cards.length}</span>` : `<span class="chip">${l.cards.length} tarjetas</span>`}</span></a>`;
    });
    h += `</div><div class="sec-h"><h2>Después de la teoría</h2></div><div class="row"><a class="btn primary" href="#u${u.n}-quiz">Practicar la unidad</a><a class="btn" href="#u${u.n}-tps">Ir a los TP</a></div>`;
    main().innerHTML = h;
  }

  function viewLesson(u, li) {
    const l = u.lessons[li];
    if (!l) return viewUnit(u);
    let idx = Math.min(Store.d.cards[l.id] || 0, l.cards.length - 1);
    const all = !!Store.d.all;
    function cardHTML(c, i) {
      return `<article class="card anim" data-ci="${i}"><div class="card-k"><span class="eyebrow">Tarjeta ${i + 1} de ${l.cards.length}</span>${c.tag ? `<span class="chip blue">${c.tag}</span>` : ''}</div><h3>${c.t}</h3><div class="prose">${c.b || ''}</div>${c.w ? `<div data-w="${c.w}" data-o="${c.o || ''}"></div>` : ''}${c.b2 ? `<div class="prose" style="margin-top:12px">${c.b2}</div>` : ''}${c.q ? '<div class="check"></div>' : ''}</article>`;
    }
    function render() {
      const nextL = u.lessons[li + 1];
      let h = `<div class="page-h"><span class="eyebrow">Unidad ${u.n} · Lección ${li + 1} de ${u.lessons.length}</span><h1>${l.t}</h1></div>`;
      h += `<div class="lesson-bar"><div class="dots">${l.cards.map((_, i) => `<button type="button" aria-label="Tarjeta ${i + 1}" data-go="${i}" class="${i === idx ? 'cur' : i < idx || Store.d.lessons[l.id] ? 'done' : ''}"></button>`).join('')}</div><button type="button" class="btn small ghost" id="allTog">${all ? 'Ver de a una' : 'Ver todas juntas'}</button></div>`;
      h += `<div class="main-col" id="cards">${all ? l.cards.map(cardHTML).join('') : cardHTML(l.cards[idx], idx)}</div>`;
      h += `<div class="lesson-nav main-col">${all ? '' : `<button type="button" class="btn" id="prev" ${idx === 0 ? 'disabled' : ''}>Anterior</button>`}`;
      if (all || idx === l.cards.length - 1) h += nextL ? `<a class="btn primary" id="fin" href="#u${u.n}-l${li + 2}">Terminé · siguiente lección</a>` : `<a class="btn primary" id="fin" href="#u${u.n}-quiz">Terminé · a practicar</a>`;
      else h += `<button type="button" class="btn primary" id="next">Siguiente</button>`;
      h += `</div>`;
      main().innerHTML = h;
      $$('#cards .card').forEach((art) => {
        const c = l.cards[+art.dataset.ci];
        if (c.q) mountCheck($('.check', art), c.q);
      });
      renderMath($('#cards')); mountWidgets($('#cards'));
      $$('.dots button').forEach((b) => b.addEventListener('click', () => { idx = +b.dataset.go; if (Store.d.all) { Store.d.all = false; } save(); render(); }));
      const p = $('#prev'), n = $('#next'), fin = $('#fin');
      if (p) p.addEventListener('click', () => { idx--; save(); render(); scrollTop(); });
      if (n) n.addEventListener('click', () => { idx++; save(); render(); scrollTop(); });
      if (fin) fin.addEventListener('click', () => { Store.d.lessons[l.id] = true; Store.save(); toast('Lección completa'); });
      $('#allTog').addEventListener('click', () => { Store.d.all = !Store.d.all; Store.save(); viewLesson(u, li); });
    }
    function save() { Store.d.cards[l.id] = idx; Store.save(); }
    save();
    render();
  }

  function scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

  function runQuiz(host, items, opts = {}) {
    let order = items.slice(), i = 0, ok = 0; const wrong = [];
    function q() {
      if (i >= order.length) return end();
      host.innerHTML = `<div class="lesson-bar"><div class="dots">${order.map((_, j) => `<button type="button" tabindex="-1" aria-hidden="true" class="${j < i ? 'done' : j === i ? 'cur' : ''}"></button>`).join('')}</div><span class="chip">${ok} bien</span></div><article class="card main-col"><div class="card-k"><span class="eyebrow">Pregunta ${i + 1} de ${order.length}</span>${order[i].u ? `<span class="chip">U${order[i].u}</span>` : ''}</div><div class="qh"></div><div class="lesson-nav" style="margin-top:14px"><span></span><button type="button" class="btn primary" id="qn" hidden>${i === order.length - 1 ? 'Ver resultado' : 'Siguiente'}</button></div></article>`;
      mountCheck($('.qh', host), order[i], (good) => { if (good) ok++; else wrong.push(order[i]); $('#qn', host).hidden = false; });
      $('#qn', host).addEventListener('click', () => { i++; q(); });
    }
    function end() {
      const sc = ok / order.length;
      opts.onEnd && opts.onEnd(sc);
      host.innerHTML = `<article class="card main-col"><span class="eyebrow">Resultado</span><div class="score" style="margin:8px 0">${ok}/${order.length}</div><p>${sc >= 0.8 ? 'Muy bien. Pasá a los TP de esta unidad.' : sc >= 0.6 ? 'Vas bien. Repasá las que fallaste y volvé a intentar.' : 'Conviene repasar la teoría de las preguntas que fallaste antes de los TP.'}</p><div class="row">${wrong.length ? '<button type="button" class="btn primary" id="rw">Repetir las que fallé</button>' : ''}<button type="button" class="btn" id="ra">Empezar de nuevo</button>${opts.after || ''}</div></article>`;
      const rw = $('#rw', host); if (rw) rw.addEventListener('click', () => { order = wrong.splice(0); i = 0; ok = 0; q(); });
      $('#ra', host).addEventListener('click', () => { order = shuffle(Math.random, items); i = 0; ok = 0; wrong.length = 0; q(); });
    }
    q();
  }

  function viewQuiz(u) {
    main().innerHTML = unitHeader(u, 'q') + `<p style="color:var(--ink-2);margin-top:-6px">${u.quiz.length} preguntas. Contestá, leé la explicación y seguí.${Store.d.quiz[u.id] != null ? ` Tu mejor resultado: <b>${Math.round(Store.d.quiz[u.id] * 100)} %</b>.` : ''}</p><div id="qz"></div>`;
    runQuiz($('#qz'), shuffle(Math.random, u.quiz), { onEnd: (sc) => { Store.d.quiz[u.id] = Math.max(Store.d.quiz[u.id] || 0, sc); Store.save(); sideNav('u' + u.n + '-quiz'); }, after: `<a class="btn" href="#u${u.n}-tps">Ir a los TP</a>` });
  }

  function viewTPs(u) {
    let h = unitHeader(u, 'e') + `<div class="ex-list">`;
    (u.exercises || []).forEach((e) => {
      const marks = Object.keys(Store.d.ex).filter((k) => k.startsWith(e.id + ':'));
      const okN = marks.filter((k) => Store.d.ex[k] === 'ok').length;
      h += `<a class="ex-item" href="#${e.id}"><span class="tp">${e.tp} · Ej. ${e.num}</span><div><h4>${e.title}</h4><p>${e.sum}</p></div><span>${okN ? `<span class="chip ok">${okN} variante${okN > 1 ? 's' : ''} bien</span>` : '<span class="chip">sin hacer</span>'}</span></a>`;
    });
    h += '</div>';
    main().innerHTML = h;
  }

  function viewExercise(u, e) {
    let h = `<div class="page-h"><span class="eyebrow"><a href="#u${u.n}-tps">Unidad ${u.n} · TPs</a> · ${e.tp} · Ejercicio ${e.num}</span><h1>${e.title}</h1><p>${e.sum}</p></div>
      <details class="fold main-col"><summary>Consigna original del TP</summary><div class="fold-b prose">${e.consigna}</div></details>
      <div class="sec-h"><h2>Antes de arrancar</h2></div><article class="card main-col"><div class="prose">${e.plan}</div></article>
      <div class="sec-h"><h2>Cómo lo resuelve el profe</h2><span class="eyebrow">paso a paso</span></div><div class="main-col" id="prof"></div>`;
    if (e.errores && e.errores.length) h += `<div class="sec-h"><h2>Errores que bajan puntos</h2></div><div class="note warn main-col"><span class="lbl">ojo</span><ul style="margin:0;padding-left:1.2em">${e.errores.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;
    if (e.practice) h += `<div class="sec-h"><h2>Ahora vos: variantes para hacer en papel</h2></div><div class="main-col"><div class="var-tabs" id="vt"></div><div id="vbody"></div></div>`;
    main().innerHTML = h;
    renderMath(main());
    stepsReveal($('#prof'), e.profe, { firstLabel: 'Ver el primer paso del profe' });
    if (e.practice) mountPractice(e);
  }

  function mountPractice(e) {
    const pr = e.practice;
    const vt = $('#vt'), vb = $('#vbody');
    let cur = 0, seedR = 0;
    function tabs() {
      vt.innerHTML = '';
      pr.fixed.forEach((_, i) => {
        const st = Store.d.ex[e.id + ':' + i];
        const b = document.createElement('button'); b.type = 'button'; b.className = cur === i ? 'on' : '';
        b.innerHTML = `<span class="dot ${st === 'ok' ? 'ok' : st === 'rev' ? 'rev' : ''}"></span>Variante ${i + 1}`;
        b.addEventListener('click', () => { cur = i; tabs(); body(); }); vt.appendChild(b);
      });
      if (pr.random) { const b = document.createElement('button'); b.type = 'button'; b.className = cur === 'r' ? 'on' : ''; b.textContent = 'Nueva al azar'; b.addEventListener('click', () => { cur = 'r'; seedR = Math.floor(Math.random() * 1e9); tabs(); body(); }); vt.appendChild(b); }
    }
    function body() {
      const p = cur === 'r' ? pr.random(rng(seedR)) : pr.fixed[cur];
      let x;
      try { x = pr.build(p); } catch (err) { console.error(err); vb.innerHTML = '<p>No se pudo generar esta variante. Probá otra.</p>'; return; }
      vb.innerHTML = `<div class="enun"><span class="eyebrow">${cur === 'r' ? 'Variante al azar' : 'Variante ' + (cur + 1)}</span><div class="prose">${x.enun}</div><p class="paper-hint">Hacelo en papel primero. Después mirá.</p><div id="inter"></div></div><div id="vsol" style="margin-top:14px"></div><div class="row" id="vmark" style="margin-top:14px" hidden><span style="font-size:.9rem;color:var(--ink-2)">¿Cómo te fue?</span><button type="button" class="btn small" data-m="ok">Me salió bien</button><button type="button" class="btn small" data-m="rev">Tengo que repasarlo</button></div>`;
      const inter = $('#inter'); let comp = null;
      if (x.arrows) {
        const specs = Array.isArray(x.arrows) ? x.arrows : [x.arrows];
        inter.innerHTML = '<p class="arrow-legend">Tocá cada casillero para elegir: ↑ sube · ↓ baja · = no cambia · ? ambiguo</p>';
        const ts = specs.map((s) => arrowsTable(inter, s));
        const r = document.createElement('div'); r.className = 'row'; r.style.marginTop = '10px'; inter.appendChild(r);
        btn(r, 'Corregir mis flechas', () => { let ok = 0, tot = 0; ts.forEach((t) => { const [a, b] = t.check(); ok += a; tot += b; }); toast(`${ok} de ${tot} bien`); }, 'btn');
        comp = { reveal: () => ts.forEach((t) => t.reveal()) };
      }
      if (x.classify) {
        const g = classifyGame(inter, x.classify);
        const r = document.createElement('div'); r.className = 'row'; r.style.marginTop = '10px'; inter.appendChild(r);
        btn(r, 'Corregir', () => { const [a, b] = g.check(); toast(`${a} de ${b} bien`); }, 'btn');
        comp = g;
      }
      stepsReveal($('#vsol'), x.steps, { firstLabel: 'Ver la solución paso a paso', onDone: () => { $('#vmark').hidden = false; comp && comp.reveal && comp.reveal(); } });
      $$('#vmark button').forEach((b) => b.addEventListener('click', () => { if (cur === 'r') { toast('Anotado'); return; } Store.d.ex[e.id + ':' + cur] = b.dataset.m; Store.save(); tabs(); toast(b.dataset.m === 'ok' ? 'Bien ahí' : 'Queda marcada para repasar'); sideNav(e.id); }));
      renderMath(vb); mountWidgets(vb);
    }
    tabs(); body();
  }

  function viewFormulas() {
    let h = `<div class="page-h"><span class="eyebrow">Para tener a mano</span><h1>Hoja de fórmulas</h1><p>Tocá una fórmula para ver qué es cada símbolo, qué significa y un ejemplo con números. Escribí para filtrar.</p></div><input class="f-search main-col" id="fs" type="search" placeholder="Buscar: deflactor, Fisher, PMK, cuenta corriente…" aria-label="Buscar fórmula"><div id="fl"></div>`;
    main().innerHTML = h;
    const FX = App.FX || {};
    const fxText = (x) => { const e = FX[x.n]; return e ? e.m + ' ' + e.ej + ' ' + e.s.map((p) => p.join(' ')).join(' ') : ''; };
    function item(x) {
      const e = FX[x.n];
      if (!e) return `<div class="f-item"><div class="fn">${x.n}</div><div>$$${x.tex}$$</div><p>${x.d}</p></div>`;
      return `<details class="f-item fx"><summary><span class="fn">${x.n}</span><span class="fx-more">Ver explicación</span><div>$$${x.tex}$$</div><p>${x.d}</p></summary>
        <div class="fx-body"><h4>Qué es cada símbolo</h4><table class="fx-sym">${e.s.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</table>
        <h4>Qué significa</h4><p>${e.m}</p><div class="ex"><span class="lbl">ejemplo con números</span>${e.ej}</div></div></details>`;
    }
    function paint(q) {
      q = (q || '').toLowerCase();
      let s = '';
      App.UNITS.forEach((u) => {
        const items = (u.formulas || []).filter((x) => !q || (x.n + ' ' + x.d + ' ' + x.tex + ' ' + fxText(x)).toLowerCase().includes(q));
        if (!items.length) return;
        s += `<div class="sec-h"><h2>U${u.n} · ${u.title}</h2></div><div class="f-grid main-col">` + items.map(item).join('') + '</div>';
      });
      $('#fl').innerHTML = s || '<p>No hay fórmulas con ese nombre.</p>';
      renderMath($('#fl'));
    }
    $('#fs').addEventListener('input', (ev) => paint(ev.target.value));
    paint('');
  }

  function viewSim() {
    const pool = []; App.UNITS.forEach((u) => u.quiz.forEach((q) => pool.push(Object.assign({ u: u.n }, q))));
    main().innerHTML = `<div class="page-h"><span class="eyebrow">Repaso mezclado</span><h1>Simulacro</h1><p>15 preguntas al azar de todas las unidades. En el final no te avisan de qué tema es cada pregunta: acá tampoco. Después hacé una variante al azar de cada TP.</p></div><div id="qz"></div>`;
    runQuiz($('#qz'), shuffle(Math.random, pool).slice(0, 15));
  }

  /* ============================== modo scroll (feed tipo TikTok) ============================== */
  function feedSlides(units) {
    const S = [];
    units.forEach((u) => {
      S.push({ k: 'intro', u });
      // cada pregunta y fórmula va después de la lección donde se enseña (u.order); si falta, al final de la unidad
      const ord = u.order || {}, L = u.lessons.length;
      const lessonOf = (arr, i) => (arr && arr[i] >= 1 && arr[i] <= L ? arr[i] - 1 : L - 1);
      u.lessons.forEach((l, li) => {
        S.push({ k: 'lesson', u, l, li });
        l.cards.forEach((c, ci) => {
          S.push({ k: 'card', u, l, li, c, ci });
          if (c.q) S.push({ k: 'q', u, q: c.q, tag: '¿Lo entendiste?' });
        });
        const qs = u.quiz.filter((_, i) => lessonOf(ord.q, i) === li);
        const fs = (u.formulas || []).filter((_, i) => lessonOf(ord.f, i) === li);
        // intercalar: pregunta, fórmula, pregunta...
        for (let k = 0; k < Math.max(qs.length, fs.length); k++) {
          if (qs[k]) S.push({ k: 'q', u, q: qs[k], tag: qs[k].k === 'vf' ? '¿Verdadero o falso?' : 'Elegí la correcta' });
          if (fs[k]) S.push({ k: 'f', u, fm: fs[k] });
        }
      });
      S.push({ k: 'end', u });
    });
    return S;
  }
  function slideHTML(s, i, n) {
    const hint = i < n - 1 ? '<div class="fs-hint" aria-hidden="true">deslizá para arriba</div>' : '';
    const eb = (t) => `<span class="eyebrow">${t}</span>`;
    let inner = '', cls = '';
    if (s.k === 'intro') {
      cls = 'fs-intro';
      inner = `${eb('Unidad ' + s.u.n + ' · ' + s.u.caps)}<h2 class="fs-big">${s.u.title}</h2><p>${s.u.blurb}</p><p class="fs-small">${s.u.lessons.length} lecciones · preguntas y fórmulas en el medio</p>`;
    } else if (s.k === 'lesson') {
      cls = 'fs-lesson';
      inner = `${eb('Lección ' + s.u.n + '.' + (s.li + 1))}<h2 class="fs-big">${s.l.t}</h2><p>${s.l.d || ''}</p><p class="fs-small">${s.l.cards.length} tarjetas</p>`;
    } else if (s.k === 'card') {
      const c = s.c;
      inner = `${eb('U' + s.u.n + ' · ' + s.l.t + ' · ' + (s.ci + 1) + '/' + s.l.cards.length)}<h3>${c.t}</h3><div class="prose">${c.b || ''}</div>${c.w ? `<div data-w="${c.w}" data-o="${c.o || ''}"></div>` : ''}${c.b2 ? `<div class="prose" style="margin-top:10px">${c.b2}</div>` : ''}`;
    } else if (s.k === 'q') {
      cls = 'fs-q';
      inner = `<span class="chip blue">${s.tag}</span><div class="check fq"></div>`;
    } else if (s.k === 'f') {
      cls = 'fs-f';
      const e = (App.FX || {})[s.fm.n];
      inner = `${eb('Fórmula · U' + s.u.n)}<h3>${s.fm.n}</h3><div>$$${s.fm.tex}$$</div>` + (e ? `<table class="fx-sym">${e.s.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</table><p style="margin:10px 0 6px">${e.m}</p><div class="ex"><span class="lbl">ejemplo</span>${e.ej}</div>` : `<p>${s.fm.d}</p>`);
    } else if (s.k === 'end') {
      cls = 'fs-intro';
      const nx = unitById(s.u.n + 1);
      inner = `${eb('Terminaste la unidad ' + s.u.n)}<h2 class="fs-big">Ahora, los TP</h2><p>La teoría ya la viste. Lo que más suma en el examen es resolver los ejercicios en papel.</p><div class="row" style="margin-top:14px"><a class="btn primary" href="#u${s.u.n}-tps">Ir a los TP de la unidad ${s.u.n}</a>${nx ? `<a class="btn" href="#feed-u${nx.n}">Seguir con la unidad ${nx.n}</a>` : '<a class="btn" href="#simulacro">Hacer un simulacro</a>'}</div>`;
    }
    return `<section class="fslide ${cls}" data-i="${i}"><div class="fslide-in">${inner}</div>${hint}</section>`;
  }
  function viewFeed(only) {
    const units = only ? [unitById(only)] : App.UNITS;
    const key = only ? 'u' + only : 'all';
    const S = feedSlides(units), n = S.length;
    Store.d.feed = Store.d.feed || {};
    const chips = [['feed', 'Todo', !only]].concat(App.UNITS.map((u) => ['feed-u' + u.n, 'U' + u.n, only === u.n]));
    main().innerHTML = `<div class="feed" id="feed"><div class="feed-top"><a class="tb-btn" href="#inicio">Salir</a><div class="feed-chips">${chips.map(([h, t, on]) => `<a class="tab-a ${on ? 'on' : ''}" href="#${h}">${t}</a>`).join('')}</div><span class="feed-count num" id="fcount">1/${n}</span><div class="feed-bar"><i id="fbar"></i></div></div>${S.map((s, i) => slideHTML(s, i, n)).join('')}</div>`;
    const feed = $('#feed'), slides = $$('.fslide', feed);
    function mount(el) {
      if (el.dataset.ready) return; el.dataset.ready = '1';
      const s = S[+el.dataset.i];
      if (s.k === 'q') mountCheck($('.fq', el), s.q);
      renderMath(el); mountWidgets(el);
    }
    function seen(i) {
      $('#fcount').textContent = (i + 1) + '/' + n;
      $('#fbar').style.width = ((i + 1) / n) * 100 + '%';
      Store.d.feed[key] = i;
      const s = S[i];
      if (s.k === 'card') {
        Store.d.cards[s.l.id] = Math.max(Store.d.cards[s.l.id] || 0, s.ci);
        if (s.ci === s.l.cards.length - 1) Store.d.lessons[s.l.id] = true;
      }
      Store.save();
    }
    if ('IntersectionObserver' in window) {
      const pre = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) mount(e.target); }), { root: feed, rootMargin: '150% 0px' });
      const cur = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) seen(+e.target.dataset.i); }), { root: feed, threshold: 0.6 });
      slides.forEach((el) => { pre.observe(el); cur.observe(el); });
    } else slides.forEach(mount);
    const start = Math.min(Store.d.feed[key] || 0, n - 1);
    mount(slides[start]);
    requestAnimationFrame(() => { feed.scrollTop = slides[start].offsetTop; seen(start); });
  }

  /* ============================== router ============================== */
  function route() {
    const hsh = (location.hash || '#inicio').slice(1) || 'inicio';
    let m, active = hsh;
    const isFeed = /^feed(-u\d+)?$/.test(hsh);
    document.body.classList.toggle('feed-on', isFeed);
    if (isFeed) { m = hsh.match(/^feed-u(\d+)$/); viewFeed(m && unitById(+m[1]) ? +m[1] : null); }
    else if (hsh === 'inicio') viewHome();
    else if (hsh === 'formulas') viewFormulas();
    else if (hsh === 'simulacro') viewSim();
    else if ((m = hsh.match(/^u(\d+)$/)) && unitById(+m[1])) viewUnit(unitById(+m[1]));
    else if ((m = hsh.match(/^u(\d+)-l(\d+)$/)) && unitById(+m[1])) { viewLesson(unitById(+m[1]), +m[2] - 1); active = 'u' + m[1]; }
    else if ((m = hsh.match(/^u(\d+)-quiz$/)) && unitById(+m[1])) viewQuiz(unitById(+m[1]));
    else if ((m = hsh.match(/^u(\d+)-tps$/)) && unitById(+m[1])) viewTPs(unitById(+m[1]));
    else if (exById(hsh)) { const { u, e } = exById(hsh); viewExercise(u, e); }
    else { viewHome(); active = 'inicio'; }
    Store.d.last = hsh; Store.save();
    sideNav(active);
    const bk = isFeed ? 'feed' : ['inicio', 'formulas', 'simulacro'].includes(hsh) ? hsh : '';
    $$('.bnav [data-b]').forEach((a) => { const on = a.dataset.b === bk; a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    const bu = $('#bnavUnits'); if (bu) bu.classList.toggle('on', !bk && hsh !== 'inicio');
    if (!isFeed) window.scrollTo(0, 0);
    const ttl = document.querySelector('.page-h h1, .home-hero h1');
    document.title = (hsh === 'inicio' || !ttl ? '' : ttl.textContent + ' · ') + 'Cuaderno de Economía II';
  }

  /* ============================== timer de foco ============================== */
  function timer() {
    const b = $('#timer'); if (!b) return;
    let mode = 'foco', left = 25 * 60, t = null;
    const paint = () => { const m = Math.floor(left / 60), s = left % 60; b.innerHTML = (mode === 'foco' ? '<span class="lg">Foco </span>' : 'Pausa ') + m + ':' + String(s).padStart(2, '0'); b.classList.toggle('run', !!t); };
    b.addEventListener('click', () => {
      if (t) { clearInterval(t); t = null; paint(); return; }
      t = setInterval(() => { left--; if (left <= 0) { clearInterval(t); t = null; if (mode === 'foco') { mode = 'pausa'; left = 5 * 60; toast('Terminó el bloque. Pausa de 5 minutos.'); } else { mode = 'foco'; left = 25 * 60; toast('Pausa terminada. ¿Otro bloque?'); } } paint(); }, 1000);
      paint();
    });
    b.addEventListener('dblclick', () => { clearInterval(t); t = null; mode = 'foco'; left = 25 * 60; paint(); });
    paint();
  }

  function themeToggle() {
    const b = $('#themeBtn'); if (!b) return;
    const root = document.documentElement;
    const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const paint = () => { b.innerHTML = '<span class="lg">Modo </span>' + (isDark() ? 'claro' : 'oscuro'); };
    root.dataset.theme = Store.d.theme || 'light';
    b.addEventListener('click', () => { const t = isDark() ? 'light' : 'dark'; root.dataset.theme = t; Store.d.theme = t; Store.save(); paint(); });
    paint();
  }

  App.start = function () {
    Store.load();
    themeToggle();
    App.UNITS.sort((a, b) => a.n - b.n);
    $('#menuBtn').addEventListener('click', () => $('#side').classList.add('open'));
    const bu = $('#bnavUnits'); if (bu) bu.addEventListener('click', () => $('#side').classList.add('open'));
    timer();
    window.addEventListener('hashchange', route);
    // en el celular, abrir directo en el modo scroll
    const phone = window.matchMedia && window.matchMedia('(max-width: 720px)').matches;
    if (phone && (!location.hash || location.hash === '#' || location.hash === '#inicio')) { try { history.replaceState(null, '', '#feed'); } catch (e) { /* sigue sin hash */ } }
    route();
  };
})();
