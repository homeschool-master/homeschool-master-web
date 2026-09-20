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
}

export const APP_NAV_CONTENT = {
  /** Names the landmark, since the marketing navbar is also on the page. */
  ariaLabel: 'App sections',
  comingSoonBadge: 'Soon',
  comingSoonHint: 'Coming soon',
  items: [
    { key: 'dashboard', label: 'Dashboard', to: '/dashboard', carriesProfile: true },
    { key: 'settings', label: 'Settings', to: '/settings' },
    { key: 'calendar', label: 'Calendar', to: '/calendar', carriesProfile: true },
    { key: 'tasks', label: 'Tasks', to: '/tasks', carriesProfile: true },
    { key: 'grades', label: 'Grades', to: '/grades' },
  ] as AppNavItem[],
}
