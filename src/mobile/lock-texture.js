import * as THREE from 'three'
import { PHONE } from '../scene/phone.js'
import { LOCK } from './layout.js'
import { SQUIRCLE } from './icons.js'

// Draws the lock screen onto a canvas for the 3D phone's screen, mirroring
// the DOM lock screen (phone-ui.js + styles.css) from the shared LOCK layout.
// setWindow(frac) moves bottom-anchored parts up to where a viewport of that
// shape ends, since the camera's final framing shows only the top `frac` of
// the screen.

const W = 720
const H = Math.round((W * PHONE.h) / PHONE.w)
export const PHONE_FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, 'Segoe UI', Roboto, sans-serif"
const INK = '#f5f4f0'

function glow(ctx, x, y, r, rgb, a, h) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r)
  g.addColorStop(0, `rgba(${rgb}, ${a})`)
  g.addColorStop(1, `rgba(${rgb}, 0)`)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, h)
}

// Text clipped to `lines` lines of `maxW`, with an ellipsis on the last.
function wrap(ctx, text, maxW, lines) {
  const words = text.split(/\s+/)
  const out = []
  let line = ''
  for (let i = 0; i < words.length; i++) {
    const next = line ? `${line} ${words[i]}` : words[i]
    if (ctx.measureText(next).width <= maxW) {
      line = next
      continue
    }
    if (out.length === lines - 1) {
      let cut = line
      while (cut && ctx.measureText(`${cut}…`).width > maxW) cut = cut.slice(0, -1)
      out.push(`${cut.trimEnd()}…`)
      return out
    }
    out.push(line)
    line = words[i]
  }
  if (line) out.push(line)
  return out
}

const squircle = new Path2D(SQUIRCLE)

function loadImage(src, onload) {
  const img = new Image()
  img.onload = onload
  img.src = src
  return img
}

export function createLockTexture(content, apps) {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4

  let windowFrac = 1
  const redraw = () => draw()
  const wallpaper = content.phone?.wallpaper ? loadImage(content.phone.wallpaper, redraw) : null

  // Notification icons: the image version when it loads, else the drawn SVG
  const notes = apps.notifications.map((n) => {
    const ic = n.app.icon
    const svg = loadImage('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(ic.svg), redraw)
    const image = ic.image ? loadImage(ic.image.src, redraw) : null
    return { ...n, svg, image }
  })
  const ready = (img) => img && img.complete && img.naturalWidth > 0

  function drawIcon(n, x, y, size) {
    if (ready(n.image)) {
      const { bg = '#111', pad = 0 } = n.app.icon.image
      ctx.save()
      ctx.translate(x, y)
      ctx.scale(size / 64, size / 64)
      ctx.clip(squircle)
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, 64, 64)
      const inner = 64 * (1 - pad * 2)
      const iw = n.image.naturalWidth
      const ih = n.image.naturalHeight
      // cover for photos, contain for padded logos
      const k = pad ? Math.min(inner / iw, inner / ih) : Math.max(64 / iw, 64 / ih)
      ctx.drawImage(n.image, 32 - (iw * k) / 2, 32 - (ih * k) / 2, iw * k, ih * k)
      ctx.restore()
    } else if (ready(n.svg)) {
      ctx.drawImage(n.svg, x, y, size, size)
    }
  }

  function draw() {
    const vis = H * windowFrac // visible height in the final shot

    // wallpaper — same as .ph-wall
    ctx.fillStyle = '#0b0c10'
    ctx.fillRect(0, 0, W, H)
    if (ready(wallpaper)) {
      const k = Math.max(W / wallpaper.naturalWidth, vis / wallpaper.naturalHeight)
      const iw = wallpaper.naturalWidth * k
      const ih = wallpaper.naturalHeight * k
      ctx.drawImage(wallpaper, (W - iw) / 2, (vis - ih) / 2, iw, ih)
      const shade = ctx.createLinearGradient(0, 0, 0, vis)
      shade.addColorStop(0, 'rgba(0, 0, 0, 0.28)')
      shade.addColorStop(0.5, 'rgba(0, 0, 0, 0.12)')
      shade.addColorStop(1, 'rgba(0, 0, 0, 0.4)')
      ctx.fillStyle = shade
      ctx.fillRect(0, 0, W, vis)
    } else {
      glow(ctx, W * 0.15, W * 0.35, W * 0.8, '142, 203, 223', 0.2, H)
      glow(ctx, W * 0.9, W * 1.25, W * 0.85, '169, 163, 232', 0.16, H)
      glow(ctx, W * 0.3, W * 1.9, W * 0.8, '143, 216, 180', 0.12, H)
    }

    const now = new Date()
    ctx.fillStyle = INK
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    // date + clock
    ctx.font = `600 ${LOCK.date.font * W}px ${PHONE_FONT}`
    ctx.fillText(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }), W / 2, LOCK.date.top * W)
    ctx.font = `700 ${LOCK.clock.font * W}px ${PHONE_FONT}`
    const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M/i, '')
    ctx.fillText(time, W / 2, LOCK.clock.top * W)

    // camera punch-hole
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(W / 2, W * 0.055, W * 0.017, 0, Math.PI * 2)
    ctx.fill()

    // notifications
    const L = LOCK.notes
    const x = L.inset * W
    const nw = W - x * 2
    const pad = L.pad * W
    const isz = L.icon * W
    notes.forEach((n, i) => {
      const y = (L.top + i * (L.h + L.gap)) * W
      ctx.beginPath()
      ctx.roundRect(x, y, nw, L.h * W, L.r * W)
      ctx.fillStyle = 'rgba(40, 40, 46, 0.62)'
      ctx.fill()
      drawIcon(n, x + pad, y + (L.h * W - isz) / 2, isz)

      const tx = x + pad * 2 + isz
      const tw = x + nw - pad - tx
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      ctx.fillStyle = INK
      ctx.font = `600 ${L.title * W}px ${PHONE_FONT}`
      const titleY = y + pad
      ctx.fillText(n.title, tx, titleY, tw - (n.when ? W * 0.1 : 0))
      if (n.when) {
        ctx.textAlign = 'right'
        ctx.fillStyle = 'rgba(245, 244, 240, 0.55)'
        ctx.font = `400 ${L.when * W}px ${PHONE_FONT}`
        ctx.fillText(n.when, x + nw - pad, titleY + W * 0.004)
        ctx.textAlign = 'left'
      }
      ctx.fillStyle = 'rgba(245, 244, 240, 0.9)'
      ctx.font = `400 ${L.body * W}px ${PHONE_FONT}`
      wrap(ctx, n.body, tw, 2).forEach((line, j) => {
        ctx.fillText(line, tx, titleY + L.title * W * 1.3 + j * L.body * W * 1.28)
      })
    })

    // "Swipe up to open" on the bottom edge of the visible window
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    ctx.fillStyle = 'rgba(245, 244, 240, 0.7)'
    ctx.font = `500 ${LOCK.hint.font * W}px ${PHONE_FONT}`
    ctx.fillText('Swipe up to open', W / 2, vis - LOCK.hint.bottom * W)

    texture.needsUpdate = true
  }

  draw()

  return {
    texture,
    setWindow(frac) {
      if (Math.abs(frac - windowFrac) < 0.001) return
      windowFrac = frac
      draw()
    },
  }
}
