/* Unidad 4 · Capítulo 5 · TP 7 y TP 7.5 */
(function () {
  const T = String.raw;
  const { f, ft, pct, pt, rng, randInt, pick, table } = App.h;
  const L = (x) => Math.log(x);

  /* ------------------------------------------------------------------ */
  /* TP 7 · Ejercicio 1 · gobierno + consumidor con números             */
  /* ------------------------------------------------------------------ */
  function govBuild(p) {
    const r = ((1 + p.R) * p.P1) / p.P2 - 1;
    const B = p.G1 - p.T1, BN = B * p.P1, T2 = p.G2 + (1 + r) * B;
    const Yd1 = p.Y1 - p.T1, Yd2 = p.Y2 - T2, W = Yd1 + Yd2 / (1 + r);
    const C1 = W / (1 + p.b), C2 = p.b * (1 + r) * C1, SP = Yd1 - C1, SG = p.T1 - p.G1, ST = SP + SG;
    const enun = `<p>Economía de dos períodos con consumidor representativo ($u = \\ln c_1 + b\\ln c_2$, $b = ${ft(p.b)}$) y gobierno. Datos: $Y_1 = ${p.Y1}$, $Y_2 = ${p.Y2}$, $G_1 = ${p.G1}$, $G_2 = ${p.G2}$, $T_1 = ${p.T1}$. El gobierno se endeuda en pesos a la tasa nominal $R = ${pt(p.R, 0)}$, y los precios son $P_1 = ${ft(p.P1)}$, $P_2 = ${ft(p.P2)}$.</p><ol><li>Escribí las restricciones del gobierno en cada período, calculá la deuda y el impuesto $T_2$ que hace falta, y verificá la RPI del gobierno en términos reales.</li><li>Escribí la RPI real del consumidor.</li><li>Encontrá $c_1^*$, $c_2^*$, el ahorro privado, el público y el total.</li></ol>`;
    const steps = [
      { t: 'La tasa real', b: `$$1 + r = \\frac{(1+R)P_1}{P_2} = \\frac{${ft(1 + p.R)}\\cdot ${ft(p.P1)}}{${ft(p.P2)}} = ${ft(1 + r, 4)} \\;\\Rightarrow\\; r = ${pt(r, 2)}$$` },
      { t: 'Inciso 1 · Restricciones del gobierno', b: `<p>Con deuda nominal $B^N$:</p>$$P_1G_1 = P_1T_1 + B^N \\qquad P_2G_2 + (1+R)B^N = P_2T_2$$<p>Deuda nominal: $B^N = ${ft(p.P1)}\\cdot(${p.G1} - ${p.T1}) = ${ft(BN)}$. En términos reales $B = B^N/P_1 = ${ft(B)}$ (${B > 0 ? 'el gobierno se endeuda' : B < 0 ? 'el gobierno ahorra' : 'no hay deuda'}).</p><p>Dividiendo cada restricción por su precio y usando Fisher: $G_1 = T_1 + B$ y $G_2 + (1+r)B = T_2$:</p>$$T_2 = ${p.G2} + ${ft(1 + r, 4)}\\cdot (${ft(B)}) = ${ft(T2)}$$<p>RPI del gobierno: $G_1 + \\frac{G_2}{1+r} = T_1 + \\frac{T_2}{1+r}$ → $${ft(p.G1 + p.G2 / (1 + r))} = ${ft(p.T1 + T2 / (1 + r))}$ ✓.</p>` },
      { t: 'Inciso 2 · RPI del consumidor', b: `<p>Por período: $Y_1 = C_1 + T_1 + S^P$ y $Y_2 + (1+r)S^P = C_2 + T_2$. Juntando:</p>$$C_1 + \\frac{C_2}{1+r} = Y_1 - T_1 + \\frac{Y_2 - T_2}{1+r} = ${ft(Yd1)} + \\frac{${ft(Yd2)}}{${ft(1 + r, 4)}} = ${ft(W)}$$` },
      { t: 'Inciso 3 · Consumos y ahorros', b: `$$c_1^* = \\frac{1}{1+b}\\left(Y^d_1 + \\frac{Y^d_2}{1+r}\\right) = \\frac{${ft(W)}}{${ft(1 + p.b)}} = ${ft(C1)}\\qquad c_2^* = b(1+r)c_1^* = ${ft(C2)}$$$$S^P = Y^d_1 - c_1^* = ${ft(SP)}\\qquad S^G = T_1 - G_1 = ${ft(SG)}\\qquad S^T = S^P + S^G = ${ft(ST)}$$<p>Chequeo: $S^T = Y_1 - C_1 - G_1 = ${p.Y1} - ${ft(C1)} - ${p.G1} = ${ft(p.Y1 - C1 - p.G1)}$ ✓.</p>` },
    ];
    return { enun, steps };
  }
  const govFixed = [
    { Y1: 200, Y2: 150, G1: 30, T1: 20, G2: 30, P1: 1, P2: 1.1, R: 0.21, b: 0.9 },
    { Y1: 150, Y2: 150, G1: 20, T1: 30, G2: 40, P1: 2, P2: 2.4, R: 0.32, b: 0.8 },
    { Y1: 120, Y2: 200, G1: 10, T1: 10, G2: 20, P1: 1, P2: 1.5, R: 0.65, b: 0.95 },
    { Y1: 300, Y2: 100, G1: 50, T1: 30, G2: 10, P1: 1, P2: 1.2, R: 0.5, b: 0.6 },
    { Y1: 100, Y2: 100, G1: 20, T1: 0, G2: 20, P1: 1, P2: 1, R: 0.05, b: 0.9 },
  ];
  const govRand = (R) => { const inf = pick(R, [0, 0.1, 0.2, 0.5]), rr = pick(R, [0.05, 0.1, 0.2]); const G1 = randInt(R, 1, 5) * 10; return { Y1: randInt(R, 10, 30) * 10, Y2: randInt(R, 8, 25) * 10, G1, T1: Math.max(0, G1 + randInt(R, -2, 1) * 10), G2: randInt(R, 1, 4) * 10, P1: 1, P2: 1 + inf, R: Math.round(((1 + rr) * (1 + inf) - 1) * 100) / 100, b: pick(R, [0.6, 0.8, 0.9, 0.95]) }; };

  /* ------------------------------------------------------------------ */
  /* TP 7 · Ejercicio 2 · shocks fiscales con números                    */
  /* ------------------------------------------------------------------ */
  const SH = {
    g1t1: { n: (K) => `un aumento de $G_1$ en ${K} financiado con un aumento de $T_1$ en ${K}`, dY1: -1, dY2: 0, dSG: 0, w: 'g1t1' },
    g2t2: { n: (K) => `un aumento de $G_2$ en ${K} financiado con un aumento de $T_2$ en ${K}`, dY1: 0, dY2: -1, dSG: 0, w: 'g2t2' },
    both: { n: (K) => `un aumento de $G_1$ y $G_2$ en ${K} cada uno, financiando $G_1$ con $T_1$ y $G_2$ con $T_2$`, dY1: -1, dY2: -1, dSG: 0, w: 'gboth_hi,gboth_lo' },
    g1b: { n: (K) => `un aumento de $G_1$ en ${K} financiado <b>con deuda</b> (T1 no cambia; T2 sube lo necesario)`, dY1: 0, dY2: 'debt', dSG: -1, w: 'g1b' },
  };
  function shBuild(p) {
    const s = SH[p.k], K = p.K, r = p.r, b = p.b;
    const dYd1 = s.dY1 * K, dYd2 = s.dY2 === 'debt' ? -(1 + r) * K : s.dY2 * K;
    const dC1 = (dYd1 + dYd2 / (1 + r)) / (1 + b), dC2 = (b * ((1 + r) * dYd1 + dYd2)) / (1 + b);
    const dSP = dYd1 - dC1, dSG = s.dSG * K, dST = dSP + dSG;
    const rows = [['Ahorro público SG', dSG < 0 ? '↓' : '='], ['Ahorro privado SP', App.h.sgn(dSP)], ['Ahorro total ST', App.h.sgn(dST)], ['Tasa real r', App.h.sgn(-dST)], ['Inversión I', App.h.sgn(dST)], ['Consumo C1', '↓'], ['Consumo C2', '↓']];
    const enun = `<p>En el modelo del TP 7 ($c_2 = b(1+r)c_1$, impuestos de suma fija), con $b = ${ft(b)}$ y $r = ${pt(r, 0)}$ inicial, analizá ${s.n(K)}. Calculá a tasa fija $\\Delta C_1$, $\\Delta C_2$, $\\Delta S^P$, $\\Delta S^G$ y $\\Delta S^T$, y después qué pasa en el mercado de crédito con r, la inversión y los consumos.</p>`;
    const steps = [
      { t: 'Cambios en el ingreso disponible y el ahorro público', b: `$$\\Delta Y^d_1 = ${ft(dYd1)}\\qquad \\Delta Y^d_2 = ${ft(dYd2)}\\qquad \\Delta S^G = \\Delta T_1 - \\Delta G_1 = ${ft(dSG)}$$` + (p.k === 'g1b' ? `<p>Con deuda: $\\Delta B = ${K}$ y para respetar la RPI del gobierno $\\Delta T_2 = (1+r)\\Delta B = ${ft((1 + r) * K)}$.</p>` : '') },
      { t: 'Consumo a tasa fija', b: `$$\\Delta C_1 = \\frac{1}{1+b}\\left(\\Delta Y^d_1 + \\frac{\\Delta Y^d_2}{1+r}\\right) = \\frac{1}{${ft(1 + b)}}\\left(${ft(dYd1)} + \\frac{${ft(dYd2)}}{${ft(1 + r)}}\\right) = ${ft(dC1)}$$$$\\Delta C_2 = \\frac{b}{1+b}\\big((1+r)\\Delta Y^d_1 + \\Delta Y^d_2\\big) = ${ft(dC2)}$$<p>El consumidor reparte la caída de su riqueza entre los dos períodos (suavización).</p>` },
      { t: 'Ahorro a tasa fija', b: `$$\\Delta S^P = \\Delta Y^d_1 - \\Delta C_1 = ${ft(dYd1)} - (${ft(dC1)}) = ${ft(dSP)}\\qquad \\Delta S^T = \\Delta S^P + \\Delta S^G = ${ft(dST)}$$` + (p.k === 'both' ? `<p>Fórmula general: $\\Delta S^P = \\frac{K}{1+b}\\left(\\frac{1}{1+r} - b\\right)$. Acá $\\frac{1}{1+r} = ${ft(1 / (1 + r), 3)}$ ${1 / (1 + r) > b ? '&gt;' : '&lt;'} $b = ${ft(b)}$, así que el ahorro ${1 / (1 + r) > b ? 'sube' : 'baja'}.</p>` : '') + (p.k === 'g1b' ? `<p>Comparalo con financiar con $T_1$: da exactamente el mismo $\\Delta S^T = -\\frac{b}{1+b}K = ${ft((-b * K) / (1 + b))}$. Eso es la <mark>equivalencia ricardiana</mark>: el privado ahorra más ($\\Delta S^P > 0$) pero el público ahorra menos.</p>` : '') },
      { t: 'Mercado de crédito y resultado', b: `<p>${dST < 0 ? 'Cae el ahorro total ofrecido a cada tasa; I(r) no se mueve → <b>r sube</b> y la inversión cae (crowding out).' : dST > 0 ? 'Sube el ahorro total ofrecido a cada tasa; I(r) no se mueve → <b>r baja</b> y la inversión sube.' : 'El ahorro total no cambia: r e I quedan igual.'}</p>` + table(['Variable', 'Cambio de equilibrio'], rows) + `<div data-w="credit" data-o="${s.w}"></div>` },
    ];
    return { enun, steps, arrows: { cols: ['Cambio'], rows } };
  }
  const shFixed = [{ k: 'g1t1', K: 10, r: 0.1, b: 0.9 }, { k: 'g2t2', K: 10, r: 0.25, b: 0.8 }, { k: 'both', K: 12, r: 0.2, b: 0.8 }, { k: 'both', K: 10, r: 0.1, b: 0.95 }, { k: 'g1b', K: 10, r: 0.1, b: 0.9 }];
  const shRand = (R) => ({ k: pick(R, ['g1t1', 'g2t2', 'both', 'both', 'g1b']), K: randInt(R, 1, 4) * 5, r: pick(R, [0.05, 0.1, 0.2, 0.25]), b: pick(R, [0.7, 0.8, 0.9, 0.95]) });

  /* ------------------------------------------------------------------ */
  /* TP 7.5 · equivalencia ricardiana con restricción de crédito          */
  /* ------------------------------------------------------------------ */
  function rcBuild(p) {
    const { Y1, Y2, T1, T2, r, b, cut } = p;
    const sol = (t1, t2) => {
      const Yd1 = Y1 - t1, Yd2 = Y2 - t2, W = Yd1 + Yd2 / (1 + r);
      const C1u = W / (1 + b), C2u = b * (1 + r) * C1u;
      const bind = C1u > Yd1; const C1 = bind ? Yd1 : C1u, C2 = bind ? Yd2 : C2u;
      return { Yd1, Yd2, W, C1u, C2u, bind, C1, C2, SP: Yd1 - C1, Uu: L(C1u) + b * L(C2u), U: L(C1) + b * L(C2) };
    };
    const A = sol(T1, T2), T1n = T1 - cut, T2n = T2 + (1 + r) * cut, B = sol(T1n, T2n);
    const dSP = B.SP - A.SP, dSG = -cut, dST = dSP + dSG;
    const RE = Math.abs(dST) < 1e-6;
    const enun = `<p>Consumidor con $U = \\ln C_1 + \\beta\\ln C_2$ y restricción de crédito $C_1 \\le Y_1 - T_1 = Y^d_1$. Datos: $Y_1 = ${Y1}$, $Y_2 = ${Y2}$, $T_1 = ${T1}$, $T_2 = ${T2}$, $r = ${ft(r)}$, $\\beta = ${b === 2 / 3 ? '\\tfrac23' : ft(b)}$.</p><ol><li>Graficá la RPI con la restricción de crédito.</li><li>Encontrá el óptimo sin restricción y con restricción, y la utilidad de cada uno.</li><li>El gasto no cambia y el gobierno baja $T_1$ en ${cut}. ¿Cuánto debe cambiar $T_2$?</li><li>Encontrá la nueva elección y su utilidad. ¿Se cumple la equivalencia ricardiana?</li></ol>`;
    const bT = b === 2 / 3 ? '\\tfrac23' : ft(b);
    const steps = [
      { t: 'Inciso 1 · RPI y conjunto factible', b: `$$Y^d_1 = ${Y1} - ${T1} = ${ft(A.Yd1)}\\qquad Y^d_2 = ${Y2} - ${T2} = ${ft(A.Yd2)}$$$$C_1 + \\frac{C_2}{${ft(1 + r)}} = ${ft(A.Yd1)} + \\frac{${ft(A.Yd2)}}{${ft(1 + r)}} = ${ft(A.W)}$$<p>La RPI corta los ejes en $C_1 = ${ft(A.W)}$ y $C_2 = ${ft(A.W * (1 + r))}$. Además $C_1 \\le ${ft(A.Yd1)}$ (equivale a $S^P \\ge 0$): la frontera queda recortada en la dotación $(${ft(A.Yd1)}, ${ft(A.Yd2)})$.</p>` },
      { t: 'Inciso 2 · Óptimo sin y con restricción', b: `$$C_1^* = \\frac{1}{1+${bT}}\\cdot ${ft(A.W)} = ${ft(A.C1u)}\\qquad C_2^* = ${bT}\\cdot ${ft(1 + r)}\\cdot ${ft(A.C1u)} = ${ft(A.C2u)}\\qquad S^P = ${ft(A.Yd1 - A.C1u)}$$<p>${A.bind ? `Para elegir esa canasta necesita pedir prestado ${ft(A.C1u - A.Yd1)}, pero no puede: <b>la restricción está activa</b> y consume su ingreso disponible, $C_1 = ${ft(A.C1)}$, $C_2 = ${ft(A.C2)}$.` : `Como $${ft(A.C1u)} \\le ${ft(A.Yd1)}$, es ahorrista: <b>la restricción no está activa</b>.`}</p>` + table(['Caso', 'C1', 'C2', 'SP', 'U'], [['Sin restricción', f(A.C1u), f(A.C2u), f(A.Yd1 - A.C1u), f(A.Uu, 3)], ['Con restricción', f(A.C1), f(A.C2), f(A.SP), f(A.U, 3)]]) },
      { t: 'Inciso 3 · RPI del gobierno', b: `$$\\Delta G_1 + \\frac{\\Delta G_2}{1+r} = \\Delta T_1 + \\frac{\\Delta T_2}{1+r} \\;\\Rightarrow\\; 0 = \\Delta T_1 + \\frac{\\Delta T_2}{1+r} \\;\\Rightarrow\\; \\Delta T_2 = -(1+r)\\Delta T_1$$$$\\Delta T_1 = -${cut}\\;\\Rightarrow\\; \\Delta T_2 = ${ft((1 + r) * cut)},\\quad T_1' = ${ft(T1n)},\\quad T_2' = ${ft(T2n)}$$<p>La baja de hoy se devuelve mañana con intereses.</p>` },
      { t: 'Inciso 4 · Nueva elección', b: `$$Y^{d\\prime}_1 = ${ft(B.Yd1)}\\qquad Y^{d\\prime}_2 = ${ft(B.Yd2)}\\qquad Y^{d\\prime}_1 + \\frac{Y^{d\\prime}_2}{1+r} = ${ft(B.W)}\\ (\\text{la misma RPI})$$<p>Sin restricción elegiría $C_1 = ${ft(B.C1u)}$; el nuevo techo es ${ft(B.Yd1)}. ${B.bind ? '<b>Sigue activa</b>:' : '<b>Ya no está activa</b>:'} $C_1' = ${ft(B.C1)}$, $C_2' = ${ft(B.C2)}$, $U' = ${ft(B.U, 3)}$.</p>` + table(['', 'C1', 'C2', 'SP', 'U'], [['Antes', f(A.C1), f(A.C2), f(A.SP), f(A.U, 3)], ['Después', f(B.C1), f(B.C2), f(B.SP), f(B.U, 3)]]) + `$$\\Delta S^P = ${ft(dSP)}\\qquad \\Delta S^G = ${ft(dSG)}\\qquad \\Delta S^T = ${ft(dST)}$$<div class="note ${RE ? 'ok' : 'warn'}"><span class="lbl">${RE ? 'se cumple la equivalencia ricardiana' : 'no se cumple la equivalencia ricardiana'}</span>${RE ? 'El consumidor ahorra toda la baja de impuestos: no cambian los consumos, el ahorro total ni la utilidad.' : A.bind && !B.bind ? 'La baja de impuestos relaja la restricción lo suficiente: consume una parte y ahorra el resto. Cambian C1, C2 y el ahorro total.' : 'La baja de impuestos se consume: el ahorro privado no compensa la caída del público. Cambian C1, C2, el ahorro total y sube la utilidad.'}</div><div data-w="ricardo"></div>` },
    ];
    return { enun, steps };
  }
  const rcFixed = [
    { Y1: 100, Y2: 200, T1: 50, T2: 50, r: 0.5, b: 2 / 3, cut: 10 },
    { Y1: 200, Y2: 100, T1: 50, T2: 50, r: 0.5, b: 2 / 3, cut: 10 },
    { Y1: 60, Y2: 150, T1: 20, T2: 20, r: 0.25, b: 0.8, cut: 15 },
    { Y1: 100, Y2: 150, T1: 30, T2: 30, r: 0.2, b: 0.9, cut: 25 },
    { Y1: 150, Y2: 80, T1: 20, T2: 20, r: 0.1, b: 0.9, cut: 20 },
  ];
  const rcRand = (R) => {
    const p = { Y1: randInt(R, 5, 20) * 10, Y2: randInt(R, 5, 20) * 10, T1: randInt(R, 1, 4) * 10, T2: randInt(R, 1, 4) * 10, r: pick(R, [0.1, 0.2, 0.25, 0.5]), b: pick(R, [0.6, 2 / 3, 0.8, 0.9]), cut: randInt(R, 1, 4) * 5 };
    const need = p.T2 + (1 + p.r) * p.cut + 20;
    if (p.Y2 < need) p.Y2 = Math.ceil(need / 10) * 10;
    if (p.Y1 - p.T1 < 10) p.Y1 = p.T1 + 20;
    if (p.cut > p.T1) p.cut = p.T1;
    return p;
  };

  /* ------------------------------------------------------------------ */
  App.UNITS.push({
    id: 'u4', n: 4, title: 'Política fiscal', caps: 'Cap. 5', tps: 'TP 7 y 7.5',
    blurb: 'El gobierno en dos períodos, ahorro público y privado, crowding out, impuestos de suma fija y equivalencia ricardiana.',
    lessons: [
      {
        id: 'u4l1', t: 'El gobierno y el ahorro nacional', d: 'Qué hace el gobierno, SP, SG y crowding out.',
        cards: [
          { t: 'Qué hace el gobierno', b: T`<ul><li>Gasta en <b>bienes públicos</b> (defensa, justicia, rutas) y <b>bienes privados</b> (salud, educación).</li><li>Hace <b>transferencias</b> (jubilaciones, seguro de desempleo).</li><li>Cobra <b>impuestos</b> (T), <b>pide prestado</b> (B) y <b>paga intereses</b>.</li></ul>$$B_{t+1} + T_t = G^{pub} + G^{priv} + TR + B_t + INT_t$$`, w: 'flujo', o: 'gob' },
          { t: 'Ahorro privado, público y total', b: T`$$S^P = Y + TR + INT - T - C\qquad S^G = T - (G + TR + INT)$$$$S^T = S^P + S^G = Y - C - G$$<p>En economía cerrada $Y = C + I + G$, así que <mark>S^T = I</mark>, o sea $S^P = I - S^G$. El ahorro privado financia la inversión <b>y</b> el déficit fiscal.</p>` },
          { t: 'Crowding out', b: T`<p>Si el gobierno desahorra ($S^G < 0$), parte del ahorro privado se va a financiar el déficit: hay menos fondos para invertir. La tasa sube y la inversión baja: es el <b>crowding out</b>. Con menos inversión hoy, hay menos capital y menos producto mañana: también hay crowding out del consumo futuro.</p><p>(En la visión keynesiana, $Y = \frac{1}{1-c}(c_0 + I + G)$ y el gasto tiene un efecto multiplicador $\frac{1}{1-c} > 1$. En el modelo del curso el gasto no es productivo y no hay multiplicador.)</p>`, q: { k: 'vf', q: 'Si el gobierno tiene déficit, en economía cerrada el ahorro privado es mayor que la inversión.', a: true, why: 'S^P = I − S^G, y con S^G < 0 queda S^P > I.' } },
        ],
      },
      {
        id: 'u4l2', t: 'El gobierno en dos períodos', d: 'Restricción por período, RPI del gobierno y deuda nominal.',
        cards: [
          { t: 'Las restricciones del gobierno', b: T`$$G_1 = T_1 + B \qquad T_2 = G_2 + (1+r)B$$<p>Es igual que el consumidor: G hace de C, T de Y y B de −S. Si $B > 0$ el gobierno se endeuda; si $B < 0$, ahorra. No hay default: al final todo se paga.</p><p>Despejando B de la segunda y reemplazando:</p>$$G_1 + \frac{G_2}{1+r} = T_1 + \frac{T_2}{1+r}$$<p><mark>El valor presente del gasto iguala el valor presente de los impuestos.</mark></p>` },
          { t: 'Con deuda nominal (TP 7)', b: T`<p>Si la deuda es en pesos, $B^N_1$:</p>$$P_1G_1 = P_1T_1 + B^N_1\qquad P_2G_2 + (1+R)B^N_1 = P_2T_2$$<p>Con $B \equiv B^N_1/P_1$ y Fisher $1 + r = (1+R)P_1/P_2$, dividiendo cada una por su precio vuelven a quedar $G_1 = T_1 + B$ y $G_2 + (1+r)B = T_2$.</p><div class="ex"><span class="lbl">con números</span>$G_1 = 30$, $T_1 = 20$, $G_2 = 30$, $r = 10\%$: $B = 10$ y $T_2 = 30 + 1{,}1\cdot 10 = 41$. Chequeo: $30 + 30/1{,}1 = 57{,}27$ y $20 + 41/1{,}1 = 57{,}27$.</div>`, q: { k: 'mc', q: 'G1 = 50, T1 = 30, G2 = 10, r = 25 %. ¿T2?', o: ['30', '35', '25', '10'], a: 1, why: 'B = 20 y T2 = 10 + 1,25 · 20 = 35.' } },
        ],
      },
      {
        id: 'u4l3', t: 'El consumidor con impuestos', d: 'Ingreso disponible, consumo óptimo y tipos de impuestos.',
        cards: [
          { t: 'Ingreso disponible y RPI', b: T`<p>Con impuestos de suma fija: $Y_1 = C_1 + T_1 + S^P$ y $Y_2 + (1+r)S^P = C_2 + T_2$. Con $Y^d_t = Y_t - T_t$:</p>$$C_1 + \frac{C_2}{1+r} = Y^d_1 + \frac{Y^d_2}{1+r}$$<p>Los impuestos bajan la recta en paralelo (dada r): puro efecto ingreso negativo.</p>` },
          { t: 'Las fórmulas del TP 7', b: T`$$C_1^* = \frac{1}{1+b}\left(Y_1 - T_1 + \frac{Y_2 - T_2}{1+r}\right)\qquad C_2^* = \frac{b}{1+b}\big[(1+r)(Y_1 - T_1) + Y_2 - T_2\big]$$$$S^{P*} = \frac{b}{1+b}(Y_1 - T_1) - \frac{1}{1+b}\frac{Y_2 - T_2}{1+r}$$<p>Son las de la unidad 3 con Y reemplazado por $Y^d$. Para un cambio de impuestos, aplicalas a los Δ: $\Delta C_1 = \frac{1}{1+b}\left(\Delta Y^d_1 + \frac{\Delta Y^d_2}{1+r}\right)$.</p>` },
          { t: 'Suma fija vs proporcional', b: T`<p>Un impuesto de <b>suma fija</b> no depende de lo que hagas: no cambia precios relativos, sólo hay efecto ingreso. Uno <b>proporcional al salario</b> baja el salario neto $w(1-t)$: abarata el ocio y agrega efecto sustitución.</p><p>A igual recaudación, la suma fija deja al consumidor en una curva de indiferencia más alta: <mark>distorsiona menos</mark> (aunque se discuta su equidad).</p><p>Impuesto al ingreso vs al consumo: con $t_y = \frac{t_c}{1 + t_c}$ dan la misma restricción. Ejemplo: un IVA de 21 % equivale a un impuesto al ingreso de $0{,}21/1{,}21 = 17{,}4\%$. La diferencia en la práctica viene de quién evade cada uno.</p>`, q: { k: 'vf', q: 'Un impuesto de suma fija genera efecto sustitución entre consumo y ocio.', a: false, why: 'No cambia el precio relativo w/P: sólo hay efecto ingreso.' } },
        ],
      },
      {
        id: 'u4l4', t: 'Shocks fiscales', d: 'Más gasto hoy, mañana o en ambos períodos.',
        cards: [
          { t: 'G1 ↑ financiado con T1', b: T`<p>$\Delta G_1 = \Delta T_1 = K$: el ahorro público no cambia ($\Delta S^G = 0$). El consumidor pierde K de ingreso hoy y suaviza:</p>$$\Delta C_1 = -\frac{K}{1+b}\qquad \Delta C_2 = -\frac{b(1+r)}{1+b}K\qquad \Delta S^P = -\frac{b}{1+b}K$$<p>C1 cae <b>menos</b> que el impuesto: el resto lo saca del ahorro. Cae el ahorro total a cada tasa → <b>r↑, I↓</b>. Crowding out del consumo y de la inversión.</p>`, w: 'credit', o: 'g1t1,g2t2' },
          { t: 'G1 y G2 ↑ en K cada uno, con impuestos de cada período', b: T`<p>Ahora $\Delta Y^d_1 = \Delta Y^d_2 = -K$. A tasa fija:</p>$$\Delta S^P = \frac{K}{1+b}\left(\frac{1}{1+r} - b\right)$$<p>El signo depende de comparar el <b>descuento del consumidor b</b> con el <b>descuento del mercado</b> $\frac{1}{1+r}$:</p><table><tr><th>Condición</th><th>ΔS</th><th>r</th><th>I</th></tr><tr><td>$\frac{1}{1+r} > b$</td><td>↑</td><td>↓</td><td>↑</td></tr><tr><td>$\frac{1}{1+r} = b$</td><td>0</td><td>=</td><td>=</td></tr><tr><td>$\frac{1}{1+r} < b$</td><td>↓</td><td>↑</td><td>↓</td></tr></table><p>Si $b = \frac{1}{1+r}$, el consumidor consume parejo; si le sacan K en cada período, no toca su ahorro.</p>`, w: 'credit', o: 'gboth_hi,gboth_lo', q: { k: 'mc', q: 'b = 0,8 y r = 20 %. Suben G1 y G2 en 10 con impuestos contemporáneos. ¿Ahorro privado a tasa fija?', o: ['Sube 0,19', 'Baja 4,44', 'No cambia', 'Baja 0,19'], a: 0, why: 'ΔS = 10/1,8 · (1/1,2 − 0,8) = 5,556 · 0,0333 = 0,185.' } },
        ],
      },
      {
        id: 'u4l5', t: 'Equivalencia ricardiana', d: 'Deuda o impuestos da lo mismo… salvo con restricción de crédito.',
        cards: [
          { t: 'Deuda hoy = impuestos mañana', b: T`<p>El gobierno baja $T_1$ y, para cumplir su RPI, sube $T_2$ en $(1+r)$ veces eso: $\Delta T_2 = -(1+r)\Delta T_1$. Para el consumidor:</p>$$\Delta Y^d_1 + \frac{\Delta Y^d_2}{1+r} = -\Delta T_1 - \frac{-(1+r)\Delta T_1}{1+r} = 0$$<p>La RPI no cambia → <mark>los consumos no cambian</mark>. El consumidor ahorra toda la baja de impuestos para pagar la suba de mañana: $\Delta S^P = -\Delta T_1 = -\Delta S^G$ y $\Delta S^T = 0$. La dotación se mueve sobre la misma recta; el óptimo no.</p><p>Lo mismo con un aumento de G1: da igual financiarlo con deuda o con impuestos. Sólo importa el valor presente del gasto.</p>`, w: 'ricardo' },
          { t: 'Por qué se rompe con restricción de crédito', b: T`<p>Si el consumidor quería endeudarse y no puede ($C_1 \le Y^d_1$), está trabado en su dotación. Una baja de $T_1$ le sube el techo: <b>consume parte de la baja</b>. Cambian $C_1$, $C_2$ y el ahorro total, y sube su utilidad.</p><div class="ex"><span class="lbl">TP 7.5</span>$Y_1 = 100$, $Y_2 = 200$, $T_1 = T_2 = 50$, $r = 0{,}5$, $\beta = \frac23$. Sin restricción elegiría $(90, 90)$ con $U = 7{,}500$, pero sólo tiene 50 hoy: elige $(50, 150)$ con $U = 7{,}252$. Si $T_1$ baja a 40 y $T_2$ sube a 65: elige $(60, 135)$, $U = 7{,}365$. <b>No se cumple</b> la equivalencia ricardiana. Con $Y_1 = 200$, $Y_2 = 100$ es ahorrista, la restricción no lo afecta y <b>sí se cumple</b>.</div>`, q: { k: 'vf', q: 'Con restricción de crédito activa, una baja de impuestos hoy compensada con más impuestos mañana no cambia el consumo.', a: false, why: 'Le relaja la restricción: consume parte de la baja. La equivalencia ricardiana falla.' } },
          { t: 'Los supuestos que la sostienen', b: T`<ul><li>Impuestos de <b>suma fija</b> (sin distorsiones).</li><li>Gobierno y consumidor se endeudan <b>a la misma tasa</b> (con riesgo país esto falla: lo vas a ver en la unidad 5).</li><li>Sin <b>restricciones al crédito</b>.</li><li>No hay default.</li></ul><p>Consecuencia política: en este modelo, prometer bajar impuestos sin bajar el gasto no sirve de nada, porque la gente sabe que mañana suben.</p><div class="ex"><span class="lbl">ejemplo del apunte: AFJP</span>Al privatizar el sistema jubilatorio bajaron los aportes al Estado, las familias ahorraron en las AFJP y el Estado emitió deuda para pagar a los jubilados del sistema de reparto. El ahorro extra en las AFJP igualó el endeudamiento extra del gobierno: <b>sin efecto sobre el ahorro nacional</b>.</div>` },
        ],
      },
    ],
    quiz: [
      { k: 'vf', q: 'El ahorro total en economía cerrada es Y − C − G.', a: true, why: 'S^T = S^P + S^G = Y − C − G = I.' },
      { k: 'mc', q: 'G1 = 40, T1 = 25. ¿Ahorro público del período 1?', o: ['15', '−15', '65', '0'], a: 1, why: 'S^G = T1 − G1 = −15 (y B = 15).' },
      { k: 'vf', q: 'La RPI del gobierno dice que el valor presente del gasto debe igualar el valor presente de los impuestos.', a: true, why: 'Porque no hay default.' },
      { k: 'mc', q: 'G1 = T1 + B y T2 = G2 + (1+r)B. Si B = 20 y r = 10 %, ¿cuánto más hay que cobrar mañana además de G2?', o: ['20', '22', '2', '18'], a: 1, why: '(1+r)B = 22.' },
      { k: 'vf', q: 'Ante un aumento de G1 financiado con T1, el consumo cae en el mismo monto que el aumento del gasto.', a: false, why: 'Cae K/(1+b): menos que K, porque el consumidor suaviza y baja su ahorro.' },
      { k: 'mc', q: 'G1↑ financiado con T1. ¿Qué pasa con r e I?', o: ['r↑, I↓', 'r↓, I↑', 'Nada', 'r↑, I↑'], a: 0, why: 'Cae el ahorro total a cada tasa.' },
      { k: 'vf', q: 'Un aumento de G1 financiado con deuda tiene los mismos efectos que financiado con impuestos de hoy, si vale la equivalencia ricardiana.', a: true, why: 'El valor presente de los impuestos es el mismo.' },
      { k: 'mc', q: 'Equivalencia ricardiana: el gobierno baja T1 en 10. ¿Qué pasa con el ahorro privado?', o: ['Sube 10', 'Baja 10', 'No cambia', 'Sube 5'], a: 0, why: 'El consumidor ahorra toda la baja: ΔS^P = 10 = −ΔS^G.' },
      { k: 'mc', q: 'Suben G1 y G2 en K con impuestos de cada período y 1/(1+r) > b. El ahorro privado a tasa fija…', o: ['sube', 'baja', 'no cambia', 'es ambiguo'], a: 0, why: 'ΔS^P = K/(1+b)·(1/(1+r) − b) > 0.' },
      { k: 'vf', q: 'Los impuestos de suma fija desplazan la RPI del consumidor en paralelo.', a: true, why: 'Bajan el ingreso disponible sin cambiar r.' },
      { k: 'vf', q: 'Un impuesto proporcional al salario es menos distorsivo que uno de suma fija con la misma recaudación.', a: false, why: 'Es al revés: el proporcional agrega efecto sustitución.' },
      { k: 'mc', q: 'Un IVA de 25 % equivale a un impuesto al ingreso de:', o: ['25 %', '20 %', '33 %', '15 %'], a: 1, why: 't_y = 0,25/1,25 = 20 %.' },
      { k: 'vf', q: 'Si un consumidor es ahorrista, una restricción al crédito no rompe la equivalencia ricardiana.', a: true, why: 'La restricción no está activa (TP 7.5, inciso 7).' },
      { k: 'mc', q: 'En el TP 7.5 con Y1 = 100, Y2 = 200, T = 50, r = 0,5 y β = 2/3, el óptimo sin restricción es:', o: ['(50, 150)', '(90, 90)', '(60, 135)', '(110, 110)'], a: 1, why: 'C1 = 0,6·(50 + 150/1,5) = 90 y C2 = (2/3)(1,5)(90) = 90.' },
      { k: 'vf', q: 'El crowding out implica que un mayor déficit del gobierno reduce la inversión privada.', a: true, why: 'Compiten por el mismo ahorro.' },
    ],
    formulas: [
      { n: 'Ahorros', tex: T`S^P = Y^d - C,\quad S^G = T - G,\quad S^T = Y - C - G = I`, d: 'Economía cerrada.' },
      { n: 'Restricciones del gobierno', tex: T`G_1 = T_1 + B,\quad T_2 = G_2 + (1+r)B`, d: 'B > 0 deuda, B < 0 ahorro.' },
      { n: 'RPI del gobierno', tex: T`G_1 + \frac{G_2}{1+r} = T_1 + \frac{T_2}{1+r}`, d: 'Valor presente del gasto = valor presente de los impuestos.' },
      { n: 'RPI del consumidor con impuestos', tex: T`C_1 + \frac{C_2}{1+r} = Y_1 - T_1 + \frac{Y_2 - T_2}{1+r}`, d: 'Ingreso disponible.' },
      { n: 'Consumo con impuestos', tex: T`C_1^* = \frac{1}{1+b}\left(Y^d_1 + \frac{Y^d_2}{1+r}\right)`, d: 'C2* = b(1+r)C1*.' },
      { n: 'Ahorro privado', tex: T`S^{P} = \frac{b}{1+b}Y^d_1 - \frac{1}{1+b}\frac{Y^d_2}{1+r}`, d: 'TP 7.' },
      { n: 'G1↑ con T1', tex: T`\Delta C_1 = -\frac{K}{1+b},\ \Delta S^P = -\frac{bK}{1+b}`, d: 'A tasa fija.' },
      { n: 'G1 y G2 ↑ con impuestos', tex: T`\Delta S^P = \frac{K}{1+b}\left(\frac{1}{1+r} - b\right)`, d: 'El signo depende de b vs 1/(1+r).' },
      { n: 'Equivalencia ricardiana', tex: T`\Delta T_2 = -(1+r)\Delta T_1 \Rightarrow \Delta C = 0,\ \Delta S^P = -\Delta S^G`, d: 'Falla con restricción de crédito o tasas distintas.' },
      { n: 'Impuesto al ingreso vs al consumo', tex: T`t_y = \frac{t_c}{1+t_c}`, d: 'Dan la misma restricción.' },
    ],
    exercises: [
      {
        id: 'tp7e1', tp: 'TP 7', num: 1, title: 'Consumo intertemporal con gobierno', sum: 'Restricciones del gobierno con deuda nominal, RPI del consumidor y consumos óptimos.',
        consigna: T`<p>Dos períodos, consumidor con $u = \ln c_1 + b\ln c_2$ y gobierno con gasto $\{G_1, G_2\}$, impuestos de suma fija $\{T_1, T_2\}$ y deuda nominal. Ingresos $\{Y_1, Y_2\}$ y tasa nominal R, igual para ambos.</p><ol><li>Escribí la restricción del gobierno en cada período y obtené su RPI en términos reales.</li><li>Escribí la RPI real del consumidor.</li><li>Encontrá los niveles óptimos de consumo y ahorro.</li></ol>`,
        plan: T`<ol><li>Gobierno: $P_1G_1 = P_1T_1 + B^N$ y $P_2G_2 + (1+R)B^N = P_2T_2$. Definí $B = B^N/P_1$, dividí por los precios y usá Fisher. Despejá B y reemplazá.</li><li>Consumidor: restricciones por período con $T_t$ y $S^P$; despejá $S^P$ y reemplazá. Definí $Y^d_t$.</li><li>Usá $c_2 = b(1+r)c_1$ en la RPI, despejá $c_1$, después $c_2$ y $S^P = Y^d_1 - c_1$.</li></ol>`,
        profe: [
          { t: 'Inciso 1 · Deuda nominal', b: T`<p>$B^N_1$ es la deuda nominal que el gobierno emite en el primer período:</p>$$P_1G_1 = P_1T_1 + B^N_1\qquad P_2G_2 + (1+R)B^N_1 = P_2T_2$$<p>En t = 1 impuestos y deuda financian el gasto; en t = 2 los impuestos financian el gasto y la devolución de la deuda.</p>` },
          { t: 'Inciso 1 · Restricciones reales', b: T`$$B \equiv \frac{B^N_1}{P_1},\qquad 1 + r = \frac{(1+R)P_1}{P_2}$$<p>Dividiendo cada restricción por su precio: $G_1 = T_1 + B$ y $G_2 + (1+r)B = T_2$. B &gt; 0: el gobierno toma deuda; B &lt; 0: ahorra.</p>` },
          { t: 'Inciso 1 · RPI del gobierno', b: T`$$B = \frac{T_2 - G_2}{1+r} \;\Rightarrow\; G_1 = T_1 + \frac{T_2 - G_2}{1+r} \;\Rightarrow\; G_1 + \frac{G_2}{1+r} = T_1 + \frac{T_2}{1+r}$$<p>El valor presente del gasto público debe igualar el valor presente de los impuestos.</p>` },
          { t: 'Inciso 2 · RPI del consumidor', b: T`$$Y_1 = C_1 + T_1 + S^P\qquad Y_2 + (1+r)S^P = C_2 + T_2$$$$S^P = \frac{C_2 - (Y_2 - T_2)}{1+r} \;\Rightarrow\; C_1 + \frac{C_2}{1+r} = Y_1 - T_1 + \frac{Y_2 - T_2}{1+r} = Y^d_1 + \frac{Y^d_2}{1+r}$$` },
          { t: 'Inciso 3 · Consumos y ahorro', b: T`$$C_1 + \frac{b(1+r)C_1}{1+r} = Y^d_1 + \frac{Y^d_2}{1+r} \;\Rightarrow\; C_1^* = \frac{1}{1+b}\left(Y^d_1 + \frac{Y^d_2}{1+r}\right)$$$$C_2^* = \frac{b}{1+b}\big[(1+r)Y^d_1 + Y^d_2\big]\qquad S^{P*} = \frac{b}{1+b}(Y_1 - T_1) - \frac{1}{1+b}\frac{Y_2 - T_2}{1+r}$$<p>Solución interior con b &gt; 0, 1 + r &gt; 0 y riqueza disponible positiva.</p>` },
        ],
        errores: ['Escribir $(1+r)B$ en la restricción nominal: en pesos es $(1+R)B^N$.', 'Olvidarse de restar los impuestos en el ingreso del consumidor.', 'Confundir el ahorro privado con el total.'],
        practice: { fixed: govFixed, random: govRand, build: govBuild },
      },
      {
        id: 'tp7e2', tp: 'TP 7', num: 2, title: 'Shocks en equilibrio general con gobierno', sum: 'Más gasto con impuestos de hoy, o en ambos períodos: ahorro, tasa, inversión y consumos.',
        consigna: T`<p>Analizá los efectos sobre $S^P$, $S^T$, r, la inversión, $C_1$ y $C_2$ de:</p><ol><li>Un aumento en $G_1$ financiado con un aumento de $T_1$.</li><li>Un aumento en $G_1$ y $G_2$ en la misma proporción, financiando $G_1$ con $T_1$ y $G_2$ con $T_2$.</li></ol>`,
        plan: T`<ol><li>Escribí el shock con una letra: $\Delta G_1 = \Delta T_1 = K$, etc.</li><li>Calculá $\Delta S^G$, $\Delta Y^d_1$, $\Delta Y^d_2$.</li><li>Con las fórmulas de consumo, calculá a tasa fija $\Delta C_1$, $\Delta C_2$ y $\Delta S^P = \Delta Y^d_1 - \Delta C_1$.</li><li>$\Delta S^T = \Delta S^P + \Delta S^G$: si es negativo, S total se corre a la izquierda → r↑, I↓.</li><li>En el inciso 2, el signo depende de $\frac{1}{1+r}$ vs b: armá los tres casos.</li></ol>`,
        profe: [
          { t: 'Ahorro privado, público y total', b: T`$$S^P = Y_1 - T_1 - C_1\qquad S^G = T_1 - G_1\qquad S^T = Y_1 - C_1 - G_1$$<p>En el mercado de fondos $S^T(r) = I(r)$. Se analiza el cambio tributario dados los ingresos y sin desplazar la curva de inversión.</p>` },
          { t: 'Inciso 1 · Shock', b: T`$$\Delta G_1 = \Delta T_1 = K > 0,\quad \Delta G_2 = \Delta T_2 = 0$$$$\Delta S^G = K - K = 0\qquad \Delta Y^d_1 = -K\qquad \Delta Y^d_2 = 0$$` },
          { t: 'Inciso 1 · Consumo y ahorro a tasa fija', b: T`$$\Delta C_1 = \frac{1}{1+b}\left(-K + \frac{0}{1+r}\right) = -\frac{K}{1+b} < 0$$$$\Delta C_2 = \frac{b}{1+b}\big[(1+r)(-K) + 0\big] = -\frac{b(1+r)}{1+b}K < 0$$$$\Delta S^P = -K - \left(-\frac{K}{1+b}\right) = -\frac{b}{1+b}K < 0 \;\Rightarrow\; \Delta S^T = \Delta S^P < 0$$<p>Suavización: el consumidor distribuye la caída del ingreso disponible entre ambos períodos.</p>` },
          { t: 'Inciso 1 · Mercado de crédito y resultados', b: T`<p>Cae el ahorro ofrecido a cada tasa; I(r) no se desplaza; <b>r sube</b> e <b>I cae</b>.</p><table><tr><th>Variable</th><th>Cambio</th></tr><tr><td>Ahorro público</td><td>0</td></tr><tr><td>Ahorro privado</td><td>↓</td></tr><tr><td>Ahorro total</td><td>↓</td></tr><tr><td>Tasa real r</td><td>↑</td></tr><tr><td>Inversión I</td><td>↓</td></tr><tr><td>C1</td><td>↓</td></tr><tr><td>C2</td><td>↓</td></tr></table><div data-w="credit" data-o="g1t1"></div>` },
          { t: 'Inciso 2 · Gasto en ambos períodos', b: T`<p>El profe interpreta el aumento como el mismo monto: $\Delta G_1 = \Delta T_1 = \Delta G_2 = \Delta T_2 = K$. Entonces $\Delta S^G = 0$, $\Delta Y^d_1 = \Delta Y^d_2 = -K$.</p>$$\Delta C_1 = -\frac{K}{1+b}\left(1 + \frac{1}{1+r}\right) < 0\qquad \Delta C_2 = -\frac{bK}{1+b}\big[(1+r) + 1\big] < 0$$$$\Delta S^P = -K + \frac{K}{1+b} + \frac{K}{(1+b)(1+r)} = \frac{K}{1+b}\left(\frac{1}{1+r} - b\right)$$` },
          { t: 'Inciso 2 · Los tres casos', b: T`<table><tr><th></th><th>$\frac{1}{1+r_0} > b$</th><th>$= b$</th><th>$< b$</th></tr><tr><td>S^G</td><td>0</td><td>0</td><td>0</td></tr><tr><td>S^P = S^T</td><td>↑</td><td>0</td><td>↓</td></tr><tr><td>r</td><td>↓</td><td>0</td><td>↑</td></tr><tr><td>I</td><td>↑</td><td>0</td><td>↓</td></tr><tr><td>C1</td><td>↓</td><td>↓</td><td>↓</td></tr><tr><td>C2</td><td>↓</td><td>↓</td><td>↓</td></tr></table><p>Se compara el factor de descuento del consumidor, b, con el del mercado, $1/(1+r)$, evaluado en la tasa inicial.</p><div data-w="credit" data-o="gboth_hi,gboth_lo"></div>` },
        ],
        errores: ['Decir que C1 cae en K: cae K/(1+b).', 'Poner ΔS^G ≠ 0 cuando el gasto se financia con impuestos contemporáneos.', 'En el inciso 2, dar un signo único sin comparar b con 1/(1+r).'],
        practice: { fixed: shFixed, random: shRand, build: shBuild },
      },
      {
        id: 'tp75e1', tp: 'TP 7.5', num: 1, title: 'Equivalencia ricardiana con restricción al crédito', sum: 'Óptimo con y sin restricción, utilidades y una baja de impuestos compensada.',
        consigna: T`<p>Dos períodos con consumidor ($U = \ln C_1 + \beta\ln C_2$, $C_2 = \beta(1+r)C_1$), gobierno con $\{G_1, G_2\}$ financiado con $\{T_1, T_2\}$ de suma fija y/o deuda B.</p><ol><li>Encontrá la elección óptima de consumo y ahorro.</li><li>Explicá gráficamente por qué si se baja $T_1$ y se sube $T_2$ en el valor presente equivalente, no cambian consumo ni ahorro agregado.</li></ol><p>Desde acá, restricción de crédito $C_1 \le Y_1 - T_1$, con $Y_1 = 100$, $Y_2 = 200$, $T_1 = T_2 = 50$, $r = 0{,}5$, $\beta = \frac23$.</p><ol start="3"><li>Graficá la RPI con la restricción de crédito.</li><li>Señalá el óptimo sin y con restricción. ¿Utilidad máxima en cada caso?</li><li>El gasto queda fijo; se baja $T_1$ y sube $T_2$. Planteá la RPI del gobierno y cuánto cambia $T_2$.</li><li>Si $T_1' = 40$, hallá la nueva elección y su utilidad. ¿Qué pasa con la equivalencia ricardiana?</li><li>Repetí 3–6 con $Y_1 = 200$, $Y_2 = 100$.</li></ol>`,
        plan: T`<ol><li>Incisos 1–2: las fórmulas con $Y^d$ y el argumento de que la RPI no cambia.</li><li>Calculá $Y^d_1$, $Y^d_2$ y la riqueza disponible. Cortes con los ejes.</li><li>Óptimo irrestricto con la fórmula. Si $C_1^* > Y^d_1$, la restricción está activa: consume la dotación.</li><li>Utilidad: $\ln C_1 + \beta\ln C_2$ con calculadora.</li><li>$\Delta T_2 = -(1+r)\Delta T_1$. Nuevo $Y^d$, misma riqueza, nuevo techo $C_1 \le Y^{d\prime}_1$.</li><li>Compará: si cambió C1, no vale la equivalencia ricardiana.</li></ol>`,
        profe: [
          { t: 'Inciso 1 · Óptimo irrestricto', b: T`$$C_1 + S^P = Y^d_1,\quad C_2 = Y^d_2 + (1+r)S^P \;\Rightarrow\; C_1 + \frac{C_2}{1+r} = Y^d_1 + \frac{Y^d_2}{1+r}$$$$C_1^* = \frac{1}{1+\beta}\left(Y_1 - T_1 + \frac{Y_2 - T_2}{1+r}\right),\quad C_2^* = \frac{\beta}{1+\beta}\big[(1+r)(Y_1 - T_1) + Y_2 - T_2\big]$$$$S^{P*} = \frac{\beta}{1+\beta}(Y_1 - T_1) - \frac{1}{1+\beta}\frac{Y_2 - T_2}{1+r}$$` },
          { t: 'Inciso 2 · Equivalencia ricardiana', b: T`<p>$\Delta T_1 < 0$ y $\Delta T_2 = -(1+r)\Delta T_1 > 0$. El lado derecho de la RPI cambia en $-\Delta T_1 - \frac{\Delta T_2}{1+r} = -\Delta T_1 + \Delta T_1 = 0$. Entonces $\Delta C_1 = 0$, $\Delta C_2 = 0$.</p><p>$\Delta S^P = -\Delta T_1 > 0$, $\Delta S^G = \Delta T_1 < 0$, $\Delta S^T = 0$. La dotación se mueve sobre la misma recta, pero el óptimo A no cambia.</p>` },
          { t: 'Inciso 3 · RPI con restricción', b: T`$$Y^d_1 = 50,\ Y^d_2 = 150,\ C_1 + \frac{C_2}{1{,}5} = 50 + \frac{150}{1{,}5} = 150$$<p>Además $C_1 \le 50 \Leftrightarrow S^P \ge 0$. La RPI corta en $C_1 = 150$ y $C_2 = 225$; la restricción recorta todo lo que está a la derecha de la dotación (50, 150).</p>` },
          { t: 'Inciso 4 · Óptimos y utilidades', b: T`$$C_1^* = \frac{1}{1 + \frac23}\left(50 + \frac{150}{1{,}5}\right) = \tfrac35\cdot 150 = 90\qquad C_2^* = \tfrac23\cdot 1{,}5\cdot 90 = 90\qquad S^P = -40$$<p>Necesita pedir prestado 40, pero sólo dispone de 50 y no puede endeudarse: $C_1 = \min\{90, 50\} = 50$, $S^P = 0$, $C_2 = 150$. La restricción está activa.</p><table><tr><th>Caso</th><th>C1</th><th>C2</th><th>SP</th><th>U</th></tr><tr><td>Sin restricción (A)</td><td>90</td><td>90</td><td>−40</td><td>7,500</td></tr><tr><td>Con restricción (B)</td><td>50</td><td>150</td><td>0</td><td>7,252</td></tr></table>` },
          { t: 'Inciso 5 · RPI del gobierno', b: T`$$\Delta G_1 + \frac{\Delta G_2}{1+r} = \Delta T_1 + \frac{\Delta T_2}{1+r} \;\Rightarrow\; 0 = \Delta T_1 + \frac{\Delta T_2}{1+r} \;\Rightarrow\; \Delta T_2 = -(1+r)\Delta T_1$$<p>La baja de T1 se devuelve en el período 2 con intereses.</p>` },
          { t: 'Inciso 6 · Baja de T1 a 40', b: T`<p>$\Delta T_1 = -10$, $\Delta T_2 = 15$, $T_2' = 65$, $Y^{d\prime}_1 = 60$, $Y^{d\prime}_2 = 135$. La RPI es la misma ($60 + 135/1{,}5 = 150$) pero el techo pasa a $C_1 \le 60$.</p><p>Sin restricción elegiría 90 &gt; 60: sigue activa. $C_1' = 60$, $S^P = 0$, $C_2' = 135$, $U = \ln 60 + \frac23\ln 135 \approx 7{,}365$.</p><p>$\Delta S^P = 0$, $\Delta S^G = -10$, $\Delta S^T = -10$. <b>No se cumple la equivalencia ricardiana</b>: la baja de impuestos se consume y la utilidad sube.</p>` },
          { t: 'Inciso 7 · Con Y1 = 200, Y2 = 100', b: T`<p>$Y^d = (150, 50)$, riqueza $150 + 50/1{,}5 = 550/3$. $C_1^* = \frac35\cdot\frac{550}{3} = 110$, $C_2^* = 110$, $S^P = 40$, $U \approx 7{,}834$. Como 110 &lt; 150 es ahorrista y la restricción no está activa.</p><p>Con $T_1' = 40$, $T_2' = 65$: $Y^d = (160, 35)$, misma riqueza, $C_1 = 110 < 160$, $C_2 = 110$, $S^P = 50$. $\Delta S^P = 10$, $\Delta S^G = -10$, $\Delta S^T = 0$: <b>se cumple la equivalencia ricardiana</b>.</p><div data-w="ricardo"></div>` },
        ],
        errores: ['Cambiar la RPI al bajar T1: la riqueza disponible es la misma; lo que cambia es el techo de C1.', 'Calcular la utilidad con el óptimo irrestricto cuando la restricción está activa.', 'Olvidarse de los intereses: ΔT2 = (1+r)·10 = 15, no 10.'],
        practice: { fixed: rcFixed, random: rcRand, build: rcBuild },
      },
    ],
  });
})();
