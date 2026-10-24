/* Unidad 5 · Capítulo 6 · TP 8 (sin solución oficial: resuelto con el método del capítulo 6) */
(function () {
  const T = String.raw;
  const { f, ft, pct, pt, rng, randInt, pick, table } = App.h;

  /* ------------------------------------------------------------------ */
  /* TP 8 · Ejercicio 1 · variantes gráficas                            */
  /* ------------------------------------------------------------------ */
  const OPV = [
    { n: 'una caída transitoria de la productividad total de los factores del primer período (A1↓)', rows: [['Ahorro privado', '↓'], ['Inversión', '='], ['Cuenta corriente', '↓']], s: 'Cae Y1 (y también L1 y w1/p1, porque A1 baja la PML1). Para suavizar, el consumidor baja C1 menos que Y1 y <b>ahorra menos</b>: S se corre a la izquierda.', i: 'La PMK2 no cambia y la tasa sigue siendo rW: la firma elige el mismo K2. <b>La inversión no cambia.</b>', ca: 'CA = S − I cae: <b>el déficit se agranda</b> (el país se endeuda más con el mundo para sostener el consumo).' },
    { n: 'un aumento esperado de G2 financiado con impuestos del período 2 (T2↑)', rows: [['Ahorro privado', '↑'], ['Inversión', '='], ['Cuenta corriente', '↑']], s: 'Cae el ingreso disponible de mañana. El consumidor reparte la caída: consume menos hoy y <b>ahorra más</b> ($\\Delta S^P = \\frac{K}{(1+b)(1+r)} > 0$). El ahorro público de hoy no cambia.', i: 'Nada cambia para la firma: misma PMK2, misma rW. <b>I igual.</b>', ca: 'S sube con I igual: <b>CA sube</b> (se achica el déficit).' },
    { n: 'un aumento de la tasa de interés internacional rW', rows: [['Ahorro privado', '↑'], ['Inversión', '↓'], ['Cuenta corriente', '↑']], s: 'No se mueve ninguna curva: nos movemos <b>sobre</b> S(r), que es creciente. Más rW → más ahorro.', i: 'El capital se encarece (rW + δ): menos K2 → <b>menos inversión</b>, moviéndonos sobre I(r).', ca: 'Más S y menos I: <b>CA sube</b>. Si rW supera la tasa de economía cerrada r*, el déficit se vuelve superávit.' },
    { n: 'un aumento de la PMK esperada para el período 2 (A2↑)', rows: [['Ahorro privado', '↓'], ['Inversión', '↑'], ['Cuenta corriente', '↓']], s: 'Con más K2 y más A2, Y2 sube: el consumidor es más rico mañana y <b>ahorra menos</b> hoy (S a la izquierda).', i: 'A cada tasa, la firma quiere más K2: <b>I(r) se corre a la derecha</b>. Como rW no cambia, la inversión sube.', ca: 'Menos S y más I: <b>CA cae</b>. El mundo financia la inversión extra.' },
    { n: 'una suba del riesgo país p, sin deuda pública (B = 0)', rows: [['Ahorro privado', '↑'], ['Inversión', '↓'], ['Cuenta corriente', '↑']], s: 'Los ahorristas siguen cobrando rW, pero como se invierte menos, K2 e Y2 caen: el consumidor ahorra un poco más (S a la derecha). Ese efecto es el que el capítulo menciona al final.', i: 'Las firmas se financian a $r_{ARG} = \\frac{r_W + p}{1-p}$, que sube: <b>la inversión cae</b>.', ca: 'Más S y menos I: <b>CA sube</b> (el déficit se achica). Con deuda pública (B &gt; 0) además sube T2 y el ahorro aumenta todavía más.' },
  ];
  const opBuild = (v) => ({
    enun: `<p>Una economía chica y abierta financia parte de su inversión con el exterior (déficit de cuenta corriente: $r_W < r^*$). Analizá gráficamente los efectos sobre el ahorro privado, la inversión y la cuenta corriente de <b>${v.n}</b>.</p>`,
    arrows: { cols: ['Cambio'], rows: v.rows },
    steps: [
      { t: 'La clave de la economía chica y abierta', b: `<p>La tasa es $r_W$ y no se mueve. No hay «segunda vuelta» por la tasa: basta con ver cómo se corren S e I y leer $CA = S(r_W) - I(r_W)$.</p>` },
      { t: 'Ahorro', b: `<p>${v.s}</p>` },
      { t: 'Inversión', b: `<p>${v.i}</p>` },
      { t: 'Cuenta corriente y gráfico', b: `<p>${v.ca}</p>` + table(['Variable', 'Cambio'], v.rows) + '<div data-w="open"></div>' },
    ],
  });

  /* ------------------------------------------------------------------ */
  /* TP 8 · Ejercicio 2 · modelo analítico (b general)                   */
  /* ------------------------------------------------------------------ */
  function tp8Calc(p) {
    const { A1, A2, b, rW, G1, G2, B, rP } = p;
    const onePr = (A2 / 2) * Math.sqrt((3 + b) / (b * A1));
    const I0 = (b * A1) / (3 + b), Y2c = A2 * Math.sqrt(I0), C1c = (3 * A1) / (3 + b), C2c = b * onePr * C1c;
    const CAo = (r) => (b * A1) / (1 + b) - ((3 + b) * A2 * A2) / (4 * (1 + b) * Math.pow(1 + r, 2));
    const CAg = (r) => (b * (A1 - G1)) / (1 + b) + G2 / ((1 + b) * (1 + r)) - ((3 + b) * A2 * A2) / (4 * (1 + b) * Math.pow(1 + r, 2));
    const CAp = (rp) => (b * (A1 - G1)) / (1 + b) + G2 / ((1 + b) * (1 + rW)) + (B * (rp - rW)) / ((1 + b) * (1 + rW)) - (A2 * A2) / (2 * (1 + b) * (1 + rW) * (1 + rp)) - (A2 * A2) / (4 * Math.pow(1 + rp, 2));
    const PVT = (Bx) => G1 + G2 / (1 + rW) + (Bx * (rP - rW)) / (1 + rW);
    const Y2p = (A2 * A2) / (2 * (1 + rP));
    const Wc = (Bx) => A1 + Y2p / (1 + rW) - PVT(Bx);
    const U = (Bx) => { const c1 = Wc(Bx) / (1 + b); return Math.log(c1) + b * Math.log(b * (1 + rW) * c1); };
    return { onePr, I0, Y2c, C1c, C2c, CAo, CAg, CAp, PVT, Wc, U, Y2p };
  }
  function tp8Build(p) {
    const c = tp8Calc(p), { A1, A2, b, rW, G1, G2, B, rP } = p;
    const bT = ft(b);
    const enun = `<p>Economía chica y cerrada, sin gobierno. En el óptimo $c_2 = b(1+r)c_1$. Se trabaja $L_1 = L_2 = 1$, $Y_t = A_tK_t^{\\alpha}L_t^{1-\\alpha}$, $PMgK_2 = \\alpha A_2K_2^{\\alpha-1}L_2^{1-\\alpha}$, $\\delta = 1$, $K_1 = 1$ y $\\alpha = 0{,}5$. Datos: $A_1 = ${ft(A1)}$, $A_2 = ${ft(A2)}$, $b = ${bT}$.</p><ol><li>Obtené la curva de ahorro, la de inversión, los consumos, la producción, el ahorro, la inversión y la tasa de equilibrio.</li><li>La economía se abre con $r_W = ${pt(rW, 0)}$. Encontrá la cuenta corriente como función de $r_W$ y su valor. ¿Qué signo tiene si $r_W < r^*$?</li><li>Hay un gobierno con $G_1 = ${ft(G1)}$ y $G_2 = ${ft(G2)}$ que se financia con impuestos de suma fija y deuda a tasa $r_W$. Encontrá CA.</li><li>Gobierno y firma se endeudan a $r_P = ${pt(rP, 0)} > r_W$ y el gobierno es deudor neto con $B = ${ft(B)}$. Encontrá CA. ¿Qué pasa si sube $r_P$?</li><li>Mostrá que la equivalencia ricardiana no se cumple.</li></ol>`;
    const S = (r) => (b * A1) / (1 + b) - (A2 * A2) / (2 * (1 + b) * Math.pow(1 + r, 2));
    const steps = [
      { t: 'Inciso 1 · Producción y curva de inversión', b: `<p>Con $K_1 = L_1 = 1$: $Y_1 = A_1 = ${ft(A1)}$.</p><p>Capital óptimo: $PMgK_2 = 0{,}5A_2K_2^{-1/2} = r + \\delta = 1 + r$:</p>$$K_2^*(r) = \\left(\\frac{A_2}{2(1+r)}\\right)^2 \\qquad I(r) = K_2^*(r) - (1-\\delta)K_1 = \\left(\\frac{${ft(A2)}}{2(1+r)}\\right)^2$$<p>Producción futura: $Y_2 = A_2K_2^{1/2} = \\frac{A_2^2}{2(1+r)}$. Fijate que $\\frac{Y_2}{1+r} = 2I(r)$: eso simplifica todo.</p>` },
      { t: 'Inciso 1 · Curva de ahorro', b: `$$C_1 = \\frac{1}{1+b}\\left(Y_1 + \\frac{Y_2}{1+r}\\right)\\;\\Rightarrow\\; S(r) = Y_1 - C_1 = \\frac{b}{1+b}A_1 - \\frac{1}{1+b}\\frac{A_2^2}{2(1+r)^2}$$$$S(r) = ${ft((b * A1) / (1 + b), 4)} - \\frac{${ft((A2 * A2) / (2 * (1 + b)), 4)}}{(1+r)^2}$$<p>Creciente en r, como corresponde.</p>` },
      { t: 'Inciso 1 · Equilibrio de economía cerrada', b: `<p>Llamando $x = I(r)$, la curva de ahorro es $S = \\frac{bA_1}{1+b} - \\frac{2x}{1+b}$. Igualando $S = I = x$:</p>$$\\frac{bA_1}{1+b} = x\\,\\frac{3+b}{1+b} \\;\\Rightarrow\\; I^* = S^* = K_2^* = \\frac{bA_1}{3+b} = ${ft(c.I0, 4)}$$$$1 + r^* = \\frac{A_2}{2}\\sqrt{\\frac{3+b}{bA_1}} = ${ft(c.onePr, 4)} \\;\\Rightarrow\\; r^* = ${pt(c.onePr - 1, 2)}$$<p>(Con b = 1 queda $1 + r^* = A_2/\\sqrt{A_1}$, la fórmula del capítulo 6.)</p>$$Y_2^* = A_2\\sqrt{K_2^*} = ${ft(c.Y2c, 4)}\\qquad C_1^* = Y_1 - S^* = \\frac{3A_1}{3+b} = ${ft(c.C1c, 4)}\\qquad C_2^* = b(1+r^*)C_1^* = ${ft(c.C2c, 4)}$$` },
      { t: 'Inciso 2 · Cuenta corriente con rW', b: `<p>En economía abierta $r = r_W$ y $CA = S(r_W) - I(r_W)$:</p>$$CA(r_W) = \\frac{b}{1+b}A_1 - \\frac{3+b}{4(1+b)}\\frac{A_2^2}{(1+r_W)^2}$$$$CA(${pt(rW, 0)}) = ${ft((b * A1) / (1 + b), 4)} - ${ft(((3 + b) * A2 * A2) / (4 * (1 + b)), 4)}\\cdot\\frac{1}{${ft(Math.pow(1 + rW, 2), 4)}} = ${ft(c.CAo(rW), 4)}$$<p>CA es creciente en $r_W$ y vale cero justo en $r^*$. Por eso <mark>si $r_W < r^*$, CA &lt; 0</mark> (déficit: el país pide prestado al mundo). Acá $r_W = ${pt(rW, 0)}$ ${rW < c.onePr - 1 ? '&lt;' : '&gt;'} $r^* = ${pt(c.onePr - 1, 1)}$ → ${c.CAo(rW) < 0 ? 'déficit' : 'superávit'}.</p>` },
      { t: 'Inciso 3 · Con gobierno (tasa rW para todos)', b: `<p>RPI del gobierno: $G_1 + \\frac{G_2}{1+r_W} = T_1 + \\frac{T_2}{1+r_W}$. Por equivalencia ricardiana, el ahorro total sólo depende del gasto: $S = Y_1 - G_1 - C_1$ con $C_1 = \\frac{1}{1+b}\\left(Y_1 - G_1 + \\frac{Y_2 - G_2}{1+r_W}\\right)$. Entonces:</p>$$CA = \\frac{b(A_1 - G_1)}{1+b} + \\frac{G_2}{(1+b)(1+r_W)} - \\frac{3+b}{4(1+b)}\\frac{A_2^2}{(1+r_W)^2} = ${ft(c.CAg(rW), 4)}$$<p>Más $G_1$ baja la CA; más $G_2$ la sube (el consumidor ahorra hoy para pagar los impuestos de mañana). No importa la mezcla de T1 y B.</p>` },
      { t: 'Inciso 4 · Riesgo: rP para gobierno y firma, rW para el ahorrista', b: `<p>Ahora $T_1 = G_1 - B$, $T_2 = G_2 + (1+r_P)B$, la firma usa $1 + r_P$ en su PMK y el consumidor ahorra a $r_W$:</p>$$I = \\frac{A_2^2}{4(1+r_P)^2},\\quad Y_2 = \\frac{A_2^2}{2(1+r_P)}$$<p>Reemplazando los impuestos en el ahorro total $S = S^P - B$:</p>$$S = \\frac{b(Y_1 - G_1)}{1+b} - \\frac{Y_2 - G_2}{(1+b)(1+r_W)} + \\frac{B(r_P - r_W)}{(1+b)(1+r_W)}$$$$CA = \\frac{b(A_1 - G_1)}{1+b} + \\frac{G_2}{(1+b)(1+r_W)} + \\frac{B(r_P - r_W)}{(1+b)(1+r_W)} - \\frac{A_2^2}{2(1+b)(1+r_W)(1+r_P)} - \\frac{A_2^2}{4(1+r_P)^2}$$<p>Con los datos: $CA = ${ft(c.CAp(rP), 4)}$. Si $r_P$ sube a ${pct(rP + 0.1, 0)}: $CA = ${ft(c.CAp(rP + 0.1), 4)}$.</p><div class="note"><span class="lbl">¿qué pasa si sube rP?</span>Tres canales, todos suben la CA: (1) la firma invierte menos; (2) con menos K2, Y2 cae y el consumidor ahorra más; (3) como el gobierno debe B, sube T2 y el consumidor ahorra más para pagarlo.</div>` },
      { t: 'Inciso 5 · No vale la equivalencia ricardiana', b: `<p>El valor presente de los impuestos que paga el consumidor (descontando a $r_W$) es:</p>$$T_1 + \\frac{T_2}{1+r_W} = G_1 - B + \\frac{G_2 + (1+r_P)B}{1+r_W} = G_1 + \\frac{G_2}{1+r_W} + \\frac{B(r_P - r_W)}{1+r_W}$$<p>Como $r_P > r_W$, <mark>crece con B</mark>: financiar con deuda le cuesta más al consumidor. Con B = 0 el valor presente es ${ft(c.PVT(0), 4)}; con B = ${ft(B)} es ${ft(c.PVT(B), 4)}.</p>` + table(['Financiamiento', 'VP de impuestos', 'Riqueza disponible', 'Utilidad'], [['Todo con impuestos (B = 0)', f(c.PVT(0), 4), f(c.Wc(0), 4), f(c.U(0), 4)], [`Con deuda (B = ${f(B)})`, f(c.PVT(B), 4), f(c.Wc(B), 4), f(c.U(B), 4)]]) + `<p>El consumidor tiene una <b>preferencia estricta</b> por que el gasto se financie con impuestos de hoy.</p>` },
    ];
    return { enun, steps };
  }
  const tp8Fixed = [
    { A1: 4, A2: 3, b: 1, rW: 0.25, G1: 0.4, G2: 0.4, B: 0.2, rP: 0.4 },
    { A1: 7, A2: 3, b: 0.5, rW: 0.6, G1: 0.5, G2: 0.5, B: 0.3, rP: 0.8 },
    { A1: 5, A2: 3, b: 0.75, rW: 0.2, G1: 0.3, G2: 0.6, B: 0.3, rP: 0.35 },
    { A1: 9, A2: 4, b: 1, rW: 0.1, G1: 1, G2: 1, B: 0.5, rP: 0.25 },
    { A1: 6, A2: 4, b: 0.6, rW: 0.5, G1: 0.5, G2: 0.5, B: 0.25, rP: 0.7 },
  ];
  const tp8Rand = (R) => {
    const b = pick(R, [0.5, 0.75, 1]), A2 = pick(R, [2, 3, 4]), opr = pick(R, [1.25, 1.5, 2]);
    const A1 = Math.round(((A2 * A2 * (3 + b)) / (4 * b * opr * opr)) * 100) / 100;
    const rW = Math.round((opr - 1) * pick(R, [0.4, 0.7, 1.3]) * 100) / 100;
    const G1 = Math.round(A1 * pick(R, [0.05, 0.1]) * 100) / 100;
    return { A1, A2, b, rW, G1, G2: G1, B: Math.round(G1 * 50) / 100, rP: Math.round((rW + pick(R, [0.1, 0.15, 0.2])) * 100) / 100 };
  };

  /* ------------------------------------------------------------------ */
  App.UNITS.push({
    id: 'u5', n: 5, title: 'Economía abierta', caps: 'Cap. 6', tps: 'TP 8',
    blurb: 'Cuenta corriente, economía chica con tasa internacional, shocks con r fija, el modelo analítico y el riesgo país.',
    lessons: [
      {
        id: 'u5l1', t: 'Abrir la economía', d: 'S = I + CA y por qué la tasa local es rW.',
        cards: [
          { t: 'El comercio también es intertemporal', b: T`<p>Suponemos que el mundo produce el mismo bien (cocos). Abrirse no sirve para comprar cosas que no tenemos, sino para <b>consumir o invertir más hoy de lo que producimos</b>, pidiéndole al mundo, y devolver mañana. Comprar afuera es pedir prestado afuera.</p>`, w: 'flujo', o: 'abierta' },
          { t: 'La identidad clave', b: T`$$\text{Cerrada: } S = I \qquad \text{Abierta: } S = I + CA$$$$S^P = I + (-S^G) + CA$$<p>CA es la <b>cuenta corriente</b>, el flujo neto de bienes con el exterior.</p><ul><li>$CA > 0$ (superávit): $S > I$, el país <b>le presta</b> al mundo.</li><li>$CA < 0$ (déficit): $S < I$, el país <b>le pide prestado</b> al mundo.</li></ul>`, q: { k: 'mc', q: 'S = 80 e I = 100. ¿Cuenta corriente?', o: ['+20, presta', '−20, pide prestado', '180', '0'], a: 1, why: 'CA = S − I = −20: el mundo financia 20 de la inversión.' } },
          { t: 'Por qué r = rW en una economía chica', b: T`<p>El mundo presta y recibe depósitos a $r_W$. Ningún inversor local pagaría más que $r_W$ (iría afuera) y ningún ahorrista aceptaría menos (depositaría afuera). La única tasa que acepta todo el mundo es <mark>r = rW</mark>.</p><p>Que el país sea <b>chico</b> significa que sus movimientos de S e I no cambian $r_W$.</p><ul><li>Si $r_W < r^*$ (la tasa que habría cerrada): $S(r_W) < I(r_W)$ → <b>déficit</b>.</li><li>Si $r_W > r^*$: superávit.</li></ul>`, w: 'open', q: { k: 'vf', q: 'Si la tasa internacional es menor que la de economía cerrada, el país tiene superávit de cuenta corriente.', a: false, why: 'Con rW < r*, ahorra menos e invierte más que en autarquía: déficit.' } },
        ],
      },
      {
        id: 'u5l2', t: 'Shocks con la tasa fija', d: 'Más simple que en economía cerrada: sin segunda vuelta.',
        cards: [
          { t: 'El método', b: T`<p>Como r = rW no se mueve, no hay segunda vuelta por la tasa. Para cada shock:</p><ol><li>¿Cambia la PMK2? → se corre I(r).</li><li>¿Cambia Y1, Y2 o los impuestos? → el consumidor suaviza → se corre S(r).</li><li>Leé el nuevo $CA = S(r_W) - I(r_W)$.</li></ol>` },
          { t: 'Ejemplo del capítulo: cae la PMK esperada', b: T`<p>Baja A2. Período 1 sin cambios. La firma quiere menos K2 a la misma $r_W$: <b>I cae</b>. Con menos K2 y menos A2, Y2 cae: el consumidor <b>ahorra más</b>. Resultado: S↑, I↓ → <mark>CA sube, se achica el déficit</mark>. Los consumos que dibujaste son los finales, porque la tasa no cambia.</p>`, w: 'open' },
          { t: 'Tabla de shocks', b: T`<table><tr><th>Shock</th><th>S</th><th>I</th><th>CA</th></tr><tr><td>A1↑ transitorio</td><td>↑</td><td>=</td><td>↑</td></tr><tr><td>G1↑ con T1</td><td>↓</td><td>=</td><td>↓</td></tr><tr><td>G2↑ con T2</td><td>↑</td><td>=</td><td>↑</td></tr><tr><td>PMK2↓ esperada</td><td>↑</td><td>↓</td><td>↑</td></tr><tr><td>PMK2↑ esperada</td><td>↓</td><td>↑</td><td>↓</td></tr><tr><td>rW↑</td><td>↑</td><td>↓</td><td>↑</td></tr></table>`, q: { k: 'mc', q: 'Aumento temporario de G1 financiado con impuestos de hoy, en una economía chica y abierta:', o: ['CA↑', 'CA↓ e I igual', 'I↓ y r↑', 'Nada cambia'], a: 1, why: 'Cae el ahorro total; la tasa no se mueve, así que I queda igual y la CA cae.' } },
        ],
      },
      {
        id: 'u5l3', t: 'El modelo analítico', d: 'Las cuentas del capítulo 6 que usa el TP 8.',
        cards: [
          { t: 'Los supuestos', b: T`<p>$Y_t = A_tK_t^{1/2}L_t^{1/2}$, $L_1 = L_2 = 1$, $K_1 = 1$, $\delta = 1$ (el capital se gasta entero). Entonces:</p>$$Y_1 = A_1\qquad K_2^*(r) = I(r) = \left(\frac{A_2}{2(1+r)}\right)^2\qquad Y_2 = \frac{A_2^2}{2(1+r)}$$<p>Con $\delta = 1$, toda la inversión es el capital de mañana. Y un truco: $\frac{Y_2}{1+r} = 2I$.</p>` },
          { t: 'Economía cerrada', b: T`<p>Con $c_2 = b(1+r)c_1$: $S(r) = \frac{b}{1+b}A_1 - \frac{A_2^2}{2(1+b)(1+r)^2}$. Igualando con I:</p>$$K_2^* = I^* = \frac{bA_1}{3+b}\qquad 1 + r^* = \frac{A_2}{2}\sqrt{\frac{3+b}{bA_1}}$$<p>Con b = 1 (el caso del capítulo): $1 + r^* = A_2/\sqrt{A_1}$, $K_2^* = A_1/4$ y $C_1^* = \frac34 A_1$.</p><div class="ex"><span class="lbl">dato curioso del capítulo</span>Con estos supuestos, $K_2^*$ y $C_1^*$ <b>no dependen de A2</b>: si baja A2, la caída de r compensa exactamente el efecto ingreso.</div>` },
          { t: 'Economía abierta con gobierno', b: T`$$CA = \frac{b(A_1 - G_1)}{1+b} + \frac{G_2}{(1+b)(1+r_W)} - \frac{3+b}{4(1+b)}\frac{A_2^2}{(1+r_W)^2}$$<p>Con b = 1 queda la del capítulo: $CA = \frac12(A_1 - G_1) + \frac{G_2}{2(1+r_W)} - 2\left(\frac{A_2}{2(1+r_W)}\right)^2$.</p><ul><li>$G_1\uparrow$ o $A_2\uparrow$ → CA↓.</li><li>$G_2\uparrow$, $A_1\uparrow$ o $r_W\uparrow$ → CA↑.</li></ul>`, q: { k: 'mc', q: 'Con b = 1, A1 = 4 y A2 = 3, ¿cuánto vale la tasa de economía cerrada?', o: ['25 %', '50 %', '75 %', '33 %'], a: 1, why: '1 + r* = 3/√4 = 1,5.' } },
          { t: 'Consistencia agregada (para saber que existe)', b: T`<p>Si se arma el modelo con todo el cuidado (el consumidor es dueño de la firma y del capital), sale que en cada período $C_1 + I_1 + CA_1 = Y_1$ y $C_2 + I_2 + CA_2 = Y_2$. El análisis simplificado que usamos no es del todo consistente, pero da las mismas intuiciones.</p>` },
        ],
      },
      {
        id: 'u5l4', t: 'Riesgo país', d: 'Probabilidad de default, rARG y la cuenta corriente.',
        cards: [
          { t: 'Prestarle a alguien que puede no pagar', b: T`<p>Un activo seguro paga $A + R^*$. Prestarle a un argentino paga $A + R$ con probabilidad ½ y 0 con probabilidad ½. Para que te dé lo mismo en promedio:</p>$$\tfrac12(A + R) = A + R^* \;\Rightarrow\; R = A + 2R^* > R^*$$<p>El mundo es <b>neutral al riesgo</b> (tiene tantas inversiones que sólo mira el retorno esperado). Con probabilidad de default p:</p>$$1 + r_W = (1-p)(1 + r_{ARG}) \;\Rightarrow\; r_{ARG} = \frac{r_W + p}{1-p}\qquad \lambda = r_{ARG} - r_W$$<div class="ex"><span class="lbl">con números</span>$r_W = 5\%$ y $p = 10\%$: $r_{ARG} = 0{,}15/0{,}9 = 16{,}7\%$. Riesgo país $\lambda = 11{,}7$ puntos, unos 1170 puntos básicos.</div>`, q: { k: 'mc', q: 'rW = 4 % y p = 20 %. ¿rARG?', o: ['24 %', '30 %', '5 %', '20 %'], a: 1, why: '(0,04 + 0,2)/0,8 = 0,30.' } },
          { t: 'Quién paga qué tasa', b: T`<p>Los <b>ahorristas</b> cobran $r_W$ (pueden depositar afuera). Las <b>firmas y el gobierno</b>, que piden prestado, pagan $r_{ARG}$. Entonces:</p>$$CA = S(r_W) - I(r_{ARG})$$<p>Si sube p: sube $r_{ARG}$ → <b>la inversión cae</b> → CA sube (se achica el déficit). Además, menos inversión → menos Y2 → el consumidor ahorra un poco más.</p>`, w: 'open', b2: T`<p>Subí la probabilidad de default: vas a ver la línea roja de $r_{ARG}$ separarse de $r_W$.</p>` },
          { t: 'Riesgo país y equivalencia ricardiana', b: T`<p>Si el gobierno se endeuda (B &gt; 0) a $r_{ARG}$ pero el consumidor descuenta a $r_W$, el valor presente de los impuestos es:</p>$$T_1 + \frac{T_2}{1+r_W} = G_1 + \frac{G_2}{1+r_W} + \frac{B(r_{ARG} - r_W)}{1+r_W}$$<p>Crece con B. Financiar con deuda <mark>le cuesta más al consumidor</mark> que financiar con impuestos de hoy: la equivalencia ricardiana falla y el consumidor prefiere estrictamente que el gasto se pague con impuestos.</p><p>Con B &gt; 0, una suba del riesgo país sube $T_2 = G_2 + (1+r_{ARG})B$: efecto ingreso negativo → el ahorro sube → el déficit de CA se achica todavía más.</p>`, q: { k: 'vf', q: 'Con riesgo país y gobierno endeudado, al consumidor le da igual que el gasto se financie con deuda o con impuestos.', a: false, why: 'Con deuda paga en valor presente B(rARG − rW)/(1 + rW) de más.' } },
        ],
      },
    ],
    quiz: [
      { k: 'vf', q: 'En economía abierta, S = I + CA.', a: true, why: 'Lo que no se invierte adentro se le presta al mundo.' },
      { k: 'vf', q: 'Un déficit de cuenta corriente significa que el país le presta al resto del mundo.', a: false, why: 'Significa que pide prestado: S < I.' },
      { k: 'mc', q: 'En una economía chica y abierta, la tasa de interés local es:', o: ['la de economía cerrada r*', 'rW', 'el promedio entre r* y rW', 'cero'], a: 1, why: 'Por no arbitraje con el mercado mundial.' },
      { k: 'mc', q: 'rW > r*. ¿Signo de la CA?', o: ['Positivo', 'Negativo', 'Cero', 'Ambiguo'], a: 0, why: 'A una tasa más alta que la de autarquía, ahorra más e invierte menos.' },
      { k: 'vf', q: 'En una economía chica y abierta, una caída de la PMK esperada baja la tasa de interés.', a: false, why: 'La tasa es rW y no se mueve: el ajuste es por la CA.' },
      { k: 'mc', q: 'Cae la PMK2 esperada en una economía chica y abierta con déficit inicial. ¿Qué pasa con el déficit?', o: ['Se achica', 'Se agranda', 'No cambia', 'Ambiguo'], a: 0, why: 'I cae y S sube: CA sube.' },
      { k: 'mc', q: 'Aumento transitorio de A1 en una economía abierta. ¿Qué pasa con la inversión?', o: ['Sube', 'Baja', 'No cambia', 'Ambiguo'], a: 2, why: 'La PMK2 y la tasa no cambian: la firma elige el mismo K2.' },
      { k: 'vf', q: 'Un aumento de G2 financiado con T2 sube la cuenta corriente de hoy.', a: true, why: 'El consumidor ahorra hoy para pagar los impuestos de mañana.' },
      { k: 'mc', q: 'rW = 10 % y p = 10 %. ¿rARG?', o: ['20 %', '22,2 %', '11 %', '10 %'], a: 1, why: '(0,1 + 0,1)/0,9 = 22,2 %.' },
      { k: 'vf', q: 'Con riesgo país, los ahorristas locales cobran rARG.', a: false, why: 'Cobran rW: pueden depositar en el mundo. rARG lo pagan los que piden prestado.' },
      { k: 'mc', q: 'Sube el riesgo país. ¿Qué pasa con la inversión y la CA?', o: ['I↑, CA↓', 'I↓, CA↑', 'I↓, CA↓', 'Nada'], a: 1, why: 'Las firmas se financian más caro: invierten menos y baja el déficit.' },
      { k: 'vf', q: 'En el modelo del capítulo 6 con b = 1, la tasa de economía cerrada cumple 1 + r* = A2/√A1.', a: true, why: 'Sale de igualar S(r) e I(r).' },
      { k: 'mc', q: 'Con K1 = 1, L = 1, α = ½ y δ = 1, ¿cuánto vale Y1?', o: ['A1', 'A1/2', '√A1', '1'], a: 0, why: 'Y1 = A1·1^½·1^½.' },
      { k: 'vf', q: 'Si el gobierno se endeuda a una tasa mayor que la de los ahorristas, el consumidor prefiere que el gasto se financie con impuestos.', a: true, why: 'El valor presente de los impuestos es menor sin deuda.' },
    ],
    formulas: [
      { n: 'Economía abierta', tex: T`S = I + CA,\quad S^P = I - S^G + CA`, d: 'CA > 0 presta; CA < 0 pide prestado.' },
      { n: 'Cuenta corriente', tex: T`CA = S(r_W) - I(r_W)`, d: 'Economía chica: r = rW.' },
      { n: 'Inversión y producción (modelo cap. 6)', tex: T`I(r) = K_2 = \left(\frac{A_2}{2(1+r)}\right)^2,\quad Y_2 = \frac{A_2^2}{2(1+r)}`, d: 'K1 = L = 1, α = ½, δ = 1.' },
      { n: 'Tasa de economía cerrada', tex: T`1 + r^* = \frac{A_2}{2}\sqrt{\frac{3+b}{bA_1}}`, d: 'Con b = 1: A2/√A1.' },
      { n: 'CA con gobierno', tex: T`CA = \frac{b(A_1 - G_1)}{1+b} + \frac{G_2}{(1+b)(1+r_W)} - \frac{(3+b)A_2^2}{4(1+b)(1+r_W)^2}`, d: 'TP 8, inciso 3.' },
      { n: 'Tasa con riesgo país', tex: T`r_{ARG} = \frac{r_W + p}{1-p},\quad \lambda = r_{ARG} - r_W`, d: 'Mundo neutral al riesgo.' },
      { n: 'CA con riesgo país', tex: T`CA = S(r_W) - I(r_{ARG})`, d: 'Los que piden prestado pagan rARG.' },
      { n: 'VP de impuestos con riesgo', tex: T`T_1 + \frac{T_2}{1+r_W} = G_1 + \frac{G_2}{1+r_W} + \frac{B(r_{ARG} - r_W)}{1+r_W}`, d: 'Falla la equivalencia ricardiana.' },
    ],
    exercises: [
      {
        id: 'tp8e1', tp: 'TP 8', num: 1, title: 'Shocks en una economía abierta', sum: 'Ahorro privado, inversión y cuenta corriente ante un aumento de A1 y de G1.',
        consigna: T`<p>Una economía chica y abierta financia parte de la inversión con recursos del exterior. Analizá gráficamente los efectos sobre el ahorro privado, la inversión y la cuenta corriente de:</p><ol><li>Un aumento temporario de la productividad total de los factores del primer período.</li><li>Un aumento temporario de G1 financiado sólo con impuestos contemporáneos.</li></ol>`,
        plan: T`<ol><li>Dibujá S(r) creciente, I(r) decreciente y una recta horizontal en $r_W$ por debajo del cruce (déficit inicial, porque financia inversión con el exterior).</li><li>Para cada shock: ¿cambia I? (¿cambia la PMK2?) ¿Cambia S? (¿cambia el ingreso de algún período?)</li><li>Leé la nueva CA a la misma $r_W$.</li></ol><div class="note"><span class="lbl">sobre esta solución</span>El TP 8 no tiene solución publicada. Está resuelto con el método del capítulo 6 (país chico, r = rW).</div>`,
        profe: [
          { t: 'Punto de partida', b: T`<p>«Financia parte de la inversión con recursos del exterior» quiere decir $S(r_W) < I(r_W)$: <b>déficit de cuenta corriente</b>, con $r_W < r^*$.</p><div data-w="open"></div>` },
          { t: 'Inciso 1 · A1 sube transitoriamente', b: T`<p>Sube Y1 y también la PML1, así que suben L1 y w1/p1. El consumidor recibe más ingreso hoy y, para suavizar, <b>ahorra parte</b>: S(r) a la derecha.</p><p>La PMK2 no cambia y la tasa es la misma $r_W$: la firma elige el mismo K2. <b>La inversión no cambia.</b></p><p>Resultado: $S^P\uparrow$, $I =$, $CA\uparrow$ (el déficit se achica).</p>` },
          { t: 'Inciso 2 · G1 sube con T1', b: T`<p>$\Delta G_1 = \Delta T_1$: el ahorro público no cambia. El ingreso disponible de hoy cae y el consumidor baja C1 menos que el impuesto (suaviza): <b>el ahorro privado cae</b> en $\frac{b}{1+b}\Delta G_1$.</p><p>I no cambia (misma PMK2 y misma $r_W$).</p><p>Resultado: $S^P\downarrow$, $S^T\downarrow$, $I =$, $CA\downarrow$ (el déficit se agranda). A diferencia de la economía cerrada, <b>no hay crowding out de la inversión</b>: el mundo pone la diferencia.</p>` },
        ],
        errores: ['Mover la tasa de interés: en una economía chica es rW.', 'Decir que el aumento de G1 baja la inversión: en economía abierta, no.', 'Olvidarse de aclarar el punto de partida (déficit).'],
        practice: { fixed: OPV, build: opBuild },
      },
      {
        id: 'tp8e2', tp: 'TP 8', num: 2, title: 'Economía abierta con riesgo país y equivalencia ricardiana', sum: 'Equilibrio cerrado, CA en función de rW, con gobierno, con tasa de riesgo y por qué falla la equivalencia.',
        consigna: T`<p>Economía chica y cerrada, sin gobierno. En el óptimo $c_2 = b(1+r)c_1$. $L_1 = L_2 = 1$, $Y_t = A_tK_t^\alpha L_t^{1-\alpha}$, $PMgK_2 = \alpha A_2K_2^{\alpha-1}L_2^{1-\alpha}$, $\delta = 1$, $K_1 = 1$, $\alpha = 0{,}5$.</p><ol><li>Obtené la curva de ahorro, la de inversión, los consumos, la producción, el ahorro, la inversión y la tasa de equilibrio.</li><li>Se abre con tasa $r_W$. Encontrá CA en función de $r_W$. ¿Qué signo tiene si $r_W$ es menor que la tasa de economía cerrada?</li><li>Un gobierno financia $\{G_1, G_2\}$ con impuestos de suma fija y deuda a $r_W$. Encontrá CA en función de $r_W$ y la política fiscal.</li><li>Gobierno y firma pagan $r_P > r_W$; el consumidor ahorra a $r_W$; el gobierno es deudor neto. Encontrá CA. ¿Qué pasa si sube $r_P$?</li><li>Mostrá que la equivalencia ricardiana no se cumple.</li></ol>`,
        plan: T`<ol><li>Con $K_1 = L = 1$: $Y_1 = A_1$. De $PMgK_2 = 1 + r$ sale $K_2(r)$; con δ = 1, $I = K_2$. Reemplazá en $Y_2$.</li><li>Ahorro: fórmula de siempre con Y2 dependiendo de r. Igualá S = I (usá $Y_2/(1+r) = 2I$).</li><li>CA = S − I evaluado en $r_W$. Como es creciente y vale 0 en r*, el signo sale solo.</li><li>Con gobierno: por equivalencia ricardiana, sólo importan G1 y G2.</li><li>Con riesgo: reemplazá $T_1 = G_1 - B$ y $T_2 = G_2 + (1+r_P)B$ en $S = S^P - B$; la firma usa $r_P$.</li><li>Valor presente de los impuestos con la tasa del consumidor: crece con B.</li></ol><div class="note"><span class="lbl">sobre esta solución</span>No hay solución oficial del TP 8. Está resuelto con el método y las cuentas del capítulo 6, que hace este mismo modelo con b = 1.</div>`,
        profe: [
          { t: 'Inciso 1 · Producción, inversión y ahorro', b: T`<p>$Y_1 = A_1$. De $\tfrac12 A_2K_2^{-1/2} = 1 + r$:</p>$$K_2(r) = I(r) = \left(\frac{A_2}{2(1+r)}\right)^2,\qquad Y_2 = A_2K_2^{1/2} = \frac{A_2^2}{2(1+r)}$$$$S(r) = Y_1 - \frac{1}{1+b}\left(Y_1 + \frac{Y_2}{1+r}\right) = \frac{b}{1+b}A_1 - \frac{A_2^2}{2(1+b)(1+r)^2}$$` },
          { t: 'Inciso 1 · Equilibrio', b: T`<p>Con $x = I(r)$, $\frac{Y_2}{1+r} = 2x$ y $S = \frac{bA_1 - 2x}{1+b}$. De $S = x$:</p>$$I^* = S^* = K_2^* = \frac{bA_1}{3+b},\qquad 1 + r^* = \frac{A_2}{2}\sqrt{\frac{3+b}{bA_1}}$$$$Y_2^* = A_2\sqrt{\frac{bA_1}{3+b}},\qquad C_1^* = \frac{3A_1}{3+b},\qquad C_2^* = b(1+r^*)C_1^*$$<p>Con b = 1 son las del capítulo: $1 + r^* = A_2/A_1^{1/2}$, $K_2^* = A_1/4$, $C_1^* = \frac34 A_1$.</p>` },
          { t: 'Inciso 2 · Cuenta corriente', b: T`$$CA(r_W) = S(r_W) - I(r_W) = \frac{b}{1+b}A_1 - \frac{3+b}{4(1+b)}\frac{A_2^2}{(1+r_W)^2}$$<p>Es creciente en $r_W$ y vale 0 en $r^*$. Si $r_W < r^*$: <b>CA &lt; 0</b>, déficit.</p>` },
          { t: 'Inciso 3 · Con gobierno', b: T`$$CA = \frac{b(A_1 - G_1)}{1+b} + \frac{G_2}{(1+b)(1+r_W)} - \frac{3+b}{4(1+b)}\frac{A_2^2}{(1+r_W)^2}$$<p>Sólo aparecen G1 y G2, no T1 ni B: equivalencia ricardiana.</p>` },
          { t: 'Inciso 4 · Con rP > rW', b: T`$$CA = \frac{b(A_1 - G_1)}{1+b} + \frac{G_2}{(1+b)(1+r_W)} + \frac{B(r_P - r_W)}{(1+b)(1+r_W)} - \frac{A_2^2}{2(1+b)(1+r_W)(1+r_P)} - \frac{A_2^2}{4(1+r_P)^2}$$<p>Si sube $r_P$: cae la inversión (último término), cae Y2 y sube el ahorro (penúltimo), y sube T2 por la deuda (tercero). <b>La CA sube.</b> Con b = 1 coincide con la fórmula del capítulo 6.</p>` },
          { t: 'Inciso 5 · Falla la equivalencia ricardiana', b: T`$$T_1 + \frac{T_2}{1+r_W} = G_1 + \frac{G_2}{1+r_W} + \frac{B(r_P - r_W)}{1+r_W}$$<p>Con $r_P > r_W$ el último término es positivo y crece con B. Para el mismo gasto, financiar con deuda baja la riqueza del consumidor: <b>prefiere estrictamente</b> que se financie con impuestos de hoy (B = 0).</p>` },
        ],
        errores: ['Usar la depreciación como 0: acá δ = 1, entonces I = K2 y el costo de uso es 1 + r.', 'Olvidarse de que Y2 depende de r al armar la curva de ahorro.', 'En el inciso 4, usar rW en la inversión de la firma: la firma paga rP.'],
        practice: { fixed: tp8Fixed, random: tp8Rand, build: tp8Build },
      },
    ],
  });
})();
