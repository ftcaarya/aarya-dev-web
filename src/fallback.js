import { buildFeatured, buildProjects, buildTerminal } from './screens/dom.js'

export function webglAvailable() {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

// Three render modes, decided once at load:
//   '3d'     — full scene (capable desktop)
//   'flat'   — stacked HTML with all content (reduced-motion / no WebGL desktop)
//   'mobile' — phone on a desk you zoom into, with apps per project
//              (phones; see mobile/experience.js)
// Order matters: a phone with reduced-motion on is still a phone (it gets
// the phone UI without the zoom), and a desktop user with reduced-motion on
// gets the flat layout, never the phone.
export function pickMode() {
  const params = new URLSearchParams(location.search)
  if (params.has('mobile')) return 'mobile'
  if (params.has('flat')) return 'flat'

  if (window.innerWidth < 768) return 'mobile'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'flat'
  if (!webglAvailable()) return 'flat'
  return '3d'
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
