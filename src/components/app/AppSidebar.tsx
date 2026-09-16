import { NavLink } from 'react-router-dom'
import { APP_NAV_CONTENT } from '../../constants/appNav'
import type { AppNavItem, AppNavKey } from '../../constants/appNav'

// Same icon convention as the settings nav: inline 24 viewBox strokes that take
// their colour from the row, sized by the icon slot rather than by the svg.
const DashboardIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <rect x='3' y='3' width='7' height='9' rx='1.5' /><rect x='14' y='3' width='7' height='5' rx='1.5' />
    <rect x='14' y='12' width='7' height='9' rx='1.5' /><rect x='3' y='16' width='7' height='5' rx='1.5' />
  </svg>
)
const CalendarIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <rect x='3' y='5' width='18' height='16' rx='2' /><path d='M3 10h18' />
    <path d='M8 3v4M16 3v4' />
  </svg>
)
const TasksIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <path d='M9 6h11M9 12h11M9 18h11' /><path d='M4 6l1.5 1.5L8 5' /><path d='M4 12l1.5 1.5L8 11' /><path d='M4 18l1.5 1.5L8 17' />
  </svg>
)
const GradesIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <circle cx='12' cy='9' r='5' /><path d='M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5' />
  </svg>
)

const ICONS: Record<AppNavKey, () => React.ReactElement> = {
  dashboard: DashboardIcon,
  calendar: CalendarIcon,
  tasks: TasksIcon,
  grades: GradesIcon,
}

/**
 * Sections of the app itself, beside every authenticated page. The profile
 * settings nav stays nested inside its own page: this one sits outside it.
 */
const AppSidebar = () => {
  const renderRow = (item: AppNavItem) => {
    const Icon = ICONS[item.key]

    return (
      <>
        <span className='app-nav__icon'>
          <Icon />
        </span>
        <span className='app-nav__label'>{item.label}</span>
      </>
    )
  }

  return (
    <nav className='app-nav' aria-label={APP_NAV_CONTENT.ariaLabel}>
      {APP_NAV_CONTENT.items.map((item) =>
        // A placeholder is a span rather than a link or a button: nothing to
        // navigate to, and nothing for the tab order to land on.
        item.to === null ? (
          <span
            key={item.key}
            className='app-nav__item app-nav__item--disabled'
            aria-disabled='true'
            title={APP_NAV_CONTENT.comingSoonHint}
          >
            {renderRow(item)}
            <span className='app-nav__badge'>{APP_NAV_CONTENT.comingSoonBadge}</span>
          </span>
        ) : (
          <NavLink
            key={item.key}
            to={item.to}
            className={({ isActive }) =>
              `app-nav__item ${isActive ? 'app-nav__item--active' : ''}`
            }
          >
            {renderRow(item)}
          </NavLink>
        )
      )}
    </nav>
  )
}

export default AppSidebar
