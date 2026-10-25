// App icons for the phone home screen. The same SVG string is used inline in
// the DOM home screen and rasterized onto the 3D phone's screen texture, so
// both match exactly.
//
// Built like an iOS icon: a continuous-curvature squircle tile (superellipse,
// n = 5, rather than a plain rounded rect) filled with a deep gradient of the
// app's tint, a soft top highlight, and a white duotone glyph. Glyphs sit on
// a keyline grid in the 64-unit canvas, centred on (32, 32):
//   circle Ø40 · square 36 · landscape 42×32 · portrait 32×42
// so every glyph reads at the same optical size (~60% of the tile).

const P = 'fill="#fff"' // primary
const S = 'fill="#fff" fill-opacity=".42"' // secondary
const line = (color, w = 3) =>
  `fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`

// ink = the tile's dark colour, used to cut details out of white shapes
const GLYPHS = {
  // smart glasses: tinted lenses, solid frame
  glasses: () =>
    `<rect x="11" y="24" width="18" height="15" rx="6.5" ${S}/><rect x="35" y="24" width="18" height="15" rx="6.5" ${S}/>` +
    `<g ${line('#fff')}><rect x="11" y="24" width="18" height="15" rx="6.5"/><rect x="35" y="24" width="18" height="15" rx="6.5"/>` +
    `<path d="M29 29.5q3-3 6 0"/></g>` +
    `<path d="M45.5 13.5l1.2 3.3 3.3 1.2-3.3 1.2-1.2 3.3-1.2-3.3-3.3-1.2 3.3-1.2z" ${P}/>`,
  briefcase: () =>
    `<path d="M25 22v-3.5a3.5 3.5 0 0 1 3.5-3.5h7a3.5 3.5 0 0 1 3.5 3.5V22" ${line('#fff')}/>` +
    `<rect x="11" y="22" width="42" height="28" rx="6" ${S}/>` +
    `<path d="M17 22h30a6 6 0 0 1 6 6v6H11v-6a6 6 0 0 1 6-6z" ${P}/>` +
    `<rect x="28" y="31" width="8" height="7" rx="2" ${P}/>`,
  robot: (ink) =>
    `<circle cx="32" cy="15.5" r="2.8" ${P}/><path d="M32 18v6" ${line('#fff')}/>` +
    `<rect x="9" y="32" width="5" height="10" rx="2" ${S}/><rect x="50" y="32" width="5" height="10" rx="2" ${S}/>` +
    `<rect x="14" y="24" width="36" height="26" rx="8" ${P}/>` +
    `<circle cx="25.5" cy="36" r="3.6" fill="${ink}"/><circle cx="38.5" cy="36" r="3.6" fill="${ink}"/>` +
    `<path d="M27.5 44h9" ${line(ink, 2.6)}/>`,
  trophy: (ink) =>
    `<g ${line('#fff')} stroke-opacity=".42"><path d="M21 19h-3.5a5 5 0 0 0 0 10H22M43 19h3.5a5 5 0 0 1 0 10H42"/></g>` +
    `<path d="M20 14h24v12a12 12 0 0 1-24 0z" ${P}/>` +
    `<rect x="29" y="37" width="6" height="7" ${P}/><rect x="22" y="44" width="20" height="6" rx="2" ${P}/>` +
    `<path d="M32 19.5l1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" fill="${ink}"/>`,
  bolt: () =>
    `<circle cx="32" cy="32" r="20" fill="#fff" fill-opacity=".2"/>` +
    `<path d="M36 11L18.5 35H30l-3 18 18.5-25H34z" ${P} stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>`,
  chart: () =>
    `<rect x="14" y="40" width="6" height="10" rx="2" ${S}/><rect x="24" y="35" width="6" height="15" rx="2" ${S}/>` +
    `<rect x="34" y="30" width="6" height="20" rx="2" ${S}/><rect x="44" y="24" width="6" height="26" rx="2" ${S}/>` +
    `<g ${line('#fff', 3.2)}><path d="M14 31l10-8 8 5 15.5-13"/><path d="M41 15h6.5v6.5"/></g>`,
  shield: (ink) =>
    `<path d="M32 12l16 6v12c0 10-7 17-16 21-9-4-16-11-16-21V18z" ${S}/>` +
    `<path d="M32 12l16 6v12c0 10-7 17-16 21z" ${P}/>` +
    `<path d="M25.5 31.5l4.5 4.5 8.5-8.5" ${line(ink, 3.2)}/><path d="M25.5 31.5l4.5 4.5 2-2" ${line('#fff', 3.2)}/>`,
  photos: (ink) =>
    `<rect x="17" y="13" width="35" height="27" rx="5" ${S} transform="rotate(8 34.5 26.5)"/>` +
    `<rect x="12" y="21" width="38" height="29" rx="5" ${P}/>` +
    `<circle cx="22" cy="30" r="3.4" fill="${ink}"/>` +
    `<path d="M15.5 46.5l10.5-10.5 7 6.5 5-4.5 9 8.5z" fill="${ink}" stroke="${ink}" stroke-width="1" stroke-linejoin="round"/>`,
  // speech bubble with a typing indicator
  messages: (ink) =>
    `<path d="M32 13c11.6 0 21 7.6 21 17s-9.4 17-21 17c-2.4 0-4.7-.3-6.8-.9L15 50.5l2.6-8.6C13.5 38.8 11 34.6 11 30c0-9.4 9.4-17 21-17z" ${P}/>` +
    `<circle cx="23.5" cy="30" r="2.8" fill="${ink}"/><circle cx="32" cy="30" r="2.8" fill="${ink}"/><circle cx="40.5" cy="30" r="2.8" fill="${ink}"/>`,
  mail: (ink) =>
    `<rect x="11" y="17" width="42" height="30" rx="6" ${P}/>` +
    `<path d="M14.5 21.5L32 34.5l17.5-13" ${line(ink, 3)}/>`,
  terminal: (ink) =>
    `<rect x="11" y="16" width="42" height="32" rx="6" ${P}/>` +
    `<path d="M11 22a6 6 0 0 1 6-6h30a6 6 0 0 1 6 6v1H11z" fill="${ink}" fill-opacity=".18"/>` +
    `<g ${line(ink, 3.2)}><path d="M19 29.5l6 4.5-6 4.5"/><path d="M29.5 40h11"/></g>`,
  press: (ink) =>
    `<path d="M43 23h5a3 3 0 0 1 3 3v19a5 5 0 0 1-10 0V25z" ${S}/>` +
    `<path d="M17 14h22a4 4 0 0 1 4 4v27a5 5 0 0 0 3 4.6V50H18a5 5 0 0 1-5-5V18a4 4 0 0 1 4-4z" ${P}/>` +
    `<rect x="18" y="20" width="20" height="8" rx="1.8" fill="${ink}"/>` +
    `<g ${line(ink, 2.6)}><path d="M18.5 34h19M18.5 39.5h19M18.5 45h12"/></g>`,
  resume: (ink) =>
    `<path d="M20 11h17l11 11v27a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V15a4 4 0 0 1 4-4z" ${P}/>` +
    `<path d="M37 11v8a3 3 0 0 0 3 3h8z" fill="${ink}" fill-opacity=".3"/>` +
    `<circle cx="32" cy="27.5" r="4.6" fill="${ink}"/><path d="M24 41a8 8 0 0 1 16 0z" fill="${ink}"/>` +
    `<path d="M23 46.5h18" ${line(ink, 2.6)}/>`,
  code: () =>
    `<g ${line('#fff', 3.6)}><path d="M24 21L13 32l11 11M40 21l11 11-11 11"/></g>` +
    `<path d="M35.5 16.5l-7 31" ${line('#fff', 3.6)} stroke-opacity=".42"/>`,
}

// Superellipse |x|^5 + |y|^5 = 1 over the 64-unit canvas.
export const SQUIRCLE = (() => {
  const n = 5
  const pts = []
  for (let i = 0; i < 96; i++) {
    const t = (i / 96) * Math.PI * 2
    const c = Math.cos(t)
    const s = Math.sin(t)
    const x = Math.sign(c) * Math.abs(c) ** (2 / n)
    const y = Math.sign(s) * Math.abs(s) ** (2 / n)
    pts.push(`${(32 + 32 * x).toFixed(2)} ${(32 + 32 * y).toFixed(2)}`)
  }
  return `M${pts.join('L')}Z`
})()

function hexToHsl(hex) {
  const n = parseInt(hex.slice(1), 16)
  const r = ((n >> 16) & 255) / 255
  const g = ((n >> 8) & 255) / 255
  const b = (n & 255) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  if (!d) return [0, 0, l]
  const s = d / (1 - Math.abs(2 * l - 1))
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return [(h * 60 + 360) % 360, s, l]
}
// rgb() output: older SVG renderers don't all take modern hsl() syntax
function hsl(h, s, l) {
  h = ((h % 360) + 360) % 360
  const a = s * Math.min(l, 1 - l)
  const f = (k) => {
    const x = (k + h / 30) % 12
    return Math.round(255 * (l - a * Math.max(-1, Math.min(x - 3, 9 - x, 1))))
  }
  return `rgb(${f(0)},${f(8)},${f(4)})`
}

let uid = 0

export function iconSvg(name, tint) {
  const id = `ig${uid++}`
  const [h, s0] = hexToHsl(tint)
  const s = Math.min(0.68, s0 * 1.05 + 0.04)
  const top = hsl(h, s, 0.45)
  const bottom = hsl(h - 10, Math.min(0.75, s + 0.05), 0.19)
  const ink = hsl(h - 6, s, 0.26)
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">` +
    `<defs>` +
    `<linearGradient id="${id}b" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>` +
    `<radialGradient id="${id}h" cx="0.3" cy="0" r="0.85"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>` +
    `<linearGradient id="${id}e" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".32"/><stop offset=".5" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#fff" stop-opacity=".12"/></linearGradient>` +
    `<filter id="${id}s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="1.2" stdDeviation="1.4" flood-color="#000" flood-opacity=".35"/></filter>` +
    `</defs>` +
    `<path d="${SQUIRCLE}" fill="url(#${id}b)"/>` +
    `<path d="${SQUIRCLE}" fill="url(#${id}h)"/>` +
    `<path d="${SQUIRCLE}" fill="none" stroke="url(#${id}e)" stroke-width="1" transform="translate(32 32) scale(.984) translate(-32 -32)"/>` +
    `<g filter="url(#${id}s)">${(GLYPHS[name] ?? GLYPHS.code)(ink)}</g>` +
    `</svg>`
  )
}

// CSS mask in the same squircle, for icons made from an image
export const SQUIRCLE_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="${SQUIRCLE}"/></svg>`
)}")`

// An app's icon: always a drawn SVG, plus an optional image ({ src, bg, pad })
// that replaces it when the file loads.
export function appIcon({ icon, tint, image }) {
  return { svg: iconSvg(icon, tint), image: image ?? null }
}

// DOM node for an icon. Image icons fall back to the drawn SVG if the file
// is missing.
export function iconNode(ic, className = 'ph-icon') {
  const node = document.createElement('span')
  node.className = className
  const drawn = () => { node.innerHTML = ic.svg }
  if (!ic.image) {
    drawn()
    return node
  }
  const tile = document.createElement('span')
  tile.className = 'ic-img'
  tile.style.background = ic.image.bg ?? '#111'
  tile.style.padding = `${(ic.image.pad ?? 0) * 100}%`
  const img = new Image()
  img.alt = ''
  img.decoding = 'async'
  img.style.objectFit = ic.image.pad ? 'contain' : 'cover'
  img.onerror = drawn
  img.src = ic.image.src
  tile.appendChild(img)
  node.appendChild(tile)
  return node
}
