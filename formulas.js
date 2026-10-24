/* Explicación ampliada de cada fórmula de la hoja de fórmulas.
   Clave: el nombre (n) de la fórmula en u1.js ... u5.js.
   s: símbolos [símbolo, qué es] · m: qué significa · ej: ejemplo con números */
(function () {
  const T = String.raw;
  App.FX = {
    /* ---------------- Unidad 1 ---------------- */
    'Tasa de crecimiento': {
      s: [[T`$X_t$`, 'valor de la variable en el período de partida'], [T`$X_{t+1}$`, 'valor en el período siguiente'], [T`$g$`, 'tasa de crecimiento, en %']],
      m: 'Mide cuánto cambió una variable en proporción a donde estaba. Siempre se divide por el valor de partida, no por el final.',
      ej: T`La producción pasa de 1000 a 1020 toneladas: $g = \frac{1020 - 1000}{1000}\cdot 100 = 2\%$.`,
    },
    'Tasa acumulada': {
      s: [[T`$X_0$`, 'valor en el primer año'], [T`$X_T$`, 'valor en el último año'], [T`$g_t$`, 'tasa de cada año'], [T`$\prod$`, 'producto: multiplicar todos los factores (1 + g)']],
      m: 'Cuánto creció en total entre el primer y el último año. Es más grande que sumar las tasas anuales porque cada año crecés sobre lo que ya habías crecido.',
      ej: T`TP 1: la cantidad pasa de 1000 a 1287. $TCA = \frac{1287 - 1000}{1000} = 28{,}7\%$, mientras que la suma de las tasas anuales da 26 %.`,
    },
    'Crecimiento de un producto': {
      s: [[T`$g_P$`, 'tasa de crecimiento del precio'], [T`$g_Q$`, 'tasa de crecimiento de la cantidad'], [T`$g_{PQ}$`, 'tasa de crecimiento del valor P·Q'], [T`$g_P g_Q$`, 'término cruzado: lo que la aproximación se olvida']],
      m: 'El valor de la producción es precio por cantidad. Su crecimiento es aproximadamente la suma de los dos, y el error es el producto de las tasas: chico si las tasas son chicas.',
      ej: T`TP 1, 2020: $g_Q = 8{,}06\%$ y $g_P = 49{,}69\%$. La suma da 57,75 %, pero el exacto es $1{,}0806\cdot 1{,}4969 - 1 = 61{,}8\%$.`,
    },
    'Crecimiento de un cociente': {
      s: [[T`$g_V$`, 'tasa de crecimiento del total (por ejemplo, el valor de la producción)'], [T`$g_N$`, 'tasa de crecimiento de la población'], [T`$g_{V/N}$`, 'tasa de crecimiento por habitante']],
      m: 'Para una variable por habitante, la tasa es aproximadamente la del total menos la de la población. La exacta se calcula dividiendo los factores (1 + g).',
      ej: T`TP 1, 2020: $g_V = 61{,}8\%$, $g_N = 4{,}93\%$. La resta da 56,87 %; la exacta es $\frac{1{,}618}{1{,}0493} - 1 = 54{,}2\%$.`,
    },
    'PBI por el gasto': {
      s: [[T`$Y$`, 'PBI'], [T`$C$`, 'consumo de los hogares'], [T`$I$`, 'inversión bruta (capital nuevo + reposición)'], [T`$G$`, 'gasto del gobierno en bienes y servicios (sin transferencias)'], [T`$X$`, 'exportaciones'], [T`$M$`, 'importaciones']],
      m: 'Suma el producto final según quién lo compra. Las importaciones se restan porque no se produjeron en el país.',
      ej: T`$C = 600$, $I = 200$, $G = 150$, $X = 100$, $M = 50$: $Y = 600 + 200 + 150 + 100 - 50 = 1000$.`,
    },
    'Valor agregado': {
      s: [[T`$P\cdot Q$`, 'valor de lo que produce el sector'], ['insumos', 'valor de los bienes intermedios que compró a otros sectores'], [T`$VA$`, 'lo que el sector agrega por su cuenta']],
      m: 'Lo que cada sector suma a la economía, sin contar lo que ya hicieron otros. Sumando los VA de todos los sectores se obtiene el PBI sin contar dos veces los insumos.',
      ej: T`Una panadería vende pan por 120 y compró harina por 70: $VA = 120 - 70 = 50$.`,
    },
    'PBI por el ingreso': {
      s: [[T`$w L$`, 'salarios: salario por cantidad de trabajo'], [T`$r K$`, 'retribución al capital'], ['Beneficios', 'ganancias de las empresas'], [T`$IBI$`, 'ingreso bruto interno'], [T`$\delta K$`, 'depreciación: capital que se gastó'], [T`$INI$`, 'ingreso neto interno']],
      m: 'Suma lo que cobran los dueños de los factores. Da lo mismo que el gasto porque cada peso gastado es ingreso de alguien.',
      ej: T`Salarios 600, alquiler del capital 250, beneficios 150: $IBI = 1000$. Si la depreciación es 80, $INI = 920$.`,
    },
    'PBI real': {
      s: [[T`$p_i^{t_0}$`, 'precio del bien i en el año base'], [T`$q_i^t$`, 'cantidad del bien i en el año t'], [T`$\sum_i$`, 'sumar sobre todos los bienes']],
      m: 'Valúa las cantidades de cada año con precios fijos (los del año base). Así, si cambia, es porque cambiaron las cantidades y no los precios. Con él se mide el crecimiento.',
      ej: T`TP 2: las cantidades de 2000 a precios de 2010 dan $1{,}5\cdot 80 + 10\cdot 30 + 1\cdot 500 + 4\cdot 80 - 1\cdot 160 = 1080$ (el último término resta la leche usada para el queso).`,
    },
    'Deflactor del PBI': {
      s: [[T`$PBI^{nom}_t$`, 'PBI a precios de ese año'], [T`$PBI^{real}_t$`, 'PBI a precios del año base'], [T`$D_t$`, 'índice de precios; vale 100 en el año base']],
      m: 'Cuánto subieron los precios de todo lo producido respecto del año base. Usa la canasta producida en cada año.',
      ej: T`TP 2, 2020: $D = \frac{1710}{1425}\cdot 100 = 120$: los precios de lo producido son 20 % más altos que en 2010.`,
    },
    'IPC': {
      s: [[T`$\bar q_i$`, 'cantidad fija del bien i en la canasta'], [T`$p_i^t$`, 'precio en el año t'], [T`$p_i^{t_0}$`, 'precio en el año base']],
      m: 'Cuánto cuesta hoy la misma canasta de consumo que en el año base, en relación con lo que costaba. Mide el costo de vida.',
      ej: T`TP 2: la canasta cuesta 25 en 2010 y 30 en 2020. Con base 2010: $IPC_{2020} = \frac{30}{25}\cdot 100 = 120$.`,
    },
    'Cambiar de pesos de un año a otro': {
      s: [[T`$V_t$`, 'valor en pesos del año t'], [T`$IPC_t$`, 'índice del año del dato'], [T`$IPC_b$`, 'índice del año al que lo querés llevar']],
      m: 'Traduce pesos de un año a pesos de otro año usando la inflación promedio.',
      ej: T`TP 2: el vino de 2010 vale 150. En pesos de 2000: $150\cdot \frac{48}{100} = 72$.`,
    },

    /* ---------------- Unidad 2 ---------------- */
    'Restricción consumo–ocio': {
      s: [[T`$c$`, 'consumo'], [T`$o$`, 'horas de ocio'], [T`$w$`, 'salario nominal por hora'], [T`$P$`, 'precio del bien de consumo'], [T`$N$`, 'horas disponibles'], [T`$B$`, 'ingreso no laboral'], [T`$w/P$`, 'precio del ocio en unidades de consumo']],
      m: 'Todo lo que el individuo puede consumir según cuánto ocio elija. Cada hora de ocio cuesta w/P de consumo.',
      ej: T`$w = 10$, $P = 1$, $N = 16$, $B = 20$: $c = 180 - 10\,o$. Si toma 10 horas de ocio, trabaja 6 y consume $c = 80$.`,
    },
    'Tangencia': {
      s: [[T`$TMS_{o,c}$`, 'tasa marginal de sustitución: cuánto consumo está dispuesto a ceder por una hora más de ocio'], [T`$w/P$`, 'cuánto consumo le cuesta en el mercado una hora más de ocio']],
      m: 'En el óptimo, lo que el individuo está dispuesto a pagar por una hora de ocio coincide con lo que le cuesta. Gráficamente, la curva de indiferencia toca la restricción sin cortarla.',
      ej: T`Si $w/P = 10$ y en su canasta actual cedería 15 de consumo por una hora más de ocio ($TMS = 15 > 10$), le conviene más ocio: no estaba en el óptimo.`,
    },
    'Regla de contratación': {
      s: [[T`$PML$`, 'producto marginal del trabajo: cuánto produce una unidad más de L'], [T`$\partial F/\partial L$`, 'derivada de la producción respecto de L'], [T`$w/P$`, 'salario real: cuánto cuesta en bienes una unidad de trabajo']],
      m: 'La firma contrata mientras el trabajador extra produzca más de lo que cuesta, y frena justo donde se igualan. Por eso la curva de PML es la demanda de trabajo.',
      ej: T`TP 3: con $Y = 10\sqrt L$, $P = 1$ y $w = 0{,}5$: $PML = 5/\sqrt L = 0{,}5 \Rightarrow L = 100$.`,
    },
    'PML Cobb-Douglas': {
      s: [[T`$A$`, 'productividad total de los factores (tecnología)'], [T`$K$`, 'capital'], [T`$L$`, 'trabajo'], [T`$\alpha$`, 'exponente del capital (entre 0 y 1)']],
      m: 'La PML baja cuando hay más L (rendimientos decrecientes) y sube con más K o más A. Por eso más capital o mejor tecnología corren la demanda de trabajo a la derecha.',
      ej: T`$A = 1$, $K = 100$, $\alpha = 0{,}5$, $L = 100$: $PML = 0{,}5\cdot 10\cdot 100^{-1/2} = 0{,}5$.`,
    },
    'Demanda Cobb-Douglas': {
      s: [[T`$L^d$`, 'trabajo demandado'], [T`$K$`, 'capital'], [T`$1-\alpha$`, 'exponente del trabajo'], [T`$w/P$`, 'salario real']],
      m: 'Despeje de PML = w/P: cuánto trabajo pide la firma para cada salario real. Baja si sube el salario y sube con K.',
      ej: T`$K = 64$, $\alpha = \tfrac12$, $A = 1$, $w/P = 0{,}4$: $L^d = 64\left(\frac{0{,}5}{0{,}4}\right)^2 = 100$.`,
    },
    'Demanda aditiva': {
      s: [[T`$P$`, 'precio del bien'], [T`$w$`, 'salario nominal']],
      m: 'Con producción aditiva la PML no depende de K. Por eso la demanda de trabajo tampoco: más capital sube Y pero no cambia el empleo ni el salario.',
      ej: T`$P = 1$, $w = 0{,}05$: $L^d = \left(\frac{1}{0{,}1}\right)^2 = 100$, tenga la firma 100 o 110 de capital.`,
    },
    'Salario con oferta inelástica': {
      s: [[T`$L^s$`, 'oferta de trabajo fija (vertical)'], [T`$PML(K, L^s)$`, 'productividad marginal evaluada en ese empleo']],
      m: 'Si la cantidad de trabajo está fija, el empleo ya está dado y el salario real es lo que produce el último trabajador.',
      ej: T`TP 4: $K^{1/2}L^{1/2}$ con $L^s = 100$ y $K = 110$: $w/P = 0{,}5\sqrt{110/100} = 0{,}524$.`,
    },
    'Participación del trabajo': {
      s: [[T`$wL$`, 'masa salarial'], [T`$PY$`, 'valor de la producción'], [T`$1-\alpha$`, 'exponente del trabajo en Cobb-Douglas']],
      m: 'Qué parte del producto se llevan los trabajadores. Con Cobb-Douglas es siempre el exponente del trabajo, cambie lo que cambie K o A.',
      ej: T`Con $Y = K^{1/3}L^{2/3}$ e $Y = 300$: los salarios suman $\tfrac23\cdot 300 = 200$ y el capital se lleva 100.`,
    },
    'Oferta con U = c^½ + o^½': {
      s: [[T`$N$`, 'horas disponibles'], [T`$w/p$`, 'salario real'], [T`$o^*$`, 'ocio elegido'], [T`$l^*$`, 'horas trabajadas']],
      m: 'Oferta de trabajo que sale de maximizar esa utilidad (ejemplo del capítulo 3). Sube con el salario real: en este caso domina el efecto sustitución.',
      ej: T`$N = 16$, $w/p = 3$: $o^* = 16/4 = 4$ y $l^* = 12$. Si $w/p = 7$: $o^* = 2$, $l^* = 14$.`,
    },

    /* ---------------- Unidad 3 ---------------- */
    'Fisher': {
      s: [[T`$R$`, 'tasa de interés nominal (en pesos)'], [T`$r$`, 'tasa de interés real (en bienes)'], [T`$\pi$`, 'inflación: $P_2/P_1 - 1$'], [T`$P_1, P_2$`, 'precios de cada período']],
      m: 'Relaciona lo que rinde un depósito en pesos con lo que rinde en poder de compra. Lo que importa para decidir es la tasa real.',
      ej: T`$R = 21\%$ y $\pi = 10\%$: $1 + r = 1{,}21/1{,}10 = 1{,}10$, así que $r = 10\%$. (La resta da 11 %: con tasas altas la aproximación falla.)`,
    },
    'RPI nominal': {
      s: [[T`$P_tC_t$`, 'gasto en consumo del período t, en pesos'], [T`$P_tY_t$`, 'ingreso del período t, en pesos'], [T`$\frac{1}{1+R}$`, 'factor que trae pesos de mañana a pesos de hoy']],
      m: 'El valor presente de lo que gastás en tu vida tiene que ser igual al valor presente de lo que ganás.',
      ej: T`$P_1 = 1$, $P_2 = 1{,}1$, $R = 21\%$, $Y_1 = 100$, $Y_2 = 110$: riqueza en pesos de hoy $= 100 + \frac{121}{1{,}21} = 200$.`,
    },
    'RPI real': {
      s: [[T`$C_1, C_2$`, 'consumo hoy y mañana'], [T`$Y_1, Y_2$`, 'ingreso hoy y mañana'], [T`$r$`, 'tasa real'], [T`$1+r$`, 'precio de una unidad de C1 en unidades de C2']],
      m: 'Lo mismo que la nominal, en bienes. Es una recta de pendiente −(1+r) que pasa siempre por la dotación (Y1, Y2).',
      ej: T`$Y_1 = 100$, $Y_2 = 110$, $r = 10\%$: puede consumir hasta $100 + 110/1{,}1 = 200$ hoy, o hasta $100\cdot 1{,}1 + 110 = 220$ mañana.`,
    },
    'Optimalidad log': {
      s: [[T`$\beta$`, 'factor de descuento: cuánto valora el futuro (entre 0 y 1)'], [T`$1+r$`, 'lo que paga el mercado por esperar']],
      m: T`Regla de cómo reparte el consumo entre períodos. Si $\beta(1+r) = 1$, consume igual en los dos; si es mayor que 1, consume más mañana.`,
      ej: T`$\beta = 0{,}9$, $r = 10\%$: $C_2 = 0{,}99\,C_1$, casi parejo.`,
    },
    'Consumo óptimo': {
      s: [[T`$Y_1 + \frac{Y_2}{1+r}$`, 'riqueza en valor presente'], [T`$\frac{1}{1+\beta}$`, 'parte de la riqueza que consume hoy']],
      m: 'Con utilidad logarítmica, el consumo de hoy es una fracción fija de la riqueza total. No importa cuándo llega el ingreso, sólo cuánto vale en total.',
      ej: T`$Y_1 = 50$, $Y_2 = 150$, $r = 0{,}5$, $\beta = \tfrac23$: riqueza $= 150$, $C_1 = \tfrac35\cdot 150 = 90$, $C_2 = \tfrac23\cdot 1{,}5\cdot 90 = 90$.`,
    },
    'Ahorro óptimo': {
      s: [[T`$S^*$`, 'ahorro del período 1 (si es negativo, pide prestado)'], [T`$Y_1, Y_2$`, 'ingresos'], [T`$\beta$`, 'factor de descuento']],
      m: 'Lo que no consume hoy. Sube con el ingreso de hoy, baja con el ingreso de mañana y sube con r.',
      ej: T`Mismos datos: $S = 0{,}4\cdot 50 - 0{,}6\cdot \frac{150}{1{,}5} = 20 - 60 = -40$: pide prestado 40.`,
    },
    'Restricción de crédito activa': {
      s: [[T`$M$`, 'máximo que le prestan'], [T`$(1+r)M$`, 'lo que devuelve mañana']],
      m: 'Si quería endeudarse más que M, se endeuda exactamente M: consume eso de más hoy y lo devuelve con intereses mañana.',
      ej: T`$Y_1 = 50$, $Y_2 = 150$, $r = 25\%$, $M = 20$: $C_1 = 70$ y $C_2 = 150 - 1{,}25\cdot 20 = 125$.`,
    },
    'Consumo parejo (r = 0)': {
      s: [[T`$C$`, 'consumo igual en los dos períodos'], [T`$Y_1, Y_2$`, 'ingresos']],
      m: 'Si no hay interés y la persona quiere consumir parejo, consume el promedio de sus ingresos. Es la idea del ingreso permanente.',
      ej: T`$Y_1 = 100$, $Y_2 = 200$: consume 150 en cada período; hoy pide prestado 50.`,
    },
    'Costo de uso del capital': {
      s: [[T`$U_2/P_2$`, 'alquiler real de una máquina por un período'], [T`$r$`, 'lo que rendiría esa plata en el banco'], [T`$\delta$`, 'depreciación: cuánto se gasta la máquina']],
      m: 'Usar una máquina un período cuesta el interés que dejás de ganar más lo que se desgasta.',
      ej: T`$r = 5\%$, $\delta = 10\%$: una máquina de 1000 cuesta 150 por año.`,
    },
    'Elección de capital': {
      s: [[T`$PMK_2$`, 'producto marginal del capital de mañana'], [T`$K_2^*$`, 'capital elegido para mañana'], [T`$r + \delta$`, 'costo de uso']],
      m: 'La firma suma capital hasta que la última máquina produce justo lo que cuesta. Como la PMK es decreciente, más tasa significa menos capital.',
      ej: T`$PMK_2 = 1/\sqrt{K_2}$, $r + \delta = 0{,}25$: $\sqrt{K_2} = 4$, entonces $K_2^* = 16$.`,
    },
    'Inversión': {
      s: [[T`$I$`, 'inversión bruta'], [T`$K_2^*$`, 'capital deseado para mañana'], [T`$(1-\delta)K_1$`, 'lo que queda del capital de hoy']],
      m: 'Lo que hay que agregar para pasar del capital que sobrevive al capital que se quiere. Es decreciente en r.',
      ej: T`$K_2^* = 16$, $K_1 = 4$, $\delta = 0{,}1$: $I = 16 - 0{,}9\cdot 4 = 12{,}4$.`,
    },
    'Equilibrio de fondos': {
      s: [[T`$S(r)$`, 'oferta de ahorro (creciente)'], [T`$I(r)$`, 'demanda de inversión (decreciente)'], [T`$r^*$`, 'tasa de equilibrio']],
      m: 'La tasa de interés se ajusta hasta que lo que se ahorra coincide con lo que se quiere invertir.',
      ej: T`$S = 20 + 60r$, $I = 60 - 80r$: $140r = 40$, $r^* = 28{,}6\%$ y $S = I = 37{,}1$.`,
    },

    /* ---------------- Unidad 4 ---------------- */
    'Ahorros': {
      s: [[T`$S^P$`, 'ahorro privado'], [T`$Y^d$`, 'ingreso disponible: $Y - T$'], [T`$S^G$`, 'ahorro público'], [T`$S^T$`, 'ahorro total o nacional']],
      m: 'El ahorro privado más el público financia la inversión. Si el gobierno tiene déficit, usa parte del ahorro privado.',
      ej: T`$Y = 1000$, $T = 120$, $C = 600$, $G = 150$: $S^P = 280$, $S^G = -30$, $S^T = 250 = I$.`,
    },
    'Restricciones del gobierno': {
      s: [[T`$G_t$`, 'gasto del gobierno'], [T`$T_t$`, 'impuestos'], [T`$B$`, 'deuda que toma en t = 1 (si es negativa, ahorra)'], [T`$(1+r)B$`, 'lo que devuelve en t = 2']],
      m: 'Hoy el gasto se paga con impuestos o deuda; mañana los impuestos pagan el gasto y la deuda con intereses.',
      ej: T`$G_1 = 30$, $T_1 = 20$: $B = 10$. Con $G_2 = 30$ y $r = 10\%$: $T_2 = 30 + 11 = 41$.`,
    },
    'RPI del gobierno': {
      s: [[T`$G_1 + \frac{G_2}{1+r}$`, 'valor presente del gasto'], [T`$T_1 + \frac{T_2}{1+r}$`, 'valor presente de los impuestos']],
      m: 'El gobierno no puede hacer default: en valor presente tiene que cobrar exactamente lo que gasta. Puede cambiar cuándo cobra, no cuánto.',
      ej: T`Mismos datos: $30 + \frac{30}{1{,}1} = 57{,}27$ y $20 + \frac{41}{1{,}1} = 57{,}27$.`,
    },
    'RPI del consumidor con impuestos': {
      s: [[T`$Y_t - T_t$`, 'ingreso disponible de cada período'], [T`$r$`, 'tasa real']],
      m: 'Igual que sin gobierno, pero con el ingreso después de impuestos. Los impuestos de suma fija bajan la recta en paralelo.',
      ej: T`$Y_1 = 100$, $T_1 = 50$, $Y_2 = 200$, $T_2 = 50$, $r = 0{,}5$: riqueza disponible $= 50 + 150/1{,}5 = 150$.`,
    },
    'Consumo con impuestos': {
      s: [[T`$Y^d_1, Y^d_2$`, 'ingresos disponibles'], [T`$b$`, 'factor de descuento']],
      m: 'La misma fórmula de consumo, usando el ingreso disponible.',
      ej: T`Mismos datos con $b = \tfrac23$: $C_1 = \tfrac35\cdot 150 = 90$, $C_2 = 90$.`,
    },
    'Ahorro privado': {
      s: [[T`$S^P$`, 'ahorro privado'], [T`$Y^d_1, Y^d_2$`, 'ingresos disponibles']],
      m: 'Lo que el consumidor no gasta de su ingreso disponible de hoy.',
      ej: T`Mismos datos: $S^P = 0{,}4\cdot 50 - 0{,}6\cdot 100 = -40$.`,
    },
    'G1↑ con T1': {
      s: [[T`$K$`, 'aumento del gasto y de los impuestos del período 1'], [T`$\Delta C_1$`, 'cambio del consumo de hoy'], [T`$\Delta S^P$`, 'cambio del ahorro privado']],
      m: 'El consumidor no baja su consumo en todo el impuesto: reparte la pérdida entre hoy y mañana, y para eso ahorra menos. Cae el ahorro total, sube r y baja la inversión.',
      ej: T`$K = 10$, $b = 0{,}9$: $\Delta C_1 = -10/1{,}9 = -5{,}26$ y $\Delta S^P = -4{,}74$.`,
    },
    'G1 y G2 ↑ con impuestos': {
      s: [[T`$K$`, 'aumento del gasto en cada período'], [T`$b$`, 'descuento del consumidor'], [T`$\frac{1}{1+r}$`, 'descuento del mercado']],
      m: T`Si el consumidor es más impaciente que el mercado ($b < \tfrac{1}{1+r}$), ahorra más; si es más paciente, ahorra menos. Si son iguales, no cambia.`,
      ej: T`$K = 12$, $b = 0{,}8$, $r = 20\%$: $\Delta S^P = \frac{12}{1{,}8}(0{,}833 - 0{,}8) = +0{,}22$.`,
    },
    'Equivalencia ricardiana': {
      s: [[T`$\Delta T_1$`, 'cambio de impuestos hoy'], [T`$\Delta T_2$`, 'cambio de impuestos mañana'], [T`$\Delta S^P, \Delta S^G$`, 'cambios en el ahorro privado y público']],
      m: 'Bajar impuestos hoy obliga a subirlos mañana con intereses. El consumidor se da cuenta y ahorra toda la baja: no cambia nada real. Falla si hay restricciones de crédito o tasas distintas.',
      ej: T`$\Delta T_1 = -10$, $r = 50\%$: $\Delta T_2 = +15$. El consumidor ahorra los 10: $\Delta S^P = +10$, $\Delta S^G = -10$, $\Delta S^T = 0$.`,
    },
    'Impuesto al ingreso vs al consumo': {
      s: [[T`$t_y$`, 'tasa sobre el ingreso'], [T`$t_c$`, 'tasa sobre el consumo (como el IVA)']],
      m: 'Un impuesto al consumo equivale a uno al ingreso con esta tasa: dejan al consumidor con la misma restricción.',
      ej: T`IVA de 21 %: $t_y = 0{,}21/1{,}21 = 17{,}4\%$.`,
    },

    /* ---------------- Unidad 5 ---------------- */
    'Economía abierta': {
      s: [[T`$S$`, 'ahorro nacional'], [T`$I$`, 'inversión'], [T`$CA$`, 'cuenta corriente'], [T`$S^P, S^G$`, 'ahorro privado y público']],
      m: 'El ahorro del país financia la inversión local y lo que se le presta al mundo. Si se ahorra menos de lo que se invierte, el mundo pone la diferencia (CA negativa).',
      ej: T`$S = 80$, $I = 100$: $CA = -20$. Si $S^G = -10$, el ahorro privado es $S^P = 100 + 10 - 20 = 90$.`,
    },
    'Cuenta corriente': {
      s: [[T`$r_W$`, 'tasa de interés internacional'], [T`$S(r_W), I(r_W)$`, 'ahorro e inversión evaluados a esa tasa']],
      m: 'En un país chico la tasa la fija el mundo. La cuenta corriente es lo que sobra (o falta) de ahorro a esa tasa.',
      ej: T`A $r_W$, $S = 80$ e $I = 100$: $CA = -20$, déficit.`,
    },
    'Inversión y producción (modelo cap. 6)': {
      s: [[T`$A_2$`, 'tecnología de mañana'], [T`$K_2$`, 'capital de mañana (con δ = 1 es igual a la inversión)'], [T`$Y_2$`, 'producción de mañana']],
      m: 'Con los supuestos del capítulo (K1 = L = 1, α = ½, δ = 1), la inversión y la producción de mañana dependen sólo de A2 y de la tasa.',
      ej: T`$A_2 = 3$, $r = 50\%$: $K_2 = \left(\frac{3}{3}\right)^2 = 1$ e $Y_2 = \frac{9}{3} = 3$.`,
    },
    'Tasa de economía cerrada': {
      s: [[T`$r^*$`, 'tasa de interés si el país no comercia con el mundo'], [T`$A_1, A_2$`, 'tecnología de cada período'], [T`$b$`, 'factor de descuento']],
      m: 'Sale de igualar S(r) e I(r). Sube si mejora la tecnología futura (más inversión) y baja si sube el producto de hoy (más ahorro).',
      ej: T`$A_1 = 4$, $A_2 = 3$, $b = 1$: $1 + r^* = 3/\sqrt4 = 1{,}5$, o sea $r^* = 50\%$.`,
    },
    'CA con gobierno': {
      s: [[T`$G_1, G_2$`, 'gasto del gobierno'], [T`$r_W$`, 'tasa internacional'], [T`$b$`, 'factor de descuento']],
      m: 'Sólo importa cuánto gasta el gobierno, no cómo lo financia. Más G1 o más A2 bajan la CA; más G2, más A1 o más rW la suben.',
      ej: T`$A_1 = 4$, $A_2 = 3$, $b = 1$, $r_W = 25\%$, $G_1 = G_2 = 0{,}4$: $CA = 1{,}8 + 0{,}16 - 2{,}88 = -0{,}92$.`,
    },
    'Tasa con riesgo país': {
      s: [[T`$p$`, 'probabilidad de que el país no pague (default)'], [T`$r_{ARG}$`, 'tasa a la que se endeudan firmas y gobierno'], [T`$\lambda$`, 'riesgo país: la diferencia de tasas']],
      m: 'Un prestador neutral al riesgo exige que, en promedio, prestarle al país rinda lo mismo que prestarle al mundo. Cuanto más probable el default, más alta la tasa.',
      ej: T`$r_W = 5\%$, $p = 10\%$: $r_{ARG} = 0{,}15/0{,}9 = 16{,}7\%$. Riesgo país: 11,7 puntos.`,
    },
    'CA con riesgo país': {
      s: [[T`$S(r_W)$`, 'ahorro: los ahorristas cobran la tasa mundial'], [T`$I(r_{ARG})$`, 'inversión: las firmas pagan la tasa con riesgo']],
      m: 'Ahorro e inversión enfrentan tasas distintas. Si sube el riesgo país, cae la inversión y la cuenta corriente sube.',
      ej: T`$S(r_W) = 60$ e $I(r_{ARG}) = 70$: $CA = -10$. Si sube p y la inversión baja a 65: $CA = -5$.`,
    },
    'VP de impuestos con riesgo': {
      s: [[T`$B$`, 'deuda del gobierno'], [T`$r_{ARG} - r_W$`, 'sobretasa que paga el gobierno'], [T`$r_W$`, 'tasa a la que descuenta el consumidor']],
      m: 'Si el gobierno se endeuda más caro que el consumidor, cada peso de deuda le cuesta de más al consumidor. Por eso prefiere que el gasto se pague con impuestos de hoy, y la equivalencia ricardiana falla.',
      ej: T`$G_1 = G_2 = 10$, $r_W = 5\%$, $r_{ARG} = 16{,}7\%$. Con impuestos: VP $= 10 + 9{,}52 = 19{,}52$. Con $B = 10$: se suma $10\cdot 0{,}117/1{,}05 = 1{,}11$, VP $= 20{,}63$.`,
    },
  };
})();
