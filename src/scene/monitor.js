import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { createFresnelMaterial } from '../fx/fresnel.js'
import { DESK } from './config.js'

export const BEZEL = 0.055 // border around the screen
const DEPTH = 0.042

const bezelMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x141417,
  metalness: 0.55,
  roughness: 0.32,
  clearcoat: 0.8,
  clearcoatRoughness: 0.25,
})

const standMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x1a1a1e,
  metalness: 0.75,
  roughness: 0.35,
  clearcoat: 0.5,
  clearcoatRoughness: 0.3,
})

// Builds one monitor. The group's origin is the CENTER OF THE SCREEN so the
// CSS3D screen and camera framing can use cfg.pos directly.
export function createMonitor(cfg) {
  const group = new THREE.Group()
  group.position.set(...cfg.pos)
  group.rotation.y = cfg.rotY

  const bw = cfg.w + BEZEL * 2
  const bh = cfg.h + BEZEL * 2

  // Bezel body
  const bezelGeo = new RoundedBoxGeometry(bw, bh, DEPTH, 4, 0.012)
  const bezel = new THREE.Mesh(bezelGeo, bezelMaterial)
  bezel.position.z = -DEPTH / 2 - 0.001
  bezel.castShadow = true
  group.add(bezel)

  // Fresnel rim shell (slightly inflated clone of the bezel)
  const rim = new THREE.Mesh(bezelGeo, createFresnelMaterial(cfg.accent))
  rim.position.copy(bezel.position)
  rim.scale.setScalar(1.015)
  group.add(rim)

  // Dark glass inset — reads as the panel when viewed off-axis
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(cfg.w + 0.02, cfg.h + 0.02),
    new THREE.MeshPhysicalMaterial({ color: 0x050506, roughness: 0.08, metalness: 0.2 })
  )
  glass.position.z = 0.0005
  group.add(glass)

  // Emissive glow plane at the screen surface. The DOM screen (CSS3D, layered
  // above the canvas) visually covers it; this plane exists so the WebGL scene
  // has real HDR screen light for bloom spill and reflections.
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(cfg.w, cfg.h),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(cfg.accent).multiplyScalar(1.1),
      toneMapped: false,
    })
  )
  glow.position.z = 0.001
  group.add(glow)

  // Stand: neck + foot, dropping to the desk surface.
  // Local y of the desk top (group origin is the screen center):
  const deskY = DESK.topY - cfg.pos[1]
  const neckTop = -bh / 4 // neck attaches behind the lower half of the screen
  const neckH = neckTop - deskY
  const neck = new THREE.Mesh(new RoundedBoxGeometry(0.05, neckH, 0.024, 2, 0.008), standMaterial)
  neck.position.set(0, deskY + neckH / 2, -DEPTH - 0.012)
  neck.castShadow = true
  group.add(neck)

  const foot = new THREE.Mesh(new RoundedBoxGeometry(0.26, 0.014, 0.18, 2, 0.006), standMaterial)
  foot.position.set(0, deskY + 0.007 + (cfg.footRaise ?? 0), -DEPTH + 0.02)
  foot.castShadow = true
  group.add(foot)

  // Screen-colored bounce light onto the desk/keyboard
  const bounce = new THREE.RectAreaLight(cfg.accent, 0.7, cfg.w, cfg.h)
  bounce.position.z = 0.002
  bounce.rotation.y = Math.PI // RectAreaLight emits along -z; flip to face outward
  group.add(bounce)

  // World-space screen normal (monitors only rotate about Y)
  const normal = new THREE.Vector3(Math.sin(cfg.rotY), 0, Math.cos(cfg.rotY))

  return { group, cfg, normal, glow, bounce }
}
