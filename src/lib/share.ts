import { db } from '../db/schema'

/**
 * Share card (Wave 5). Renders a canvas image suitable for sharing to socials
 * or saving to camera roll. Shows the user's constellation progress + stats
 * without any social graph or follower pressure.
 *
 * Returns a data URL (PNG) or null on any error.
 */

export async function generateShareCard(): Promise<string | null> {
  const W = 800
  const H = 420

  const canvas = document.createElement('canvas')
  canvas.width = W * 2   // retina
  canvas.height = H * 2
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.scale(2, 2)

  // Detect theme from <html> data-theme attribute
  const isDark = document.documentElement.dataset.theme === 'dark'
  const bg = isDark ? '#17160F' : '#F6F2EA'
  const ink = isDark ? '#EDE8DE' : '#221D16'
  const inkSoft = isDark ? '#9C9488' : '#6E665A'
  const accent = '#28486B'

  // Background
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Subtle border
  ctx.strokeStyle = isDark ? 'rgba(237,232,222,0.12)' : 'rgba(34,29,22,0.08)'
  ctx.lineWidth = 1
  ctx.strokeRect(24, 24, W - 48, H - 48)

  // Wordmark top-left
  ctx.fillStyle = accent
  ctx.font = 'italic bold 22px Georgia, serif'
  ctx.fillText('Atlas', 44, 62)

  // Fetch stats
  const [concepts, , sessions] = await Promise.all([
    db.concepts.toArray(),
    db.reviews.toArray(),
    db.sessions.toArray(),
  ])
  const metConcepts = concepts.filter((c) => c.firstSeenAt !== null)
  const totalCards = sessions.reduce((a, s) => a + (s.newCount + s.reviewCount), 0)
  const days = new Set(sessions.map((s) => Math.floor(s.startedAt / 86400000))).size

  // Headline stat
  ctx.fillStyle = ink
  ctx.font = `bold 68px Georgia, serif`
  ctx.fillText(String(metConcepts.length), 44, 170)

  ctx.fillStyle = inkSoft
  ctx.font = '18px Georgia, serif'
  ctx.fillText('concepts in my constellation', 44, 200)

  // Sub-stats row
  const subStats = [
    { value: String(totalCards), label: 'cards reviewed' },
    { value: String(days), label: 'days studied' },
  ]
  let subX = 44
  for (const s of subStats) {
    ctx.fillStyle = ink
    ctx.font = 'bold 28px Georgia, serif'
    ctx.fillText(s.value, subX, 270)
    ctx.fillStyle = inkSoft
    ctx.font = '14px Georgia, serif'
    ctx.fillText(s.label, subX, 292)
    subX += 180
  }

  // Mini constellation dots
  if (metConcepts.length > 0) {
    const dotArea = { x: W - 280, y: 60, w: 230, h: 290 }
    const placed: { x: number; y: number; d: string }[] = []

    // Domain colours (muted)
    const DOMAIN_COLORS: Record<string, string> = {
      history: '#9C5B43', geography: '#5E7A63', science: '#4A6175',
      culture: '#6E4A6B', religions: '#9A7B3F', politics: '#8A4A4A',
      modern_world: '#3F6E6A',
    }

    // Place up to 80 dots in a loose scattered grid
    const sample = metConcepts.slice(0, 80)
    for (let i = 0; i < sample.length; i++) {
      const concept = sample[i]!
      // Deterministic placement from concept id hash
      const h = concept.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
      const x = dotArea.x + (h * 37 % dotArea.w)
      const y = dotArea.y + (h * 53 % dotArea.h)
      const r = concept.firstSeenAt ? 4 : 2
      placed.push({ x, y, d: concept.domain })

      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = `${DOMAIN_COLORS[concept.domain] ?? accent}cc`
      ctx.fill()
    }

    // Draw a few connection lines between nearby placed dots
    ctx.strokeStyle = `${isDark ? '#EDE8DE' : '#221D16'}18`
    ctx.lineWidth = 0.8
    for (let i = 0; i < Math.min(placed.length - 1, 40); i++) {
      const a = placed[i]!
      const b = placed[i + 1]!
      const dist = Math.hypot(a.x - b.x, a.y - b.y)
      if (dist < 60) {
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }
  }

  // Divider
  ctx.strokeStyle = isDark ? 'rgba(237,232,222,0.10)' : 'rgba(34,29,22,0.07)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(44, H - 64)
  ctx.lineTo(W - 44, H - 64)
  ctx.stroke()

  // Footer
  ctx.fillStyle = inkSoft
  ctx.font = '13px Georgia, serif'
  ctx.fillText('atlas-6uj.pages.dev — free, private, offline-first', 44, H - 40)

  return canvas.toDataURL('image/png')
}

/** Download the share card as a PNG file. */
export async function downloadShareCard(): Promise<void> {
  const dataUrl = await generateShareCard()
  if (!dataUrl) return
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = `atlas-${new Date().toISOString().slice(0, 10)}.png`
  a.click()
}

/** Use the Web Share API if available, fall back to download. */
export async function shareCard(): Promise<void> {
  const dataUrl = await generateShareCard()
  if (!dataUrl) return

  if (navigator.canShare) {
    try {
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], 'atlas-progress.png', { type: 'image/png' })
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'My Atlas constellation' })
        return
      }
    } catch {
      // Fall through to download
    }
  }

  // Fallback
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = `atlas-${new Date().toISOString().slice(0, 10)}.png`
  a.click()
}
