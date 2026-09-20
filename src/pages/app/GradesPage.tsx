import { useSearchParams } from 'react-router-dom'
import { GRADES_CONTENT } from '../../constants/grades'
import AssignmentsView from '../../components/grades/AssignmentsView'
import ProgressView from '../../components/grades/ProgressView'

type GradesView = 'assignments' | 'progress'

const VIEW_PARAM = 'view'

/**
 * Grades is two pages behind one heading, switched the way the calendar
 * switches between its grid and its list: the choice lives in the query
 * string, so a link carries it and a reload keeps it. Assignments is the
 * default and writes no param, since it is where the work is done: progress
 * is the view worth spelling out in a link.
 */
const GradesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const view: GradesView = searchParams.get(VIEW_PARAM) === 'progress' ? 'progress' : 'assignments'

  const selectView = (next: GradesView) => {
    setSearchParams((current) => {
      const params = new URLSearchParams(current)
      if (next === 'assignments') params.delete(VIEW_PARAM)
      else params.set(VIEW_PARAM, next)

      // The two views share no filters, so the other one's are dropped rather
      // than left in the URL to be applied to a list that never had them.
      ;['subject', 'show', 'student', 'from', 'to'].forEach((key) => params.delete(key))

      return params
    })
  }

  return (
    <div className='grades'>
      <div className='grades__inner'>
        <header className='grades__header'>
          <p className='grades__eyebrow'>{GRADES_CONTENT.page.eyebrow}</p>
          <h1 className='grades__heading'>{GRADES_CONTENT.page.heading}</h1>
          <p className='grades__subhead'>{GRADES_CONTENT.page.subhead}</p>
        </header>

        <div className='grades__views' role='group' aria-label={GRADES_CONTENT.views.label}>
          <button
            type='button'
            className={`grades__view-toggle${view === 'assignments' ? ' grades__view-toggle--active' : ''}`}
            aria-pressed={view === 'assignments'}
            onClick={() => selectView('assignments')}
          >
            {GRADES_CONTENT.views.assignments}
          </button>
          <button
            type='button'
            className={`grades__view-toggle${view === 'progress' ? ' grades__view-toggle--active' : ''}`}
            aria-pressed={view === 'progress'}
            onClick={() => selectView('progress')}
          >
            {GRADES_CONTENT.views.progress}
          </button>
        </div>

        {view === 'assignments' ? <AssignmentsView /> : <ProgressView />}
      </div>
    </div>
  )
}

export default GradesPage
