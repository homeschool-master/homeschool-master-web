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
}: AssignmentRowProps) => {
  const total = assignment.grades.length
  const marked = markedCount(assignment)
  const chip = weightChip(assignment.weight)
  const complete = total > 0 && marked === total

  return (
    <li className={`assignment-row${complete ? ' assignment-row--complete' : ''}`}>
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
          onClick={() => onRemove(assignment)}
        >
          {GRADES_CONTENT.removeAction}
        </button>
      </span>
    </li>
  )
}

export default AssignmentRow
