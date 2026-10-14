import { SHADERS } from "./registro-sitio.js";
import { texturasListas, montar } from "./montaje.js";

const sinMovimiento = matchMedia("(prefers-reduced-motion: reduce)").matches;

function leerParametros(el, defaults) {
  const params = {};
  // Atributos sueltos (data-colors, data-noise…), compatibles con la primera versión del script
  for (const [clave, def] of Object.entries(defaults)) {
    const v = el.dataset[clave];
    if (v === undefined || v === "") continue;
    if (Array.isArray(def)) params[clave] = v.split(",").map((c) => c.trim());
    else if (typeof def === "number") params[clave] = Number(v);
    else if (typeof def === "boolean") params[clave] = v === "true";
    else params[clave] = v;
  }
  if (el.dataset.shaderParams) {
    try {
      Object.assign(params, JSON.parse(el.dataset.shaderParams));
    } catch {
      console.warn("Shader: data-shader-params no es un JSON válido", el);
    }
  }
  return params;
}

await texturasListas;

for (const el of document.querySelectorAll("[data-shader]")) {
  const entrada = SHADERS[el.dataset.shader];
  if (!entrada) {
    console.warn(`Shader: no existe la variante "${el.dataset.shader}"`, el);
    continue;
  }
  try {
    montar(el, entrada, leerParametros(el, entrada.defaults), { pausado: sinMovimiento });
  } catch (e) {
    console.warn("Shader: no se pudo montar", el, e);
  }
}
