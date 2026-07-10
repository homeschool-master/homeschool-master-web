import { useEffect, useRef, useState } from 'react'
import Button from '../../shared/Button'

interface ProfilePhotoStepProps {
  file: File | null
  onFileChange: (file: File | null) => void
  onNext: () => void
  onSkip: () => void
}

const MAX_FILE_BYTES = 5 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const ProfilePhotoStep = ({ file, onFileChange, onNext, onSkip }: ProfilePhotoStepProps) => {
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

  return (
    <div className='onboarding-step'>
      <button
        type='button'
        className='onboarding-step__avatar'
        onClick={openPicker}
        aria-label={file ? 'Change your profile picture' : 'Upload your profile picture'}
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

      <button type='button' className='onboarding-step__upload-cta' onClick={openPicker}>
        {file ? 'Choose a different photo' : 'Click here to select a photo'}
      </button>

      {file && (
        <button type='button' className='onboarding-step__remove' onClick={handleRemove}>
          Remove photo
        </button>
      )}

      {error && <p className='onboarding-step__error'>{error}</p>}

      <div className='onboarding-step__actions onboarding-step__actions--single'>
        <Button onClick={onNext}>Next</Button>
      </div>

      <button type='button' className='onboarding-step__skip' onClick={onSkip}>
        Skip for now
      </button>
    </div>
  )
}

export default ProfilePhotoStep
