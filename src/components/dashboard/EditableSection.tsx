import { useState, type ReactNode } from 'react'

type EditableSectionProps = {
  title: string
  summary: ReactNode
  editLabel: string
  children: (close: () => void) => ReactNode
}

const EditableSection = ({ title, summary, editLabel, children }: EditableSectionProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const close = () => setIsEditing(false)

  return (
    <div className='dashboard__section'>
      <p className='dashboard__section-title'>{title}</p>
      {isEditing ? (
        children(close)
      ) : (
        <>
          <p className='dashboard__section-value'>{summary}</p>
          <button type='button' className='dashboard__section-link' onClick={() => setIsEditing(true)}>
            {editLabel}
          </button>
        </>
      )}
    </div>
  )
}

export default EditableSection
