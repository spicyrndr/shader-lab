import { ShaderMount, getShaderNoiseTexture, emptyPixel } from "./paper.js";
import { setMinImageSize } from "./set-min-image-size.js";

// La textura de ruido tiene que estar cargada antes de montar cualquier shader
export const texturasListas = getShaderNoiseTexture().decode();

// Las imágenes se cargan una vez por URL. Las de Webflow (Assets y CMS) permiten CORS, así que sirven como textura.
const imagenes = new Map();
function cargarImagen(url) {
  const src = url || emptyPixel;
  if (!imagenes.has(src)) {
    imagenes.set(src, new Promise((resolver, rechazar) => {
      const img = new Image();
      if (!/^(data|blob):/.test(src)) img.crossOrigin = "anonymous";
      img.onload = () => { setMinImageSize(img); resolver(img); };
      img.onerror = () => { imagenes.delete(src); rechazar(new Error(`No se pudo cargar la imagen ${src.slice(0, 120)}`)); };
      img.src = src;
    }));
  }
  return imagenes.get(src);
}

// Devuelve lo que el envoltorio pasaría a ShaderMount, con las imágenes ya cargadas.
// Los shaders de logo procesan la imagen con suspend(): mientras tanto lanzan una promesa y se reintenta.
export async function preparar(entrada, params) {
  for (let intento = 0; intento < 20; intento++) {
    let salida;
    try {
      salida = entrada.build({ suspendWhenProcessingImage: true, ...params });
    } catch (e) {
      if (e && typeof e.then === "function") { await e; continue; }
      throw e;
    }
    const uniforms = { ...salida.uniforms };
    await Promise.all(Object.entries(uniforms).map(async ([k, v]) => {
      if (typeof v === "string") uniforms[k] = await cargarImagen(v);
    }));
    return { ...salida, uniforms };
  }
  throw new Error("Shader: la imagen no terminó de procesarse");
}

export function crearMount(el, salida, { pausado = false, atributosGL } = {}) {
  return new ShaderMount(
    el,
    salida.fragmentShader,
    salida.uniforms,
    atributosGL ?? salida.webGlContextAttributes,
    pausado ? 0 : (salida.speed ?? 0),
    salida.frame ?? 0,
    salida.minPixelRatio,
    salida.maxPixelCount,
    salida.mipmaps
  );
}

export async function montar(el, entrada, params, opciones = {}) {
  return crearMount(el, await preparar(entrada, params), opciones);
}

export function aplicar(mount, salida, { pausado = false } = {}) {
  mount.setUniforms(salida.uniforms);
  mount.setSpeed(pausado ? 0 : (salida.speed ?? 0));
}

// ShaderMount.dispose() no libera el contexto WebGL ni quita el canvas; los navegadores limitan los contextos abiertos
export function desmontar(mount) {
  if (!mount) return;
  const canvas = mount.canvasElement;
  const el = mount.parentElement;
  mount.dispose();
  canvas.getContext("webgl2")?.getExtension("WEBGL_lose_context")?.loseContext();
  canvas.remove();
  if (el) {
    delete el.paperShaderMount;
    el.removeAttribute("data-paper-shader");
  }
}
