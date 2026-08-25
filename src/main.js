import { content } from './content.js'
import { shouldFallback, renderFallback } from './fallback.js'

if (shouldFallback()) {
  renderFallback(content)
} else {
  // Heavy 3D bundle is only fetched on capable desktops.
  import('./experience.js').then(({ startExperience }) => startExperience(content))
}
