/* Unidad 1 · Capítulos 1 y 2 · TP 1 y TP 2 */
(function () {
  const T = String.raw;
  const { f, ft, pct, pt, rng, randInt, pick, shuffle, table } = App.h;

  /* ------------------------------------------------------------------ */
  /* TP 1 · Ejercicio 1: flujos y stocks                                */
  /* ------------------------------------------------------------------ */
  const POOL = [
    ['Consumo de los hogares', 'Flujo', 'se mide por período: tanto consumo por año.'],
    ['Stock de capital (máquinas, edificios)', 'Stock', 'es lo que hay en un momento dado.'],
    ['Depreciación del capital', 'Flujo', 'es cuánto capital se gasta durante el año.'],
    ['Déficit fiscal', 'Flujo', 'gasto menos ingresos durante un año. Su stock asociado es la deuda.'],
    ['Deuda de las empresas', 'Stock', 'es lo que se debe en una fecha.'],
    ['Salario mensual', 'Flujo', 'ya dice el período: por mes.'],
    ['Cantidad de personas empleadas', 'Stock', 'es una foto: cuántas personas tienen empleo hoy.'],
    ['Horas trabajadas en el año', 'Flujo', 'se acumulan durante el período.'],
    ['Patrimonio de una familia', 'Stock', 'es la riqueza en una fecha.'],
    ['Intereses pagados por una deuda', 'Flujo', 'se pagan durante un período.'],
    ['Base monetaria', 'Stock', 'cantidad de dinero existente en un momento.'],
    ['Variación de reservas del Banco Central', 'Flujo', 'es cuánto cambiaron durante el período.'],
    ['Nacimientos en el año', 'Flujo', 'se cuentan durante un período.'],
    ['Cantidad de viviendas del país', 'Stock', 'es lo que hay en una fecha.'],
    ['Construcción de viviendas nuevas', 'Flujo', 'viviendas terminadas por año: es inversión.'],
    ['Depósitos bancarios a fin de mes', 'Stock', 'la fecha lo delata: es el saldo en un momento.'],
    ['Ingreso de una persona', 'Flujo', 'se cobra por período.'],
    ['Inventarios de una empresa', 'Stock', 'mercadería guardada en una fecha.'],
    ['Variación de inventarios', 'Flujo', 'es parte de la inversión del período.'],
    ['Exportaciones de soja', 'Flujo', 'toneladas vendidas al exterior por año.'],
    ['Tierras cultivables', 'Stock', 'hectáreas existentes en un momento.'],
    ['Recaudación del IVA', 'Flujo', 'se recauda durante un período.'],
    ['Jubilaciones pagadas en el mes', 'Flujo', 'pagos durante el mes.'],
    ['Cantidad de jubilados', 'Stock', 'personas jubiladas hoy.'],
    ['Préstamos otorgados en el año', 'Flujo', 'créditos nuevos durante el año.'],
    ['Saldo de la tarjeta de crédito hoy', 'Stock', 'lo que debés en este momento.'],
    ['Ganancias de una empresa', 'Flujo', 'beneficios durante el ejercicio.'],
    ['Activos de un banco', 'Stock', 'lo que tiene en una fecha (balance).'],
  ];
  const clsBuild = (p) => ({
    enun: `<p>Clasificá cada variable como <b>flujo</b> o <b>stock</b>. Pensalo antes de tocar: ¿se mide en un instante o durante un período?</p>`,
    classify: { options: ['Flujo', 'Stock'], items: p.items.map((i) => [POOL[i][0], POOL[i][1]]) },
    steps: [
      { t: 'La pregunta que decide', b: `<p>Flujo: tiene sentido decir «por año» (o por mes). Stock: es una foto en un momento. Si podés decir «hoy hay tanto», es stock.</p>` },
      { t: 'Respuestas', b: table(['Variable', 'Tipo', 'Por qué'], p.items.map((i) => [POOL[i][0], `<b>${POOL[i][1]}</b>`, POOL[i][2]])) },
    ],
  });
  const clsFixed = [[0, 1, 2, 3, 4, 5, 6, 7], [8, 9, 10, 11, 12, 13, 14, 15], [16, 17, 18, 19, 20, 21, 22, 23], [24, 25, 26, 27, 0, 3, 13, 18], [1, 5, 9, 11, 15, 17, 21, 25]].map((items) => ({ items }));

  /* ------------------------------------------------------------------ */
  /* TP 1 · Ejercicio 2: tasas de crecimiento                           */
  /* ------------------------------------------------------------------ */
  function growthData(R) {
    const y0 = randInt(R, 2008, 2018), n = 6;
    const Q = [randInt(R, 8, 15) * 100], P = [randInt(R, 30, 90) * 10], N = [randInt(R, 200, 450) / 10];
    const infl = [0.01, 0.02, 0.04, 0.12, 0.25, 0.45];
    const start = randInt(R, 0, 2);
    for (let i = 1; i < n; i++) {
      Q.push(Math.round(Q[i - 1] * (1 + randInt(R, 10, 90) / 1000)));
      P.push(Math.round(P[i - 1] * (1 + infl[Math.min(5, start + i - 1)] + randInt(R, -5, 5) / 1000)));
      N.push(Math.round(N[i - 1] * (1 + randInt(R, 15, 55) / 1000) * 10) / 10);
    }
    return { years: Array.from({ length: n }, (_, i) => y0 + i), Q, P, N };
  }
  const g = (a, b) => (b - a) / a;
  const r2 = (x) => Math.round(x * 10000) / 10000; // tasa redondeada a 2 decimales en %
  function growthBuild(p) {
    const { years, Q, P, N } = p, n = years.length;
    const gQ = [], gP = [], gN = [], V = Q.map((q, i) => q * P[i]), VpH = V.map((v, i) => v / N[i]), gV = [], gVh = [];
    for (let i = 1; i < n; i++) { gQ.push(r2(g(Q[i - 1], Q[i]))); gP.push(r2(g(P[i - 1], P[i]))); gN.push(r2(g(N[i - 1], N[i]))); gV.push(r2(g(V[i - 1], V[i]))); gVh.push(r2(g(VpH[i - 1], VpH[i]))); }
    const sum = (a) => a.reduce((s, x) => s + x, 0);
    const tca = (a) => g(a[0], a[n - 1]);
    const yrs = years.slice(1);
    const enun = `<p>Una economía produce un único bien. Con estos datos resolvé los 5 incisos del TP 1 (tasas anuales, acumulada vs suma, valor de la producción y por habitante, y las dos comparaciones).</p>` +
      table(['Año', 'Cantidad (ton)', 'Precio (pesos/ton)', 'Población (millones)'], years.map((y, i) => [y, f(Q[i], 0), f(P[i], 0), f(N[i], 1)]));
    const steps = [
      { t: 'Inciso 1 · Tasa de crecimiento anual de cada variable', b: `<p>Para cada par de años consecutivos: $g = \\frac{X_{t+1} - X_t}{X_t}\\cdot 100$. Por ejemplo, para la cantidad:</p>$$g_{${years[0]},${years[1]}} = \\frac{${Q[1]} - ${Q[0]}}{${Q[0]}}\\cdot 100 = ${pt(gQ[0])}$$` + table(['Año', 'Cantidad', 'Precio', 'Población'], yrs.map((y, i) => [y, pct(gQ[i]), pct(gP[i]), pct(gN[i])])) },
      { t: 'Inciso 2 · Acumulada vs suma de tasas', b: `<p>Suma de tasas: $STC = g_1 + g_2 + \\dots$. Tasa acumulada: $TCA = \\frac{X_{${years[n - 1]}} - X_{${years[0]}}}{X_{${years[0]}}}\\cdot 100$.</p><p>Para la cantidad: $TCA = \\frac{${Q[n - 1]} - ${Q[0]}}{${Q[0]}}\\cdot 100 = ${pt(tca(Q))}$.</p>` + table(['', 'Cantidad', 'Precio', 'Población'], [['STC (suma)', pct(sum(gQ), 1), pct(sum(gP), 1), pct(sum(gN), 1)], ['TCA (acumulada)', pct(tca(Q), 1), pct(tca(P), 1), pct(tca(N), 1)], ['Diferencia', pct(tca(Q) - sum(gQ), 1), pct(tca(P) - sum(gP), 1), pct(tca(N) - sum(gN), 1)]]) + `<div class="note"><span class="lbl">conclusión</span>La acumulada siempre supera a la suma (crecimiento compuesto). La aproximación es más precisa cuanto <b>más chicas</b> son las tasas anuales: por eso falla más en el precio${sum(gP) > sum(gQ) ? ', que tiene las tasas más grandes' : ''}.</div>` },
      { t: 'Inciso 3 · Valor de la producción y por habitante', b: `<p>$VP = P\\cdot Q$ y $VPpH = \\frac{VP}{\\text{Población}}$. Las tasas se calculan con la misma fórmula.</p>` + table(['Año', 'VP', 'VP por hab.', 'g VP', 'g VP por hab.'], years.map((y, i) => [y, f(V[i], 0), f(VpH[i], 0), i ? pct(gV[i - 1]) : '—', i ? pct(gVh[i - 1]) : '—'])) },
      { t: 'Inciso 4 · ¿g VP ≈ g Q + g P?', b: table(['Año', 'g Q', 'g P', 'Suma', 'g VP', 'Discrepancia'], yrs.map((y, i) => [y, pct(gQ[i]), pct(gP[i]), pct(gQ[i] + gP[i]), pct(gV[i]), pct(gV[i] - gQ[i] - gP[i])])) + `<div class="note"><span class="lbl">conclusión</span>La discrepancia es el producto $g_Q\\cdot g_P$: crece cuanto más grandes son las tasas. Con tasas chicas es casi indistinto.</div>` },
      { t: 'Inciso 5 · ¿g VP por hab. ≈ g VP − g población?', b: table(['Año', 'g VP', 'g Pob.', 'Resta', 'g VP por hab.', 'Discrepancia'], yrs.map((y, i) => [y, pct(gV[i]), pct(gN[i]), pct(gV[i] - gN[i]), pct(gVh[i]), pct(gVh[i] - gV[i] + gN[i])])) + `<div class="note"><span class="lbl">conclusión</span>La resta aproxima la tasa por habitante. La exacta es $\\frac{1+g_{VP}}{1+g_N} - 1$; la discrepancia crece con las tasas.</div>` },
    ];
    return { enun, steps };
  }

  /* ------------------------------------------------------------------ */
  /* TP 2: datos de la economía con 4 sectores                          */
  /* ------------------------------------------------------------------ */
  const PROF_TP2 = {
    names: ['Vino', 'Ostras', 'Leche', 'Queso'], units: ['lts', 'kgs', 'lts', 'kgs'], k: 2, kTxt: 'la producción de un kg de queso requiere dos litros de leche',
    years: [2000, 2010, 2020],
    Q: [[80, 30, 500, 80], [100, 40, 600, 100], [110, 42, 600, 120]],
    P: [[1, 4, 0.5, 2], [1.5, 10, 1, 4], [1.8, 12, 1.2, 4.8]],
    CL: [[50, 100, 200, 50], [120, 330, 450, 100], [165, 344, 560, 128]],
    basket: [2, 1, 4, 2], H: 1000,
  };
  const SETS = [
    { names: ['Pan', 'Pescado', 'Trigo', 'Harina'], units: ['kgs', 'kgs', 'kgs', 'kgs'], k: 1.5, kTxt: 'producir un kg de harina requiere 1,5 kg de trigo' },
    { names: ['Café', 'Libros', 'Naranjas', 'Jugo'], units: ['kgs', 'u.', 'kgs', 'lts'], k: 2, kTxt: 'producir un litro de jugo requiere dos kg de naranjas' },
    { names: ['Remeras', 'Cortes de pelo', 'Uva', 'Vino'], units: ['u.', 'u.', 'kgs', 'lts'], k: 1.5, kTxt: 'producir un litro de vino requiere 1,5 kg de uva' },
    { names: ['Yerba', 'Clases', 'Cacao', 'Chocolate'], units: ['kgs', 'horas', 'kgs', 'kgs'], k: 2, kTxt: 'producir un kg de chocolate requiere dos kg de cacao' },
  ];
  function tp2Data(R, set) {
    const y0 = pick(R, [2000, 2004, 2005, 2008]), step = pick(R, [6, 8, 10]);
    const Q0 = [randInt(R, 6, 12) * 10, randInt(R, 2, 5) * 10, randInt(R, 40, 70) * 10, randInt(R, 6, 12) * 10];
    const P0 = [pick(R, [1, 1.5, 2]), pick(R, [3, 4, 5]), pick(R, [0.5, 1]), pick(R, [2, 3, 4])];
    if (P0[3] < set.k * P0[2] * 1.4) P0[3] = Math.ceil(set.k * P0[2] * 2);
    const Q = [Q0], P = [P0];
    for (let t = 1; t < 3; t++) {
      Q.push(Q[t - 1].map((q, i) => Math.round(q * (1 + randInt(R, 0, 25) / 100) / (i === 1 ? 1 : 10)) * (i === 1 ? 1 : 10)));
      const inf = t === 1 ? randInt(R, 60, 140) / 100 : randInt(R, 10, 35) / 100;
      P.push(P[t - 1].map((pp) => Math.round(pp * (1 + inf + randInt(R, -15, 15) / 100) * 10) / 10));
    }
    // el insumo usado no puede superar lo producido
    for (let t = 0; t < 3; t++) if (Q[t][2] < set.k * Q[t][3] * 1.3) Q[t][2] = Math.ceil((set.k * Q[t][3] * 1.6) / 10) * 10;
    const CL = Q.map((q, t) => q.map((qq, i) => {
      const va = i === 3 ? P[t][3] * qq - P[t][2] * set.k * qq : P[t][i] * qq;
      return Math.round((va * randInt(R, 45, 80)) / 100);
    }));
    const basket = [randInt(R, 1, 3), randInt(R, 1, 2), randInt(R, 2, 5), randInt(R, 1, 3)];
    return Object.assign({}, set, { years: [y0, y0 + step, y0 + 2 * step], Q, P, CL, basket, H: 1000 });
  }
  function tp2Tbl(d) {
    const rows = [];
    d.years.forEach((y, t) => d.names.forEach((nm, i) => rows.push([i === 0 ? `<b>${y}</b>` : '', nm, f(d.Q[t][i], 0) + ' ' + d.units[i], f(d.P[t][i]), f(d.CL[t][i], 0)])));
    return table(['Año', 'Producto', 'Cantidad', 'Precio', 'Costo laboral'], rows);
  }
  function tp2Calc(d) {
    const Y = [0, 1, 2].map((t) => {
      const vp = d.P[t].reduce((s, p, i) => s + p * d.Q[t][i], 0), ins = d.P[t][2] * d.k * d.Q[t][3];
      return { vp, ins, pbi: vp - ins };
    });
    const t = 1;
    const VA = d.names.map((_, i) => (i === 3 ? d.P[t][3] * d.Q[t][3] - d.P[t][2] * d.k * d.Q[t][3] : d.P[t][i] * d.Q[t][i]));
    const PI = VA.map((va, i) => va - d.CL[t][i]);
    const VC = [0, 1, 2].map((tt) => d.P[tt].reduce((s, p, i) => s + p * d.basket[i], 0));
    const IPC = VC.map((v) => (v / VC[1]) * 100);
    const CLt = d.CL.map((c) => c.reduce((s, x) => s + x, 0));
    const wage = CLt.map((c) => c / d.H);
    const real = [0, 1, 2].map((tt) => d.P[1].reduce((s, p, i) => s + p * d.Q[tt][i], 0) - d.P[1][2] * d.k * d.Q[tt][3]);
    const defl = real.map((r, tt) => (Y[tt].pbi / r) * 100);
    return { Y, VA, PI, VC, IPC, CLt, wage, real, defl };
  }
  function tp2e1Build(d) {
    const c = tp2Calc(d), t = 1, y = d.years;
    const used = d.k * d.Q[t][3];
    const sumVP = d.names.map((nm, i) => `${ft(d.P[t][i])}\\cdot ${d.Q[t][i]}`).join(' + ');
    const enun = `<p>Una economía tiene cuatro sectores. Sabés que <b>${d.kTxt}</b>.</p>` + tp2Tbl(d) + `<ol><li>Calculá el PBI de ${y[1]} (y si querés, también el de ${y[0]} y ${y[2]}).</li><li>Calculá el valor agregado de cada sector en ${y[1]} y verificá que suman el PBI.</li><li>Calculá los beneficios de cada sector y el PBI de ${y[1]} por el método del ingreso.</li></ol>`;
    const steps = [
      { t: 'Detectar el bien intermedio', b: `<p>${d.names[2]} se usa en parte como insumo de ${d.names[3]}: en ${y[1]} se usaron $${ft(d.k)}\\cdot ${d.Q[t][3]} = ${ft(used)}$ ${d.units[2]}. Ese valor <mark>no es producción final</mark> y hay que restarlo para no contarlo dos veces.</p>` },
      { t: `Inciso 1 · PBI ${y[1]} = valor de la producción − valor de los insumos`, b: `$$PBI_{${y[1]}} = ${sumVP} - ${ft(d.P[t][2])}\\cdot ${ft(used)} = ${ft(c.Y[1].vp)} - ${ft(c.Y[1].ins)} = ${ft(c.Y[1].pbi)}$$<p>Con el mismo método: $PBI_{${y[0]}} = ${ft(c.Y[0].vp)} - ${ft(c.Y[0].ins)} = ${ft(c.Y[0].pbi)}$ y $PBI_{${y[2]}} = ${ft(c.Y[2].vp)} - ${ft(c.Y[2].ins)} = ${ft(c.Y[2].pbi)}$.</p>` },
      { t: 'Inciso 2 · Valor agregado por sector', b: `<p>$VA = P\\cdot Q - \\text{insumos}$. Sólo ${d.names[3]} usa insumos:</p>` + table(['Sector', 'Cuenta', 'VA'], d.names.map((nm, i) => [nm, i === 3 ? `${f(d.P[t][3])}·${d.Q[t][3]} − ${f(d.P[t][2])}·${f(used)}` : `${f(d.P[t][i])}·${d.Q[t][i]}`, `<b>${f(c.VA[i])}</b>`]).concat([['<b>Total</b>', '', `<b>${f(c.VA.reduce((a, b) => a + b, 0))}</b>`]])) + `<p>La suma da exactamente el PBI del inciso 1.</p>` },
      { t: 'Inciso 3 · Beneficios y método del ingreso', b: `<p>$\\pi = P\\cdot Q - \\text{salarios} - \\text{insumos}$:</p>` + table(['Sector', 'Cuenta', 'Beneficio π'], d.names.map((nm, i) => [nm, i === 3 ? `${f(c.VA[3] + d.P[t][2] * used)} − (${d.CL[t][3]} + ${f(d.P[t][2] * used)})` : `${f(c.VA[i])} − ${d.CL[t][i]}`, `<b>${f(c.PI[i])}</b>`])) + `$$PBI = \\sum \\pi + \\sum \\text{salarios} = ${ft(c.PI.reduce((a, b) => a + b, 0))} + ${ft(c.CLt[1])} = ${ft(c.Y[1].pbi)}$$<p>Los tres métodos dan lo mismo.</p>` },
    ];
    return { enun, steps };
  }
  function tp2e2Build(d) {
    const c = tp2Calc(d), y = d.years;
    const bTxt = d.names.map((nm, i) => `${d.basket[i]} ${d.units[i]} de ${nm.toLowerCase()}`).join(', ');
    const enun = `<p>Mismos datos del ejercicio anterior. El IPC se calcula con una canasta de <b>${bTxt}</b>. Se usaron exactamente ${d.H} horas de trabajo cada año.</p>` + tp2Tbl(d) + `<ol><li>Costo de la canasta en cada año e IPC con base ${y[1]} = 100.</li><li>Salario por hora en cada año. ¿Ganó o perdió contra la inflación en cada tramo?</li><li>Valor de la producción de ${d.names[0].toLowerCase()} de ${y[1]} en pesos de ${y[0]} usando el IPC, y comparalo con usar los precios de ${y[0]}.</li><li>PBI real a precios de ${y[1]} y deflactor del PBI.</li></ol>`;
    const gw1 = c.wage[1] / c.wage[0] - 1, gw2 = c.wage[2] / c.wage[1] - 1, in1 = c.IPC[1] / c.IPC[0] - 1, in2 = c.IPC[2] / c.IPC[1] - 1;
    const vino = d.P[1][0] * d.Q[1][0];
    const steps = [
      { t: 'Inciso 1 · Costo de la canasta e IPC', b: [0, 1, 2].map((t) => `$$VC_{${y[t]}} = ${d.names.map((_, i) => `${ft(d.P[t][i])}\\cdot ${d.basket[i]}`).join(' + ')} = ${ft(c.VC[t])}$$`).join('') + `<p>Normalizamos dividiendo por el costo del año base:</p>$$IPC_{${y[0]}} = \\frac{${ft(c.VC[0])}}{${ft(c.VC[1])}}\\cdot 100 = ${ft(c.IPC[0], 1)}\\qquad IPC_{${y[2]}} = \\frac{${ft(c.VC[2])}}{${ft(c.VC[1])}}\\cdot 100 = ${ft(c.IPC[2], 1)}$$` },
      { t: 'Inciso 2 · Salario por hora vs inflación', b: `<p>Salario por hora = costo laboral total / horas.</p>` + table(['Año', 'Costo laboral total', 'Salario por hora'], y.map((yy, t) => [yy, f(c.CLt[t], 0), f(c.wage[t], 3)])) + table(['Tramo', 'Crecimiento del salario', 'Inflación (IPC)', 'Resultado'], [[`${y[0]}–${y[1]}`, pct(gw1, 1), pct(in1, 1), gw1 > in1 ? '<b>ganó</b>' : '<b>perdió</b>'], [`${y[1]}–${y[2]}`, pct(gw2, 1), pct(in2, 1), gw2 > in2 ? '<b>ganó</b>' : '<b>perdió</b>']]) + `<p>Si el salario crece más que los precios, el salario real sube.</p>` },
      { t: `Inciso 3 · ${d.names[0]} de ${y[1]} en pesos de ${y[0]}`, b: `<p>Con el índice: dividimos por el IPC de ${y[1]} y multiplicamos por el de ${y[0]}.</p>$$V^{${y[1]}}_{${y[0]}} = ${ft(vino)}\\cdot \\frac{${ft(c.IPC[0], 1)}}{100} = ${ft(vino * c.IPC[0] / 100)}$$<p>Con los precios de ${y[0]}: $${ft(d.P[0][0])}\\cdot ${d.Q[1][0]} = ${ft(d.P[0][0] * d.Q[1][0])}$.</p><div class="note"><span class="lbl">¿por qué difieren?</span>El IPC mide la suba promedio de <b>toda la canasta</b>; el precio de ${d.names[0].toLowerCase()} subió ${pct(d.P[1][0] / d.P[0][0] - 1, 0)}, distinto de la inflación promedio (${pct(1 / (c.IPC[0] / 100) - 1, 0)}).</div>` },
      { t: 'Inciso 4 · PBI real (precios de ' + y[1] + ') y deflactor', b: `<p>PBI real: cantidades de cada año valuadas a precios de ${y[1]}, restando el insumo.</p>` + table(['Año', 'PBI nominal', 'PBI real (precios ' + y[1] + ')', 'Deflactor'], y.map((yy, t) => [yy, f(c.Y[t].pbi), f(c.real[t]), f(c.defl[t], 1)])) + `$$\\text{Deflactor}_t = \\frac{PBI\\ \\text{nominal}_t}{PBI\\ \\text{real}_t}\\cdot 100$$<div class="note"><span class="lbl">deflactor vs IPC</span>El deflactor mira <b>todos</b> los bienes producidos con las cantidades de cada año (Paasche). El IPC mira una canasta <b>fija</b> de consumo (Laspeyres) y puede incluir importados. Por eso pueden dar distinto.</div>` },
    ];
    return { enun, steps };
  }
  const tp2Fixed = [PROF_TP2].concat(SETS.map((s, i) => tp2Data(rng(101 + i * 7), s)));
  const tp2Rand = (R) => tp2Data(R, pick(R, SETS));

  /* ------------------------------------------------------------------ */
  App.UNITS.push({
    id: 'u1', n: 1, title: 'Medir la economía', caps: 'Cap. 1 y 2', tps: 'TP 1 y 2',
    blurb: 'Qué estudia la macro, flujos y stocks, tasas de crecimiento, PBI por sus tres métodos, PBI real, deflactor e IPC.',
    lessons: [
      {
        id: 'u1l1', t: '¿Qué estudia la macro?', d: 'Micro vs macro, modelos y variables exógenas.',
        cards: [
          { t: 'De un mercado a toda la economía', b: T`<p>En Economía I miraste <b>un</b> mercado: cómo decide un consumidor, una firma, qué pasa con un impuesto. La <mark>macroeconomía</mark> mira la economía entera: el producto total (PBI), la inflación, el desempleo, la tasa de interés, la política fiscal.</p><p>Pero no es otra materia: la macro de este curso es <b>microfundada</b>. Todo sale de agentes que maximizan (consumidores que maximizan utilidad y firmas que maximizan beneficios), sólo que sumados.</p>` },
          { t: 'Modelos: lo que se explica y lo que se da por dado', b: T`<p>Un modelo tiene dos tipos de variables:</p><ul><li><b>Endógenas</b>: las que el modelo explica (por ejemplo, el salario y el empleo de equilibrio).</li><li><b>Exógenas</b>: las que se toman como dadas (por ejemplo, el stock de capital o la tecnología A).</li></ul><p>En casi todo el curso hay un <mark>agente representativo</mark>: un consumidor y una firma que representan a todos. Simplifica mucho, pero no sirve para estudiar redistribución (si todos son iguales, no hay ricos y pobres).</p>`, q: { k: 'mc', q: 'En el modelo del mercado de trabajo con K fijo, ¿cuál es exógena?', o: ['El salario real de equilibrio', 'El empleo de equilibrio', 'El stock de capital K', 'El producto Y'], a: 2, why: 'K está dado; el modelo explica w/P, L e Y a partir de él.' } },
          { t: 'El mapa de la materia', b: T`<table><tr><th>Capítulo</th><th>Tema</th><th>TP</th></tr><tr><td>2</td><td>Cuentas nacionales: cómo se mide el PBI y los precios</td><td>1 y 2</td></tr><tr><td>3</td><td>Mercado de trabajo: oferta (consumo–ocio), demanda (PML)</td><td>3 y 4</td></tr><tr><td>4</td><td>Ahorro e inversión en dos períodos</td><td>5 y 6</td></tr><tr><td>5</td><td>Política fiscal y equivalencia ricardiana</td><td>7 y 7.5</td></tr><tr><td>6</td><td>Economía abierta, cuenta corriente y riesgo país</td><td>8</td></tr></table><p>Cada capítulo usa herramientas del anterior. Si en el capítulo 4 algo no cierra, casi siempre es algo del 3 (efecto sustitución e ingreso) que conviene repasar.</p>` },
        ],
      },
      {
        id: 'u1l2', t: 'Flujos y stocks', d: 'La primera clasificación del TP 1.',
        cards: [
          { t: 'Foto o película', b: T`<p>Una <b>variable flujo</b> mide una cantidad <mark>durante un período</mark> (un mes, un año). Una <b>variable stock</b> mide una cantidad <mark>en un instante</mark>.</p><p>La imagen típica es una bañadera: el agua que entra y sale por minuto son flujos; el nivel de agua es el stock. En la economía, la inversión entra, la depreciación sale y el capital es el nivel:</p>$$K_{t+1} = K_t + I_t - \delta K_t$$`, w: 'stock' },
          { t: 'El truco para no equivocarte', b: T`<p>Preguntate: <b>¿tiene sentido agregarle «por año»?</b> «El PBI por año» sí: flujo. «La población por año» no: hay tantos habitantes hoy, stock.</p><p>Casi siempre los flujos vienen de a pares con un stock:</p><table><tr><th>Stock</th><th>Flujo que lo cambia</th></tr><tr><td>Capital</td><td>Inversión, depreciación</td></tr><tr><td>Deuda del gobierno</td><td>Déficit fiscal</td></tr><tr><td>Dinero en circulación</td><td>Emisión de dinero</td></tr><tr><td>Riqueza</td><td>Ahorro</td></tr><tr><td>Reservas internacionales</td><td>Variación de reservas</td></tr><tr><td>Desempleados</td><td>Despidos y contrataciones</td></tr></table>`, q: { k: 'vf', q: 'El desempleo (la cantidad de desempleados) es una variable flujo.', a: false, why: 'Es un stock: cuántas personas están desempleadas en un momento dado. Los despidos del mes sí serían un flujo.' } },
        ],
      },
      {
        id: 'u1l3', t: 'Tasas de crecimiento', d: 'Anual, acumulada, de un producto y de un cociente.',
        cards: [
          { t: 'La fórmula base', b: T`<p>La tasa de crecimiento de una variable X entre t y t+1:</p>$$g = \frac{X_{t+1} - X_t}{X_t}\cdot 100$$<div class="ex"><span class="lbl">ejemplo del TP 1</span>La cantidad producida pasa de 1000 a 1020 toneladas: $g = \frac{1020 - 1000}{1000}\cdot 100 = 2\%$. De 1020 a 1050: $\frac{30}{1020}\cdot 100 = 2{,}94\%$. Fijate que siempre se divide por el valor <b>de partida</b>.</div>`, q: { k: 'mc', q: 'El precio pasa de 650 a 973. ¿Cuánto creció?', o: ['32,3 %', '49,7 %', '33,2 %', '50 %'], a: 1, why: '(973 − 650)/650 = 323/650 = 0,497 → 49,7 %. Si dividís por 973 te da 33,2 %, que está mal.' } },
          { t: 'Sumar tasas no da la acumulada', b: T`<p>Si crecés 10 % y después otro 10 %, no creciste 20 % sino 21 %: el segundo 10 % se aplica sobre algo más grande.</p>$$TCA = (1+g_1)(1+g_2)\cdots(1+g_n) - 1 \quad > \quad g_1 + g_2 + \dots + g_n$$<p>La suma es una buena aproximación sólo con <mark>tasas chicas</mark>.</p>`, w: 'growth' },
          { t: 'Crecimiento de un producto: valor = P · Q', b: T`<p>El valor de la producción es precio por cantidad. Su tasa exacta es:</p>$$1 + g_{V} = (1+g_P)(1+g_Q) \;\Rightarrow\; g_V = g_P + g_Q + g_P\cdot g_Q$$<p>Por eso $g_V \approx g_P + g_Q$, y el error es justo el término $g_P\cdot g_Q$.</p>`, w: 'rect' },
          { t: 'Crecimiento de un cociente: por habitante', b: T`<p>El valor por habitante es $V/N$. Su tasa exacta:</p>$$1 + g_{V/N} = \frac{1+g_V}{1+g_N} \;\Rightarrow\; g_{V/N} \approx g_V - g_N$$<div class="ex"><span class="lbl">ejemplo del TP 1, año 2020</span>El valor de la producción crece 61,8 % y la población 4,93 %. La resta da 56,87 %, pero la tasa exacta es $\frac{1{,}618}{1{,}0493} - 1 = 54{,}2\%$. Con tasas grandes la diferencia se nota.</div>`, q: { k: 'vf', q: 'Si el PBI nominal crece 30 % y la población 2 %, el PBI nominal por habitante crece exactamente 28 %.', a: false, why: 'Crece 1,30/1,02 − 1 = 27,45 %. La resta (28 %) es sólo una aproximación.' } },
        ],
      },
      {
        id: 'u1l4', t: 'El PBI y sus tres métodos', d: 'Gasto, valor agregado e ingreso dan lo mismo.',
        cards: [
          { t: 'Qué cuenta y qué no', b: T`<p>El <b>Producto Bruto Interno</b> es el <mark>valor de mercado de todos los bienes y servicios finales producidos en un país durante un período</mark>.</p><ul><li><b>Finales</b>: un auto nuevo sí; las autopartes que se usaron para hacerlo, no (ya están dentro del precio del auto).</li><li><b>Producidos en el período</b>: la venta de un auto usado no cuenta, se produjo antes.</li><li><b>En el país</b>: lo que producen extranjeros acá cuenta en el PBI; lo que producen argentinos afuera, no (eso es el PBN).</li><li>Está en pesos: es <b>nominal</b>.</li></ul><p>No mide distribución del ingreso, actividad informal ni cosas como el medio ambiente: es una idea general del bienestar, no una medida completa.</p>`, q: { k: 'mc', q: '¿Cuál de estas cosas suma al PBI de este año?', o: ['La venta de un departamento construido en 1990', 'La harina que compra una panadería para hacer pan', 'Un corte de pelo', 'Una jubilación que paga el Estado'], a: 2, why: 'El corte de pelo es un servicio final producido este año. El departamento es de otro año, la harina es intermedia y la jubilación es una transferencia (no es una compra de bienes).' } },
          { t: 'El flujo circular', b: T`<p>Los hogares venden trabajo y capital a las empresas y reciben salarios, beneficios y alquileres. Con eso compran los bienes que producen las empresas. Por eso el gasto total, el ingreso total y la producción total son <b>la misma plata vista desde tres lados</b>.</p>`, w: 'flujo' },
          { t: 'Método del gasto', b: T`<p>Sumamos según quién compra el producto final:</p>$$Y = C + I + G + (X - M)$$<ul><li><b>C</b>: consumo de bienes durables, no durables y servicios.</li><li><b>I</b>: inversión bruta: bienes de capital nuevos más la reposición de lo depreciado.</li><li><b>G</b>: consumo e inversión de los tres niveles de gobierno. <mark>No incluye transferencias</mark> (jubilaciones, planes): no son compras.</li><li><b>X − M</b>: exportaciones netas.</li></ul><p>En una economía cerrada y sin gobierno queda $Y = C + I$.</p>` },
          { t: 'Método del valor agregado', b: T`<p>Sumamos lo que agrega cada sector: $VA = \text{valor de la producción} - \text{insumos}$. Así no contás dos veces los bienes intermedios.</p>`, w: 'chain', b2: T`<div class="note"><span class="lbl">en el TP 2</span>El queso usa leche: el valor agregado del queso es sus ventas menos la leche que usó. La leche que se usó no es producto final.</div>` },
          { t: 'Método del ingreso', b: T`<p>Sumamos lo que cobran los dueños de los factores: salarios, retribución al capital y beneficios.</p>$$IBI = w\cdot L + r\cdot K + \text{Beneficios} \qquad INI = IBI - \delta K$$<div class="ex"><span class="lbl">ejemplo del apunte: Naranjas S.A. y Jugos S.A.</span>Naranjas vende 10.000 al público y 25.000 a Jugos. Jugos vende 40.000 y compra 25.000 de naranjas.<br>• <b>Gasto</b>: consumo = 10.000 + 40.000 = 50.000.<br>• <b>Valor agregado</b>: 35.000 (Naranjas) + 15.000 (Jugos: 40.000 − 25.000) = 50.000.<br>• <b>Ingreso</b>: salarios 25.000 + impuestos 7.000 + beneficios 18.000 = 50.000.</div>`, q: { k: 'vf', q: 'Si una economía calcula el PBI sumando todas las ventas de todas las empresas, lo sobreestima.', a: true, why: 'Cuenta los bienes intermedios más de una vez (doble conteo).' } },
        ],
      },
      {
        id: 'u1l5', t: 'Nominal, real y precios', d: 'PBI real, deflactor, IPC y salario real.',
        cards: [
          { t: 'El problema del PBI nominal', b: T`<p>Si el PBI nominal sube 20 %, ¿la economía produjo más o sólo subieron los precios? El ejemplo del apunte tiene dos casos con el mismo PBI nominal y realidades opuestas.</p>`, w: 'deflator' },
          { t: 'PBI real y deflactor', b: T`<p>El <b>PBI real</b> valúa las cantidades de cada año con los precios de un <b>año base</b> $t_0$:</p>$$PBI\ \text{real}_t = \sum_i p^{t_0}_i\, q^t_i$$<p>En el año base, real y nominal coinciden. El crecimiento de la economía se mide con el PBI real.</p><p>Dividiendo nominal por real sale un índice de precios, el <b>deflactor implícito del PBI</b>:</p>$$\text{Deflactor}_t = \frac{\sum p^t_i q^t_i}{\sum p^{t_0}_i q^t_i}\cdot 100 = \frac{PBI\ \text{nominal}_t}{PBI\ \text{real}_t}\cdot 100$$` },
          { t: 'IPC: el costo de una canasta fija', b: T`<p>El <b>Índice de Precios al Consumidor</b> mide cuánto cuesta una canasta fija de consumo en cada año, relativo al año base:</p>$$IPC_t = \frac{\sum p^t_i\, \bar q_i}{\sum p^{t_0}_i\, \bar q_i}\cdot 100$$<div class="ex"><span class="lbl">TP 2</span>La canasta cuesta 12 en 2000, 25 en 2010 y 30 en 2020. Con base 2010: $IPC_{2000} = \frac{12}{25}\cdot 100 = 48$, $IPC_{2010} = 100$, $IPC_{2020} = \frac{30}{25}\cdot 100 = 120$.</div>`, q: { k: 'mc', q: 'Con base 2010, el IPC de 2020 es 120. ¿Qué significa?', o: ['Los precios subieron 120 %', 'La canasta cuesta 20 % más que en 2010', 'La canasta cuesta 120 pesos', 'El PBI real creció 20 %'], a: 1, why: 'Un índice de 120 con base 100 es una suba de 20 % respecto del año base.' } },
          { t: 'Deflactor vs IPC', b: T`<table><tr><th>Deflactor del PBI</th><th>IPC</th></tr><tr><td>Todos los bienes y servicios producidos</td><td>Sólo lo que consume el ciudadano promedio</td></tr><tr><td>Sólo bienes producidos en el país</td><td>Puede incluir importados</td></tr><tr><td>Cantidades corrientes: la canasta cambia (Paasche)</td><td>Canasta fija del año base (Laspeyres)</td></tr><tr><td>Captura la sustitución entre bienes</td><td>No captura la sustitución: sobreestima la suba del costo de vida</td></tr></table><p>Ejemplo: si suben 80 % las manzanas y el país no las produce, el deflactor no se entera; el IPC sí, porque la gente las consume.</p>` },
          { t: 'Pasar pesos de un año a pesos de otro', b: T`<p>Para expresar un valor del año t en pesos del año base b, se divide por el índice de t y se multiplica por el de b:</p>$$V^{t}_{\text{en pesos de } b} = V^t\cdot \frac{IPC_b}{IPC_t}$$<div class="ex"><span class="lbl">TP 2, inciso 3</span>El vino de 2010 vale 1,5 · 100 = 150 pesos de 2010. En pesos de 2000: $150\cdot \frac{48}{100} = 72$. Pero con los precios de 2000 da 1 · 100 = 100. No coinciden porque el vino subió 50 % y la canasta subió más (108 %).</div>` },
          { t: '¿El salario le ganó a la inflación?', b: T`<p>Compará la tasa de crecimiento del salario nominal con la inflación del mismo tramo. Si el salario creció más, el <b>salario real</b> subió.</p><div class="ex"><span class="lbl">TP 2, inciso 2</span>Salario por hora = costo laboral total / 1000 horas: 0,4 (2000), 1 (2010), 1,197 (2020).<br>2000–2010: salario +150 %, inflación $\frac{100-48}{48} = 108\%$ → <b>ganó</b>.<br>2010–2020: salario +19,7 %, inflación 20 % → <b>perdió</b> (por poco).</div>`, q: { k: 'vf', q: 'Si el salario nominal sube 40 % y la inflación es 50 %, el salario real sube.', a: false, why: 'El salario real cae: 1,40/1,50 − 1 = −6,7 %.' } },
        ],
      },
    ],
    quiz: [
      { k: 'vf', q: 'La inversión es una variable stock.', a: false, why: 'Es un flujo: compras de bienes de capital durante el período. El capital es el stock.' },
      { k: 'vf', q: 'La deuda del gobierno es un stock y el déficit fiscal es su flujo asociado.', a: true, why: 'El déficit de cada año se suma a la deuda.' },
      { k: 'vf', q: 'Las reservas internacionales son un flujo.', a: false, why: 'Son un stock: lo que tiene el Banco Central en una fecha.' },
      { k: 'vf', q: 'La emisión de dinero es un flujo.', a: true, why: 'Es cuánto dinero nuevo se crea durante un período; el dinero en circulación es el stock.' },
      { k: 'mc', q: 'Una variable crece 5 % un año y 5 % el siguiente. ¿Cuánto creció en total?', o: ['10 %', '10,25 %', '9,75 %', '5 %'], a: 1, why: '1,05 × 1,05 − 1 = 10,25 %.' },
      { k: 'vf', q: 'La suma de tasas anuales aproxima mejor la tasa acumulada cuando las tasas son grandes.', a: false, why: 'Es al revés: cuanto más chicas, mejor la aproximación.' },
      { k: 'mc', q: 'La cantidad crece 10 % y el precio 20 %. ¿Cuánto crece el valor P·Q?', o: ['30 %', '32 %', '2 %', '28 %'], a: 1, why: '1,1 × 1,2 − 1 = 32 %. La suma (30 %) olvida el término 0,1 × 0,2 = 2 %.' },
      { k: 'vf', q: 'Las jubilaciones que paga el Estado forman parte de G en el PBI por el método del gasto.', a: false, why: 'Son transferencias, no compras de bienes y servicios. No van en G.' },
      { k: 'mc', q: 'Una panadería vende pan por 120 y compró harina por 70. ¿Cuál es su valor agregado?', o: ['120', '190', '50', '70'], a: 2, why: 'VA = 120 − 70 = 50.' },
      { k: 'vf', q: 'Los tres métodos de cálculo del PBI dan el mismo resultado.', a: true, why: 'Gasto, valor agregado e ingreso miden el mismo flujo desde distintos lados.' },
      { k: 'mc', q: 'En el año base, el deflactor del PBI vale…', o: ['0', '1', '100', 'depende de la inflación'], a: 2, why: 'En el año base el PBI real es igual al nominal, así que el cociente por 100 da 100.' },
      { k: 'vf', q: 'El IPC usa cantidades que cambian cada año.', a: false, why: 'Usa una canasta fija (tipo Laspeyres). El deflactor es el que usa cantidades corrientes.' },
      { k: 'vf', q: 'Si sube el precio de un bien importado que se consume mucho, sube el IPC pero no necesariamente el deflactor del PBI.', a: true, why: 'El deflactor sólo mira bienes producidos en el país.' },
      { k: 'mc', q: 'PBI nominal = 1710 y PBI real = 1425. ¿Deflactor?', o: ['83', '120', '285', '1,2'], a: 1, why: '1710/1425 × 100 = 120.' },
      { k: 'vf', q: 'El PBN de Argentina incluye lo que produce un uruguayo que trabaja en Argentina.', a: false, why: 'El PBN cuenta lo que producen los nacionales (estén donde estén). Eso entra en el PBI argentino pero en el PBN uruguayo.' },
      { k: 'mc', q: 'Para pasar 150 pesos de 2010 a pesos de 2000 con IPC2000 = 48 e IPC2010 = 100:', o: ['150 × 100/48', '150 × 48/100', '150 − 52', '150/48'], a: 1, why: 'Dividís por el índice del año del dato y multiplicás por el del año al que querés llevarlo.' },
      { k: 'vf', q: 'La venta de un auto usado suma al PBI del año en que se vende.', a: false, why: 'Ese auto se contó cuando se produjo. (La comisión de la concesionaria sí es un servicio de este año.)' },
    ],
    formulas: [
      { n: 'Tasa de crecimiento', tex: T`g = \frac{X_{t+1} - X_t}{X_t}\cdot 100`, d: 'Siempre se divide por el valor de partida.' },
      { n: 'Tasa acumulada', tex: T`TCA = \frac{X_T - X_0}{X_0} = \prod (1+g_t) - 1`, d: 'Mayor que la suma de tasas por el efecto compuesto.' },
      { n: 'Crecimiento de un producto', tex: T`g_{PQ} = g_P + g_Q + g_P g_Q \approx g_P + g_Q`, d: 'El error es el producto de las tasas.' },
      { n: 'Crecimiento de un cociente', tex: T`g_{V/N} = \frac{1+g_V}{1+g_N} - 1 \approx g_V - g_N`, d: 'Por habitante: tasa del total menos tasa de la población.' },
      { n: 'PBI por el gasto', tex: T`Y = C + I + G + (X - M)`, d: 'G no incluye transferencias.' },
      { n: 'Valor agregado', tex: T`VA = P\cdot Q - \text{insumos}`, d: 'La suma de los VA es el PBI.' },
      { n: 'PBI por el ingreso', tex: T`IBI = wL + rK + \text{Beneficios},\quad INI = IBI - \delta K`, d: 'Lo que cobran los dueños de los factores.' },
      { n: 'PBI real', tex: T`PBI^{real}_t = \sum_i p_i^{t_0} q_i^t`, d: 'Cantidades del año, precios del año base.' },
      { n: 'Deflactor del PBI', tex: T`D_t = \frac{PBI^{nom}_t}{PBI^{real}_t}\cdot 100`, d: 'Índice de Paasche: canasta de cada año.' },
      { n: 'IPC', tex: T`IPC_t = \frac{\sum p_i^t \bar q_i}{\sum p_i^{t_0}\bar q_i}\cdot 100`, d: 'Laspeyres: canasta fija.' },
      { n: 'Cambiar de pesos de un año a otro', tex: T`V_{\text{pesos de } b} = V_t\cdot \frac{IPC_b}{IPC_t}`, d: 'Dividir por el índice del dato, multiplicar por el del destino.' },
    ],
    exercises: [
      {
        id: 'tp1e1', tp: 'TP 1', num: 1, title: 'Flujos y stocks', sum: 'Clasificar variables macroeconómicas según cómo se miden en el tiempo.',
        consigna: T`<p>Las variables macroeconómicas que representan cantidades pueden clasificarse según cómo se miden en el tiempo en variables flujo y variables stock. Clasificá: Producto Bruto Interno, Inversión, Deuda del Gobierno, Reservas Internacionales, Exportaciones, Importaciones, Dinero en circulación, Gasto del gobierno, Población, Desempleo, Ahorro, Riqueza, Emisión de dinero.</p>`,
        plan: T`<p><b>Qué te piden:</b> decir flujo o stock para cada variable.</p><p><b>Herramienta:</b> las definiciones. Flujo = durante un período. Stock = en un instante.</p><ol><li>Leé la variable y probá decir «por año» al lado.</li><li>Si suena natural (exportaciones por año), es flujo. Si no (población por año), es stock.</li><li>Buscá su pareja: muchas veces hay un stock y un flujo que lo cambia (riqueza ↔ ahorro).</li></ol>`,
        profe: [
          { t: 'Ayuda: las dos definiciones', b: T`<p><b>Variable flujo:</b> mide una cantidad durante un período determinado (un mes o un año).</p><p><b>Variable stock:</b> mide una cantidad en un instante determinado.</p>` },
          { t: 'Resultados', b: T`<table><tr><th>Variable</th><th>Tipo</th></tr><tr><td>Producto Bruto Interno</td><td>flujo</td></tr><tr><td>Inversión</td><td>flujo</td></tr><tr><td>Deuda del gobierno</td><td>stock</td></tr><tr><td>Reservas internacionales</td><td>stock</td></tr><tr><td>Exportaciones</td><td>flujo</td></tr><tr><td>Importaciones</td><td>flujo</td></tr><tr><td>Dinero en circulación</td><td>stock</td></tr><tr><td>Gasto del gobierno</td><td>flujo</td></tr><tr><td>Población</td><td>stock</td></tr><tr><td>Desempleo</td><td>stock</td></tr><tr><td>Ahorro</td><td>flujo</td></tr><tr><td>Riqueza</td><td>stock</td></tr><tr><td>Emisión de dinero</td><td>flujo</td></tr></table>` },
        ],
        errores: ['Poner «desempleo» como flujo: es la cantidad de desempleados en un momento (stock).', 'Confundir ahorro (flujo) con riqueza (stock).', 'Confundir dinero en circulación (stock) con emisión (flujo).'],
        practice: { fixed: clsFixed, random: (R) => ({ items: shuffle(R, POOL.map((_, i) => i)).slice(0, 8) }), build: clsBuild },
      },
      {
        id: 'tp1e2', tp: 'TP 1', num: 2, title: 'Tasas de crecimiento', sum: 'Tasas anuales, acumuladas, del valor de la producción y por habitante.',
        consigna: T`<p>Una economía produce sólo manzanas. Datos:</p><table><tr><th>Año</th><th>Cantidad (ton)</th><th>Precio</th><th>Población (millones)</th></tr><tr><td>2015</td><td>1000</td><td>500</td><td>30,0</td></tr><tr><td>2016</td><td>1020</td><td>505</td><td>31,5</td></tr><tr><td>2017</td><td>1050</td><td>515</td><td>33,1</td></tr><tr><td>2018</td><td>1103</td><td>541</td><td>34,7</td></tr><tr><td>2019</td><td>1191</td><td>650</td><td>36,5</td></tr><tr><td>2020</td><td>1287</td><td>973</td><td>38,3</td></tr></table><ol><li>Calculá la tasa de crecimiento anual de cada variable.</li><li>Calculá la tasa acumulada y compará con la suma de tasas anuales. ¿Cuándo es más precisa la aproximación?</li><li>Calculá el valor de la producción, el valor por habitante y sus tasas.</li><li>Compará la tasa del valor de la producción con la suma de las tasas de cantidad y precio. ¿Cuándo es más grande la discrepancia?</li><li>Compará la tasa del valor por habitante con la resta de la tasa del valor y la de la población.</li></ol>`,
        plan: T`<p><b>Qué te piden:</b> muchas cuentas con una sola fórmula, y dos conclusiones conceptuales.</p><ol><li>Armá una tabla con una columna por variable y una fila por año.</li><li>Aplicá $g = (X_{t+1} - X_t)/X_t$ a cada par de años.</li><li>Para el inciso 2 compará la suma de las tasas con (último − primero)/primero.</li><li>Para el 3 multiplicá precio por cantidad y dividí por la población.</li><li>Para el 4 y el 5 armá columnas «suma» o «resta» y comparalas con la tasa calculada directo.</li><li>La conclusión de los incisos 2, 4 y 5 es siempre la misma idea: <mark>con tasas grandes las aproximaciones fallan más</mark>.</li></ol>`,
        profe: [
          { t: 'Inciso 1 · La fórmula', b: T`$$\text{Tasa} = \frac{X_{t+1} - X_t}{X_t}\cdot 100$$<p>Cantidad 2015–2016: $\frac{1020-1000}{1000}\cdot 100 = 2\%$. 2016–2017: $\frac{1050-1020}{1020}\cdot 100 = 2{,}94\%$.</p><table><tr><th>Año</th><th>Cantidad</th><th>Precio</th><th>Población</th></tr><tr><td>2016</td><td>2 %</td><td>1 %</td><td>5 %</td></tr><tr><td>2017</td><td>2,94 %</td><td>1,98 %</td><td>5,08 %</td></tr><tr><td>2018</td><td>5,05 %</td><td>5,05 %</td><td>4,83 %</td></tr><tr><td>2019</td><td>7,98 %</td><td>20,15 %</td><td>5,18 %</td></tr><tr><td>2020</td><td>8,06 %</td><td>49,69 %</td><td>4,93 %</td></tr></table>` },
          { t: 'Inciso 2 · STC vs TCA', b: T`<p>$STC = 2 + 2{,}94 + 5{,}05 + 7{,}98 + 8{,}06 = 26\%$ y $TCA = \frac{1287 - 1000}{1000} = 28{,}7\%$.</p><table><tr><th></th><th>Cantidad</th><th>Precio</th><th>Población</th></tr><tr><td>STC</td><td>26 %</td><td>77,9 %</td><td>25 %</td></tr><tr><td>TCA</td><td>28,7 %</td><td>94,6 %</td><td>27,7 %</td></tr></table><div class="note"><span class="lbl">conclusión del profe</span>Mientras más grandes sean las tasas anuales, mayor es la diferencia entre la acumulada y la suma, por el crecimiento compuesto.</div>` },
          { t: 'Inciso 3 · Valor de la producción', b: T`<p>$VP = P\cdot Q$ y $VPpH = VP / \text{Población}$.</p><table><tr><th>Año</th><th>VP</th><th>VPpH</th><th>g VP</th><th>g VPpH</th></tr><tr><td>2015</td><td>500.000</td><td>16.667</td><td>—</td><td>—</td></tr><tr><td>2016</td><td>515.100</td><td>16.352</td><td>3,02 %</td><td>−1,9 %</td></tr><tr><td>2017</td><td>540.750</td><td>16.337</td><td>4,98 %</td><td>−0,1 %</td></tr><tr><td>2018</td><td>596.723</td><td>17.197</td><td>10,4 %</td><td>5,3 %</td></tr><tr><td>2019</td><td>774.150</td><td>21.210</td><td>29,7 %</td><td>23,3 %</td></tr><tr><td>2020</td><td>1.252.251</td><td>32.696</td><td>61,8 %</td><td>54,2 %</td></tr></table>` },
          { t: 'Inciso 4 · Suma de tasas de Q y P vs tasa de VP', b: T`<table><tr><th>Año</th><th>g Q</th><th>g P</th><th>Suma</th><th>g VP</th></tr><tr><td>2016</td><td>2 %</td><td>1 %</td><td>3 %</td><td>3,02 %</td></tr><tr><td>2017</td><td>2,94 %</td><td>1,98 %</td><td>4,92 %</td><td>4,98 %</td></tr><tr><td>2018</td><td>5,05 %</td><td>5,05 %</td><td>10,10 %</td><td>10,35 %</td></tr><tr><td>2019</td><td>7,98 %</td><td>20,15 %</td><td>28,13 %</td><td>29,7 %</td></tr><tr><td>2020</td><td>8,06 %</td><td>49,69 %</td><td>57,75 %</td><td>61,8 %</td></tr></table><div class="note"><span class="lbl">conclusión del profe</span>La discrepancia es mayor cuanto mayores son las tasas. Con tasas chicas es prácticamente indistinto.</div>` },
          { t: 'Inciso 5 · Resta vs tasa por habitante', b: T`<table><tr><th>Año</th><th>g VP</th><th>g Pob.</th><th>Resta</th><th>g VPpH</th></tr><tr><td>2016</td><td>3 %</td><td>5 %</td><td>−1,98 %</td><td>−1,9 %</td></tr><tr><td>2017</td><td>5 %</td><td>5,08 %</td><td>−0,1 %</td><td>−0,1 %</td></tr><tr><td>2018</td><td>10,4 %</td><td>4,83 %</td><td>5,57 %</td><td>5,3 %</td></tr><tr><td>2019</td><td>29,7 %</td><td>5,18 %</td><td>24,52 %</td><td>23,3 %</td></tr><tr><td>2020</td><td>61,8 %</td><td>4,93 %</td><td>56,87 %</td><td>54,2 %</td></tr></table><div class="note"><span class="lbl">conclusión del profe</span>La resta aproxima la tasa por habitante. Cuanto mayores son las tasas, mayor puede ser la discrepancia.</div>` },
        ],
        errores: ['Dividir por el valor final en vez del inicial.', 'Calcular la acumulada sumando tasas.', 'Olvidarse de escribir la conclusión: el profe la pide en los incisos 2, 4 y 5.'],
        practice: { fixed: [11, 23, 37, 41, 59].map((s) => growthData(rng(s))), random: growthData, build: growthBuild },
      },
      {
        id: 'tp2e1', tp: 'TP 2', num: 1, title: 'Métodos de cálculo del PBI', sum: 'Valor de la producción menos insumos, valor agregado por sector y método del ingreso.',
        consigna: T`<p>El cuadro tiene producción, precios y costo laboral de cuatro sectores para 2000, 2010 y 2020 (vino, ostras, leche, queso).</p>` + tp2Tbl(PROF_TP2) + T`<ol><li>Calculá el PBI de 2010 si sabés que un kg de queso requiere dos litros de leche.</li><li>Calculá el valor agregado de cada sector en 2010 y verificá que suman el PBI.</li><li>Calculá los beneficios de cada sector y el PBI por el método del ingreso.</li></ol>`,
        plan: T`<p><b>Qué te piden:</b> el mismo PBI calculado de tres formas.</p><ol><li><b>Encontrá el insumo</b>: el bien que se usa para producir otro (leche → queso). Calculá cuánto se usó: litros por kg × kg de queso.</li><li><b>Inciso 1</b>: suma de $P\cdot Q$ de todos los sectores menos el valor de la leche usada.</li><li><b>Inciso 2</b>: VA de cada sector. Los que no usan insumos: $VA = P\cdot Q$. El que usa: $P\cdot Q - P_{insumo}\cdot\text{cantidad usada}$.</li><li><b>Inciso 3</b>: beneficio = VA − salarios. Después PBI = suma de beneficios + suma de salarios.</li></ol>`,
        profe: [
          { t: 'Inciso 1 · Valor de la producción menos insumos', b: T`<p>En 2010 se hacen 100 kg de queso, que usan 200 litros de leche.</p>$$PBI_{2010} = \underbrace{1{,}5\cdot 100 + 10\cdot 40 + 1\cdot 600 + 4\cdot 100}_{\text{valor de la producción}} - \underbrace{1\cdot 200}_{\text{insumos}} = 1350$$<p>Igual para los otros años: $PBI_{2000} = 1\cdot 80 + 4\cdot 30 + 0{,}5\cdot 500 + 2\cdot 80 - 0{,}5\cdot 160 = 530$ y $PBI_{2020} = 1{,}8\cdot 110 + 12\cdot 42 + 1{,}2\cdot 600 + 4{,}8\cdot 120 - 1{,}2\cdot 240 = 1710$.</p>` },
          { t: 'Inciso 2 · Valor agregado por sector', b: T`$$VA_v = 1{,}5\cdot 100 = 150\quad VA_o = 10\cdot 40 = 400\quad VA_l = 1\cdot 600 = 600$$$$VA_q = 4\cdot 100 - 1\cdot 200 = 200$$<p>$PBI_{2010} = 150 + 400 + 600 + 200 = 1350$.</p>` },
          { t: 'Inciso 3 · Beneficios', b: T`$$\pi_v = 150 - 120 = 30\quad \pi_o = 400 - 330 = 70\quad \pi_l = 600 - 450 = 150$$$$\pi_q = 4\cdot 100 - (100 + 1\cdot 200) = 100$$` },
          { t: 'Inciso 3 · PBI por el ingreso', b: T`$$PBI_{2010} = \sum \pi + \sum\text{salarios} = 30 + 70 + 150 + 100 + 120 + 330 + 450 + 100 = 1350$$<p>Los tres métodos coinciden.</p>` },
        ],
        errores: ['Sumar el valor de toda la leche como producto final (doble conteo).', 'Restar el insumo a todos los sectores en vez de sólo al que lo usa.', 'En el método del ingreso, olvidarse de restar el insumo en el beneficio del queso.'],
        practice: { fixed: tp2Fixed, random: tp2Rand, build: tp2e1Build },
      },
      {
        id: 'tp2e2', tp: 'TP 2', num: 2, title: 'Índices de precios, variables reales y nominales', sum: 'IPC con base 100, salario vs inflación, pasar a pesos de otro año, PBI real y deflactor.',
        consigna: T`<p>Con los datos del ejercicio anterior, el IPC usa una canasta de 2 litros de vino, 1 kg de ostras, 4 de leche y 2 kg de queso.</p><ol><li>Calculá el costo de la canasta en cada año y normalizá para que 2010 valga 100. ¿Cuánto vale en 2000 y en 2020?</li><li>Calculá el salario por hora suponiendo 1000 horas de trabajo por año. ¿Ganó o perdió contra la inflación?</li><li>Usá el índice para expresar la producción de vino de 2010 en pesos de 2000. Compará con valuarla a precios de 2000. ¿Hay discrepancia? ¿Por qué?</li><li>Calculá el PBI real y el deflactor a precios de 2010. ¿Por qué el deflactor puede diferir del IPC?</li></ol>`,
        plan: T`<ol><li><b>Inciso 1</b>: costo de la canasta = Σ precio × cantidad de la canasta, para cada año. Dividí todo por el costo de 2010 y multiplicá por 100.</li><li><b>Inciso 2</b>: sumá los costos laborales de los cuatro sectores y dividí por 1000. Calculá la tasa del salario y la del IPC en cada tramo y compará.</li><li><b>Inciso 3</b>: valor nominal × IPC del año destino / IPC del año del dato. Después valuá con los precios del año destino y explicá la diferencia (un bien vs la canasta).</li><li><b>Inciso 4</b>: cantidades de cada año × precios de 2010 (restando el insumo). Deflactor = nominal/real × 100. Explicá con la tabla deflactor vs IPC.</li></ol>`,
        profe: [
          { t: 'Inciso 1 · Costo de la canasta', b: T`$$VC_{2000} = 1\cdot 2 + 4\cdot 1 + 0{,}5\cdot 4 + 2\cdot 2 = 12$$$$VC_{2010} = 1{,}5\cdot 2 + 10\cdot 1 + 1\cdot 4 + 4\cdot 2 = 25$$$$VC_{2020} = 1{,}8\cdot 2 + 12\cdot 1 + 1{,}2\cdot 4 + 4{,}8\cdot 2 = 30$$` },
          { t: 'Inciso 1 · Normalización', b: T`$$IPC^{2010}_{2010} = \frac{25}{25}\cdot 100 = 100\qquad IPC^{2000}_{2010} = \frac{12}{25}\cdot 100 = 48\qquad IPC^{2020}_{2010} = \frac{30}{25}\cdot 100 = 120$$` },
          { t: 'Inciso 2 · Salario por hora', b: T`<p>2000: $400/1000 = 0{,}4$. 2010: $1000/1000 = 1$. 2020: $1197/1000 = 1{,}197$.</p><p>2000–2010: salario $\frac{1 - 0{,}4}{0{,}4} = 150\%$, inflación $\frac{100 - 48}{48} = 108\%$.<br>2010–2020: salario $19{,}7\%$, inflación $20\%$.</p><div class="note"><span class="lbl">conclusión del profe</span>Entre 2000 y 2010 el salario creció más que los precios; entre 2010 y 2020, levemente menos.</div>` },
          { t: 'Inciso 3 · Vino de 2010 en pesos de 2000', b: T`<p>Con precios de 2000: $P^{2000}_v\cdot Q^{2010}_v = 1\cdot 100 = 100$.</p><p>Con el índice:</p>$$V(\text{vino})^{2010}_{2000} = V(\text{vino})^{2010}_{2010}\cdot \frac{IPC^{2000}_{2010}}{IPC^{2010}_{2010}} = 150\cdot \frac{48}{100} = 72$$<p>La discrepancia aparece porque el precio del vino subió 50 %, menos que la canasta (108 %).</p>` },
          { t: 'Inciso 4 · PBI real a precios de 2010', b: T`$$PBI^{2000}_{2010} = 1{,}5\cdot 80 + 10\cdot 30 + 1\cdot 500 + 4\cdot 80 - 1\cdot 160 = 1080$$$$PBI^{2010}_{2010} = 1350\qquad PBI^{2020}_{2010} = 1{,}5\cdot 110 + 10\cdot 42 + 1\cdot 600 + 4\cdot 120 - 1\cdot 240 = 1425$$` },
          { t: 'Inciso 4 · Deflactor', b: T`$$D_{2000} = \frac{530}{1080}\cdot 100 = 49\qquad D_{2010} = 100\qquad D_{2020} = \frac{1710}{1425}\cdot 100 = 120$$<table><tr><th>Deflactor del PBI</th><th>IPC</th></tr><tr><td>Todos los bienes y servicios</td><td>Sólo los consumidos por el ciudadano promedio</td></tr><tr><td>Sólo producidos en el país</td><td>Puede incluir importados</td></tr><tr><td>Cantidades corrientes (Paasche)</td><td>Cantidades fijas del año base (Laspeyres); no captura la sustitución</td></tr></table>` },
        ],
        errores: ['Normalizar con el año equivocado: la base es 2010, no 2000.', 'En el PBI real, olvidarse de restar el insumo (leche usada × precio de 2010).', 'Decir que el salario «ganó» mirando sólo el salario nominal.'],
        practice: { fixed: tp2Fixed, random: tp2Rand, build: tp2e2Build },
      },
    ],
  });
})();
