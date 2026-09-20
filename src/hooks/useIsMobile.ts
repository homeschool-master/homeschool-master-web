import { useSyncExternalStore } from 'react'
import { MOBILE_MAX_WIDTH } from '../constants/breakpoints'

/**
 * Mirrors the stylesheet's single breakpoint: respond-to(mobile) is
 * max-width 767px, one below $bp-tablet. The number itself lives in
 * constants/breakpoints.ts, which is also where the nav strip's slot ladder is
 * derived from it, so the two cannot drift apart.
 *
 * This is the one place layout has to branch in JavaScript rather than in CSS:
 * the week view swaps between two different component trees, and rendering both
 * to hide one would mean building a busy week twice.
 */
const MOBILE_QUERY = `(max-width: ${MOBILE_MAX_WIDTH}px)`

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(MOBILE_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

export const useIsMobile = (): boolean =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false
  )
