import { useId } from 'react'

/* The brand mark's geometry (assets/brand/pocketdesk-mark.svg in the main repository),
   exported so the finale can take it apart and put it back together. */
export const MARK = {
  viewBox: '0 0 512 512',
  back: 'M104 236 Q104 204 136 200 L376 200 Q408 204 408 236 L408 262 L104 262 Z',
  left: 'M84 238 Q84 214 108 220 L256 266 L256 462 Q240 462 224 456 L124 418 Q84 402 84 360 Z',
  right: 'M256 266 L404 220 Q428 214 428 238 L428 360 Q428 402 388 418 L288 456 Q272 462 256 462 Z',
  edge: 'M92 226 L256 276 L420 226',
  seam: 'M296 318 L404 284',
  window: { x: 152, y: 86, width: 228, height: 256, rx: 34, rotate: 9, cx: 266, cy: 216 },
  dots: [204, 242, 280],
}

export function MarkGradients({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-left`} x1="80" y1="220" x2="256" y2="460" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#5AD1FF" />
        <stop offset="1" stopColor="#2F7BFF" />
      </linearGradient>
      <linearGradient id={`${id}-right`} x1="256" y1="230" x2="430" y2="450" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#2E8BFF" />
        <stop offset="1" stopColor="#5B4BFF" />
      </linearGradient>
      <linearGradient id={`${id}-back`} x1="96" y1="180" x2="416" y2="260" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#2563EB" />
        <stop offset="1" stopColor="#4338CA" />
      </linearGradient>
      <linearGradient id={`${id}-rim`} x1="150" y1="90" x2="380" y2="340" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#8FD8FF" />
        <stop offset="1" stopColor="#7B6CFF" />
      </linearGradient>
    </defs>
  )
}

export function PocketFront({ id }: { id: string }) {
  return (
    <>
      <path d={MARK.left} fill={`url(#${id}-left)`} />
      <path d={MARK.right} fill={`url(#${id}-right)`} />
      <path d={MARK.edge} fill="none" stroke="#B9ECFF" strokeOpacity="0.55" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d={MARK.seam} fill="none" stroke="#C7D2FE" strokeOpacity="0.75" strokeWidth="7" strokeLinecap="round" strokeDasharray="16 14" />
    </>
  )
}

interface MarkProps {
  size?: number
  className?: string
  /** Read by assistive tech; leave empty when the wordmark sits beside it. */
  label?: string
}

export function Mark({ size = 32, className, label }: MarkProps) {
  const id = `pd${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const w = MARK.window
  return (
    <svg
      className={className}
      viewBox={MARK.viewBox}
      width={size}
      height={size}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <MarkGradients id={id} />
      <path d={MARK.back} fill={`url(#${id}-back)`} />
      <g transform={`rotate(${w.rotate} ${w.cx} ${w.cy})`}>
        <rect x={w.x} y={w.y} width={w.width} height={w.height} rx={w.rx} fill="#0B1222" stroke={`url(#${id}-rim)`} strokeWidth="12" />
        <circle cx={MARK.dots[0]} cy="140" r="14" fill="#FF5F57" />
        <circle cx={MARK.dots[1]} cy="140" r="14" fill="#FEBC2E" />
        <circle cx={MARK.dots[2]} cy="140" r="14" fill="#28C840" />
      </g>
      <PocketFront id={id} />
    </svg>
  )
}
