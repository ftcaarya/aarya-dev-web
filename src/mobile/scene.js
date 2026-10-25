import * as THREE from 'three'
import { createWorld } from '../scene/world.js'
import { MONITORS } from '../scene/config.js'
import { createMonitor } from '../scene/monitor.js'
import { createEnvironmentSet } from '../scene/desk.js'
import { createLighting } from '../scene/lighting.js'
import { createPhone } from '../scene/phone.js'
import { createLockTexture } from './lock-texture.js'

const smootherstep = (x) => x * x * x * (x * (x * 6 - 15) + 10)
const clamp01 = (x) => Math.min(1, Math.max(0, x))

// Phone scene: the same desk, monitors asleep, a phone lying on it with its
// screen off. Page scroll (0..1) flies the camera from a wide shot straight
// down onto the phone; the screen wakes to its lock screen on the way in, and
// onProgress(u) lets the DOM phone UI fade in on arrival. While frozen()
// is true (an app is open) scroll changes are ignored.
export function startPhoneScene(content, apps, { onProgress, frozen = () => false }) {
  const world = createWorld({ lite: true })
  const { camera } = world
  createLighting(world.scene)

  const env = createEnvironmentSet()
  world.scene.add(env.group)
  MONITORS.forEach((cfg) => world.scene.add(createMonitor(cfg, { asleep: true }).group))

  const lock = createLockTexture(content, apps)
  const phone = createPhone(lock.texture)
  world.scene.add(phone.group)

  let path
  function rebuild() {
    const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    const tanH = tanV * camera.aspect

    // Wide shot: ~0.9 m of desk across a portrait screen, phone in the
    // lower half, sleeping monitors behind it.
    const look0 = new THREE.Vector3(-0.43, 0.93, 0.02)
    const d0 = Math.max(0.45 / tanH, 0.55 / tanV)
    const pos0 = look0.clone().addScaledVector(new THREE.Vector3(0.1, 0.62, 1).normalize(), d0)

    // Final shot: straight down, phone's top edge as screen-up. A viewport
    // wider than 9:19.5 can't show the whole screen, so frame its top part
    // (matching the top-anchored DOM layout) and tell the texture where that
    // window ends so its dock lands where the DOM dock will.
    const winH = Math.min(phone.h, phone.w / camera.aspect)
    lock.setWindow(winH / phone.h)
    const look1 = phone.center.clone().addScaledVector(phone.top, (phone.h - winH) / 2)
    const d1 = Math.min(winH / 2 / tanV, phone.w / 2 / tanH) // cover the viewport
    const pos1 = look1.clone().add(new THREE.Vector3(0, d1, 0))

    // Bezier control point directly above the phone so the last stretch
    // descends vertically onto the screen.
    const ctrl = new THREE.Vector3(pos1.x, THREE.MathUtils.lerp(pos1.y, pos0.y, 0.7), pos1.z)
    path = { pos0, pos1, ctrl, look0, look1 }
  }
  rebuild()
  window.addEventListener('resize', rebuild)

  const worldUp = new THREE.Vector3(0, 1, 0)
  const pos = new THREE.Vector3()
  const look = new THREE.Vector3()
  function apply(u) {
    const t = smootherstep(u)
    const { pos0, pos1, ctrl, look0, look1 } = path
    const a = (1 - t) * (1 - t)
    const b = 2 * (1 - t) * t
    const c = t * t
    pos.set(0, 0, 0).addScaledVector(pos0, a).addScaledVector(ctrl, b).addScaledVector(pos1, c)
    // aim settles on the phone early; roll to the phone's orientation late
    look.lerpVectors(look0, look1, 1 - (1 - t) * (1 - t))
    camera.up.lerpVectors(worldUp, phone.top, t * t).normalize()
    camera.position.copy(pos)
    camera.lookAt(look)
  }

  // Smoothed page-scroll progress
  let target = 0
  function readScroll() {
    if (frozen()) return
    const max = document.documentElement.scrollHeight - innerHeight
    target = max > 0 ? clamp01(scrollY / max) : 0
  }
  readScroll()
  window.addEventListener('scroll', readScroll, { passive: true })
  let u = target

  // Screen wakes (like raise-to-wake) once the camera is on its way in, and
  // sleeps again near the wide shot; it fades over ~0.3 s either way.
  let wake = 0
  const clock = new THREE.Clock()
  world.renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), 0.1)
    u += (target - u) * Math.min(1, dt * 7)
    if (Math.abs(target - u) < 1e-4) u = target
    const awake = u > 0.22 ? 1 : 0
    wake += (awake - wake) * Math.min(1, dt * 9)
    phone.setWake(wake * wake)
    const covered = onProgress(u)
    // once the DOM phone UI fully covers the canvas, stop drawing
    if (covered) return
    apply(u)
    env.update(clock.elapsedTime)
    world.render()
  })
}
