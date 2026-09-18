import { Link } from 'react-router-dom'
import { DASHBOARD_CONTENT } from '../../constants/dashboard'

const { todaysItems } = DASHBOARD_CONTENT

interface TodaysItemsProps {
  /** Null while the events request is still in flight. */
  upcomingCount: number | null
  eventsHref: string
}

/**
 * Three count cards. Only the first has a backend: the other two render in the
 * same shape, with a "Soon" chip where the number would be, so they read as not
 * built yet rather than as a count that failed to load. Nothing invents a
 * number for them.
 */
const TodaysItems = ({ upcomingCount, eventsHref }: TodaysItemsProps) => (
  <section className='todays-items'>
    <div className='todays-items__inner'>
      <h2 className='todays-items__heading'>{todaysItems.heading}</h2>

      <ul className='todays-items__cards'>
        <li className='todays-items__card'>
          <Link to={eventsHref} className='todays-items__link'>
            <span className='todays-items__count'>{upcomingCount ?? ''}</span>
            <span className='todays-items__label'>{todaysItems.upcomingEvents}</span>
          </Link>
        </li>

        {[todaysItems.tasksToComplete, todaysItems.assignmentsToGrade].map((label) => (
          <li
            key={label}
            className='todays-items__card todays-items__card--disabled'
            aria-disabled='true'
            title={todaysItems.comingSoonHint}
          >
            <span className='todays-items__count todays-items__count--soon'>
              {todaysItems.comingSoonCount}
            </span>
            <span className='todays-items__label'>
              {label}
              <span className='sr-only'> {todaysItems.unavailableNote}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  </section>
)

export default TodaysItems
