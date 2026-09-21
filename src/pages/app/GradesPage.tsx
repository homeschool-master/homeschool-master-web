import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { GRADES_CONTENT } from '../../constants/grades'
import GradesSectionNav from '../../components/grades/GradesSectionNav'
import ProgressView from '../../components/grades/ProgressView'

/**
 * The read side: how the work already set and marked adds up.
 *
 * Setting and marking moved out to their own section, so this page no longer
 * carries a view toggle. A link to the old tabbed page is still honoured
 * rather than quietly showing the wrong half: ?view=assignments goes where
 * assignments went.
 */
const GradesPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const wantsAssignments = searchParams.get('view') === 'assignments'

  useEffect(() => {
    if (wantsAssignments) navigate('/assignments', { replace: true })
  }, [wantsAssignments, navigate])

  if (wantsAssignments) return null

  return (
    <div className='grades'>
      <div className='grades__inner'>
        <header className='grades__header'>
          <p className='grades__eyebrow'>{GRADES_CONTENT.page.eyebrow}</p>
          <h1 className='grades__heading'>{GRADES_CONTENT.page.heading}</h1>
          <p className='grades__subhead'>{GRADES_CONTENT.page.subhead}</p>
        </header>

        <GradesSectionNav />

        <ProgressView />
      </div>
    </div>
  )
}

export default GradesPage
