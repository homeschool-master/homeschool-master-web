export type AppNavKey = 'dashboard' | 'calendar' | 'tasks' | 'grades'

export interface AppNavItem {
  key: AppNavKey
  label: string
  /** Null marks a section that has no page yet: it renders, but is not a link. */
  to: string | null
}

export const APP_NAV_CONTENT = {
  /** Names the landmark, since the marketing navbar is also on the page. */
  ariaLabel: 'App sections',
  comingSoonBadge: 'Soon',
  comingSoonHint: 'Coming soon',
  items: [
    { key: 'dashboard', label: 'Dashboard', to: '/dashboard' },
    { key: 'calendar', label: 'Calendar', to: '/calendar' },
    { key: 'tasks', label: 'Tasks', to: null },
    { key: 'grades', label: 'Grades', to: null },
  ] as AppNavItem[],
}
