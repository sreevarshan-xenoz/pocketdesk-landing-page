import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Registered on import, before any component builds a scroll timeline.
gsap.registerPlugin(useGSAP, ScrollTrigger)

export { gsap, ScrollTrigger, useGSAP }

/** True when the page runs its scroll scenes (set before first paint by index.html). */
export function motionOn(): boolean {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('motion')
}

/** An element's layout offset from an ancestor, ignoring transforms. */
export function offsetWithin(el: HTMLElement, ancestor: HTMLElement): { top: number; left: number } {
  let top = 0
  let left = 0
  let node: HTMLElement | null = el
  while (node && node !== ancestor) {
    top += node.offsetTop
    left += node.offsetLeft
    node = node.offsetParent as HTMLElement | null
  }
  return { top, left }
}
