import { useEffect, useRef } from 'react'
import { FILM } from '../lib/film'
import { setScrollLocked } from '../lib/motion'
import { Icon } from './Icon'
import s from './FilmModal.module.css'

interface FilmModalProps {
  open: boolean
  onClose: () => void
}

/** The film in a native dialog: Esc and the backdrop close it, focus comes back where it was. */
export function FilmModal({ open, onClose }: FilmModalProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open && !d.open) {
      d.showModal()
      setScrollLocked(true)
      video.current?.play().catch(() => {})
    } else if (!open && d.open) {
      d.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialog}
      className={s.dialog}
      aria-label="Pocketdesk, the film"
      onClose={() => {
        video.current?.pause()
        setScrollLocked(false)
        onClose()
      }}
      onClick={(e) => {
        if (e.target === dialog.current) onClose()
      }}
    >
      <div className={s.frame}>
        {/* Source and poster only once it opens: a closed dialog downloads nothing. */}
        <video
          ref={video}
          className={s.video}
          src={open ? FILM.src : undefined}
          poster={open ? FILM.poster : undefined}
          controls
          playsInline
          preload="none"
        />
        <button type="button" className={s.close} onClick={onClose} aria-label="Close the film">
          <Icon name="x" size={20} />
        </button>
      </div>
    </dialog>
  )
}
