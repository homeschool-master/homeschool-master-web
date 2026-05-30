import { Link } from 'react-router-dom'

// Placeholder roster. Student management lives in the mobile app, so this view
// is read-only. Swap PLACEHOLDER_STUDENTS for a GET /api/v1/students call once
// that endpoint exists.
const PLACEHOLDER_STUDENTS = [
  { id: 1, name: 'Scarlett' },
  { id: 2, name: 'Robbie' },
  { id: 3, name: 'Michelle' },
  { id: 4, name: 'Alexander' },
]

const StudentsSection = () => {
  return (
    <div className='dashboard__students'>
      {PLACEHOLDER_STUDENTS.length === 0 ? (
        <p className='dashboard__students-empty'>No students yet. Add your first one in the app.</p>
      ) : (
        <ul className='dashboard__students-grid'>
          {PLACEHOLDER_STUDENTS.map((student) => (
            <li key={student.id} className='dashboard__student-chip'>
              {student.name}
            </li>
          ))}
        </ul>
      )}

      <div className='dashboard__students-manage-wrap'>
        <Link to='/download' className='dashboard__students-manage'>
          Manage in App <span aria-hidden='true'>&rarr;</span>
        </Link>
      </div>
    </div>
  )
}

export default StudentsSection
