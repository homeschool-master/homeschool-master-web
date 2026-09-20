import { useSyncExternalStore } from 'react'
import {
  MOBILE_MAX_WIDTH,
  NAV_SLOT_STEPS,
  UNLIMITED_NAV_SLOTS,
} from '../constants/breakpoints'

/**
 * How many slots the nav has right now, counting the More control as one of
 * them. Above the mobile breakpoint the nav is a column and the answer is
 * "as many as there are sections".
 *
 * Media queries rather than a resize listener and a width, so this answers in
 * the same CSS pixels the stylesheet is working in and fires only when a
 * threshold is actually crossed.
 */
const MOBILE_QUERY = `(max-width: ${MOBILE_MAX_WIDTH}px)`

// Built once and kept: a MediaQueryList per query, reused by every snapshot.
// getSnapshot runs on each render, and making four new ones each time would be
// four style resolutions for an answer that has not changed.
const lists = new Map<string, MediaQueryList>()

const listFor = (query: string): MediaQueryList => {
  const existing = lists.get(query)
  if (existing) return existing

  const created = window.matchMedia(query)
  lists.set(query, created)
  return created
}

const stepQuery = (minWidth: number) => `(min-width: ${minWidth}px)`

const allQueries = [MOBILE_QUERY, ...NAV_SLOT_STEPS.map((step) => stepQuery(step.minWidth))]

const subscribe = (onChange: () => void) => {
  const watched = allQueries.map(listFor)
  watched.forEach((list) => list.addEventListener('change', onChange))

  return () => watched.forEach((list) => list.removeEventListener('change', onChange))
}

const currentSlots = (): number => {
  if (!listFor(MOBILE_QUERY).matches) return UNLIMITED_NAV_SLOTS

  // Ordered widest first and the last step has no minimum, so the find always
  // lands on something.
  const step = NAV_SLOT_STEPS.find((candidate) => listFor(stepQuery(candidate.minWidth)).matches)
  return step?.slots ?? NAV_SLOT_STEPS[NAV_SLOT_STEPS.length - 1].slots
}

export const useNavSlots = (): number =>
  useSyncExternalStore(subscribe, currentSlots, () => UNLIMITED_NAV_SLOTS)
