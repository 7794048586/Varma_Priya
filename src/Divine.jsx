import { useState } from 'react'

// Drop a picture into public/ with one of these names to replace the drawn emblem
const SOURCES = ['png', 'jpg', 'jpeg', 'webp'].map((ext) => `/venkateswara-padmavathi.${ext}`)

const GOLD = '#a8741c'
const FILL = '#f1d79c'

// Flame points around the temple arch (prabhavali)
const FLAMES = Array.from({ length: 23 }, (_, i) => {
  const a = Math.PI + (i / 22) * Math.PI
  return { x: 200 + Math.cos(a) * 178, y: 168 + Math.sin(a) * 150, deg: (a * 180) / Math.PI + 90 }
})

function Emblem() {
  return (
    <svg className="divine-art" viewBox="0 0 400 340" aria-hidden="true">
      <g fill="none" stroke={GOLD} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        {/* Prabhavali arch */}
        <path d="M22 340 V168 A178 150 0 0 1 378 168 V340" strokeWidth="3" />
        <path d="M36 340 V170 A164 136 0 0 1 364 170 V340" />
        {FLAMES.map((f, i) => (
          <path
            key={i}
            d="M0 0 C-6 -6 -4 -14 0 -20 C4 -14 6 -6 0 0 Z"
            fill={FILL}
            transform={`translate(${f.x} ${f.y}) rotate(${f.deg})`}
          />
        ))}

        {/* Lord Venkateswara */}
        <path d="M110 128 L116 48 Q140 14 164 48 L170 128 Z" fill={FILL} />
        <path d="M114 70 H166 M112 92 H168 M111 112 H169" />
        <circle cx="140" cy="22" r="6" fill={FILL} />
        <ellipse cx="140" cy="152" rx="26" ry="30" fill="#fbf1dc" />
        <path d="M127 128 Q127 156 140 158 Q153 156 153 128" strokeWidth="5" />
        <path d="M140 131 V154" stroke="#c0282d" strokeWidth="3.4" />
        <circle cx="113" cy="162" r="5" fill={FILL} />
        <circle cx="167" cy="162" r="5" fill={FILL} />
        <path d="M96 214 Q140 184 184 214 L200 340 H80 Z" fill={FILL} />
        <path d="M112 202 Q140 290 168 202" strokeWidth="3" />
        {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((t) => (
          <circle key={t} cx={112 + 56 * t} cy={202 + 176 * t * (1 - t)} r="3.2" fill="#fbf1dc" />
        ))}
        {/* Shankha (conch) */}
        <path d="M80 186 C70 170 78 150 94 152 C106 154 108 170 98 178 C92 184 86 186 80 186 Z" fill="#fbf1dc" />
        <path d="M84 176 C82 166 88 160 95 163" />
        {/* Sudarshana chakra */}
        <circle cx="198" cy="168" r="17" fill="#fbf1dc" />
        <circle cx="198" cy="168" r="5" fill={FILL} />
        {[0, 45, 90, 135].map((a) => (
          <path key={a} d="M181 168 H215" transform={`rotate(${a} 198 168)`} strokeWidth="1.6" />
        ))}

        {/* Goddess Padmavathi */}
        <path d="M252 152 Q276 96 300 152 Z" fill={FILL} />
        <circle cx="276" cy="106" r="5" fill={FILL} />
        <path d="M256 140 H296" />
        <ellipse cx="276" cy="176" rx="22" ry="26" fill="#fbf1dc" />
        <circle cx="276" cy="164" r="2.6" fill="#c0282d" stroke="none" />
        <path d="M266 174 Q270 171 274 174 M278 174 Q282 171 286 174" strokeWidth="1.6" />
        <circle cx="253" cy="184" r="4" fill={FILL} />
        <circle cx="299" cy="184" r="4" fill={FILL} />
        <path d="M238 232 Q276 206 314 232 L328 340 H224 Z" fill={FILL} />
        <path d="M252 222 Q276 290 300 222" strokeWidth="3" />
        {/* Lotus in hand */}
        <g transform="translate(276 268)" fill="#fbf1dc">
          <path d="M0 0 C-8 -10 -6 -22 0 -28 C6 -22 8 -10 0 0 Z" />
          <path d="M0 0 C-14 -4 -20 -16 -18 -22 C-10 -20 -4 -12 0 0 Z" />
          <path d="M0 0 C14 -4 20 -16 18 -22 C10 -20 4 -12 0 0 Z" />
        </g>
      </g>
    </svg>
  )
}

export default function Divine() {
  const [i, setI] = useState(0)

  return (
    <div className="divine" aria-hidden="true">
      {i < SOURCES.length ? (
        <img className="divine-art" src={SOURCES[i]} alt="" onError={() => setI(i + 1)} />
      ) : (
        <Emblem />
      )}
    </div>
  )
}
