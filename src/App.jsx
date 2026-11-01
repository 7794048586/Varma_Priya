import { useEffect, useRef, useState } from 'react'
import './App.css'
import { BASE, CARD, ENVELOPE, FONTS, drawCard, drawEnvelope } from './invitation'
import Loader from './Loader'
import Site from './Site'

// Save the hands-and-rings photo as public/hands.jpg
const PHOTO = '/hands.jpg'
const INVITATION = '/wedding.webp'
const RING_SONG = '/meghalo-sannai-ragam.mp3'
const SCRATCH_COLOR = '#9b5478'
const CLEAR_TO_FINISH = 0.5
// How far (% of photo width) the card is tucked into the envelope before scratching
const CARD_TUCK = 31.9

function ScratchLayer({ className, onProgress }) {
  const canvasRef = useRef(null)
  const last = useRef(null)
  const lastCheck = useRef(0)
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const drawFoil = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      if (!width || !height) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      const ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = SCRATCH_COLOR
      ctx.fillRect(0, 0, width, height)
      const size = Math.max(14, Math.min(width, height) * 0.22)
      const font = `${size}px "Great Vibes"`
      const writePrompt = () => {
        ctx.save()
        ctx.fillStyle = '#fffaf4'
        ctx.font = `${font}, cursive`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = 'rgba(41, 13, 38, 0.38)'
        ctx.shadowBlur = Math.max(2, size * 0.07)
        ctx.fillText('Scratch here', width / 2, height / 2)
        ctx.restore()
      }
      // The instruction appears immediately, even before the web font loads.
      writePrompt()
      document.fonts.load(font).finally(() => {
        // A resize/orientation change may have repainted the canvas meanwhile.
        if (canvas.width !== width * dpr || canvas.height !== height * dpr) return
        writePrompt()
      })
    }

    drawFoil()
    const observer = new ResizeObserver(drawFoil)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  const point = (e) => {
    const c = canvasRef.current
    const r = c.getBoundingClientRect()
    const k = c.offsetWidth / r.width
    return { x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k }
  }

  const scratch = (e) => {
    if (!last.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const p = point(e)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineWidth = Math.min(canvas.offsetWidth, canvas.offsetHeight) * 0.18
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(last.current.x, last.current.y)
    ctx.lineTo(p.x, p.y + 0.1)
    ctx.stroke()
    last.current = p

    const now = performance.now()
    if (now - lastCheck.current > 100) {
      lastCheck.current = now
      measure()
    }
  }

  // Share of the foil scratched off, reported as 0..1 of the amount needed to finish
  const measure = () => {
    if (cleared) return
    const canvas = canvasRef.current
    const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data
    let clear = 0
    let total = 0
    for (let i = 3; i < data.length; i += 64) {
      total++
      if (data[i] === 0) clear++
    }
    const progress = Math.min(1, clear / total / CLEAR_TO_FINISH)
    onProgress?.(progress)
    if (progress === 1) setCleared(true)
  }

  const finish = () => {
    last.current = null
    measure()
  }

  return (
    <canvas
      ref={canvasRef}
      className={`scratch ${className} ${cleared ? 'scratch-done' : ''}`}
      aria-hidden="true"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        last.current = point(e)
        scratch(e)
      }}
      onPointerMove={scratch}
      onPointerUp={finish}
      onPointerCancel={finish}
    />
  )
}

// Loads the photo and fonts up front so the invitation never pops in half-drawn
function usePreload() {
  const [img, setImg] = useState(null)
  useEffect(() => {
    let alive = true
    const i = new Image()
    i.src = INVITATION
    Promise.all([i.decode(), ...FONTS.map((f) => document.fonts.load(f))])
      .catch(() => {})
      .then(() => alive && setImg(i))
    return () => {
      alive = false
    }
  }, [])
  return img
}

const pct = (v) => `${(v / BASE) * 100}%`
const boxStyle = (b) => ({ left: pct(b.x), top: pct(b.y), width: pct(b.w), height: pct(b.h) })

function InviteCanvas({ img, draw, box }) {
  const ref = useRef(null)
  useEffect(() => {
    draw(ref.current, img)
  }, [img, draw])
  return <canvas ref={ref} className="invite-canvas" style={boxStyle(box)} />
}

function Invitation({ img, onNext }) {
  const [cardOut, setCardOut] = useState(0)

  return (
    <main className="next-screen">
      <button type="button" className="next-btn btn btn-primary" onClick={onNext}>
        <span>Move next</span>
        <span className="next-btn-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </span>
      </button>
      <img className="next-bg" src={INVITATION} alt="" decoding="sync" />
      <div className="next-box">
        <div className="next-stage">
          <img
            className="next-img next-base"
            src={INVITATION}
            alt="Likhith Varma weds Mohana Priya wedding invitation, 25-26 November 2026"
            decoding="sync"
          />
          <div className="card-slot" />
          <div
            className="card-layer"
            style={{ transform: `translateX(${-CARD_TUCK * (1 - cardOut)}%)` }}
          >
            <InviteCanvas img={img} draw={drawCard} box={CARD} />
          </div>
          <div className="env-layer">
            <InviteCanvas img={img} draw={drawEnvelope} box={ENVELOPE} />
          </div>
          <ScratchLayer className="scratch-all" onProgress={setCardOut} />
        </div>
      </div>
    </main>
  )
}

function App() {
  // 0 = home, 1 = hands withdrawing, 2 = crossfading to the invitation, 3 = invitation only
  const [step, setStep] = useState(0)
  // invite -> five-second Ganesha loader -> wedding home
  const [stage, setStage] = useState('invite')
  const [covered, setCovered] = useState(false)
  const img = usePreload()
  const songRef = useRef(null)

  const openInvitation = () => {
    // This happens inside the tap handler, allowing mobile browsers to play
    // the supplied song without blocking it as autoplay.
    if (songRef.current) {
      songRef.current.currentTime = 0
      songRef.current.play().catch(() => {})
    }
    setStep(1)
  }

  useEffect(() => {
    if (step === 0 || step === 3) return
    // Hold on the rings until the invitation is ready, so there is no blank frame
    if (step === 2 && !img) return
    const t = setTimeout(() => setStep(step + 1), step === 1 ? 1700 : 1600)
    return () => clearTimeout(t)
  }, [step, img])

  const showInvite = step === 3 || (step === 2 && img)

  // Keep the invitation mounted briefly behind the loader to avoid a blank transition.
  return (
    <>
      <audio ref={songRef} src={RING_SONG} preload="auto" />
      {showInvite && !covered && <Invitation img={img} onNext={() => setStage('loader')} />}
      {stage === 'loader' && (
        <Loader
          onCovered={() => setCovered(true)}
          onDone={() => setStage('site')}
        />
      )}
      {stage === 'site' && <Site />}
      {step < 3 && (
        <main className={`home step-${step} ${showInvite ? 'leaving' : ''}`}>
          <div className="photo" role="img" aria-label="Bride and groom hands with wedding rings">
            <img className="layer layer-base" src={PHOTO} alt="" />
            <img className="layer layer-rings" src={PHOTO} alt="" />
            <img className="layer layer-left" src={PHOTO} alt="" />
            <img className="layer layer-right" src={PHOTO} alt="" />
            <button
              type="button"
              className="ring-btn"
              aria-label="Open the invitation"
              onClick={() => step === 0 && openInvitation()}
            />
          </div>
        </main>
      )}
    </>
  )
}

export default App
