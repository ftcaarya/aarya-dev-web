// Home screen layout, in units of screen WIDTH (1 = full width). The DOM home
// screen reads these as container-width units and the 3D phone's canvas
// texture draws with the same numbers, so the zoom-in hands off cleanly.
// Everything is top-anchored except the dock, which sits on the bottom edge.

export const HOME = {
  pad: 0.06,
  status: { h: 0.11, font: 0.04 },
  widget: { top: 0.15, h: 0.3, r: 0.065, avatar: 0.15, name: 0.056, role: 0.034, hint: 0.027 },
  grid: { top: 0.53, cols: 4, icon: 0.155, row: 0.27, label: 0.03, labelGap: 0.022 },
  dock: { bottom: 0.08, h: 0.27, inset: 0.035, r: 0.085, iconTop: 0.03 },
}

// Pushes the layout into CSS custom properties (as cqw) on the home root.
export function applyLayoutVars(node) {
  const u = (k) => `${(k * 100).toFixed(3)}cqw`
  const vars = {
    '--pad': HOME.pad,
    '--status-h': HOME.status.h,
    '--status-font': HOME.status.font,
    '--widget-top': HOME.widget.top,
    '--widget-h': HOME.widget.h,
    '--widget-r': HOME.widget.r,
    '--avatar': HOME.widget.avatar,
    '--w-name': HOME.widget.name,
    '--w-role': HOME.widget.role,
    '--w-hint': HOME.widget.hint,
    '--grid-top': HOME.grid.top,
    '--icon': HOME.grid.icon,
    '--row': HOME.grid.row,
    '--label': HOME.grid.label,
    '--label-gap': HOME.grid.labelGap,
    '--dock-bottom': HOME.dock.bottom,
    '--dock-h': HOME.dock.h,
    '--dock-inset': HOME.dock.inset,
    '--dock-r': HOME.dock.r,
    '--dock-icon-top': HOME.dock.iconTop,
  }
  for (const [k, v] of Object.entries(vars)) node.style.setProperty(k, u(v))
}
