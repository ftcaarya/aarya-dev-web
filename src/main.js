import { content } from './content.js'
import { pickMode, renderFallback } from './fallback.js'

const mode = pickMode()

if (mode === 'mobile') {
  import('./mobile/experience.js').then(({ startMobile }) => startMobile(content))
} else if (mode === 'flat') {
  renderFallback(content)
} else {
  // Heavy 3D bundle is only fetched on capable desktops.
  import('./experience.js').then(({ startExperience }) => startExperience(content))
}
