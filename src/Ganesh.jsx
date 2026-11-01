import { useId } from 'react'

// Line-art Lord Ganesha; `draw` animates the strokes being drawn in
export default function Ganesh({ className = '', draw = false }) {
  const id = useId()
  const gold = `gold-${id}`
  const face = `face-${id}`

  return (
    <svg
      className={`ganesh ${draw ? 'ganesh-draw' : ''} ${className}`}
      viewBox="0 0 120 140"
      role="img"
      aria-label="Lord Ganesha"
    >
      <defs>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3d27a" />
          <stop offset="0.5" stopColor="#c8892a" />
          <stop offset="1" stopColor="#8a5a12" />
        </linearGradient>
        <radialGradient id={face} cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#fff3d6" />
          <stop offset="1" stopColor="#f6d48f" />
        </radialGradient>
      </defs>

      <g className="ganesh-fill">
        <path d="M42 54 C22 44 8 62 16 80 C22 94 36 92 44 82 Z" fill={`url(#${face})`} />
        <path d="M78 54 C98 44 112 62 104 80 C98 94 84 92 76 82 Z" fill={`url(#${face})`} />
        <path
          d="M41 50 H79 C81 72 74 86 66 90 C64 100 66 106 74 110 C80 113 84 111 84 110 C88 118 80 126 70 122 C56 116 52 96 54 90 C46 86 40 72 41 50 Z"
          fill={`url(#${face})`}
        />
        <path d="M42 46 L46 22 L54 30 L60 10 L66 30 L74 22 L78 46 Z" fill={`url(#${gold})`} />
      </g>

      <g
        className="ganesh-lines"
        fill="none"
        stroke={`url(#${gold})`}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path pathLength="1" d="M42 46 L46 22 L54 30 L60 10 L66 30 L74 22 L78 46 Z" />
        <path pathLength="1" d="M40 46 H80 V51 H40 Z" />
        <path pathLength="1" d="M42 54 C22 44 8 62 16 80 C22 94 36 92 44 82" />
        <path pathLength="1" d="M78 54 C98 44 112 62 104 80 C98 94 84 92 76 82" />
        <path pathLength="1" d="M34 62 C24 62 22 74 30 80" />
        <path pathLength="1" d="M86 62 C96 62 98 74 90 80" />
        <path pathLength="1" d="M42 52 C40 72 46 86 54 90" />
        <path pathLength="1" d="M78 52 C80 72 74 86 66 90" />
        <path pathLength="1" d="M54 72 C52 96 56 116 70 122 C80 126 88 118 84 110" />
        <path pathLength="1" d="M66 72 C64 92 66 106 74 110 C78 112 82 111 84 110" />
        <path pathLength="1" d="M55 96 H64 M57 104 H66 M61 112 H69" strokeWidth="1.4" />
        <path pathLength="1" d="M49 65 Q53 61 57 65 M63 65 Q67 61 71 65" />
        <path pathLength="1" d="M52 86 L46 94" strokeWidth="3.4" />
        <path pathLength="1" d="M60 54 V59" />
      </g>
      <circle cx="60" cy="10" r="3.2" fill={`url(#${gold})`} />
      <circle cx="60" cy="62" r="1.8" fill="#c0282d" />
    </svg>
  )
}
