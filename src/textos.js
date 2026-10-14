// Textos en español para el configurador. Las claves de los parámetros son las de la API de Paper Shaders.

export const GRUPOS = [
  { nombre: "Degradados", ids: ["grain-gradient", "mesh-gradient", "static-mesh-gradient", "static-radial-gradient"] },
  { nombre: "Fluidos y ruido", ids: ["warp", "swirl", "smoke-ring", "neuro-noise", "perlin-noise", "simplex-noise"] },
  { nombre: "Patrones", ids: ["dot-grid", "dot-orbit", "dithering", "waves", "voronoi", "spiral"] },
  { nombre: "Luz y formas", ids: ["god-rays", "pulsing-border", "metaballs", "color-panels"] },
];

export const SHADER_ES = {
  "grain-gradient": ["Degradado con grano", "Degradados de varios colores con distorsión granulada, en 7 formas abstractas animadas."],
  "mesh-gradient": ["Malla de color", "Manchas de color que se desplazan por trayectorias propias, con distorsión orgánica."],
  "static-mesh-gradient": ["Malla fija", "Degradado de malla con hasta 10 manchas de color, ondulado en dos direcciones. Sin animación."],
  "static-radial-gradient": ["Degradado radial", "Degradado radial de hasta 10 colores con punto focal, distorsión y grano. Sin animación."],
  warp: ["Deformación", "Campos de color deformados por ruido y remolinos sobre un patrón base. Efecto fluido, de humo o de mármol."],
  swirl: ["Remolino", "Bandas de color que se tuercen en espirales, arcos y círculos."],
  "smoke-ring": ["Anillo de humo", "Degradado radial con capas de ruido, de aspecto humeante."],
  "neuro-noise": ["Red luminosa", "Estructura brillante de líneas fluidas que se cruzan."],
  "perlin-noise": ["Ruido Perlin", "Ruido Perlin 3D animado a dos colores."],
  "simplex-noise": ["Ruido simplex", "Degradado de varios colores sobre curvas suaves animadas."],
  "dot-grid": ["Retícula", "Retícula fija de círculos, rombos, cuadrados o triángulos."],
  "dot-orbit": ["Puntos en órbita", "Puntos de colores que giran alrededor del centro de su celda."],
  dithering: ["Tramado", "Tramado a dos colores sobre patrones animados. Aspecto retro o de impresión."],
  waves: ["Líneas onduladas", "Patrón fijo de líneas, del zigzag a las ondas suaves."],
  voronoi: ["Celdas", "Patrón de celdas Voronoi animado, con juntas configurables."],
  spiral: ["Espiral", "Espiral animada de un color, de líneas finas a remolinos y anillos ondulados."],
  "god-rays": ["Rayos de luz", "Rayos que salen del centro, con hasta 5 colores y un brillo central."],
  "pulsing-border": ["Borde luminoso", "Estelas de color que se funden en un contorno brillante."],
  metaballs: ["Gotas", "Hasta 20 gotas de color que se mueven y se funden en formas orgánicas."],
  "color-panels": ["Paneles", "Paneles translúcidos en 3D que giran alrededor de un eje."],
};

// Etiqueta y ayuda por parámetro. "variante.param" tiene prioridad sobre "param".
export const PARAM_ES = {
  colors: ["Colores", ""],
  colorBack: ["Fondo", "Color de fondo"],
  colorFront: ["Color principal", "Color de las líneas o de la tinta"],
  colorMid: ["Color medio", "Color principal de la red"],
  colorFill: ["Relleno", "Color de relleno de las formas"],
  colorStroke: ["Contorno", "Color del contorno (necesita grosor de contorno mayor que 0)"],
  colorBloom: ["Resplandor", "Color que se mezcla con los rayos (necesita resplandor mayor que 0)"],
  colorGlow: ["Brillo interior", "Tinte de la sombra interior de las celdas (necesita brillo mayor que 0)"],
  colorGap: ["Juntas", "Color de los bordes entre celdas"],
  softness: ["Suavidad", "Transición entre colores: 0 es un borde duro, 1 un degradado suave"],
  proportion: ["Proporción", "Punto de mezcla entre colores; 0.5 los reparte por igual"],
  distortion: ["Distorsión", "Fuerza de la distorsión"],
  grainMixer: ["Grano en bordes", "Distorsión granulada en los bordes de las formas"],
  grainOverlay: ["Grano encima", "Grano en blanco y negro sobre todo el efecto"],
  stepsPerColor: ["Pasos por color", "Colores intermedios entre cada color base"],
  mixing: ["Mezcla", "Transiciones más nítidas o más suaves"],
  noise: ["Ruido", "Distorsión con ruido (necesita frecuencia del ruido mayor que 0)"],
  noiseFrequency: ["Frecuencia del ruido", "Necesita ruido mayor que 0"],
  speed: ["Velocidad", "0 detiene la animación; 1 es la velocidad normal"],
  scale: ["Escala", "Zoom general del gráfico"],
  rotation: ["Rotación", "Ángulo del gráfico, en grados"],
  offsetX: ["Desplazamiento X", "Mueve el centro en horizontal"],
  offsetY: ["Desplazamiento Y", "Mueve el centro en vertical"],
  fit: ["Ajuste", "Cómo encaja el gráfico en el contenedor"],

  "color-panels.density": ["Densidad", "Ángulo entre cada par de paneles"],
  "color-panels.angle1": ["Inclinación 1", "Inclinación aplicada a todos los paneles"],
  "color-panels.angle2": ["Inclinación 2", "Segunda inclinación aplicada a todos los paneles"],
  "color-panels.length": ["Largo", "Largo de los paneles respecto a la altura"],
  "color-panels.edges": ["Bordes", "Resalta el color en los bordes de los paneles"],
  "color-panels.blur": ["Desenfoque", "Desenfoque lateral; 0 deja los bordes nítidos"],
  "color-panels.fadeIn": ["Transparencia al centro", "Transparencia cerca del eje central"],
  "color-panels.fadeOut": ["Transparencia al frente", "Transparencia cerca del espectador"],
  "color-panels.gradient": ["Degradado", "Mezcla dentro de cada panel: 0 es color sólido, 1 un degradado de dos colores"],

  "dithering.shape": ["Patrón", "Patrón que se trama"],
  "dithering.type": ["Tipo de tramado", "Matriz de la trama"],
  "dithering.size": ["Tamaño de píxel", "Tamaño del punto de la trama"],

  "dot-grid.shape": ["Forma", "Forma de cada elemento"],
  "dot-grid.size": ["Tamaño", "Tamaño de cada forma, en píxeles"],
  "dot-grid.gapX": ["Separación X", "Espacio horizontal entre formas, en píxeles"],
  "dot-grid.gapY": ["Separación Y", "Espacio vertical entre formas, en píxeles"],
  "dot-grid.strokeWidth": ["Grosor de contorno", "En píxeles; necesita un color de contorno visible"],
  "dot-grid.sizeRange": ["Variación de tamaño", "0 deja todas las formas del mismo tamaño"],
  "dot-grid.opacityRange": ["Variación de opacidad", "0 deja todas las formas opacas"],

  "dot-orbit.size": ["Tamaño", "Radio del punto respecto a su celda"],
  "dot-orbit.sizeRange": ["Variación de tamaño", "0 deja todos los puntos del mismo tamaño"],
  "dot-orbit.spreading": ["Órbita", "Distancia máxima del giro; con 0 los puntos quedan quietos"],

  "god-rays.bloom": ["Resplandor", "Fuerza del color de resplandor"],
  "god-rays.intensity": ["Intensidad", "Visibilidad de los rayos"],
  "god-rays.density": ["Densidad", "Cantidad de rayos"],
  "god-rays.spotty": ["Largo", "Largo de los rayos"],
  "god-rays.midSize": ["Tamaño del brillo central", "Necesita brillo central mayor que 0"],
  "god-rays.midIntensity": ["Brillo central", "Intensidad del brillo del centro"],

  "grain-gradient.intensity": ["Intensidad", "Distorsión entre las bandas de color"],
  "grain-gradient.noise": ["Grano", "Grano sobre todo el fondo, también en lo negro; 0 deja el negro limpio"],
  "grain-gradient.shape": ["Forma", "Forma abstracta del degradado"],

  "mesh-gradient.distortion": ["Distorsión", "Fuerza de la distorsión orgánica"],
  "mesh-gradient.swirl": ["Remolino", "Fuerza del vórtice"],

  "metaballs.count": ["Cantidad", "Número de gotas"],
  "metaballs.size": ["Tamaño", "Tamaño de las gotas"],

  "neuro-noise.brightness": ["Brillo", "Luminosidad de los cruces"],
  "neuro-noise.contrast": ["Contraste", "Nitidez entre el color medio y el fondo"],

  "perlin-noise.octaveCount": ["Octavas", "Más octavas dan más detalle"],
  "perlin-noise.persistence": ["Rugosidad", "Necesita más de 1 octava"],
  "perlin-noise.lacunarity": ["Compresión", "Salto de frecuencia entre octavas; necesita más de 1 octava"],

  "pulsing-border.roundness": ["Redondez", "Radio de las esquinas"],
  "pulsing-border.thickness": ["Grosor", "Ancho base del borde"],
  "pulsing-border.softness": ["Suavidad", "Nitidez del borde: 0 es un borde duro, 1 uno difuso"],
  "pulsing-border.aspectRatio": ["Proporción", "Proporción del efecto"],
  "pulsing-border.intensity": ["Intensidad", "Grosor de cada mancha de color"],
  "pulsing-border.bloom": ["Resplandor", "0 es mezcla normal, 1 mezcla aditiva"],
  "pulsing-border.spots": ["Manchas por color", "Número de manchas de cada color"],
  "pulsing-border.spotSize": ["Tamaño de mancha", "Tamaño angular de cada mancha"],
  "pulsing-border.pulse": ["Pulso", "Animación de pulso"],
  "pulsing-border.smoke": ["Humo", "Forma difusa alrededor del borde"],
  "pulsing-border.smokeSize": ["Tamaño del humo", "Necesita humo mayor que 0"],
  "pulsing-border.margin": ["Margen", "Distancia a los bordes del contenedor; los márgenes por lado lo sustituyen"],
  "pulsing-border.marginLeft": ["Margen izquierdo", ""],
  "pulsing-border.marginRight": ["Margen derecho", ""],
  "pulsing-border.marginTop": ["Margen superior", ""],
  "pulsing-border.marginBottom": ["Margen inferior", ""],

  "simplex-noise.softness": ["Suavidad", "Transición entre colores; necesita 2 colores o más"],

  "smoke-ring.thickness": ["Grosor", "Grosor del anillo"],
  "smoke-ring.radius": ["Radio", "Radio del anillo"],
  "smoke-ring.innerShape": ["Relleno interior", "Relleno del centro; necesita radio mayor que 0"],
  "smoke-ring.noiseIterations": ["Capas de ruido", "Más capas dan más detalle"],
  "smoke-ring.noiseScale": ["Escala del ruido", "Frecuencia del ruido"],

  "spiral.density": ["Perspectiva", "Espaciado que simula perspectiva; 0 da una espiral plana"],
  "spiral.distortion": ["Distorsión", "Deformación a lo largo de la espiral"],
  "spiral.strokeWidth": ["Grosor de línea", "Grosor de la curva"],
  "spiral.strokeTaper": ["Afinado", "Cuánto se adelgaza la línea lejos del centro"],
  "spiral.strokeCap": ["Remate central", "Grosor extra en el centro; necesita un grosor distinto de 0.5"],

  "static-mesh-gradient.positions": ["Posición de colores", "Colocación de las manchas de color"],
  "static-mesh-gradient.waveX": ["Onda X", "Ondulación horizontal"],
  "static-mesh-gradient.waveXShift": ["Fase X", "Desfase de la onda horizontal"],
  "static-mesh-gradient.waveY": ["Onda Y", "Ondulación vertical"],
  "static-mesh-gradient.waveYShift": ["Fase Y", "Desfase de la onda vertical"],

  "static-radial-gradient.radius": ["Radio", "Tamaño de la forma"],
  "static-radial-gradient.focalDistance": ["Distancia focal", "Distancia del punto focal al centro"],
  "static-radial-gradient.falloff": ["Caída", "Reparto de los colores; 0 los reparte por igual"],
  "static-radial-gradient.focalAngle": ["Ángulo focal", "En grados; necesita distancia focal mayor que 0"],
  "static-radial-gradient.distortion": ["Distorsión", "Distorsión radial"],
  "static-radial-gradient.distortionShift": ["Desfase de distorsión", "Necesita distorsión mayor que 0"],
  "static-radial-gradient.distortionFreq": ["Frecuencia de distorsión", "Necesita distorsión mayor que 0"],

  "swirl.bandCount": ["Bandas", "Número de bandas de color; 0 da anillos concéntricos"],
  "swirl.twist": ["Torsión", "Fuerza del vórtice; 0 da sectores rectos"],
  "swirl.center": ["Centro", "Distancia al centro a la que empiezan los colores; necesita torsión mayor que 0"],

  "voronoi.distortion": ["Distorsión", "Desplazamiento de los centros de las celdas"],
  "voronoi.gap": ["Junta", "Ancho del borde entre celdas"],
  "voronoi.glow": ["Brillo interior", "Sombra radial dentro de cada celda"],

  "warp.distortion": ["Distorsión", "Fuerza de la distorsión con ruido"],
  "warp.swirl": ["Remolino", "Fuerza del remolino"],
  "warp.swirlIterations": ["Iteraciones", "Capas de remolino; necesita remolino mayor que 0"],
  "warp.shape": ["Patrón base", "Patrón que se deforma"],
  "warp.shapeScale": ["Escala del patrón", "Zoom del patrón base"],

  "waves.amplitude": ["Amplitud", "Altura de la onda"],
  "waves.frequency": ["Frecuencia", "Necesita amplitud mayor que 0"],
  "waves.spacing": ["Espaciado", "Espacio entre líneas"],
  "waves.proportion": ["Proporción", "Mezcla entre el color principal y el fondo"],
  "waves.shape": ["Forma de línea", "0 zigzag, 1 senoidal, 2 y 3 ondas irregulares"],
};

export const OPCION_ES = {
  wave: "Onda", dots: "Puntos", truchet: "Truchet", corners: "Esquinas", ripple: "Ondas", blob: "Mancha", sphere: "Esfera",
  simplex: "Ruido", warp: "Deformación", swirl: "Remolino",
  random: "Aleatorio", "2x2": "2×2", "4x4": "4×4", "8x8": "8×8",
  circle: "Círculo", diamond: "Rombo", square: "Cuadrado", triangle: "Triángulo",
  checks: "Cuadros", stripes: "Franjas", edge: "Borde",
  auto: "Automática", none: "Sin ajuste", contain: "Contener", cover: "Cubrir",
};

export const MAX_COLORES = {
  "color-panels": 7, "dot-orbit": 10, "god-rays": 5, "grain-gradient": 7, "mesh-gradient": 10, metaballs: 8,
  "pulsing-border": 5, "simplex-noise": 10, "smoke-ring": 10, "static-mesh-gradient": 10,
  "static-radial-gradient": 10, swirl: 10, voronoi: 5, warp: 10,
};

// Colores de marca (04_Sitio-Nuevo/foundations-figma-webflow.md)
export const MARCA = [
  ["#E43330", "Red"], ["#000000", "Black"], ["#1A1A1A", "Black-Light"], ["#343435", "Gray 800"],
  ["#656565", "Grey-Dark"], ["#9E9E9E", "Grey-Medium"], ["#D8D8D8", "Grey-Light"], ["#F4F4F4", "Gray 50"],
  ["#FFFFFF", "White"], ["#8088FF", "Blue 300"],
];

// Presets propios además de los de la librería
export const PRESETS_EXTRA = {
  "grain-gradient": [{ name: "Spicy", params: { colors: ["#E43330"], colorBack: "#000000", noise: 0 } }],
};
