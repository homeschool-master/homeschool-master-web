import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useSearchParams } from 'react-router-dom'
import { APP_NAV_CONTENT } from '../../constants/appNav'
import type { AppNavItem, AppNavKey } from '../../constants/appNav'
import { useNavSlots } from '../../hooks/useNavSlots'
import { activeNavKey, splitNavItems } from '../../utils/appNav'
import { readProfile, withProfile } from '../../utils/profile'

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
const SettingsIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <circle cx='12' cy='12' r='3.25' />
    <path d='M19.4 15a1.6 1.6 0 0 0 .32 1.77l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.6 1.6 0 0 0-1.77-.32 1.6 1.6 0 0 0-1 1.46V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1.05-1.46 1.6 1.6 0 0 0-1.77.32l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.6 1.6 0 0 0 .32-1.77 1.6 1.6 0 0 0-1.46-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.46-1.05 1.6 1.6 0 0 0-.32-1.77l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.6 1.6 0 0 0 1.77.32H9a1.6 1.6 0 0 0 1-1.46V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.46 1.6 1.6 0 0 0 1.77-.32l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.6 1.6 0 0 0-.32 1.77V9a1.6 1.6 0 0 0 1.46 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.46 1z' />
  </svg>
)
const GradesIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <circle cx='12' cy='9' r='5' /><path d='M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5' />
  </svg>
)
// Three dots rather than a chevron: a chevron says "open downward", which is
// also what the strip's own rows look like they might do.
const MoreIcon = () => (
  <svg viewBox='0 0 24 24' fill='currentColor' stroke='none'>
    <circle cx='5' cy='12' r='2' /><circle cx='12' cy='12' r='2' /><circle cx='19' cy='12' r='2' />
  </svg>
)

const ICONS: Record<AppNavKey, () => React.ReactElement> = {
  dashboard: DashboardIcon,
  settings: SettingsIcon,
  calendar: CalendarIcon,
  tasks: TasksIcon,
  grades: GradesIcon,
}

/** Only one More control is ever on the page, so a fixed id is safe. */
const MENU_ID = 'app-nav-more-menu'

/**
 * Sections of the app itself, beside every authenticated page. The profile
 * settings nav stays nested inside its own page: this one sits outside it.
 *
 * Desktop is a column with room for everything. Mobile is a strip, and a strip
 * runs out of room: sections past what fits move into a More control, in the
 * order their overflowRank sets, and the section being viewed never moves.
 */
const AppSidebar = () => {
  // The profile lives in the query string, so moving between the two pages that
  // read it has to carry it: a bare /calendar link would silently reset it to
  // the default. The calendar's own student override is deliberately not
  // carried, which is what makes it last only for the visit.
  const [searchParams] = useSearchParams()
  const profile = readProfile(searchParams)

  const { pathname } = useLocation()
  const slots = useNavSlots()

  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Crossing a threshold rebuilds what is behind More, so an open menu would be
  // showing a list that changed underneath the reader. Adjusted during render
  // rather than in an effect: the menu closes in the same paint that resizes
  // it, instead of being briefly open and wrong.
  const [slotsWhenOpened, setSlotsWhenOpened] = useState(slots)
  if (slotsWhenOpened !== slots) {
    setSlotsWhenOpened(slots)
    setOpen(false)
  }

  const activeKey = activeNavKey(APP_NAV_CONTENT.items, pathname)
  const { strip, menu } = splitNavItems(APP_NAV_CONTENT.items, slots, activeKey)

  const close = () => setOpen(false)

  // Escape closes and hands focus back, so a keyboard reader is returned to the
  // control they opened rather than to the top of the document.
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      setOpen(false)
      toggleRef.current?.focus()
    }

    // pointerdown rather than click: a click that starts inside the menu and
    // ends outside it is not someone dismissing the menu.
    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) return
      setOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('pointerdown', handlePointerDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [open])

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

  const renderItem = (item: AppNavItem) =>
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
        to={item.carriesProfile ? withProfile(item.to, profile) : item.to}
        className={({ isActive }) => `app-nav__item ${isActive ? 'app-nav__item--active' : ''}`}
        onClick={close}
      >
        {renderRow(item)}
      </NavLink>
    )

  return (
    <nav className='app-nav' aria-label={APP_NAV_CONTENT.ariaLabel}>
      {strip.map(renderItem)}

      {/* Only rendered once something has actually moved, so the strip does not
          spend a slot on a control with nothing behind it. The section being
          viewed is never in here, which is what lets this be a plain
          disclosure: nothing a reader needs in order to know where they are is
          behind the toggle. */}
      {menu.length > 0 && (
        <div className='app-nav__more' ref={containerRef}>
          <button
            type='button'
            ref={toggleRef}
            className='app-nav__item app-nav__more-toggle'
            aria-expanded={open}
            aria-controls={MENU_ID}
            aria-label={APP_NAV_CONTENT.moreAriaLabel}
            onClick={() => setOpen((current) => !current)}
          >
            <span className='app-nav__icon'>
              <MoreIcon />
            </span>
            <span className='app-nav__label'>{APP_NAV_CONTENT.more}</span>
          </button>

          {/* hidden rather than unmounted, so aria-controls always points at a
              real element: the attribute also takes the rows out of the tab
              order while the menu is shut. */}
          <div
            id={MENU_ID}
            className='app-nav__menu'
            hidden={!open}
            aria-label={APP_NAV_CONTENT.moreMenuLabel}
          >
            {menu.map(renderItem)}
          </div>
        </div>
      )}
    </nav>
  )
}

export default AppSidebar
