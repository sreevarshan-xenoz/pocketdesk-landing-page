import { type RefObject, useLayoutEffect } from 'react'

const useIsoLayoutEffect = typeof window === 'undefined' ? () => {} : useLayoutEffect

/**
 * Keeps `--fit` on the element at its width over `baseWidth`, so a scene laid
 * out at a fixed size (the 1600x900 desktop) scales to whatever box holds it.
 */
export function useFitScale(ref: RefObject<HTMLElement | null>, baseWidth: number): void {
  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => el.style.setProperty('--fit', String(el.clientWidth / baseWidth))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref, baseWidth])
}
