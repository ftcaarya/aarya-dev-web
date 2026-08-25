// Shared DOM builders for screen content. Used both by the CSS3D screens in
// the 3D scene and by the stacked fallback layout — keep them context-free.

function el(tag, className, html) {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (html != null) node.innerHTML = html
  return node
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Monitor 1 — featured project view for one project (`deco` carries the
// shared label + code snippet dressing from content.featured)
export function buildFeatured(project, deco) {
  const root = el('div')

  root.appendChild(el('p', 'screen-label boot', esc(deco.label)))
  root.appendChild(el('h2', 'boot', esc(project.name)))
  root.appendChild(el('p', 'desc boot', esc(project.description)))

  const tags = el('div', 'tags boot')
  project.tech.forEach((t) => tags.appendChild(el('span', null, esc(t))))
  root.appendChild(tags)

  const editor = el('div', 'editor boot')
  editor.appendChild(el('div', 'editor-bar', '<i></i><i></i><i></i>'))
  const pre = el('pre')
  const code = deco.snippet
    .map((tok) => (tok.t === 'br' ? '\n' : `<span class="${tok.t}">${esc(tok.s)}</span>`))
    .join('')
  pre.innerHTML = code + '<span class="caret"></span>'
  editor.appendChild(pre)
  root.appendChild(editor)

  const links = el('div', 'screen-links boot')
  project.links.forEach(({ label, href }) => {
    const a = el('a', null, esc(label) + ' ↗')
    a.href = href
    if (href.startsWith('http')) { a.target = '_blank'; a.rel = 'noreferrer' }
    links.appendChild(a)
  })
  root.appendChild(links)

  return root
}

// Monitor 2 — project list. With `onSelect`, rows are buttons that highlight
// and notify (3D scene: featured monitor mirrors the selection). Without it
// (fallback layout), rows are plain links to the project's first link.
export function buildProjects(projects, { onSelect } = {}) {
  const root = el('div')
  root.appendChild(el('p', 'screen-label boot', 'Projects'))

  const rows = []
  const list = el('ul', 'proj-list boot')
  projects.forEach((p, i) => {
    const li = el('li')
    const row = el(onSelect ? 'button' : 'a', 'proj-row')
    if (!onSelect) {
      const href = p.links?.[0]?.href ?? '#'
      row.href = href
      if (href.startsWith('http')) { row.target = '_blank'; row.rel = 'noreferrer' }
    } else {
      row.type = 'button'
      row.addEventListener('click', () => {
        rows.forEach((r, j) => r.classList.toggle('sel', j === i))
        onSelect(i)
      })
    }
    row.appendChild(el('span', 'proj-index', String(i + 1).padStart(2, '0')))
    row.appendChild(el('span', 'proj-name', esc(p.name)))
    row.appendChild(el('span', 'proj-desc', esc(p.line)))
    row.appendChild(el('span', 'proj-tech', esc(p.tech.join(' · '))))
    rows.push(row)
    li.appendChild(row)
    list.appendChild(li)
  })
  if (onSelect) rows[0]?.classList.add('sel')
  root.appendChild(list)
  return root
}

// Monitor 3 — about/contact terminal.
// `animate: false` renders everything at once (fallback layout);
// `animate: true` returns a play() that types it out (3D screen).
export function buildTerminal(about, { animate = false } = {}) {
  const root = el('div')
  root.appendChild(el('p', 'screen-label boot', 'About / Contact'))
  const term = el('div', 'term boot')
  root.appendChild(term)

  const linkBlock = () => {
    const wrap = el('div', 'term-links')
    about.links.forEach(({ label, href, mono }) => {
      const a = el('a')
      a.href = href
      if (href.startsWith('http')) { a.target = '_blank'; a.rel = 'noreferrer' }
      a.innerHTML = `${esc(label)}  <span class="dim">→ ${esc(mono)}</span>`
      wrap.appendChild(a)
    })
    return wrap
  }

  if (!animate) {
    about.lines.forEach(({ cmd, out }) => {
      term.appendChild(el('div', null, `<span class="prompt">$</span> ${esc(cmd)}`))
      out.forEach((line) => term.appendChild(el('div', 'out', esc(line))))
    })
    term.appendChild(linkBlock())
    term.appendChild(el('div', null, '<span class="prompt">$</span> <span class="caret"></span>'))
    return { root, play: null }
  }

  // Typed version: reveals command chars one by one, then prints output.
  let played = false
  function play() {
    if (played) return
    played = true
    const TYPE_MS = 34
    const LINE_MS = 160
    let chain = Promise.resolve()
    const wait = (ms) => new Promise((r) => setTimeout(r, ms))

    about.lines.forEach(({ cmd, out }, idx) => {
      chain = chain.then(async () => {
        const line = el('div', null, '<span class="prompt">$</span> ')
        const cmdSpan = el('span')
        const caret = el('span', 'caret')
        line.appendChild(cmdSpan)
        line.appendChild(caret)
        term.appendChild(line)
        for (const ch of cmd) {
          cmdSpan.textContent += ch
          await wait(TYPE_MS)
        }
        caret.remove()
        await wait(LINE_MS)
        for (const o of out) {
          term.appendChild(el('div', 'out', esc(o)))
          await wait(LINE_MS * 0.6)
        }
        if (idx === about.lines.length - 1) {
          term.appendChild(linkBlock())
          term.appendChild(el('div', null, '<span class="prompt">$</span> <span class="caret"></span>'))
        }
      })
    })
  }

  return { root, play }
}
