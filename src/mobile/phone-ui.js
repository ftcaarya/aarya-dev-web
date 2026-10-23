import { el, esc } from '../screens/dom.js'
import { applyLayoutVars } from './layout.js'

// Full-screen phone OS shown once the camera has zoomed onto the phone (or
// straight away when there's no 3D). Real DOM: tappable, crawlable, sharp.
//
// Apps open as sheets that grow out of their icon. Every open layer (app,
// photo viewer) pushes a history entry, so the browser/Android back gesture
// closes it; on-screen close buttons just call history.back().

const SYS_ICONS =
  '<svg viewBox="0 0 34 12" aria-hidden="true"><g fill="currentColor">' +
  '<rect x="0" y="8" width="3" height="4" rx="0.8"/><rect x="4.5" y="6" width="3" height="6" rx="0.8"/>' +
  '<rect x="9" y="3.5" width="3" height="8.5" rx="0.8"/><rect x="13.5" y="1" width="3" height="11" rx="0.8"/>' +
  '<rect x="22.5" y="2.5" width="9" height="7" rx="1.5"/></g>' +
  '<rect x="20.5" y="0.75" width="13" height="10.5" rx="2.6" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>'

function clockText() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M/i, '')
}

export function createPhoneUI(content, apps, { zoom }) {
  const root = el('div', 'phone-ui')
  root.id = 'phone-ui'
  applyLayoutVars(root)

  // --- Layers + history -----------------------------------------------------
  const stack = []
  function pushLayer(close) {
    stack.push(close)
    history.pushState({ phoneLayer: stack.length }, '')
  }
  const back = () => { if (stack.length) history.back() }
  window.addEventListener('popstate', () => stack.pop()?.())

  // --- Status bar -----------------------------------------------------------
  const status = el('div', 'ph-status', `<span class="ph-time"></span><span class="ph-sys">${SYS_ICONS}</span>`)
  const time = status.querySelector('.ph-time')
  const tick = () => { time.textContent = clockText() }
  tick()
  setInterval(tick, 15000)

  // --- Home screen ----------------------------------------------------------
  const home = el('div', 'ph-home')
  const initials = content.name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2)
  home.appendChild(
    el(
      'div',
      'ph-widget',
      `<span class="ph-avatar">${esc(initials)}</span>` +
        `<span class="ph-who"><b>${esc(content.name)}</b><span>${esc(content.role)}</span>` +
        `<em>Tap an app to explore</em></span>`
    )
  )

  const grid = el('div', 'ph-grid')
  const dock = el('div', 'ph-dock')
  const sheets = new Map()

  function appButton(app) {
    const b = el('button', 'ph-app', `<span class="ph-icon">${app.icon}</span><span class="ph-label">${esc(app.label)}</span>`)
    b.type = 'button'
    b.addEventListener('click', () => openApp(app, b.querySelector('.ph-icon')))
    return b
  }
  apps.grid.forEach((a) => grid.appendChild(appButton(a)))
  apps.dock.forEach((a) => dock.appendChild(appButton(a)))
  home.append(grid)
  if (zoom) home.appendChild(el('p', 'ph-hint', 'Scroll up to return to the desk'))
  home.append(dock)

  // --- Photo viewer ---------------------------------------------------------
  const viewer = el('div', 'ph-viewer')
  viewer.hidden = true
  const stage = el('div', 'pv-stage')
  const count = el('span', 'pv-count')
  const close = el('button', 'pv-close', '✕')
  close.type = 'button'
  close.setAttribute('aria-label', 'Close')
  const prev = el('button', 'pv-nav pv-prev', '‹')
  const next = el('button', 'pv-nav pv-next', '›')
  prev.type = next.type = 'button'
  prev.setAttribute('aria-label', 'Previous')
  next.setAttribute('aria-label', 'Next')
  viewer.append(stage, count, close, prev, next)

  let vItems = []
  let vIndex = 0
  function renderViewer() {
    const { src, caption } = vItems[vIndex]
    const isVideo = /\.(mp4|webm|mov)$/i.test(src)
    const m = el(isVideo ? 'video' : 'img')
    if (isVideo) Object.assign(m, { controls: true, autoplay: true, playsInline: true, loop: true })
    else m.alt = caption ?? ''
    m.src = src
    stage.replaceChildren(m)
    if (caption) stage.appendChild(el('p', 'pv-caption', esc(caption)))
    count.textContent = `${vIndex + 1} / ${vItems.length}`
  }
  const step = (d) => {
    vIndex = (vIndex + d + vItems.length) % vItems.length
    renderViewer()
  }
  prev.addEventListener('click', () => step(-1))
  next.addEventListener('click', () => step(1))
  close.addEventListener('click', back)

  // horizontal swipe to page through
  let sx = null
  stage.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX }, { passive: true })
  stage.addEventListener('touchend', (e) => {
    if (sx == null) return
    const dx = e.changedTouches[0].clientX - sx
    sx = null
    if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1)
  })

  function openViewer(items, i) {
    vItems = items
    vIndex = i
    renderViewer()
    viewer.hidden = false
    pushLayer(() => {
      viewer.hidden = true
      stage.replaceChildren() // stops any playing video
    })
  }

  // --- App sheets -----------------------------------------------------------
  // Built up front so all content is in the DOM; media inside loads lazily.
  const sheetLayer = el('div', 'ph-sheets')
  for (const app of [...apps.grid, ...apps.dock]) {
    const built = app.build({ openViewer })
    const sheet = el('section', 'ph-sheet')
    sheet.hidden = true
    sheet.setAttribute('aria-label', app.title)
    const bar = el('header', 'ph-bar')
    const backBtn = el('button', 'ph-back', '‹ Home')
    backBtn.type = 'button'
    backBtn.addEventListener('click', back)
    bar.append(backBtn, el('span', 'ph-title', esc(app.title)))
    const scroll = el('div', 'ph-scroll')
    const body = el('div', 'app-body')
    body.appendChild(built.root)
    scroll.appendChild(body)
    sheet.append(bar, scroll)
    sheetLayer.appendChild(sheet)
    sheets.set(app.id, { sheet, scroll, built })
  }

  function openApp(app, iconEl) {
    if (stack.length) return
    const s = sheets.get(app.id)
    const r = iconEl.getBoundingClientRect()
    const box = root.getBoundingClientRect()
    s.sheet.style.transformOrigin = `${r.left + r.width / 2 - box.left}px ${r.top + r.height / 2 - box.top}px`
    clearTimeout(s.hideTimer)
    s.sheet.hidden = false
    s.scroll.scrollTop = 0
    // two frames: let the hidden→shown layout land before transitioning
    requestAnimationFrame(() => requestAnimationFrame(() => s.sheet.classList.add('open')))
    s.built.onOpen?.()
    root.classList.add('in-app')
    pushLayer(() => {
      s.sheet.classList.remove('open')
      s.built.onClose?.()
      root.classList.remove('in-app')
      s.hideTimer = setTimeout(() => { s.sheet.hidden = true }, 400)
    })
  }

  const indicator = el('button', 'ph-indicator')
  indicator.type = 'button'
  indicator.setAttribute('aria-label', 'Home')
  indicator.addEventListener('click', back)

  root.append(home, sheetLayer, status, indicator, viewer)
  document.body.appendChild(root)

  // 0 = hidden (desk view), 1 = fully shown and interactive
  function setReveal(f) {
    root.style.opacity = String(f)
    root.style.visibility = f > 0 ? 'visible' : 'hidden'
    root.classList.toggle('live', f >= 1)
  }

  return { root, setReveal }
}
