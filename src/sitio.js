// Versión para pegar entera en el Footer code: incluye todos los shaders
import { SHADERS } from "./registro-sitio.js";
import { iniciar } from "./sitio-comun.js";

await iniciar(async (id) => SHADERS[id]);
