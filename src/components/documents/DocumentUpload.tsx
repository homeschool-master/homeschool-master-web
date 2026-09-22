import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import { clearUploadError, uploadDocument } from '../../store/documentsSlice'
import {
  ALLOWED_DOCUMENT_TYPES,
  DOCUMENTS_CONTENT,
  MAX_DOCUMENT_BYTES,
} from '../../constants/documents'
import { formatBytes, hasCamera, titleFromFilename } from '../../utils/documents'
import { fillTemplate } from '../../utils/grades'
import Button from '../shared/Button'
import type { TeacherDocument } from '../../types'

const content = DOCUMENTS_CONTENT

interface DocumentUploadProps {
  /** Called with the saved document, so a caller can file it straight away. */
  onUploaded?: (document: TeacherDocument) => void
  onCancel?: () => void
}

/**
 * Choose a file, give it a title, upload it.
 *
 * The camera button is only drawn on a touch device. `capture` is what makes a
 * phone open the camera rather than the photo roll, and on a desktop it does
 * nothing at all: two buttons that open the same file dialog would be worse
 * than one. The plain picker is always there, so nothing is only reachable
 * through the camera.
 */
const DocumentUpload = ({ onUploaded, onCancel }: DocumentUploadProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { uploading, uploadProgress, uploadError } = useSelector(
    (state: RootState) => state.documents
  )

  const fileInput = useRef<HTMLInputElement>(null)
  const cameraInput = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [problem, setProblem] = useState<string | null>(null)

  const take = (chosen: File | undefined) => {
    if (!chosen) return

    dispatch(clearUploadError())

    // Refused here as well as on the server, so a 25MB video is turned away
    // before it is read rather than after it has been uploaded.
    if (!ALLOWED_DOCUMENT_TYPES.includes(chosen.type)) {
      setProblem(content.validation.wrongType)
      setFile(null)
      return
    }
    if (chosen.size > MAX_DOCUMENT_BYTES) {
      setProblem(fillTemplate(content.validation.tooLarge, { size: formatBytes(chosen.size) }))
      setFile(null)
      return
    }

    setProblem(null)
    setFile(chosen)
    // A filename is a poor title, but it is a better start than an empty box.
    if (!title.trim()) setTitle(titleFromFilename(chosen.name))
  }

  const handleUpload = async () => {
    if (!file) {
      setProblem(content.validation.file)
      return
    }
    if (!title.trim()) {
      setProblem(content.validation.title)
      return
    }

    const result = await dispatch(uploadDocument({ file, title: title.trim() }))
    if (!uploadDocument.fulfilled.match(result)) return

    setFile(null)
    setTitle('')
    setProblem(null)
    if (fileInput.current) fileInput.current.value = ''
    if (cameraInput.current) cameraInput.current.value = ''
    onUploaded?.(result.payload)
  }

  return (
    <div className='document-upload'>
      <p className='document-upload__hint'>{content.upload.hint}</p>

      <div className='document-upload__pickers'>
        <input
          ref={fileInput}
          type='file'
          id='document-file'
          className='document-upload__input'
          accept={ALLOWED_DOCUMENT_TYPES.join(',')}
          onChange={(event) => take(event.target.files?.[0])}
        />
        <label htmlFor='document-file' className='document-upload__picker'>
          {content.upload.choose}
        </label>

        {hasCamera() && (
          <>
            <input
              ref={cameraInput}
              type='file'
              id='document-camera'
              className='document-upload__input'
              accept='image/*'
              capture='environment'
              onChange={(event) => take(event.target.files?.[0])}
            />
            <label htmlFor='document-camera' className='document-upload__picker'>
              {content.upload.camera}
            </label>
          </>
        )}
      </div>

      {file && (
        <p className='document-upload__selected'>
          {fillTemplate(content.upload.selected, {
            filename: file.name,
            size: formatBytes(file.size),
          })}
        </p>
      )}

      <label className='document-upload__label' htmlFor='document-title'>
        {content.upload.title}
      </label>
      <input
        id='document-title'
        className='document-upload__title'
        type='text'
        value={title}
        placeholder={content.upload.titlePlaceholder}
        onChange={(event) => setTitle(event.target.value)}
      />
      <p className='document-upload__hint'>{content.upload.titleHint}</p>

      {problem && (
        <p className='document-upload__error' role='alert'>
          {problem}
        </p>
      )}
      {uploadError && (
        <p className='document-upload__error' role='alert'>
          {uploadError}
        </p>
      )}

      {uploading && (
        <p className='document-upload__progress' role='status'>
          {content.upload.uploading}
          {uploadProgress !== null ? ` ${uploadProgress}%` : ''}
        </p>
      )}

      <div className='document-upload__actions'>
        {onCancel && (
          <button
            type='button'
            className='document-upload__cancel'
            onClick={onCancel}
            disabled={uploading}
          >
            {content.upload.cancel}
          </button>
        )}
        <Button color='cream' onClick={handleUpload} disabled={uploading || !file}>
          {uploading ? content.upload.uploading : content.upload.save}
        </Button>
      </div>
    </div>
  )
}

export default DocumentUpload
