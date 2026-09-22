import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import type { DocumentAttachment, TeacherDocument } from '../../types'
import { detachDocument, removeDocument, renameDocument } from '../../store/documentsSlice'
import { DOCUMENTS_CONTENT } from '../../constants/documents'
import { documentHref } from '../../services/documents'
import { formatBytes } from '../../utils/documents'
import { fillTemplate } from '../../utils/grades'
import { formatDueDate } from '../../utils/tasks'
import { isoToDateKey } from '../../utils/calendarDates'
import Button from '../shared/Button'

const content = DOCUMENTS_CONTENT

/** What each kind of record is called where a document says it is filed. */
const TYPE_LABELS: Record<string, string> = {
  Assignment: 'Assignment',
  Task: 'Task',
  CalendarEvent: 'Event',
}

const attachmentLabel = (attachment: DocumentAttachment): string => {
  const name = `${TYPE_LABELS[attachment.attachableType]}: ${attachment.label ?? ''}`.trim()
  if (!attachment.occurrenceDate) return name

  return `${name} ${fillTemplate(content.card.occurrenceSuffix, {
    date: formatDueDate(attachment.occurrenceDate),
  })}`
}

interface DocumentCardProps {
  document: TeacherDocument
}

/**
 * One document in the library: what it is, where it is filed, and the three
 * things that can be done to it.
 *
 * Unfiling and deleting are deliberately far apart and worded differently.
 * They are the pair a teacher is most likely to confuse, and only one of them
 * destroys the file.
 */
const DocumentCard = ({ document }: DocumentCardProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { saving, removingId, filingId, removeError } = useSelector(
    (state: RootState) => state.documents
  )

  const [renaming, setRenaming] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [title, setTitle] = useState(document.title)

  const busy = removingId === document.id
  const filing = filingId === document.id

  const handleRename = async () => {
    if (!title.trim()) return

    const result = await dispatch(renameDocument({ id: document.id, title: title.trim() }))
    if (renameDocument.fulfilled.match(result)) setRenaming(false)
  }

  return (
    <li className='document-card'>
      <div className='document-card__main'>
        <h3 className='document-card__title'>{document.title}</h3>
        <p className='document-card__meta'>
          {document.filename} · {formatBytes(document.byteSize)} ·{' '}
          {/* The instant read in her own timezone, not the first ten
              characters of a UTC string: an evening upload in New York is
              dated tomorrow by the second of those. */}
          {fillTemplate(content.card.uploadedOn, {
            date: formatDueDate(isoToDateKey(document.createdAt)),
          })}
        </p>

        {document.attachments.length > 0 ? (
          <>
            <p className='document-card__filed-label'>{content.card.filedAgainst}</p>
            <ul className='document-card__filed'>
              {document.attachments.map((attachment) => (
                <li key={attachment.id} className='document-card__chip'>
                  <span>{attachmentLabel(attachment)}</span>
                  <button
                    type='button'
                    className='document-card__unfile'
                    onClick={() =>
                      dispatch(detachDocument({ id: document.id, attachmentId: attachment.id }))
                    }
                    disabled={filing}
                  >
                    {content.card.unfileAction}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className='document-card__nowhere'>{content.card.filedNowhere}</p>
        )}
      </div>

      <div className='document-card__actions'>
        {/* A new tab rather than an in page viewer: the browser already knows
            how to show a pdf and an image, and the link it opens dies in
            minutes. */}
        <a
          className='document-card__action'
          href={documentHref(document)}
          target='_blank'
          rel='noreferrer'
        >
          {content.card.openAction}
        </a>
        <a className='document-card__action' href={documentHref(document, true)}>
          {content.card.downloadAction}
        </a>
        <button
          type='button'
          className='document-card__action'
          onClick={() => {
            setTitle(document.title)
            setRenaming(true)
          }}
        >
          {content.card.renameAction}
        </button>
        <button
          type='button'
          className='document-card__action document-card__action--danger'
          onClick={() => setConfirming(true)}
        >
          {content.card.removeAction}
        </button>
      </div>

      {renaming && (
        <div className='document-card__panel'>
          <p className='document-card__panel-title'>{content.rename.heading}</p>
          <input
            className='document-upload__title'
            type='text'
            value={title}
            aria-label={content.upload.title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <div className='document-card__panel-actions'>
            <button
              type='button'
              className='document-upload__cancel'
              onClick={() => setRenaming(false)}
              disabled={saving}
            >
              {content.rename.cancel}
            </button>
            <Button color='cream' onClick={handleRename} disabled={saving}>
              {saving ? content.rename.saving : content.rename.save}
            </Button>
          </div>
        </div>
      )}

      {confirming && (
        <div className='document-card__panel'>
          <p className='document-card__panel-title'>{content.remove.heading}</p>
          <p className='document-card__panel-body'>{content.remove.body}</p>
          <div className='document-card__panel-actions'>
            <button
              type='button'
              className='document-upload__cancel'
              onClick={() => setConfirming(false)}
              disabled={busy}
            >
              {content.remove.cancel}
            </button>
            <Button
              color='danger'
              onClick={() => dispatch(removeDocument(document.id))}
              disabled={busy}
            >
              {busy ? content.remove.removing : content.remove.confirm}
            </Button>
          </div>
        </div>
      )}

      {/* The pending flag is cleared when a call fails, so the error is shown
          against the panel that is still open rather than against a flag that
          has already gone. */}
      {removeError && confirming && (
        <p className='document-card__error' role='alert'>
          {removeError}
        </p>
      )}
    </li>
  )
}

export default DocumentCard
