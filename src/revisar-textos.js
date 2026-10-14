import { SHADERS } from "./registro.js";
import { PARAM_ES, SHADER_ES, OPCION_ES, GRUPOS } from "./textos.js";
const OCULTOS = new Set(["frame", "width", "height", "worldWidth", "worldHeight", "originX", "originY", "minPixelRatio", "maxPixelCount", "image", "suspendWhenProcessingImage"]);
const faltan = [];
for (const [id, s] of Object.entries(SHADERS)) {
  if (!SHADER_ES[id]) faltan.push("shader " + id);
  for (const p of s.def.params) {
    if (OCULTOS.has(p.name)) continue;
    if (!PARAM_ES[`${id}.${p.name}`] && !PARAM_ES[p.name]) faltan.push(`${id}.${p.name}`);
    for (const o of p.options ?? []) { const v = typeof o === "string" ? o : o.name; if (p.type === "enum" && !OPCION_ES[`${p.name}.${v}`] && !OPCION_ES[v]) faltan.push(`opción ${p.name}.${v}`); }
    if (!(p.name in s.presets[0].params) && p.name !== "colors") faltan.push(`sin valor base: ${id}.${p.name}`);
  }
}
const enGrupos = GRUPOS.flatMap((g) => g.ids);
for (const id of Object.keys(SHADERS)) if (!enGrupos.includes(id)) faltan.push("fuera de grupos " + id);
console.log(faltan.length ? faltan.join("\n") : "textos completos");
