import { SHADERS } from "./registro.js";
import { texturasListas, montar, actualizar, desmontar } from "./montaje.js";
import { GRUPOS, SHADER_ES, PARAM_ES, OPCION_ES, MAX_COLORES, MARCA, PRESETS_EXTRA } from "./textos.js";
import scriptSitio from "../dist/sitio.txt";

const OCULTOS = new Set(["frame", "width", "height", "worldWidth", "worldHeight", "originX", "originY", "minPixelRatio", "maxPixelCount"]);
const ENCUADRE = new Set(["scale", "rotation", "offsetX", "offsetY", "fit"]);
const ASPECTOS = {
  seccion: { ratio: 16 / 9, nombre: "Sección 16:9" },
  tarjeta: { ratio: 4 / 5, nombre: "Tarjeta 4:5" },
  banda: { ratio: 3, nombre: "Banda 3:1" },
  circulo: { ratio: 1, nombre: "Círculo" },
};
const CLAVE_GUARDADO = "spicy-shader-lab-v1";
const reducirMovimiento = matchMedia("(prefers-reduced-motion: reduce)").matches;
const SCRIPT_FOOTER = `<script type="module">\n${scriptSitio.trim()}\n<\/script>`;

const $ = (sel, raiz = document) => raiz.querySelector(sel);
const crear = (etiqueta, props = {}, ...hijos) => {
  const el = document.createElement(etiqueta);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") el.className = v;
    else if (k === "text") el.textContent = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if (v === true) el.setAttribute(k, "");
    else if (v !== false && v != null) el.setAttribute(k, v);
  }
  el.append(...hijos.filter((h) => h != null));
  return el;
};
const clonar = (o) => JSON.parse(JSON.stringify(o));

// ---------- Datos ----------

function presetsDe(id) {
  const base = SHADERS[id].presets;
  const extra = (PRESETS_EXTRA[id] ?? []).map((p) => ({ name: p.name, params: { ...base[0].params, ...p.params } }));
  return [...extra, ...base];
}
const nombrePreset = (n) => (n === "Default" ? "Base" : n);
const paramsVisibles = (id) => SHADERS[id].def.params.filter((p) => !OCULTOS.has(p.name));
function textoParam(id, nombre, defDesc) {
  return PARAM_ES[`${id}.${nombre}`] ?? PARAM_ES[nombre] ?? [nombre, defDesc ?? ""];
}

function pasoDe(p) {
  if (p.step) return p.step;
  const rango = (p.max ?? 3) - (p.min ?? 0);
  if (rango <= 0.2) return 0.001;
  if (rango <= 10) return 0.01;
  if (rango <= 50) return 0.1;
  return 1;
}
const redondear = (v) => Math.round(v * 10000) / 10000;

function iguales(a, b) {
  if (Array.isArray(a) || Array.isArray(b)) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((x, i) => iguales(x, b[i]));
  }
  if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) < 1e-9;
  if (typeof a === "string" && typeof b === "string") return a.toLowerCase() === b.toLowerCase();
  return a === b;
}

function diferencias(id, params) {
  const base = SHADERS[id].presets[0].params;
  const orden = SHADERS[id].def.params.map((p) => p.name);
  const claves = Object.keys(params).sort((a, b) => (orden.indexOf(a) + 1 || 99) - (orden.indexOf(b) + 1 || 99));
  const out = {};
  for (const k of claves) {
    if (iguales(params[k], base[k])) continue;
    out[k] = typeof params[k] === "number" ? redondear(params[k]) : params[k];
  }
  return out;
}

// ---------- Estado ----------

function estadoInicial() {
  try {
    const g = JSON.parse(localStorage.getItem(CLAVE_GUARDADO) ?? "null");
    if (g && SHADERS[g.id]) {
      return {
        id: g.id,
        params: { ...SHADERS[g.id].presets[0].params, ...g.params },
        preset: g.preset ?? null,
        aspecto: ASPECTOS[g.aspecto] ? g.aspecto : "seccion",
        texto: ["claro", "oscuro", "ninguno"].includes(g.texto) ? g.texto : "claro",
        pausado: reducirMovimiento,
        ranura: "colors.0",
        pestana: g.pestana ?? "atributos",
      };
    }
  } catch {}
  const spicy = presetsDe("grain-gradient")[0];
  return {
    id: "grain-gradient", params: clonar(spicy.params), preset: spicy.name, aspecto: "seccion",
    texto: "claro", pausado: reducirMovimiento, ranura: "colors.0", pestana: "atributos",
  };
}
const estado = estadoInicial();

function guardar() {
  try {
    localStorage.setItem(CLAVE_GUARDADO, JSON.stringify({
      id: estado.id, params: diferencias(estado.id, estado.params), preset: estado.preset,
      aspecto: estado.aspecto, texto: estado.texto, pestana: estado.pestana,
    }));
  } catch {}
}

// ---------- Visor ----------

const lienzo = $("#lienzo");
const marco = $("#marco");
let mount = null;

function montarVisor() {
  desmontar(mount);
  mount = null;
  $("#error-visor").hidden = true;
  try {
    mount = montar(lienzo, SHADERS[estado.id], estado.params, { pausado: estado.pausado });
  } catch (e) {
    console.error(e);
    $("#error-visor").hidden = false;
  }
  actualizarHud();
  requestAnimationFrame(() => setTimeout(actualizarHud, 0));
}

function refrescarVisor() {
  if (mount) actualizar(mount, SHADERS[estado.id], estado.params, { pausado: estado.pausado });
}

function actualizarHud() {
  const c = mount?.canvasElement;
  $("#hud-id").textContent = estado.id;
  $("#hud-res").textContent = c && c.width ? `${c.width} × ${c.height} px` : "";
  $("#hud-estado").textContent = estado.pausado ? "En pausa" : "";
}
new ResizeObserver(() => requestAnimationFrame(actualizarHud)).observe(lienzo);

function aplicarAspecto() {
  const a = ASPECTOS[estado.aspecto];
  marco.style.setProperty("--ratio", a.ratio);
  marco.classList.toggle("es-circulo", estado.aspecto === "circulo");
  for (const b of document.querySelectorAll("[data-aspecto]")) b.setAttribute("aria-pressed", b.dataset.aspecto === estado.aspecto);
}
function aplicarTexto() {
  const m = $("#muestra");
  m.hidden = estado.texto === "ninguno";
  m.classList.toggle("es-oscuro", estado.texto === "oscuro");
  for (const b of document.querySelectorAll("[data-texto]")) b.setAttribute("aria-pressed", b.dataset.texto === estado.texto);
}
function aplicarPausa() {
  const b = $("#pausa");
  b.textContent = estado.pausado ? "Reproducir" : "Pausar";
  b.setAttribute("aria-pressed", estado.pausado);
  $("#aviso-movimiento").hidden = !(reducirMovimiento && estado.pausado);
  refrescarVisor();
  actualizarHud();
}

for (const b of document.querySelectorAll("[data-aspecto]")) b.addEventListener("click", () => { estado.aspecto = b.dataset.aspecto; aplicarAspecto(); guardar(); });
for (const b of document.querySelectorAll("[data-texto]")) b.addEventListener("click", () => { estado.texto = b.dataset.texto; aplicarTexto(); guardar(); });
$("#pausa").addEventListener("click", () => { estado.pausado = !estado.pausado; aplicarPausa(); });

// ---------- Biblioteca ----------

function construirBiblioteca() {
  const nav = $("#biblioteca-lista");
  nav.replaceChildren();
  for (const g of GRUPOS) {
    const lista = crear("div", { class: "grupo-lista" });
    for (const id of g.ids) {
      lista.append(crear("button", {
        class: "ficha", type: "button", "data-id": id, "aria-pressed": id === estado.id,
        onclick: () => elegirShader(id),
      }, crear("span", { class: "mini", "aria-hidden": "true" }), crear("span", { class: "ficha-nombre", text: SHADER_ES[id][0] })));
    }
    nav.append(crear("section", { class: "grupo" }, crear("h3", { class: "rotulo", text: g.nombre }), lista));
  }
}

function marcarFicha() {
  for (const f of document.querySelectorAll(".ficha")) f.setAttribute("aria-pressed", f.dataset.id === estado.id);
}

// El ResizeObserver de ShaderMount dibuja el primer cuadro dentro del siguiente frame
const trasUnCuadro = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));

async function generarMiniaturas() {
  const taller = crear("div", { class: "taller", "aria-hidden": "true" });
  document.body.append(taller);
  for (const g of GRUPOS) {
    for (const id of g.ids) {
      const mini = $(`.ficha[data-id="${id}"] .mini`);
      let m = null;
      try {
        m = montar(taller, SHADERS[id], SHADERS[id].presets[0].params, { pausado: true, atributosGL: { preserveDrawingBuffer: true } });
        await trasUnCuadro();
        mini.style.backgroundImage = `url(${m.canvasElement.toDataURL("image/jpeg", 0.8)})`;
      } catch (e) {
        console.warn("Miniatura", id, e);
      }
      desmontar(m);
    }
  }
  taller.remove();
}

function elegirShader(id) {
  if (id === estado.id) return;
  const p = presetsDe(id)[0];
  estado.id = id;
  estado.params = clonar(p.params);
  estado.preset = p.name;
  estado.ranura = "colors.0";
  marcarFicha();
  montarVisor();
  construirAjustes();
  renderSalida();
  guardar();
}

// ---------- Ajustes ----------

function cambiar(nombre, valor, { reconstruir = false } = {}) {
  estado.params[nombre] = valor;
  estado.preset = null;
  refrescarVisor();
  if (reconstruir) construirAjustes();
  else {
    marcarModificados();
    marcarPresets();
  }
  renderSalida();
  guardar();
}

// Mismo shader: basta con cambiar valores, sin recompilar
function cargarValores() {
  if (!mount) return montarVisor();
  refrescarVisor();
  mount.setFrame(estado.params.frame ?? 0);
}

function aplicarPreset(p) {
  estado.params = clonar(p.params);
  estado.preset = p.name;
  cargarValores();
  construirAjustes();
  renderSalida();
  guardar();
}

function marcarPresets() {
  for (const c of document.querySelectorAll(".preset")) c.setAttribute("aria-pressed", c.dataset.nombre === estado.preset);
}

function marcarModificados() {
  const base = SHADERS[estado.id].presets[0].params;
  for (const el of document.querySelectorAll("[data-param]")) {
    el.classList.toggle("es-modificado", !iguales(estado.params[el.dataset.param], base[el.dataset.param]));
  }
  for (const r of document.querySelectorAll(".ranura")) r.classList.toggle("es-activa", r.dataset.ranura === estado.ranura);
}

function hexValido(v) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v);
}
function hexParaSelector(v) {
  if (/^#[0-9a-f]{3}$/i.test(v)) return "#" + [...v.slice(1)].map((c) => c + c).join("");
  return v.slice(0, 7);
}

function leerRanura(ranura) {
  const [nombre, i] = ranura.split(".");
  return i === undefined ? estado.params[nombre] : estado.params[nombre]?.[Number(i)];
}
function escribirRanura(ranura, hex) {
  const [nombre, i] = ranura.split(".");
  if (i === undefined) cambiar(nombre, hex);
  else {
    const lista = [...estado.params[nombre]];
    lista[Number(i)] = hex;
    cambiar(nombre, lista);
  }
}

// Conserva la transparencia (#rrggbbaa) al cambiar el color con el selector nativo
function conAlfa(anterior, nuevo) {
  return anterior && anterior.length === 9 ? nuevo + anterior.slice(7) : nuevo;
}

function filaColor(ranura, etiqueta, { quitar } = {}) {
  const valor = leerRanura(ranura) ?? "#000000";
  const selector = crear("input", {
    type: "color", class: "muestra-color", value: hexParaSelector(valor), "aria-label": `${etiqueta}: elegir color`,
    oninput: (e) => {
      const hex = conAlfa(leerRanura(ranura), e.target.value);
      texto.value = hex;
      selector.parentElement.style.setProperty("--c", hex);
      estado.ranura = ranura;
      escribirRanura(ranura, hex);
    },
    onfocus: () => { estado.ranura = ranura; marcarModificados(); },
  });
  const texto = crear("input", {
    type: "text", class: "hex", value: valor, spellcheck: "false", maxlength: "9", "aria-label": `${etiqueta}: valor hexadecimal`,
    onfocus: () => { estado.ranura = ranura; marcarModificados(); },
    onchange: (e) => {
      const v = e.target.value.trim();
      if (hexValido(v)) {
        selector.value = hexParaSelector(v);
        selector.parentElement.style.setProperty("--c", v);
        escribirRanura(ranura, v);
      } else e.target.value = leerRanura(ranura);
    },
  });
  return crear("div", {
    class: "ranura", "data-ranura": ranura,
    onclick: (e) => { if (e.target === e.currentTarget) { estado.ranura = ranura; marcarModificados(); } },
  },
  crear("span", { class: "chip-color", style: `--c:${valor}` }, selector),
  crear("span", { class: "ranura-nombre", text: etiqueta }),
  texto,
  quitar ? crear("button", { type: "button", class: "quitar", "aria-label": `Quitar ${etiqueta.toLowerCase()}`, text: "×", onclick: quitar }) : null);
}

function bloqueColores(id, colorParams) {
  const cont = crear("div", { class: "bloque" }, crear("h3", { class: "rotulo", text: "Color" }));
  const paleta = crear("div", { class: "paleta", role: "group", "aria-label": "Paleta de marca" });
  for (const [hex, nombre] of MARCA) {
    paleta.append(crear("button", {
      type: "button", class: "paleta-color", style: `--c:${hex}`, title: `${nombre} ${hex}`, "aria-label": `${nombre} ${hex}`,
      onclick: () => {
        const actual = leerRanura(estado.ranura);
        if (actual === undefined) estado.ranura = colorParams[0].isList ? `${colorParams[0].p.name}.0` : colorParams[0].p.name;
        escribirRanura(estado.ranura, hex);
        construirAjustes();
      },
    }));
  }
  cont.append(crear("div", { class: "paleta-cab" }, crear("span", { text: "Paleta de marca" }), crear("span", { class: "nota", text: "Se aplica al color seleccionado" })), paleta);

  for (const { p, isList } of colorParams) {
    const [etiqueta, ayuda] = textoParam(id, p.name, p.description);
    if (isList) {
      const lista = estado.params[p.name] ?? [];
      const max = MAX_COLORES[id] ?? 10;
      const grupo = crear("div", { class: "campo", "data-param": p.name },
        crear("div", { class: "campo-cab" }, crear("span", { class: "campo-nombre", text: etiqueta }), crear("code", { text: p.name }),
          crear("span", { class: "nota", text: `${lista.length} de ${max}` })));
      lista.forEach((_, i) => {
        grupo.append(filaColor(`${p.name}.${i}`, `Color ${i + 1}`, {
          quitar: lista.length > 1 ? () => {
            const nueva = estado.params[p.name].filter((_, j) => j !== i);
            estado.ranura = `${p.name}.${Math.max(0, i - 1)}`;
            cambiar(p.name, nueva, { reconstruir: true });
          } : null,
        }));
      });
      if (lista.length < max) {
        grupo.append(crear("button", {
          type: "button", class: "agregar", text: "+ Agregar color",
          onclick: () => {
            const nueva = [...estado.params[p.name], lista[lista.length - 1] ?? "#E43330"];
            estado.ranura = `${p.name}.${nueva.length - 1}`;
            cambiar(p.name, nueva, { reconstruir: true });
          },
        }));
      }
      cont.append(grupo);
    } else {
      cont.append(crear("div", { class: "campo", "data-param": p.name, title: ayuda }, filaColor(p.name, etiqueta)));
    }
  }
  return cont;
}

function campoNumero(id, p) {
  const [etiqueta, ayuda] = textoParam(id, p.name, p.description);
  const min = p.min ?? (p.name === "speed" ? 0 : -1);
  const max = p.max ?? (p.name === "speed" ? 3 : 1);
  const paso = p.name === "speed" ? 0.01 : pasoDe({ ...p, min, max });
  const v = estado.params[p.name] ?? min;
  const idControl = `p-${p.name}`;
  const numero = crear("input", {
    type: "number", class: "valor", value: redondear(v), step: paso, "aria-label": `${etiqueta}: valor exacto`,
    onchange: (e) => {
      const n = Number(e.target.value);
      if (Number.isFinite(n)) { rango.value = n; cambiar(p.name, n); } else e.target.value = redondear(estado.params[p.name]);
    },
  });
  const rango = crear("input", {
    type: "range", id: idControl, min, max, step: paso, value: v,
    oninput: (e) => { const n = Number(e.target.value); numero.value = redondear(n); cambiar(p.name, n); },
  });
  return crear("div", { class: "campo", "data-param": p.name },
    crear("div", { class: "campo-cab" }, crear("label", { class: "campo-nombre", for: idControl, text: etiqueta }), crear("code", { text: p.name }), numero),
    rango,
    ayuda ? crear("p", { class: "ayuda", text: ayuda }) : null);
}

function campoOpciones(id, p) {
  const [etiqueta, ayuda] = textoParam(id, p.name, p.description);
  let opciones = (p.options ?? []).map((o) => (typeof o === "string" ? o : o.name));
  if (p.name === "fit") opciones = ["none", "contain", "cover"];
  const valor = estado.params[p.name];
  let control;
  if (opciones.length <= 4) {
    control = crear("div", { class: "segmentos", role: "group", "aria-label": etiqueta });
    for (const o of opciones) {
      control.append(crear("button", {
        type: "button", class: "segmento", "aria-pressed": o === valor, text: OPCION_ES[o] ?? o,
        onclick: (e) => { cambiar(p.name, o); for (const b of control.children) b.setAttribute("aria-pressed", b === e.currentTarget); },
      }));
    }
  } else {
    control = crear("select", { id: `p-${p.name}`, class: "selector", onchange: (e) => cambiar(p.name, e.target.value) },
      ...opciones.map((o) => crear("option", { value: o, selected: o === valor, text: OPCION_ES[o] ?? o })));
  }
  return crear("div", { class: "campo", "data-param": p.name },
    crear("div", { class: "campo-cab" }, crear(opciones.length <= 4 ? "span" : "label", { class: "campo-nombre", for: opciones.length <= 4 ? null : `p-${p.name}`, text: etiqueta }), crear("code", { text: p.name })),
    control,
    ayuda ? crear("p", { class: "ayuda", text: ayuda }) : null);
}

function campoInterruptor(id, p) {
  const [etiqueta, ayuda] = textoParam(id, p.name, p.description);
  const idControl = `p-${p.name}`;
  return crear("div", { class: "campo", "data-param": p.name },
    crear("div", { class: "campo-cab" },
      crear("label", { class: "campo-nombre", for: idControl, text: etiqueta }), crear("code", { text: p.name }),
      crear("input", { type: "checkbox", role: "switch", id: idControl, class: "interruptor", checked: Boolean(estado.params[p.name]), onchange: (e) => cambiar(p.name, e.target.checked) })),
    ayuda ? crear("p", { class: "ayuda", text: ayuda }) : null);
}

function campo(id, p) {
  if (p.type === "boolean") return campoInterruptor(id, p);
  if (p.type === "enum") return campoOpciones(id, p);
  return campoNumero(id, p);
}

function construirAjustes() {
  const id = estado.id;
  const [nombre, descripcion] = SHADER_ES[id];
  const panel = $("#ajustes-cuerpo");
  const scroll = panel.scrollTop;
  const abierto = $("#encuadre")?.open ?? false;

  $("#ajustes-nombre").textContent = nombre;
  $("#ajustes-id").textContent = id;
  $("#ajustes-desc").textContent = descripcion;

  const presets = crear("div", { class: "presets", role: "group", "aria-label": "Puntos de partida" });
  for (const p of presetsDe(id)) {
    const colores = [p.params.colorBack, ...(p.params.colors ?? []), p.params.colorFront, p.params.colorMid, p.params.colorFill]
      .filter(Boolean).slice(0, 4);
    presets.append(crear("button", {
      type: "button", class: "preset", "data-nombre": p.name, "aria-pressed": p.name === estado.preset, onclick: () => aplicarPreset(p),
    }, crear("span", { class: "preset-colores", "aria-hidden": "true" }, ...colores.map((c) => crear("i", { style: `--c:${c}` }))), nombrePreset(p.name)));
  }

  const visibles = paramsVisibles(id);
  const colorParams = visibles.filter((p) => p.isColor).map((p) => ({ p, isList: p.type === "string[]" }));
  const propios = visibles.filter((p) => !p.isColor && !ENCUADRE.has(p.name) && p.name !== "speed");
  const velocidad = visibles.find((p) => p.name === "speed");
  const encuadre = visibles.filter((p) => ENCUADRE.has(p.name));

  const hijos = [crear("div", { class: "bloque" }, crear("h3", { class: "rotulo", text: "Punto de partida" }), presets)];
  if (colorParams.length) hijos.push(bloqueColores(id, colorParams));
  if (propios.length) hijos.push(crear("div", { class: "bloque" }, crear("h3", { class: "rotulo", text: "Forma y textura" }), ...propios.map((p) => campo(id, p))));
  hijos.push(crear("div", { class: "bloque" }, crear("h3", { class: "rotulo", text: "Movimiento" }),
    velocidad ? campo(id, velocidad) : crear("p", { class: "ayuda", text: "Este shader es una imagen fija: no tiene animación." })));
  const det = crear("details", { class: "bloque", id: "encuadre", open: abierto },
    crear("summary", { class: "rotulo" }, "Encuadre"), ...encuadre.map((p) => campo(id, p)));
  hijos.push(det);
  hijos.push(crear("div", { class: "bloque pie-ajustes" },
    crear("button", { type: "button", class: "boton-sec", text: "Restablecer valores", onclick: () => aplicarPreset(presetsDe(id).find((p) => p.name === "Default") ?? presetsDe(id)[0]) })));

  panel.replaceChildren(...hijos);
  panel.scrollTop = scroll;
  marcarModificados();
}

// ---------- Salida ----------

function jsonParams() {
  const d = diferencias(estado.id, estado.params);
  return Object.keys(d).length ? JSON.stringify(d) : "";
}

function renderSalida() {
  const json = jsonParams();
  $("#attr-shader").textContent = estado.id;
  $("#fila-params").hidden = !json;
  $("#attr-params").textContent = json;
  $("#sin-params").hidden = Boolean(json);
  const attrParams = json ? ` data-shader-params='${json.replace(/'/g, "&#39;")}'` : "";
  $("#embed-codigo").textContent = `<div data-shader="${estado.id}"${attrParams} style="position:absolute;inset:0"></div>`;
}

function mostrarPestana(nombre) {
  estado.pestana = nombre;
  for (const t of document.querySelectorAll("[role=tab]")) {
    const activa = t.dataset.pestana === nombre;
    t.setAttribute("aria-selected", activa);
    t.tabIndex = activa ? 0 : -1;
    $(`#${t.getAttribute("aria-controls")}`).hidden = !activa;
  }
  guardar();
}
const pestanas = [...document.querySelectorAll("[role=tab]")];
for (const t of pestanas) {
  t.addEventListener("click", () => mostrarPestana(t.dataset.pestana));
  t.addEventListener("keydown", (e) => {
    const i = pestanas.indexOf(t);
    const j = e.key === "ArrowRight" ? (i + 1) % pestanas.length : e.key === "ArrowLeft" ? (i - 1 + pestanas.length) % pestanas.length : -1;
    if (j >= 0) { e.preventDefault(); pestanas[j].focus(); mostrarPestana(pestanas[j].dataset.pestana); }
  });
}

function seleccionarTexto(el) {
  if (el instanceof HTMLTextAreaElement) { el.focus(); el.select(); return; }
  const r = document.createRange();
  r.selectNodeContents(el);
  const s = getSelection();
  s.removeAllRanges();
  s.addRange(r);
}
function avisar(boton, texto) {
  const original = boton.dataset.original ?? boton.textContent;
  boton.dataset.original = original;
  boton.textContent = texto;
  clearTimeout(boton._t);
  boton._t = setTimeout(() => { boton.textContent = original; }, 1800);
}
for (const b of document.querySelectorAll("[data-copiar]")) {
  b.addEventListener("click", () => {
    const origen = $(b.dataset.copiar);
    const texto = origen.value ?? origen.textContent;
    navigator.clipboard.writeText(texto).then(
      () => avisar(b, "Copiado"),
      () => { seleccionarTexto(origen); avisar(b, "Seleccionado: pulse Ctrl+C"); }
    );
  });
}

$("#script-codigo").value = SCRIPT_FOOTER;
$("#script-tamano").textContent = `${SCRIPT_FOOTER.length.toLocaleString("es-MX")} caracteres`;

// ---------- Importar ----------

function importar(texto) {
  const t = texto.trim();
  if (!t) return "Pegue el Code Embed, los atributos o el JSON de una configuración.";
  let id = t.match(/data-shader\s*=\s*["']([\w-]+)["']/)?.[1];
  if (!id && SHADERS[t.split(/\s/)[0]]) id = t.split(/\s/)[0];
  let json = t.match(/data-shader-params\s*=\s*'([^']*)'/)?.[1]
    ?? t.match(/data-shader-params\s*=\s*"([^"]*)"/)?.[1]?.replace(/&quot;/g, '"');
  if (json === undefined) json = t.match(/\{[\s\S]*\}/)?.[0];
  if (id && !SHADERS[id]) return `No existe el shader "${id}".`;
  let params = {};
  if (json) {
    try { params = JSON.parse(json.replace(/&#39;/g, "'")); }
    catch { return "El JSON de los parámetros no es válido. Revise comillas y llaves."; }
  }
  if (!id && !json) return "No encontré data-shader ni parámetros en el texto.";
  const nuevo = id ?? estado.id;
  const mismo = nuevo === estado.id;
  const conocidos = new Set(SHADERS[nuevo].def.params.map((p) => p.name));
  const ignorados = Object.keys(params).filter((k) => !conocidos.has(k));
  for (const k of ignorados) delete params[k];
  estado.id = nuevo;
  estado.params = { ...clonar(SHADERS[nuevo].presets[0].params), ...params };
  estado.preset = null;
  marcarFicha();
  if (mismo) cargarValores();
  else montarVisor();
  construirAjustes();
  renderSalida();
  guardar();
  return `Cargado: ${SHADER_ES[nuevo][0]}${Object.keys(params).length ? ` con ${Object.keys(params).length} ajustes` : ""}.`
    + (ignorados.length ? ` Se ignoraron: ${ignorados.join(", ")}.` : "");
}
$("#importar-form").addEventListener("submit", (e) => {
  e.preventDefault();
  $("#importar-estado").textContent = importar($("#importar-texto").value);
});

// ---------- Inicio ----------

construirBiblioteca();
aplicarAspecto();
aplicarTexto();
construirAjustes();
renderSalida();
mostrarPestana(estado.pestana);

texturasListas.then(() => {
  montarVisor();
  aplicarPausa();
  setTimeout(generarMiniaturas, 300);
}).catch((e) => {
  console.error(e);
  $("#error-visor").hidden = false;
});
