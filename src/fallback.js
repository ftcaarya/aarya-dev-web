import { buildFeatured, buildProjects, buildTerminal } from './screens/dom.js'

function webglAvailable() {
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
//   'mobile' — compact card + "open on a desktop" note (phones)
// Order matters: a phone with reduced-motion on is still a phone, and a
// desktop user with reduced-motion on must never be told to "view on a laptop".
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

// Phones get a compact card instead of the 3D scene: enough to know who you
// are and how to reach you, with the full experience pointed at a desktop.
// Deliberately still real DOM — crawlers and share previews read this.
export function renderMobile(content) {
  document.body.classList.add('fallback-mode', 'mobile-mode')
  document.getElementById('hero')?.remove()
  document.getElementById('cue')?.remove()
  document.getElementById('dots')?.remove()

  const main = document.getElementById('fallback')
  main.hidden = false

  const card = document.createElement('section')
  card.className = 'mb-card'

  const head = document.createElement('div')
  head.className = 'mb-head'
  head.innerHTML =
    `<h1>${content.name}</h1><p class="mb-role">${content.role}</p>`
  card.appendChild(head)

  const note = document.createElement('p')
  note.className = 'mb-note'
  note.innerHTML =
    'This portfolio is a 3D desk scene rendered in real time. ' +
    '<strong>Open it on a laptop or desktop</strong> for the full thing.'
  card.appendChild(note)

  const label = document.createElement('p')
  label.className = 'screen-label'
  label.textContent = 'Work'
  card.appendChild(label)

  const list = document.createElement('ul')
  list.className = 'mb-projects'
  content.projects.forEach((p) => {
    const li = document.createElement('li')
    li.innerHTML =
      `<span class="mb-proj-name">${p.name}</span>` +
      `<span class="mb-proj-line">${p.line}</span>` +
      `<span class="mb-proj-tech">${p.tech.join(' · ')}</span>`
    list.appendChild(li)
  })
  card.appendChild(list)

  const contact = document.createElement('div')
  contact.className = 'mb-contact'
  content.about.links.forEach(({ label: name, href, mono }) => {
    const a = document.createElement('a')
    a.href = href
    if (href.startsWith('http')) { a.target = '_blank'; a.rel = 'noreferrer' }
    a.innerHTML = `<span class="mb-link-label">${name}</span><span class="mb-link-mono">${mono}</span>`
    contact.appendChild(a)
  })
  card.appendChild(contact)

  main.appendChild(card)

  const footer = document.createElement('footer')
  footer.className = 'fb-footer'
  footer.textContent = `© ${new Date().getFullYear()} ${content.name} — built from code`
  main.appendChild(footer)
}
