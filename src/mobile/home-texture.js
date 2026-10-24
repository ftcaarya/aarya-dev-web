import * as THREE from 'three'
import { PHONE } from '../scene/phone.js'
import { HOME } from './layout.js'

// Draws the home screen onto a canvas for the 3D phone's screen, mirroring
// the DOM home screen (phone-ui.js + styles.css) from the shared HOME layout.
// setWindow(frac) moves the dock up to where a viewport of that shape ends,
// since the camera's final framing shows only the top `frac` of the screen.

const W = 720
const H = Math.round((W * PHONE.h) / PHONE.w)
const FONT = "system-ui, -apple-system, 'Segoe UI', sans-serif"
const MONO = "'SFMono-Regular', ui-monospace, Consolas, monospace"

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

function glow(ctx, x, y, r, rgb, a) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r)
  g.addColorStop(0, `rgba(${rgb}, ${a})`)
  g.addColorStop(1, `rgba(${rgb}, 0)`)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
}

export function createHomeTexture(content, apps) {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4

  let windowFrac = 1
  const icons = new Map()
  for (const app of [...apps.grid, ...apps.dock]) {
    const img = new Image()
    img.onload = () => draw()
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(app.icon)
    icons.set(app.id, img)
  }

  const initials = content.name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2)

  function drawApp(app, cx, top, size) {
    const img = icons.get(app.id)
    if (img.complete && img.naturalWidth) ctx.drawImage(img, cx - size / 2, top, size, size)
    ctx.fillStyle = '#f2f1ee'
    ctx.font = `500 ${HOME.grid.label * W}px ${FONT}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)'
    ctx.shadowBlur = 4
    ctx.shadowOffsetY = 1
    ctx.fillText(app.label, cx, top + size + HOME.grid.labelGap * W)
    ctx.shadowColor = 'transparent'
  }

  function draw() {
    const pad = HOME.pad * W

    // wallpaper — same three glows as .phone-ui's background
    ctx.fillStyle = '#0b0c10'
    ctx.fillRect(0, 0, W, H)
    glow(ctx, W * 0.15, W * 0.35, W * 0.8, '142, 203, 223', 0.2)
    glow(ctx, W * 0.9, W * 1.25, W * 0.85, '169, 163, 232', 0.16)
    glow(ctx, W * 0.3, W * 1.9, W * 0.8, '143, 216, 180', 0.12)

    // status bar
    const sy = (HOME.status.h * W) / 2
    ctx.fillStyle = '#e8e6e1'
    ctx.font = `600 ${HOME.status.font * W}px ${FONT}`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    const now = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M/i, '')
    ctx.fillText(now, pad + W * 0.02, sy)
    // signal bars + battery
    const bx = W - pad - W * 0.2
    for (let i = 0; i < 4; i++) {
      const bh = W * (0.012 + i * 0.006)
      roundRect(ctx, bx + i * W * 0.014, sy + W * 0.015 - bh, W * 0.009, bh, 2)
      ctx.fill()
    }
    ctx.strokeStyle = '#e8e6e1'
    ctx.lineWidth = 2
    roundRect(ctx, W - pad - W * 0.09, sy - W * 0.014, W * 0.07, W * 0.03, 6)
    ctx.stroke()
    roundRect(ctx, W - pad - W * 0.084, sy - W * 0.008, W * 0.05, W * 0.018, 3)
    ctx.fill()
    // camera punch-hole
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(W / 2, sy, W * 0.017, 0, Math.PI * 2)
    ctx.fill()

    // profile widget
    const wy = HOME.widget.top * W
    const wh = HOME.widget.h * W
    roundRect(ctx, pad, wy, W - pad * 2, wh, HOME.widget.r * W)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.stroke()
    const ar = (HOME.widget.avatar * W) / 2
    const ax = pad + W * 0.05 + ar
    const ay = wy + wh / 2
    const ag = ctx.createLinearGradient(ax - ar, ay - ar, ax + ar, ay + ar)
    ag.addColorStop(0, '#8ecbdf')
    ag.addColorStop(1, '#a9a3e8')
    ctx.fillStyle = ag
    ctx.beginPath()
    ctx.arc(ax, ay, ar, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#0c0d10'
    ctx.font = `700 ${ar * 0.8}px ${FONT}`
    ctx.textAlign = 'center'
    ctx.fillText(initials, ax, ay + 1)
    const tx = ax + ar + W * 0.045
    ctx.textAlign = 'left'
    ctx.fillStyle = '#e8e6e1'
    ctx.font = `600 ${HOME.widget.name * W}px ${FONT}`
    ctx.fillText(content.name, tx, ay - W * 0.052)
    ctx.fillStyle = '#8a887f'
    ctx.font = `400 ${HOME.widget.role * W}px ${FONT}`
    ctx.fillText(content.role, tx, ay + W * 0.002)
    ctx.font = `400 ${HOME.widget.hint * W}px ${MONO}`
    ctx.fillText('Tap an app to explore', tx, ay + W * 0.05)

    // app grid
    const gi = HOME.grid.inset * W
    const cellW = (W - gi * 2) / HOME.grid.cols
    const size = HOME.grid.icon * W
    apps.grid.forEach((app, i) => {
      const col = i % HOME.grid.cols
      const row = Math.floor(i / HOME.grid.cols)
      drawApp(app, gi + cellW * (col + 0.5), (HOME.grid.top + row * HOME.grid.row) * W, size)
    })

    // dock, on the bottom edge of the visible window
    const bottom = H * windowFrac
    const dy = bottom - (HOME.dock.bottom + HOME.dock.h) * W
    const di = HOME.dock.inset * W
    roundRect(ctx, di, dy, W - di * 2, HOME.dock.h * W, HOME.dock.r * W)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)'
    ctx.fill()
    const dockCell = (W - di * 2) / apps.dock.length
    apps.dock.forEach((app, i) => {
      drawApp(app, di + dockCell * (i + 0.5), dy + HOME.dock.iconTop * W, size)
    })

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
