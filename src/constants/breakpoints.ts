/**
 * The one place a layout width is written in JavaScript.
 *
 * The stylesheet's respond-to(mobile) is max-width 767px, one below $bp-tablet,
 * and everything here is derived from that same number rather than sitting
 * beside it as a second set that can drift: move $bp-tablet and every threshold
 * below moves with it in the same proportion.
 */
export const TABLET_MIN_WIDTH = 768

/** Mirrors respond-to(mobile): the width at which the nav becomes a strip. */
export const MOBILE_MAX_WIDTH = TABLET_MIN_WIDTH - 1

/**
 * How many slots the mobile nav strip has at a given width, where a slot holds
 * either one section or the More control.
 *
 * Fixed thresholds rather than measuring the rendered strip: measuring means
 * laying out, reading, then laying out again, and the first frame is wrong
 * while it happens. The numbers come from measuring once, by hand:
 *
 * A slot is (viewport - 32px of sidebar padding - 4px of panel padding - 2px
 * per gap) / slots. The widest label in the nav is "Dashboard" at 63px at the
 * strip's 0.6875rem, so a slot narrower than that truncates a real word. Each
 * band below keeps at least 67px per slot at its narrowest point:
 *
 *   4 slots at 320px: 69px measured    5 slots at 384px: 67px measured
 *   6 slots at 512px: 77px               7 slots at 576px: 75px
 *
 * The first two were read off the rendered strip; the second two are the same
 * arithmetic on a panel width that was measured, since five sections never ask
 * for six slots. All of them are roomier than the strip this replaces, where
 * 375px gave each of five items 66px. Ordered widest first, and the last step
 * has no minimum so there is always an answer.
 */
export const NAV_SLOT_STEPS: { minWidth: number; slots: number }[] = [
  { minWidth: (TABLET_MIN_WIDTH * 3) / 4, slots: 7 },
  { minWidth: (TABLET_MIN_WIDTH * 2) / 3, slots: 6 },
  { minWidth: TABLET_MIN_WIDTH / 2, slots: 5 },
  { minWidth: 0, slots: 4 },
]

/**
 * The desktop sidebar is a column with room for every section, so it has no
 * slot limit at all and nothing ever moves into More.
 */
export const UNLIMITED_NAV_SLOTS = Number.POSITIVE_INFINITY
