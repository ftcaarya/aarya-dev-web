import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js'
import { PX_PER_METER } from '../scene/config.js'
import { buildFeatured, buildProjects, buildTerminal } from './dom.js'

// Wraps the shared DOM builders in CSS3DObjects positioned exactly on the
// monitor screen surfaces. Returns setActive(waypointIndex) which drives the
// boot-in / typing animations (waypoint 0 is the wide shot; monitors are 1–3).
export function createScreens(cssScene, monitors, content) {
  const terminal = buildTerminal(content.about, { animate: true })

  // Featured screen mirrors the project selected on the projects screen.
  const featuredMount = document.createElement('div')
  featuredMount.appendChild(buildFeatured(content.projects[0], content.featured))

  function showProject(i) {
    const screen = featuredMount.closest('.screen')
    screen?.classList.remove('active')
    requestAnimationFrame(() => {
      featuredMount.replaceChildren(buildFeatured(content.projects[i], content.featured))
      featuredMount.parentElement.scrollTop = 0
      // re-adding .active next frame replays the boot-in stagger
      requestAnimationFrame(() => screen?.classList.add('active'))
    })
  }

  const roots = [
    featuredMount,
    buildProjects(content.projects, { onSelect: showProject }),
    terminal.root,
  ]

  // Waypoint at which each screen counts as focused (0 is the wide shot)
  const focusAt = [1, 2, 3]

  const screens = monitors.map((monitor, i) => {
    const { cfg, normal } = monitor
    const elem = document.createElement('div')
    elem.className = `screen ${cfg.w > cfg.h ? 'landscape' : 'portrait'}`
    const scroller = document.createElement('div')
    scroller.className = 'screen-scroll'
    scroller.appendChild(roots[i])
    elem.appendChild(scroller)

    const obj = new CSS3DObject(elem)
    obj.position.set(...cfg.pos).addScaledVector(normal, 0.002)
    obj.rotation.y = cfg.rotY
    obj.scale.setScalar(1 / PX_PER_METER)
    cssScene.add(obj)
    return { elem, scroller, focus: focusAt[i] }
  })

  // While a monitor is focused, the wheel scrolls the content inside its
  // screen; the page (camera dolly) only takes over again once that content
  // is at its top/bottom edge. Non-passive so we can preventDefault.
  let activeScroller = null
  window.addEventListener(
    'wheel',
    (e) => {
      const sc = activeScroller
      if (!sc) return
      const delta = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY
      const max = sc.scrollHeight - sc.clientHeight
      if (max <= 0) return
      if ((delta > 0 && sc.scrollTop < max - 1) || (delta < 0 && sc.scrollTop > 0)) {
        e.preventDefault()
        sc.scrollTop = Math.max(0, Math.min(max, sc.scrollTop + delta))
      }
    },
    { passive: false }
  )

  // Desk "powers on" shortly after load — staggered boot across the monitors
  screens.forEach(({ elem }, i) => {
    setTimeout(() => elem.classList.add('active'), 350 + i * 180)
  })

  function setActive(waypointIndex) {
    screens.forEach(({ elem, focus }) => {
      elem.classList.toggle('focus', focus === waypointIndex)
    })
    activeScroller = screens.find((s) => s.focus === waypointIndex)?.scroller ?? null
    if (waypointIndex === 3) terminal.play?.()
  }

  return { setActive }
}
