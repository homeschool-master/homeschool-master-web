import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../store'
import {
  clearCurrentCard,
  fetchReportCard,
  fetchReportCardVersions,
} from '../../store/reportCardsSlice'
import { fetchStudents } from '../../store/studentsSlice'
import { REPORT_CARDS_CONTENT } from '../../constants/reportCards'
import { fillTemplate, formatDecimal, formatPercentage } from '../../utils/grades'
import { formatDueDate } from '../../utils/tasks'
import { printFileName, printReportCard } from '../../utils/printing'

const { print: printContent, card: cardContent } = REPORT_CARDS_CONTENT

/** Showing the work is opt in, so the ordinary card is grades alone. */
const WORK_PARAM = 'work'

/**
 * A report card laid out for US letter paper, and the same sheet a reader gets
 * as a PDF.
 *
 * There is one layout because there is one page: the PDF is this page put
 * through the browser's own print to PDF, so the two cannot drift apart and
 * the text in the PDF is real text rather than a picture of a page.
 *
 * Nothing of the app is on it. The route sits outside the shell rather than
 * hiding the navbar at print time, because a preview still showing a site
 * header is not a preview of what comes out of the printer.
 */
const ReportCardPrintPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { cardId } = useParams<{ cardId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()

  const { current, currentLoading, currentError, versions } = useSelector(
    (state: RootState) => state.reportCards
  )
  const { items: students } = useSelector((state: RootState) => state.students)
  const teacher = useSelector((state: RootState) => state.auth.user)

  const [printing, setPrinting] = useState(false)

  // Grades alone by default: a report card reports grades, and the work behind
  // them is a portfolio, which is a different document. It is still one click
  // away for an evaluator who wants the evidence.
  const showWork = searchParams.get(WORK_PARAM) === '1'

  useEffect(() => {
    if (!cardId) return

    dispatch(fetchReportCard(cardId))
    dispatch(fetchReportCardVersions(cardId))
    dispatch(fetchStudents())

    return () => {
      dispatch(clearCurrentCard())
    }
  }, [dispatch, cardId])

  const student = students.find((candidate) => candidate.id === current?.studentId) ?? null
  const studentName = student ? `${student.firstName} ${student.lastName}` : ''

  /**
   * The document title is what the browser names a print to PDF file, so it is
   * the filename. Restored on the way out, or every other page in the tab
   * inherits it.
   */
  useEffect(() => {
    if (!current || studentName === '') return

    const previous = document.title
    document.title = printFileName(studentName, current.title, current.version)

    return () => {
      document.title = previous
    }
  }, [current, studentName])

  const handlePrint = async () => {
    setPrinting(true)
    await printReportCard()
    setPrinting(false)
  }

  const latestVersion = versions.length > 0 ? versions[versions.length - 1] : null
  const superseded = current !== null && !current.latestVersion

  if (currentLoading) {
    return <p className='print-status'>{REPORT_CARDS_CONTENT.loading}</p>
  }

  if (currentError || !current) {
    return (
      <p className='print-status' role='alert'>
        {currentError ?? REPORT_CARDS_CONTENT.errors.loadOne}
      </p>
    )
  }

  return (
    <div className={`print-page${current.issued ? '' : ' print-page--draft'}`}>
      {/* Screen only: none of this reaches the paper. It exists so the page
          has a way to be printed at all and a way back. */}
      <div className='print-toolbar'>
        <Link className='print-toolbar__back' to={`/grades/report-cards/${current.id}`}>
          {printContent.back}
        </Link>

        <label className='print-toolbar__toggle' htmlFor='print-include-work'>
          <input
            id='print-include-work'
            type='checkbox'
            checked={showWork}
            onChange={(changeEvent) => {
              setSearchParams((params) => {
                const next = new URLSearchParams(params)
                if (changeEvent.target.checked) next.set(WORK_PARAM, '1')
                else next.delete(WORK_PARAM)

                return next
              })
            }}
          />
          {printContent.includeWork}
        </label>

        <button
          type='button'
          className='print-toolbar__print'
          onClick={handlePrint}
          disabled={printing}
        >
          {printing ? printContent.preparing : printContent.print}
        </button>
        <span className='print-toolbar__hint'>{printContent.pdfHint}</span>
      </div>

      {/* A draft has to be unmistakable on paper, so it is marked twice: a
          banner that reads in the flow, and a watermark the eye catches from
          across a desk. The watermark is fixed, which is what repeats it on
          every printed page. */}
      {!current.issued && <div className='print-watermark' aria-hidden='true'>{printContent.draftWatermark}</div>}

      <article className='print-card'>
        <header className='print-card__header'>
          <p className='print-card__issuer'>
            {teacher ? `${teacher.firstName} ${teacher.lastName}` : ''}
          </p>
          <h1 className='print-card__title'>{current.title}</h1>
          <p className='print-card__student'>{studentName}</p>

          <dl className='print-card__facts'>
            <div className='print-card__fact'>
              <dt>{printContent.periodLabel}</dt>
              <dd>
                {fillTemplate(REPORT_CARDS_CONTENT.periodLabel, {
                  start: formatDueDate(current.periodStart),
                  end: formatDueDate(current.periodEnd),
                })}
              </dd>
            </div>
            <div className='print-card__fact'>
              <dt>{printContent.versionLabel}</dt>
              <dd>{String(current.version)}</dd>
            </div>
            <div className='print-card__fact'>
              <dt>{printContent.issuedLabel}</dt>
              <dd>
                {current.issuedAt
                  ? formatDueDate(current.issuedAt.slice(0, 10))
                  : printContent.notIssued}
              </dd>
            </div>
          </dl>
        </header>

        {!current.issued && <p className='print-banner print-banner--draft'>{printContent.draftBanner}</p>}

        {superseded && (
          <p className='print-banner print-banner--superseded'>
            {fillTemplate(printContent.supersededBanner, {
              version: String(current.version),
              current: String(latestVersion?.version ?? ''),
            })}
          </p>
        )}

        <section className='print-card__subjects'>
          <h2 className='print-card__section'>{cardContent.subjectsHeading}</h2>

          {current.subjects && current.subjects.length > 0 ? (
            current.subjects.map((subject) => (
              <section
                key={subject.subjectId ?? subject.subjectName}
                className='print-subject'
              >
                <div className='print-subject__line'>
                  <h3 className='print-subject__name'>{subject.subjectName}</h3>
                  <span className='print-subject__grade'>
                    {subject.effectiveLetter ?? cardContent.notMarked}
                    {subject.percentage !== null && !subject.overridden && (
                      <span className='print-subject__percent'>
                        {formatPercentage(subject.percentage)}
                      </span>
                    )}
                  </span>
                </div>

                {/* An override reads as one on paper exactly as it does on
                    screen: the grade the teacher issued, and under it the
                    grade the arithmetic produced. */}
                {subject.overridden && (
                  <p className='print-subject__override'>
                    <span className='print-subject__override-tag'>
                      {printContent.overrideTag}
                    </span>
                    {fillTemplate(cardContent.calculatedWas, {
                      letter: subject.letter ?? cardContent.notMarked,
                    })}
                    {subject.percentage !== null && ` (${formatPercentage(subject.percentage) ?? ''})`}
                    {subject.overrideReason && (
                      <span className='print-subject__reason'>{subject.overrideReason}</span>
                    )}
                  </p>
                )}

                {subject.comments && (
                  <p className='print-subject__comments'>{subject.comments}</p>
                )}

                {showWork && subject.assignments.length > 0 && (
                  <ul className='print-work'>
                    {subject.assignments.map((entry) => (
                      <li key={entry.assignmentId} className='print-work__row'>
                        <span className='print-work__title'>{entry.title}</span>
                        <span className='print-work__score'>
                          {entry.graded
                            ? `${formatDecimal(entry.pointsEarned)} / ${formatDecimal(entry.pointsPossible)}`
                            : printContent.notMarkedShort}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))
          ) : (
            <p className='print-card__empty'>{cardContent.noSubjects}</p>
          )}
        </section>

        {current.overall && (
          <section className='print-overall'>
            <span className='print-overall__label'>{cardContent.overallHeading}</span>
            <span className='print-overall__grade'>
              {current.overall.effectiveLetter ?? cardContent.notMarked}
              {current.overall.percentage !== null && !current.overall.overridden && (
                <span className='print-overall__percent'>
                  {formatPercentage(current.overall.percentage)}
                </span>
              )}
            </span>
            {current.overall.overridden && (
              <span className='print-overall__override'>
                <span className='print-subject__override-tag'>{printContent.overrideTag}</span>
                {fillTemplate(cardContent.calculatedWas, {
                  letter: current.overall.letter ?? cardContent.notMarked,
                })}
              </span>
            )}
          </section>
        )}

        {current.comments && (
          <section className='print-comments'>
            <h2 className='print-card__section'>{printContent.commentsHeading}</h2>
            <p>{current.comments}</p>
          </section>
        )}

        <footer className='print-card__footer'>
          {fillTemplate(printContent.footer, {
            student: studentName,
            version: String(current.version),
            state: current.issued ? printContent.footerIssued : printContent.footerDraft,
          })}
        </footer>
      </article>
    </div>
  )
}

export default ReportCardPrintPage
