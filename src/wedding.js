export const COUPLE_NAMES = 'Likhith Varma & Mohana Priya'
export const VENUE = 'MR Convention, Podalakur'
export const DATES = 'November 25 – 26, 2026'

export const EVENTS = [
  {
    id: 'haldi',
    title: 'Haldi Ceremony',
    note: 'Haldi Celebration',
    day: 'Tuesday, 24th November 2026',
    time: 'Evening',
    venue: 'Duggunta Rajupalem, near Ramalayam',
    start: '2026-11-24T18:00:00+05:30',
    end: '2026-11-24T20:00:00+05:30',
  },
  {
    id: 'reception',
    title: 'Reception',
    note: 'Wedding Reception',
    day: 'Wednesday, 25th November 2026',
    time: '6:00 PM onwards',
    start: '2026-11-25T18:00:00+05:30',
    end: '2026-11-25T22:00:00+05:30',
  },
  {
    id: 'dinner',
    title: 'Dinner',
    note: 'Wedding Dinner',
    day: 'Wednesday, 25th November 2026',
    time: '8:00 PM onwards',
    start: '2026-11-25T20:00:00+05:30',
    end: '2026-11-25T22:00:00+05:30',
  },
  {
    id: 'dance-party',
    title: 'Group Dance Party',
    note: 'Celebrate Together',
    day: 'Wednesday, 25th November 2026',
    time: '10:00 PM onwards',
    start: '2026-11-25T22:00:00+05:30',
    end: '2026-11-26T00:00:00+05:30',
  },
  {
    id: 'sumuhurtham',
    title: 'Sumuhurtham',
    note: 'Wedding Ceremony',
    day: 'Thursday, 26th November 2026',
    time: '4:40 AM – 4:44 AM',
    extra: 'Tula Lagnam, Mrugasira Nakshatram',
    start: '2026-11-26T04:40:00+05:30',
    end: '2026-11-26T04:44:00+05:30',
  },
]

export const MUHURTHAM = new Date(EVENTS.find((event) => event.id === 'sumuhurtham').start)

const q = encodeURIComponent
export const MAP_EMBED = `https://maps.google.com/maps?q=${q(VENUE)}&z=15&output=embed`
export const DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${q(VENUE)}&travelmode=driving`
export const APPLE_DIRECTIONS = `https://maps.apple.com/?daddr=${q(VENUE)}&dirflg=d`

// iPhone / iPad (iPadOS reports itself as a Mac with touch)
export const isApple = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1)

const utc = (d) => new Date(d).toISOString().replace(/[-:]|\.\d{3}/g, '')

const eventVenue = (e) => e.venue || VENUE

const describe = (e) =>
  `${e.note} of ${COUPLE_NAMES}\n${e.day}, ${e.time}${e.extra ? `\n${e.extra}` : ''}\nVenue: ${eventVenue(e)}`

export const googleLink = (e) =>
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  `&text=${q(`${e.title} · ${COUPLE_NAMES}`)}` +
  `&dates=${utc(e.start)}/${utc(e.end)}` +
  `&details=${q(describe(e))}` +
  `&location=${q(eventVenue(e))}` +
  '&ctz=Asia/Kolkata'

const icsText = (s) => s.replace(/\\/g, '\\\\').replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n')

// Apple/Outlook calendar file with reminders one day and two hours before each event
export function downloadIcs(events) {
  const now = utc(Date.now())
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Likhith Varma & Mohana Priya//Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...events.flatMap((e) => [
      'BEGIN:VEVENT',
      `UID:${e.id}-likhith-mohanapriya-2026@wedding`,
      `DTSTAMP:${now}`,
      `DTSTART:${utc(e.start)}`,
      `DTEND:${utc(e.end)}`,
      `SUMMARY:${icsText(`${e.title} · ${COUPLE_NAMES}`)}`,
      `DESCRIPTION:${icsText(describe(e))}`,
      `LOCATION:${icsText(VENUE)}`,
      ...['-P1D', '-PT2H'].flatMap((trigger) => [
        'BEGIN:VALARM',
        `TRIGGER:${trigger}`,
        'ACTION:DISPLAY',
        `DESCRIPTION:${icsText(`${e.title} · ${COUPLE_NAMES}`)}`,
        'END:VALARM',
      ]),
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ]
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'likhith-mohana-priya-wedding.ics'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}
