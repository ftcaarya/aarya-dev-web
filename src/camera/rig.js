import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PAD = 1.32 // framing padding around a screen
const smootherstep = (x) => x * x * x * (x * (x * 6 - 15) + 10)

// Camera distance that fits a w×h screen in the frustum (with padding).
function framingDistance(camera, w, h) {
  const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
  const dFromH = (h * PAD) / 2 / tanHalf
  const dFromW = (w * PAD) / 2 / (tanHalf * camera.aspect)
  return Math.max(dFromH, dFromW)
}

// Scroll-driven dolly along a CatmullRom spline through the waypoints:
// wide shot → each framing target (e.g. the stacked monitor pair, then the
// vertical monitor). Framings are derived from scene data so they can't drift.
export function createRig({ camera, frames, onWaypoint }) {
  let posCurve, lookCurve, stops

  function rebuild() {
    // Wide shot: back off far enough to fit the whole desk at any aspect
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    // Looking slightly above the desk drops the scene into the lower two
    // thirds of the frame, keeping the hero text clear of the monitors.
    const wideLook = new THREE.Vector3(0, 1.18, -0.2)
    const wideDist = Math.max(2.6 / 2 / tanHalf, 4.2 / 2 / (tanHalf * camera.aspect))
    const widePos = new THREE.Vector3(0, wideLook.y + wideDist * 0.15, wideLook.z + wideDist)

    const waypoints = [
      { pos: widePos, look: wideLook },
      ...frames.map(({ center, normal, w, h }) => {
        const dist = framingDistance(camera, w, h)
        return {
          pos: center.clone().addScaledVector(normal, dist),
          look: center.clone(),
        }
      }),
    ]
    posCurve = new THREE.CatmullRomCurve3(waypoints.map((w) => w.pos), false, 'centripetal', 0.5)
    lookCurve = new THREE.CatmullRomCurve3(waypoints.map((w) => w.look), false, 'centripetal', 0.5)
    stops = waypoints.length - 1 // number of segments
  }
  rebuild()
  window.addEventListener('resize', rebuild)

  const state = { u: 0 }
  let activeIndex = 0

  function apply() {
    // Per-segment easing: the camera "settles" at each waypoint rather than
    // moving at constant speed. CatmullRomCurve3.getPoint hits control point i
    // exactly at t = i / (n - 1), so easing within each segment works cleanly.
    const s = Math.min(Math.floor(state.u * stops), stops - 1)
    const local = state.u * stops - s
    const t = (s + smootherstep(local)) / stops

    camera.position.copy(posCurve.getPoint(t))
    camera.lookAt(lookCurve.getPoint(t))

    // Waypoint is "active" when we're settled near a stop
    const nearest = Math.round(state.u * stops)
    const settled = Math.abs(state.u * stops - nearest) < 0.28
    const next = settled ? nearest : -1
    if (next !== activeIndex) {
      activeIndex = next
      onWaypoint?.(activeIndex)
    }

    // Hero overlay + scroll cue fade out as soon as the dolly leaves the wide shot
    const fade = String(Math.max(0, 1 - state.u * stops * 3))
    for (const id of ['hero', 'cue']) {
      const node = document.getElementById(id)
      if (node) node.style.opacity = fade
    }
  }

  gsap.to(state, {
    u: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '#track',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.7,
    },
    onUpdate: apply,
  })

  // --- Keyboard + dot navigation -------------------------------------------
  function scrollToStop(i) {
    const clamped = THREE.MathUtils.clamp(i, 0, stops)
    const max = document.documentElement.scrollHeight - innerHeight
    window.scrollTo({ top: (clamped / stops) * max, behavior: 'smooth' })
  }

  window.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLElement && /input|textarea/i.test(e.target.tagName)) return
    const nearest = Math.round(state.u * stops)
    if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) {
      e.preventDefault()
      scrollToStop(nearest + 1)
    } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
      e.preventDefault()
      scrollToStop(nearest - 1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      scrollToStop(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      scrollToStop(stops)
    }
  })

  const dots = document.getElementById('dots')
  dots.hidden = false
  dots.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => scrollToStop(Number(btn.dataset.i)))
  })

  function setDot(i) {
    dots.querySelectorAll('button').forEach((btn) => {
      btn.classList.toggle('on', Number(btn.dataset.i) === i)
    })
  }

  apply()
  return { apply, setDot, scrollToStop }
}
