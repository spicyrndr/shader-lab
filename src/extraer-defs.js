import { SHADERS } from "./registro.js";
const out = {};
for (const [id, s] of Object.entries(SHADERS)) {
  out[id] = {
    name: s.def.name, description: s.def.description,
    params: s.def.params.map(({ name, type, min, max, step, options, isColor, description }) => ({ name, type, min, max, step, options, isColor, description })),
    defaults: s.presets[0].params,
    presets: s.presets.map((p) => p.name),
  };
}
console.log(JSON.stringify(out, null, 1));
