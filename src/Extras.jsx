import { useEffect, useState } from 'react'
import {
  APPLE_DIRECTIONS,
  DIRECTIONS,
  MAP_EMBED,
  MUHURTHAM,
  VENUE,
  downloadIcs,
  googleLink,
  isApple,
} from './wedding'

const pad = (n) => String(n).padStart(2, '0')

function remaining() {
  const ms = Math.max(0, MUHURTHAM.getTime() - Date.now())
  const s = Math.floor(ms / 1000)
  return { done: ms === 0, days: Math.floor(s / 86400), hours: Math.floor(s / 3600) % 24, minutes: Math.floor(s / 60) % 60, seconds: s % 60 }
}

export function Countdown() {
  const [t, setT] = useState(remaining)

  useEffect(() => {
    const id = setInterval(() => setT(remaining()), 1000)
    return () => clearInterval(id)
  }, [])

  if (t.done) {
    return <p className="countdown-done">Happily married — thank you for your blessings!</p>
  }

  const units = [
    ['Days', t.days],
    ['Hours', pad(t.hours)],
    ['Minutes', pad(t.minutes)],
    ['Seconds', pad(t.seconds)],
  ]

  return (
    <div className="countdown" role="timer" aria-label={`${t.days} days ${t.hours} hours ${t.minutes} minutes to the Sumuhurtham`}>
      <p className="countdown-title">Counting down to the Sumuhurtham</p>
      <div className="countdown-grid">
        {units.map(([label, value]) => (
          <div key={label} className="countdown-cell">
            <span key={value} className="countdown-num" aria-hidden="true">
              {value}
            </span>
            <span className="countdown-label" aria-hidden="true">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const CalendarIcon = () => (
  <svg className="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4M9 14.5l2 2 4-4" />
  </svg>
)

const PinIcon = () => (
  <svg className="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
)

// iPhone: one tap adds every event (with reminders) to the Calendar app; elsewhere: Google Calendar
export function AddToCalendar({ events, label = 'Add to Calendar', className = '' }) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')

  const onClick = () => {
    if (isApple()) {
      downloadIcs(events)
      setNote('Opening your Calendar — tap “Add All” to save with reminders.')
    } else if (events.length === 1) {
      window.open(googleLink(events[0]), '_blank', 'noopener')
    } else {
      setOpen((o) => !o)
    }
  }

  return (
    <div className={`cal ${className}`}>
      <button type="button" className="btn btn-primary" onClick={onClick} aria-expanded={events.length > 1 ? open : undefined}>
        <CalendarIcon />
        {label}
      </button>
      {open && (
        <div className="cal-menu">
          {events.map((e) => (
            <a key={e.id} className="cal-option" href={googleLink(e)} target="_blank" rel="noopener noreferrer">
              <span className="cal-option-title">{e.title}</span>
              <span className="cal-option-sub">Google Calendar · {e.day}</span>
            </a>
          ))}
          <button type="button" className="cal-option" onClick={() => downloadIcs(events)}>
            <span className="cal-option-title">Apple / Outlook</span>
            <span className="cal-option-sub">Both events with reminders (.ics)</span>
          </button>
        </div>
      )}
      {note && (
        <p className="cal-note" role="status">
          {note}
        </p>
      )}
    </div>
  )
}

export function DirectionsButton({ className = 'btn btn-ghost' }) {
  return (
    <a className={className} href={isApple() ? APPLE_DIRECTIONS : DIRECTIONS} target="_blank" rel="noopener noreferrer">
      <PinIcon />
      Get Directions
    </a>
  )
}

export function VenueMap() {
  return (
    <div className="venue">
      <div className="venue-frame">
        <iframe
          title={`Map to ${VENUE}`}
          src={MAP_EMBED}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className="venue-info">
        <p className="venue-kicker">The Venue</p>
        <h3 className="venue-name">MR Convention</h3>
        <p className="venue-place">Podalakur, Andhra Pradesh</p>
        <div className="btn-row">
          <a className="btn btn-primary" href={DIRECTIONS} target="_blank" rel="noopener noreferrer">
            <PinIcon />
            Google Maps
          </a>
          <a className="btn btn-ghost" href={APPLE_DIRECTIONS} target="_blank" rel="noopener noreferrer">
            <PinIcon />
            Apple Maps
          </a>
        </div>
        <p className="venue-tip">Directions start from your current location for the fastest route.</p>
      </div>
    </div>
  )
}
