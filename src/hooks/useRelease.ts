import { useEffect, useState } from 'react'
import { latestRelease, type Release } from '../lib/release'

/** The latest release once GitHub answers; null before that, during prerendering, and when it cannot. */
export function useRelease(): Release | null {
  const [release, setRelease] = useState<Release | null>(null)
  useEffect(() => {
    let alive = true
    latestRelease().then((r) => {
      if (alive) setRelease(r)
    })
    return () => {
      alive = false
    }
  }, [])
  return release
}
