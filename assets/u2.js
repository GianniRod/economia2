/* Unidad 2 · Capítulo 3 · TP 3 y TP 4 */
(function () {
  const T = String.raw;
  const { f, ft, pct, rng, randInt, pick, table } = App.h;

  /* curva de oferta de trabajo que se dobla hacia atrás (estilizada) */
  App.W.backbend = (el) => {
    el.innerHTML = '<div class="widget-h"><span>Oferta de trabajo individual</span></div><div class="w-plot"></div>';
    const P = App.Plot({ w: 420, h: 280, xmin: 0, xmax: 12, ymin: 0, ymax: 10, xl: 'L (horas)', yl: 'w/P' }).axes();
    const pts = []; for (let i = 0; i <= 100; i++) { const w = 0.3 + (9.4 * i) / 100; pts.push([10 * (w / (w + 2)) * Math.exp(-Math.pow(Math.max(0, w - 5), 2) / 18) + 0.2, w]); }
    P.pts(pts, 'c-b');
    P.text(8.2, 3.5, 'domina el ES: pendiente +', 'lbl-b', 'start');
    P.text(5.1, 9.1, 'domina el EI: se dobla', 'lbl-r', 'start');
    P.text(pts[100][0], 9.7, 'Ls', 'lbl-b', 'end', -8, 0);
    el.querySelector('.w-plot').appendChild(P.svg);
  };

  /* ------------------------------------------------------------------ */
  /* TP 3 · Ejercicio 1 · variantes cualitativas consumo–ocio           */
  /* ------------------------------------------------------------------ */
  const OCIO_V = [
    { n: 'Una caída del salario nominal w', o: 'w=6', line: 'La ordenada (wN+B)/P baja y la pendiente −w/P se hace más chica en valor absoluto: la restricción <b>se contrae y se aplana</b>, rotando alrededor del punto de dotación (N, B/P).', es: 'El ocio se abarata (w/P ↓): sustituye consumo por ocio → c↓, o↑, l↓.', ei: 'Es más pobre (ingreso potencial ↓): con bienes normales baja todo → c↓, o↓, l↑.', et: 'c baja seguro; o y l dependen de qué efecto sea más grande.', rows: [['c', '↓', '↓', '↓'], ['o', '↑', '↓', '?'], ['l', '↓', '↑', '?']] },
    { n: 'Una caída del precio del consumo P', o: 'P=0.7', line: 'La ordenada (wN+B)/P sube y la pendiente −w/P se hace más empinada: la restricción <b>se expande y se empina</b>.', es: 'El ocio se encarece en términos de consumo (w/P ↑): c↑, o↓, l↑.', ei: 'Es más rico: c↑, o↑, l↓.', et: 'c sube seguro; o y l son ambiguos.', rows: [['c', '↑', '↑', '↑'], ['o', '↓', '↑', '?'], ['l', '↑', '↓', '?']] },
    { n: 'Una caída del ingreso no laboral B', o: 'B=0', line: 'w/P no cambia: la restricción <b>se desplaza en paralelo hacia abajo</b> (el tramo vertical en o = N se acorta).', es: 'No hay efecto sustitución: el precio relativo del ocio no cambió.', ei: 'Es más pobre: c↓, o↓ y por lo tanto l↑.', et: 'Igual al efecto ingreso.', rows: [['c', '=', '↓', '↓'], ['o', '=', '↓', '↓'], ['l', '=', '↑', '↑']] },
    { n: 'Una caída de las horas disponibles N', o: 'N=12', line: 'w/P no cambia: la restricción <b>se desplaza en paralelo hacia adentro</b> (el punto de dotación se corre a la izquierda).', es: 'No hay efecto sustitución.', ei: 'Es más pobre: c↓ y o↓. Para l: l = N − o; como c = (wl + B)/P y c baja, <b>l tiene que bajar</b>.', et: 'c↓, o↓, l↓.', rows: [['c', '=', '↓', '↓'], ['o', '=', '↓', '↓'], ['l', '=', '↓', '↓']] },
    { n: 'Un aumento de 100 % en P y de 100 % en w', o: 'P=2;w=20', line: 'w/P no cambia (2w/2P). La ordenada pasa a (2wN + B)/(2P) = (wN + B/2)/P, más baja si B > 0: la restricción <b>se desplaza en paralelo hacia abajo</b>, como una caída de B.', es: 'No hay efecto sustitución: w/P es el mismo.', ei: 'Con B > 0 el ingreso no laboral real B/P cae a la mitad: c↓, o↓, l↑. (Si B = 0 no cambia nada.)', et: 'Igual al efecto ingreso.', rows: [['c', '=', '↓', '↓'], ['o', '=', '↓', '↓'], ['l', '=', '↑', '↑']] },
  ];
  const ocioBuild = (v) => ({
    enun: `<p>Con el problema consumo–ocio del TP 3 (precio P, salario w, horas N, ingreso no laboral B), analizá: <b>${v.n}</b>.</p><ol><li>¿Cómo cambia la restricción presupuestaria?</li><li>Identificá el efecto sustitución, el efecto ingreso y el efecto total sobre c, o y l.</li><li>Graficalo.</li></ol>`,
    arrows: { cols: ['ES', 'EI', 'ET'], rows: v.rows },
    steps: [
      { t: 'Qué pasa con la restricción', b: `<p>Recordá: $c = \\frac{wN + B}{P} - \\frac{w}{P}\\,o$. ${v.line}</p>` },
      { t: 'Efecto sustitución', b: `<p>${v.es}</p>` },
      { t: 'Efecto ingreso', b: `<p>${v.ei}</p>` },
      { t: 'Efecto total y gráfico', b: `<p>${v.et}</p>` + table(['', 'ES', 'EI', 'ET'], v.rows) + `<div data-w="ocio" data-o="${v.o}"></div>` },
    ],
  });

  /* ------------------------------------------------------------------ */
  /* TP 3 · Ejercicio 2 · tabla de la firma                              */
  /* ------------------------------------------------------------------ */
  function firmL(p) { return p.K * Math.pow(((1 - p.a) * p.A * p.P) / p.w, 1 / p.a); }
  function firmBuild(p) {
    const Y = (L) => p.A * Math.pow(p.K, p.a) * Math.pow(L, 1 - p.a);
    const Ls = Math.round(firmL(p));
    const Ls5 = [-2, -1, 0, 1, 2].map((d) => Ls + d);
    const fn = p.a === 0.5 ? `Y = ${p.A === 1 ? '' : ft(p.A)}K^{1/2}L^{1/2}` : `Y = ${p.A === 1 ? '' : ft(p.A)}K^{1/3}L^{2/3}`;
    const fnK = p.a === 0.5 ? `Y(L) = ${ft(p.A * Math.sqrt(p.K), 4)}\\sqrt{L}` : `Y(L) = ${ft(p.A * Math.cbrt(p.K), 4)}\\,L^{2/3}`;
    const wp = p.w / p.P;
    const enun = `<p>Una firma tiene la función de producción $${fn}$, con $K = ${p.K}$ fijo (es suya, no paga por usarlo), $A = ${ft(p.A)}$, precio del bien $P = ${ft(p.P)}$ y salario nominal $w = ${ft(p.w, 4)}$.</p><ol><li>Completá la tabla de producto total, ingreso total, costo total y beneficio para L = ${Ls5.join(', ')}. ¿Qué L elige?</li><li>Completá la tabla de producto marginal, ingreso marginal, costo marginal y beneficio marginal. ¿Conviene contratar si PML &gt; w/P? ¿Y si PML &lt; w/P?</li><li>Graficá la elección óptima y argumentá que la demanda de trabajo es la curva de PML.</li></ol>`;
    const prof = (L) => p.P * Y(L) - p.w * L;
    const best = Ls5.reduce((b, L) => (prof(L) > prof(b) ? L : b), Ls5[0]);
    const rows1 = Ls5.map((L) => [L, f(Y(L), 5), f(p.P * Y(L), 5), f(p.w * L, 5), (L === best ? '<b>' : '') + f(prof(L), 5) + (L === best ? '</b>' : '')]);
    const rows2 = Ls5.map((L, i) => { if (i === 0) return [L, f(wp, 4), '', '', '', '']; const pm = Y(L) - Y(L - 1); return [L, f(wp, 4), f(pm, 5), f(p.P * pm, 5), f(p.w, 4), f(p.P * pm - p.w, 5)]; });
    const steps = [
      { t: 'Escribir las funciones con los datos', b: `<p>Reemplazando $K$ y $A$: $${fnK}$. Ingreso total $IT = P\\cdot Y$ y costo total $CT = w\\cdot L$ (el capital no se paga).</p>` },
      { t: 'Inciso 1 · Tabla de totales', b: table(['L', 'Producto total', 'Ingreso total', 'Costo total', 'Beneficio'], rows1) + `<p>El beneficio es máximo en <mark>L = ${best}</mark>.</p>` },
      { t: 'Inciso 2 · Tabla de marginales', b: `<p>Producto marginal de la unidad L: $Y(L) - Y(L-1)$. Ingreso marginal $= P\\cdot PML$, costo marginal $= w$.</p>` + table(['L', 'w/P', 'Producto marginal', 'Ingreso marginal', 'Costo marginal', 'Beneficio marginal'], rows2) + `<div class="note"><span class="lbl">conclusión</span>Mientras $PML > w/P$, contratar una unidad más suma beneficio (beneficio marginal positivo). Cuando $PML < w/P$, el costo de la unidad extra supera lo que genera: no conviene. La firma frena donde $PML = w/P$.</div>` },
      { t: 'Inciso 3 · Gráfico: la demanda es la PML', b: `<p>Para cada salario real, la firma elige el L donde $PML(L) = w/P$. Si cambiás w/P, el punto elegido recorre la curva de PML: <mark>la curva de PML es la demanda de trabajo</mark>. Como la PML es decreciente, la demanda tiene pendiente negativa.</p><p>Analíticamente: $PML = (1-\\alpha)AK^{\\alpha}L^{-\\alpha} = \\frac{w}{P} \\Rightarrow L^* = K\\left(\\frac{(1-\\alpha)AP}{w}\\right)^{1/\\alpha} = ${f(firmL(p), 2)}$.</p><div data-w="pml"></div>` },
    ];
    return { enun, steps };
  }
  const firmFixed = [{ A: 1, K: 100, P: 1, w: 0.5, a: 0.5 }, { A: 1, K: 64, P: 1, w: 0.4, a: 0.5 }, { A: 2, K: 50, P: 1, w: 1, a: 0.5 }, { A: 1, K: 144, P: 2, w: 1, a: 0.5 }, { A: 1.5, K: 100, P: 1, w: 1, a: 1 / 3 }];
  const firmRand = (R) => { const K = pick(R, [36, 49, 64, 81, 100, 121, 144]), A = pick(R, [1, 2]), P = pick(R, [1, 2]), m = pick(R, [0.8, 1, 1.25, 2]); return { A, K, P, w: (A * P) / (2 * m), a: 0.5 }; };

  /* ------------------------------------------------------------------ */
  /* TP 4 · Ejercicio 1 · equilibrio analítico                           */
  /* ------------------------------------------------------------------ */
  function eqBuild(p) {
    const a = p.a, b = 1 - a, aT = a === 1 / 3 ? '1/3' : '1/4', bT = a === 1 / 3 ? '2/3' : '3/4';
    const L = p.Ls, P = p.P;
    const wAdd = P * 0.5 / Math.sqrt(L);
    const wCD = (K) => P * 0.5 * Math.sqrt(K / L);
    const wC3 = (K) => P * b * Math.pow(K / L, a);
    const shAdd = (K) => (wAdd * L) / (P * (Math.sqrt(K) + Math.sqrt(L)));
    const enun = `<p>Tres funciones de producción:</p>$$Y = K^{1/2} + L^{1/2}\\qquad Y = K^{1/2}L^{1/2}\\qquad Y = K^{${aT}}L^{${bT}}$$<ol><li>Obtené la demanda de trabajo de cada una como función de w/P y K.</li><li>Con oferta inelástica $L^s = ${L}$, $K = ${p.K0}$ y $P = ${ft(P)}$, encontrá el salario nominal de equilibrio.</li><li>¿Qué pasa con la PML y el salario si el capital pasa a $K = ${p.K1}$?</li><li>Calculá la participación del trabajo $\\frac{wL}{PY}$ en cada caso.</li></ol>`;
    const steps = [
      { t: 'La regla de contratación', b: `<p>La firma contrata hasta que el ingreso marginal iguala al costo marginal: $P\\cdot PML = w \\Rightarrow PML = \\frac{w}{P}$.</p>` },
      { t: 'Inciso 1 · Demandas de trabajo', b: `<p><b>Aditiva:</b> $PML = \\tfrac12 L^{-1/2} = \\frac{w}{P} \\Rightarrow L^d = \\left(\\frac{P}{2w}\\right)^2$. <mark>No depende de K.</mark></p><p><b>Cobb-Douglas 1/2:</b> $PML = \\tfrac12 K^{1/2}L^{-1/2} = \\frac{w}{P} \\Rightarrow L^d = K\\left(\\frac{P}{2w}\\right)^2$.</p><p><b>Cobb-Douglas ${aT}:</b> $PML = ${a === 1 / 3 ? '\\tfrac23' : '\\tfrac34'}K^{${aT}}L^{-${aT}} = \\frac{w}{P} \\Rightarrow L^d = K\\left(\\frac{${a === 1 / 3 ? '2' : '3'}P}{${a === 1 / 3 ? '3' : '4'}w}\\right)^{${a === 1 / 3 ? '3' : '4'}}$.</p>` },
      { t: 'Inciso 2 · Salario de equilibrio con Ls = ' + L, b: `<p>Con oferta inelástica, el empleo es $L = ${L}$ y el salario sale de $w = P\\cdot PML(K, ${L})$:</p>` + table(['Función', 'Cuenta', 'w*'], [['K^½ + L^½', `${f(P)} · ½ · ${L}<sup>−½</sup>`, `<b>${f(wAdd, 4)}</b>`], ['K^½ L^½', `${f(P)} · ½ · (${p.K0}/${L})<sup>½</sup>`, `<b>${f(wCD(p.K0), 4)}</b>`], [`K^${aT} L^${bT}`, `${f(P)} · ${a === 1 / 3 ? '2/3' : '3/4'} · (${p.K0}/${L})<sup>${aT}</sup>`, `<b>${f(wC3(p.K0), 4)}</b>`]]) + (P === 1 ? '<p>Como P = 1, el salario nominal coincide con el real.</p>' : `<p>El salario real es w/P: dividí por ${f(P)}.</p>`) },
      { t: 'Inciso 3 · Sube el capital a K = ' + p.K1, b: table(['Función', 'w* con K = ' + p.K0, 'w* con K = ' + p.K1, 'Conclusión'], [['K^½ + L^½', f(wAdd, 4), f(wAdd, 4), 'No cambia: la PML no depende de K'], ['K^½ L^½', f(wCD(p.K0), 4), f(wCD(p.K1), 4), 'Sube: más K, más PML'], [`K^${aT} L^${bT}`, f(wC3(p.K0), 4), f(wC3(p.K1), 4), 'Sube']]) },
      { t: 'Inciso 4 · Participación del trabajo', b: `<p>En el óptimo $w/P = PML$, así que $\\frac{wL}{PY} = \\frac{PML\\cdot L}{Y}$.</p>` + table(['Función', 'K = ' + p.K0, 'K = ' + p.K1, 'Resultado'], [['K^½ + L^½', f(shAdd(p.K0), 4), f(shAdd(p.K1), 4), 'Depende de K'], ['K^½ L^½', '0,5', '0,5', 'Constante = 1 − α'], [`K^${aT} L^${bT}`, f(b, 4), f(b, 4), 'Constante = 1 − α']]) + `<div class="note"><span class="lbl">idea clave</span>Con Cobb-Douglas la participación del trabajo es siempre el exponente de L: $\\frac{wL}{PY} = 1 - \\alpha$.</div>` },
    ];
    return { enun, steps };
  }
  const eqFixed = [{ Ls: 100, K0: 100, K1: 110, P: 1, a: 1 / 3 }, { Ls: 64, K0: 100, K1: 144, P: 1, a: 1 / 3 }, { Ls: 100, K0: 81, K1: 121, P: 2, a: 1 / 4 }, { Ls: 49, K0: 64, K1: 100, P: 1, a: 1 / 4 }, { Ls: 144, K0: 100, K1: 125, P: 1, a: 1 / 3 }];
  const eqRand = (R) => ({ Ls: pick(R, [36, 49, 64, 81, 100, 121, 144]), K0: pick(R, [64, 81, 100]), K1: pick(R, [110, 121, 144, 169]), P: pick(R, [1, 1, 2]), a: pick(R, [1 / 3, 1 / 4]) });

  /* ------------------------------------------------------------------ */
  /* TP 4 · Ejercicio 2 · estática comparada                             */
  /* ------------------------------------------------------------------ */
  const SC_V = [
    { n: 'una caída del stock de capital (K1 < K0), con Y = AK^αL^(1−α)', o: 'K=70', rows: [['Producto Y', '↓'], ['Empleo L', '↓'], ['Salario real w/P', '↓'], ['Participación del trabajo wL/PY', '=']], why: 'Con menos K, cada L produce menos (la función de producción baja) y la PML cae: la demanda de trabajo se corre a la izquierda. Con la oferta igual, caen L y w/P. Y cae por los dos lados: menos K y menos L. La participación sigue siendo 1 − α.' },
    { n: 'una caída de la productividad A (por ejemplo, una sequía), con Cobb-Douglas', o: 'A=0.75', rows: [['Producto Y', '↓'], ['Empleo L', '↓'], ['Salario real w/P', '↓'], ['Participación del trabajo wL/PY', '=']], why: 'Una caída de A baja la producción para cada L y baja la PML = (1−α)AK^αL^−α. La demanda de trabajo se corre a la izquierda: caen L y w/P, y cae Y.' },
    { n: 'un aumento de la oferta de trabajo (más personas quieren trabajar a cada salario), con Cobb-Douglas', o: 'ls=1.4', rows: [['Producto Y', '↑'], ['Empleo L', '↑'], ['Salario real w/P', '↓'], ['Participación del trabajo wL/PY', '=']], why: 'La función de producción y la demanda no cambian. La oferta se corre a la derecha: el nuevo equilibrio tiene más L y menor w/P (nos movemos sobre la PML hacia abajo). Con más L, Y sube moviéndonos sobre la misma función de producción.' },
    { n: 'una caída de K con la función aditiva Y = A(K^α + L^(1−α))', o: 'add=1;K=70', rows: [['Producto Y', '↓'], ['Empleo L', '='], ['Salario real w/P', '='], ['Participación del trabajo wL/PY', '↑']], why: 'La función de producción baja en paralelo (cae la ordenada AK^α), pero la PML = (1−α)AL^−α no depende de K: la demanda de trabajo no se mueve. L y w/P quedan iguales; Y cae. Como wL no cambia y Y cae, la participación del trabajo sube.' },
    { n: 'un aumento de A con la función aditiva', o: 'add=1;A=1.3', rows: [['Producto Y', '↑'], ['Empleo L', '↑'], ['Salario real w/P', '↑'], ['Participación del trabajo wL/PY', '↑']], why: 'A multiplica todo, incluida la PML: la demanda de trabajo se corre a la derecha → suben L y w/P, y Y sube. La participación (1−α)L^(1−α)/(K^α + L^(1−α)) sube porque L sube.' },
  ];
  const scBuild = (v) => ({
    enun: `<p>Partiendo del equilibrio del mercado de trabajo, analizá gráficamente ${v.n}. ¿Qué pasa con el producto, el empleo, el salario real y la participación del trabajo?</p>`,
    arrows: { cols: ['Cambio'], rows: v.rows },
    steps: [
      { t: 'El razonamiento', b: `<p>${v.why}</p>` },
      { t: 'Resultado y gráfico', b: table(['Variable', 'Cambio'], v.rows) + `<div data-w="labor" data-o="${v.o}"></div>` },
    ],
  });

  /* ------------------------------------------------------------------ */
  App.UNITS.push({
    id: 'u2', n: 2, title: 'Mercado de trabajo', caps: 'Cap. 3', tps: 'TP 3 y 4',
    /* lección (1, 2, …) donde se enseña cada pregunta del quiz y cada fórmula, en el mismo orden: ordena el modo scroll */
    order: { q: [2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 2], f: [2, 2, 3, 3, 3, 3, 4, 4, 2] },
    blurb: 'Oferta de trabajo (consumo vs ocio), demanda de trabajo (PML = w/P), equilibrio, producto y distribución de la renta.',
    lessons: [
      {
        id: 'u2l1', t: 'Preferencias y elección óptima', d: 'Utilidad, curvas de indiferencia y tangencia.',
        cards: [
          { t: 'La función de utilidad ordena canastas', b: T`<p>$U(x, y)$ le da un número a cada canasta. Sólo importa el orden: más número, más preferida. Le pedimos que sea <b>creciente</b> en cada bien: si aumentás un bien y dejás el otro igual, la utilidad sube.</p><p>Una <b>curva de indiferencia</b> junta todas las canastas con la misma utilidad.</p><div class="ex"><span class="lbl">ejemplo del apunte</span>Con $U(x,y) = x^{1/2}y^{1/2}$, las canastas con utilidad 10 cumplen $x^{1/2}y^{1/2} = 10 \Rightarrow y = \frac{100}{x}$.</div>` },
          { t: 'Cómo son las curvas', b: T`<ul><li>Más lejos del origen = <b>más utilidad</b> (preferencias monótonas).</li><li>Son <b>convexas</b>: el individuo prefiere combinar bienes antes que gastar todo en uno. Eso evita soluciones de esquina.</li><li><b>No se cruzan</b> (si se cruzaran, una canasta tendría dos niveles de utilidad).</li></ul>` },
          { t: 'La restricción presupuestaria', b: T`$$p_x x + p_y y = m \quad\Rightarrow\quad y = \frac{m}{p_y} - \frac{p_x}{p_y}x$$<p>Corta el eje y en $m/p_y$ y el eje x en $m/p_x$. La pendiente es <mark>menos el precio relativo</mark> $-p_x/p_y$. Las canastas debajo de la recta también se pueden comprar, pero nunca son óptimas: sobraría plata.</p>` },
          { t: 'El óptimo es la tangencia', b: T`<p>El individuo elige el punto de la restricción que toca la curva de indiferencia más alta. Ahí la curva es <b>tangente</b> a la recta: la pendiente de la curva (la tasa marginal de sustitución) iguala el precio relativo.</p>$$TMS_{x,y} = \frac{p_x}{p_y}$$<p>Si en un punto la recta corta a la curva, hay otro punto sobre la recta con más utilidad: ese no era el óptimo.</p>`, q: { k: 'vf', q: 'En el óptimo, la curva de indiferencia corta a la restricción presupuestaria.', a: false, why: 'En el óptimo son tangentes. Si se cortan, moviéndote por la recta llegás a una curva más alta.' } },
        ],
      },
      {
        id: 'u2l2', t: 'Oferta de trabajo: consumo vs ocio', d: 'La restricción, el óptimo, ES y EI. Base del TP 3.',
        cards: [
          { t: 'El ocio es un bien más', b: T`<p>El individuo disfruta de consumir ($c$) y de tener tiempo libre ($o$): $U(c, o)$. Tiene $N$ horas: $N = l + o$. Con ingreso laboral $wl$ y no laboral $B$:</p>$$Pc = wl + B = w(N - o) + B \;\Rightarrow\; c = \frac{wN + B}{P} - \frac{w}{P}\,o$$<ul><li>Ordenada al origen: $\frac{wN + B}{P}$ (si trabajara las N horas).</li><li>Pendiente: $-\frac{w}{P}$: una hora más de ocio cuesta $w/P$ unidades de consumo. <mark>w/P es el precio del ocio.</mark></li><li>Punto de dotación: $(o, c) = (N, B/P)$: siempre puede no trabajar.</li></ul>` },
          { t: 'La elección óptima', b: T`<p>Como siempre: la tangencia entre la restricción y la curva de indiferencia más alta. El óptimo da $c^*$ y $o^*$, y de ahí $l^* = N - o^*$.</p>`, w: 'ocio' },
          { t: 'Efecto sustitución y efecto ingreso', b: T`<p>Cuando cambia un precio (w o P), pasan dos cosas a la vez:</p><ul><li><b>Efecto sustitución (ES):</b> cambió el precio relativo. Se consume más del bien que se abarató. Se mide manteniendo la utilidad inicial (criterio de <b>Hicks</b>): una recta con la pendiente nueva, tangente a la curva de indiferencia vieja (punto H).</li><li><b>Efecto ingreso (EI):</b> cambió el poder de compra. Con bienes normales, si es más rico consume más de los dos. Es el paso paralelo de H al óptimo final.</li></ul><table><tr><th>Sube w</th><th>c</th><th>o</th><th>l</th></tr><tr><td>ES (el ocio se encarece)</td><td>↑</td><td>↓</td><td>↑</td></tr><tr><td>EI (más rico)</td><td>↑</td><td>↑</td><td>↓</td></tr><tr><td>Total</td><td>↑</td><td>?</td><td>?</td></tr></table>` },
          { t: 'Probalo: subí el salario', b: T`<p>Mirá cómo la recta <b>rota sobre el punto de dotación</b> (N, B/P). Cambiá entre «ES domina» y «EI domina»: con las mismas restricciones, el ocio puede bajar o subir según las preferencias.</p>`, w: 'ocio', o: '1', q: { k: 'mc', q: 'Sube w y el individuo termina trabajando menos horas. ¿Qué pasó?', o: ['Domina el efecto sustitución', 'Domina el efecto ingreso', 'El ocio es un bien inferior', 'No puede pasar'], a: 1, why: 'El EI (más rico → más ocio) le ganó al ES (ocio más caro → menos ocio).' } },
          { t: 'Los cinco casos del TP 3', b: T`<table><tr><th>Cambio</th><th>La restricción</th><th>¿ES?</th><th>EI</th></tr><tr><td>Sube P</td><td>se contrae y se aplana (w/P ↓)</td><td>sí: el ocio se abarata</td><td>negativo</td></tr><tr><td>Sube w</td><td>se expande y se empina (w/P ↑)</td><td>sí: el ocio se encarece</td><td>positivo</td></tr><tr><td>P +200 % y w +100 %</td><td>se contrae y se aplana: $\frac{2w}{3P} < \frac{w}{P}$</td><td>sí, como subir P</td><td>negativo</td></tr><tr><td>Sube B</td><td>paralela hacia arriba</td><td>no</td><td>positivo</td></tr><tr><td>Sube N</td><td>paralela hacia afuera</td><td>no</td><td>positivo</td></tr></table><p>Cuando w/P no cambia, <mark>sólo hay efecto ingreso</mark>.</p>`, q: { k: 'mc', q: 'Si sube N (más horas disponibles) y c y o son normales, ¿qué pasa con las horas trabajadas?', o: ['Bajan', 'Suben', 'No cambian', 'Es ambiguo siempre'], a: 1, why: 'c sube; como c = (wl + B)/P, para consumir más tiene que trabajar más: l↑ (el profe lo marca en la solución).' } },
          { t: 'La curva de oferta de trabajo', b: T`<p>Para cada salario real, resolvemos el problema y anotamos $l^*$. Esa relación es la <b>oferta de trabajo</b>. Para salarios muy altos puede <b>doblarse hacia atrás</b> (domina el EI); en el curso usamos el tramo con pendiente positiva.</p>`, w: 'backbend', b2: T`<p>Un aumento <b>transitorio</b> del salario suele ser casi puro ES (trabajo más ahora). Uno <b>permanente</b> tiene más EI. La oferta <b>agregada</b> es la suma horizontal de las individuales y se mueve con el tamaño y la composición de la población y la tasa de participación.</p>` },
          { t: 'Ejemplo con cuentas', b: T`<p>Con $U(c,o) = c^{1/2} + o^{1/2}$, B = 0 y la restricción $c = \frac{w}{p}(N - o)$, reemplazás c en U y derivás respecto de o:</p>$$V(o) = \left(\tfrac{w}{p}(N - o)\right)^{1/2} + o^{1/2} \;\Rightarrow\; o^* = \frac{N}{\frac{w}{p} + 1},\qquad l^* = N\,\frac{w/p}{w/p + 1}$$<div class="ex"><span class="lbl">con números</span>N = 16, w/p = 3: $o^* = 16/4 = 4$ y $l^* = 12$. Si w/p sube a 7: $o^* = 2$, $l^* = 14$: acá domina el ES.</div>` },
        ],
      },
      {
        id: 'u2l3', t: 'Demanda de trabajo', d: 'Función de producción, PML y la regla PML = w/P.',
        cards: [
          { t: 'Función de producción y PML', b: T`<p>La firma combina capital K y trabajo L: $Y = F(K, L)$, creciente en los dos. El <b>producto marginal del trabajo</b> es cuánto agrega una unidad más de L:</p>$$PML = F(K, L+1) - F(K, L) \quad\to\quad PML = \frac{\partial F}{\partial L}$$<p>Es la <b>pendiente</b> de la función de producción. Suponemos que es <b>decreciente</b> (función cóncava): cada trabajador extra aporta menos, pero aporta.</p>` },
          { t: 'Contratar uno más, ¿conviene?', b: T`<p>Beneficio: $\pi = PF(K, L) - wL - rK$. Con K fijo, $rK$ es un costo fijo y no afecta la decisión. Contratar uno más conviene si:</p>$$P\,[F(K,L+1) - F(K,L)] > w \;\Leftrightarrow\; PML > \frac{w}{P}$$<p>Como la PML baja y $w/P$ no, en algún momento se igualan: la firma frena en <mark>PML = w/P</mark>.</p>`, w: 'pml' },
          { t: 'La demanda de trabajo ES la curva de PML', b: T`<p>Si cambia el salario real, la firma se mueve sobre su PML hasta el nuevo punto donde $PML = w/P$. Por eso <b>la curva de PML es la demanda de trabajo</b>, y tiene pendiente negativa porque la PML es decreciente.</p><p>La curva se corre si cambia algo que afecte la PML para cada L:</p><ul><li>Más de un factor <b>complementario</b> (más K con Cobb-Douglas): PML ↑.</li><li>Más de un factor <b>sustituto</b>: PML ↓.</li><li>Tecnología (A), regulaciones (indemnizaciones, aguinaldos), precios de factores complementarios.</li></ul>`, q: { k: 'vf', q: 'Con Y = K^½ L^½, un aumento de K corre la demanda de trabajo a la derecha.', a: true, why: 'PML = ½K^½L^−½ sube con K: para cada L el trabajo rinde más.' } },
          { t: 'Despejar la demanda (TP 4)', b: T`<p>Receta: escribí la PML, igualala a w/P y despejá L.</p><table><tr><th>Función</th><th>PML</th><th>Demanda $L^d$</th></tr><tr><td>$K^{1/2} + L^{1/2}$</td><td>$\frac12 L^{-1/2}$</td><td>$\left(\frac{P}{2w}\right)^2$ (no depende de K)</td></tr><tr><td>$K^{1/2}L^{1/2}$</td><td>$\frac12 K^{1/2}L^{-1/2}$</td><td>$K\left(\frac{P}{2w}\right)^2$</td></tr><tr><td>$K^{1/3}L^{2/3}$</td><td>$\frac23 K^{1/3}L^{-1/3}$</td><td>$K\left(\frac{2P}{3w}\right)^3$</td></tr></table><div class="ex"><span class="lbl">despeje paso a paso</span>$\frac12 K^{1/2}L^{-1/2} = \frac{w}{P} \Rightarrow L^{-1/2} = \frac{2w}{PK^{1/2}} \Rightarrow L^{1/2} = \frac{PK^{1/2}}{2w} \Rightarrow L = K\left(\frac{P}{2w}\right)^2$.</div>`, q: { k: 'mc', q: 'Con Y = K^½L^½, K = 100, P = 1 y w = 0,5, ¿cuánto trabajo demanda la firma?', o: ['50', '100', '200', '25'], a: 1, why: 'L = 100 · (1/(2·0,5))² = 100 · 1 = 100.' } },
        ],
      },
      {
        id: 'u2l4', t: 'Equilibrio, producto y distribución', d: 'Ls = Ld, Y = F(K, L*) y quién se lleva qué.',
        cards: [
          { t: 'El equilibrio fija L, w/P y el producto', b: T`<p>La oferta (del consumidor) y la demanda (la PML de la firma) se cruzan en $(w/P)^*$ y $L^*$. Con ese $L^*$ vas a la función de producción y leés $Y^* = F(K, L^*)$.</p><p>En este modelo hay <b>pleno empleo</b>: nadie que quiera trabajar a ese salario se queda sin trabajo.</p>`, w: 'labor' },
          { t: 'Distribución funcional de la renta', b: T`<p>El área bajo la PML hasta $L^*$ es el producto. El rectángulo $w\cdot L$ es lo que cobra el trabajo; el resto, $Y - wL$, es la retribución al capital.</p><p>Con Cobb-Douglas $Y = AK^{\alpha}L^{1-\alpha}$:</p>$$\frac{wL}{PY} = \frac{PML\cdot L}{Y} = \frac{(1-\alpha)AK^\alpha L^{-\alpha}\cdot L}{AK^\alpha L^{1-\alpha}} = 1 - \alpha$$<p>La participación del trabajo es <mark>constante e igual al exponente de L</mark>, pase lo que pase con K o A.</p>`, q: { k: 'mc', q: 'Con Y = K^{1/3}L^{2/3}, ¿qué parte del producto se lleva el trabajo?', o: ['1/3', '2/3', '1/2', 'Depende de K'], a: 1, why: 'Es 1 − α = 2/3.' } },
          { t: 'Estática comparada', b: T`<table><tr><th>Shock</th><th>Función de producción</th><th>Ld</th><th>L*</th><th>w/P*</th><th>Y*</th></tr><tr><td>K↑ (Cobb-Douglas)</td><td>sube y se empina</td><td>→ derecha</td><td>↑</td><td>↑</td><td>↑</td></tr><tr><td>A↑ (Cobb-Douglas)</td><td>sube y se empina</td><td>→ derecha</td><td>↑</td><td>↑</td><td>↑</td></tr><tr><td>K↑ (aditiva)</td><td>sube en paralelo</td><td>no se mueve</td><td>=</td><td>=</td><td>↑</td></tr><tr><td>A↑ (aditiva)</td><td>sube</td><td>→ derecha</td><td>↑</td><td>↑</td><td>↑</td></tr><tr><td>Oferta ↑ (más participación)</td><td>igual</td><td>igual</td><td>↑</td><td>↓</td><td>↑</td></tr></table><p>La aditiva $Y = A(K^\alpha + L^{1-\alpha})$ tiene ordenada al origen $AK^\alpha > 0$: produce aun sin trabajo. Su PML $(1-\alpha)AL^{-\alpha}$ no depende de K.</p>`, q: { k: 'vf', q: 'Con la función aditiva, un aumento del capital sube el salario real.', a: false, why: 'La PML no depende de K: la demanda de trabajo no se mueve, L y w/P quedan iguales. Sólo sube Y.' } },
          { t: 'Oferta inelástica: el salario lo fija la PML', b: T`<p>Si la oferta es vertical en $L^s$, el empleo es $L^s$ y el salario de equilibrio es la PML evaluada ahí:</p>$$\frac{w^*}{P} = PML(K, L^s)$$<div class="ex"><span class="lbl">TP 4</span>$L^s = K = 100$, P = 1. Aditiva: $w = \frac12\cdot 100^{-1/2} = 0{,}05$. Cobb-Douglas ½: $w = \frac12\sqrt{100/100} = 0{,}5$. Con ⅓: $w = \frac23 (100/100)^{1/3} = 0{,}67$. Si K pasa a 110: la aditiva sigue en 0,05; la ½ sube a $0{,}5\sqrt{1{,}1} = 0{,}524$; la ⅓ a $0{,}688$.</div>` },
        ],
      },
    ],
    quiz: [
      { k: 'vf', q: 'En la restricción c = (wN + B)/P − (w/P)·o, la pendiente es el precio del ocio en términos de consumo.', a: true, why: 'Una hora más de ocio significa resignar w/P unidades de consumo.' },
      { k: 'vf', q: 'Si sube el salario nominal, la restricción se desplaza en paralelo hacia arriba.', a: false, why: 'Rota alrededor del punto de dotación (N, B/P) y se vuelve más empinada.' },
      { k: 'mc', q: 'Sube el ingreso no laboral B. Con bienes normales:', o: ['c↑, o↓, l↑', 'c↑, o↑, l↓', 'c↓, o↑, l↓', 'Sólo hay efecto sustitución'], a: 1, why: 'Es puro efecto ingreso positivo: más de los dos bienes, y más ocio implica menos trabajo.' },
      { k: 'mc', q: 'P sube 200 % y w sube 100 %. ¿Qué pasa con w/P?', o: ['Sube', 'Baja: pasa a 2/3 del original', 'No cambia', 'Se duplica'], a: 1, why: 'w/P pasa a 2w/(3P), es decir 2/3 del original: el ocio se abarata.' },
      { k: 'vf', q: 'Ante un aumento del salario, el efecto sobre las horas trabajadas es ambiguo.', a: true, why: 'El ES aumenta l, el EI lo reduce: depende de cuál domine.' },
      { k: 'vf', q: 'El efecto sustitución de Hicks mantiene constante el ingreso nominal.', a: false, why: 'Mantiene constante la utilidad: la recta compensada es tangente a la curva de indiferencia inicial con la pendiente nueva.' },
      { k: 'mc', q: 'La firma contrata trabajo hasta que…', o: ['PML = 0', 'PML = w/P', 'Y es máximo', 'w/P = 1'], a: 1, why: 'Ingreso marginal P·PML igual al costo marginal w.' },
      { k: 'vf', q: 'Si PML > w/P, la firma debería despedir trabajadores.', a: false, why: 'Al revés: contratar uno más le suma beneficio. Despide si PML < w/P.' },
      { k: 'vf', q: 'La curva de demanda de trabajo tiene pendiente negativa porque la PML es decreciente.', a: true, why: 'Es la PML misma, y suponemos rendimientos marginales decrecientes.' },
      { k: 'mc', q: 'Con Y = K^½ + L^½, ¿de qué depende la demanda de trabajo?', o: ['De K y de w/P', 'Sólo de w/P', 'Sólo de K', 'De Y'], a: 1, why: 'PML = ½L^−½ no tiene K: L^d = (P/2w)².' },
      { k: 'mc', q: 'Con Y = K^½L^½, oferta inelástica L = 100, K = 100 y P = 1, el salario de equilibrio es:', o: ['0,05', '0,5', '1', '0,67'], a: 1, why: 'w = P·½·(K/L)^½ = 0,5.' },
      { k: 'vf', q: 'Con Cobb-Douglas, si aumenta K, aumenta la participación del trabajo en el ingreso.', a: false, why: 'Es constante e igual a 1 − α.' },
      { k: 'vf', q: 'La función aditiva Y = A(K^α + L^(1−α)) pasa por el origen.', a: false, why: 'Con L = 0 da AK^α > 0: tiene ordenada positiva.' },
      { k: 'mc', q: 'Aumenta la participación laboral femenina (oferta de trabajo ↑). Con Cobb-Douglas:', o: ['L↑, w/P↑, Y↑', 'L↑, w/P↓, Y↑', 'L↓, w/P↑, Y↓', 'Nada cambia'], a: 1, why: 'La oferta se corre a la derecha: nos movemos sobre la demanda hacia abajo.' },
      { k: 'vf', q: 'En este modelo puede haber desempleo involuntario en equilibrio.', a: false, why: 'Hay pleno empleo: quien quiere trabajar al salario vigente, trabaja.' },
      { k: 'vf', q: 'Un aumento transitorio del salario tiende a ser casi puro efecto sustitución.', a: true, why: 'No cambia mucho tu riqueza de largo plazo, así que el EI es chico.' },
    ],
    formulas: [
      { n: 'Restricción consumo–ocio', tex: T`c = \frac{wN + B}{P} - \frac{w}{P}\,o`, d: 'Ordenada (wN+B)/P, pendiente −w/P, dotación (N, B/P).' },
      { n: 'Tangencia', tex: T`TMS_{o,c} = \frac{w}{P}`, d: 'La curva de indiferencia toca la restricción.' },
      { n: 'Regla de contratación', tex: T`PML = \frac{\partial F}{\partial L} = \frac{w}{P}`, d: 'La demanda de trabajo es la curva de PML.' },
      { n: 'PML Cobb-Douglas', tex: T`PML = (1-\alpha)AK^{\alpha}L^{-\alpha}`, d: 'Sube con K y con A.' },
      { n: 'Demanda Cobb-Douglas', tex: T`L^d = K\left(\frac{(1-\alpha)A}{w/P}\right)^{1/\alpha}`, d: 'Para α = 1/2: K(P/2w)².' },
      { n: 'Demanda aditiva', tex: T`Y = K^{1/2} + L^{1/2} \Rightarrow L^d = \left(\frac{P}{2w}\right)^2`, d: 'No depende de K.' },
      { n: 'Salario con oferta inelástica', tex: T`\frac{w^*}{P} = PML(K, L^s)`, d: 'El empleo es L^s.' },
      { n: 'Participación del trabajo', tex: T`\frac{wL}{PY} = \frac{PML\cdot L}{Y} = 1 - \alpha`, d: 'Con Cobb-Douglas es constante.' },
      { n: 'Oferta con U = c^½ + o^½', tex: T`o^* = \frac{N}{w/p + 1},\quad l^* = N\frac{w/p}{w/p + 1}`, d: 'Ejemplo con cálculo del capítulo 3.' },
    ],
    exercises: [
      {
        id: 'tp3e1', tp: 'TP 3', num: 1, title: 'Oferta de trabajo: cambios en la elección consumo–ocio', sum: 'Restricción presupuestaria, óptimo y efecto sustitución e ingreso en cinco casos.',
        consigna: T`<p>Un individuo decide cuánto consumir y cuántas horas dedicar al ocio. El precio del bien es P, el salario nominal w, las horas disponibles N y el ingreso no laboral B.</p><ol><li>Graficá la restricción presupuestaria e identificá la elección óptima.</li><li>Indicá gráficamente cómo cambia la elección óptima ante: un aumento de P; un aumento de w; un aumento de 200 % en P y de 100 % en w; un aumento de B; un aumento de N.</li><li>Identificá en cada caso el efecto sustitución y el efecto ingreso.</li></ol>`,
        plan: T`<p><b>La receta para cada caso:</b></p><ol><li>Mirá qué pasa con la <b>ordenada</b> $(wN + B)/P$: ¿sube o baja? Eso te dice el signo del <b>efecto ingreso</b>.</li><li>Mirá qué pasa con la <b>pendiente</b> $w/P$: si cambia, hay <b>efecto sustitución</b>. Si w/P sube, el ocio se encarece (o↓ por ES); si baja, se abarata (o↑ por ES).</li><li>Armá la tabla ES / EI / ET para c, o y l. Donde ES y EI van en direcciones opuestas, el total es «?».</li><li>Recordá: l = N − o, así que l siempre va al revés que o (salvo que cambie N).</li></ol>`,
        profe: [
          { t: 'Inciso 1 · La restricción', b: T`$$Pc = wl + B,\quad l = N - o \;\Rightarrow\; c = \frac{wN + B}{P} - \frac{w}{P}\,o$$<p>Ordenada al origen: $(wN + B)/P$. Pendiente: $-w/P$. En $(o^*, c^*)$ la curva de indiferencia es tangente a la restricción.</p><div data-w="ocio"></div>` },
          { t: 'Aumento de P', b: T`<p>$P\uparrow \Rightarrow \frac{wN+B}{P}\downarrow$ (efecto ingreso negativo) y $\frac{w}{P}\downarrow$ (el ocio se abarata). La restricción <b>se contrae y se aplana</b>.</p><table><tr><th></th><th>ES</th><th>EI</th><th>ET</th></tr><tr><td>c</td><td>↓</td><td>↓</td><td>↓</td></tr><tr><td>o</td><td>↑</td><td>↓</td><td>?</td></tr><tr><td>l</td><td>↓</td><td>↑</td><td>?</td></tr></table><p>En el gráfico del profe domina el ES: $o' > o^*$, $l' < l^*$.</p><div data-w="ocio" data-o="0"></div>` },
          { t: 'Aumento de w', b: T`<p>$w\uparrow \Rightarrow \frac{wN+B}{P}\uparrow$ (EI positivo) y $\frac{w}{P}\uparrow$ (el ocio se encarece). La restricción <b>se expande y se empina</b>.</p><table><tr><th></th><th>ES</th><th>EI</th><th>ET</th></tr><tr><td>c</td><td>↑</td><td>↑</td><td>↑</td></tr><tr><td>o</td><td>↓</td><td>↑</td><td>?</td></tr><tr><td>l</td><td>↑</td><td>↓</td><td>?</td></tr></table><p>Caso ilustrado: $|ES| > |EI|$, entonces $o' < o^*$ y $l' > l^*$.</p><div data-w="ocio" data-o="1"></div>` },
          { t: 'P +200 % y w +100 %', b: T`<p>$P' = 3P$, $w' = 2w$:</p>$$\frac{2wN + B}{3P} < \frac{wN + B}{P}\ (\text{EI negativo})\qquad \frac{2w}{3P} < \frac{w}{P}\ (\text{el ocio se abarata})$$<p>La restricción se contrae y se aplana, <mark>igual que ante un aumento de P</mark>. Misma tabla: c ↓↓↓; o ↑↓?; l ↓↑?.</p><div data-w="ocio" data-o="2"></div>` },
          { t: 'Aumento de B', b: T`<p>$B\uparrow \Rightarrow$ la ordenada sube, w/P no cambia: desplazamiento <b>paralelo</b> hacia arriba. Sólo efecto ingreso.</p><table><tr><th></th><th>ES</th><th>EI</th><th>ET</th></tr><tr><td>c</td><td>–</td><td>↑</td><td>↑</td></tr><tr><td>o</td><td>–</td><td>↑</td><td>↑</td></tr><tr><td>l</td><td>–</td><td>↓</td><td>↓</td></tr></table><div data-w="ocio" data-o="3"></div>` },
          { t: 'Aumento de N', b: T`<p>$N\uparrow \Rightarrow$ la ordenada sube, w/P no cambia: desplazamiento paralelo hacia afuera. Sólo efecto ingreso: c↑ y o↑.</p><p>En principio $\Delta l = \Delta N - \Delta o$ es indeterminado. Pero si c y o son normales, para aumentar el consumo <b>necesariamente debe aumentar el trabajo</b>: l↑. El ocio, el consumo y las horas trabajadas aumentan.</p><div data-w="ocio" data-o="4"></div>` },
        ],
        errores: ['Dibujar la suba de w como un desplazamiento paralelo: rota sobre el punto de dotación (N, B/P).', 'Poner efecto sustitución cuando w/P no cambia (casos B y N).', 'Olvidarse de que l va al revés que o.', 'Dar un signo definido al efecto total sobre o cuando ES y EI se oponen.'],
        practice: { fixed: OCIO_V, build: ocioBuild },
      },
      {
        id: 'tp3e2', tp: 'TP 3', num: 2, title: 'Demanda de trabajo de una firma', sum: 'Tablas de totales y marginales, y por qué la demanda de trabajo es la PML.',
        consigna: T`<p>Una firma tiene $Y = AK^{1/2}L^{1/2}$ con P = 1, w = 0,5, A = 1 y K = 100 fijo (es dueña del capital y no paga por usarlo).</p><ol><li>Completá la tabla de producto total, ingreso total, costo total y beneficio para L = 98, …, 102. ¿Qué L maximiza beneficios?</li><li>Completá la tabla de salario real, producto marginal, ingreso marginal, costo marginal y beneficio marginal. ¿Conviene contratar si PML &gt; w/P? ¿Y si PML &lt; w/P?</li><li>Representá la elección óptima y argumentá que la demanda de trabajo es la curva de PML.</li></ol>`,
        plan: T`<ol><li>Reemplazá los datos: con A = 1 y K = 100, $Y = 10\sqrt{L}$.</li><li>Ingreso total $= P\cdot Y$, costo total $= wL$, beneficio = IT − CT. Buscá el máximo.</li><li>Producto marginal de la fila L: $Y(L) - Y(L-1)$. Ingreso marginal $= P\cdot PML$. Costo marginal $= w$. Beneficio marginal = la resta.</li><li>Fijate dónde el beneficio marginal cambia de signo: ese es el óptimo.</li><li>Inciso 3: dibujá la PML decreciente y la recta horizontal w/P. El cruce es L*. Si movés w/P, L* recorre la PML.</li></ol>`,
        profe: [
          { t: 'Inciso 1 · Funciones', b: T`<p>Con A = 1 y K = 100: $Y(L) = 10\sqrt L$, $IT(L) = 10\sqrt L$, $CT(L) = 0{,}5L$.</p>` },
          { t: 'Inciso 1 · Tabla de totales', b: T`<table><tr><th>L</th><th>Producto</th><th>Ingreso</th><th>Costo</th><th>Beneficio</th></tr><tr><td>98</td><td>98,99495</td><td>98,99495</td><td>49</td><td>49,99495</td></tr><tr><td>99</td><td>99,49874</td><td>99,49874</td><td>49,5</td><td>49,99874</td></tr><tr><td>100</td><td>100</td><td>100</td><td>50</td><td><b>50</b></td></tr><tr><td>101</td><td>100,49876</td><td>100,49876</td><td>50,5</td><td>49,99876</td></tr><tr><td>102</td><td>100,99505</td><td>100,99505</td><td>51</td><td>49,99505</td></tr></table><p>La empresa maximiza beneficios contratando <b>L = 100</b>.</p>` },
          { t: 'Inciso 2 · Tabla de marginales', b: T`<table><tr><th>L</th><th>w/P</th><th>PMg</th><th>IMg</th><th>CMg</th><th>BMg</th></tr><tr><td>98</td><td>0,5</td><td></td><td></td><td></td><td></td></tr><tr><td>99</td><td>0,5</td><td>0,50379</td><td>0,50379</td><td>0,5</td><td>0,00379</td></tr><tr><td>100</td><td>0,5</td><td>0,50126</td><td>0,50126</td><td>0,5</td><td>0,00126</td></tr><tr><td>101</td><td>0,5</td><td>0,49876</td><td>0,49876</td><td>0,5</td><td>−0,00124</td></tr><tr><td>102</td><td>0,5</td><td>0,49629</td><td>0,49629</td><td>0,5</td><td>−0,00371</td></tr></table><p>La empresa contrata mientras <b>PML &gt; w/P</b>. Cuando PML &lt; w/P, el costo de una unidad extra supera el ingreso que genera y no conviene.</p>` },
          { t: 'Inciso 3 · Gráfico', b: T`<p>Para cada salario real, la empresa elige el L donde $PML = w/P$: su demanda de trabajo es la curva de PML.</p><div data-w="pml"></div>` },
        ],
        errores: ['Calcular el producto marginal como Y(L+1) − Y(L) y desfasar la tabla: el profe usa Y(L) − Y(L−1) en la fila L.', 'Restar el costo del capital: en este ejercicio la firma no lo paga.', 'Comparar la PML con w en vez de con w/P cuando P ≠ 1.'],
        practice: { fixed: firmFixed, random: firmRand, build: firmBuild },
      },
      {
        id: 'tp4e1', tp: 'TP 4', num: 1, title: 'Equilibrio en el mercado de trabajo: solución analítica', sum: 'Demandas de trabajo, salario con oferta inelástica, cambio de K y participación laboral.',
        consigna: T`<ol><li>Obtené la demanda de trabajo en función de w/P y K para: $Y = K^{1/2} + L^{1/2}$ (PML = ½L^−½), $Y = K^{1/2}L^{1/2}$ (PML = ½K^½L^−½) y $Y = K^{1/3}L^{2/3}$ (PML = ⅔K^⅓L^−⅓).</li><li>Con oferta completamente inelástica $L^s = 100$, K = 100 y P = 1, encontrá el salario nominal de equilibrio.</li><li>¿Qué pasa con la PML y el salario si K = 110?</li><li>Encontrá la participación del trabajo $wL/PY$ para cada función.</li></ol>`,
        plan: T`<ol><li><b>Regla:</b> $PML = w/P$. Igualá y despejá L (elevá a la potencia que haga falta).</li><li><b>Oferta inelástica:</b> L ya es dato. Reemplazá L y K en la PML: $w = P\cdot PML(K, L^s)$.</li><li><b>K nuevo:</b> repetí la cuenta. En la aditiva no cambia nada porque K no está en la PML.</li><li><b>Participación:</b> $\frac{wL}{PY}$ con el w del inciso 2 y el Y de la función. En Cobb-Douglas da el exponente de L.</li></ol>`,
        profe: [
          { t: 'La condición de contratación', b: T`<p>Las firmas contratan hasta igualar ingreso marginal y costo marginal: $P\cdot PML = w \Rightarrow PML = \frac{w}{P}$. La productividad de una hora más debe igualar el salario real que cuesta.</p>` },
          { t: 'Primera función: aditiva', b: T`$$\tfrac12 L^{-1/2} = \frac{w}{P} \Rightarrow L^d = \left(\frac{P}{2w}\right)^2$$<p>La demanda de trabajo <b>no depende del stock de capital</b> en esta tecnología aditiva.</p>` },
          { t: 'Segunda y tercera: Cobb-Douglas', b: T`$$\tfrac12 K^{1/2}L^{-1/2} = \frac{w}{P} \Rightarrow L^d = K\left(\frac{P}{2w}\right)^2\qquad \tfrac23 K^{1/3}L^{-1/3} = \frac{w}{P} \Rightarrow L^d = K\left(\frac{2P}{3w}\right)^3$$<p>Un mayor K eleva la PML y la demanda; en ambas la demanda aumenta proporcionalmente con K.</p>` },
          { t: 'Inciso 2 · Salario de equilibrio', b: T`<p>En equilibrio $L^d = L^s = 100$:</p><table><tr><th>Función</th><th>Condición con L = K = 100</th><th>w*</th></tr><tr><td>$K^{1/2}+L^{1/2}$</td><td>$\frac12(100)^{-1/2} = w$</td><td>0,05</td></tr><tr><td>$K^{1/2}L^{1/2}$</td><td>$\frac12(100)^{1/2}(100)^{-1/2} = w$</td><td>0,5</td></tr><tr><td>$K^{1/3}L^{2/3}$</td><td>$\frac23(100)^{1/3}(100)^{-1/3} = w$</td><td>≃ 0,67</td></tr></table><p>Como P = 1, el salario nominal coincide con el real.</p>` },
          { t: 'Inciso 3 · K = 110', b: T`<table><tr><th>Función</th><th>K = 100</th><th>K = 110</th><th>Conclusión</th></tr><tr><td>aditiva</td><td>0,05</td><td>0,05</td><td>No cambia: la PML no depende de K</td></tr><tr><td>½, ½</td><td>0,5</td><td>$\sqrt{11/40} = 0{,}524$</td><td>Aumenta</td></tr><tr><td>⅓, ⅔</td><td>0,667</td><td>$(44/135)^{1/3} = 0{,}688$</td><td>Aumenta</td></tr></table>` },
          { t: 'Inciso 4 · Participación laboral', b: T`<p>En el óptimo $w/P = PML$, así que $\frac{wL}{PY} = \frac{PML\cdot L}{Y}$.</p><table><tr><th>Función</th><th>K = 100</th><th>K = 110</th><th>Resultado</th></tr><tr><td>aditiva</td><td>$\frac{0{,}05\cdot 100}{\sqrt{100}+\sqrt{100}} = 0{,}25$</td><td>$\frac{0{,}05\cdot 100}{\sqrt{110}+\sqrt{100}} = 0{,}244$</td><td>Depende de K</td></tr><tr><td>½, ½</td><td>0,5</td><td>0,5</td><td>Constante</td></tr><tr><td>⅓, ⅔</td><td>⅔</td><td>⅔</td><td>Constante</td></tr></table>` },
        ],
        errores: ['Despejar mal los exponentes: si te queda $L^{-1/2}$, invertí y elevá al cuadrado con cuidado.', 'En la aditiva, decir que el salario sube con K.', 'Con P ≠ 1, olvidarse de multiplicar por P para obtener el salario nominal.'],
        practice: { fixed: eqFixed, random: eqRand, build: eqBuild },
      },
      {
        id: 'tp4e2', tp: 'TP 4', num: 2, title: 'Equilibrio en el mercado de trabajo: estática comparada', sum: 'Gráficos de producción y mercado de trabajo ante más capital, más tecnología y producción aditiva.',
        consigna: T`<p>Se produce con $Y = AK^{\alpha}L^{1-\alpha}$, $A > 0$, $0 < \alpha < 1$, capital inicial $K_0$ y $PML = (1-\alpha)AK^\alpha L^{-\alpha}$.</p><ol><li>Graficá el producto como función del trabajo y justificá su forma.</li><li>Graficá el equilibrio inicial en el mercado de trabajo.</li><li>El capital aumenta a $K_1 > K_0$: graficá la nueva función de producción y el nuevo equilibrio.</li><li>Además hay un avance tecnológico (A sube): graficá de nuevo.</li><li>Con $Y = A(K^\alpha + L^{1-\alpha})$ y $PML = (1-\alpha)AL^{-\alpha}$, ¿cómo cambia el análisis?</li></ol>`,
        plan: T`<ol><li><b>Forma de Y(L):</b> pasa por el origen (L = 0 ⇒ Y = 0), es creciente (PML &gt; 0) y cóncava (PML decreciente).</li><li><b>Equilibrio:</b> la demanda es la PML (decreciente); la oferta, la del problema del consumidor (creciente, puede doblarse).</li><li><b>Para cada shock</b> preguntate: ¿cambia la función de producción? ¿cambia la PML para cada L? Si cambia la PML, se mueve la demanda de trabajo.</li><li>Leé el nuevo L* en el mercado de trabajo y llevalo a la nueva función de producción para leer Y*.</li></ol>`,
        profe: [
          { t: 'Inciso 1 · La forma de la función', b: T`<ul><li>Si L = 0, Y = 0: la curva parte del origen.</li><li>PML &gt; 0: la producción aumenta con el trabajo.</li><li>La PML disminuye con L: la producción crece a una tasa cada vez menor.</li></ul><p>La función es <b>creciente y cóncava</b>.</p>` },
          { t: 'Inciso 2 · Equilibrio inicial', b: T`<p>La demanda inversa sale de la condición de contratación: $\frac{w}{P} = PML = (1-\alpha)AK^\alpha L^{-\alpha}$, decreciente en L. La oferta aumenta con el salario real cuando domina el ES y puede doblarse hacia atrás cuando domina el EI.</p><div data-w="labor"></div>` },
          { t: 'Inciso 3 · Aumento del capital', b: T`<p>Para cada nivel de trabajo aumenta la producción, aumenta la PML y la demanda laboral se desplaza hacia afuera.</p><p><b>Resultado:</b> $Y_1 > Y_0$, $L^*_1 > L^*_0$ y $(w/P)^*_1 > (w/P)^*_0$.</p><div data-w="labor" data-o="K=140"></div>` },
          { t: 'Inciso 4 · Capital y tecnología', b: T`<p>Un aumento adicional de A vuelve a elevar el producto para cada L, la PML y la demanda de trabajo:</p>$$Y^*_2 > Y^*_1 > Y^*_0,\quad L^*_2 > L^*_1 > L^*_0,\quad (w/P)^*_2 > (w/P)^*_1 > (w/P)^*_0$$<div data-w="labor" data-o="K=140;A=1.3"></div>` },
          { t: 'Inciso 5 · Producción aditiva', b: T`<ul><li>Con L = 0, $Y = AK^\alpha > 0$: ordenada positiva. El capital permite producir aun sin trabajo.</li><li>Un aumento de K desplaza la producción hacia arriba, pero $PML = (1-\alpha)AL^{-\alpha}$ no depende de K: $L^*_1 = L^*_0$ y $(w/P)^*_1 = (w/P)^*_0$.</li><li>Un aumento de A eleva tanto la producción como la PML: la demanda se desplaza hacia afuera, $L^*_2 > L^*_1 = L^*_0$ y $(w/P)^*_2 > (w/P)^*_1 = (w/P)^*_0$.</li></ul><div data-w="labor" data-o="add=1;K=140"></div>` },
        ],
        errores: ['Dibujar la aditiva saliendo del origen.', 'Mover la demanda de trabajo ante un cambio de K en la aditiva.', 'Leer Y* en la función de producción vieja en vez de la nueva.'],
        practice: { fixed: SC_V, build: scBuild },
      },
    ],
  });
})();
