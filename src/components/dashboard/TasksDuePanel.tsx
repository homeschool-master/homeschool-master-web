import { DASHBOARD_CONTENT } from '../../constants/dashboard'

const { tasks } = DASHBOARD_CONTENT

/**
 * The mockup's second panel, with nothing behind it. It keeps the shape so the
 * dashboard reads as designed, but renders no task rows and no controls that
 * do anything: inventing three checkboxes would look like real work that had
 * gone missing. Same treatment as the disabled sections in the app nav.
 */
const TasksDuePanel = () => (
  <section className='panel-card panel-card--disabled' aria-disabled='true'>
    <header className='panel-card__header'>
      <span className='panel-card__icon' aria-hidden='true'>
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
          <path d='M10.3 4.3 2.6 17.6A1.5 1.5 0 0 0 3.9 20h16.2a1.5 1.5 0 0 0 1.3-2.4L13.7 4.3a1.9 1.9 0 0 0-3.4 0z' />
          <path d='M12 9v4' /><path d='M12 16.5h.01' />
        </svg>
      </span>

      <h2 className='panel-card__title'>{tasks.heading}</h2>

      <span className='panel-card__badge'>{tasks.comingSoonBadge}</span>
    </header>

    <div className='panel-card__body'>
      <p className='panel-card__status'>{tasks.comingSoon}</p>
    </div>
  </section>
)

export default TasksDuePanel
