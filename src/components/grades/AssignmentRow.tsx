import { GRADES_CONTENT } from '../../constants/grades'
import { fillTemplate, formatDecimal, markedCount, weightChip } from '../../utils/grades'
import { formatDueDate } from '../../utils/tasks'
import type { Assignment, Subject } from '../../types'

const { row } = GRADES_CONTENT

interface AssignmentRowProps {
  assignment: Assignment
  /** Null when the subject has since been removed from the teacher's list. */
  subject: Subject | null
  onScore: (assignment: Assignment) => void
  onEdit: (assignment: Assignment) => void
  onRemove: (assignment: Assignment) => void
  onDocuments: (assignment: Assignment) => void
  /** How many documents are filed against this row, so it can say so. */
  documentCount?: number
  /**
   * True when this is the row a link from the gradebook asked for. The row
   * marks itself and scrolls itself into view, so arriving from a mark lands
   * on the work rather than at the top of a list of twenty.
   */
  highlighted?: boolean
}

/**
 * One piece of work. The figure worth having at a glance is how far through
 * marking it is, so that sits on the row itself and the marks themselves live
 * one click away in the score panel.
 */
const AssignmentRow = ({
  assignment,
  subject,
  onScore,
  onEdit,
  onRemove,
  onDocuments,
  documentCount = 0,
  highlighted = false,
}: AssignmentRowProps) => {
  const total = assignment.grades.length
  const marked = markedCount(assignment)
  const chip = weightChip(assignment.weight)
  const complete = total > 0 && marked === total

  /**
   * Brings the linked row into view once it is in the document. Measured and
   * scrolled synchronously in the ref, the same way the panels on the tasks
   * and subjects pages do it: an animation frame never runs while the document
   * is hidden and would leave the row quietly off screen.
   *
   * The test is whether the whole row is on screen, not just its top edge.
   * Those panels open where the button that opened them was, so moving a panel
   * already under the eye would be the jolt rather than the fix. This arrives
   * from another page with nothing to preserve, and a row whose top is barely
   * above the fold is not somewhere a teacher has landed.
   */
  const reveal = (node: HTMLLIElement | null) => {
    if (node === null || !highlighted) return

    const box = node.getBoundingClientRect()
    if (box.top >= 0 && box.bottom <= window.innerHeight) return

    node.scrollIntoView({ block: 'center' })
  }

  return (
    <li
      ref={reveal}
      className={`assignment-row${complete ? ' assignment-row--complete' : ''}${
        highlighted ? ' assignment-row--linked' : ''
      }`}
    >
      <span className='assignment-row__head'>
        <span
          className='assignment-row__dot'
          style={subject?.color ? { backgroundColor: subject.color } : undefined}
          aria-hidden='true'
        />
        <span className='assignment-row__title'>{assignment.title}</span>
      </span>

      <span className='assignment-row__meta'>
        <span className='assignment-row__subject'>{subject?.name ?? row.unknownSubject}</span>
        {/* What kind of work it is, beside the subject: the two together are
            how a row is recognised at a glance. */}
        {assignment.assignmentTypeName && (
          <span className='assignment-row__type'>{assignment.assignmentTypeName}</span>
        )}
        <span className='assignment-row__due'>
          {assignment.dueDate ? formatDueDate(assignment.dueDate) : row.noDueDate}
        </span>
        <span className='assignment-row__points'>
          {fillTemplate(row.outOf, { points: formatDecimal(assignment.pointsPossible) })}
        </span>
        {/* Only when it is not the ordinary 1: a chip on every row saying
            "counts once" would be noise on the case that needs no explaining. */}
        {chip && <span className='assignment-row__weight'>{chip}</span>}
      </span>

      {assignment.description && (
        <p className='assignment-row__notes'>{assignment.description}</p>
      )}

      <span className={`assignment-row__marked${complete ? ' assignment-row__marked--done' : ''}`}>
        {total === 0
          ? row.noStudents
          : fillTemplate(row.marked, { marked: String(marked), total: String(total) })}
      </span>

      <span className='assignment-row__actions'>
        <button
          type='button'
          className='assignment-row__action assignment-row__action--score'
          onClick={() => onScore(assignment)}
        >
          {GRADES_CONTENT.scoreAction}
        </button>
        <button
          type='button'
          className='assignment-row__action'
          onClick={() => onEdit(assignment)}
        >
          {GRADES_CONTENT.editAction}
        </button>
        <button
          type='button'
          className='assignment-row__action'
          onClick={() => onDocuments(assignment)}
        >
          {documentCount > 0
            ? `${GRADES_CONTENT.documentsAction} (${documentCount})`
            : GRADES_CONTENT.documentsAction}
        </button>
        <button
          type='button'
          className='assignment-row__action'
          onClick={() => onRemove(assignment)}
        >
          {GRADES_CONTENT.removeAction}
        </button>
      </span>
    </li>
  )
}

export default AssignmentRow
