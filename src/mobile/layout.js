// Phone layout, in units of screen WIDTH (1 = full width). The DOM reads
// these as container-width units. The 3D phone's screen texture draws the
// lock screen from LOCK with the same numbers, so the zoom-in hands off
// cleanly. Everything is top-anchored except the dock and the lock screen's
// "Swipe up" line, which sit on the bottom edge.

//
// Proportions follow the iPhone home screen (393pt wide, ~62pt icons): icons
// are 16% of the width, and the outer margin equals the gap between icons so
// the four columns sit on an even rhythm. Labels are ~12pt, ~6pt under the
// icon; the widget's edges line up with the outer icon edges; the dock's
// columns line up with the grid's.
const ICON = 0.16
const MARGIN = 0.07 // screen edge → icon edge
const GAP = (1 - 2 * MARGIN - 4 * ICON) / 3 // icon edge → icon edge (≈ MARGIN)
const INSET = MARGIN - GAP / 2 // grid edge, so each cell is icon + gap wide

export const HOME = {
  pad: MARGIN,
  status: { h: 0.11, font: 0.04 },
  widget: { top: 0.15, h: 0.3, r: 0.06, avatar: 0.15, name: 0.056, role: 0.036 },
  grid: { top: 0.53, cols: 4, icon: ICON, inset: INSET, row: 0.262, label: 0.031, labelGap: 0.016 },
  dock: { bottom: 0.06, h: 0.255, inset: INSET, r: 0.1, iconTop: 0.024 },
}

// Lock screen (iOS proportions: date over a large clock, notifications
// below, edge to edge with a small margin)
export const LOCK = {
  date: { top: 0.2, font: 0.048 },
  clock: { top: 0.255, font: 0.25 },
  notes: { top: 0.7, inset: 0.03, h: 0.2, gap: 0.022, r: 0.06, pad: 0.035, icon: 0.095, title: 0.037, body: 0.036, when: 0.031 },
  hint: { bottom: 0.075, font: 0.036 },
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
    '--grid-top': HOME.grid.top,
    '--icon': HOME.grid.icon,
    '--grid-inset': HOME.grid.inset,
    '--row': HOME.grid.row,
    '--label': HOME.grid.label,
    '--label-gap': HOME.grid.labelGap,
    '--dock-bottom': HOME.dock.bottom,
    '--dock-h': HOME.dock.h,
    '--dock-inset': HOME.dock.inset,
    '--dock-r': HOME.dock.r,
    '--dock-icon-top': HOME.dock.iconTop,
    '--lk-date-top': LOCK.date.top,
    '--lk-date': LOCK.date.font,
    '--lk-clock-top': LOCK.clock.top,
    '--lk-clock': LOCK.clock.font,
    '--lk-notes-top': LOCK.notes.top,
    '--lk-inset': LOCK.notes.inset,
    '--lk-h': LOCK.notes.h,
    '--lk-gap': LOCK.notes.gap,
    '--lk-r': LOCK.notes.r,
    '--lk-pad': LOCK.notes.pad,
    '--lk-icon': LOCK.notes.icon,
    '--lk-title': LOCK.notes.title,
    '--lk-body': LOCK.notes.body,
    '--lk-when': LOCK.notes.when,
    '--lk-hint-bottom': LOCK.hint.bottom,
    '--lk-hint': LOCK.hint.font,
  }
  for (const [k, v] of Object.entries(vars)) node.style.setProperty(k, u(v))
}
