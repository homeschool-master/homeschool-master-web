import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../store'
import type { ReportCard, ReportCardInput } from '../../types'
import {
  clearSaveError,
  createReportCard,
  fetchReportCards,
} from '../../store/reportCardsSlice'
import { fetchStudents } from '../../store/studentsSlice'
import { REPORT_CARDS_CONTENT } from '../../constants/reportCards'
import { fillTemplate } from '../../utils/grades'
import { formatDueDate } from '../../utils/tasks'
import Button from '../../components/shared/Button'
import GradesSectionNav from '../../components/grades/GradesSectionNav'
import ReportCardForm from '../../components/reportCards/ReportCardForm'

const content = REPORT_CARDS_CONTENT

/**
 * Every report card, newest period first, one row per card rather than one per
 * version: the highest version is the card that stands and the rest are
 * reached from it.
 */
const ReportCardsPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const { items, loading, error, saving, saveError } = useSelector(
    (state: RootState) => state.reportCards
  )
  const { items: students } = useSelector((state: RootState) => state.students)

  const [adding, setAdding] = useState(false)

  useEffect(() => {
    dispatch(fetchReportCards(undefined))
    dispatch(fetchStudents())
  }, [dispatch])

  const studentName = (card: ReportCard): string => {
    const student = students.find((candidate) => candidate.id === card.studentId)
    return student ? `${student.firstName} ${student.lastName}` : ''
  }

  const handleCreate = async (values: ReportCardInput): Promise<boolean> => {
    const result = await dispatch(createReportCard(values))
    if (!createReportCard.fulfilled.match(result)) return false

    // Straight into the new draft: creating one is the start of writing it,
    // not the end of a job.
    navigate(`/grades/report-cards/${result.payload.id}`)
    return true
  }

  const openAdd = () => {
    dispatch(clearSaveError())
    setAdding(true)
  }

  return (
    <div className='grades'>
      <div className='grades__inner'>
        <header className='grades__header'>
          <p className='grades__eyebrow'>{content.heading}</p>
          <h1 className='grades__heading'>{content.heading}</h1>
          <p className='grades__subhead'>{content.subhead}</p>
        </header>

        <GradesSectionNav />

        {!loading && !error && !adding && students.length > 0 && (
          <div className='grades__actions'>
            <Button color='cream' onClick={openAdd}>
              {content.addButton}
            </Button>
          </div>
        )}

        {adding && (
          <div className='grades__slot'>
            {saveError && (
              <p className='grades__error' role='alert'>
                {saveError}
              </p>
            )}
            <ReportCardForm
              card={null}
              students={students}
              saving={saving}
              onSubmit={handleCreate}
              onCancel={() => setAdding(false)}
            />
          </div>
        )}

        {loading && <p className='grades__status'>{content.loading}</p>}

        {!loading && error && (
          <p className='grades__error' role='alert'>
            {error}
          </p>
        )}

        {!loading && !error && items.length === 0 && !adding && (
          <p className='grades__status'>{content.empty}</p>
        )}

        {!loading && !error && items.length > 0 && (
          <ul className='report-card-list'>
            {items.map((card) => (
              <li key={card.id} className='report-card-row'>
                <span className='report-card-row__body'>
                  <Link className='report-card-row__title' to={`/grades/report-cards/${card.id}`}>
                    {card.title}
                  </Link>
                  <span className='report-card-row__meta'>
                    <span className='report-card-row__student'>{studentName(card)}</span>
                    <span className='report-card-row__period'>
                      {fillTemplate(content.periodLabel, {
                        start: formatDueDate(card.periodStart),
                        end: formatDueDate(card.periodEnd),
                      })}
                    </span>
                    {card.version > 1 && (
                      <span className='report-card-row__version'>
                        {fillTemplate(content.versionLabel, { version: String(card.version) })}
                      </span>
                    )}
                  </span>
                </span>

                {/* Draft against issued is the thing a teacher scans this list
                    for: one is a working document, the other is what she
                    handed over. */}
                <span
                  className={`report-card-badge${card.issued ? ' report-card-badge--issued' : ''}`}
                >
                  {card.issued ? content.issuedBadge : content.draftBadge}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ReportCardsPage
