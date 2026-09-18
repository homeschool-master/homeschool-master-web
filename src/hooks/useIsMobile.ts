import { useSyncExternalStore } from 'react'

/**
 * Mirrors the stylesheet's single breakpoint: respond-to(mobile) is
 * max-width 767px, one below $bp-tablet. Kept in sync by hand, because this is
 * the one place layout has to branch in JavaScript rather than in CSS: the week
 * view swaps between two different component trees, and rendering both to hide
 * one would mean building a busy week twice.
 */
const MOBILE_QUERY = '(max-width: 767px)'

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
