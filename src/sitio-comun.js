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

// cargarEntrada(id) devuelve { build, defaults, usaImagen } o undefined si el shader no existe
export async function iniciar(cargarEntrada) {
  const elementos = [...document.querySelectorAll("[data-shader]")];
  if (!elementos.length) return;
  await texturasListas;
  await Promise.all(elementos.map(async (el) => {
    let entrada;
    try {
      entrada = await cargarEntrada(el.dataset.shader);
    } catch (e) {
      console.warn(`Shader: no se pudo cargar "${el.dataset.shader}"`, e);
      return;
    }
    if (!entrada) {
      console.warn(`Shader: no existe la variante "${el.dataset.shader}"`, el);
      return;
    }
    const params = leerParametros(el, entrada.defaults);
    // La imagen sale de data-shader-params, de data-image o de un elemento Image dentro del Div
    // (este último sirve con imágenes de Assets y con campos de imagen del CMS)
    const img = el.querySelector("img");
    if (entrada.usaImagen && !params.image) {
      if (el.dataset.image) params.image = el.dataset.image;
      else if (img) params.image = img.currentSrc || img.src;
    }
    try {
      await montar(el, entrada, params, { pausado: sinMovimiento });
      // La imagen original queda en la página (texto alternativo, respaldo si falla WebGL), pero oculta
      if (img) img.style.opacity = "0";
    } catch (e) {
      console.warn("Shader: no se pudo montar", el, e);
    }
  }));
}
