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

// Lightweight syntax highlighter for the fake-editor snippets. Decorative,
// not exhaustive: comments, strings, numbers, a shared keyword set, and
// anything followed by "(" as a function call.
const KEYWORDS = new Set(
  (
    'auto const return if else while for void bool true false new private public static final class ' +
    'std string size_t double int float char using namespace ' +
    'precision highp uniform varying sampler2d vec2 vec3 vec4 ' +
    'create or replace function returns as declare begin end case when then elsif language ' +
    'integer boolean text decimal default not and is'
  ).split(' ')
)

function highlight(code, lang) {
  const comment = lang === 'sql' ? '--[^\\n]*' : '\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/'
  const re = new RegExp(
    `(${comment})` +
      `|('(?:[^'\\\\\\n]|\\\\.)*'|"(?:[^"\\\\\\n]|\\\\.)*")` +
      `|\\b(\\d+(?:\\.\\d+)?)\\b` +
      `|\\b([A-Za-z_$][\\w$]*)\\b`,
    'g'
  )
  let out = ''
  let last = 0
  let m
  while ((m = re.exec(code))) {
    out += esc(code.slice(last, m.index))
    const s = m[0]
    if (m[1]) out += `<span class="cm">${esc(s)}</span>`
    else if (m[2]) out += `<span class="str">${esc(s)}</span>`
    else if (m[3]) out += `<span class="num">${esc(s)}</span>`
    else if (KEYWORDS.has(s.toLowerCase())) out += `<span class="kw">${esc(s)}</span>`
    else if (code[m.index + s.length] === '(') out += `<span class="fn">${esc(s)}</span>`
    else out += esc(s)
    last = m.index + s.length
  }
  return out + esc(code.slice(last))
}

// Monitor 1 — featured project view for one project (`deco` carries the
// shared label from content.featured). Content is taller than the screen;
// the 3D layout scrolls it inside the monitor, the fallback shows it inline.
export function buildFeatured(project, deco) {
  const root = el('div')

  root.appendChild(el('p', 'screen-label boot', esc(deco.label)))
  root.appendChild(el('h2', 'boot', esc(project.name)))
  if (project.role) root.appendChild(el('p', 'role boot', esc(project.role)))

  const paras = Array.isArray(project.description) ? project.description : [project.description]
  const descBlock = el('div', 'desc-block boot')
  paras.forEach((p) => descBlock.appendChild(el('p', 'desc', esc(p))))
  root.appendChild(descBlock)

  const tags = el('div', 'tags boot')
  ;(project.stack ?? project.tech).forEach((t) => tags.appendChild(el('span', null, esc(t))))
  root.appendChild(tags)

  if (project.snippet) {
    const sn = project.snippet
    if (sn.caption) root.appendChild(el('p', 'snippet-note boot', esc(sn.caption)))
    const editor = el('div', 'editor boot')
    const bar = el('div', 'editor-bar', '<i></i><i></i><i></i>')
    bar.appendChild(el('span', 'editor-title', esc(sn.title)))
    editor.appendChild(bar)
    const pre = el('pre')
    pre.innerHTML = highlight(sn.code, sn.lang) + '<span class="caret"></span>'
    editor.appendChild(pre)
    root.appendChild(editor)
  }

  if (project.notes?.length) {
    const notes = el('div', 'notes boot')
    notes.appendChild(el('p', 'notes-label', 'Engineering notes'))
    const ul = el('ul')
    project.notes.forEach((n) => ul.appendChild(el('li', null, esc(n))))
    notes.appendChild(ul)
    root.appendChild(notes)
  }

  if (project.links?.length) {
    const links = el('div', 'screen-links boot')
    project.links.forEach(({ label, href }) => {
      const a = el('a', null, esc(label) + ' ↗')
      a.href = href
      if (href.startsWith('http')) { a.target = '_blank'; a.rel = 'noreferrer' }
      links.appendChild(a)
    })
    root.appendChild(links)
  }

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
