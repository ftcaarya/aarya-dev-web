import { el, esc, linkEl, buildFeatured, buildTerminal } from '../screens/dom.js'
import { iconSvg } from './icons.js'

// The phone's apps, derived from content.js. Each app is
// { id, label, icon (svg), title, build(ctx) → { root, onOpen?, onClose? } }.
// `grid` fills the home screen; `dock` is the bottom row.

const TINTS = ['#8ecbdf', '#d8b48a', '#8fd8b4', '#a9a3e8', '#e8c84a', '#7fb2f0', '#e89a9a']

function emailLink(content) {
  return content.about.links.find((l) => l.href.startsWith('mailto:'))
}

function pauseVideos(root) {
  root.querySelectorAll('video').forEach((v) => v.pause())
}

function buildProjectApp(project) {
  const root = buildFeatured(project, { label: 'Project' })
  return {
    root,
    // galleries only play while their tab is showing; resume them on reopen
    onOpen: () => root.querySelectorAll('.tab-pane:not([hidden]) video').forEach((v) => {
      if (v.src) v.play().catch(() => {})
    }),
    onClose: () => pauseVideos(root),
  }
}

// Albums are the projects that have gallery media. Thumbnails only load the
// first time an album is shown.
function buildPhotos(content, { openViewer }) {
  const root = el('div', 'photos')
  const albums = content.projects
    .filter((p) => p.gallery?.length)
    .map((p) => ({ label: p.app?.label ?? p.name, items: p.gallery }))

  if (!albums.length) {
    root.appendChild(el('p', 'app-empty', 'No photos yet.'))
    return { root }
  }

  const seg = el('div', 'seg')
  const grids = albums.map(({ items }) => {
    const grid = el('div', 'photo-grid')
    grid.hidden = true
    const thumbs = items.map(({ src, caption }, i) => {
      const isVideo = /\.(mp4|webm|mov)$/i.test(src)
      const btn = el('button', isVideo ? 'thumb is-video' : 'thumb')
      btn.type = 'button'
      btn.setAttribute('aria-label', caption ?? `${isVideo ? 'Video' : 'Photo'} ${i + 1}`)
      const m = el(isVideo ? 'video' : 'img')
      if (isVideo) Object.assign(m, { muted: true, playsInline: true, preload: 'metadata' })
      else Object.assign(m, { alt: caption ?? '', decoding: 'async' })
      btn.appendChild(m)
      btn.addEventListener('click', () => openViewer(items, i))
      grid.appendChild(btn)
      // #t= asks the browser for a still frame to use as the thumbnail
      return () => { m.src = isVideo ? `${src}#t=0.1` : src }
    })
    let loaded = false
    grid.load = () => {
      if (loaded) return
      loaded = true
      thumbs.forEach((load) => load())
    }
    return grid
  })

  let current = 0
  function show(i) {
    current = i
    seg.querySelectorAll('button').forEach((b, j) => b.classList.toggle('on', j === i))
    grids.forEach((g, j) => { g.hidden = j !== i })
    grids[i].load()
  }

  albums.forEach(({ label, items }, i) => {
    const b = el('button', null, `${esc(label)} <span>${items.length}</span>`)
    b.type = 'button'
    b.addEventListener('click', () => show(i))
    seg.appendChild(b)
  })

  root.append(seg, ...grids)
  return { root, onOpen: () => show(current) }
}

function buildMail(content) {
  const root = el('div', 'contact')
  const initials = content.name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2)
  root.appendChild(el('div', 'avatar', esc(initials)))
  root.appendChild(el('h2', null, esc(content.name)))
  root.appendChild(el('p', 'role', esc(content.role)))

  const email = emailLink(content)
  if (email) root.appendChild(linkEl(email.href, 'Send an email', 'contact-cta'))

  const list = el('div', 'contact-rows')
  content.about.links.forEach(({ label, href, mono }) => {
    list.appendChild(
      linkEl(href, `<span class="row-label">${esc(label)}</span><span class="row-value">${esc(mono)}</span>`)
    )
  })
  root.appendChild(list)
  return { root }
}

function buildTerminalApp(content) {
  const { root, play } = buildTerminal(content.about, { animate: true })
  return { root, onOpen: () => play?.() }
}

// Every link with a `logo` across all projects is press coverage.
function buildPress(content) {
  const root = el('div', 'press-app')
  const items = content.projects.flatMap((p) =>
    (p.links ?? []).filter((l) => l.logo).map((l) => ({ ...l, project: p.name }))
  )
  if (!items.length) {
    root.appendChild(el('p', 'app-empty', 'No press yet.'))
    return { root }
  }
  items.forEach(({ label, href, logo, project }) => {
    const a = linkEl(href, '', 'press-item')
    const card = el('span', 'press-logo')
    const img = el('img')
    img.src = logo
    img.alt = label
    img.onerror = () => img.replaceWith(el('span', 'press-name', esc(label)))
    card.appendChild(img)
    a.appendChild(card)
    a.appendChild(el('span', 'press-meta', `<b>${esc(label)}</b><span>On ${esc(project)}</span>`))
    a.appendChild(el('span', 'press-read', 'Read ↗'))
    root.appendChild(a)
  })
  return { root }
}

function buildResume(content) {
  const root = el('div', 'resume-app')
  root.appendChild(el('div', 'resume-doc', iconSvg('resume', '#d8d4c8')))
  root.appendChild(el('h2', null, `${esc(content.name)} — Resume`))
  if (content.resume) {
    root.appendChild(el('p', 'role', 'PDF'))
    root.appendChild(linkEl(content.resume, 'Open resume ↗', 'contact-cta'))
  } else {
    root.appendChild(el('p', 'role', 'Available on request.'))
    const email = emailLink(content)
    if (email) root.appendChild(linkEl(`${email.href}?subject=Resume%20request`, 'Request by email', 'contact-cta'))
  }
  return { root }
}

export function appList(content) {
  const app = (id, label, icon, tint, title, build) => ({ id, label, icon: iconSvg(icon, tint), title, build })

  const projects = content.projects.map((p, i) =>
    app(`project-${i}`, p.app?.label ?? p.name, p.app?.icon ?? 'code', p.app?.tint ?? TINTS[i % TINTS.length], p.name, () => buildProjectApp(p))
  )

  return {
    grid: [...projects, app('resume', 'Resume', 'resume', '#d8d4c8', 'Resume', () => buildResume(content))],
    dock: [
      app('photos', 'Photos', 'photos', '#f0b37e', 'Photos', (ctx) => buildPhotos(content, ctx)),
      app('mail', 'Contact', 'mail', '#5fa8f5', 'Contact', () => buildMail(content)),
      app('terminal', 'Terminal', 'terminal', '#9ba3ad', 'Terminal', () => buildTerminalApp(content)),
      app('press', 'Press', 'press', '#a9a3e8', 'Press', () => buildPress(content)),
    ],
  }
}
