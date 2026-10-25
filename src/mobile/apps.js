import { el, esc, linkEl, buildFeatured } from '../screens/dom.js'
import { iconSvg, appIcon, iconNode } from './icons.js'

// The phone's apps, derived from content.js. Each app is
// { id, label, icon, title, build(ctx) → { root, footer?, onOpen?, onClose? } }.
// `grid` fills the home screen; `dock` is the bottom row. `notifications` are
// the lock screen's, each resolved to the app it opens.

const TINTS = ['#8ecbdf', '#d8b48a', '#8fd8b4', '#a9a3e8', '#e8c84a', '#7fb2f0', '#e89a9a']

const BRAND = { github: 'GitHub', linkedin: 'LinkedIn', email: 'Email' }

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const initialsOf = (name) => name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2)

function emailLink(content) {
  return content.about.links.find((l) => l.href.startsWith('mailto:'))
}

function pauseVideos(root) {
  root.querySelectorAll('video').forEach((v) => v.pause())
}

// --- Project apps -----------------------------------------------------------

// App Store-style header: icon, name, one-liner, and an Open button for the
// project's first web link.
function appHero(project, icon) {
  const hero = el('div', 'app-hero')
  hero.appendChild(iconNode(icon, 'hero-icon'))
  const text = el('div', 'hero-text', `<h2>${esc(project.name)}</h2><p>${esc(project.role ?? project.line)}</p>`)
  const web = (project.links ?? []).find((l) => l.href.startsWith('http') && !l.logo)
  if (web) text.appendChild(linkEl(web.href, 'Open', 'get'))
  hero.appendChild(text)
  return hero
}

function section(title, child) {
  const s = el('section', 'app-section')
  s.appendChild(el('h3', null, esc(title)))
  s.appendChild(child)
  return s
}

// FTC: headline stats and a swipeable card per season
function ftcSeasons(project) {
  const wrap = el('div')
  if (project.stats?.length) {
    const stats = el('div', 'stat-row')
    project.stats.forEach(({ value, label }) => stats.appendChild(el('div', 'stat', `<b>${esc(value)}</b><span>${esc(label)}</span>`)))
    wrap.appendChild(stats)
  }
  const rail = el('div', 'rail')
  project.seasons.forEach(({ name, years, team, number, results }) => {
    const card = el('article', 'season')
    card.innerHTML =
      `<header><b>${esc(name)}</b><span>${esc(years)}</span></header>` +
      `<p class="team">${esc(team)} <span>#${esc(number)}</span></p>` +
      `<ul>${results.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>`
    rail.appendChild(card)
  })
  wrap.appendChild(section('Seasons', rail))
  return wrap
}

// Quiz Clash: a short playable quiz about me, in the app's own style
function quizCard(questions, live) {
  const card = el('div', 'quiz')
  let i = 0
  let score = 0

  function ask() {
    const { q, options, answer, why } = questions[i]
    card.innerHTML =
      `<p class="quiz-meta"><span>Question ${i + 1} of ${questions.length}</span><span>${score} correct</span></p>` +
      `<div class="quiz-bar"><i style="width:${(i / questions.length) * 100}%"></i></div>` +
      `<p class="quiz-q">${esc(q)}</p>`
    const opts = el('div', 'quiz-opts')
    options.forEach((o, j) => {
      const b = el('button', 'quiz-opt', esc(o))
      b.type = 'button'
      b.addEventListener('click', () => {
        if (opts.dataset.done) return
        opts.dataset.done = '1'
        const right = j === answer
        if (right) score++
        navigator.vibrate?.(right ? 10 : [12, 40, 12])
        b.classList.add(right ? 'right' : 'wrong')
        opts.children[answer].classList.add('right')
        const next = el('button', 'quiz-next', i + 1 < questions.length ? 'Next question' : 'See result')
        next.type = 'button'
        next.addEventListener('click', () => { i++; i < questions.length ? ask() : finish() })
        card.append(el('p', 'quiz-why', esc(why)), next)
      })
      opts.appendChild(b)
    })
    card.appendChild(opts)
  }

  function finish() {
    // same flavour as the real game's ELO ladder
    const delta = [-12, 6, 14, 24][Math.min(score, 3)]
    card.innerHTML =
      `<p class="quiz-meta"><span>Result</span></p>` +
      `<p class="quiz-score">${score}<span>/${questions.length}</span></p>` +
      `<p class="quiz-elo ${delta < 0 ? 'down' : ''}">${delta < 0 ? '' : '+'}${delta} ELO</p>`
    const again = el('button', 'quiz-next', 'Play again')
    again.type = 'button'
    again.addEventListener('click', () => { i = 0; score = 0; ask() })
    card.appendChild(again)
    if (live) card.appendChild(linkEl(live, 'Play the real thing ↗', 'quiz-live'))
  }

  ask()
  return card
}

function buildProjectApp(project, icon, content) {
  const root = el('div', 'proj-app')
  root.appendChild(appHero(project, icon))

  if (project.seasons?.length) root.appendChild(ftcSeasons(project))
  const isQuiz = /quiz/i.test(project.name) && content.phone?.quiz?.length
  if (isQuiz) {
    const live = (project.links ?? []).find((l) => l.href.startsWith('http'))?.href
    root.appendChild(section('Quick round: how well do you know me?', quizCard(content.phone.quiz, live)))
  }

  const body = buildFeatured(project, { label: 'Project' })
  body.classList.add('proj-body')
  root.appendChild(body)
  return {
    root,
    // galleries only play while their tab is showing; resume them on reopen
    onOpen: () => body.querySelectorAll('.tab-pane:not([hidden]) video').forEach((v) => {
      if (v.src) v.play().catch(() => {})
    }),
    onClose: () => pauseVideos(root),
  }
}

// --- Photos -----------------------------------------------------------------

// Memories (one slowly panning card per album) over a segmented album
// library. Thumbnails only load the first time an album is shown.
function buildPhotos(content, { openViewer }) {
  const root = el('div', 'photos')
  const albums = content.projects
    .filter((p) => p.gallery?.length)
    .map((p) => ({ label: p.app?.label ?? p.name, title: p.name, items: p.gallery }))

  if (!albums.length) {
    root.appendChild(el('p', 'app-empty', 'No photos yet.'))
    return { root }
  }

  const isVideo = (src) => /\.(mp4|webm|mov)$/i.test(src)

  const memories = el('div', 'rail memories')
  const covers = []
  albums.forEach(({ label, title, items }) => {
    const photos = items.filter((m) => !isVideo(m.src))
    const cover = photos[0] ?? items[0]
    const b = el('button', 'memory')
    b.type = 'button'
    const img = el('img')
    img.alt = ''
    covers.push(() => { if (!isVideo(cover.src)) img.src = cover.src })
    const videos = items.length - photos.length
    b.append(img, el('span', 'memory-text', `<b>${esc(label)}</b><span>${esc(title)} · ${photos.length} photos${videos ? `, ${videos} videos` : ''}</span>`))
    b.addEventListener('click', () => openViewer(items, items.indexOf(cover)))
    memories.appendChild(b)
  })

  const seg = el('div', 'seg')
  const grids = albums.map(({ items }) => {
    const grid = el('div', 'photo-grid')
    grid.hidden = true
    const thumbs = items.map(({ src, caption }, i) => {
      const video = isVideo(src)
      const btn = el('button', video ? 'thumb is-video' : 'thumb')
      btn.type = 'button'
      btn.setAttribute('aria-label', caption ?? `${video ? 'Video' : 'Photo'} ${i + 1}`)
      const m = el(video ? 'video' : 'img')
      if (video) Object.assign(m, { muted: true, playsInline: true, preload: 'metadata' })
      else Object.assign(m, { alt: caption ?? '', decoding: 'async' })
      btn.appendChild(m)
      btn.addEventListener('click', () => openViewer(items, i))
      grid.appendChild(btn)
      // #t= asks the browser for a still frame to use as the thumbnail
      return () => { m.src = video ? `${src}#t=0.1` : src }
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

  const library = el('div')
  library.append(seg, ...grids)
  root.append(section('Memories', memories), section('Albums', library))
  let coversLoaded = false
  return {
    root,
    onOpen: () => {
      if (!coversLoaded) { coversLoaded = true; covers.forEach((c) => c()) }
      show(current)
    },
  }
}

// --- Messages ---------------------------------------------------------------

// An iMessage-style thread from me; the visitor's reply opens their email
// app with the message filled in.
function buildMessages(content) {
  const root = el('div', 'thread')
  const email = emailLink(content)
  const lines = content.phone?.messages ?? []

  root.appendChild(
    el('div', 'thread-head', `<span class="avatar">${esc(initialsOf(content.name))}</span><b>${esc(content.name)}</b>`)
  )
  const list = el('div', 'bubbles')
  root.appendChild(list)

  const links = el('div', 'thread-links')
  content.about.links.forEach(({ label, href, mono }) => {
    links.appendChild(linkEl(href, `<b>${esc(BRAND[label] ?? label)}</b><span>${esc(mono)}</span>`, 'link-card'))
  })

  // Composer
  const footer = el('form', 'composer')
  const input = el('input')
  Object.assign(input, { type: 'text', placeholder: 'Message', enterKeyHint: 'send', autocomplete: 'off' })
  input.setAttribute('aria-label', 'Message')
  const send = el('button', 'send', '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>')
  send.type = 'submit'
  send.setAttribute('aria-label', 'Send')
  footer.append(input, send)
  input.addEventListener('input', () => footer.classList.toggle('has-text', !!input.value.trim()))
  footer.addEventListener('submit', (e) => {
    e.preventDefault()
    const text = input.value.trim()
    if (!text || !email) return
    list.appendChild(el('p', 'bubble out', esc(text)))
    list.appendChild(el('p', 'bubble-note', 'Opening your email app…'))
    input.value = ''
    footer.classList.remove('has-text')
    input.blur()
    const subject = encodeURIComponent('Hello from your portfolio')
    location.href = `${email.href}?subject=${subject}&body=${encodeURIComponent(text)}`
  })

  // First open: messages arrive one by one behind a typing indicator
  let played = false
  async function play() {
    if (played) return
    played = true
    const wait = (ms) => new Promise((r) => setTimeout(r, ms))
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    for (const [i, text] of lines.entries()) {
      if (!reduce) {
        const typing = el('p', 'bubble in typing', '<i></i><i></i><i></i>')
        list.appendChild(typing)
        await wait(i ? Math.min(1400, 350 + text.length * 9) : 600)
        typing.remove()
      }
      const b = el('p', 'bubble in', esc(text))
      list.appendChild(b)
      if (!reduce) await wait(250)
    }
    list.appendChild(links)
  }

  return { root, footer, onOpen: play }
}

// --- Terminal ---------------------------------------------------------------

// A small shell: types `whoami` + `cat about.txt` on first open, then takes
// commands.
function buildTerminalApp(content, projectApps, ctx) {
  const root = el('div', 'shell')
  const out = el('div', 'shell-out')
  const line = el('label', 'shell-line', '<span class="prompt">~ $</span>')
  const input = el('input')
  Object.assign(input, { type: 'text', autocapitalize: 'off', spellcheck: false, enterKeyHint: 'go', autocomplete: 'off' })
  input.setAttribute('autocorrect', 'off')
  input.setAttribute('aria-label', 'Terminal command')
  line.appendChild(input)
  root.append(out, line)

  const about = content.about
  const intro = about.lines.filter((l) => l.out.length)
  const print = (html, cls = 'o') => out.appendChild(el('div', cls, html))
  const echo = (cmd) => print(`<span class="prompt">~ $</span> ${esc(cmd)}`, 'c')
  const scrollDown = () => root.closest('.ph-scroll')?.scrollTo({ top: 1e6 })
  const linkHtml = ({ label, href, mono }) =>
    `<a href="${href}"${href.startsWith('http') ? ' target="_blank" rel="noreferrer"' : ''}>${esc(label)}</a> <span class="dim">${esc(mono)}</span>`

  const commands = {
    help: () => print(
      ['whoami', 'about', 'projects', 'contact', 'github', 'linkedin', 'email', 'clear', 'exit']
        .map((c) => `<span class="cmd">${c}</span>`).join('  ')
    ),
    whoami: () => (about.lines.find((l) => l.cmd === 'whoami')?.out ?? [content.name]).forEach((o) => print(esc(o))),
    about: () => (about.lines.find((l) => /about/.test(l.cmd))?.out ?? []).forEach((o) => print(esc(o) || '&nbsp;')),
    projects: () => projectApps.forEach((p, i) => print(`<span class="dim">${i + 1}</span> ${esc(p.project.name)} <span class="dim">— ${esc(p.project.line)}</span>`)),
    contact: () => about.links.forEach((l) => print(linkHtml(l))),
    ls: () => print('about.txt  projects/  contact/'),
    pwd: () => print('/home/aarya'),
    date: () => print(esc(new Date().toString().slice(0, 24))),
    clear: () => out.replaceChildren(),
    exit: () => ctx.close(),
    sudo: () => print('nice try.'),
  }
  const opener = (label) => () => {
    const l = about.links.find((x) => x.label === label)
    if (l) { print(`opening ${esc(l.mono)}…`); window.open(l.href, l.href.startsWith('http') ? '_blank' : '_self') }
  }
  commands.github = opener('github')
  commands.linkedin = opener('linkedin')
  commands.email = opener('email')

  function run(raw) {
    const cmd = raw.trim()
    echo(cmd)
    if (!cmd) return
    const [name, ...args] = cmd.split(/\s+/)
    if (name === 'cat' && /about/.test(args[0] ?? '')) commands.about()
    else if (name === 'echo') print(esc(args.join(' ')))
    else if (commands[name.toLowerCase()]) commands[name.toLowerCase()]()
    else print(`command not found: ${esc(name)}. try <span class="cmd">help</span>`)
  }

  // tapping anywhere in the shell focuses the prompt (unless it's a link)
  root.addEventListener('click', (e) => {
    if (!e.target.closest('a') && !getSelection()?.toString()) input.focus()
  })

  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return
    run(input.value)
    input.value = ''
    scrollDown()
  })

  let played = false
  async function play() {
    if (played) return
    played = true
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms))
    line.hidden = true
    for (const { cmd, out: lines } of intro) {
      const c = el('div', 'c', '<span class="prompt">~ $</span> ')
      out.appendChild(c)
      for (const ch of cmd) { c.append(ch); await wait(32) }
      await wait(140)
      for (const o of lines) { print(esc(o) || '&nbsp;'); await wait(70) }
    }
    print('type <span class="cmd">help</span> to see what else is here', 'o dim')
    line.hidden = false
  }

  return { root, onOpen: play }
}

// --- Press / Resume ---------------------------------------------------------

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

// --- List -------------------------------------------------------------------

export function appList(content) {
  const app = (label, spec, title, build) => ({ id: slug(label), label, icon: appIcon(spec), title, build })

  const projects = content.projects.map((p, i) => {
    const spec = { icon: p.app?.icon ?? 'code', tint: p.app?.tint ?? TINTS[i % TINTS.length], image: p.app?.image }
    const a = app(p.app?.label ?? p.name, spec, p.name, () => buildProjectApp(p, a.icon, content))
    a.project = p
    return a
  })

  const grid = [...projects, app('Resume', { icon: 'resume', tint: '#d8d4c8' }, 'Resume', () => buildResume(content))]
  const dock = [
    app('Photos', { icon: 'photos', tint: '#f0b37e' }, 'Photos', (ctx) => buildPhotos(content, ctx)),
    app('Messages', { icon: 'messages', tint: '#62c97a' }, '', () => buildMessages(content)),
    app('Terminal', { icon: 'terminal', tint: '#9ba3ad' }, 'Terminal', (ctx) => buildTerminalApp(content, projects, ctx)),
    app('Press', { icon: 'press', tint: '#a9a3e8' }, 'Press', () => buildPress(content)),
  ]

  const byId = new Map([...grid, ...dock].map((a) => [a.id, a]))
  const notifications = (content.phone?.notifications ?? [])
    .map((n) => ({ ...n, app: byId.get(slug(n.open ?? '')) ?? byId.get('press') }))
    .filter((n) => n.app)

  return { grid, dock, notifications }
}
