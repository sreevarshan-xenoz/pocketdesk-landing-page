import { Icon } from '../../Icon'
import s from './apps.module.css'

export interface Track {
  title: string
  artist: string
  elapsed: string
  length: string
  /** 0..1 */
  progress: number
}

export const SLOW_TIDES: Track = { title: 'Slow Tides', artist: 'Harbour Lights', elapsed: '2:14', length: '3:52', progress: 0.58 }

/** A music player's window body: the art, the track, the buttons. The artist is made up. */
export function Music({ track = SLOW_TIDES }: { track?: Track }) {
  return (
    <div className={s.music}>
      <div className={s.art} />
      <div className={s.meta}>
        <b>{track.title}</b>
        <span>{track.artist}</span>
        <div className={s.progress}>
          <i style={{ width: `${track.progress * 100}%` }} />
        </div>
        <div className={s.times}>
          <span>{track.elapsed}</span>
          <span>{track.length}</span>
        </div>
      </div>
      <div className={s.controls}>
        <Icon name="prev" size={20} />
        <span className={s.playBtn}>
          <Icon name="pause" size={20} />
        </span>
        <Icon name="next" size={20} />
      </div>
      <div className={s.eq} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  )
}
