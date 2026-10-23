import * as THREE from 'three'
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { COLORS } from './config.js'

// Sets up the two synced renderers (WebGL behind, CSS3D in front), the shared
// camera, the environment map, and the bloom composer.
// `lite` (phones): WebGL only — no CSS3D layer, shadows, or bloom, a capped
// pixel ratio, and a wider lens so a portrait screen still takes in the desk.
export function createWorld({ lite = false } = {}) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(COLORS.bg)
  scene.fog = new THREE.Fog(COLORS.bg, 8, 16)

  const cssScene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(lite ? 50 : 40, innerWidth / innerHeight, lite ? 0.01 : 0.05, 30)
  camera.position.set(0, 1.5, 3.3)

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
  const maxDpr = lite ? 1.5 : 2
  renderer.setPixelRatio(Math.min(devicePixelRatio, maxDpr))
  renderer.setSize(innerWidth, innerHeight)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  renderer.shadowMap.enabled = !lite
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  document.getElementById('webgl').appendChild(renderer.domElement)

  const cssRenderer = lite ? null : new CSS3DRenderer()
  if (cssRenderer) {
    cssRenderer.setSize(innerWidth, innerHeight)
    document.getElementById('css3d').appendChild(cssRenderer.domElement)
  }

  // Procedural environment map (code-built stand-in for an HDRI; swap for
  // RGBELoader + a real .hdr file if we want richer reflections later).
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environmentIntensity = 0.22
  pmrem.dispose()

  // Bloom composer — high threshold so only emissive/screen-bright areas glow.
  let composer = null
  let bloom = null
  if (!lite) {
    composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    bloom = new UnrealBloomPass(
      new THREE.Vector2(innerWidth, innerHeight),
      0.32, // strength
      0.4, // radius
      0.8 // threshold
    )
    composer.addPass(bloom)
    composer.addPass(new OutputPass())
  }

  function resize() {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setPixelRatio(Math.min(devicePixelRatio, maxDpr))
    renderer.setSize(innerWidth, innerHeight)
    composer?.setSize(innerWidth, innerHeight)
    cssRenderer?.setSize(innerWidth, innerHeight)
  }
  window.addEventListener('resize', resize)

  function render() {
    if (composer) composer.render()
    else renderer.render(scene, camera)
    cssRenderer?.render(cssScene, camera)
  }

  return { scene, cssScene, camera, renderer, cssRenderer, composer, bloom, render, resize }
}
