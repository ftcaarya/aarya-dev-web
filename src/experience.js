import * as THREE from 'three'
import { createWorld } from './scene/world.js'
import { MONITORS } from './scene/config.js'
import { createMonitor } from './scene/monitor.js'
import { createEnvironmentSet } from './scene/desk.js'
import { createLighting } from './scene/lighting.js'
import { createRig } from './camera/rig.js'
import { createScreens } from './screens/screens3d.js'

export function startExperience(content) {
  const world = createWorld()
  createLighting(world.scene)

  const env = createEnvironmentSet()
  world.scene.add(env.group)

  const monitors = MONITORS.map(createMonitor)
  monitors.forEach((m) => world.scene.add(m.group))

  // Selecting a project flies the camera back to the featured (left) monitor
  // so the updated description is actually seen. `rig` is assigned below but
  // exists by the time a click can happen.
  const screens = createScreens(world.cssScene, monitors, content, () => rig?.scrollToStop(1))

  // Camera framing targets: one per monitor
  const frames = monitors.map(({ cfg, normal }) => ({
    center: new THREE.Vector3(...cfg.pos),
    normal: normal.clone(),
    w: cfg.w,
    h: cfg.h,
  }))

  let rig
  rig = createRig({
    camera: world.camera,
    frames,
    onWaypoint: (i) => {
      screens.setActive(i)
      if (i >= 0) rig?.setDot(i)
    },
  })

  const clock = new THREE.Clock()
  world.renderer.setAnimationLoop(() => {
    env.update(clock.getElapsedTime())
    world.render()
  })
}
