# Spicy Shader Lab

Configurador de fondos animados de SPICY RNDR, publicado en **https://shaderlab.spicyrender.studio**.

Permite elegir entre 30 shaders (20 fondos generativos, 7 filtros de imagen y 3 animaciones de logo), ajustar colores (con opacidad, hasta transparencia total) y valores con vista previa en vivo y copiar el código para Webflow. La vista previa se puede ver en pantalla completa, y la biblioteca, los ajustes y el bloque de código se agrandan o achican arrastrando sus bordes (doble clic vuelve a la medida original). Del mismo código sale el script del sitio, que convierte en fondo animado cualquier Div con el atributo `data-shader`. Lo que se ve en el Shader Lab es lo que sale en el sitio.

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
| `dist/site/sitio/v1/` | Script del sitio alojado: `shaders.js` y una parte por shader en `partes/` |
| `dist/footer-webflow-alojado.html` | La línea para el *Footer code* de Webflow que carga el script alojado (recomendada) |
| `dist/footer-webflow.html` | Alternativa: el script completo con los 30 shaders, para pegarlo en el *Footer code* |
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

1. En el *Footer code* del sitio, pegue una sola vez esta línea:

   ```html
   <script type="module" src="https://shaderlab.spicyrender.studio/sitio/v1/shaders.js"></script>
   ```

   Cada página descarga solo los shaders que usa y las mejoras llegan al publicar este repositorio. Si no quiere depender del subdominio, pegue en su lugar `dist/footer-webflow.html` (unos 47 000 caracteres; hay que volver a pegarlo con cada cambio).
2. Para cada fondo: un Div con posición *absolute* en 0 por los cuatro lados, dentro de un contenedor *relative*, con los atributos que da el Shader Lab (`data-shader` y, si hace falta, `data-shader-params`).
3. Publique para verlo; el código personalizado no corre en el canvas del Designer.

`/sitio/v1/` no cambia de forma incompatible: si algún día cambian los atributos, irá en `/sitio/v2/`.

### Filtros de imagen y animaciones de logo

El script toma la imagen, en este orden, de:

1. `image` dentro de `data-shader-params` (una URL).
2. El atributo `data-image` (una URL).
3. Un elemento **Image** dentro del Div. Sirve con imágenes de *Assets* y con campos de imagen del CMS. El script la usa como textura y la oculta; si WebGL falla, queda visible.

Las imágenes de Webflow (Assets y CMS) permiten CORS, así que funcionan tal cual. Para las animaciones de logo:

- *Metal líquido* y *Humo de gema* toman la silueta de la transparencia: use un PNG o SVG con fondo transparente.
- *Mapa de calor* usa la luminosidad: el logo debe ser negro u oscuro sobre fondo transparente o blanco. Un logo blanco no se ve.

## Qué hay en `src/`

| Archivo | Contenido |
|---|---|
| `shaders/` | Envoltorios de `@paper-design/shaders-react@0.0.81` (`dist/shaders/*.js`), copiados sin cambios. `react-stub.js` sustituye a React para que devuelvan los uniforms en lugar de un componente |
| `defs/` | Rangos y descripciones de cada parámetro, del repositorio de Paper (`docs/src/shader-defs`, commit `43cd68d`, versión 0.0.81) |
| `textos.js` | Textos en español, grupos de la biblioteca, paleta de marca y presets propios (por ejemplo «Spicy») |
| `sitio-comun.js` | Lógica del script del sitio: lee `data-shader`, `data-shader-params`, atributos sueltos como `data-colors` y la imagen |
| `sitio.js`, `sitio-remoto.js` | Entradas del script completo y del alojado (este carga cada shader con `import()`) |
| `montaje.js` | Prepara cada shader: carga imágenes y espera el procesado de los logos (`suspend.js`, de la librería) |
| `configurador.js`, `plantilla.html` | Interfaz del Shader Lab |
| `paper.js` | Carga la librería desde jsDelivr y comparte una sola textura de ruido |

`build.mjs` genera los registros (`registro*.js`) a partir de `src/shaders/`, y crea `src/shaders-sitio/` quitando los presets que el sitio no usa. Agregar un shader es copiar su envoltorio y su definición, y escribir sus textos. Los íconos de `public/` son los mismos del sitio de Spicy Render, y `muestras/` tiene el logo y la foto de muestra del Shader Lab.

## Actualizar la versión de Paper

1. Cambie la versión en `src/paper.js` (URL del CDN) y en `package.json`.
2. Copie de nuevo `dist/shaders/*.js` de `@paper-design/shaders-react` y las definiciones del commit de esa versión.
3. Compruebe que no falten textos en español:

```bash
npx esbuild src/revisar-textos.js --bundle --platform=node --format=esm --alias:react=./src/react-stub.js --alias:react/jsx-runtime=./src/react-stub.js --alias:@paper-design/shaders-react=./src/react-presets.js --outfile=tmp/revisar.mjs && node tmp/revisar.mjs
```

