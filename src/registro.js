import { ColorPanels, colorPanelsPresets } from "./shaders/color-panels.js";
import { colorPanelsDef } from "./defs/color-panels-def.ts";
import { Dithering, ditheringPresets } from "./shaders/dithering.js";
import { ditheringDef } from "./defs/dithering-def.ts";
import { DotGrid, dotGridPresets } from "./shaders/dot-grid.js";
import { dotGridDef } from "./defs/dot-grid-def.ts";
import { DotOrbit, dotOrbitPresets } from "./shaders/dot-orbit.js";
import { dotOrbitDef } from "./defs/dot-orbit-def.ts";
import { GodRays, godRaysPresets } from "./shaders/god-rays.js";
import { godRaysDef } from "./defs/god-rays-def.ts";
import { GrainGradient, grainGradientPresets } from "./shaders/grain-gradient.js";
import { grainGradientDef } from "./defs/grain-gradient-def.ts";
import { MeshGradient, meshGradientPresets } from "./shaders/mesh-gradient.js";
import { meshGradientDef } from "./defs/mesh-gradient-def.ts";
import { Metaballs, metaballsPresets } from "./shaders/metaballs.js";
import { metaballsDef } from "./defs/metaballs-def.ts";
import { NeuroNoise, neuroNoisePresets } from "./shaders/neuro-noise.js";
import { neuroNoiseDef } from "./defs/neuro-noise-def.ts";
import { PerlinNoise, perlinNoisePresets } from "./shaders/perlin-noise.js";
import { perlinNoiseDef } from "./defs/perlin-noise-def.ts";
import { PulsingBorder, pulsingBorderPresets } from "./shaders/pulsing-border.js";
import { pulsingBorderDef } from "./defs/pulsing-border-def.ts";
import { SimplexNoise, simplexNoisePresets } from "./shaders/simplex-noise.js";
import { simplexNoiseDef } from "./defs/simplex-noise-def.ts";
import { SmokeRing, smokeRingPresets } from "./shaders/smoke-ring.js";
import { smokeRingDef } from "./defs/smoke-ring-def.ts";
import { Spiral, spiralPresets } from "./shaders/spiral.js";
import { spiralDef } from "./defs/spiral-def.ts";
import { StaticMeshGradient, staticMeshGradientPresets } from "./shaders/static-mesh-gradient.js";
import { staticMeshGradientDef } from "./defs/static-mesh-gradient-def.ts";
import { StaticRadialGradient, staticRadialGradientPresets } from "./shaders/static-radial-gradient.js";
import { staticRadialGradientDef } from "./defs/static-radial-gradient-def.ts";
import { Swirl, swirlPresets } from "./shaders/swirl.js";
import { swirlDef } from "./defs/swirl-def.ts";
import { Voronoi, voronoiPresets } from "./shaders/voronoi.js";
import { voronoiDef } from "./defs/voronoi-def.ts";
import { Warp, warpPresets } from "./shaders/warp.js";
import { warpDef } from "./defs/warp-def.ts";
import { Waves, wavesPresets } from "./shaders/waves.js";
import { wavesDef } from "./defs/waves-def.ts";

export const SHADERS = {
  "color-panels": { build: ColorPanels, presets: colorPanelsPresets, def: colorPanelsDef },
  "dithering": { build: Dithering, presets: ditheringPresets, def: ditheringDef },
  "dot-grid": { build: DotGrid, presets: dotGridPresets, def: dotGridDef },
  "dot-orbit": { build: DotOrbit, presets: dotOrbitPresets, def: dotOrbitDef },
  "god-rays": { build: GodRays, presets: godRaysPresets, def: godRaysDef },
  "grain-gradient": { build: GrainGradient, presets: grainGradientPresets, def: grainGradientDef },
  "mesh-gradient": { build: MeshGradient, presets: meshGradientPresets, def: meshGradientDef },
  "metaballs": { build: Metaballs, presets: metaballsPresets, def: metaballsDef },
  "neuro-noise": { build: NeuroNoise, presets: neuroNoisePresets, def: neuroNoiseDef },
  "perlin-noise": { build: PerlinNoise, presets: perlinNoisePresets, def: perlinNoiseDef },
  "pulsing-border": { build: PulsingBorder, presets: pulsingBorderPresets, def: pulsingBorderDef },
  "simplex-noise": { build: SimplexNoise, presets: simplexNoisePresets, def: simplexNoiseDef },
  "smoke-ring": { build: SmokeRing, presets: smokeRingPresets, def: smokeRingDef },
  "spiral": { build: Spiral, presets: spiralPresets, def: spiralDef },
  "static-mesh-gradient": { build: StaticMeshGradient, presets: staticMeshGradientPresets, def: staticMeshGradientDef },
  "static-radial-gradient": { build: StaticRadialGradient, presets: staticRadialGradientPresets, def: staticRadialGradientDef },
  "swirl": { build: Swirl, presets: swirlPresets, def: swirlDef },
  "voronoi": { build: Voronoi, presets: voronoiPresets, def: voronoiDef },
  "warp": { build: Warp, presets: warpPresets, def: warpDef },
  "waves": { build: Waves, presets: wavesPresets, def: wavesDef },
};
