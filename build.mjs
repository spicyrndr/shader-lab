// Compila el script del sitio y el Shader Lab a partir de los envoltorios de Paper Shaders.
// Uso: npm install && node build.mjs
import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, cpSync } from "node:fs";

// 1. Versión para el sitio: sin los presets de la librería, que solo usa el Shader Lab
mkdirSync("src/shaders-sitio", { recursive: true });
for (const archivo of readdirSync("src/shaders")) {
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
};
mkdirSync("dist", { recursive: true });
await build({ ...comun, entryPoints: ["src/sitio.js"], outfile: "dist/sitio.min.js" });
copyFileSync("dist/sitio.min.js", "dist/sitio.txt");
await build({ ...comun, entryPoints: ["src/configurador.js"], outfile: "dist/configurador.min.js", loader: { ".txt": "text" } });

// 3. Salidas: la página del Shader Lab y el código para el footer de Webflow
const sitio = readFileSync("dist/sitio.min.js", "utf8").trim();
const bundle = readFileSync("dist/configurador.min.js", "utf8").replace(/<\/script/gi, "<\/script");
const pagina = readFileSync("src/plantilla.html", "utf8").replace("/*BUNDLE*/", () => bundle);
const AVISO = "/* Powered by Paper Shaders — https://shaders.paper.design (Apache-2.0) */";

// Código para el Footer code de Webflow
writeFileSync("dist/footer-webflow.html", `<script type="module">\n${AVISO}\n${sitio}\n</script>\n`);

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
