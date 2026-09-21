import { GRADES_CONTENT } from '../../constants/grades'
import AssignmentsView from '../../components/grades/AssignmentsView'

/**
 * Setting work, marking it, and everything else done to an assignment.
 *
 * Its own section rather than a tab inside Grades. The two answer different
 * questions and are opened at different times: this is the working view a
 * teacher is in while a term runs, and Grades is what she reads back from it.
 * Sharing one heading meant the view toggle was the only thing saying which
 * job she was doing.
 */
const AssignmentsPage = () => (
  <div className='grades'>
    <div className='grades__inner'>
      <header className='grades__header'>
        <p className='grades__eyebrow'>{GRADES_CONTENT.assignmentsPage.eyebrow}</p>
        <h1 className='grades__heading'>{GRADES_CONTENT.assignmentsPage.heading}</h1>
        <p className='grades__subhead'>{GRADES_CONTENT.assignmentsPage.subhead}</p>
      </header>

      <AssignmentsView />
    </div>
  </div>
)

export default AssignmentsPage
