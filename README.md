# Spicy Shader Lab

Configurador de fondos animados de SPICY RNDR, publicado en **https://shaderlab.spicyrender.studio**.

Permite elegir entre 20 shaders, ajustar colores y valores con vista previa en vivo y copiar el código para Webflow. Del mismo código sale el script del sitio, que convierte en fondo animado cualquier Div con el atributo `data-shader`. Lo que se ve en el Shader Lab es lo que sale en el sitio.

Usa [Paper Shaders](https://shaders.paper.design) 0.0.81 (licencia Apache 2.0, ver `licencias/`), sin React.

## Compilar

Requiere Node 20 o posterior.

```bash
npm install
node build.mjs
```

| Salida | Uso |
|---|---|
| `dist/site/` | Sitio publicado en el subdominio, con los íconos de spicyrender.studio |
| `dist/footer-webflow.html` | Script para *Site settings → Custom code → Footer code* de Webflow |
| `dist/shader-lab.html` | La misma página sin `<head>`, para publicarla como Artifact en claude.ai |

## Publicación

Cada push a `main` compila y publica el sitio en GitHub Pages (`.github/workflows/deploy.yml`).

Configuración, una sola vez:

1. En el repositorio, *Settings → Pages → Build and deployment*: elegir **GitHub Actions** como origen.
2. En *Settings → Pages → Custom domain*: escribir `shaderlab.spicyrender.studio` y guardar.
3. En el DNS de spicyrender.studio: crear un registro **CNAME** con nombre `shaderlab` y valor `spicyrndr.github.io`.
4. Cuando GitHub emita el certificado, activar **Enforce HTTPS**.
5. Recomendado: verificar el dominio `spicyrender.studio` en *Settings → Pages* de la cuenta, para que nadie más pueda usar sus subdominios en GitHub Pages.

La página lleva `noindex`: es una herramienta interna y no aparece en buscadores.

## Uso en Webflow

1. Pegue `dist/footer-webflow.html` en el *Footer code* del sitio (una sola vez, y de nuevo solo si se recompila).
2. Para cada fondo: un Div con posición *absolute* en 0 por los cuatro lados, dentro de un contenedor *relative*, con los atributos que da el Shader Lab (`data-shader` y, si hace falta, `data-shader-params`).
3. Publique para verlo; el código personalizado no corre en el canvas del Designer.

## Qué hay en `src/`

| Archivo | Contenido |
|---|---|
| `shaders/` | Envoltorios de `@paper-design/shaders-react@0.0.81` (`dist/shaders/*.js`), copiados sin cambios. `react-stub.js` sustituye a React para que devuelvan los uniforms en lugar de un componente |
| `defs/` | Rangos y descripciones de cada parámetro, del repositorio de Paper (`docs/src/shader-defs`, commit `43cd68d`, versión 0.0.81) |
| `textos.js` | Textos en español, grupos de la biblioteca, paleta de marca y presets propios (por ejemplo «Spicy») |
| `sitio.js` | Script del sitio. Lee `data-shader`, `data-shader-params` y atributos sueltos como `data-colors` |
| `configurador.js`, `plantilla.html` | Interfaz del Shader Lab |
| `paper.js` | Carga la librería desde jsDelivr y comparte una sola textura de ruido |

`build.mjs` crea `src/shaders-sitio/` quitando los presets que el sitio no usa, para que el script pese unos 26 KB. Los íconos de `public/` son los mismos del sitio de Spicy Render.

## Actualizar la versión de Paper

1. Cambie la versión en `src/paper.js` (URL del CDN) y en `package.json`.
2. Copie de nuevo `dist/shaders/*.js` de `@paper-design/shaders-react` y las definiciones del commit de esa versión.
3. Compruebe que no falten textos en español:

```bash
npx esbuild src/revisar-textos.js --bundle --platform=node --format=esm --alias:react=./src/react-stub.js --alias:react/jsx-runtime=./src/react-stub.js --alias:@paper-design/shaders-react=./src/react-presets.js --outfile=tmp/revisar.mjs && node tmp/revisar.mjs
```

Los shaders que necesitan una imagen de entrada (textura de papel, vidrio acanalado, metal líquido) no están incluidos.
