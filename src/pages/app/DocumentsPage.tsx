import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import type { DocumentFilter } from '../../types'
import { fetchDocuments } from '../../store/documentsSlice'
import { DOCUMENTS_CONTENT } from '../../constants/documents'
import DocumentCard from '../../components/documents/DocumentCard'
import DocumentUpload from '../../components/documents/DocumentUpload'

const content = DOCUMENTS_CONTENT

/**
 * The library: everything this teacher has uploaded.
 *
 * Its own section rather than a page inside Settings. A document is filed
 * against work, and filing is something she does during a school day; settings
 * is where an account is configured. The nav strip's overflow ladder takes
 * care of the extra section on a narrow phone.
 *
 * The filter is a pair of buttons in the open rather than a disclosure. Which
 * of the two lists she is looking at is the thing that explains why a document
 * she just uploaded is or is not on screen.
 */
const DocumentsPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading, loaded, error, filingError } = useSelector(
    (state: RootState) => state.documents
  )

  const [filter, setFilter] = useState<DocumentFilter>('all')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (!loaded) void dispatch(fetchDocuments())
  }, [dispatch, loaded])

  // Filtered here rather than refetched: the library is small, and one list
  // shared with the panels on assignments, tasks and events means uploading in
  // either place updates both.
  const shown = filter === 'unattached' ? items.filter((it) => it.attachments.length === 0) : items

  return (
    <div className='documents'>
      <div className='documents__inner'>
        <header className='documents__header'>
          <h1 className='documents__heading'>{content.heading}</h1>
          <p className='documents__subhead'>{content.subhead}</p>
        </header>

        <div className='documents__bar'>
          <div className='documents__filters' role='group' aria-label={content.filters.label}>
            {(['all', 'unattached'] as DocumentFilter[]).map((option) => (
              <button
                key={option}
                type='button'
                className={`documents__filter${filter === option ? ' documents__filter--active' : ''}`}
                aria-pressed={filter === option}
                onClick={() => setFilter(option)}
              >
                {option === 'all' ? content.filters.all : content.filters.unattached}
              </button>
            ))}
          </div>

          <button type='button' className='documents__add' onClick={() => setAdding(!adding)}>
            {adding ? content.upload.cancel : content.upload.heading}
          </button>
        </div>

        {adding && (
          <div className='documents__slot'>
            <DocumentUpload onUploaded={() => setAdding(false)} onCancel={() => setAdding(false)} />
          </div>
        )}

        {loading && <p className='documents__status'>{content.loading}</p>}

        {!loading && error && (
          <p className='documents__error' role='alert'>
            {error}
          </p>
        )}

        {filingError && (
          <p className='documents__error' role='alert'>
            {filingError}
          </p>
        )}

        {!loading && !error && shown.length === 0 && (
          <p className='documents__status'>
            {filter === 'unattached' && items.length > 0 ? content.emptyUnattached : content.empty}
          </p>
        )}

        {shown.length > 0 && (
          <ul className='documents__list'>
            {shown.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default DocumentsPage
