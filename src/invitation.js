// Draws the envelope and the card from the invitation photo onto canvases.
// All coordinates are in pixels of the photo at BASE width.
export const BASE = 1932
export const ENVELOPE = { x: 0, y: 734, w: 1290, h: 754 }
export const CARD = { x: 1290, y: 759, w: 617, h: 721 }
// Where the printed names sit on the envelope, between the leaves and the bride
const NAMES = { x: 445, y: 950, w: 283, h: 300 }

const SCRIPT = '"Great Vibes", cursive'
const SERIF = '"Cormorant Garamond", serif'
const INK = '#1f1f1f'
const GOLD = '#b4862f'

export const FONTS = [
  `64px ${SCRIPT}`,
  `700 30px ${SERIF}`,
  `italic 600 28px ${SERIF}`,
]

function setup(canvas, box) {
  const dpr = window.devicePixelRatio || 1
  const scale = Math.min(3, Math.max(1, (canvas.offsetWidth * dpr) / box.w))
  canvas.width = Math.round(box.w * scale)
  canvas.height = Math.round(box.h * scale)
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.setTransform(scale, 0, 0, scale, 0, 0)
  return { ctx, scale }
}

function drawCrop(ctx, img, box) {
  const k = img.naturalWidth / BASE
  ctx.drawImage(img, box.x * k, box.y * k, box.w * k, box.h * k, 0, 0, box.w, box.h)
}

function smooth(arr, radius) {
  return arr.map((_, i) => {
    const sum = [0, 0, 0]
    let n = 0
    for (let j = Math.max(0, i - radius); j <= Math.min(arr.length - 1, i + radius); j++) {
      sum[0] += arr[j][0]
      sum[1] += arr[j][1]
      sum[2] += arr[j][2]
      n++
    }
    return [sum[0] / n, sum[1] / n, sum[2] / n]
  })
}

// Rebuilds the paper inside rect r from its four borders (Coons patch), erasing the old print
function inpaint(ctx, scale, r) {
  const x0 = Math.round(r.x * scale)
  const y0 = Math.round(r.y * scale)
  const w = Math.round(r.w * scale)
  const h = Math.round(r.h * scale)
  const im = ctx.getImageData(x0, y0, w, h)
  const d = im.data
  const band = Math.max(2, Math.round(3 * scale))
  const blur = Math.round(14 * scale)

  const avg = (xa, xb, ya, yb) => {
    const c = [0, 0, 0]
    let n = 0
    for (let y = ya; y < yb; y++) {
      for (let x = xa; x < xb; x++) {
        const i = (y * w + x) * 4
        c[0] += d[i]
        c[1] += d[i + 1]
        c[2] += d[i + 2]
        n++
      }
    }
    return [c[0] / n, c[1] / n, c[2] / n]
  }

  const L = smooth(Array.from({ length: h }, (_, y) => avg(0, band, y, y + 1)), blur)
  const R = smooth(Array.from({ length: h }, (_, y) => avg(w - band, w, y, y + 1)), blur)
  const T = smooth(Array.from({ length: w }, (_, x) => avg(x, x + 1, 0, band)), blur)
  const B = smooth(Array.from({ length: w }, (_, x) => avg(x, x + 1, h - band, h)), blur)
  const mix = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]
  const c00 = mix(T[0], L[0])
  const c10 = mix(T[w - 1], R[0])
  const c01 = mix(B[0], L[h - 1])
  const c11 = mix(B[w - 1], R[h - 1])

  for (let y = band; y < h - band; y++) {
    const v = y / (h - 1)
    for (let x = band; x < w - band; x++) {
      const u = x / (w - 1)
      const grain = (Math.random() - 0.5) * 4
      const i = (y * w + x) * 4
      for (let c = 0; c < 3; c++) {
        const val =
          (1 - v) * T[x][c] + v * B[x][c] + (1 - u) * L[y][c] + u * R[y][c] -
          ((1 - u) * (1 - v) * c00[c] + u * (1 - v) * c10[c] + (1 - u) * v * c01[c] + u * v * c11[c])
        d[i + c] = val + grain
      }
      d[i + 3] = 255
    }
  }
  ctx.putImageData(im, x0, y0)
}

function write(ctx, str, x, y, { font, size, maxW, color = INK, weight = '' }) {
  ctx.font = `${weight} ${size}px ${font}`
  const w = ctx.measureText(str).width
  if (w > maxW) ctx.font = `${weight} ${(size * maxW) / w}px ${font}`
  ctx.fillStyle = color
  ctx.fillText(str, x, y)
}

function divider(ctx, cx, y, half) {
  const g = ctx.createLinearGradient(cx - half, 0, cx + half, 0)
  g.addColorStop(0, 'rgba(180, 134, 47, 0)')
  g.addColorStop(0.5, GOLD)
  g.addColorStop(1, 'rgba(180, 134, 47, 0)')
  ctx.fillStyle = g
  ctx.fillRect(cx - half, y - 0.75, half * 2, 1.5)
  ctx.save()
  ctx.translate(cx, y)
  ctx.rotate(Math.PI / 4)
  ctx.fillStyle = GOLD
  ctx.fillRect(-4, -4, 8, 8)
  ctx.restore()
}

function blob(ctx, x, y, r, color) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r)
  g.addColorStop(0, color)
  g.addColorStop(1, 'rgba(150, 205, 214, 0)')
  ctx.fillStyle = g
  ctx.fillRect(x - r, y - r, r * 2, r * 2)
}

export function drawEnvelope(canvas, img) {
  const { ctx, scale } = setup(canvas, ENVELOPE)
  drawCrop(ctx, img, ENVELOPE)
  const r = { ...NAMES, x: NAMES.x - ENVELOPE.x, y: NAMES.y - ENVELOPE.y }
  inpaint(ctx, scale, r)

  const cx = r.x + r.w / 2
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.18)'
  ctx.shadowBlur = 2
  ctx.shadowOffsetY = 1
  write(ctx, 'Likhith Varma', cx, r.y + 80, { font: SCRIPT, size: 66, maxW: r.w - 16 })
  write(ctx, 'weds', cx, r.y + 150, { font: SCRIPT, size: 40, maxW: r.w })
  write(ctx, 'Mohana Priya', cx, r.y + 218, { font: SCRIPT, size: 66, maxW: r.w - 16 })
}

export function drawCard(canvas, img) {
  const { ctx, scale } = setup(canvas, CARD)
  const { w, h } = CARD
  drawCrop(ctx, img, CARD)

  // Fresh paper wash over the old print, fading out before the floral corners
  ctx.save()
  ctx.translate(w / 2, h / 2)
  ctx.scale(w * 0.66, h * 0.66)
  const wash = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
  wash.addColorStop(0, 'rgba(251, 253, 253, 1)')
  wash.addColorStop(0.8, 'rgba(251, 253, 253, 0.98)')
  wash.addColorStop(1, 'rgba(251, 253, 253, 0)')
  ctx.fillStyle = wash
  ctx.fillRect(-1, -1, 2, 2)
  ctx.restore()

  blob(ctx, 40, 430, 170, 'rgba(150, 205, 214, 0.28)')
  blob(ctx, 600, 230, 150, 'rgba(150, 205, 214, 0.24)')
  blob(ctx, 420, 700, 190, 'rgba(150, 205, 214, 0.22)')

  // Bring the original floral corners back on top of the wash
  const off = document.createElement('canvas')
  off.width = canvas.width
  off.height = canvas.height
  const o = off.getContext('2d')
  o.setTransform(scale, 0, 0, scale, 0, 0)
  for (const [x, y, rad] of [[0, 0, 160], [w, 0, 125], [0, h, 130], [w - 17, h, 135]]) {
    const g = o.createRadialGradient(x, y, 0, x, y, rad)
    g.addColorStop(0, '#000')
    g.addColorStop(0.6, '#000')
    g.addColorStop(1, 'rgba(0, 0, 0, 0)')
    o.fillStyle = g
    o.fillRect(x - rad, y - rad, rad * 2, rad * 2)
  }
  o.globalCompositeOperation = 'source-in'
  drawCrop(o, img, CARD)
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.drawImage(off, 0, 0)
  ctx.setTransform(scale, 0, 0, scale, 0, 0)

  const cx = w / 2
  const maxW = w - 90
  const family = { font: SERIF, size: 20, maxW, weight: 'italic 600', color: '#4a4a4a' }
  const detail = { font: SERIF, size: 22, maxW, weight: 700 }
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  write(ctx, 'Together with our families', cx, 60, { font: SCRIPT, size: 34, maxW: 320 })
  write(ctx, 'Chi. Likhith Varma', cx, 122, { font: SCRIPT, size: 56, maxW })
  write(ctx, 'Son of Smt. Venkata Ramanamma &', cx, 168, family)
  write(ctx, 'Sri Muppala Manohar Raju, Duggunta Rajupalem', cx, 192, family)
  write(ctx, '&', cx, 236, { font: SCRIPT, size: 40, maxW, color: GOLD })
  write(ctx, 'Chi. La. Sow. Mohana Priya', cx, 290, { font: SCRIPT, size: 52, maxW })
  write(ctx, 'Daughter of Smt. Vijaya &', cx, 336, family)
  write(ctx, 'Late Sri Konduru Ramraju, Polluru', cx, 360, family)
  divider(ctx, cx, 400, 150)
  write(ctx, 'Reception', cx, 440, { font: SCRIPT, size: 38, maxW, color: GOLD })
  write(ctx, 'Wednesday, 25 November 2026 · 6:00 PM onwards', cx, 478, detail)
  write(ctx, 'Sumuhurtham', cx, 518, { font: SCRIPT, size: 38, maxW, color: GOLD })
  write(ctx, 'Thursday, 26 November 2026 · 4:40 – 4:44 AM', cx, 556, detail)
  write(ctx, 'Tula Lagnam, Mrugasira Nakshatram', cx, 584, family)
  divider(ctx, cx, 612, 90)
  write(ctx, 'Venue: MR Convention, Podalakur', cx, 642, { ...detail, size: 24, maxW: 330 })
}
