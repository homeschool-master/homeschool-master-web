import { useEffect, useRef, useState } from 'react'
import Button from '../../shared/Button'

interface StudentPhotoStepProps {
  file: File | null
  onFileChange: (file: File | null) => void
  onBack: () => void
  onNext: () => void
  onSkip: () => void
  isLast: boolean
  isSubmitting: boolean
}

const MAX_FILE_BYTES = 5 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const StudentPhotoStep = ({
  file,
  onFileChange,
  onBack,
  onNext,
  onSkip,
  isLast,
  isSubmitting,
}: StudentPhotoStepProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0]
    event.target.value = ''
    if (!selected) return

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError('Please choose a JPG, PNG, or WEBP image.')
      return
    }
    if (selected.size > MAX_FILE_BYTES) {
      setError('That image is too large. Please choose one under 5MB.')
      return
    }

    setError(null)
    onFileChange(selected)
  }

  const openPicker = () => inputRef.current?.click()

  const handleRemove = () => {
    setError(null)
    onFileChange(null)
  }

  const nextLabel = isSubmitting ? 'Finishing...' : isLast ? 'Finish' : 'Next'

  return (
    <div className='onboarding-step'>
      <button
        type='button'
        className='onboarding-step__avatar'
        onClick={openPicker}
        disabled={isSubmitting}
        aria-label={file ? "Change this student's picture" : "Upload this student's picture"}
      >
        {previewUrl ? (
          <img className='onboarding-step__avatar-img' src={previewUrl} alt='' />
        ) : (
          <span className='onboarding-step__avatar-placeholder' aria-hidden='true' />
        )}
      </button>

      <input
        ref={inputRef}
        type='file'
        className='onboarding-step__file-input'
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleSelect}
      />

      <button
        type='button'
        className='onboarding-step__upload-cta'
        onClick={openPicker}
        disabled={isSubmitting}
      >
        {file ? 'Choose a different photo' : 'Click here to select a photo'}
      </button>

      {file && (
        <button
          type='button'
          className='onboarding-step__remove'
          onClick={handleRemove}
          disabled={isSubmitting}
        >
          Remove photo
        </button>
      )}

      {error && <p className='onboarding-step__error'>{error}</p>}

      <div className='onboarding-step__actions'>
        <Button color='cream' onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
        <Button onClick={onNext} disabled={isSubmitting}>
          {nextLabel}
        </Button>
      </div>

      <button
        type='button'
        className='onboarding-step__skip'
        onClick={onSkip}
        disabled={isSubmitting}
      >
        Skip for now
      </button>
    </div>
  )
}

export default StudentPhotoStep
