/* Night ridges under a moon: the desktop's wallpaper, drawn at 1600x900. */

function stars(count: number, seed: number) {
  let s = seed
  const rand = () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
  return Array.from({ length: count }, () => ({
    x: Math.round(rand() * 1600),
    y: Math.round(rand() * 470),
    r: +(0.6 + rand() * 1.1).toFixed(2),
    o: +(0.25 + rand() * 0.65).toFixed(2),
  }))
}

const STARS = stars(110, 20261027)

export function Wallpaper({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="wp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#030716" />
          <stop offset="0.45" stopColor="#081436" />
          <stop offset="0.68" stopColor="#15297a" />
          <stop offset="1" stopColor="#0a1336" />
        </linearGradient>
        <radialGradient id="wp-moon" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#cfe0ff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#cfe0ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wp-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4d7dff" stopOpacity="0" />
          <stop offset="0.6" stopColor="#4d7dff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#4d7dff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#wp-sky)" />
      {STARS.map((st, i) => (
        <circle key={i} cx={st.x} cy={st.y} r={st.r} fill="#dfe8ff" opacity={st.o} />
      ))}
      <circle cx="1235" cy="188" r="150" fill="url(#wp-moon)" />
      <circle cx="1235" cy="188" r="40" fill="#e6eeff" />
      <circle cx="1252" cy="176" r="36" fill="#0b1a4a" opacity="0.18" />
      <rect y="380" width="1600" height="260" fill="url(#wp-haze)" />
      <path
        d="M0 590 C120 552 220 512 340 532 S560 462 700 492 S930 552 1060 512 S1290 432 1420 472 S1560 522 1600 502 V900 H0Z"
        fill="#1a2c6c"
      />
      <path
        d="M0 660 C140 612 260 642 380 602 S600 562 760 612 S980 682 1120 632 S1360 562 1600 622 V900 H0Z"
        fill="#122059"
      />
      <path
        d="M0 742 C180 692 300 722 460 692 S760 652 900 702 S1180 762 1320 722 S1520 692 1600 702 V900 H0Z"
        fill="#0c1740"
      />
      <path d="M0 822 C200 782 420 802 600 792 S980 762 1200 802 S1480 832 1600 812 V900 H0Z" fill="#060e29" />
    </svg>
  )
}
