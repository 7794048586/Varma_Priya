import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// Keep a concise five-photo story: two engagement moments and three
// pre-wedding portraits. The original source photos remain untouched.
const SELECTED_GALLERY = [
  ['couple-1', 'Engagement'],
  ['couple-2', 'Engagement'],
  ['Image (6)', 'Pre-wedding'],
  ['Image (7)', 'Pre-wedding'],
  ['Image (1)', 'Pre-wedding'],
]

const ALL_GALLERY = Object.entries(
  import.meta.glob('./assets/gallery/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([path, src]) => ({ src, name: path.split('/').pop().replace(/\.[^.]+$/, '') }))

export const GALLERY = SELECTED_GALLERY
  .map(([name, collection]) => {
    const photo = ALL_GALLERY.find((item) => item.name === name)
    return photo && { ...photo, collection }
  })
  .filter(Boolean)

export const pick = (prefix) => GALLERY.filter((g) => g.name.startsWith(prefix)).map((g) => g.src)

function Lightbox({ index, setIndex, onClose }) {
  const [dir, setDir] = useState(1)
  const swipe = useRef(null)
  const closeRef = useRef(null)
  const count = GALLERY.length

  const show = (step) => {
    setDir(step)
    setIndex((i) => (i + step + count) % count)
  }

  useEffect(() => {
    closeRef.current.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') show(1)
      if (e.key === 'ArrowLeft') show(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${count}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onPointerDown={(e) => {
        e.stopPropagation()
        swipe.current = e.clientX
      }}
      onPointerUp={(e) => {
        e.stopPropagation()
        if (swipe.current === null) return
        const dx = e.clientX - swipe.current
        swipe.current = null
        if (Math.abs(dx) > 50) show(dx < 0 ? 1 : -1)
      }}
    >
      <img
        key={index}
        className={`lightbox-img ${dir > 0 ? 'from-right' : 'from-left'}`}
        src={GALLERY[index].src}
        alt={`Likhith Varma and Mohana Priya, photo ${index + 1}`}
        draggable="false"
      />
      <button ref={closeRef} type="button" className="lightbox-btn lightbox-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      {count > 1 && (
        <>
          <button type="button" className="lightbox-btn lightbox-prev" onClick={() => show(-1)} aria-label="Previous photo">
            ‹
          </button>
          <button type="button" className="lightbox-btn lightbox-next" onClick={() => show(1)} aria-label="Next photo">
            ›
          </button>
        </>
      )}
      <p className="lightbox-count">
        {index + 1} / {count}
      </p>
    </div>,
    document.body,
  )
}

export default function GalleryPage() {
  const [open, setOpen] = useState(null)

  return (
    <>
      <h2 className="page-title">Gallery</h2>
      {GALLERY.length === 0 ? (
        <p className="page-lead">Photos coming soon.</p>
      ) : (
        <div className="gallery">
          {GALLERY.map((g, i) => (
            <button key={g.src} type="button" className="gallery-item" onClick={() => setOpen(i)}>
              <img
                src={g.src}
                alt={`${g.collection} photo of Likhith Varma and Mohana Priya, photo ${i + 1}`}
                loading={i < 4 ? 'eager' : 'lazy'}
                fetchPriority={i < 4 ? 'high' : 'auto'}
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}
      {open !== null && <Lightbox index={open} setIndex={setOpen} onClose={() => setOpen(null)} />}
    </>
  )
}
