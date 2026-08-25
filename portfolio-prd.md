# Spatial Portfolio — PRD & Execution Plan

## 1. Overview

A code-driven, single-page developer portfolio rendered as a 3D desk scene (three
monitors, one vertical) in Three.js. Scroll drives a camera dolly along a spline
through the scene; each stop frames a monitor showing real content (hero/intro,
projects, about/contact). Visual direction: clean minimal luxury — dark, sparse,
well-lit, no clutter. Everything is built from code/primitives, no 3D modeling
tools.

**Target audience:** recruiters, hiring managers, other engineers reviewing work.
**Primary goal:** communicate technical craft through the build itself — the site
*is* the portfolio piece, not just a container for one.

## 2. Success Criteria

- Loads and is interactive (first camera frame visible, screens readable) in
  under ~3s on a decent connection / mid-tier laptop.
- Runs at 60fps on desktop Chrome/Firefox/Safari on integrated graphics.
- Fully navigable by scroll, and by keyboard (arrow/space) for accessibility.
- Degrades gracefully on mobile and `prefers-reduced-motion` — never blocks
  access to content.
- All project/contact content is real, crawlable/readable DOM — not baked into
  canvas or images.

## 3. Scope

### In scope (v1)
- 3D desk scene: desk, 3 monitors (2 horizontal + 1 vertical), keyboard, one
  accent object.
- Scroll-driven camera spline through 4 waypoints (wide shot → monitor 1 →
  monitor 2 → vertical monitor).
- CSS3DRenderer-composited DOM content on each screen (hero, project list,
  about/contact terminal).
- Screen-glow-based lighting + one HDRI environment map for reflections.
- Fresnel rim-light shader on monitor bezels.
- Bloom post-processing pass.
- Reduced-motion and mobile fallback (static/cross-fade framing instead of
  scroll-scrub).

### Out of scope (v1)
- CMS / dynamic content loading — content is hardcoded in the build for now.
- Multi-page routing — this is a single scrollable scene.
- CSG/boolean geometry, custom 3D-modeled assets, imported GLTF models.
- Sound design (can revisit later).

## 4. Content Plan (per screen)

| Waypoint | Screen | Content |
|---|---|---|
| 1 | — (wide establishing shot) | Name, title, scroll cue |
| 2 | Monitor 1 (left) | Featured project — live preview / video loop / summary |
| 3 | Monitor 2 (center) | Project list — grid or terminal-style list, click-through |
| 4 | Monitor 3 (vertical) | About + contact — terminal-style typed intro, links, resume |

## 5. Technical Architecture

**Stack:** Three.js (core), `CSS3DRenderer` (DOM overlay), GSAP + ScrollTrigger
(scroll-to-progress mapping), Vite (build tooling).

**Rendering pipeline:**
- Two synced renderers: `WebGLRenderer` (scene) + `CSS3DRenderer` (screen DOM
  content), same camera, layered via CSS (`WebGLRenderer` canvas behind,
  `CSS3DRenderer` DOM absolutely positioned, `pointer-events` enabled only over
  monitor regions).
- Postprocessing: `EffectComposer` with `RenderPass` + `UnrealBloomPass`, tuned
  low-intensity/high-threshold so only emissive/screen-bright areas bloom.

**Camera system:**
- 4+ waypoints, each `{ position: Vector3, lookAt: Vector3 }`.
- `CatmullRomCurve3` built from waypoint positions (and a second curve for
  lookAt targets, or manual lerp between lookAt points).
- GSAP ScrollTrigger `scrub` maps scroll progress (0–1) → curve `t`; on each
  tick, set `camera.position.copy(curve.getPoint(t))` and
  `camera.lookAt(lookAtCurve.getPoint(t))`.
- Optional: ease per-segment (not linear scroll-to-t) so arrivals feel like
  "settling," not constant-speed travel.

**Scene construction:**
- All primitives: `RoundedBoxGeometry`, `PlaneGeometry`, `CylinderGeometry`,
  composed as `Group` hierarchies (desk, monitor × 3, keyboard, accent object).
- Materials: `MeshPhysicalMaterial` (clearcoat, low roughness) for desk/bezels;
  custom fresnel `ShaderMaterial` for bezel rim-light.
- Lighting: one soft key light, screen-color point/rect lights per monitor
  (bounce-light effect), single HDRI via `RGBELoader` + `PMREMGenerator` for
  environment reflections.

**Content layer:**
- Each monitor screen = a positioned `CSS3DObject` wrapping a real DOM node
  (React components or plain HTML/CSS), sized/scaled to match the monitor mesh
  dimensions exactly.
- Idle micro-animations per screen (boot-in, typing effect, looping code
  snippet) triggered when that waypoint becomes active.

**Fallback path:**
- `prefers-reduced-motion` or narrow viewport → skip scroll-scrub; either (a)
  static camera cuts between framings on click/scroll-snap, or (b) a plain
  stacked HTML layout reusing the same screen content components, 3D scene
  omitted entirely.

## 6. Milestones / Plan of Action

**M1 — Skeleton & camera (foundation)**
- Vite + Three.js project scaffold.
- Empty room shell, primitive desk + 3 placeholder monitor meshes.
- Waypoint data structure + spline camera rig wired to GSAP ScrollTrigger
  scrub, no content yet — just verify the motion feels right.

**M2 — Materials & lighting**
- Swap placeholder materials for `MeshPhysicalMaterial` + clearcoat.
- Add HDRI environment map.
- Add fresnel rim-light shader on bezels.
- Add screen-glow point lights.

**M3 — Screen content (CSS3D layer)**
- Wire up `CSS3DRenderer` in parallel with `WebGLRenderer`.
- Build the 3 screen content components (hero, project list, about/contact).
- Position/scale CSS3D objects to align with monitor meshes; handle
  pointer-events zones so screens are clickable/scrollable where needed.

**M4 — Post-processing & polish**
- `EffectComposer` + bloom pass, tuned.
- Per-waypoint depth-of-field or focus tweak if pursued.
- Idle micro-animations (boot sequence, typing effect) per screen.

**M5 — Performance & fallback**
- Mobile/reduced-motion fallback path.
- Frame budget pass: draw calls, texture sizes, shader cost check.
- Lighthouse / real-device testing.

**M6 — Ship**
- Cross-browser QA (Chrome, Firefox, Safari).
- Deploy (Vercel/Netlify), custom domain, OG meta tags/social preview.

## 7. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Scroll-jacking hurts accessibility/usability | Keyboard nav support, reduced-motion fallback, standard scroll wheel behavior preserved (no full scroll capture without an escape hatch) |
| CSS3D + WebGL sync drift (screens misaligned) | Keep both renderers driven by the exact same camera object each frame; test alignment at multiple viewport sizes early, not last |
| Performance on low-end/mobile devices | Fallback path from day one (M5 isn't an afterthought — flag it in M1 so content components are reusable outside the 3D scene) |
| Scope creep on shaders/effects | Bloom + fresnel are the two "signature" effects for v1; anything else is a stretch goal after M6 |

## 8. Stretch Goals (post-v1)
- Depth-of-field transitions between waypoints.
- Ambient sound design (subtle room tone, UI click sounds).
- Additional camera waypoints / scenes (e.g., a "resume" drawer).
- Custom cursor or subtle parallax on mouse move within a waypoint.
