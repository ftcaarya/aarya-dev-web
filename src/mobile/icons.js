// App icons for the phone home screen: one dark tile with an accent-colored
// line glyph. The same SVG string is used inline in the DOM home screen and
// rasterized onto the 3D phone's screen texture, so both match exactly.

const GLYPHS = {
  glasses: '<rect x="12" y="27" width="17" height="11" rx="4.5"/><rect x="35" y="27" width="17" height="11" rx="4.5"/><path d="M29 31.5q3-2.5 6 0M12 29.5l-3-5M52 29.5l3-5"/>',
  briefcase: '<rect x="14" y="24" width="36" height="24" rx="4"/><path d="M26 24v-4a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4M14 34h36M30 34v3h4v-3"/>',
  robot: '<rect x="18" y="24" width="28" height="22" rx="5"/><circle cx="26.5" cy="33" r="2.2"/><circle cx="37.5" cy="33" r="2.2"/><path d="M32 24v-6M29 18h6M18 34h-4M50 34h-4M27 40.5h10"/>',
  trophy: '<path d="M23 17h18v9a9 9 0 0 1-18 0zM23 20h-5a5 5 0 0 0 5 7M41 20h5a5 5 0 0 1-5 7M32 35v7M25 47h14M28 42h8v5h-8z"/>',
  bolt: '<path d="M35 13L20 35h11l-3 16 16-23H33z"/>',
  chart: '<path d="M15 47h34M19 41l8-9 6 5 11-13"/><path d="M38 24h6v6"/>',
  shield: '<path d="M32 14l14 5v11c0 9-6 15-14 19-8-4-14-10-14-19V19z"/><path d="M26 31.5l4 4 8-8"/>',
  photos: '<rect x="13" y="18" width="38" height="28" rx="4"/><circle cx="24" cy="27" r="3"/><path d="M14 43l11-10 8 7 6-5 11 9"/>',
  mail: '<rect x="13" y="20" width="38" height="25" rx="4"/><path d="M14 22.5l18 13 18-13"/>',
  terminal: '<rect x="12" y="18" width="40" height="28" rx="4"/><path d="M20 28l6 4.5-6 4.5M30 38h11"/>',
  press: '<path d="M16 19h25v25a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3zM41 26h6v18a3 3 0 0 1-6 0"/><path d="M21 25h15M21 31h15M21 37h9"/>',
  resume: '<path d="M21 13h15l9 9v27a2 2 0 0 1-2 2H21a2 2 0 0 1-2-2V15a2 2 0 0 1 2-2z"/><path d="M36 13v9h9M24.5 31h15M24.5 37h15M24.5 43h9"/>',
  code: '<path d="M25 23l-9 9 9 9M39 23l9 9-9 9M35 19l-6 26"/>',
}

let uid = 0

export function iconSvg(name, tint) {
  const id = `ig${uid++}`
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">` +
    `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="#262932"/><stop offset="1" stop-color="#15171c"/></linearGradient></defs>` +
    `<rect x="0.5" y="0.5" width="63" height="63" rx="15" fill="url(#${id})" stroke="rgba(255,255,255,0.09)"/>` +
    `<g fill="none" stroke="${tint}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">` +
    (GLYPHS[name] ?? GLYPHS.code) +
    `</g></svg>`
  )
}
