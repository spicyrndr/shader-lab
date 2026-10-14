import * as P from "https://cdn.jsdelivr.net/npm/@paper-design/shaders@0.0.81/+esm";
export * from "https://cdn.jsdelivr.net/npm/@paper-design/shaders@0.0.81/+esm";

// Una sola textura de ruido compartida, para poder cargarla antes de montar y no recrearla en cada cambio
let ruido;
export function getShaderNoiseTexture() {
  if (!ruido) ruido = P.getShaderNoiseTexture();
  return ruido;
}
