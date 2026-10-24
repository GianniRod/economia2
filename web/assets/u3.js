/* Unidad 3 · Capítulo 4 · TP 5 y TP 6 */
(function () {
  const T = String.raw;
  const { f, ft, pct, pt, rng, randInt, pick, table } = App.h;

  /* ------------------------------------------------------------------ */
  /* TP 5 · Ejercicio 1 · restricciones y Fisher con números            */
  /* ------------------------------------------------------------------ */
  function rpiBuild(p) {
    const r = ((1 + p.R) * p.P1) / p.P2 - 1, pi = p.P2 / p.P1 - 1;
    const W = p.Y1 + p.Y2 / (1 + r), FV = p.Y1 * (1 + r) + p.Y2;
    const S = p.Y1 - p.C1, C2 = p.Y2 + (1 + r) * S;
    const enun = `<p>Un individuo vive dos períodos. Tiene dotaciones $Y_1 = ${p.Y1}$ y $Y_2 = ${p.Y2}$ del único bien, cuyos precios son $P_1 = ${ft(p.P1)}$ y $P_2 = ${ft(p.P2)}$. La tasa de interés nominal es $R = ${pt(p.R, 0)}$.</p><ol><li>Escribí la restricción presupuestaria de cada período (en pesos).</li><li>Obtené la restricción intertemporal nominal.</li><li>Calculá la tasa de interés real y escribí la restricción intertemporal real.</li><li>Si decide consumir $C_1 = ${p.C1}$, ¿cuánto ahorra y cuánto consume en el período 2?</li></ol>`;
    const steps = [
      { t: 'Inciso 1 · Restricciones por período', b: `<p>Llamamos S al ahorro real del período 1:</p>$$P_1Y_1 = P_1C_1 + P_1S \\qquad P_2Y_2 + P_1S(1+R) = P_2C_2$$$$${ft(p.P1)}\\cdot ${p.Y1} = ${ft(p.P1)}C_1 + ${ft(p.P1)}S \\qquad ${ft(p.P2)}\\cdot ${p.Y2} + ${ft(p.P1)}S\\cdot ${ft(1 + p.R)} = ${ft(p.P2)}C_2$$` },
      { t: 'Inciso 2 · RPI nominal', b: `<p>Despejá $P_1S$ de la segunda y reemplazalo en la primera:</p>$$P_1C_1 + \\frac{P_2C_2}{1+R} = P_1Y_1 + \\frac{P_2Y_2}{1+R}$$$$${ft(p.P1)}C_1 + \\frac{${ft(p.P2)}C_2}{${ft(1 + p.R)}} = ${ft(p.P1 * p.Y1)} + \\frac{${ft(p.P2 * p.Y2)}}{${ft(1 + p.R)}} = ${ft(p.P1 * p.Y1 + (p.P2 * p.Y2) / (1 + p.R))}$$` },
      { t: 'Inciso 3 · Fisher y RPI real', b: `<p>Inflación: $\\pi = \\frac{P_2}{P_1} - 1 = ${pt(pi, 2)}$. Ecuación de Fisher:</p>$$1 + r = \\frac{(1+R)P_1}{P_2} = \\frac{${ft(1 + p.R)}}{${ft(1 + pi, 4)}} = ${ft(1 + r, 4)} \\;\\Rightarrow\\; r = ${pt(r, 2)}$$<p>(La aproximación $R - \\pi = ${pt(p.R - pi, 2)}$ ${Math.abs(p.R - pi - r) > 0.01 ? 'se equivoca bastante' : 'anda bien porque las tasas son chicas'}.)</p><p>Dividiendo la RPI nominal por $P_1$ y usando Fisher:</p>$$C_1 + \\frac{C_2}{1+r} = Y_1 + \\frac{Y_2}{1+r} = ${p.Y1} + \\frac{${p.Y2}}{${ft(1 + r, 4)}} = ${ft(W, 2)}$$<p>Cortes con los ejes: $C_1$ máximo $= ${ft(W, 2)}$ y $C_2$ máximo $= Y_1(1+r) + Y_2 = ${ft(FV, 2)}$.</p>` },
      { t: 'Inciso 4 · Ahorro y consumo futuro', b: `$$S = Y_1 - C_1 = ${p.Y1} - ${p.C1} = ${ft(S)}\\qquad C_2 = Y_2 + (1+r)S = ${p.Y2} + ${ft(1 + r, 4)}\\cdot (${ft(S)}) = ${ft(C2, 2)}$$<p>${S >= 0 ? 'Ahorra: es acreedor.' : 'Pide prestado: es deudor y en el período 2 devuelve con intereses.'}</p>` },
    ];
    return { enun, steps };
  }
  const rpiFixed = [{ Y1: 100, Y2: 110, P1: 1, P2: 1.1, R: 0.21, C1: 90 }, { Y1: 50, Y2: 150, P1: 2, P2: 3, R: 0.65, C1: 80 }, { Y1: 200, Y2: 100, P1: 1, P2: 1.5, R: 0.8, C1: 140 }, { Y1: 120, Y2: 120, P1: 10, P2: 12, R: 0.32, C1: 120 }, { Y1: 80, Y2: 200, P1: 1, P2: 2, R: 1.2, C1: 130 }];
  const rpiRand = (R) => { const P1 = pick(R, [1, 2, 10]), inf = pick(R, [0.05, 0.1, 0.2, 0.5, 1]); const rr = pick(R, [0.02, 0.05, 0.1, 0.2]); return { Y1: randInt(R, 5, 20) * 10, Y2: randInt(R, 5, 20) * 10, P1, P2: Math.round(P1 * (1 + inf) * 100) / 100, R: Math.round(((1 + rr) * (1 + inf) - 1) * 100) / 100, C1: randInt(R, 5, 18) * 10 }; };

  /* ------------------------------------------------------------------ */
  /* TP 5 · Ejercicio 2 · posición financiera y cambio en r             */
  /* ------------------------------------------------------------------ */
  const POS_V = [
    { n: 'una <b>baja</b> de la tasa de interés real para un individuo <b>deudor</b>', o: 'Y1=40;Y2=160', rows: [['C1', '↑', '↑', '↑'], ['C2', '↓', '↑', '?'], ['S', '↓', '↓', '↓']], bien: 'Mejora: paga menos intereses por lo que debe.', es: 'Consumir hoy se abarata respecto de mañana: C1↑, C2↓, S↓.', ei: 'Al deudor le baja el costo de su deuda: es más rico. C1↑, C2↑, S↓.', et: 'C1 sube seguro y el ahorro baja (se endeuda más); C2 es ambiguo.' },
    { n: 'una <b>baja</b> de la tasa de interés real para un individuo <b>acreedor</b> (ahorrista)', o: 'Y1=160;Y2=40', rows: [['C1', '↑', '↓', '?'], ['C2', '↓', '↓', '↓'], ['S', '↓', '↑', '?']], bien: 'Empeora: sus ahorros rinden menos.', es: 'Consumir hoy se abarata: C1↑, C2↓, S↓.', ei: 'El acreedor cobra menos intereses: es más pobre. C1↓, C2↓, S↑.', et: 'C2 baja seguro; C1 y S son ambiguos.' },
    { n: 'una <b>baja</b> de la tasa de interés real para un individuo que <b>ni ahorra ni pide prestado</b>', o: 'Y1=100;Y2=100', rows: [['C1', '↑', '=', '↑'], ['C2', '↓', '=', '↓'], ['S', '↓', '=', '↓']], bien: 'Como está en su dotación, no gana ni pierde intereses: no hay efecto ingreso.', es: 'C1↑, C2↓, S↓.', ei: 'Nulo: no tiene deuda ni ahorros sobre los que cambie el interés.', et: 'Igual al efecto sustitución: pasa a ser deudor.' },
    { n: 'un <b>aumento</b> de la tasa de interés real para un individuo <b>deudor</b>', o: 'Y1=40;Y2=160', rows: [['C1', '↓', '↓', '↓'], ['C2', '↑', '↓', '?'], ['S', '↑', '↑', '↑']], bien: 'Empeora: para el mismo monto adeudado debe devolver más.', es: 'Consumir hoy se encarece: C1↓, C2↑, S↑.', ei: 'Paga más intereses: más pobre. C1↓, C2↓, S↑.', et: 'C1 baja y S sube seguro; C2 ambiguo.' },
    { n: 'un aumento <b>transitorio</b> del ingreso futuro Y2 (sin cambio en r)', o: '', rows: [['C1', '=', '↑', '↑'], ['C2', '=', '↑', '↑'], ['S', '=', '↓', '↓']], bien: 'Mejora: es más rico.', es: 'No hay efecto sustitución: r no cambió (la recta se desplaza en paralelo).', ei: 'Más riqueza en valor presente: C1↑ y C2↑. Como Y1 no cambió y C1 sube, S = Y1 − C1 baja.', et: 'Suaviza: reparte el ingreso extra entre los dos períodos.' },
  ];
  const posBuild = (v) => ({
    enun: `<p>Con el problema de dos períodos del TP 5, analizá gráficamente ${v.n}. Identificá el efecto sustitución, el efecto ingreso y el efecto total sobre C1, C2 y el ahorro, y qué pasa con el bienestar.</p>`,
    arrows: { cols: ['ES', 'EI', 'ET'], rows: v.rows },
    steps: [
      { t: 'Qué pasa con la recta', b: v.o ? `<p>Un cambio en r hace <mark>pivotear la RPI alrededor del punto de dotación</mark> (Y1, Y2): ese punto siempre se puede elegir. Una baja de r la deja más plana (pendiente −(1+r) más chica en valor absoluto).</p>` : `<p>Sube Y2 con r igual: la recta se desplaza en paralelo hacia afuera.</p>` },
      { t: 'Efecto sustitución', b: `<p>${v.es}</p>` },
      { t: 'Efecto ingreso', b: `<p>${v.ei}</p>` },
      { t: 'Efecto total y bienestar', b: `<p>${v.et}</p>` + table(['', 'ES', 'EI', 'ET'], v.rows) + `<p><b>Bienestar:</b> ${v.bien}</p>` + (v.o ? `<p>Para verlo: poné la dotación, tocá «Fijar como inicial» y bajá (o subí) r.</p><div data-w="inter" data-o="${v.o}"></div>` : '<div data-w="inter"></div>') },
    ],
  });

  /* ------------------------------------------------------------------ */
  /* TP 5 · Ejercicio 3 · solución analítica con números                 */
  /* ------------------------------------------------------------------ */
  function anaBuild(p) {
    const { Y1, Y2, r, b, M, ra, rp } = p;
    const W = Y1 + Y2 / (1 + r), C1 = W / (1 + b), C2 = b * (1 + r) * C1, S = Y1 - C1;
    const thr = (1 / (1 + b)) * (Y2 / (1 + r) - b * Y1);
    const bind = C1 > Y1 + M;
    const C1m = bind ? Y1 + M : C1, C2m = bind ? Y2 - M * (1 + r) : C2;
    // tasas activa y pasiva
    const C1p = (Y1 + Y2 / (1 + rp)) / (1 + b);
    const C1a = (Y1 + Y2 / (1 + ra)) / (1 + b);
    let rt;
    if (C1p <= Y1) rt = { C1: C1p, C2: b * (1 + rp) * C1p, txt: `Con $r_p$: $C_1 = ${ft(C1p)} \\le Y_1 = ${Y1}$ → el supuesto de que ahorra era correcto.` };
    else if (C1a >= Y1) rt = { C1: C1a, C2: b * (1 + ra) * C1a, txt: `Con $r_p$ daba $C_1 = ${ft(C1p)} > Y_1$: no es ahorrista. Con $r_a$: $C_1 = ${ft(C1a)} \\ge Y_1$ → es deudor y usa la tasa activa.` };
    else rt = { C1: Y1, C2: Y2, txt: `Con $r_p$ da $C_1 = ${ft(C1p)} > Y_1$ y con $r_a$ da $C_1 = ${ft(C1a)} < Y_1$: ninguno de los dos supuestos se cumple. Se queda en el quiebre: $C_1 = Y_1$, $C_2 = Y_2$.` };
    const enun = `<p>Un consumidor con $U(c_1, c_2) = \\ln c_1 + b\\ln c_2$ tiene $Y_1 = ${Y1}$, $Y_2 = ${Y2}$, $r = ${pt(r, 0)}$ y $b = ${ft(b)}$. La condición de optimalidad es $c_2 = b(1+r)c_1$.</p><ol><li>Encontrá $c_1^*$, $c_2^*$ y el ahorro.</li><li>Si puede pedir prestado como máximo $M = ${M}$, ¿la restricción es relevante? ¿Para qué valores de M lo sería?</li><li>Encontrá la elección con la restricción.</li><li>Ahora no hay límite pero la tasa para pedir prestado es $r_a = ${pt(ra, 0)}$ y la de ahorro $r_p = ${pt(rp, 0)}$. ¿A quiénes afecta? Encontrá la nueva elección.</li></ol>`;
    const steps = [
      { t: 'Inciso 1 · El sistema de dos ecuaciones', b: `$$c_2 = b(1+r)c_1 \\qquad c_1 + \\frac{c_2}{1+r} = Y_1 + \\frac{Y_2}{1+r}$$<p>Reemplazando la primera en la segunda: $c_1 + b c_1 = Y_1 + \\frac{Y_2}{1+r}$, entonces</p>$$c_1^* = \\frac{1}{1+b}\\left(Y_1 + \\frac{Y_2}{1+r}\\right) = \\frac{1}{${ft(1 + b)}}\\left(${Y1} + \\frac{${Y2}}{${ft(1 + r)}}\\right) = ${ft(C1)}$$$$c_2^* = \\frac{b}{1+b}\\big((1+r)Y_1 + Y_2\\big) = ${ft(C2)}\\qquad S = Y_1 - c_1^* = ${ft(S)}$$<p>${S >= 0 ? 'Ahorra: es acreedor.' : 'Pide prestado: es deudor.'}</p>` },
      { t: 'Inciso 2 · ¿Cuándo importa el límite M?', b: `<p>La restricción es $c_1 \\le Y_1 + M$. Sólo cambia la decisión si el consumo deseado la viola:</p>$$c_1^* - Y_1 > M \\;\\Leftrightarrow\\; M < \\frac{1}{1+b}\\left(\\frac{Y_2}{1+r} - bY_1\\right) = ${ft(thr)}$$<p>${thr <= 0 ? 'Como el umbral es negativo, el individuo es ahorrista: <b>ningún límite al endeudamiento lo afecta</b>.' : `Con $M = ${M}$: ${bind ? `$${M} < ${ft(thr)}$ → <b>la restricción está activa</b> (quiere pedir ${ft(-S)}, más que el máximo).` : `$${M} \\ge ${ft(thr)}$ → <b>no está activa</b>: pide ${ft(Math.max(0, -S))}, menos que el límite.`}`}</p><p>Además, para que el préstamo se pueda devolver, $M < \\frac{Y_2}{1+r} = ${ft(Y2 / (1 + r))}$.</p>` },
      { t: 'Inciso 3 · Elección con la restricción', b: bind ? `<p>Se endeuda por el máximo permitido:</p>$$c_1 = Y_1 + M = ${ft(C1m)}\\qquad c_2 = Y_2 - M(1+r) = ${Y2} - ${M}\\cdot ${ft(1 + r)} = ${ft(C2m)}$$<p>Utilidad: $\\ln ${ft(C1m)} + ${ft(b)}\\ln ${ft(C2m)} = ${ft(Math.log(C1m) + b * Math.log(C2m), 3)}$, menor que sin restricción ($${ft(Math.log(C1) + b * Math.log(C2), 3)}$).</p>` : `<p>La restricción no está activa: los consumos óptimos no cambian, $c_1 = ${ft(C1)}$ y $c_2 = ${ft(C2)}$.</p>` },
      { t: 'Inciso 4 · Tasa activa y pasiva', b: `<p>Un aumento de la tasa de los préstamos <b>afecta sólo a los deudores</b>. La RPI queda quebrada en la dotación:</p><p>Acreedor: $C_2 = Y_2 + Y_1(1+r_p) - C_1(1+r_p)$. Deudor: $C_2 = Y_2 + Y_1(1+r_a) - C_1(1+r_a)$.</p><p><b>Método:</b> primero suponé que es acreedor y usá $r_p$; si sale $C_1 \\le Y_1$, listo. Si no, usá $r_a$.</p><p>${rt.txt}</p>$$c_1 = ${ft(rt.C1)}\\qquad c_2 = ${ft(rt.C2)}$$` },
    ];
    return { enun, steps };
  }
  const anaFixed = [{ Y1: 50, Y2: 150, r: 0.25, b: 0.8, M: 20, ra: 0.4, rp: 0.1 }, { Y1: 100, Y2: 100, r: 0.1, b: 0.9, M: 10, ra: 0.3, rp: 0.05 }, { Y1: 150, Y2: 60, r: 0.2, b: 0.75, M: 30, ra: 0.5, rp: 0.2 }, { Y1: 20, Y2: 220, r: 0.1, b: 0.6, M: 50, ra: 0.6, rp: 0.1 }, { Y1: 80, Y2: 120, r: 0.2, b: 0.5, M: 5, ra: 0.25, rp: 0.15 }];
  const anaRand = (R) => ({ Y1: randInt(R, 2, 16) * 10, Y2: randInt(R, 5, 20) * 10, r: pick(R, [0.05, 0.1, 0.2, 0.25]), b: pick(R, [0.5, 0.6, 0.75, 0.8, 0.9]), M: randInt(R, 1, 6) * 5, ra: pick(R, [0.3, 0.4, 0.5]), rp: pick(R, [0.02, 0.05, 0.1]) });

  /* ------------------------------------------------------------------ */
  /* TP 6 · Ejercicio 1 · S(r), I(r) y equilibrio con números             */
  /* ------------------------------------------------------------------ */
  function fondosBuild(p) {
    const grid = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4];
    const Sf = (r) => (p.b * p.Y1) / (1 + p.b) - p.Y2 / ((1 + p.b) * (1 + r));
    const K2 = (r) => Math.pow(p.a / (r + p.d), 2);
    const If = (r) => K2(r) - (1 - p.d) * p.K1;
    let best = grid[0]; grid.forEach((r) => { if (Math.abs(Sf(r) - If(r)) < Math.abs(Sf(best) - If(best))) best = r; });
    const enun = `<p>Economía de dos períodos con agentes representativos. El consumidor tiene $U = \\ln c_1 + b\\ln c_2$ con $b = ${ft(p.b)}$, ingresos $Y_1 = ${ft(p.Y1, 1)}$ e $Y_2 = ${p.Y2}$ (tomalos como dados). La firma tiene $PMK_2 = \\frac{${ft(p.a)}}{\\sqrt{K_2}}$, $K_1 = ${p.K1}$ y depreciación $\\delta = ${ft(p.d)}$.</p><ol><li>Obtené la curva de oferta de ahorro S(r).</li><li>Obtené la curva de demanda de inversión I(r).</li><li>Completá la tabla para r = 5 %, 10 %, …, 40 % y encontrá la tasa de equilibrio aproximada.</li></ol>`;
    const steps = [
      { t: 'Inciso 1 · Oferta de ahorro', b: `<p>Del problema del consumidor: $c_1^* = \\frac{1}{1+b}\\left(Y_1 + \\frac{Y_2}{1+r}\\right)$ y $S = Y_1 - c_1^*$:</p>$$S(r) = \\frac{b}{1+b}Y_1 - \\frac{1}{1+b}\\frac{Y_2}{1+r} = ${ft((p.b * p.Y1) / (1 + p.b))} - \\frac{${ft(p.Y2 / (1 + p.b))}}{1+r}$$<p>Es <b>creciente en r</b>. (En el agregado, los efectos ingreso de deudores y acreedores se cancelan y queda el sustitución.)</p>` },
      { t: 'Inciso 2 · Demanda de inversión', b: `<p>La firma elige $K_2$ donde $PMK_2 = r + \\delta$:</p>$$\\frac{${ft(p.a)}}{\\sqrt{K_2}} = r + ${ft(p.d)} \\;\\Rightarrow\\; K_2^*(r) = \\left(\\frac{${ft(p.a)}}{r + ${ft(p.d)}}\\right)^2$$<p>Y con la ley de movimiento del capital $K_2 = I + (1-\\delta)K_1$:</p>$$I(r) = K_2^*(r) - (1-\\delta)K_1 = \\left(\\frac{${ft(p.a)}}{r + ${ft(p.d)}}\\right)^2 - ${ft((1 - p.d) * p.K1)}$$<p>Es <b>decreciente en r</b>: más tasa, capital más caro.</p>` },
      { t: 'Inciso 3 · Tabla y equilibrio', b: table(['r', 'S(r)', 'K2*(r)', 'I(r)', 'S − I'], grid.map((r) => [(r === best ? '<b>' : '') + pct(r, 0) + (r === best ? '</b>' : ''), f(Sf(r), 2), f(K2(r), 2), f(If(r), 2), f(Sf(r) - If(r), 2)])) + `<p>S − I cambia de signo cerca de <mark>r* ≈ ${pct(best, 0)}</mark>: ahí $S(r^*) = I(r^*) \\approx ${ft((Sf(best) + If(best)) / 2, 1)}$. Por debajo de r* hay exceso de demanda de fondos (I &gt; S) y la tasa sube; por encima, exceso de oferta y la tasa baja.</p><div data-w="pmk"></div>` },
    ];
    return { enun, steps };
  }
  function fondosMake(R, rStar) {
    const b = pick(R, [0.8, 0.9, 0.95]), d = pick(R, [0.1, 0.2]), a = pick(R, [3, 4, 5, 6]), K1 = randInt(R, 2, 4) * 5, Y2 = randInt(R, 8, 16) * 10;
    const I = Math.pow(a / (rStar + d), 2) - (1 - d) * K1;
    const Y1 = Math.round((((1 + b) * I + Y2 / (1 + rStar)) / b) * 10) / 10;
    return { b, d, a, K1, Y2, Y1 };
  }
  const fondosFixed = [0.2, 0.15, 0.25, 0.1, 0.3].map((r, i) => fondosMake(rng(300 + i), r));
  const fondosRand = (R) => fondosMake(R, pick(R, [0.1, 0.15, 0.2, 0.25, 0.3]));

  /* ------------------------------------------------------------------ */
  /* TP 6 · Ejercicio 2 · variantes de shocks                           */
  /* ------------------------------------------------------------------ */
  const GEV = [
    { k: 'pmk2up', n: 'Un shock <b>favorable</b> a la PMK esperada (las máquinas de mañana van a rendir más).' },
    { k: 'pml1up', n: 'Un shock <b>favorable y transitorio</b> a la PML corriente.' },
    { k: 'y1down', n: 'Una <b>caída</b> transitoria y paralela de la función de producción del período 1 (sin efecto en PML ni PMK).' },
    { k: 'pmk2down', n: 'Un shock adverso a la PMK esperada (el mismo del inciso 1, para practicar los 7 gráficos de memoria).' },
    { k: 'pml1down', n: 'Un shock adverso y transitorio a la PML corriente (el del inciso 2).' },
  ];
  function geRows(k) {
    const R = {
      pmk2up: [['Y1', '='], ['L1', '='], ['w1/p1', '='], ['Y2', '↑'], ['K2', '↑'], ['L2', '↑'], ['w2/p2', '↑'], ['r', '↑'], ['S = I', '?']],
      pml1up: [['Y1', '↑'], ['L1', '↑'], ['w1/p1', '↑'], ['Y2', '↑'], ['K2', '↑'], ['L2', '↑'], ['w2/p2', '↑'], ['r', '?'], ['S = I', '↑']],
      y1down: [['Y1', '↓'], ['L1', '='], ['w1/p1', '='], ['Y2', '↓'], ['K2', '↓'], ['L2', '↓'], ['w2/p2', '↓'], ['r', '↑'], ['S = I', '↓']],
      pmk2down: [['Y1', '='], ['L1', '='], ['w1/p1', '='], ['Y2', '↓'], ['K2', '↓'], ['L2', '↓'], ['w2/p2', '↓'], ['r', '↓'], ['S = I', '?']],
      pml1down: [['Y1', '↓'], ['L1', '↓'], ['w1/p1', '↓'], ['Y2', '↓'], ['K2', '↓'], ['L2', '↓'], ['w2/p2', '↓'], ['r', '?'], ['S = I', '↓']],
    };
    return R[k];
  }
  const geBuild = (v) => {
    const sc = App.GE_SC[v.k];
    return {
      enun: `<p>En el modelo de equilibrio general de dos períodos (Cobb-Douglas), encontrá los efectos sobre Y, L, w/P, K2, r y S = I de:</p><p><b>${v.n}</b></p><p>Hacelo como el profe: primero la 1ª vuelta (rojo) y después la 2ª vuelta (verde), con los 7 gráficos.</p>`,
      arrows: { cols: ['Efecto final'], rows: geRows(v.k) },
      steps: [
        { t: '1ª vuelta (rojo): qué cambia primero', b: `<p>${sc.st[0].txt}</p>` },
        { t: '2ª vuelta (verde): la respuesta a la nueva tasa', b: `<p>${sc.st[1].txt}</p>` },
        { t: 'Los 7 gráficos y el resultado', b: `<div data-w="ge" data-o="${v.k}"></div>` + table(['Variable', 'Efecto final'], geRows(v.k)) + `<p><b>Distribución de la renta:</b> con Cobb-Douglas las participaciones son constantes (1 − α para el trabajo y α para el capital): la masa salarial wL se mueve en la misma dirección que Y en cada período.</p>` },
      ],
    };
  };

  /* ------------------------------------------------------------------ */
  App.UNITS.push({
    id: 'u3', n: 3, title: 'Ahorro e inversión', caps: 'Cap. 4', tps: 'TP 5 y 6',
    blurb: 'Consumo en dos períodos, tasa real, deudores y acreedores, restricciones al crédito, inversión y el equilibrio general con shocks.',
    lessons: [
      {
        id: 'u3l1', t: 'Dos períodos y la tasa de interés real', d: 'Restricciones por período, Fisher y la RPI.',
        cards: [
          { t: 'Por qué ahorro = inversión', b: T`<p>En una economía cerrada y sin gobierno, $Y = C + I$. Lo que no se consume se ahorra: $S \equiv Y - C$. Entonces <mark>S = I</mark>: lo que unos ahorran es lo que otros piden para invertir.</p><p>El mercado de crédito es un mercado como cualquiera: se transan <b>fondos</b> (bienes de hoy a cambio de bienes de mañana) y el precio es la <b>tasa de interés real</b>.</p>` },
          { t: 'Las restricciones de cada período', b: T`<p>El individuo vive dos períodos, con ingresos $Y_1$, $Y_2$ y precios $P_1$, $P_2$:</p>$$t=1:\ P_1Y_1 = P_1C_1 + P_1S \qquad t=2:\ P_2C_2 = P_2Y_2 + (1+R)P_1S$$<p>Si $S > 0$ ahorra y mañana cobra intereses; si $S < 0$ pide prestado y mañana devuelve con intereses. Despejando $P_1S$ y reemplazando:</p>$$P_1C_1 + \frac{P_2C_2}{1+R} = P_1Y_1 + \frac{P_2Y_2}{1+R}$$<p>Todo en valor presente: $1/(1+R)$ trae los pesos de mañana a hoy.</p>` },
          { t: 'Fisher: de nominal a real', b: T`<p>Depositar un coco (rinde r en cocos) o depositar su precio en pesos (rinde R) tiene que dar lo mismo; si no, habría arbitraje:</p>$$1 + r = \frac{(1+R)P_1}{P_2} \quad\Leftrightarrow\quad 1 + R = (1+r)(1+\pi)$$<p>Con tasas chicas, $r \approx R - \pi$. Con inflación alta, no.</p>`, w: 'fisher' },
          { t: 'La restricción presupuestaria intertemporal (RPI)', b: T`<p>Dividiendo la RPI nominal por $P_1$ y usando Fisher:</p>$$C_1 + \frac{C_2}{1+r} = Y_1 + \frac{Y_2}{1+r}$$<ul><li>Con C1 en el eje horizontal: corta en $Y_1 + \frac{Y_2}{1+r}$ (riqueza en valor presente) y en $C_2 = Y_1(1+r) + Y_2$.</li><li>Pendiente: $-(1+r)$. Consumir una unidad más hoy cuesta $1+r$ de mañana: <mark>1 + r es el precio relativo de C1</mark>.</li><li>Pasa siempre por la <b>dotación</b> $(Y_1, Y_2)$.</li></ul>`, q: { k: 'mc', q: 'Y1 = 100, Y2 = 110, r = 10 %. ¿Cuánto es lo máximo que puede consumir hoy?', o: ['100', '200', '210', '110'], a: 1, why: 'Y1 + Y2/(1+r) = 100 + 110/1,1 = 200.' } },
        ],
      },
      {
        id: 'u3l2', t: 'Elección óptima: deudores y acreedores', d: 'Tangencia, ingreso permanente y cambios en r.',
        cards: [
          { t: 'El óptimo y la posición financiera', b: T`<p>Como siempre, la tangencia entre la RPI y la curva de indiferencia más alta. Si $C_1^* > Y_1$ es <b>deudor</b> (S &lt; 0); si $C_1^* < Y_1$, <b>acreedor</b>; si $C_1^* = Y_1$, ni una cosa ni la otra.</p><p>Ser deudor o acreedor <mark>no es malo ni bueno</mark>: dos dotaciones con el mismo valor presente dan la misma recta y la misma elección.</p>`, w: 'inter' },
          { t: 'Utilidad logarítmica: la fórmula que vas a usar siempre', b: T`<p>Con $U = \ln C_1 + \beta\ln C_2$, la tangencia da $\frac{C_2}{\beta C_1} = 1 + r$, o sea:</p>$$C_2 = \beta(1+r)C_1$$<p>Junto con la RPI:</p>$$C_1^* = \frac{1}{1+\beta}\left(Y_1 + \frac{Y_2}{1+r}\right)\qquad C_2^* = \frac{\beta}{1+\beta}\big((1+r)Y_1 + Y_2\big)$$<p>$\beta = \frac{1}{1+\rho}$ es el factor de descuento (ρ, la tasa de impaciencia). Si $\rho = r$, consume igual en los dos períodos; si $\rho > r$, más hoy.</p>`, q: { k: 'mc', q: 'Y1 = 50, Y2 = 150, r = 50 %, β = 2/3. ¿C1*?', o: ['90', '60', '120', '50'], a: 0, why: 'C1 = (1/(5/3))·(50 + 150/1,5) = 0,6·150 = 90.' } },
          { t: 'Suavizar el consumo (ingreso permanente)', b: T`<p>La gente prefiere consumir parejo. Si $C_1 = C_2 = C$: $C = \frac{1+r}{2+r}\left(Y_1 + \frac{Y_2}{1+r}\right)$, y con $r = 0$, $C = \frac{Y_1+Y_2}{2}$.</p><ul><li><b>Cambio transitorio</b> (sube sólo Y1 en ΔY): $\Delta C = \Delta Y/2$ y $\Delta S = \Delta Y/2$. El ahorro absorbe la mitad.</li><li><b>Cambio permanente</b> (suben Y1 e Y2 en ΔY): $\Delta C = \Delta Y$ y $\Delta S = 0$.</li></ul>` },
          { t: 'Sube r: efecto sustitución e ingreso', b: T`<p>Un cambio en r hace <b>pivotear la recta alrededor de la dotación</b>.</p><ul><li><b>ES</b> (siempre igual): consumir hoy se encarece → C1↓, C2↑, S↑.</li><li><b>EI</b> depende de la posición: al <b>deudor</b> lo empobrece (debe más intereses), al <b>acreedor</b> lo enriquece (cobra más), en <b>autarquía</b> es nulo.</li></ul><table><tr><th>Sube r</th><th colspan="3">Deudor</th><th colspan="3">Acreedor</th></tr><tr><th></th><th>ES</th><th>EI</th><th>ET</th><th>ES</th><th>EI</th><th>ET</th></tr><tr><td>C1</td><td>↓</td><td>↓</td><td>↓</td><td>↓</td><td>↑</td><td>?</td></tr><tr><td>C2</td><td>↑</td><td>↓</td><td>?</td><td>↑</td><td>↑</td><td>↑</td></tr><tr><td>S</td><td>↑</td><td>↑</td><td>↑</td><td>↑</td><td>↓</td><td>?</td></tr></table><p>Bienestar: el deudor empeora, el acreedor mejora.</p>`, q: { k: 'vf', q: 'Ante una suba de r, un deudor seguro aumenta su ahorro.', a: true, why: 'ES y EI van en la misma dirección para S: los dos lo suben.' } },
          { t: 'De lo individual a la curva de ahorro agregada', b: T`<p>En una economía cerrada, <mark>detrás de cada deudor hay un acreedor</mark>. Sus efectos ingreso tienen signos opuestos y se cancelan al sumar. Queda el efecto sustitución: <b>S(r) es creciente</b>.</p>`, b2: T`<p>Probá: fijá un ahorrista y un deudor y mové r. Para cada uno, mirá la tabla de ES y EI que aparece abajo del gráfico.</p>`, w: 'inter' },
        ],
      },
      {
        id: 'u3l3', t: 'Restricciones al crédito y tasas distintas', d: 'Los anexos del capítulo 4 y el TP 5, ejercicio 3.',
        cards: [
          { t: 'Un límite a la deuda', b: T`<p>Puede pedir como máximo M: $C_1 \le Y_1 + M$ (o $S \ge -M$). Hay tres casos:</p><ol><li><b>Acreedor</b>: el límite no lo afecta.</li><li><b>Deudor chico</b>: pide menos que M, tampoco lo afecta.</li><li><b>Deudor grande</b>: quiere más que M → la restricción <b>está activa</b> y pide justo M:</li></ol>$$C_1 = Y_1 + M \qquad C_2 = Y_2 - (1+r)M$$<p>Con log, está activa cuando $M < \frac{1}{1+\beta}\left(\frac{Y_2}{1+r} - \beta Y_1\right)$. Para que tenga sentido, $M \le \frac{Y_2}{1+r}$.</p>`, w: 'inter', o: 'limit' },
          { t: 'Tasa activa ≠ tasa pasiva', b: T`<p>Los bancos cobran más de lo que pagan: $r_a > r_p$. La RPI se quiebra en la dotación: a la izquierda (ahorra) tiene pendiente $-(1+r_p)$, a la derecha (pide) $-(1+r_a)$, más empinada.</p><p><b>Método para resolver:</b></p><ol><li>Calculá $C_1$ con $r_p$. Si $C_1 \le Y_1$, es ahorrista: listo.</li><li>Si no, calculá con $r_a$. Si $C_1 \ge Y_1$, es deudor: listo.</li><li>Si con $r_a$ te da $C_1 < Y_1$, se queda en el quiebre: $C_1 = Y_1$, $C_2 = Y_2$.</li></ol><p>Subir $r_a$ sólo afecta a los deudores: nunca convierte a un deudor en ahorrista.</p>`, w: 'inter', o: 'rates', q: { k: 'vf', q: 'Si sube la tasa activa, un ahorrista cambia su elección.', a: false, why: 'El ahorrista usa la tasa pasiva: su tramo de la recta no se movió.' } },
        ],
      },
      {
        id: 'u3l4', t: 'La inversión', d: 'Costo de uso del capital y la curva I(r).',
        cards: [
          { t: 'Qué decide la firma', b: T`<p>La firma produce en los dos períodos: $\pi_t = P_tF(K_t, L_t) - W_tL_t - U_tK_t$. El capital de hoy, $K_1$, ya está dado (se decidió antes). Lo que elige es <b>cuánto capital tener mañana</b>, $K_2$, y para eso invierte hoy.</p><p>Igual que con el trabajo: contrata una unidad más de capital si $PMK_2 > \frac{U_2}{P_2}$, donde $U_2$ es el costo de alquiler.</p>` },
          { t: 'El costo de uso: r + δ', b: T`<p>Comprar una máquina hoy (pidiendo prestado), usarla y venderla usada mañana tiene que costar lo mismo que alquilarla:</p>$$U_2 = P_1(1+R) - P_2(1-\delta) \;\Rightarrow\; \frac{U_2}{P_2} = r + \delta$$<p>Intuición: quien guarda un coco para convertirlo en máquina pide al menos lo que ganaría en el banco ($1+r$). Cobra $r + \delta$ de alquiler y le devuelven $1-\delta$ de máquina: $r + \delta + 1 - \delta = 1 + r$.</p>$$PMK_2(K_2) = r + \delta$$` },
          { t: 'De K2 a la curva de inversión', b: T`<p>Como la PMK es decreciente, más r implica menos $K_2^*$. Y la inversión es lo que falta para llegar:</p>$$K_2 = I + (1-\delta)K_1 \;\Rightarrow\; I(r) = K_2^*(r) - (1-\delta)K_1$$<p><b>I(r) es decreciente</b>. El efecto de δ es ambiguo: baja el K2 deseado pero hay que reponer más.</p>`, w: 'pmk', q: { k: 'mc', q: 'PMK2 = 1/√K2, r = 15 %, δ = 10 %, K1 = 4. ¿Inversión?', o: ['16', '12,4', '13', '3,6'], a: 1, why: 'K2 = (1/0,25)² = 16; I = 16 − 0,9·4 = 12,4.' } },
          { t: 'El equilibrio del mercado de fondos', b: T`<p>$S(r^*) = I(r^*)$. Ahorro creciente, inversión decreciente: se cruzan en $r^*$.</p><p>En equilibrio general el modelo tiene 7 gráficos conectados: trabajo y producción de cada período, la elección de $K_2$ (PMK2 = r + δ), $Y_2$ en función de $K_2$, y el crédito.</p>`, w: 'ge', o: 'pmk2down', b2: T`<p>Tocá «Equilibrio inicial» para ver el punto de partida, y después las dos vueltas.</p>` },
        ],
      },
      {
        id: 'u3l5', t: 'Shocks en equilibrio general', d: 'El método de las dos vueltas del TP 6.',
        cards: [
          { t: 'El método del profe', b: T`<ol><li><b>Identificá dónde pega el shock</b>: ¿PML1? ¿PMK2? ¿Y1 en paralelo? Movés esa curva y todo lo que dependa directo de ella.</li><li><b>1ª vuelta (rojo)</b>: cómo cambian S(r) e I(r) a cada tasa. Para S, mirá qué pasa con el ingreso (Y1 o Y2) y aplicá suavización. Para I, mirá la PMK2. Eso da el nuevo r.</li><li><b>2ª vuelta (verde)</b>: el nuevo r cambia el costo del capital → K2 → PML2 → L2, w2, Y2 → otra vez S e I. Suele ser una <b>recuperación parcial</b>.</li><li>Resumí en una tabla: período 1, período 2 y crédito.</li></ol><div class="note"><span class="lbl">conexiones clave (Cobb-Douglas)</span>PML depende de K (más K2 → más demanda de trabajo en t = 2). PMK depende de L (más L2 → más PMK2). Y la función de producción pasa por el origen.</div>` },
          { t: 'Shock 1: cae la PMK esperada', b: T`<p>Las máquinas de mañana van a rendir menos. I(r) se corre a la izquierda; menos K2 baja la PML2 y caen L2, w2/p2, Y2. Con menos Y2 el consumidor ahorra más: S a la derecha. <b>r baja</b>. El período 1 no se mueve.</p>`, w: 'ge', o: 'pmk2down' },
          { t: 'Shock 2: cae la PML corriente (transitorio)', b: T`<p>Cae Ld1 → bajan L1, w1/p1, Y1. Con menos ingreso hoy, ahorra menos: S a la izquierda → <b>r sube</b> → menos K2 → caen L2, w2, Y2. En la 2ª vuelta, Y2 más bajo sube el ahorro y L2 más bajo baja la PMK2: r baja algo. El efecto final sobre r es ambiguo; S = I cae.</p><div class="note warn"><span class="lbl">errata en el PDF del TP 6</span>En el texto del inciso 2 dice «se reduce r» en la primera etapa, pero el gráfico y la conclusión muestran $r'^* > r^*$: la tasa <b>sube</b> en la 1ª vuelta. Lo correcto es que sube.</div>`, w: 'ge', o: 'pml1down' },
          { t: 'Shock 3: sube Y1 en paralelo (transitorio)', b: T`<p>Más producto hoy sin cambiar la PML1: L1 y w1 iguales. El consumidor ahorra parte: S a la derecha → <b>r baja</b> → más K2 → sube PML2 → suben L2, w2/p2 e Y2. En la 2ª vuelta, más L2 sube la PMK2 (I a la derecha) y más Y2 baja algo el ahorro: r se recupera parcialmente. Final: $r'^* < r''^* < r^*$, S = I sube.</p><div class="note warn"><span class="lbl">errata en el PDF del TP 6</span>La tabla final del inciso 3 dice «↓Y2, ↓K2, ↓L2, ↓w2/p2», copiada del inciso 1. Por el propio razonamiento del profe («Al final, aumentan L2 y el salario real»), en este shock <b>todas suben</b>.</div>`, w: 'ge', o: 'y1up', q: { k: 'mc', q: 'Ante un aumento transitorio y paralelo de Y1, ¿qué pasa con L1?', o: ['Sube', 'Baja', 'No cambia', 'Es ambiguo'], a: 2, why: 'El shock no cambia la PML1: la demanda de trabajo del período 1 no se mueve.' } },
        ],
      },
    ],
    quiz: [
      { k: 'mc', q: 'R = 21 % y la inflación es 10 %. ¿Tasa real?', o: ['11 %', '10 %', '1,1 %', '31 %'], a: 1, why: '1,21/1,10 − 1 = 10 %.' },
      { k: 'vf', q: 'La pendiente de la RPI (C1 en el eje horizontal) es −(1+r).', a: true, why: 'Una unidad más de C1 cuesta (1+r) unidades de C2.' },
      { k: 'vf', q: 'Cuando cambia r, la RPI se desplaza en paralelo.', a: false, why: 'Pivotea alrededor de la dotación (Y1, Y2).' },
      { k: 'vf', q: 'Si dos individuos tienen dotaciones distintas con el mismo valor presente, eligen el mismo consumo.', a: true, why: 'Enfrentan la misma recta.' },
      { k: 'mc', q: 'Sube r. ¿Para quién el efecto total sobre el ahorro es ambiguo?', o: ['Deudor', 'Acreedor', 'Autarquía', 'Nadie'], a: 1, why: 'Al acreedor el ES le sube el ahorro y el EI (más rico) se lo baja.' },
      { k: 'vf', q: 'Ante una suba de r, un acreedor seguro consume más en el período 2.', a: true, why: 'ES y EI suben C2.' },
      { k: 'vf', q: 'La curva de ahorro agregado tiene pendiente positiva porque en el agregado los efectos ingreso se cancelan.', a: true, why: 'Cada deudor tiene un acreedor del otro lado.' },
      { k: 'mc', q: 'Con U = ln c1 + b ln c2, la condición de optimalidad es:', o: ['c1 = b(1+r)c2', 'c2 = b(1+r)c1', 'c2 = (1+r)c1/b', 'c1 = c2'], a: 1, why: 'TMS = c2/(b·c1) = 1 + r.' },
      { k: 'vf', q: 'Una restricción al endeudamiento puede afectar a un acreedor.', a: false, why: 'El acreedor no pide prestado.' },
      { k: 'mc', q: 'Con la restricción activa, el consumo es:', o: ['C1 = Y1, C2 = Y2', 'C1 = Y1 + M, C2 = Y2 − (1+r)M', 'C1 = M, C2 = Y2', 'El de siempre'], a: 1, why: 'Pide exactamente el máximo M y lo devuelve con intereses.' },
      { k: 'vf', q: 'Si sube la tasa activa, un deudor puede volverse ahorrista.', a: false, why: 'Como mucho deja de pedir y se queda en la dotación; nunca pasa a ahorrar.' },
      { k: 'mc', q: 'El costo de uso del capital en términos reales es:', o: ['r', 'δ', 'r + δ', 'r − δ'], a: 2, why: 'Interés de oportunidad más la depreciación.' },
      { k: 'vf', q: 'La inversión es una función decreciente de r.', a: true, why: 'Más r → más costo de uso → menos K2 → menos I.' },
      { k: 'mc', q: 'K2* = 16, K1 = 10, δ = 0,1. ¿Inversión?', o: ['6', '7', '16', '15'], a: 1, why: 'I = 16 − 0,9·10 = 7.' },
      { k: 'mc', q: 'Shock adverso a la PMK esperada. ¿Qué pasa con r?', o: ['Sube', 'Baja', 'No cambia', 'Ambiguo'], a: 1, why: 'I se corre a la izquierda y S a la derecha (Y2 cae): las dos bajan r.' },
      { k: 'vf', q: 'Ante un shock adverso a la PMK2, las variables del período 1 no cambian.', a: true, why: 'La PML1 y K1 no se ven afectadas.' },
      { k: 'mc', q: 'Shock adverso transitorio a la PML1: en la 1ª vuelta, r…', o: ['sube porque cae el ahorro', 'baja porque cae la inversión', 'no cambia', 'baja porque sube el ahorro'], a: 0, why: 'Menos Y1 → menos ahorro a cada tasa → r sube.' },
      { k: 'vf', q: 'Con Cobb-Douglas, más L2 aumenta la PMK2.', a: true, why: 'PMK = αAL^(1−α)K^(α−1): sube con L.' },
    ],
    formulas: [
      { n: 'Fisher', tex: T`1 + r = \frac{(1+R)P_1}{P_2},\quad 1+R = (1+r)(1+\pi)`, d: 'Aproximación: r ≈ R − π.' },
      { n: 'RPI nominal', tex: T`P_1C_1 + \frac{P_2C_2}{1+R} = P_1Y_1 + \frac{P_2Y_2}{1+R}`, d: 'En valor presente.' },
      { n: 'RPI real', tex: T`C_1 + \frac{C_2}{1+r} = Y_1 + \frac{Y_2}{1+r}`, d: 'Pendiente −(1+r), pasa por la dotación.' },
      { n: 'Optimalidad log', tex: T`C_2 = \beta(1+r)C_1`, d: 'Con U = ln C1 + β ln C2.' },
      { n: 'Consumo óptimo', tex: T`C_1^* = \frac{1}{1+\beta}\left(Y_1 + \frac{Y_2}{1+r}\right),\ C_2^* = \frac{\beta}{1+\beta}\big((1+r)Y_1 + Y_2\big)`, d: 'Y S = Y1 − C1*.' },
      { n: 'Ahorro óptimo', tex: T`S^* = \frac{\beta}{1+\beta}Y_1 - \frac{1}{1+\beta}\frac{Y_2}{1+r}`, d: 'Creciente en r.' },
      { n: 'Restricción de crédito activa', tex: T`C_1 = Y_1 + M,\quad C_2 = Y_2 - (1+r)M`, d: 'Activa si M < (Y2/(1+r) − βY1)/(1+β).' },
      { n: 'Consumo parejo (r = 0)', tex: T`C = \frac{Y_1 + Y_2}{2}`, d: 'Teoría del ingreso permanente.' },
      { n: 'Costo de uso del capital', tex: T`\frac{U_2}{P_2} = r + \delta`, d: 'Condición de no arbitraje.' },
      { n: 'Elección de capital', tex: T`PMK_2(K_2^*) = r + \delta`, d: 'K2* decreciente en r.' },
      { n: 'Inversión', tex: T`I(r) = K_2^*(r) - (1-\delta)K_1`, d: 'Inversión bruta.' },
      { n: 'Equilibrio de fondos', tex: T`S(r^*) = I(r^*)`, d: 'Economía cerrada sin gobierno.' },
    ],
    exercises: [
      {
        id: 'tp5e1', tp: 'TP 5', num: 1, title: 'Restricción presupuestaria intertemporal', sum: 'De las restricciones de cada período a la RPI nominal y a la real con Fisher.',
        consigna: T`<p>Un individuo vive dos períodos, tiene dotaciones $Y_1$ e $Y_2$, precios $P_1$ y $P_2$ y tasa nominal R.</p><ol><li>Escribí la restricción de cada período.</li><li>Obtené la RPI en términos nominales.</li><li>Obtené la RPI en términos reales.</li></ol>`,
        plan: T`<ol><li>Período 1: el ingreso nominal se reparte entre consumo y ahorro. Período 2: ingreso más ahorro con intereses = consumo.</li><li>Despejá el ahorro de una restricción y metelo en la otra.</li><li>Dividí todo por $P_1$ y usá Fisher: $\frac{P_2}{P_1(1+R)} = \frac{1}{1+r}$.</li></ol>`,
        profe: [
          { t: 'Inciso 1 · Restricciones nominales', b: T`<p>El ahorro del primer período es S (variable real):</p>$$P_1Y_1 = P_1C_1 + P_1S\quad (t=1)\qquad P_2Y_2 + P_1S(1+R) = P_2C_2\quad (t=2)$$<p>$P_1S$ es el ahorro nominal y $P_1S(1+R)$ su retorno en el segundo período.</p>` },
          { t: 'Inciso 2 · Eliminamos el ahorro', b: T`$$P_1S(1+R) = P_2C_2 - P_2Y_2 \;\Rightarrow\; P_1S = \frac{P_2C_2}{1+R} - \frac{P_2Y_2}{1+R}$$<p>Reemplazando en la del período 1:</p>$$P_1Y_1 + \frac{P_2Y_2}{1+R} = P_1C_1 + \frac{P_2C_2}{1+R}$$<p>Los ingresos y consumos futuros están multiplicados por $1/(1+R)$, que descuenta los pesos de mañana a hoy.</p>` },
          { t: 'Inciso 3 · Fisher y RPI real', b: T`$$1 + R = \frac{P_2}{P_1}(1+r) \;\Rightarrow\; \frac{P_2}{P_1(1+R)} = \frac{1}{1+r}$$<p>Dividiendo la RPI nominal por $P_1$:</p>$$Y_1 + \frac{Y_2}{1+r} = C_1 + \frac{C_2}{1+r}$$` },
        ],
        errores: ['Escribir $(1+R)S$ en vez de $(1+R)P_1S$ en la restricción nominal del período 2.', 'Usar $1+r = (1+R)P_2/P_1$ (al revés).', 'Aproximar r = R − π cuando las tasas son grandes.'],
        practice: { fixed: rpiFixed, random: rpiRand, build: rpiBuild },
      },
      {
        id: 'tp5e2', tp: 'TP 5', num: 2, title: 'Elección óptima y posición financiera', sum: 'Deudor, acreedor y autarquía ante una suba de r: ES, EI y bienestar.',
        consigna: T`<ol><li>Graficá la RPI e identificá la elección óptima de un individuo que pide prestado en el primer período.</li><li>Indicá gráficamente cómo cambian la elección óptima, el ahorro y el bienestar ante un aumento de la tasa real. Identificá el ES y el EI.</li><li>Repetí suponiendo que ahorra en el primer período.</li><li>Repetí suponiendo que no ahorra ni pide prestado.</li></ol>`,
        plan: T`<ol><li>Dibujá la RPI con C1 en el eje horizontal, cortes $Y_1 + Y_2/(1+r)$ y $Y_1(1+r) + Y_2$, y marcá la dotación D.</li><li>Deudor: el óptimo A queda a la derecha de D ($C_1 > Y_1$). Acreedor: a la izquierda.</li><li>Sube r: la recta <b>pivotea en D</b> y se empina.</li><li>ES: siempre C1↓, C2↑, S↑. EI: según la posición (deudor −, acreedor +, autarquía 0). Sumá.</li><li>Bienestar: el deudor empeora, el acreedor mejora.</li></ol>`,
        profe: [
          { t: 'Inciso 1 · El deudor', b: T`<p>El óptimo A está sobre la RPI, a la derecha de la dotación D: $C_1^* > Y_1$. La recta corta los ejes en $Y_1 + \frac{Y_2}{1+r}$ y $Y_1(1+r) + Y_2$, con pendiente $-(1+r)$.</p><div data-w="inter" data-o=""></div>` },
          { t: 'Inciso 2 · Sube r: la RPI pivotea', b: T`<p>Como sube r, la RPI pivotea alrededor del punto de dotación. Para el deudor:</p><ul><li><b>EI negativo</b>: para el mismo monto adeudado debe devolver más en el futuro → consume menos en ambos períodos y ahorra más.</li><li><b>ES</b>: se encarece C1 en relación con C2 → consume menos hoy, ahorra más y consume más mañana.</li><li>Efecto total: C1↓ y el ahorro ↑; el efecto sobre C2 es indeterminado.</li></ul><table><tr><th></th><th>ES</th><th>EI</th><th>ET</th></tr><tr><td>C1</td><td>↓</td><td>↓</td><td>↓</td></tr><tr><td>C2</td><td>↑</td><td>↓</td><td>?</td></tr><tr><td>S</td><td>↑</td><td>↑</td><td>↑</td></tr></table>` },
          { t: 'Inciso 3 · El acreedor', b: T`<ul><li><b>EI positivo</b>: percibirá más → consume más en ambos períodos y ahorra menos.</li><li><b>ES</b>: igual que antes, C1↓, C2↑, S↑.</li><li>Efecto total: C1 y S ambiguos; C2 aumenta.</li></ul><table><tr><th></th><th>ES</th><th>EI</th><th>ET</th></tr><tr><td>C1</td><td>↓</td><td>↑</td><td>?</td></tr><tr><td>C2</td><td>↑</td><td>↑</td><td>↑</td></tr><tr><td>S</td><td>↑</td><td>↓</td><td>?</td></tr></table>` },
          { t: 'Inciso 4 · Autarquía financiera', b: T`<p>El óptimo coincide con la dotación: $C_1^* = Y_1$, $C_2^* = Y_2$.</p><ul><li><b>EI nulo</b>: no es más rico ni más pobre.</li><li><b>ES</b>: C1↓, C2↑, S↑.</li><li>Total: C1↓; C2 y S↑.</li></ul><table><tr><th></th><th>ES</th><th>EI</th><th>ET</th></tr><tr><td>C1</td><td>↓</td><td>–</td><td>↓</td></tr><tr><td>C2</td><td>↑</td><td>–</td><td>↑</td></tr><tr><td>S</td><td>↑</td><td>–</td><td>↑</td></tr></table>` },
        ],
        errores: ['Desplazar la RPI en paralelo cuando cambia r.', 'Poner el mismo signo de efecto ingreso al deudor y al acreedor.', 'Olvidarse de comentar el bienestar (lo pide la consigna).'],
        practice: { fixed: POS_V, build: posBuild },
      },
      {
        id: 'tp5e3', tp: 'TP 5', num: 3, title: 'Oferta de ahorro: solución analítica', sum: 'Consumos óptimos con log, restricción al endeudamiento y tasas activa y pasiva.',
        consigna: T`<p>$U(c_1, c_2) = \ln c_1 + b\ln c_2$ con $0 < b < 1$, y la optimalidad es $c_2 = b(1+r)c_1$.</p><ol><li>Usá la RPI y la condición de optimalidad para encontrar $c_1^*$ y $c_2^*$.</li><li>Puede pedir prestado como máximo M bienes. ¿Para qué valores de M la restricción es relevante?</li><li>Si la restricción lo obliga a cambiar, encontrá la nueva elección.</li><li>Sube la tasa para pedir prestado y la de ahorro queda igual. ¿A quiénes afecta?</li><li>Si lo obliga a cambiar, encontrá la nueva elección.</li></ol>`,
        plan: T`<ol><li><b>Sistema 2×2</b>: reemplazá $c_2 = b(1+r)c_1$ en la RPI. Te queda $(1+b)c_1 = Y_1 + \frac{Y_2}{1+r}$.</li><li><b>Límite M</b>: la restricción importa si $c_1^* - Y_1 > M$. Reemplazá $c_1^*$ y despejá M.</li><li><b>Si está activa</b>: $c_1 = Y_1 + M$ y $c_2 = Y_2 - M(1+r)$.</li><li><b>Tasas distintas</b>: probá primero con $r_p$ (suponiendo que ahorra) y verificá $c_1 < Y_1$. Si no, usá $r_a$.</li></ol>`,
        profe: [
          { t: 'Inciso 1 · Sustituir y despejar', b: T`$$C_2 = b(1+r)C_1 \qquad Y_1 + \frac{Y_2}{1+r} = C_1 + \frac{C_2}{1+r}$$$$Y_1 + \frac{Y_2}{1+r} = C_1 + \frac{b(1+r)C_1}{1+r} \;\Rightarrow\; C_1^* = \frac{1}{1+b}\left(Y_1 + \frac{Y_2}{1+r}\right)$$$$C_2^* = b(1+r)C_1^* = \frac{b}{1+b}\big((1+r)Y_1 + Y_2\big)$$` },
          { t: 'Inciso 2 · Límite al endeudamiento', b: T`<p>El endeudamiento deseado no puede superar M: $C_1^* - Y_1 \le M \Leftrightarrow C_1^* \le Y_1 + M$. Para que el máximo pueda devolverse: $M < \frac{Y_2}{1+r}$.</p><p>Sustituyendo el consumo irrestricto:</p>$$\frac{1}{1+b}\left(Y_1 + \frac{Y_2}{1+r}\right) - Y_1 \le M \;\Leftrightarrow\; Y_1 \ge \frac1b\left(\frac{Y_2}{1+r} - M(1+b)\right)$$<p>Equivalentemente, la restricción modifica la decisión cuando</p>$$M < \frac{1}{1+b}\left(\frac{Y_2}{1+r} - bY_1\right)$$` },
          { t: 'Inciso 2 · Tipos de agentes', b: T`<ul><li><b>Acreedores</b>: la restricción no está activa porque ahorran.</li><li><b>Deudores pequeños</b>: piden menos que el máximo; tampoco está activa.</li><li><b>Deudores grandes</b>: desean endeudarse por encima del máximo; la restricción sí está activa.</li></ul>` },
          { t: 'Inciso 3 · Elección restringida', b: T`<p>Si no está activa, nada cambia. Si está activa, se endeuda por el máximo:</p>$$C_1^* = Y_1 + M \qquad C_2^* = Y_2 - M(1+r)$$` },
          { t: 'Incisos 4 y 5 · Tasa activa y pasiva', b: T`<p>El aumento de la tasa de los préstamos afecta a los <b>deudores</b>. $r_p$: tasa pasiva (ahorros); $r_a$: tasa activa (préstamos); $r_p < r_a$.</p><p>RPI acreedor: $C_2 = Y_2 + Y_1(1+r_p) - C_1(1+r_p)$. RPI deudor: $C_2 = Y_2 + Y_1(1+r_a) - C_1(1+r_a)$.</p><p>Suponé primero que es acreedor:</p>$$C_1^* = \frac{1}{1+b}\left(Y_1 + \frac{Y_2}{1+r_p}\right),\quad C_2^* = \frac{b}{1+b}\big(Y_1(1+r_p) + Y_2\big)$$<p>Si se cumple $C_1^* < Y_1$, el supuesto era correcto. Si no, mismas cuentas con $r_a$.</p><div class="note"><span class="lbl">un caso más (está en el apunte)</span>Si con $r_a$ te da $C_1 < Y_1$, ninguno de los dos supuestos se cumple: el individuo queda en el quiebre de la recta, $C_1 = Y_1$ y $C_2 = Y_2$.</div><div data-w="inter" data-o="rates"></div>` },
        ],
        errores: ['Olvidarse de chequear que el supuesto (acreedor o deudor) se cumple al final.', 'Poner la restricción activa como $C_1 = M$ en vez de $C_1 = Y_1 + M$.', 'Devolver $M$ sin intereses en el período 2.'],
        practice: { fixed: anaFixed, random: anaRand, build: anaBuild },
      },
      {
        id: 'tp6e1', tp: 'TP 6', num: 1, title: 'Ahorro, inversión y equilibrio en el mercado de fondos', sum: 'Del problema del consumidor a S(r), del de la firma a I(r), y el equilibrio.',
        consigna: T`<p>Economía de dos períodos con un único consumidor y una única firma representativos.</p><ol><li>Planteá el problema del consumidor y explicá cómo obtener la curva de oferta de ahorro agregada.</li><li>Planteá el problema de la firma y explicá cómo obtener la curva de demanda de inversión.</li><li>Representá el equilibrio en el mercado de fondos prestables.</li></ol>`,
        plan: T`<ol><li><b>Consumidor</b>: max U s.a. la RPI → sistema TMS = 1 + r y RPI → $C_1^*(r)$ → $S^*(r) = Y_1 - C_1^*(r)$. Signo: usá las tablas de ES/EI de deudor, acreedor y autarquía, y el argumento de que en el agregado los EI se cancelan.</li><li><b>Firma</b>: beneficios de cada período; elige L1, L2 y K2. Regla $PMK_2 = r + \delta$ → $K_2^*(r)$ decreciente → $I(r) = K_2^*(r) - (1-\delta)K_1$.</li><li><b>Equilibrio</b>: dibujá S creciente, I decreciente y el cruce $r^*$.</li></ol>`,
        profe: [
          { t: 'Inciso 1 · El consumidor', b: T`$$\max_{C_1, C_2} U(C_1, C_2)\quad \text{s.a.}\quad C_1 + \frac{C_2}{1+r} = Y_1 + \frac{Y_2}{1+r}$$<p>Se reduce a un sistema de dos ecuaciones: $TMS_{C_1,C_2} = 1 + r$ y la RPI. En el caso log: $C_2 = b(1+r)C_1$. Resolviendo se obtienen $C_1^*(r)$, $C_2^*(r)$ y $S^*(r) = Y_1 - C_1^*(r)$.</p>` },
          { t: 'Inciso 1 · El signo de S(r)', b: T`<p>Ante una suba de r: ES negativo sobre C1 y positivo sobre C2; el EI depende de la posición financiera (deudor ↓, acreedor ↑, ni deudor ni acreedor 0, sobre C1).</p><p>En una economía cerrada, detrás de cada deudor hay un acreedor. Los efectos ingreso se cancelan al agregar y por eso dibujamos <b>S(r) con pendiente positiva</b>.</p>` },
          { t: 'Inciso 2 · La firma', b: T`$$\pi_1 = P_1F(K_1, L_1) - W_1L_1 - U_1K_1\qquad \pi_2 = P_2F(K_2, L_2) - W_2L_2 - U_2K_2$$<p>La firma no elige K1 (le viene dado); elige L1, L2 y K2. Para el trabajo, $W_t/P_t = PML_t$. Para el capital:</p>$$PMK_2^* = r + \delta$$<p>El costo real de una unidad más de capital es $r + \delta$ y su aporte es la PMK2, decreciente en K2. Al subir r, el K2 óptimo baja: $K_2^*(r)$ es decreciente.</p>` },
          { t: 'Inciso 2 · De K2 a I(r)', b: T`<p>La ley de movimiento del capital: $K_2 = I + (1-\delta)K_1$. Despejando:</p>$$I(r) = K_2^*(r) - (1-\delta)K_1$$<p>Decreciente en r.</p><div data-w="pmk"></div>` },
          { t: 'Inciso 3 · Equilibrio', b: T`<p>El equilibrio está en la intersección: $S(r^*) = I(r^*)$, $S^* = I^*$. La tasa $r^*$ equilibra el mercado de fondos prestables.</p><div data-w="credit" data-o="tcut"></div>` },
        ],
        errores: ['Decir que S(r) es creciente «porque sí»: el argumento es la cancelación de los efectos ingreso en el agregado.', 'Olvidarse de que la firma no elige K1.', 'Escribir $I = K_2$ cuando δ ≠ 1.'],
        practice: { fixed: fondosFixed, random: fondosRand, build: fondosBuild },
      },
      {
        id: 'tp6e2', tp: 'TP 6', num: 2, title: 'Shocks en equilibrio general', sum: 'Efectos sobre Y, L, w/P, S, I y la distribución ante tres shocks, con el método de las dos vueltas.',
        consigna: T`<p>A partir del modelo de clase, encontrá los efectos sobre Y, L, W/P, S, I y la distribución de la renta ante:</p><ol><li>Un shock adverso a la PMK esperada.</li><li>Un shock adverso y transitorio a la PML corriente.</li><li>Un aumento transitorio y paralelo de la función de producción (sin efecto en PML ni PMK).</li></ol>`,
        plan: T`<p>Usá los <b>7 gráficos</b>: trabajo 1, Y1(L1), trabajo 2, Y2(L2), PMK2 = r + δ, Y2(K2) y crédito. Negro = inicial, rojo = 1ª vuelta, verde = 2ª vuelta.</p><ol><li>¿Dónde pega el shock? Mové esa curva.</li><li>¿Cambia Y1 o Y2? → el consumidor suaviza → se mueve S(r).</li><li>¿Cambia la PMK2? → se mueve I(r).</li><li>Nuevo r → nuevo costo del capital → nuevo K2 → PML2 → L2, w2, Y2.</li><li>2ª vuelta: con el nuevo L2 y el nuevo Y2, reajustá S e I. Suele ser una recuperación parcial.</li><li>Distribución: con Cobb-Douglas las participaciones son constantes (wL/Y = 1 − α).</li></ol>`,
        profe: [
          { t: 'Cómo leer el equilibrio inicial', b: T`<ol><li><b>Trabajo</b>: en cada período la intersección de oferta y demanda da $L_t^*$ y $(w_t/p_t)^*$.</li><li><b>Producción</b>: con ese $L_t^*$ vamos a la función de producción y leemos $Y_t^*$.</li><li><b>Crédito</b>: $S(r) = I(r)$ da $r^*$.</li><li><b>Capital futuro</b>: la firma elige $K_2^*$ con $PMK_2 = r^* + \delta$ y ese capital se lleva al gráfico de $Y_2(K_2)$.</li></ol><p>Con Cobb-Douglas: la PML depende positivamente de K, la PMK depende positivamente de L y la función pasa por el origen.</p>` },
          { t: 'Inciso 1 · 1ª vuelta: cae la PMK esperada', b: T`<ol><li>El capital futuro rinde menos: la PMK2 baja. Para cualquier r la firma elige menos K2: <b>I(r) a la izquierda</b>. La función de producción respecto de K2 baja.</li><li>Cae la demanda de trabajo futura: menor K2 disminuye la PML2. Caen L2 y $(w/p)_2$.</li><li>Cae la producción futura (menos K2 y menos L2 se refuerzan).</li><li>Aumenta el ahorro: la caída de Y2 lleva al consumidor a reducir C1 y C2. Como Y1 no cambió, <b>S(r) a la derecha</b>.</li><li><b>Baja la tasa de interés.</b></li></ol><p>El período 1 no recibe el shock: sus gráficos quedan negros.</p>` },
          { t: 'Inciso 1 · 2ª vuelta y resultado', b: T`<ol><li>Se abarata el capital: al caer r + δ la firma desea más K2 que en rojo (movimiento sobre la PMK nueva).</li><li>El capital adicional mejora la PML2: suben L2 y w2/p2 respecto del rojo.</li><li>El mayor empleo mejora la PMK: se desplaza hacia arriba.</li><li>La producción se recupera parcialmente.</li><li>Se reajusta el crédito: r sube respecto de su primera caída. $r'^* < r''^* < r^*$.</li></ol><p><b>Resultado:</b> período 1 sin cambios; ↓Y2, ↓K2, ↓L2, ↓w2/p2; ↓r; S = I ambiguo.</p><div data-w="ge" data-o="pmk2down"></div>` },
          { t: 'Inciso 2 · Shock adverso a la PML corriente', b: T`<p><b>1ª vuelta:</b> la PML1 cae → Ld1 a la izquierda → caen L1, w1/p1 e Y1. Cae el ahorro ofrecido (suavización) → <b>r sube</b>. El capital se encarece → menos K2 → cae la PML2 → bajan L2 y w2/p2, e Y2.</p><p><b>2ª vuelta:</b> la caída de Y2 aumenta S(r); al caer L2 cae la PMK2 → I(r) a la izquierda. Ambas bajan r respecto del rojo; se abarata algo el capital.</p><p><b>Resultado:</b> ↓Y1, ↓L1, ↓w1/p1, ↓C1; ↓Y2, ↓K2, ↓L2, ↓w2/p2; r ambiguo; ↓S = I.</p><div class="note warn"><span class="lbl">errata</span>El PDF dice en el paso 2 «se reduce r», pero su propio gráfico muestra $r'^* > r^*$: en la 1ª vuelta la tasa <b>sube</b>.</div><div data-w="ge" data-o="pml1down"></div>` },
          { t: 'Inciso 3 · Aumento paralelo de Y1', b: T`<p><b>1ª vuelta:</b> Y1(L1) sube en paralelo; no cambian las productividades marginales, así que L1 y w1/p1 quedan igual. El consumidor ahorra parte de la renta transitoria: S a la derecha → r baja → más K2 (movimiento sobre la PMK) → sube la PML2 → suben L2 y w2/p2, e Y2.</p><p><b>2ª vuelta:</b> el mayor L2 eleva la PMK → I(r) a la derecha. Ante más Y2, S vuelve parcialmente hacia adentro. La tasa se recupera: $r'^* < r''^* < r^*$.</p><p><b>Resultado:</b> ↑Y1 (L1 y w1/p1 iguales); ↑Y2, ↑K2, ↑L2, ↑w2/p2; ↓r; ↑S = I.</p><div class="note warn"><span class="lbl">errata</span>La tabla final del PDF en este inciso dice «↓Y2, ↓K2, ↓L2, ↓w2/p2»: está copiada del inciso 1. El propio texto dice «Al final, aumentan L2 y el salario real».</div><div data-w="ge" data-o="y1up"></div>` },
        ],
        errores: ['Mover el período 1 en el shock a la PMK2.', 'En el shock paralelo, mover L1 o w1/p1: la PML1 no cambia.', 'Dar un signo a S = I cuando los desplazamientos de S e I van en direcciones opuestas.', 'Olvidarse de la distribución de la renta (con Cobb-Douglas las participaciones no cambian).'],
        practice: { fixed: GEV, build: geBuild },
      },
    ],
  });
})();
