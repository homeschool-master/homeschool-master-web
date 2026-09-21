import { useState } from 'react'
import Button from '../shared/Button'
import { GRADES_CONTENT, LETTER_SCALE } from '../../constants/grades'
import {
  fillTemplate,
  formatDecimal,
  formatPercentage,
  letterScore,
  toNumber,
} from '../../utils/grades'
import type { ScoreChange } from '../../store/assignmentsSlice'
import type { Assignment, AssignmentGrade, Student } from '../../types'

const { score } = GRADES_CONTENT

/** What a box holds while it is being typed in: always a string, blank allowed. */
type Entries = Record<string, string>

const initialEntries = (grades: AssignmentGrade[]): Entries =>
  Object.fromEntries(grades.map((grade) => [grade.id, formatDecimal(grade.pointsEarned)]))

/** Blank for a mark typed as a number, which is most of them. */
const initialLetters = (grades: AssignmentGrade[]): Entries =>
  Object.fromEntries(grades.map((grade) => [grade.id, grade.enteredLetter ?? '']))

/** Blank is unmarked, which is a value rather than a missing one. */
const entryValue = (raw: string): number | null => (raw.trim() === '' ? null : Number(raw))

const isValidEntry = (raw: string): boolean => {
  const value = entryValue(raw)
  return value === null || (Number.isFinite(value) && value >= 0)
}

interface ScorePanelProps {
  assignment: Assignment
  students: Student[]
  subjectName: string
  saving: boolean
  onSave: (changes: ScoreChange[]) => Promise<boolean>
  onCancel: () => void
}

/**
 * Marking, reached from the assignment row rather than from the assignment
 * form. Two reasons it is its own panel: the form is already tall without a
 * score box per student, and marking is the job a teacher comes back to do
 * over and over on work whose title and due date are already settled.
 *
 * Every student on the assignment is listed at once, because a stack of work
 * is marked in one sitting. Only the boxes that actually changed are sent, so
 * opening the panel to mark one student does not rewrite the others and move
 * their gradedAt.
 */
const ScorePanel = ({
  assignment,
  students,
  subjectName,
  saving,
  onSave,
  onCancel,
}: ScorePanelProps) => {
  const [entries, setEntries] = useState<Entries>(() => initialEntries(assignment.grades))
  const [letters, setLetters] = useState<Entries>(() => initialLetters(assignment.grades))

  /**
   * Picking a letter fills the points box with what that letter is worth here
   * and records that this is how the mark was given. Typing in the box instead
   * clears the letter, because the number is no longer the one the letter
   * stands for. Both boxes are on every row rather than behind a mode switch,
   * so a row marked as a number never has to pretend it is unmarked to sit in
   * a letter view.
   */
  const chooseLetter = (gradeId: string, letter: string) => {
    setLetters((current) => ({ ...current, [gradeId]: letter }))
    if (letter === '') return

    const points = letterScore(letter, assignment.pointsPossible)
    setEntries((current) => ({ ...current, [gradeId]: points === null ? '' : String(points) }))
  }

  const typePoints = (gradeId: string, raw: string) => {
    setEntries((current) => ({ ...current, [gradeId]: raw }))
    setLetters((current) => ({ ...current, [gradeId]: '' }))
  }

  const possible = toNumber(assignment.pointsPossible) ?? 0

  // Roster order, so the panel lists students the same way every other part of
  // the app does. Anyone no longer on the roster falls to the end rather than
  // disappearing: their mark is still real.
  const ordered = [...assignment.grades].sort((first, second) => {
    const firstIndex = students.findIndex((student) => student.id === first.studentId)
    const secondIndex = students.findIndex((student) => student.id === second.studentId)

    return (firstIndex === -1 ? students.length : firstIndex) -
      (secondIndex === -1 ? students.length : secondIndex)
  })

  const nameFor = (grade: AssignmentGrade): string => {
    const student = students.find((candidate) => candidate.id === grade.studentId)
    return student ? `${student.firstName} ${student.lastName}` : score.unknownStudent
  }

  /**
   * Numeric comparison, not string: a box showing 18 against a stored "18.0"
   * has not been edited, and sending it would move the graded timestamp on
   * work nobody touched.
   */
  const changes: ScoreChange[] = ordered
    .filter((grade) => isValidEntry(entries[grade.id] ?? ''))
    .map((grade) => ({
      gradeId: grade.id,
      pointsEarned: entryValue(entries[grade.id] ?? ''),
      enteredLetter: (letters[grade.id] ?? '') || null,
    }))
    .filter((change) => {
      const grade = assignment.grades.find((candidate) => candidate.id === change.gradeId)
      // A row counts as changed if either the number or the letter moved: a
      // mark switched from 95 typed to an A entered is the same score and a
      // different record of how it was given.
      return (
        toNumber(grade?.pointsEarned ?? null) !== change.pointsEarned ||
        (grade?.enteredLetter ?? null) !== change.enteredLetter
      )
    })

  const anyInvalid = ordered.some((grade) => !isValidEntry(entries[grade.id] ?? ''))
  const canSave = !saving && !anyInvalid && changes.length > 0

  const submit = async (formEvent: React.FormEvent) => {
    formEvent.preventDefault()
    const saved = await onSave(changes)
    if (saved) onCancel()
  }

  return (
    <form className='score-panel' onSubmit={submit}>
      <p className='score-panel__title'>{fillTemplate(score.heading, { title: assignment.title })}</p>
      <p className='score-panel__subject'>
        {subjectName} : {fillTemplate(score.outOf, { points: formatDecimal(assignment.pointsPossible) })}
      </p>

      {/* The blank against zero rule, stated where the marks are typed: it is
          the one thing about this screen that is easy to get wrong, and it
          changes what the average means. */}
      <p className='score-panel__hint'>{score.hint}</p>

      {/* Out in the open rather than behind a disclosure: a teacher typing a
          letter has to be able to see that it is becoming a number, and which
          number, without going looking for it. */}
      <div className='score-panel__key'>
        <p className='score-panel__key-heading'>{score.keyHeading}</p>
        <ul className='score-panel__key-list'>
          {LETTER_SCALE.map((entry) => (
            <li key={entry.letter} className='score-panel__key-item'>
              {fillTemplate(score.letterWorth, {
                letter: entry.letter,
                percentage: String(entry.percentage),
              })}
            </li>
          ))}
        </ul>
        <p className='score-panel__key-note'>{score.keyNote}</p>
      </div>

      {assignment.grades.length === 0 && <p className='score-panel__status'>{score.noStudents}</p>}

      {ordered.length > 0 && (
        <ul className='score-panel__list'>
          {ordered.map((grade) => {
            const raw = entries[grade.id] ?? ''
            const valid = isValidEntry(raw)
            const value = entryValue(raw)
            const percent =
              valid && value !== null && possible > 0
                ? formatPercentage(String((value / possible) * 100))
                : null

            return (
              <li key={grade.id} className='score-row'>
                <label className='score-row__name' htmlFor={`score-${grade.id}`}>
                  {nameFor(grade)}
                </label>

                <span className='score-row__entry'>
                  <input
                    id={`score-${grade.id}`}
                    className={`score-row__input${valid ? '' : ' score-row__input--error'}`}
                    type='number'
                    min='0'
                    step='any'
                    inputMode='decimal'
                    value={raw}
                    aria-label={fillTemplate(score.inputLabel, { name: nameFor(grade) })}
                    onChange={(changeEvent) => typePoints(grade.id, changeEvent.target.value)}
                  />
                  <span className='score-row__of'>
                    / {formatDecimal(assignment.pointsPossible)}
                  </span>

                  <select
                    className='score-row__letter'
                    value={letters[grade.id] ?? ''}
                    aria-label={fillTemplate(score.letterLabel, { name: nameFor(grade) })}
                    onChange={(changeEvent) => chooseLetter(grade.id, changeEvent.target.value)}
                  >
                    <option value=''>{score.byPercentage}</option>
                    {LETTER_SCALE.map((entry) => (
                      <option key={entry.letter} value={entry.letter}>
                        {entry.letter}
                      </option>
                    ))}
                  </select>
                </span>

                {/* An empty box reads as "Not marked" in words rather than as
                    blank space, so it cannot be mistaken for a zero. */}
                <span
                  className={`score-row__result${value === null ? ' score-row__result--unmarked' : ''}`}
                >
                  {value === null ? score.notMarked : (percent ?? '')}
                  {value !== null && possible > 0 && value > possible && (
                    <span className='score-row__extra'>{score.over}</span>
                  )}
                  {/* Says the mark came from a letter, so reopening it shows
                      what she chose rather than only what it became. */}
                  {(letters[grade.id] ?? '') !== '' && (
                    <span className='score-row__letter-said'>
                      {fillTemplate(score.enteredAsLetter, { letter: letters[grade.id] ?? '' })}
                    </span>
                  )}
                </span>
              </li>
            )
          })}
        </ul>
      )}

      <div className='score-panel__actions'>
        <button
          type='button'
          className='score-panel__cancel'
          onClick={onCancel}
          disabled={saving}
        >
          {score.cancel}
        </button>
        <Button type='submit' color='cream' disabled={!canSave}>
          {saving ? score.saving : score.save}
        </Button>
        {!saving && changes.length === 0 && !anyInvalid && (
          <span className='score-panel__unchanged'>{score.unchanged}</span>
        )}
      </div>
    </form>
  )
}

export default ScorePanel
