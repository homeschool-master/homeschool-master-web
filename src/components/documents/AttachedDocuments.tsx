import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import type { DocumentAttachableType, TeacherDocument } from '../../types'
import { attachDocument, detachDocument, fetchDocuments } from '../../store/documentsSlice'
import { DOCUMENTS_CONTENT } from '../../constants/documents'
import { documentHref } from '../../services/documents'
import { formatBytes } from '../../utils/documents'
import { fillTemplate } from '../../utils/grades'
import { formatDueDate } from '../../utils/tasks'
import DocumentUpload from './DocumentUpload'

const content = DOCUMENTS_CONTENT

interface AttachedDocumentsProps {
  attachableType: DocumentAttachableType
  /**
   * The id this page is showing, exactly as it holds it. On an occurrence of a
   * repeating task or event that is "<uuid>:<date>", which is what makes the
   * difference between filing against one morning and filing against every
   * morning the series will ever produce.
   */
  targetId: string
  /**
   * Whether this record repeats. Without it a one off event would be told it
   * attaches to "every one of these", which is a sentence about a series and
   * means nothing here.
   */
  repeats?: boolean
}

const occurrenceDateOf = (targetId: string): string | null => {
  const [, date] = targetId.split(':')
  return date ?? null
}

const filedHere = (document: TeacherDocument, targetId: string): boolean =>
  document.attachments.some((attachment) => attachment.targetId === targetId)

/**
 * The documents panel that appears on an assignment, a task and an event.
 *
 * It reads the same library the documents page does, so nothing here needs its
 * own fetch, and a file uploaded from this panel is in the library the moment
 * it is filed.
 */
const AttachedDocuments = ({ attachableType, targetId, repeats = false }: AttachedDocumentsProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loaded, filingId, filingError } = useSelector(
    (state: RootState) => state.documents
  )

  const [picking, setPicking] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!loaded) void dispatch(fetchDocuments())
  }, [dispatch, loaded])

  const occurrenceDate = occurrenceDateOf(targetId)
  const attached = items.filter((document) => filedHere(document, targetId))
  const available = items.filter((document) => !filedHere(document, targetId))

  const attach = async (document: TeacherDocument) => {
    const result = await dispatch(
      attachDocument({ id: document.id, attachableType, targetId })
    )
    if (attachDocument.fulfilled.match(result)) setPicking(false)
  }

  return (
    <section className='attached-documents'>
      <h2 className='attached-documents__heading'>{content.attached.heading}</h2>

      {/* Which of the two this filing means, said in the open. On a repeating
          event the difference between one morning and every morning is the
          whole point, and it is not visible from anywhere else on the page. */}
      {(occurrenceDate || repeats) && (
        <p className='attached-documents__scope'>
          {occurrenceDate
            ? fillTemplate(content.attached.occurrenceNote, {
                date: formatDueDate(occurrenceDate),
              })
            : content.attached.seriesNote}
        </p>
      )}

      {attached.length === 0 ? (
        <p className='attached-documents__empty'>{content.attached.none}</p>
      ) : (
        <ul className='attached-documents__list'>
          {attached.map((document) => (
            <li key={document.id} className='attached-documents__item'>
              <a
                className='attached-documents__link'
                href={documentHref(document)}
                target='_blank'
                rel='noreferrer'
              >
                {document.title}
              </a>
              <span className='attached-documents__meta'>{formatBytes(document.byteSize)}</span>
              <button
                type='button'
                className='attached-documents__detach'
                disabled={filingId === document.id}
                onClick={() => {
                  const attachment = document.attachments.find((row) => row.targetId === targetId)
                  if (attachment) {
                    void dispatch(detachDocument({ id: document.id, attachmentId: attachment.id }))
                  }
                }}
              >
                {filingId === document.id
                  ? content.attached.detaching
                  : content.attached.detachAction}
              </button>
            </li>
          ))}
        </ul>
      )}

      {filingError && (
        <p className='attached-documents__error' role='alert'>
          {filingError}
        </p>
      )}

      <button
        type='button'
        className='attached-documents__add'
        onClick={() => {
          setPicking(!picking)
          setUploading(false)
        }}
      >
        {picking ? content.attached.done : content.attached.addAction}
      </button>

      {picking && (
        <div className='attached-documents__picker'>
          <p className='attached-documents__hint'>{content.attached.addHint}</p>

          <div className='attached-documents__tabs'>
            <button
              type='button'
              className={`attached-documents__tab${uploading ? '' : ' attached-documents__tab--active'}`}
              aria-pressed={!uploading}
              onClick={() => setUploading(false)}
            >
              {content.attached.fromLibrary}
            </button>
            <button
              type='button'
              className={`attached-documents__tab${uploading ? ' attached-documents__tab--active' : ''}`}
              aria-pressed={uploading}
              onClick={() => setUploading(true)}
            >
              {content.attached.uploadNew}
            </button>
          </div>

          {uploading ? (
            <DocumentUpload
              onUploaded={(document) => {
                void attach(document)
                setUploading(false)
              }}
            />
          ) : available.length === 0 ? (
            <p className='attached-documents__empty'>{content.attached.libraryEmpty}</p>
          ) : (
            <ul className='attached-documents__available'>
              {available.map((document) => (
                <li key={document.id} className='attached-documents__item'>
                  <span className='attached-documents__title'>{document.title}</span>
                  <span className='attached-documents__meta'>{formatBytes(document.byteSize)}</span>
                  <button
                    type='button'
                    className='attached-documents__attach'
                    disabled={filingId === document.id}
                    onClick={() => void attach(document)}
                  >
                    {filingId === document.id
                      ? content.attached.attaching
                      : content.attached.attachAction}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}

export default AttachedDocuments
