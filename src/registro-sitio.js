import { ColorPanels, defaultPreset as d_ColorPanels } from "./shaders-sitio/color-panels.js";
import { Dithering, defaultPreset as d_Dithering } from "./shaders-sitio/dithering.js";
import { DotGrid, defaultPreset as d_DotGrid } from "./shaders-sitio/dot-grid.js";
import { DotOrbit, defaultPreset as d_DotOrbit } from "./shaders-sitio/dot-orbit.js";
import { GodRays, defaultPreset as d_GodRays } from "./shaders-sitio/god-rays.js";
import { GrainGradient, defaultPreset as d_GrainGradient } from "./shaders-sitio/grain-gradient.js";
import { MeshGradient, defaultPreset as d_MeshGradient } from "./shaders-sitio/mesh-gradient.js";
import { Metaballs, defaultPreset as d_Metaballs } from "./shaders-sitio/metaballs.js";
import { NeuroNoise, defaultPreset as d_NeuroNoise } from "./shaders-sitio/neuro-noise.js";
import { PerlinNoise, defaultPreset as d_PerlinNoise } from "./shaders-sitio/perlin-noise.js";
import { PulsingBorder, defaultPreset as d_PulsingBorder } from "./shaders-sitio/pulsing-border.js";
import { SimplexNoise, defaultPreset as d_SimplexNoise } from "./shaders-sitio/simplex-noise.js";
import { SmokeRing, defaultPreset as d_SmokeRing } from "./shaders-sitio/smoke-ring.js";
import { Spiral, defaultPreset as d_Spiral } from "./shaders-sitio/spiral.js";
import { StaticMeshGradient, defaultPreset as d_StaticMeshGradient } from "./shaders-sitio/static-mesh-gradient.js";
import { StaticRadialGradient, defaultPreset as d_StaticRadialGradient } from "./shaders-sitio/static-radial-gradient.js";
import { Swirl, defaultPreset as d_Swirl } from "./shaders-sitio/swirl.js";
import { Voronoi, defaultPreset as d_Voronoi } from "./shaders-sitio/voronoi.js";
import { Warp, defaultPreset as d_Warp } from "./shaders-sitio/warp.js";
import { Waves, defaultPreset as d_Waves } from "./shaders-sitio/waves.js";

export const SHADERS = {
  "color-panels": { build: ColorPanels, defaults: d_ColorPanels.params },
  "dithering": { build: Dithering, defaults: d_Dithering.params },
  "dot-grid": { build: DotGrid, defaults: d_DotGrid.params },
  "dot-orbit": { build: DotOrbit, defaults: d_DotOrbit.params },
  "god-rays": { build: GodRays, defaults: d_GodRays.params },
  "grain-gradient": { build: GrainGradient, defaults: d_GrainGradient.params },
  "mesh-gradient": { build: MeshGradient, defaults: d_MeshGradient.params },
  "metaballs": { build: Metaballs, defaults: d_Metaballs.params },
  "neuro-noise": { build: NeuroNoise, defaults: d_NeuroNoise.params },
  "perlin-noise": { build: PerlinNoise, defaults: d_PerlinNoise.params },
  "pulsing-border": { build: PulsingBorder, defaults: d_PulsingBorder.params },
  "simplex-noise": { build: SimplexNoise, defaults: d_SimplexNoise.params },
  "smoke-ring": { build: SmokeRing, defaults: d_SmokeRing.params },
  "spiral": { build: Spiral, defaults: d_Spiral.params },
  "static-mesh-gradient": { build: StaticMeshGradient, defaults: d_StaticMeshGradient.params },
  "static-radial-gradient": { build: StaticRadialGradient, defaults: d_StaticRadialGradient.params },
  "swirl": { build: Swirl, defaults: d_Swirl.params },
  "voronoi": { build: Voronoi, defaults: d_Voronoi.params },
  "warp": { build: Warp, defaults: d_Warp.params },
  "waves": { build: Waves, defaults: d_Waves.params },
};
