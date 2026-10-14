// Versión alojada en shaderlab.spicyrender.studio: cada página descarga solo los shaders que usa
import { SHADERS } from "./registro-remoto.js";
import { iniciar } from "./sitio-comun.js";

await iniciar((id) => SHADERS[id]?.());
