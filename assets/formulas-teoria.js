/* Explicación desplegable de cada fórmula ($$…$$) de las tarjetas de teoría.
   Clave: el TeX exacto de la fórmula en u1.js ... u5.js (si cambiás la fórmula, cambiá la clave).
   p: la fórmula dicha en palabras · s: símbolos [símbolo, qué es] */
(function () {
  const T = String.raw;
  App.FXT = {
    /* ---------------- Unidad 1 ---------------- */
    [T`K_{t+1} = K_t + I_t - \delta K_t`]: {
      p: 'El capital del año que viene es el capital que hay hoy, más la inversión del año, menos la parte del capital que se gastó (depreciación).',
      s: [[T`$K_{t+1}$`, 'stock de capital del período siguiente'], [T`$K_t$`, 'stock de capital de hoy'], [T`$I_t$`, 'inversión del período (flujo que entra)'], [T`$\delta$`, 'tasa de depreciación: qué fracción del capital se gasta por período'], [T`$\delta K_t$`, 'depreciación: capital que se pierde (flujo que sale)']],
    },
    [T`g = \frac{X_{t+1} - X_t}{X_t}\cdot 100`]: {
      p: 'La tasa de crecimiento es cuánto cambió la variable (valor nuevo menos valor viejo), dividido por el valor viejo, y multiplicado por 100 para expresarlo en porcentaje.',
      s: [[T`$g$`, 'tasa de crecimiento, en %'], [T`$X_t$`, 'valor de la variable en el período de partida'], [T`$X_{t+1}$`, 'valor de la variable en el período siguiente'], [T`$\cdot 100$`, 'pasa el resultado a porcentaje']],
    },
    [T`TCA = (1+g_1)(1+g_2)\cdots(1+g_n) - 1 \quad > \quad g_1 + g_2 + \dots + g_n`]: {
      p: 'La tasa acumulada se obtiene multiplicando los factores (1 + tasa) de cada año y restando 1. Siempre da más que sumar las tasas, porque cada año se crece sobre lo que ya se había crecido.',
      s: [[T`$TCA$`, 'tasa de crecimiento acumulada de todo el período'], [T`$g_1, g_2, \dots, g_n$`, 'tasa de crecimiento de cada año (en decimales)'], [T`$1+g$`, 'factor de crecimiento: por cuánto se multiplica la variable ese año'], [T`$\cdots$`, 'y así sucesivamente hasta el último año'], [T`$n$`, 'cantidad de años']],
    },
    [T`1 + g_{V} = (1+g_P)(1+g_Q) \;\Rightarrow\; g_V = g_P + g_Q + g_P\cdot g_Q`]: {
      p: 'Como el valor es precio por cantidad, su factor de crecimiento es el producto de los factores del precio y de la cantidad. Desarrollando: la tasa del valor es la suma de las dos tasas más el producto de ambas.',
      s: [[T`$g_V$`, 'tasa de crecimiento del valor $V = P\cdot Q$'], [T`$g_P$`, 'tasa de crecimiento del precio'], [T`$g_Q$`, 'tasa de crecimiento de la cantidad'], [T`$g_P\cdot g_Q$`, 'término cruzado: lo que se pierde si sólo sumás las tasas'], [T`$\Rightarrow$`, '«por lo tanto»']],
    },
    [T`1 + g_{V/N} = \frac{1+g_V}{1+g_N} \;\Rightarrow\; g_{V/N} \approx g_V - g_N`]: {
      p: 'El factor de crecimiento de una variable por habitante es el factor del total dividido por el factor de la población. Aproximadamente, la tasa por habitante es la tasa del total menos la tasa de la población.',
      s: [[T`$g_{V/N}$`, 'tasa de crecimiento por habitante'], [T`$g_V$`, 'tasa de crecimiento del total'], [T`$g_N$`, 'tasa de crecimiento de la población'], [T`$\approx$`, '«aproximadamente igual» (funciona bien con tasas chicas)']],
    },
    [T`Y = C + I + G + (X - M)`]: {
      p: 'El PBI es la suma de todo lo que se gasta en bienes finales: lo que consumen los hogares, lo que invierten las empresas, lo que compra el gobierno y lo que se exporta, menos lo que se importa (porque no se produjo en el país).',
      s: [[T`$Y$`, 'PBI (producto bruto interno)'], [T`$C$`, 'consumo de los hogares'], [T`$I$`, 'inversión bruta'], [T`$G$`, 'gasto del gobierno en bienes y servicios (sin transferencias)'], [T`$X$`, 'exportaciones'], [T`$M$`, 'importaciones'], [T`$X - M$`, 'exportaciones netas']],
    },
    [T`IBI = w\cdot L + r\cdot K + \text{Beneficios} \qquad INI = IBI - \delta K`]: {
      p: 'El ingreso bruto interno es lo que cobran los trabajadores (salario por cantidad de trabajo), más lo que cobra el capital (su retribución por la cantidad de capital), más los beneficios de las empresas. Si le restás la depreciación, queda el ingreso neto interno.',
      s: [[T`$IBI$`, 'ingreso bruto interno'], [T`$w$`, 'salario por unidad de trabajo'], [T`$L$`, 'cantidad de trabajo'], [T`$r$`, 'retribución por unidad de capital'], [T`$K$`, 'cantidad de capital'], ['Beneficios', 'ganancias de las empresas'], [T`$INI$`, 'ingreso neto interno'], [T`$\delta K$`, 'depreciación: capital gastado en el período']],
    },
    [T`PBI\ \text{real}_t = \sum_i p^{t_0}_i\, q^t_i`]: {
      p: 'El PBI real del año t es la suma, sobre todos los bienes, de la cantidad producida ese año de cada bien multiplicada por su precio en el año base.',
      s: [[T`$PBI\ \text{real}_t$`, 'PBI del año t valuado a precios del año base'], [T`$\sum_i$`, 'sumar sobre todos los bienes i'], [T`$p^{t_0}_i$`, 'precio del bien i en el año base $t_0$'], [T`$q^t_i$`, 'cantidad producida del bien i en el año t']],
    },
    [T`\text{Deflactor}_t = \frac{\sum p^t_i q^t_i}{\sum p^{t_0}_i q^t_i}\cdot 100 = \frac{PBI\ \text{nominal}_t}{PBI\ \text{real}_t}\cdot 100`]: {
      p: 'El deflactor es lo que vale la producción del año t a precios de ese año, dividido por lo que valdría esa misma producción a precios del año base, por 100. Es decir, PBI nominal sobre PBI real, por 100.',
      s: [[T`$\text{Deflactor}_t$`, 'índice de precios de lo producido en el año t (vale 100 en el año base)'], [T`$p^t_i$`, 'precio del bien i en el año t'], [T`$p^{t_0}_i$`, 'precio del bien i en el año base'], [T`$q^t_i$`, 'cantidad producida del bien i en el año t'], [T`$PBI\ \text{nominal}_t$`, 'PBI a precios del mismo año'], [T`$PBI\ \text{real}_t$`, 'PBI a precios del año base']],
    },
    [T`IPC_t = \frac{\sum p^t_i\, \bar q_i}{\sum p^{t_0}_i\, \bar q_i}\cdot 100`]: {
      p: 'El IPC del año t es cuánto cuesta la canasta fija a precios de ese año, dividido por cuánto costaba la misma canasta en el año base, por 100.',
      s: [[T`$IPC_t$`, 'índice de precios al consumidor del año t'], [T`$\bar q_i$`, 'cantidad fija del bien i en la canasta (la barra indica que no cambia)'], [T`$p^t_i$`, 'precio del bien i en el año t'], [T`$p^{t_0}_i$`, 'precio del bien i en el año base'], [T`$\sum$`, 'sumar sobre todos los bienes de la canasta']],
    },
    [T`V^{t}_{\text{en pesos de } b} = V^t\cdot \frac{IPC_b}{IPC_t}`]: {
      p: 'Para pasar un valor del año t a pesos del año b, se lo multiplica por el índice del año b y se lo divide por el índice del año t.',
      s: [[T`$V^t$`, 'valor en pesos del año t (el dato que tenés)'], [T`$V^{t}_{\text{en pesos de } b}$`, 'ese mismo valor expresado en pesos del año b'], [T`$IPC_b$`, 'índice del año al que lo querés llevar'], [T`$IPC_t$`, 'índice del año del dato']],
    },

    /* ---------------- Unidad 2 ---------------- */
    [T`p_x x + p_y y = m \quad\Rightarrow\quad y = \frac{m}{p_y} - \frac{p_x}{p_y}x`]: {
      p: 'Lo que se gasta en x más lo que se gasta en y es igual al ingreso. Despejando y: la cantidad de y que se puede comprar es todo el ingreso en unidades de y, menos lo que se resigna de y por cada unidad de x (el precio relativo).',
      s: [[T`$p_x, p_y$`, 'precios de los bienes x e y'], [T`$x, y$`, 'cantidades de cada bien'], [T`$m$`, 'ingreso'], [T`$m/p_y$`, 'ordenada al origen: cuánto y se compra si x = 0'], [T`$p_x/p_y$`, 'pendiente (precio relativo): cuánto y cuesta una unidad de x']],
    },
    [T`TMS_{x,y} = \frac{p_x}{p_y}`]: {
      p: 'En el óptimo, la cantidad de y que el consumidor está dispuesto a ceder por una unidad más de x es igual a lo que el mercado le cobra: el precio relativo.',
      s: [[T`$TMS_{x,y}$`, 'tasa marginal de sustitución: cuánto y entrega a cambio de una unidad más de x sin cambiar su utilidad'], [T`$p_x/p_y$`, 'precio relativo de x en términos de y']],
    },
    [T`Pc = wl + B = w(N - o) + B \;\Rightarrow\; c = \frac{wN + B}{P} - \frac{w}{P}\,o`]: {
      p: 'Lo que se gasta en consumo es igual a lo que se gana trabajando más el ingreso no laboral. Como las horas trabajadas son las horas disponibles menos el ocio, el consumo máximo es el ingreso total posible (trabajando todo) en bienes, menos el salario real por cada hora de ocio.',
      s: [[T`$P$`, 'precio del bien de consumo'], [T`$c$`, 'consumo'], [T`$w$`, 'salario nominal por hora'], [T`$l$`, 'horas trabajadas'], [T`$B$`, 'ingreso no laboral'], [T`$N$`, 'horas totales disponibles'], [T`$o$`, 'horas de ocio ($l = N - o$)'], [T`$w/P$`, 'salario real: precio de una hora de ocio en unidades de consumo']],
    },
    [T`V(o) = \left(\tfrac{w}{p}(N - o)\right)^{1/2} + o^{1/2} \;\Rightarrow\; o^* = \frac{N}{\frac{w}{p} + 1},\qquad l^* = N\,\frac{w/p}{w/p + 1}`]: {
      p: 'Reemplazando el consumo por lo que se gana trabajando, la utilidad queda en función del ocio solamente. Maximizando: el ocio óptimo es las horas disponibles divididas por (salario real + 1), y las horas trabajadas son el resto.',
      s: [[T`$V(o)$`, 'utilidad escrita sólo en función del ocio'], [T`$w/p$`, 'salario real'], [T`$N$`, 'horas disponibles'], [T`$o$`, 'horas de ocio'], [T`$o^*$`, 'ocio óptimo (el asterisco marca el valor óptimo)'], [T`$l^*$`, 'horas trabajadas óptimas ($N - o^*$)']],
    },
    [T`PML = F(K, L+1) - F(K, L) \quad\to\quad PML = \frac{\partial F}{\partial L}`]: {
      p: 'El producto marginal del trabajo es cuánto aumenta la producción al agregar una unidad más de trabajo, con el capital fijo. Con cambios muy chicos, es la derivada de la función de producción respecto de L.',
      s: [[T`$PML$`, 'producto marginal del trabajo'], [T`$F(K,L)$`, 'función de producción: cuánto se produce con K y L'], [T`$K$`, 'capital (fijo)'], [T`$L$`, 'trabajo'], [T`$\partial F/\partial L$`, 'derivada parcial de F respecto de L']],
    },
    [T`P\,[F(K,L+1) - F(K,L)] > w \;\Leftrightarrow\; PML > \frac{w}{P}`]: {
      p: 'A la firma le conviene contratar un trabajador más si lo que se vende de lo que él produce (precio por producción extra) supera su salario. Es lo mismo que decir que su producto marginal supera al salario real.',
      s: [[T`$P$`, 'precio del bien'], [T`$F(K,L+1) - F(K,L)$`, 'producción extra del trabajador adicional'], [T`$w$`, 'salario nominal'], [T`$PML$`, 'producto marginal del trabajo'], [T`$w/P$`, 'salario real'], [T`$\Leftrightarrow$`, '«si y sólo si»: las dos condiciones son equivalentes']],
    },
    [T`\frac{wL}{PY} = \frac{PML\cdot L}{Y} = \frac{(1-\alpha)AK^\alpha L^{-\alpha}\cdot L}{AK^\alpha L^{1-\alpha}} = 1 - \alpha`]: {
      p: 'La parte del producto que se llevan los trabajadores es la masa salarial sobre el valor de la producción. Como el salario real es igual a la PML, y con Cobb-Douglas se simplifica todo, esa parte es siempre 1 − α.',
      s: [[T`$wL$`, 'masa salarial: salario por cantidad de trabajo'], [T`$PY$`, 'valor de la producción'], [T`$PML$`, 'producto marginal del trabajo (= w/P)'], [T`$A$`, 'productividad total de los factores'], [T`$K$`, 'capital'], [T`$L$`, 'trabajo'], [T`$\alpha$`, 'exponente del capital'], [T`$1-\alpha$`, 'exponente del trabajo = participación del trabajo']],
    },
    [T`\frac{w^*}{P} = PML(K, L^s)`]: {
      p: 'Si la oferta de trabajo es fija, el salario real de equilibrio es el producto marginal del trabajo evaluado en esa cantidad de trabajo.',
      s: [[T`$w^*/P$`, 'salario real de equilibrio'], [T`$PML$`, 'producto marginal del trabajo'], [T`$K$`, 'capital'], [T`$L^s$`, 'oferta de trabajo (fija, vertical)']],
    },

    /* ---------------- Unidad 3 ---------------- */
    [T`t=1:\ P_1Y_1 = P_1C_1 + P_1S \qquad t=2:\ P_2C_2 = P_2Y_2 + (1+R)P_1S`]: {
      p: 'Hoy, el ingreso en pesos se reparte entre consumo y ahorro. Mañana, el consumo en pesos se paga con el ingreso de mañana más lo ahorrado hoy con sus intereses.',
      s: [[T`$P_1, P_2$`, 'precios de hoy y de mañana'], [T`$Y_1, Y_2$`, 'ingreso (en bienes) de cada período'], [T`$C_1, C_2$`, 'consumo de cada período'], [T`$S$`, 'ahorro del período 1 (si es negativo, deuda)'], [T`$R$`, 'tasa de interés nominal'], [T`$(1+R)P_1S$`, 'lo ahorrado en pesos más los intereses']],
    },
    [T`P_1C_1 + \frac{P_2C_2}{1+R} = P_1Y_1 + \frac{P_2Y_2}{1+R}`]: {
      p: 'El valor presente de todo lo que se gasta en consumo es igual al valor presente de todo lo que se gana. Los pesos de mañana se traen a hoy dividiendo por (1 + tasa nominal).',
      s: [[T`$P_tC_t$`, 'gasto en consumo del período t, en pesos'], [T`$P_tY_t$`, 'ingreso del período t, en pesos'], [T`$R$`, 'tasa de interés nominal'], [T`$\frac{1}{1+R}$`, 'factor de descuento: convierte pesos de mañana en pesos de hoy']],
    },
    [T`1 + r = \frac{(1+R)P_1}{P_2} \quad\Leftrightarrow\quad 1 + R = (1+r)(1+\pi)`]: {
      p: 'Ecuación de Fisher: lo que rinde ahorrar en bienes es lo que rinde en pesos corregido por cuánto subieron los precios. Equivalente: 1 + tasa nominal = (1 + tasa real) por (1 + inflación).',
      s: [[T`$r$`, 'tasa de interés real (rendimiento en bienes)'], [T`$R$`, 'tasa de interés nominal (rendimiento en pesos)'], [T`$P_1, P_2$`, 'precios de cada período'], [T`$\pi$`, 'inflación: $P_2/P_1 - 1$']],
    },
    [T`C_1 + \frac{C_2}{1+r} = Y_1 + \frac{Y_2}{1+r}`]: {
      p: 'Restricción presupuestaria intertemporal en bienes: el consumo de hoy más el valor presente del consumo de mañana es igual al ingreso de hoy más el valor presente del ingreso de mañana.',
      s: [[T`$C_1, C_2$`, 'consumo hoy y mañana'], [T`$Y_1, Y_2$`, 'ingreso hoy y mañana'], [T`$r$`, 'tasa de interés real'], [T`$\frac{C_2}{1+r}$`, 'valor presente del consumo de mañana'], [T`$\frac{Y_2}{1+r}$`, 'valor presente del ingreso de mañana']],
    },
    [T`C_2 = \beta(1+r)C_1`]: {
      p: 'Con utilidad logarítmica, el consumo de mañana es el de hoy multiplicado por la paciencia del consumidor y por lo que paga el mercado por esperar.',
      s: [[T`$C_1, C_2$`, 'consumo hoy y mañana'], [T`$\beta$`, 'factor de descuento: cuánto valora el futuro (entre 0 y 1)'], [T`$1+r$`, 'cuántos bienes de mañana te da el mercado por cada bien de hoy']],
    },
    [T`C_1^* = \frac{1}{1+\beta}\left(Y_1 + \frac{Y_2}{1+r}\right)\qquad C_2^* = \frac{\beta}{1+\beta}\big((1+r)Y_1 + Y_2\big)`]: {
      p: 'El consumo óptimo de hoy es una fracción fija, 1/(1+β), de la riqueza en valor presente. El de mañana es la fracción β/(1+β) de la riqueza medida en bienes de mañana.',
      s: [[T`$C_1^*, C_2^*$`, 'consumo óptimo hoy y mañana'], [T`$\beta$`, 'factor de descuento'], [T`$Y_1, Y_2$`, 'ingreso hoy y mañana'], [T`$r$`, 'tasa real'], [T`$Y_1 + \frac{Y_2}{1+r}$`, 'riqueza en valor presente (en bienes de hoy)'], [T`$(1+r)Y_1 + Y_2$`, 'riqueza en bienes de mañana']],
    },
    [T`C_1 = Y_1 + M \qquad C_2 = Y_2 - (1+r)M`]: {
      p: 'Si la restricción de crédito está activa, hoy consume su ingreso más el máximo que le prestan, y mañana consume su ingreso menos la deuda con intereses.',
      s: [[T`$C_1, C_2$`, 'consumo hoy y mañana'], [T`$Y_1, Y_2$`, 'ingreso hoy y mañana'], [T`$M$`, 'máximo que le prestan'], [T`$(1+r)M$`, 'lo que tiene que devolver mañana']],
    },
    [T`U_2 = P_1(1+R) - P_2(1-\delta) \;\Rightarrow\; \frac{U_2}{P_2} = r + \delta`]: {
      p: 'El alquiler de una máquina tiene que cubrir lo que cuesta comprarla hoy con intereses, menos lo que se recupera vendiéndola usada mañana. En términos reales, el costo de uso es la tasa real más la depreciación.',
      s: [[T`$U_2$`, 'alquiler (costo de uso) nominal de la máquina en el período 2'], [T`$P_1, P_2$`, 'precio de la máquina hoy y mañana'], [T`$R$`, 'tasa nominal'], [T`$1-\delta$`, 'parte de la máquina que queda después de usarla'], [T`$U_2/P_2$`, 'costo de uso real'], [T`$r$`, 'tasa real'], [T`$\delta$`, 'tasa de depreciación']],
    },
    [T`PMK_2(K_2) = r + \delta`]: {
      p: 'La firma elige el capital de mañana de modo que la última unidad produzca exactamente lo que cuesta usarla: la tasa real más la depreciación.',
      s: [[T`$PMK_2$`, 'producto marginal del capital en el período 2'], [T`$K_2$`, 'capital de mañana'], [T`$r$`, 'tasa real'], [T`$\delta$`, 'depreciación'], [T`$r + \delta$`, 'costo de uso del capital']],
    },
    [T`K_2 = I + (1-\delta)K_1 \;\Rightarrow\; I(r) = K_2^*(r) - (1-\delta)K_1`]: {
      p: 'El capital de mañana es la inversión más lo que sobrevive del capital de hoy. Entonces, la inversión es el capital deseado menos lo que queda del actual; como el capital deseado baja con r, la inversión también.',
      s: [[T`$K_1, K_2$`, 'capital de hoy y de mañana'], [T`$I$`, 'inversión bruta'], [T`$\delta$`, 'depreciación'], [T`$(1-\delta)K_1$`, 'capital de hoy que sigue sirviendo mañana'], [T`$K_2^*(r)$`, 'capital deseado, que depende de la tasa'], [T`$I(r)$`, 'inversión como función de la tasa']],
    },

    /* ---------------- Unidad 4 ---------------- */
    [T`B_{t+1} + T_t = G^{pub} + G^{priv} + TR + B_t + INT_t`]: {
      p: 'Lo que el gobierno consigue (deuda nueva más impuestos) tiene que alcanzar para lo que paga: gasto en bienes públicos y privados, transferencias, la deuda que vence y sus intereses.',
      s: [[T`$B_{t+1}$`, 'deuda nueva que toma el gobierno'], [T`$T_t$`, 'impuestos del período'], [T`$G^{pub}$`, 'gasto en bienes públicos (defensa, justicia, rutas)'], [T`$G^{priv}$`, 'gasto en bienes privados (salud, educación)'], [T`$TR$`, 'transferencias (jubilaciones, seguro de desempleo)'], [T`$B_t$`, 'deuda vieja que vence'], [T`$INT_t$`, 'intereses de la deuda']],
    },
    [T`S^P = Y + TR + INT - T - C\qquad S^G = T - (G + TR + INT)`]: {
      p: 'El ahorro privado es lo que cobran los privados (ingreso, transferencias e intereses) menos impuestos y consumo. El ahorro público es lo que recauda el gobierno menos todo lo que gasta.',
      s: [[T`$S^P$`, 'ahorro privado'], [T`$S^G$`, 'ahorro público (si es negativo, déficit)'], [T`$Y$`, 'ingreso / producto'], [T`$TR$`, 'transferencias'], [T`$INT$`, 'intereses de la deuda pública'], [T`$T$`, 'impuestos'], [T`$C$`, 'consumo'], [T`$G$`, 'gasto del gobierno']],
    },
    [T`S^T = S^P + S^G = Y - C - G`]: {
      p: 'El ahorro total del país es el privado más el público; las transferencias e intereses se cancelan y queda el producto menos el consumo y el gasto del gobierno.',
      s: [[T`$S^T$`, 'ahorro total (nacional)'], [T`$S^P$`, 'ahorro privado'], [T`$S^G$`, 'ahorro público'], [T`$Y$`, 'producto'], [T`$C$`, 'consumo'], [T`$G$`, 'gasto del gobierno']],
    },
    [T`G_1 = T_1 + B \qquad T_2 = G_2 + (1+r)B`]: {
      p: 'Hoy el gasto se paga con impuestos o con deuda. Mañana los impuestos tienen que pagar el gasto y devolver la deuda con intereses.',
      s: [[T`$G_1, G_2$`, 'gasto del gobierno hoy y mañana'], [T`$T_1, T_2$`, 'impuestos hoy y mañana'], [T`$B$`, 'deuda que toma hoy (en bienes)'], [T`$r$`, 'tasa real'], [T`$(1+r)B$`, 'lo que devuelve mañana']],
    },
    [T`G_1 + \frac{G_2}{1+r} = T_1 + \frac{T_2}{1+r}`]: {
      p: 'En valor presente, lo que gasta el gobierno es igual a lo que cobra de impuestos. Puede elegir cuándo cobrar, pero no cuánto.',
      s: [[T`$G_1, G_2$`, 'gasto hoy y mañana'], [T`$T_1, T_2$`, 'impuestos hoy y mañana'], [T`$r$`, 'tasa real'], [T`$\frac{1}{1+r}$`, 'factor que trae valores de mañana a hoy']],
    },
    [T`P_1G_1 = P_1T_1 + B^N_1\qquad P_2G_2 + (1+R)B^N_1 = P_2T_2`]: {
      p: 'En pesos: hoy el gasto se financia con impuestos más deuda nominal; mañana los impuestos pagan el gasto y la deuda con intereses nominales.',
      s: [[T`$P_1, P_2$`, 'precios de cada período'], [T`$G_1, G_2$`, 'gasto del gobierno (en bienes)'], [T`$T_1, T_2$`, 'impuestos (en bienes)'], [T`$B^N_1$`, 'deuda nominal (en pesos) emitida en el período 1'], [T`$R$`, 'tasa nominal']],
    },
    [T`C_1 + \frac{C_2}{1+r} = Y^d_1 + \frac{Y^d_2}{1+r}`]: {
      p: 'La RPI del consumidor con gobierno: el valor presente del consumo es igual al valor presente del ingreso disponible (ingreso menos impuestos).',
      s: [[T`$C_1, C_2$`, 'consumo hoy y mañana'], [T`$Y^d_1, Y^d_2$`, 'ingreso disponible: $Y_t - T_t$'], [T`$r$`, 'tasa real']],
    },
    [T`C_1^* = \frac{1}{1+b}\left(Y_1 - T_1 + \frac{Y_2 - T_2}{1+r}\right)\qquad C_2^* = \frac{b}{1+b}\big[(1+r)(Y_1 - T_1) + Y_2 - T_2\big]`]: {
      p: 'El consumo óptimo de hoy es la fracción 1/(1+b) de la riqueza disponible en valor presente; el de mañana es la fracción b/(1+b) de esa riqueza medida en bienes de mañana. Es la misma fórmula de la unidad 3, con ingresos después de impuestos.',
      s: [[T`$C_1^*, C_2^*$`, 'consumo óptimo hoy y mañana'], [T`$b$`, 'factor de descuento del consumidor'], [T`$Y_t - T_t$`, 'ingreso disponible de cada período'], [T`$r$`, 'tasa real']],
    },
    [T`S^{P*} = \frac{b}{1+b}(Y_1 - T_1) - \frac{1}{1+b}\frac{Y_2 - T_2}{1+r}`]: {
      p: 'El ahorro privado óptimo es una fracción del ingreso disponible de hoy menos una fracción del valor presente del ingreso disponible de mañana. Si mañana va a ganar mucho, ahorra menos (o se endeuda).',
      s: [[T`$S^{P*}$`, 'ahorro privado óptimo'], [T`$b$`, 'factor de descuento'], [T`$Y_1 - T_1$`, 'ingreso disponible de hoy'], [T`$\frac{Y_2 - T_2}{1+r}$`, 'valor presente del ingreso disponible de mañana']],
    },
    [T`\Delta C_1 = -\frac{K}{1+b}\qquad \Delta C_2 = -\frac{b(1+r)}{1+b}K\qquad \Delta S^P = -\frac{b}{1+b}K`]: {
      p: 'Si suben el gasto y los impuestos de hoy en K, el consumidor no achica sólo el consumo de hoy: reparte la pérdida entre hoy y mañana. Para eso ahorra menos.',
      s: [[T`$\Delta$`, '«cambio en»'], [T`$K$`, 'aumento del gasto y de los impuestos del período 1'], [T`$\Delta C_1, \Delta C_2$`, 'cambio del consumo hoy y mañana'], [T`$\Delta S^P$`, 'cambio del ahorro privado'], [T`$b$`, 'factor de descuento'], [T`$r$`, 'tasa real']],
    },
    [T`\Delta S^P = \frac{K}{1+b}\left(\frac{1}{1+r} - b\right)`]: {
      p: 'Si suben el gasto y los impuestos en K en los dos períodos, el ahorro privado cambia según la diferencia entre el descuento del mercado y el del consumidor: si el consumidor es más impaciente, ahorra más; si es más paciente, ahorra menos.',
      s: [[T`$\Delta S^P$`, 'cambio del ahorro privado'], [T`$K$`, 'aumento del gasto e impuestos en cada período'], [T`$b$`, 'factor de descuento del consumidor'], [T`$\frac{1}{1+r}$`, 'factor de descuento del mercado']],
    },
    [T`\Delta Y^d_1 + \frac{\Delta Y^d_2}{1+r} = -\Delta T_1 - \frac{-(1+r)\Delta T_1}{1+r} = 0`]: {
      p: 'Si el gobierno baja impuestos hoy y los sube mañana con intereses, el valor presente del ingreso disponible del consumidor no cambia: lo que gana hoy lo pierde mañana. Por eso no cambia su consumo (equivalencia ricardiana).',
      s: [[T`$\Delta Y^d_1, \Delta Y^d_2$`, 'cambio del ingreso disponible hoy y mañana'], [T`$\Delta T_1$`, 'cambio de impuestos hoy'], [T`$-(1+r)\Delta T_1$`, 'cambio de impuestos mañana ($\Delta T_2$)'], [T`$r$`, 'tasa real']],
    },

    /* ---------------- Unidad 5 ---------------- */
    [T`\text{Cerrada: } S = I \qquad \text{Abierta: } S = I + CA`]: {
      p: 'En economía cerrada todo el ahorro va a la inversión local. En economía abierta, el ahorro financia la inversión local y lo que se le presta al resto del mundo (la cuenta corriente).',
      s: [[T`$S$`, 'ahorro nacional'], [T`$I$`, 'inversión'], [T`$CA$`, 'cuenta corriente: positiva si el país le presta al mundo, negativa si se endeuda']],
    },
    [T`S^P = I + (-S^G) + CA`]: {
      p: 'El ahorro privado financia tres cosas: la inversión, el déficit del gobierno y el préstamo neto al resto del mundo.',
      s: [[T`$S^P$`, 'ahorro privado'], [T`$I$`, 'inversión'], [T`$-S^G$`, 'déficit fiscal (desahorro público)'], [T`$CA$`, 'cuenta corriente']],
    },
    [T`Y_1 = A_1\qquad K_2^*(r) = I(r) = \left(\frac{A_2}{2(1+r)}\right)^2\qquad Y_2 = \frac{A_2^2}{2(1+r)}`]: {
      p: 'Con los supuestos del capítulo 6, la producción de hoy es la tecnología de hoy. El capital deseado (que es igual a la inversión) y la producción de mañana suben con la tecnología de mañana y bajan con la tasa.',
      s: [[T`$Y_1, Y_2$`, 'producción hoy y mañana'], [T`$A_1, A_2$`, 'tecnología (productividad) hoy y mañana'], [T`$K_2^*$`, 'capital deseado para mañana'], [T`$I(r)$`, 'inversión (con δ = 1 es igual a $K_2$)'], [T`$r$`, 'tasa real']],
    },
    [T`K_2^* = I^* = \frac{bA_1}{3+b}\qquad 1 + r^* = \frac{A_2}{2}\sqrt{\frac{3+b}{bA_1}}`]: {
      p: 'En economía cerrada, la inversión de equilibrio depende sólo de la producción de hoy y de la paciencia. La tasa de equilibrio sube con la tecnología de mañana y baja con la producción de hoy.',
      s: [[T`$K_2^*, I^*$`, 'capital e inversión de equilibrio'], [T`$b$`, 'factor de descuento'], [T`$A_1, A_2$`, 'tecnología hoy y mañana'], [T`$r^*$`, 'tasa de interés de economía cerrada']],
    },
    [T`CA = \frac{b(A_1 - G_1)}{1+b} + \frac{G_2}{(1+b)(1+r_W)} - \frac{3+b}{4(1+b)}\frac{A_2^2}{(1+r_W)^2}`]: {
      p: 'La cuenta corriente con gobierno: sube con lo que queda de la producción de hoy después del gasto público y con el gasto público futuro; baja con la inversión, que crece con la tecnología de mañana y cae con la tasa internacional.',
      s: [[T`$CA$`, 'cuenta corriente'], [T`$b$`, 'factor de descuento'], [T`$A_1, A_2$`, 'tecnología hoy y mañana'], [T`$G_1, G_2$`, 'gasto del gobierno hoy y mañana'], [T`$r_W$`, 'tasa de interés internacional']],
    },
    [T`\tfrac12(A + R) = A + R^* \;\Rightarrow\; R = A + 2R^* > R^*`]: {
      p: 'Con probabilidad ½ cobrás capital más interés y con probabilidad ½ no cobrás nada. Para que en promedio rinda lo mismo que el activo seguro, el interés del préstamo riesgoso tiene que ser mucho más alto.',
      s: [[T`$\tfrac12$`, 'probabilidad de que paguen'], [T`$A$`, 'monto prestado'], [T`$R$`, 'interés que exige el préstamo riesgoso'], [T`$R^*$`, 'interés del activo seguro'], [T`$A + R^*$`, 'lo que paga seguro el activo sin riesgo']],
    },
    [T`1 + r_W = (1-p)(1 + r_{ARG}) \;\Rightarrow\; r_{ARG} = \frac{r_W + p}{1-p}\qquad \lambda = r_{ARG} - r_W`]: {
      p: 'Lo que rinde prestarle al mundo tiene que ser igual a lo que rinde, en promedio, prestarle al país (que paga sólo si no hay default). Despejando sale la tasa del país; el riesgo país es la diferencia entre esa tasa y la internacional.',
      s: [[T`$r_W$`, 'tasa de interés internacional (sin riesgo)'], [T`$p$`, 'probabilidad de default'], [T`$1-p$`, 'probabilidad de que pague'], [T`$r_{ARG}$`, 'tasa a la que se endeuda el país'], [T`$\lambda$`, 'riesgo país: sobretasa']],
    },
    [T`CA = S(r_W) - I(r_{ARG})`]: {
      p: 'Con riesgo país, la cuenta corriente es el ahorro (que rinde la tasa internacional) menos la inversión (que se financia a la tasa del país, más alta).',
      s: [[T`$CA$`, 'cuenta corriente'], [T`$S(r_W)$`, 'ahorro evaluado a la tasa internacional'], [T`$I(r_{ARG})$`, 'inversión evaluada a la tasa con riesgo']],
    },
    [T`T_1 + \frac{T_2}{1+r_W} = G_1 + \frac{G_2}{1+r_W} + \frac{B(r_{ARG} - r_W)}{1+r_W}`]: {
      p: 'Para el consumidor, el valor presente de los impuestos es el del gasto más un costo extra: la sobretasa que paga el gobierno por su deuda. Por eso la deuda deja de ser equivalente a cobrar impuestos hoy.',
      s: [[T`$T_1, T_2$`, 'impuestos hoy y mañana'], [T`$G_1, G_2$`, 'gasto hoy y mañana'], [T`$r_W$`, 'tasa a la que descuenta el consumidor'], [T`$r_{ARG}$`, 'tasa a la que se endeuda el gobierno'], [T`$B$`, 'deuda del gobierno'], [T`$B(r_{ARG} - r_W)$`, 'intereses de más que paga por el riesgo país']],
    },
  };
})();
