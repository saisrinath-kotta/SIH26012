# PS12 — AI-Based Automated Urban Parcel Mapping & Cadastral Feature Extraction System using Drone Imagery

### Smart India Hackathon (SIH) 2026 • Problem Statement 12
A cinematic, interactive 3D WebGIS digital twin and AI research visualization detailing the end-to-end urban cadastral intelligence pipeline.

> **Statutory Disclaimer**: *This system is a prototype research visualization. All AI-extracted boundaries, vectors, and parcel geometries are designated as **AI-Assisted Preliminary Results Requiring Field Surveyor Validation**. This platform supports licensed surveyors and municipal authorities without claiming autonomous legal boundary determination.*

---

## 🚀 The 12-Scene Cinematic Pipeline

| Scene | Title & Phase | Description & 3D Visuals |
| :---: | :--- | :--- |
| **01** | **The Urban Landscape**<br>`Physical Space` | High aerial establishing shot descending towards an unplanned urban settlement with complex buildings, irregular plots, and narrow access corridors. |
| **02** | **The Cadastral Bottleneck**<br>`Cadastral Challenge` | Manual surveying simulation: Total station instruments, animated measuring lines, inconclusive compound wall junctions, and traditional field disputes. |
| **03** | **High-Precision UAV Survey**<br>`Data Acquisition` | Autonomous 3D quadcopter drone flying a photogrammetric lawnmower path with spinning carbon rotors, sensor gimbal, and volumetric downward scanning beam. |
| **04** | **High-Resolution Aerial Imagery**<br>`Spatial Pre-processing` | Digital orthomosaic tile plane with radiometric calibration, pixel coordinate matrix, and GSD indicator ($2.4\text{ cm/px}$). |
| **05** | **AI Vision Feature Extraction**<br>`AI Inference` | Sweeping laser scanner progressively reveals semantic segmentation layers: Building footprints, arterial roads, access corridors, and physical boundary evidence. |
| **06** | **Building Footprint Detection**<br>`Vectorization` | Vectorized polygonal rooflines with glowing cyan edges and demo confidence metrics ($96\%, 94\%, 93\%$). |
| **07** | **Preliminary Parcel Map Generation**<br>`Cadastral Generation` | **Hero Scene**: Irregular preliminary parcel polygons ($P001 \dots P005$) rising slightly in 3D with cyan boundaries and "AI-Assisted Preliminary Map" badges. |
| **08** | **Uncertainty & Risk Detection**<br>`Quality Assurance` | Unambiguous physical boundaries in **Green** (High Confidence), ambiguous garden hedges/fences in **Yellow** with pulsating warning flags: *"Human Review Required"*. |
| **09** | **Topological Validation & Repair**<br>`GIS Integrity` | Planar topology engine: Detects and highlights overlapping geometry in **Red** and gaps in **Amber**, followed by an automated geodetic vertex snap: `✓ CLOSED POLYGONS`, `✓ VALID GEOMETRY`, `✓ NO OVERLAPS`, `✓ NO GAPS`. |
| **10** | **Web-GIS Command Platform**<br>`Cadastral GIS` | Professional WebGIS interface with layer toggles (Orthomosaic, AI Buildings, Parcels, Boundaries), parcel dossier ($P001$ $1,284\text{ m}^2$, $94\%$ confidence), and action buttons: `[EDIT]`, `[VERIFY]`, `[ACCEPT]`. |
| **11** | **Surveyor Verification**<br>`Human-in-the-Loop` | Interactive human-in-the-loop workflow: Field surveyor detects $+0.80\text{m}$ offset stone monument, clicks *"ALIGN & VERIFY"*, transforming uncertain yellow line to solid green `VERIFIED`. |
| **12** | **Digital Cadastral City**<br>`Digital Cadastre` | Return to aerial 3D city with all validated cadastral intelligence layers active, accompanied by the full 7-step pipeline flow diagram. |

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite 8, JavaScript (ESModules)
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Cinematic Animations**: GSAP 3 (camera tweens, bezier easing), Framer Motion (HUD cards & titles)
- **Styling**: Tailwind CSS v3.4, Dark Glassmorphism
- **GIS Engine**: Turf.js (`@turf/turf`), GeoJSON (WGS84 EPSG:4326 + local metric coordinate frames)
- **Icons & Typography**: Lucide React, Google Fonts (*Plus Jakarta Sans*, *JetBrains Mono*)

---

## 🎮 Interactive Controls

- **Cinematic Controller (Bottom Deck)**:
  - `PLAY / PAUSE`: Automatically sequences through all 12 scenes with cinematic camera direction.
  - `PREV / NEXT`: Step forward or backward through specific pipeline stages.
  - `SCENE SCRUBBER (1–12)`: Instant jump to any scene.
  - `RESET`: Return to Scene 01.
  - `MODE TOGGLE`:
    - **CINEMATIC**: Director-driven camera flights and automated narrative pacing.
    - **EXPLORE**: Unlocks free 3D OrbitControls (Left Click Rotate • Right Click Pan • Scroll Zoom) to inspect any parcel.

---

## 💻 Local Execution

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Lint codebase (0 errors, 0 warnings)
npm run lint

# Production bundle build
npm run build
```
