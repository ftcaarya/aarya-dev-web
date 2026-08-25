// Scene layout constants — single source of truth for monitor geometry so the
// WebGL meshes, CSS3D screens, and camera framing can never drift apart.

export const COLORS = {
  bg: 0x0a0a0d,
  ink: 0xe8e6e1,
}

// 1 world unit ≈ 1 meter. Screens are authored in CSS pixels at 1200 px/m.
export const PX_PER_METER = 1200

export const DESK = {
  topY: 0.75, // world y of the desk surface
  width: 3.0,
  depth: 1.05,
}

// Side-by-side layout: featured preview left, project list center, about
// vertical on the right. Clicking a project on the center screen swaps what
// the featured screen shows (see screens3d.js).
export const MONITORS = [
  {
    id: 'featured',
    w: 0.96, h: 0.54, // screen size in world units (16:9)
    px: [1152, 648], // DOM canvas size in CSS px
    // far enough left that its rotated bezel clears the center monitor's edge
    pos: [-1.06, 1.14, -0.16],
    rotY: 0.38,
    accent: 0x8ecbdf,
  },
  {
    id: 'projects',
    w: 0.96, h: 0.54,
    px: [1152, 648],
    pos: [0, 1.16, -0.3],
    rotY: 0,
    accent: 0xa9a3e8,
  },
  {
    id: 'about',
    w: 0.54, h: 0.96, // portrait (9:16)
    px: [648, 1152],
    pos: [0.92, 1.35, -0.16],
    rotY: -0.38,
    accent: 0x8fd8b4,
  },
]
