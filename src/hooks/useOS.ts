import { useEffect, useState } from 'react'
import { detectOS, type NavigatorLike, type OS } from '../lib/os'

/** The visitor's OS after hydration; null while prerendering, so the HTML never guesses. */
export function useOS(): OS | null {
  const [os, setOS] = useState<OS | null>(null)
  useEffect(() => setOS(detectOS(navigator as Navigator & NavigatorLike)), [])
  return os
}
