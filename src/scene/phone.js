import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { DESK } from './config.js'

// Phone lying face-up on the desk (mobile scene). Screen is 9:19.5 so the
// final top-down framing matches a phone viewport and the DOM home screen
// can take over without a visible jump.
export const PHONE = {
  w: 0.071, // screen size in world units
  h: 0.154,
  bezel: 0.0032,
  thickness: 0.0078,
  pos: [-0.5, 0.31], // x, z on the desk
  rotY: 0.16,
}

// Rounded-rect screen with UVs normalized to 0..1 (ShapeGeometry's UVs are
// raw shape coordinates).
function screenGeometry(w, h, r) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r)
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  const geo = new THREE.ShapeGeometry(s, 8)
  const pos = geo.attributes.position
  const uv = geo.attributes.uv
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) - x) / w, (pos.getY(i) - y) / h)
  }
  return geo
}

export function createPhone(screenTexture) {
  const group = new THREE.Group()
  group.position.set(PHONE.pos[0], DESK.topY, PHONE.pos[1])
  group.rotation.y = PHONE.rotY

  const bw = PHONE.w + PHONE.bezel * 2
  const bh = PHONE.h + PHONE.bezel * 2

  const body = new THREE.Mesh(
    new RoundedBoxGeometry(bw, PHONE.thickness, bh, 4, 0.0036),
    new THREE.MeshPhysicalMaterial({
      color: 0x101013,
      metalness: 0.6,
      roughness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
    })
  )
  body.position.y = PHONE.thickness / 2
  group.add(body)

  // Lit screen: unlit + not tone-mapped so it reads as an emissive display
  const screen = new THREE.Mesh(
    screenGeometry(PHONE.w, PHONE.h, 0.0075),
    new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false })
  )
  // plane's +y (texture top) ends up pointing to -z: the phone's top edge
  screen.rotation.x = -Math.PI / 2
  screen.position.y = PHONE.thickness + 0.0002
  group.add(screen)

  const center = new THREE.Vector3(PHONE.pos[0], DESK.topY + PHONE.thickness, PHONE.pos[1])
  // world direction the top of the screen points
  const top = new THREE.Vector3(-Math.sin(PHONE.rotY), 0, -Math.cos(PHONE.rotY))

  return { group, center, top, w: PHONE.w, h: PHONE.h }
}
