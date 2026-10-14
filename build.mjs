// Compila el script del sitio y el Shader Lab a partir de los envoltorios de Paper Shaders.
// Uso: npm install && node build.mjs
import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, cpSync } from "node:fs";

// 0. Registros generados a partir de src/shaders/ (agregar un shader = copiar su envoltorio y su definición)
const archivos = readdirSync("src/shaders").filter((f) => f.endsWith(".js")).sort();
const exportsDe = (texto) => texto.match(/export \{([^}]*)\};/)[1].split(",").map((n) => n.trim()).filter(Boolean);
const generado = "// Generado por build.mjs a partir de src/shaders/. No editar.";
const importsLab = [], importsSitio = [], reexports = [], filasLab = [], filasSitio = [], filasRemoto = [];
for (const archivo of archivos) {
  const id = archivo.replace(/\.js$/, "");
  const texto = readFileSync(`src/shaders/${archivo}`, "utf8");
  const nombres = exportsDe(texto);
  const comp = nombres.find((n) => /^[A-Z]/.test(n));
  const lista = nombres.find((n) => /Presets$/.test(n));
  const def = lista.replace(/Presets$/, "Def");
  const usaImagen = /\bu_image\b/.test(texto);
  importsLab.push(`import { ${comp}, ${lista} } from "./shaders/${archivo}";`, `import { ${def} } from "./defs/${id}-def.ts";`);
  importsSitio.push(`import { ${comp}, defaultPreset as d_${comp} } from "./shaders-sitio/${archivo}";`);
  reexports.push(`export { ${lista} } from "./shaders/${archivo}";`);
  filasLab.push(`  "${id}": { build: ${comp}, presets: ${lista}, def: ${def}, usaImagen: ${usaImagen} },`);
  filasSitio.push(`  "${id}": { build: ${comp}, defaults: d_${comp}.params, usaImagen: ${usaImagen} },`);
  filasRemoto.push(`  "${id}": () => import("./shaders-sitio/${archivo}").then((m) => ({ build: m.${comp}, defaults: m.defaultPreset.params, usaImagen: ${usaImagen} })),`);
}
writeFileSync("src/registro-remoto.js", [generado, "", "export const SHADERS = {", ...filasRemoto, "};", ""].join("\n"));
writeFileSync("src/registro.js", [generado, ...importsLab, "", "export const SHADERS = {", ...filasLab, "};", ""].join("\n"));
writeFileSync("src/registro-sitio.js", [generado, ...importsSitio, "", "export const SHADERS = {", ...filasSitio, "};", ""].join("\n"));
writeFileSync("src/react-presets.js", [generado, ...reexports, ""].join("\n"));

// 1. Versión para el sitio: sin los presets de la librería, que solo usa el Shader Lab
mkdirSync("src/shaders-sitio", { recursive: true });
for (const archivo of archivos) {
  const lineas = readFileSync(`src/shaders/${archivo}`, "utf8").split(/\r?\n/);
  const salida = [];
  let cierre = null;
  for (const l of lineas) {
    if (cierre) { if (l === cierre) cierre = null; continue; }
    const bloque = l.match(/^const (\w+) = ([[{])$/);
    if (bloque && bloque[1] !== "defaultPreset" && /Presets?$|^preset/.test(bloque[1])) { cierre = bloque[2] === "{" ? "};" : "];"; continue; }
    if (/^const \w+Presets = \[.*\];$/.test(l)) continue;
    salida.push(l);
  }
  const texto = salida.join("\n").replace(/export \{([^}]*)\};/, (_, nombres) =>
    `export { ${nombres.split(",").map((n) => n.trim()).filter((n) => n && !/Presets?$|^preset/.test(n) || n === "defaultPreset").join(", ")} };`);
  writeFileSync(`src/shaders-sitio/${archivo}`, texto);
}

// 2. Compilación
const comun = {
  bundle: true, format: "esm", minify: true, target: "es2022", legalComments: "none", logLevel: "warning",
  alias: { react: "./src/react-stub.js", "react/jsx-runtime": "./src/react-stub.js", "@paper-design/shaders": "./src/paper.js", "@paper-design/shaders-react": "./src/react-presets.js" },
  external: ["https://cdn.jsdelivr.net/*"],
  loader: { ".txt": "text", ".png": "dataurl", ".jpg": "dataurl", ".webp": "dataurl" },
};
mkdirSync("dist", { recursive: true });
await build({ ...comun, entryPoints: ["src/sitio.js"], outfile: "dist/sitio.min.js" });
copyFileSync("dist/sitio.min.js", "dist/sitio.txt");
// Versión alojada: un archivo de entrada estable y una parte por shader, que se descarga solo si la página la usa
await build({
  ...comun, entryPoints: { shaders: "src/sitio-remoto.js" }, outdir: "dist/site/sitio/v1",
  splitting: true, chunkNames: "partes/[name]-[hash]", banner: { js: "/* Powered by Paper Shaders — https://shaders.paper.design (Apache-2.0) */" },
});
await build({ ...comun, entryPoints: ["src/configurador.js"], outfile: "dist/configurador.min.js" });

// 3. Salidas
const AVISO = "/* Powered by Paper Shaders — https://shaders.paper.design (Apache-2.0) */";
const sitio = readFileSync("dist/sitio.min.js", "utf8").trim();
// Un "</script" dentro del código cerraría la etiqueta antes de tiempo
const bundle = readFileSync("dist/configurador.min.js", "utf8").replace(/<\/script/gi, "<\\/script");
const pagina = readFileSync("src/plantilla.html", "utf8").replace("/*BUNDLE*/", () => bundle);

// Código para el Footer code de Webflow: completo, o una línea que carga la versión alojada
writeFileSync("dist/footer-webflow.html", `<script type="module">\n${AVISO}\n${sitio}\n</script>\n`);
writeFileSync("dist/footer-webflow-alojado.html", `<script type="module" src="https://shaderlab.spicyrender.studio/sitio/v1/shaders.js"></script>\n`);

// Página para el Artifact de claude.ai (sin <head>: la publicación agrega el esqueleto)
writeFileSync("dist/shader-lab.html", pagina);

// Sitio independiente (subdominio): documento completo con los íconos del sitio de Spicy Render
const corte = pagina.indexOf('<div class="app">');
const documento = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Configurador de fondos animados de SPICY RNDR: elige un shader, ajusta colores y valores en vivo y copia el código para Webflow.">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#0b0b0c">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-claro-32.png" media="(prefers-color-scheme: light)">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-oscuro-32.png" media="(prefers-color-scheme: dark)">
<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
${pagina.slice(0, corte).trim()}
</head>
<body>
${pagina.slice(corte).trim()}
</body>
</html>
`;
mkdirSync("dist/site", { recursive: true });
writeFileSync("dist/site/index.html", documento);
cpSync("public", "dist/site", { recursive: true });
cpSync("licencias", "dist/site/licencias", { recursive: true });

console.log(`sitio ${sitio.length} · Shader Lab ${pagina.length} → dist/ y dist/site/`);
