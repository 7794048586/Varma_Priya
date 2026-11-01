import { useEffect, useRef, useState } from 'react'
import GalleryPage, { GALLERY } from './Gallery'
import { AddToCalendar, Countdown, DirectionsButton } from './Extras'
import { APPLE_DIRECTIONS, COUPLE_NAMES, DATES, DIRECTIONS, EVENTS, VENUE } from './wedding'

// Photos live in src/assets/gallery.  Keep the originals intact and use their
// Vite URLs directly, so the browser always receives the full-resolution files.
const ALL = GALLERY.map((g) => g.src)
const image = (name) => GALLERY.find((g) => g.name === name.replace(/\.[^.]+$/, ''))?.src
const namedImages = (...names) => names.map(image).filter(Boolean)

// Image (6) is the main portrait; Image (7) and Image (1) keep the other
// screens equally personal instead of falling back to the older stock photos.
const COUPLE = [...namedImages('Image (6)', 'Image (7)', 'Image (1)'), ...ALL]
const COUPLE_STAGE = [...namedImages('Image (7)', 'Image (6)', 'Image (1)'), ...ALL]
const TAB_PHOTOS = [...namedImages('Image.jpg', 'Image (1)', 'Image (7)', 'Image (6)'), ...ALL]
const RINGS = TAB_PHOTOS
const EVENT_PHOTOS = [
  [...namedImages('Image (7)', 'Image (6)'), ...ALL],
  [...namedImages('Image (1)', 'Image (2)'), ...ALL],
  [...namedImages('Image (6)', 'Image.jpg'), ...ALL],
  [...namedImages('Image.jpg', 'Image (7)'), ...ALL],
]
const EVENT_MARKS = ['✦', '⌘', '♫', '♡']
const TRAVEL_MAP_PHOTOS = [
  [...namedImages('Image (3)', 'Image (8)', 'Image (4)'), ...ALL],
  [...namedImages('Image (4)', 'Image (5)', 'Image.jpg'), ...ALL],
]

const cubic = (p, t) => {
  const m = 1 - t
  return [0, 1].map(
    (k) => m * m * m * p[0][k] + 3 * m * m * t * p[1][k] + 3 * m * t * t * p[2][k] + t * t * t * p[3][k],
  )
}
const STEM = [
  [6, 4],
  [30, 120],
  [170, 150],
  [292, 92],
]
const LEAVES = Array.from({ length: 13 }, (_, i) => {
  const t = 0.06 + i * 0.07
  const [x, y] = cubic(STEM, t)
  const [nx, ny] = cubic(STEM, t + 0.01)
  const angle = (Math.atan2(ny - y, nx - x) * 180) / Math.PI + (i % 2 ? 55 : -55)
  return { x, y, angle }
})
const FLOWERS = [0.28, 0.6, 0.94].map((t) => cubic(STEM, t))

function Vine({ className }) {
  return (
    <svg className={`vine ${className}`} viewBox="0 0 300 170" aria-hidden="true">
      <ellipse cx="120" cy="110" rx="90" ry="34" fill="#ecd394" opacity="0.35" />
      <ellipse cx="250" cy="96" rx="46" ry="26" fill="#e9c6d6" opacity="0.4" />
      <path
        d={`M${STEM[0]} C${STEM[1]} ${STEM[2]} ${STEM[3]}`}
        fill="none"
        stroke="#531c46"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {LEAVES.map(({ x, y, angle }, i) => (
        <ellipse
          key={i}
          rx="12"
          ry="4.6"
          fill={i % 3 ? '#a05a78' : '#531c46'}
          transform={`translate(${x} ${y}) rotate(${angle}) translate(11 0)`}
        />
      ))}
      {FLOWERS.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              rx="9"
              ry="6"
              fill="#fcf7ed"
              stroke="#531c46"
              strokeWidth="2"
              transform={`rotate(${a}) translate(9 0)`}
            />
          ))}
          <circle r="4.5" fill="#c9a24a" />
        </g>
      ))}
    </svg>
  )
}

const FALLING_FLOWERS = [
  { start: '11%', edge: '-3%', delay: '-1.2s', duration: '6.2s', turn: '-260deg' },
  { start: '24%', edge: '98%', delay: '-3.4s', duration: '6.8s', turn: '280deg' },
  { start: '36%', edge: '-2%', delay: '-4.6s', duration: '5.9s', turn: '-320deg' },
  { start: '47%', edge: '98%', delay: '-2.1s', duration: '6.5s', turn: '340deg' },
  { start: '58%', edge: '98%', delay: '-5s', duration: '7.1s', turn: '320deg' },
  { start: '70%', edge: '-3%', delay: '-3.9s', duration: '6.3s', turn: '-280deg' },
  { start: '82%', edge: '98%', delay: '-0.6s', duration: '6.7s', turn: '300deg' },
  { start: '91%', edge: '-2%', delay: '-2.8s', duration: '6.1s', turn: '-290deg' },
]

function FallingFlowers() {
  return (
    <div className="falling-flowers" aria-hidden="true">
      {FALLING_FLOWERS.map((flower, i) => (
        <span
          key={i}
          className="falling-flower"
          style={{
            '--start': flower.start,
            '--edge': flower.edge,
            '--delay': flower.delay,
            '--duration': flower.duration,
            '--turn': flower.turn,
          }}
        >
          <svg viewBox="0 0 44 44" role="presentation">
            <g transform="translate(22 22)">
              {[0, 72, 144, 216, 288].map((angle) => (
                <ellipse key={angle} rx="8" ry="4.6" fill="#c56e98" stroke="#64194f" strokeWidth="1.7" transform={`rotate(${angle}) translate(8 0)`} />
              ))}
              <circle r="4.2" fill="#e4c582" />
              <circle r="1.4" fill="#531c46" />
            </g>
          </svg>
        </span>
      ))}
    </div>
  )
}

function Bouquet() {
  const blossoms = [
    [92, 78, 1.05], [140, 61, 0.86], [181, 86, 1.12], [222, 66, 0.82],
    [119, 113, 0.9], [166, 119, 1.04], [207, 124, 0.82], [250, 106, 0.92],
  ]
  return (
    <svg className="gift-bouquet" viewBox="0 0 340 315" aria-label="Wedding flower bouquet" role="img">
      <path d="M74 292 C112 214 136 165 160 108 M116 299 C140 214 157 169 174 103 M168 302 C183 215 199 159 218 91 M220 300 C222 212 235 158 255 107" fill="none" stroke="#531c46" strokeWidth="5" strokeLinecap="round" />
      {[ [104, 207, -28], [132, 174, 24], [153, 142, -28], [190, 160, 30], [215, 130, -27], [238, 160, 28] ].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="30" ry="11" fill={i % 2 ? '#a05276' : '#6c8f6a'} opacity="0.9" transform={`rotate(${r} ${x} ${y})`} />
      ))}
      {blossoms.map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          {[0, 72, 144, 216, 288].map((r) => <ellipse key={r} rx="25" ry="12" fill={i % 3 === 0 ? '#f8e9ef' : i % 3 === 1 ? '#c56e98' : '#fff8ec'} stroke="#8d446d" strokeWidth="2" transform={`rotate(${r}) translate(20 0)`} />)}
          <circle r="11" fill="#d6ac54" />
          <circle r="4" fill="#531c46" />
        </g>
      ))}
      <path d="M70 270 Q167 239 275 270 L253 306 Q167 327 87 302Z" fill="#a05276" opacity="0.94" />
      <path d="M113 278 Q170 257 229 278 L206 306 Q166 317 133 305Z" fill="#f0cddc" opacity="0.78" />
    </svg>
  )
}

// Tries each source in turn; shows a soft placeholder if none exist
function Photo({ srcs, alt, className = '', position, priority = false }) {
  const [i, setI] = useState(0)
  const [loaded, setLoaded] = useState(false)
  if (i >= srcs.length) {
    return (
      <div className={`photo-missing ${className}`} role="img" aria-label={alt}>
        <span>{alt}</span>
      </div>
    )
  }
  return (
    <img
      key={srcs[i]}
      src={srcs[i]}
      alt={alt}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      className={`${className} ${loaded ? 'is-loaded' : 'is-loading'}`}
      style={position ? { objectPosition: position } : undefined}
      onLoad={() => setLoaded(true)}
      onError={() => {
        setLoaded(false)
        setI(i + 1)
      }}
    />
  )
}

function HomePage({ go }) {
  return (
    <section className="home-hero">
      <figure className="site-photo site-photo-hero">
        <Photo srcs={COUPLE} alt="Likhith Varma and Mohana Priya" position="center 32%" priority />
        <FallingFlowers />
      </figure>
      <div className="home-hero-shade" aria-hidden="true" />
      <div className="home-hero-content home-countdown-only">
      <p className="kicker">We’re getting married!</p>
      <p className="site-invite">Please join us for our wedding celebration on</p>
      <p className="site-date">{DATES}</p>
      <p className="site-venue">{VENUE}</p>
      <Countdown />
      <p className="home-couple-signature">Likhith Varma <span>&amp;</span> Mohana Priya</p>
      <div className="btn-row">
        <AddToCalendar events={EVENTS} />
        <DirectionsButton />
      </div>
      <button type="button" className="btn btn-link" onClick={() => go(2)}>
        View Events <span aria-hidden="true">→</span>
      </button>
      </div>
    </section>
  )
}

function RsvpPage() {
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const text =
      `RSVP for ${COUPLE_NAMES}'s wedding (${DATES}, ${VENUE})\n` +
      `Name: ${f.get('name')}\nAttending: ${f.get('attending')}\nGuests: ${f.get('guests')}` +
      (f.get('message') ? `\nMessage: ${f.get('message')}` : '')
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
    setSent(true)
  }

  return (
    <section className="rsvp-shell">
      <div className="rsvp-layout">
        <aside className="rsvp-intro">
          <p className="rsvp-eyebrow">Our wedding celebration</p>
          <h2 className="page-title">Celebrate<br />With Us</h2>
          <p className="page-lead">Your presence and blessings would make our day complete.</p>
          <div className="rsvp-detail-list">
            <article>
              <span aria-hidden="true">✦</span>
              <div><h3>Wedding Dates</h3><p>{DATES}</p></div>
            </article>
            <article>
              <span aria-hidden="true">⌂</span>
              <div><h3>Venue</h3><p>{VENUE}</p></div>
            </article>
            <article>
              <span aria-hidden="true">♡</span>
              <div><h3>A Special Day</h3><p>Celebrate love, laughter and forever.</p></div>
            </article>
          </div>
        </aside>
        <div className="rsvp-main">
          <div className="rsvp-form-heading">
            <span aria-hidden="true">✉</span>
            <div>
              <h2>RSVP to Attend</h2>
              <p>Please fill out the form below.</p>
            </div>
          </div>
      {sent ? (
        <div className="card rsvp-thanks">
          <p>Thank you!</p>
          <span>We can’t wait to celebrate with you.</span>
        </div>
      ) : (
        <form className="card rsvp" onSubmit={submit}>
          <label className="field">
            <input name="name" required maxLength={80} autoComplete="name" placeholder=" " />
            <span>Full name</span>
          </label>
          <fieldset className="choice-group">
            <legend>Will you attend?</legend>
            <label className="choice">
              <input type="radio" name="attending" value="Yes, with joy" required defaultChecked />
              <span>Joyfully accept</span>
            </label>
            <label className="choice">
              <input type="radio" name="attending" value="Sorry, cannot attend" />
              <span>Regretfully decline</span>
            </label>
          </fieldset>
          <label className="field">
            <input name="guests" type="number" min="1" max="20" defaultValue="1" required placeholder=" " />
            <span>Number of guests</span>
          </label>
          <label className="field">
            <textarea name="message" rows="3" maxLength={500} placeholder=" " />
            <span>Message for the couple</span>
          </label>
          <button type="submit" className="btn btn-primary btn-block">
            Send RSVP <span aria-hidden="true">→</span>
          </button>
        </form>
      )}
        </div>
        <aside className="rsvp-side-panel">
          <p className="rsvp-side-kicker">A note from the couple</p>
          <h3>Your presence is our greatest gift.</h3>
          <p>Kindly share your response so we can prepare a joyful celebration for everyone.</p>
          <ul>
            <li><span aria-hidden="true">✓</span> RSVP in a moment</li>
            <li><span aria-hidden="true">✦</span> Add your guest count</li>
            <li><span aria-hidden="true">♡</span> Send your wishes</li>
          </ul>
        </aside>
      </div>
    </section>
  )
}

function EventsPage() {
  return (
    <section className="events-showcase">
      <h2 className="page-title">Events</h2>
      <p className="events-lead">Every celebration, all in one place.</p>
      <div className="event-rows">
        {EVENTS.map((e, i) => (
          <article key={e.id} className={`event-row ${i % 2 ? 'from-right' : 'from-left'}`}>
            <figure className="event-visual">
              <Photo
                srcs={EVENT_PHOTOS[i % EVENT_PHOTOS.length]}
                alt={`${e.title} celebration`}
                position={i % 2 ? 'center 36%' : 'center 30%'}
              />
              <span className="event-mark" aria-hidden="true">{EVENT_MARKS[i % EVENT_MARKS.length]}</span>
            </figure>
            <div className="event-content">
            <p className="site-event-note">{e.note}</p>
            <h3>{e.title}</h3>
            <p className="site-event-day">{e.day}</p>
            <p className="site-event-time">{e.time}</p>
            {e.extra && <p className="site-event-extra">{e.extra}</p>}
            <p className="site-event-venue">{e.venue || VENUE}</p>
            <AddToCalendar events={[e]} label="Save this event" />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function PartyPage() {
  return (
    <>
      <h2 className="page-title">Wedding Party</h2>
      <div className="party">
        <article className="card party-card groom-card from-left">
          <div className="party-image-frame">
            <Photo srcs={COUPLE_STAGE} alt="Likhith Varma" className="party-img groom-img" position="center 68%" />
          </div>
          <h3>Chi. Likhith Varma</h3>
          <p>The Groom</p>
          <small>
            Son of Smt. Venkata Ramanamma &amp; Sri Muppala Manohar Raju
            <br />
            Duggunta Rajupalem
          </small>
        </article>
        <article className="card party-card bride-card from-right">
          <div className="party-image-frame">
            <Photo srcs={COUPLE_STAGE} alt="Mohana Priya" className="party-img bride-img" position="center 68%" />
          </div>
          <h3>Chi. La. Sow. Mohana Priya</h3>
          <p>The Bride</p>
          <small>
            Daughter of Smt. Vijaya &amp; Late Sri Konduru Ramraju
            <br />
            Polluru
          </small>
        </article>
      </div>
    </>
  )
}

function TravelPage() {
  return (
    <section className="events-showcase travel-showcase">
      <h2 className="page-title">Travel &amp; Venue</h2>
      <p className="events-lead">Choose your map and plan your route to the wedding celebration.</p>
      <div className="travel-map-grid">
        <article className="travel-map-card from-left">
          <figure>
            <Photo srcs={TRAVEL_MAP_PHOTOS[0]} alt="Google Maps route to MR Convention Hall" position="center 42%" />
          </figure>
          <div>
            <p className="site-event-note">Wedding location</p>
            <h3>Google Maps</h3>
            <p>{VENUE}</p>
            <a className="btn btn-primary" href={DIRECTIONS} target="_blank" rel="noopener noreferrer">Open Google Maps</a>
          </div>
        </article>
        <article className="travel-map-card from-right">
          <figure>
            <Photo srcs={TRAVEL_MAP_PHOTOS[1]} alt="Apple Maps route to MR Convention Hall" position="center 42%" />
          </figure>
          <div>
            <p className="site-event-note">Wedding location</p>
            <h3>Apple Maps</h3>
            <p>{VENUE}</p>
            <a className="btn btn-primary" href={APPLE_DIRECTIONS} target="_blank" rel="noopener noreferrer">Open Apple Maps</a>
          </div>
        </article>
      </div>
      <article className="travel-reminder">
        <div>
          <p className="site-event-note">Wedding reminder</p>
          <h3>Save every wedding moment</h3>
          <p>Haldi — 24 November at 3:00 PM, Duggunta Raju Palem, plus all wedding celebrations.</p>
        </div>
        <AddToCalendar events={EVENTS} label="Add wedding reminders" />
      </article>
    </section>
  )
}

function GiftPage() {
  return (
    <section className="gift-showcase">
      <h2 className="page-title">Gift Registry</h2>
      <p className="events-lead">A little note from the couple.</p>
      <div className="gift-grid">
        <figure className="gift-photo">
          <Photo srcs={RINGS} alt="Likhith Varma and Mohana Priya" position="center 42%" />
        </figure>
        <article className="gift-message">
          <Bouquet />
          <p className="gift-kicker">With love and gratitude</p>
          <h3>Your Presence Is Our Greatest Gift</h3>
          <p>Celebrating with us is more than we could ask for. Your blessings, smiles and warm wishes will make our day complete.</p>
          <span className="gift-signoff">Likhith Varma &amp; Mohana Priya</span>
        </article>
      </div>
    </section>
  )
}

const PAGES = [
  { name: 'Home', Page: HomePage },
  { name: 'Events', Page: EventsPage },
  { name: 'Wedding Party', Page: PartyPage },
  { name: 'Gallery', Page: GalleryPage },
  { name: 'Travel', Page: TravelPage },
  { name: 'RSVP', Page: RsvpPage },
  { name: 'Gift Registry', Page: GiftPage },
]

const pause = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))

// Navigation begins while the next section is still below the fold.  Wait for
// its important images before revealing it, so visitors never arrive at a row
// of empty image boxes on a slower connection.
const waitForImage = (img) => {
  if (img.complete) {
    return img.naturalWidth && img.decode ? img.decode().catch(() => undefined) : Promise.resolve()
  }

  return new Promise((resolve) => {
    const finish = () => {
      img.removeEventListener('load', finish)
      img.removeEventListener('error', finish)
      resolve()
    }
    img.addEventListener('load', finish, { once: true })
    img.addEventListener('error', finish, { once: true })
  })
}

const waitForSectionImages = (section) => {
  const importantImages = Array.from(section?.querySelectorAll('img') || [])
    .filter((img) => img.loading !== 'lazy')
    .slice(0, 4)

  return Promise.all(importantImages.map(waitForImage))
}

export default function Site() {
  const [index, setIndex] = useState(0)
  const [isTabLoading, setIsTabLoading] = useState(false)
  const [isHomeLoading, setIsHomeLoading] = useState(true)
  const [isAtHomeTop, setIsAtHomeTop] = useState(true)
  const pageRefs = useRef([])
  const navRef = useRef(null)
  const tabNavigationPending = useRef(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // The transparent Home header belongs only to the actual top of Home.
  // Keeping it independent from the active tab prevents RSVP from stretching
  // or changing layout while a reverse scroll is still in progress.
  useEffect(() => {
    const updateHomePosition = () => setIsAtHomeTop(window.scrollY < 12)
    updateHomePosition()
    window.addEventListener('scroll', updateHomePosition, { passive: true })
    return () => window.removeEventListener('scroll', updateHomePosition)
  }, [])

  // Keep the first view polished on a slow connection: the circular couple
  // portrait remains visible until the full Home image has decoded.
  useEffect(() => {
    let active = true
    const homeImage = new Image()
    homeImage.src = COUPLE[0]
    const finish = () => {
      if (active) setIsHomeLoading(false)
    }
    homeImage.onload = () => {
      if (homeImage.decode) homeImage.decode().catch(() => undefined).finally(finish)
      else finish()
    }
    homeImage.onerror = finish
    if (homeImage.complete) homeImage.onload()
    return () => {
      active = false
    }
  }, [])

  // Activate the matching menu item while each full page section comes into view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setIndex(Number(visible.target.dataset.pageIndex))
      },
      // A narrow central detection zone works for short and very tall pages.
      // The former 30% threshold left long pages such as Events inactive.
      { threshold: [0, 0.01], rootMargin: '-24% 0px -56% 0px' },
    )
    pageRefs.current.filter(Boolean).forEach((page) => observer.observe(page))
    return () => observer.disconnect()
  }, [])

  const go = (i) => {
    const next = Math.max(0, Math.min(PAGES.length - 1, i))
    setIndex(next)
    pageRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const navigate = async (i) => {
    const next = Math.max(0, Math.min(PAGES.length - 1, i))

    // The requested celebration loader is only for a tab chosen from Home.
    if (index !== 0 || next === 0) {
      go(next)
      return
    }
    if (tabNavigationPending.current) return

    tabNavigationPending.current = true
    setIsTabLoading(true)
    try {
      // Keep the transition elegant for three full seconds, then continue
      // waiting when the destination's visible images still need to finish.
      await Promise.all([pause(3000), waitForSectionImages(pageRefs.current[next])])
      go(next)
    } finally {
      setIsTabLoading(false)
      tabNavigationPending.current = false
    }
  }

  return (
    <div className={`site ${isAtHomeTop ? 'site-home-active' : ''}`}>
      <header className="site-header">
        <Vine className="vine-left" />
        <Vine className="vine-right" />
        <span className="site-logo" aria-label="Likhith Varma and Mohana Priya wedding">LV <i>&amp;</i> MP</span>
        <h1 className="site-names">
          <span>Likhith Varma</span>
          <small>and</small>
          <span>Mohana Priya</span>
        </h1>
        <nav ref={navRef} className="site-nav" aria-label="Pages">
          {PAGES.map((p, i) => (
            <button
              key={p.name}
              type="button"
              className={i === index ? 'active' : ''}
              aria-current={i === index ? 'page' : undefined}
              onClick={() => navigate(i)}
            >
              {p.name}
            </button>
          ))}
        </nav>
      </header>

      <main className="site-slider">
        <div className="site-track">
          {PAGES.map(({ name, Page }, i) => (
            <section
              key={name}
              ref={(el) => {
                pageRefs.current[i] = el
              }}
              className={`site-page ${i === index ? 'is-active' : ''}`}
              data-page-index={i}
              aria-label={name}
            >
              <Page go={navigate} />
            </section>
          ))}
        </div>
      </main>
      {isTabLoading && (
        <div className="site-tab-loader" role="status" aria-live="polite" aria-label="Preparing your celebration">
          <div className="site-tab-loader-photo" style={{ backgroundImage: `url(${COUPLE[0]})` }} aria-hidden="true" />
          <div className="site-tab-loader-shade" aria-hidden="true" />
          <div className="site-tab-loader-content">
            <span className="site-tab-loader-flower" aria-hidden="true">✦</span>
            <span className="site-tab-loader-ring" aria-hidden="true" />
            <p>Preparing your celebration</p>
            <small>Just a beautiful moment…</small>
          </div>
        </div>
      )}
      {isHomeLoading && (
        <div className="site-home-loader" role="status" aria-live="polite" aria-label="Loading Likhith Varma and Mohana Priya's wedding website">
          <div className="site-home-loader-glow" aria-hidden="true" />
          <img className="site-home-loader-photo" src={COUPLE[0]} alt="" />
          <p>Likhith Varma <span>&amp;</span> Mohana Priya</p>
          <small>Preparing your celebration</small>
        </div>
      )}
    </div>
  )
}
