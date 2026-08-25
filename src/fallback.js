import { buildFeatured, buildProjects, buildTerminal } from './screens/dom.js'

function webglAvailable() {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export function shouldFallback() {
  const forced = new URLSearchParams(location.search).has('flat')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const narrow = window.innerWidth < 768
  return forced || reducedMotion || narrow || !webglAvailable()
}

// Plain stacked layout reusing the exact same content builders as the 3D
// screens. This is also what reduced-motion users and crawlers on small
// viewports get — full content, zero scroll-jacking.
export function renderFallback(content) {
  document.body.classList.add('fallback-mode')
  document.getElementById('hero').remove()
  document.getElementById('cue').remove()
  document.getElementById('dots').remove()

  const main = document.getElementById('fallback')
  main.hidden = false

  const hero = document.createElement('section')
  hero.className = 'fb-section fb-hero'
  hero.innerHTML = `<h1>${content.name}</h1><p>${content.role}</p>`
  main.appendChild(hero)

  const sections = [
    buildFeatured(content.projects[0], content.featured),
    buildProjects(content.projects),
    buildTerminal(content.about, { animate: false }).root,
  ]
  for (const node of sections) {
    const section = document.createElement('section')
    section.className = 'fb-section'
    section.appendChild(node)
    // boot animation is a 3D-screen thing; show everything immediately here
    section.querySelectorAll('.boot').forEach((b) => b.classList.remove('boot'))
    main.appendChild(section)
  }

  const footer = document.createElement('footer')
  footer.className = 'fb-footer'
  footer.textContent = `© ${new Date().getFullYear()} ${content.name} — built from code`
  main.appendChild(footer)
}
