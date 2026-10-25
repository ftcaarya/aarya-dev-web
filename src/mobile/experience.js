import { webglAvailable } from '../fallback.js'
import { appList } from './apps.js'
import { createPhoneUI } from './phone-ui.js'

// Phones: a phone lying on the desk; scrolling zooms onto it and hands off to
// a real DOM phone UI with an app per project. With reduced motion or no
// WebGL, the phone UI is shown on its own (no 3D, nothing downloaded for it).
export function startMobile(content) {
  document.body.classList.add('phone-mode')
  document.getElementById('dots')?.remove()
  document.getElementById('css3d')?.remove()

  const apps = appList(content)
  const zoom = webglAvailable() && !matchMedia('(prefers-reduced-motion: reduce)').matches
  const ui = createPhoneUI(content, apps, { zoom })

  if (!zoom) {
    document.body.classList.add('phone-static')
    for (const id of ['hero', 'cue', 'track', 'webgl']) document.getElementById(id)?.remove()
    ui.setReveal(1)
    return
  }

  // Snap points at both ends so one swipe goes all the way in or out
  document.documentElement.classList.add('phone-snap')
  const track = document.getElementById('track')
  track.append(document.createElement('i'), document.createElement('i'))
  ui.setReveal(0)

  const hero = ['hero', 'cue'].map((id) => document.getElementById(id))

  import('./scene.js').then(({ startPhoneScene }) => {
    startPhoneScene(content, apps, {
      frozen: ui.isBusy,
      onProgress(u) {
        const fade = String(Math.max(0, 1 - u * 4))
        hero.forEach((n) => { n.style.opacity = fade })
        // DOM phone fades in over the last stretch of the zoom
        const reveal = Math.min(1, Math.max(0, (u - 0.86) / 0.12))
        ui.setReveal(reveal)
        return reveal >= 1
      },
    })
  })
}
