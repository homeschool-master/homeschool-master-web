import { LETTER_SCALE } from '../../constants/grades'
import { REPORT_CARDS_CONTENT } from '../../constants/reportCards'
import { fillTemplate, formatDecimal, formatPercentage } from '../../utils/grades'
import type { ReportCardEntryInput, ReportCardSubject } from '../../types'

const { card: cardContent } = REPORT_CARDS_CONTENT

interface ReportCardSubjectLineProps {
  subject: ReportCardSubject
  /** Null once the card is issued: an issued card is read, never written. */
  onChange: ((entry: ReportCardEntryInput) => void) | null
}

/**
 * One subject on the card: what the app calculated, what the teacher issued
 * instead if she overrode it, and her comments.
 *
 * An override never replaces the calculated grade on screen, it sits beside
 * it. The whole reason to allow one is that a teacher weighs something the
 * numbers do not show, and a reader who cannot see what she departed from
 * cannot tell that she departed at all.
 */
const ReportCardSubjectLine = ({ subject, onChange }: ReportCardSubjectLineProps) => {
  const editable = onChange !== null

  const change = (values: Partial<ReportCardEntryInput>) => {
    onChange?.({
      subjectId: subject.subjectId,
      subjectName: subject.subjectName,
      overrideLetter: subject.overrideLetter,
      overrideReason: subject.overrideReason,
      comments: subject.comments,
      ...values,
    })
  }

  return (
    <li className={`report-card-subject${subject.overridden ? ' report-card-subject--overridden' : ''}`}>
      <div className='report-card-subject__head'>
        <span className='report-card-subject__name'>{subject.subjectName}</span>

        <span className='report-card-subject__grade'>
          {subject.effectiveLetter ? (
            <>
              <span className='report-card-subject__letter'>{subject.effectiveLetter}</span>
              {subject.percentage !== null && !subject.overridden && (
                <span className='report-card-subject__percent'>
                  {formatPercentage(subject.percentage)}
                </span>
              )}
            </>
          ) : (
            <span className='report-card-subject__unmarked'>{cardContent.notMarked}</span>
          )}
        </span>
      </div>

      {/* What the override replaced, said plainly on the card rather than only
          in the edit form: the printed card has to carry it too. */}
      {subject.overridden && (
        <p className='report-card-subject__was'>
          <span className='report-card-badge report-card-badge--override'>
            {cardContent.overriddenBadge}
          </span>
          {fillTemplate(cardContent.calculatedWas, {
            letter: subject.letter ?? cardContent.notMarked,
          })}
          {subject.percentage !== null && ` (${formatPercentage(subject.percentage) ?? ''})`}
          {subject.overrideReason && (
            <span className='report-card-subject__reason'>{subject.overrideReason}</span>
          )}
        </p>
      )}

      <p className='report-card-subject__counts'>
        {subject.gradedCount !== null &&
          fillTemplate(cardContent.counts, {
            graded: String(subject.gradedCount),
            assigned: String(subject.assignedCount ?? 0),
          })}
        {subject.pointsEarned !== null && (
          <span className='report-card-subject__points'>
            {fillTemplate(cardContent.points, {
              earned: formatDecimal(subject.pointsEarned),
              possible: formatDecimal(subject.pointsPossible),
            })}
          </span>
        )}
      </p>

      {editable ? (
        <div className='report-card-subject__fields'>
          <label className='report-card-subject__field' htmlFor={`override-${subject.subjectId}`}>
            <span className='report-card-subject__label'>{cardContent.overrideLabel}</span>
            <select
              id={`override-${subject.subjectId}`}
              className='report-card-subject__select'
              value={subject.overrideLetter ?? ''}
              onChange={(changeEvent) =>
                change({ overrideLetter: changeEvent.target.value || null })
              }
            >
              <option value=''>{cardContent.overrideNone}</option>
              {LETTER_SCALE.map((entry) => (
                <option key={entry.letter} value={entry.letter}>
                  {entry.letter}
                </option>
              ))}
            </select>
          </label>

          {subject.overrideLetter && (
            <label
              className='report-card-subject__field'
              htmlFor={`reason-${subject.subjectId}`}
            >
              <span className='report-card-subject__label'>
                {cardContent.overrideReasonLabel}
              </span>
              <input
                id={`reason-${subject.subjectId}`}
                type='text'
                className='report-card-subject__input'
                placeholder={cardContent.overrideReasonPlaceholder}
                defaultValue={subject.overrideReason ?? ''}
                onBlur={(blurEvent) => change({ overrideReason: blurEvent.target.value || null })}
              />
            </label>
          )}

          <label className='report-card-subject__field' htmlFor={`comments-${subject.subjectId}`}>
            <span className='report-card-subject__label'>{cardContent.commentsLabel}</span>
            <textarea
              id={`comments-${subject.subjectId}`}
              rows={2}
              className='report-card-subject__input'
              placeholder={cardContent.commentsPlaceholder}
              defaultValue={subject.comments ?? ''}
              onBlur={(blurEvent) => change({ comments: blurEvent.target.value || null })}
            />
          </label>
        </div>
      ) : (
        subject.comments && <p className='report-card-subject__comments'>{subject.comments}</p>
      )}
    </li>
  )
}

export default ReportCardSubjectLine
