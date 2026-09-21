import { NavLink } from 'react-router-dom'
import { GRADES_CONTENT } from '../../constants/grades'
import { REPORT_CARDS_CONTENT } from '../../constants/reportCards'

const LINKS = [
  { to: '/grades', label: GRADES_CONTENT.page.heading, end: true },
  { to: '/grades/report-cards', label: REPORT_CARDS_CONTENT.heading, end: false },
]

/**
 * The two halves of Grades: the live gradebook, and the cards saved out of it.
 *
 * Real routes rather than a toggle in the query string. Both are places a
 * teacher links to and comes back to, and a report card in particular is
 * something she may want to send someone, which a param on a shared page
 * cannot be.
 */
const GradesSectionNav = () => (
  <nav className='grades-sections' aria-label={GRADES_CONTENT.page.heading}>
    {LINKS.map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        end={link.end}
        className={({ isActive }) =>
          `grades-sections__link${isActive ? ' grades-sections__link--active' : ''}`
        }
      >
        {link.label}
      </NavLink>
    ))}
  </nav>
)

export default GradesSectionNav
