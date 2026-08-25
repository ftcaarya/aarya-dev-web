import * as THREE from 'three'
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js'

// One soft warm key light + low ambient fill. Screen bounce lights are owned
// by each monitor (RectAreaLight in monitor.js); this inits their uniforms.
export function createLighting(scene) {
  RectAreaLightUniformsLib.init()

  const hemi = new THREE.HemisphereLight(0x3a3f4a, 0x0a0a0c, 0.5)
  scene.add(hemi)

  const key = new THREE.SpotLight(0xffe9cf, 26, 0, 0.75, 0.9, 1.6)
  key.position.set(2.6, 3.6, 2.8)
  key.target.position.set(-0.3, 0.8, 0)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  key.shadow.bias = -0.0004
  key.shadow.radius = 4
  scene.add(key)
  scene.add(key.target)

  // faint cool fill from the opposite side so shadows aren't dead black
  const fill = new THREE.PointLight(0x2b3242, 3, 8, 1.8)
  fill.position.set(-2.4, 2.2, 1.8)
  scene.add(fill)
}
