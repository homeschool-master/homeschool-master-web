import { Link } from 'react-router-dom'
import { GRADES_CONTENT } from '../../constants/grades'
import { fillTemplate, formatDecimal, formatPercentage, toNumber } from '../../utils/grades'
import { formatDueDate } from '../../utils/tasks'
import type { ProgressEntry } from '../../types'

const { book } = GRADES_CONTENT.progress

interface GradebookRowProps {
  entry: ProgressEntry
  /** Where the work itself is opened. Grades reads, it never scores. */
  href: string
}

/**
 * One piece of work in the gradebook: what kind it is, what it earned, and
 * what that came to.
 *
 * A list row rather than a table cell. The natural shape for this is a table,
 * and a table is exactly what cannot be read on a phone without scrolling
 * sideways: the three columns become one stack at mobile width, which a table
 * can only do by throwing away the semantics that made it a table. Every row
 * carries its own labels instead, so nothing depends on a header that has
 * scrolled out of sight.
 *
 * Four states have to read differently, and all four are real:
 *
 *   unmarked      no score at all, and out of the average until it is marked
 *   a real zero   a mark of 0 that counts, which is not the same as unmarked
 *   weight zero   marked and reported, but moving no average
 *   an ordinary mark
 */
const GradebookRow = ({ entry, href }: GradebookRowProps) => {
  const weight = toNumber(entry.weight)
  const countsNothing = entry.graded && weight === 0
  // What she chose, when she chose one. The two agree by construction, and it
  // is still her letter that goes on the page rather than the one derived back
  // out of the score.
  const letter = entry.enteredLetter ?? entry.letter

  return (
    <li className={`gradebook-row${entry.graded ? '' : ' gradebook-row--unmarked'}`}>
      <span className='gradebook-row__work'>
        <Link
          className='gradebook-row__title'
          to={href}
          aria-label={fillTemplate(book.openLabel, { title: entry.title })}
        >
          {entry.title}
        </Link>
        <span className='gradebook-row__meta'>
          {entry.assignmentTypeName && (
            <span className='gradebook-row__type'>{entry.assignmentTypeName}</span>
          )}
          <span className='gradebook-row__due'>
            {entry.dueDate ? formatDueDate(entry.dueDate) : book.noDueDate}
          </span>
        </span>
      </span>

      {/* Labelled on every row rather than by a column header: at phone width
          the columns stack, and a value under a heading three rows up is not
          labelled at all. */}
      <span className='gradebook-row__grade'>
        <span className='gradebook-row__cell-label'>{book.columnGrade}</span>
        {entry.graded ? (
          <>
            <span className='gradebook-row__letter'>{letter}</span>
            {entry.enteredLetter && (
              <span className='gradebook-row__entered'>
                {fillTemplate(book.enteredAsLetter, { letter: entry.enteredLetter })}
              </span>
            )}
          </>
        ) : (
          <span className='gradebook-row__pending'>{book.notMarked}</span>
        )}
      </span>

      <span className='gradebook-row__score'>
        <span className='gradebook-row__cell-label'>{book.columnScore}</span>
        {entry.graded ? (
          <>
            <span className='gradebook-row__percent'>{formatPercentage(entry.percentage)}</span>
            <span className='gradebook-row__points'>
              {fillTemplate(book.outOf, {
                earned: formatDecimal(entry.pointsEarned),
                possible: formatDecimal(entry.pointsPossible),
              })}
            </span>
          </>
        ) : (
          <span className='gradebook-row__points'>
            {fillTemplate(book.outOfOnly, { possible: formatDecimal(entry.pointsPossible) })}
          </span>
        )}
      </span>

      {/* The two states that would otherwise look like an ordinary row with a
          number missing. Said in words on the row, never behind anything. */}
      {!entry.graded && <span className='gradebook-row__note'>{book.notMarkedHint}</span>}
      {countsNothing && (
        <span className='gradebook-row__note gradebook-row__note--muted'>
          {book.notCountedHint}
        </span>
      )}
    </li>
  )
}

export default GradebookRow
