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
 * per gap) / slots, and a slot narrower than the widest label showing in it
 * truncates a real word. "Assignments" is 74px at the strip's 0.6875rem, which
 * is wider than "Dashboard" at 63px: adding that section moved the five slot
 * threshold up from half of $bp-tablet to five eighths of it, because five
 * slots at 384px gave 67px and "Assignments" does not fit in that.
 *
 * Each band's narrowest point, against the widest label that can appear in it:
 *
 *   4 slots at 320px: 69px, widest visible "Dashboard" at 63px
 *   5 slots at 480px: 87px, widest visible "Assignments" at 74px
 *   6 slots at 512px: 77px    7 slots at 576px: 75px
 *
 * The one case left is "Assignments" being the active section below about
 * 338px, where it is held in the strip by that rule and ellipsises. 320px is
 * the only common width that reaches, and a truncated word there beats
 * dropping a slot for every phone. Ordered widest first, and the last step has
 * no minimum so there is always an answer.
 */
export const NAV_SLOT_STEPS: { minWidth: number; slots: number }[] = [
  { minWidth: (TABLET_MIN_WIDTH * 3) / 4, slots: 7 },
  { minWidth: (TABLET_MIN_WIDTH * 2) / 3, slots: 6 },
  { minWidth: (TABLET_MIN_WIDTH * 5) / 8, slots: 5 },
  { minWidth: 0, slots: 4 },
]

/**
 * The desktop sidebar is a column with room for every section, so it has no
 * slot limit at all and nothing ever moves into More.
 */
export const UNLIMITED_NAV_SLOTS = Number.POSITIVE_INFINITY
