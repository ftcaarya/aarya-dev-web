import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { COLORS, DESK } from './config.js'

// Room shell, floor, desk, keyboard, and the accent sculpture.
// Returns { group, update } — update(t) drives idle motion (accent rotation).
export function createEnvironmentSet() {
  const group = new THREE.Group()

  // --- Room shell -----------------------------------------------------------
  const room = new THREE.Mesh(
    new THREE.BoxGeometry(11, 5, 9),
    new THREE.MeshStandardMaterial({ color: 0x0c0c10, roughness: 0.95, metalness: 0, side: THREE.BackSide })
  )
  room.position.set(0, 2.5, 2.4) // back wall lands at z = -2.1
  room.receiveShadow = true
  group.add(room)

  // --- Floor ----------------------------------------------------------------
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(11, 9),
    new THREE.MeshPhysicalMaterial({
      color: 0x0e0e11,
      roughness: 0.55,
      metalness: 0.05,
      clearcoat: 0.35,
      clearcoatRoughness: 0.5,
    })
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.set(0, 0.001, 2.4)
  floor.receiveShadow = true
  group.add(floor)

  // --- Desk -----------------------------------------------------------------
  const deskMat = new THREE.MeshPhysicalMaterial({
    color: 0x17140f,
    roughness: 0.3,
    metalness: 0.1,
    clearcoat: 0.9,
    clearcoatRoughness: 0.18,
  })
  const top = new THREE.Mesh(new RoundedBoxGeometry(DESK.width, 0.045, DESK.depth, 3, 0.014), deskMat)
  top.position.set(0, DESK.topY - 0.0225, 0)
  top.castShadow = true
  top.receiveShadow = true
  group.add(top)

  const panelMat = new THREE.MeshPhysicalMaterial({
    color: 0x121013,
    roughness: 0.4,
    metalness: 0.3,
    clearcoat: 0.4,
  })
  for (const x of [-DESK.width / 2 + 0.06, DESK.width / 2 - 0.06]) {
    const panel = new THREE.Mesh(new RoundedBoxGeometry(0.045, DESK.topY - 0.045, DESK.depth - 0.16, 3, 0.01), panelMat)
    panel.position.set(x, (DESK.topY - 0.045) / 2, 0)
    panel.castShadow = true
    panel.receiveShadow = true
    group.add(panel)
  }

  // --- Keyboard (slab + instanced keycaps) ----------------------------------
  const kb = new THREE.Group()
  kb.position.set(0, DESK.topY + 0.011, 0.34)
  kb.rotation.y = 0.02

  const slab = new THREE.Mesh(
    new RoundedBoxGeometry(0.5, 0.022, 0.17, 2, 0.008),
    new THREE.MeshPhysicalMaterial({ color: 0x1b1b1f, roughness: 0.4, metalness: 0.5, clearcoat: 0.5 })
  )
  slab.castShadow = true
  kb.add(slab)

  const COLSN = 14
  const ROWSN = 5
  const capGeo = new RoundedBoxGeometry(0.026, 0.008, 0.026, 1, 0.003)
  const capMat = new THREE.MeshStandardMaterial({ color: 0x232328, roughness: 0.6, metalness: 0.2 })
  const caps = new THREE.InstancedMesh(capGeo, capMat, COLSN * ROWSN)
  const m = new THREE.Matrix4()
  let i = 0
  for (let r = 0; r < ROWSN; r++) {
    for (let c = 0; c < COLSN; c++) {
      m.setPosition(-0.2145 + c * 0.033, 0.015, -0.066 + r * 0.033)
      caps.setMatrixAt(i++, m)
    }
  }
  kb.add(caps)
  group.add(kb)

  // --- Accent piece: Rubik's cube on a turntable plinth ---------------------
  const plinth = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.12, 0.014, 48),
    new THREE.MeshPhysicalMaterial({ color: 0x141416, roughness: 0.2, metalness: 0.6, clearcoat: 0.7 })
  )
  plinth.position.set(-1.28, DESK.topY + 0.007, 0.3)
  plinth.castShadow = true
  plinth.receiveShadow = true
  group.add(plinth)

  const cube = createRubiksCube()
  cube.position.set(-1.28, DESK.topY + 0.014, 0.3)
  group.add(cube)

  // --- Mouse: right of the keyboard -----------------------------------------
  const mouse = new THREE.Group()
  mouse.position.set(0.36, DESK.topY, 0.37)
  mouse.rotation.y = -0.25
  const mouseBody = new THREE.Mesh(
    new RoundedBoxGeometry(0.062, 0.036, 0.102, 4, 0.017),
    new THREE.MeshPhysicalMaterial({ color: 0x1b1b1f, roughness: 0.35, metalness: 0.5, clearcoat: 0.6 })
  )
  mouseBody.position.y = 0.016
  mouseBody.castShadow = true
  mouse.add(mouseBody)
  const wheel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.007, 0.007, 0.005, 16),
    new THREE.MeshStandardMaterial({ color: 0x2a2a2f, roughness: 0.6 })
  )
  wheel.rotation.z = Math.PI / 2
  wheel.position.set(0, 0.032, -0.026)
  mouse.add(wheel)
  group.add(mouse)

  function update(t) {
    cube.rotation.y = -0.5 + t * 0.22 // slow display turntable
  }

  return { group, update }
}

// Rubik's cube built from primitives: 27 black rounded cubelets (instanced)
// plus one InstancedMesh of 9 stickers per face. Local origin: bottom center.
function createRubiksCube() {
  const cube = new THREE.Group()

  const N = 3
  const CUBELET = 0.034
  const SPACING = 0.0358 // small gap between cubelets
  const HALF = ((N - 1) / 2) * SPACING
  const SIZE = SPACING * (N - 1) + CUBELET // outer edge length

  const bodyGeo = new RoundedBoxGeometry(CUBELET, CUBELET, CUBELET, 2, 0.005)
  const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0x0c0c0e, roughness: 0.35, clearcoat: 0.8 })
  const cubelets = new THREE.InstancedMesh(bodyGeo, bodyMat, N * N * N)
  cubelets.castShadow = true
  const m = new THREE.Matrix4()
  let i = 0
  for (let x = 0; x < N; x++)
    for (let y = 0; y < N; y++)
      for (let z = 0; z < N; z++) {
        m.setPosition(x * SPACING - HALF, y * SPACING + CUBELET / 2, z * SPACING - HALF)
        cubelets.setMatrixAt(i++, m)
      }
  cube.add(cubelets)

  // 9 stickers per face — classic colors, slightly glossy
  const faces = [
    { color: 0xf5f2ea, normal: [0, 1, 0] }, // up: white
    { color: 0xe8c84a, normal: [0, -1, 0] }, // down: yellow
    { color: 0xc0392b, normal: [0, 0, 1] }, // front: red
    { color: 0xd97e28, normal: [0, 0, -1] }, // back: orange
    { color: 0x2f9e5b, normal: [1, 0, 0] }, // right: green
    { color: 0x2e6fb0, normal: [-1, 0, 0] }, // left: blue
  ]
  const stickerGeo = new THREE.PlaneGeometry(CUBELET * 0.8, CUBELET * 0.8)
  const dummy = new THREE.Object3D()
  const yCenter = HALF + CUBELET / 2 // cube center height above origin

  const off = SIZE / 2 + 0.0006 // just past the cubelet surface
  for (const { color, normal } of faces) {
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0 })
    const stickers = new THREE.InstancedMesh(stickerGeo, mat, N * N)
    const [nx, ny, nz] = normal
    let s = 0
    for (let a = 0; a < N; a++)
      for (let b = 0; b < N; b++) {
        const u = a * SPACING - HALF
        const v = b * SPACING - HALF
        if (ny !== 0) dummy.position.set(u, yCenter + ny * off, v)
        else if (nz !== 0) dummy.position.set(u, yCenter + v, nz * off)
        else dummy.position.set(nx * off, yCenter + v, u)
        dummy.lookAt(
          dummy.position.x + nx,
          dummy.position.y + ny,
          dummy.position.z + nz
        )
        dummy.updateMatrix()
        stickers.setMatrixAt(s++, dummy.matrix)
      }
    cube.add(stickers)
  }

  return cube
}
