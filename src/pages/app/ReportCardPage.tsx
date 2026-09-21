import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../store'
import type { ReportCardEntryInput, ReportCardInput } from '../../types'
import {
  clearCurrentCard,
  clearSaveError,
  fetchReportCard,
  fetchReportCardVersions,
  issueReportCard,
  refreshReportCard,
  removeReportCard,
  updateReportCard,
} from '../../store/reportCardsSlice'
import { fetchStudents } from '../../store/studentsSlice'
import { REPORT_CARDS_CONTENT } from '../../constants/reportCards'
import { fillTemplate, formatPercentage } from '../../utils/grades'
import { formatDueDate } from '../../utils/tasks'
import Button from '../../components/shared/Button'
import GradesSectionNav from '../../components/grades/GradesSectionNav'
import ReportCardForm from '../../components/reportCards/ReportCardForm'
import ReportCardSubjectLine from '../../components/reportCards/ReportCardSubjectLine'

const content = REPORT_CARDS_CONTENT

type Mode = 'view' | 'edit' | 'issue' | 'remove'

/**
 * One report card, in whichever state it is in.
 *
 * A draft is editable and its grades follow current marking. An issued card is
 * read only, and editing it creates the next version rather than changing it:
 * the page follows the card that comes back, so she lands on the new version
 * with the old one still in the list beside it.
 */
const ReportCardPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { cardId } = useParams<{ cardId: string }>()

  const { current, currentLoading, currentError, versions, saving, saveError, removingId } =
    useSelector((state: RootState) => state.reportCards)
  const { items: students } = useSelector((state: RootState) => state.students)

  const [mode, setMode] = useState<Mode>('view')

  useEffect(() => {
    if (!cardId) return

    dispatch(fetchReportCard(cardId))
    dispatch(fetchReportCardVersions(cardId))
    dispatch(fetchStudents())

    return () => {
      dispatch(clearCurrentCard())
    }
  }, [dispatch, cardId])

  const goTo = (next: Mode) => {
    dispatch(clearSaveError())
    setMode(next)
  }

  /**
   * Saving an issued card returns a different card: the next version. Moving
   * the URL to it is what keeps the page honest, since the thing on screen
   * afterwards is not the one that was opened.
   */
  const followResult = (id: string) => {
    if (id !== cardId) navigate(`/grades/report-cards/${id}`, { replace: true })
  }

  const handleSave = async (values: ReportCardInput): Promise<boolean> => {
    if (!current) return false

    const result = await dispatch(updateReportCard({ id: current.id, input: values }))
    if (!updateReportCard.fulfilled.match(result)) return false

    followResult(result.payload.id)
    dispatch(fetchReportCardVersions(result.payload.id))
    return true
  }

  /** A subject line saves on its own, so a comment is kept the moment it is written. */
  const handleEntryChange = async (entry: ReportCardEntryInput) => {
    if (!current) return

    const result = await dispatch(
      updateReportCard({ id: current.id, input: { entries: [entry] } })
    )
    if (updateReportCard.fulfilled.match(result)) followResult(result.payload.id)
  }

  const handleIssue = async () => {
    if (!current) return

    const result = await dispatch(issueReportCard(current.id))
    if (issueReportCard.fulfilled.match(result)) {
      setMode('view')
      dispatch(fetchReportCardVersions(current.id))
    }
  }

  const handleRefresh = () => {
    if (current) void dispatch(refreshReportCard(current.id))
  }

  const handleRemove = async () => {
    if (!current) return

    const result = await dispatch(removeReportCard(current.id))
    if (removeReportCard.fulfilled.match(result)) navigate('/grades/report-cards')
  }

  const studentName = (): string => {
    const student = students.find((candidate) => candidate.id === current?.studentId)
    return student ? `${student.firstName} ${student.lastName}` : ''
  }

  const issuedDate = (): string =>
    current?.issuedAt ? formatDueDate(current.issuedAt.slice(0, 10)) : ''

  return (
    <div className='grades'>
      <div className='grades__inner'>
        <header className='grades__header'>
          <p className='grades__eyebrow'>{content.heading}</p>
          <h1 className='grades__heading'>{current?.title ?? content.heading}</h1>
        </header>

        <GradesSectionNav />

        <p className='report-card__back'>
          <Link to='/grades/report-cards'>{content.actions.back}</Link>
        </p>

        {currentLoading && <p className='grades__status'>{content.loading}</p>}

        {!currentLoading && currentError && (
          <p className='grades__error' role='alert'>
            {currentError}
          </p>
        )}

        {!currentLoading && current && (
          <>
            <div className='report-card__summary'>
              <span className='report-card__student'>{studentName()}</span>
              <span className='report-card__period'>
                {fillTemplate(content.periodLabel, {
                  start: formatDueDate(current.periodStart),
                  end: formatDueDate(current.periodEnd),
                })}
              </span>
              <span
                className={`report-card-badge${current.issued ? ' report-card-badge--issued' : ''}`}
              >
                {current.issued ? content.issuedBadge : content.draftBadge}
              </span>
              <span className='report-card__version'>
                {fillTemplate(content.versionLabel, { version: String(current.version) })}
              </span>
            </div>

            {/* Which of the three states this card is in, said in the open
                above everything: it is the difference between a working
                document and the thing that was handed over. */}
            <p className='report-card__state'>
              {current.issued
                ? fillTemplate(content.issuedNote, { date: issuedDate() })
                : current.captured
                  ? content.capturedNote
                  : content.draftNote}
            </p>

            {!current.latestVersion && (
              <p className='report-card__superseded' role='status'>
                {fillTemplate(content.supersededNote, { version: String(current.version) })}
              </p>
            )}

            {saveError && (
              <p className='grades__error' role='alert'>
                {saveError}
              </p>
            )}

            <div className='report-card__actions'>
              <button type='button' className='report-card__action' onClick={() => goTo('edit')}>
                {content.actions.edit}
              </button>
              {!current.issued && (
                <button
                  type='button'
                  className='report-card__action'
                  onClick={() => goTo('issue')}
                >
                  {content.actions.issue}
                </button>
              )}
              {!current.issued && current.captured && (
                <button
                  type='button'
                  className='report-card__action'
                  onClick={handleRefresh}
                  disabled={saving}
                >
                  {saving ? content.actions.refreshing : content.actions.refresh}
                </button>
              )}
              {!current.issued && (
                <button
                  type='button'
                  className='report-card__action report-card__action--danger'
                  onClick={() => goTo('remove')}
                >
                  {content.actions.remove}
                </button>
              )}
            </div>

            {mode === 'edit' && (
              <div className='grades__slot'>
                <ReportCardForm
                  card={current}
                  students={students}
                  saving={saving}
                  onSubmit={handleSave}
                  onCancel={() => setMode('view')}
                />
              </div>
            )}

            {mode === 'issue' && (
              <div className='report-card__confirm'>
                <p className='report-card-form__title'>{content.issueConfirm.heading}</p>
                <p className='report-card__confirm-body'>{content.issueConfirm.body}</p>
                <div className='report-card-form__actions'>
                  <button
                    type='button'
                    className='report-card-form__cancel'
                    onClick={() => setMode('view')}
                    disabled={saving}
                  >
                    {content.issueConfirm.cancel}
                  </button>
                  <Button color='cream' onClick={handleIssue} disabled={saving}>
                    {saving ? content.actions.issuing : content.issueConfirm.confirm}
                  </Button>
                </div>
              </div>
            )}

            {mode === 'remove' && (
              <div className='report-card__confirm'>
                <p className='report-card-form__title'>{content.removeConfirm.heading}</p>
                <p className='report-card__confirm-body'>{content.removeConfirm.body}</p>
                <div className='report-card-form__actions'>
                  <button
                    type='button'
                    className='report-card-form__cancel'
                    onClick={() => setMode('view')}
                    disabled={removingId !== null}
                  >
                    {content.removeConfirm.cancel}
                  </button>
                  <Button color='danger' onClick={handleRemove} disabled={removingId !== null}>
                    {removingId !== null
                      ? content.actions.removing
                      : content.removeConfirm.confirm}
                  </Button>
                </div>
              </div>
            )}

            {current.comments && <p className='report-card__comments'>{current.comments}</p>}

            <h2 className='report-card__section'>{content.card.subjectsHeading}</h2>

            {current.subjects && current.subjects.length > 0 ? (
              <ul className='report-card-subjects'>
                {current.subjects.map((subject) => (
                  <ReportCardSubjectLine
                    key={subject.subjectId ?? subject.subjectName}
                    subject={subject}
                    onChange={current.issued ? null : handleEntryChange}
                  />
                ))}
              </ul>
            ) : (
              <p className='grades__status'>{content.card.noSubjects}</p>
            )}

            {current.overall && (
              <div
                className={`report-card-overall${current.overall.overridden ? ' report-card-overall--overridden' : ''}`}
              >
                <span className='report-card-overall__label'>{content.card.overallHeading}</span>
                <span className='report-card-overall__grade'>
                  {current.overall.effectiveLetter ?? content.card.notMarked}
                  {current.overall.percentage !== null && !current.overall.overridden && (
                    <span className='report-card-overall__percent'>
                      {formatPercentage(current.overall.percentage)}
                    </span>
                  )}
                </span>
                {current.overall.overridden && (
                  <span className='report-card-overall__was'>
                    {fillTemplate(content.card.calculatedWas, {
                      letter: current.overall.letter ?? content.card.notMarked,
                    })}
                  </span>
                )}
              </div>
            )}

            {versions.length > 1 && (
              <section className='report-card-versions'>
                <h2 className='report-card__section'>{content.versions.heading}</h2>
                <p className='report-card-versions__note'>{content.versions.note}</p>
                <ul className='report-card-versions__list'>
                  {versions.map((version) => (
                    <li key={version.id} className='report-card-versions__item'>
                      <span>
                        {fillTemplate(content.versionLabel, {
                          version: String(version.version),
                        })}
                      </span>
                      <span
                        className={`report-card-badge${version.issued ? ' report-card-badge--issued' : ''}`}
                      >
                        {version.issued ? content.issuedBadge : content.draftBadge}
                      </span>
                      {version.id === current.id ? (
                        <span className='report-card-versions__current'>{version.title}</span>
                      ) : (
                        <Link to={`/grades/report-cards/${version.id}`}>
                          {content.actions.viewVersion}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ReportCardPage
