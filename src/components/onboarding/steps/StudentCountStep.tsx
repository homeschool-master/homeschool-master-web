import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '../../shared/Button'
import CountReductionModal from '../CountReductionModal'
import { MIN_STUDENTS } from '../../../constants/onboarding'
import type { StudentDraft } from '../../../pages/app/OnboardingPage'

const schema = z.object({
  count: z
    .string()
    .min(1, { message: 'Enter how many students you have' })
    .refine((value) => /^\d+$/.test(value), { message: 'Enter a whole number' })
    .refine((value) => Number(value) >= MIN_STUDENTS, {
      message: `Enter at least ${MIN_STUDENTS} student`,
    }),
})

type FormData = z.infer<typeof schema>

interface StudentCountStepProps {
  defaultCount?: number
  students: StudentDraft[]
  onBack: () => void
  onNext: (count: number) => Promise<void>
}

const StudentCountStep = ({ defaultCount, students, onBack, onNext }: StudentCountStepProps) => {
  const [apiError, setApiError] = useState<string | null>(null)
  const [pendingCount, setPendingCount] = useState<number | null>(null)

  const savedStudents = students.filter((s) => s.id !== null)
  const savedCount = savedStudents.length

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { count: defaultCount ? String(defaultCount) : '' },
  })

  const studentsToDelete = pendingCount !== null ? savedStudents.slice(pendingCount) : []

  const commit = async (count: number) => {
    setApiError(null)
    try {
      await onNext(count)
    } catch (error: any) {
      setPendingCount(null)
      setApiError(
        error.response?.data?.error?.message ||
        'Could not save that change. Please try again.'
      )
    }
  }

  const onSubmit = (data: FormData) => {
    const count = Number(data.count)
    // Only gate behind the modal when the choice would delete saved students.
    if (count < savedCount) {
      setPendingCount(count)
      return
    }
    commit(count)
  }

  const handleConfirmReduction = () => {
    if (pendingCount !== null) commit(pendingCount)
  }

  const handleCancelReduction = () => setPendingCount(null)

  return (
    <>
      <form className='onboarding-step' onSubmit={handleSubmit(onSubmit)}>
        {savedCount > 0 && (
          <p className='onboarding-step__alert' role='status'>
            Lowering the number of students below {savedCount} will delete students from
            the end of your list.
          </p>
        )}

        <div className='onboarding-step__field'>
          <label className='onboarding-step__label' htmlFor='student-count'>
            How many students do you have?
          </label>
          <input
            id='student-count'
            type='number'
            inputMode='numeric'
            min={MIN_STUDENTS}
            placeholder='e.g. 3'
            className={`onboarding-step__input ${errors.count ? 'onboarding-step__input--error' : ''}`}
            {...register('count')}
          />
          {errors.count && <span className='onboarding-step__error'>{errors.count.message}</span>}
        </div>

        {apiError && <p className='onboarding-step__error'>{apiError}</p>}

        <div className='onboarding-step__actions'>
          <Button color='cream' onClick={onBack} disabled={isSubmitting}>
            Back
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Next'}
          </Button>
        </div>
      </form>

      {pendingCount !== null && (
        <CountReductionModal
          studentsToDelete={studentsToDelete}
          onConfirm={handleConfirmReduction}
          onCancel={handleCancelReduction}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  )
}

export default StudentCountStep
