import { ShaderMount, getShaderNoiseTexture } from "./paper.js";

// La textura de ruido tiene que estar cargada antes de montar cualquier shader
export const texturasListas = getShaderNoiseTexture().decode();

export function montar(el, entrada, params, { pausado = false, atributosGL } = {}) {
  const o = entrada.build({ ...params });
  return new ShaderMount(
    el,
    o.fragmentShader,
    o.uniforms,
    atributosGL ?? o.webGlContextAttributes,
    pausado ? 0 : (o.speed ?? 0),
    o.frame ?? 0,
    o.minPixelRatio,
    o.maxPixelCount,
    o.mipmaps
  );
}

export function actualizar(mount, entrada, params, { pausado = false } = {}) {
  const o = entrada.build({ ...params });
  mount.setUniforms(o.uniforms);
  mount.setSpeed(pausado ? 0 : (o.speed ?? 0));
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
