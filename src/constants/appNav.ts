export type AppNavKey = 'dashboard' | 'settings' | 'calendar' | 'tasks' | 'grades'

export interface AppNavItem {
  key: AppNavKey
  label: string
  /** Null marks a section that has no page yet: it renders, but is not a link. */
  to: string | null
  /**
   * Whether the row carries the current profile onward. The dashboard, the
   * calendar and the tasks page all read the same profile, so moving between
   * them keeps it: settings has nothing to do with it and stays a plain link.
   */
  carriesProfile?: boolean
  /**
   * The order sections move into More as the strip runs out of slots: 1 goes
   * first. Required rather than optional, so a new section cannot be added
   * without someone deciding where it sits in that queue.
   *
   * Settings leads because it is the one section nobody visits during a school
   * day, then Grades, which is read at the end of a term rather than daily.
   * The three that are open every morning are last and in practice never move.
   */
  overflowRank: number
}

export const APP_NAV_CONTENT = {
  /** Names the landmark, since the marketing navbar is also on the page. */
  ariaLabel: 'App sections',
  comingSoonBadge: 'Soon',
  comingSoonHint: 'Coming soon',
  /**
   * The strip's overflow control. "More" is what is drawn, and the longer
   * accessible name says more of what it opens while still starting with the
   * visible word, so speaking the label still hits the button.
   */
  more: 'More',
  moreAriaLabel: 'More sections',
  /** Names the popover for screen readers, since its trigger just says More. */
  moreMenuLabel: 'More app sections',
  items: [
    { key: 'dashboard', label: 'Dashboard', to: '/dashboard', carriesProfile: true, overflowRank: 5 },
    { key: 'settings', label: 'Settings', to: '/settings', overflowRank: 1 },
    { key: 'calendar', label: 'Calendar', to: '/calendar', carriesProfile: true, overflowRank: 4 },
    { key: 'tasks', label: 'Tasks', to: '/tasks', carriesProfile: true, overflowRank: 3 },
    { key: 'grades', label: 'Grades', to: '/grades', overflowRank: 2 },
  ] as AppNavItem[],
}
