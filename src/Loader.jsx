import { useEffect } from 'react'
import Ganesh from './Ganesh'

const HOLD = 5000

// Shows Lord Ganesha for exactly five seconds before the home screen opens.
export default function Loader({ onCovered, onDone }) {

  useEffect(() => {
    const covered = setTimeout(onCovered, 700)
    const done = setTimeout(onDone, HOLD)
    return () => {
      clearTimeout(covered)
      clearTimeout(done)
    }
    // Runs once: the timeline is fixed from the moment the loader opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader-bg" />
      <div className="loader-content">
        <div className="loader-halo" aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} style={{ transform: `rotate(${i * 30}deg)` }} />
          ))}
        </div>
        <p className="loader-mantra">Shree Ganeshaya Namah</p>
        <p className="loader-sub">Seeking the blessings of Lord Ganesha</p>
        <div className="loader-bar">
          <span />
        </div>
      </div>
      <div className="loader-ganesh">
        <Ganesh draw />
      </div>
    </div>
  )
}
