import type { AppNavItem, AppNavKey } from '../constants/appNav'

/**
 * Which section the current URL is in, by the same rule NavLink uses for a
 * link without `end`: the path itself, or anything below it. So /calendar/new
 * is still the calendar.
 */
export const activeNavKey = (items: AppNavItem[], pathname: string): AppNavKey | null => {
  const match = items.find(
    (item) => item.to !== null && (pathname === item.to || pathname.startsWith(`${item.to}/`))
  )

  return match?.key ?? null
}

export interface NavSplit {
  /** Shown in the strip, in nav order. */
  strip: AppNavItem[]
  /** Behind the More control, in nav order. Empty when everything fits. */
  menu: AppNavItem[]
}

/**
 * Splits the sections into the ones the strip has room for and the ones that
 * go behind More.
 *
 * Two rules do all the work. The More control takes a slot of its own, so the
 * moment anything overflows the strip holds one fewer section than it has
 * slots: four sections plus More where five sections used to sit. And the
 * section you are looking at is never eligible to move, so it is always on
 * screen and More never has to show an active state or explain itself. That
 * second rule is why the menu can be a plain disclosure: nothing inside it is
 * load bearing for knowing where you are.
 *
 * Both lists come back in nav order rather than in overflow order: the queue
 * decides what moves, not how what is left is arranged, so the sections that
 * stay do not shuffle around underneath the reader as the window narrows.
 */
export const splitNavItems = (
  items: AppNavItem[],
  slots: number,
  activeKey: AppNavKey | null
): NavSplit => {
  if (items.length <= slots) return { strip: items, menu: [] }

  const kept = slots - 1
  const moving = items.length - kept

  const movable = items
    .filter((item) => item.key !== activeKey)
    .sort((first, second) => first.overflowRank - second.overflowRank)
    .slice(0, moving)

  const moved = new Set(movable.map((item) => item.key))

  return {
    strip: items.filter((item) => !moved.has(item.key)),
    menu: items.filter((item) => moved.has(item.key)),
  }
}
