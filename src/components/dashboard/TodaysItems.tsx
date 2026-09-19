import { Link } from 'react-router-dom'
import { DASHBOARD_CONTENT } from '../../constants/dashboard'

const { todaysItems } = DASHBOARD_CONTENT

interface TodaysItemsProps {
  /** Null while the request behind a card is still in flight. */
  upcomingCount: number | null
  tasksCount: number | null
  eventsHref: string
  tasksHref: string
}

/**
 * Three count cards. Two are real now: events still ahead today, and open
 * tasks due today or already late. Assignments has no client yet, so it keeps
 * the "Soon" chip where the number goes rather than inventing one.
 */
const TodaysItems = ({ upcomingCount, tasksCount, eventsHref, tasksHref }: TodaysItemsProps) => (
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

        <li className='todays-items__card'>
          <Link
            to={tasksHref}
            className='todays-items__link'
            aria-label={todaysItems.tasksToCompleteLabel}
          >
            <span className='todays-items__count'>{tasksCount ?? ''}</span>
            <span className='todays-items__label'>{todaysItems.tasksToComplete}</span>
          </Link>
        </li>

        <li
          className='todays-items__card todays-items__card--disabled'
          aria-disabled='true'
          title={todaysItems.comingSoonHint}
        >
          <span className='todays-items__count todays-items__count--soon'>
            {todaysItems.comingSoonCount}
          </span>
          <span className='todays-items__label'>
            {todaysItems.assignmentsToGrade}
            <span className='sr-only'> {todaysItems.unavailableNote}</span>
          </span>
        </li>
      </ul>
    </div>
  </section>
)

export default TodaysItems
