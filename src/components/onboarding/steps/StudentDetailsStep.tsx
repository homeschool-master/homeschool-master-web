import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '../../shared/Button'
import { GRADE_LEVELS, STUDENT_COLORS } from '../../../constants/onboarding'
import type { StudentDetailsValues, StudentDraft } from '../../../pages/app/OnboardingPage'

const schema = z.object({
  firstName: z.string().trim().min(1, { message: 'First name is required' }),
  middleName: z.string().trim(),
  lastName: z.string().trim().min(1, { message: 'Last name is required' }),
  gradeLevel: z.string().min(1, { message: 'Select a grade level' }),
  color: z.string().min(1, { message: 'Select a color' }),
})

type FormData = z.infer<typeof schema>

interface StudentDetailsStepProps {
  student: StudentDraft
  onBack: () => void
  onNext: (values: StudentDetailsValues) => Promise<void>
}

const StudentDetailsStep = ({ student, onBack, onNext }: StudentDetailsStepProps) => {
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      firstName: student.firstName,
      middleName: student.middleName,
      lastName: student.lastName,
      gradeLevel: student.gradeLevel,
      color: student.color,
    },
  })

  const onSubmit = async (data: FormData) => {
    setApiError(null)
    try {
      await onNext(data)
    } catch (error: any) {
      setApiError(
        error.response?.data?.error?.message ||
        'Could not save this student. Please try again.'
      )
    }
  }

  return (
    <form className='onboarding-step' onSubmit={handleSubmit(onSubmit)}>
      <div className='onboarding-step__field'>
        <label className='onboarding-step__sr-only' htmlFor='student-first-name'>
          Student First Name
        </label>
        <input
          id='student-first-name'
          type='text'
          autoComplete='off'
          placeholder='Student First Name'
          className={`onboarding-step__input ${errors.firstName ? 'onboarding-step__input--error' : ''}`}
          {...register('firstName')}
        />
        {errors.firstName && (
          <span className='onboarding-step__error'>{errors.firstName.message}</span>
        )}
      </div>

      <div className='onboarding-step__field'>
        <label className='onboarding-step__sr-only' htmlFor='student-middle-name'>
          Student Middle Name
        </label>
        <input
          id='student-middle-name'
          type='text'
          autoComplete='off'
          placeholder='Student Middle Name (optional)'
          className={`onboarding-step__input ${errors.middleName ? 'onboarding-step__input--error' : ''}`}
          {...register('middleName')}
        />
        {errors.middleName && (
          <span className='onboarding-step__error'>{errors.middleName.message}</span>
        )}
      </div>

      <div className='onboarding-step__field'>
        <label className='onboarding-step__sr-only' htmlFor='student-last-name'>
          Student Last Name
        </label>
        <input
          id='student-last-name'
          type='text'
          autoComplete='off'
          placeholder='Student Last Name'
          className={`onboarding-step__input ${errors.lastName ? 'onboarding-step__input--error' : ''}`}
          {...register('lastName')}
        />
        {errors.lastName && (
          <span className='onboarding-step__error'>{errors.lastName.message}</span>
        )}
      </div>

      <div className='onboarding-step__field'>
        <label className='onboarding-step__sr-only' htmlFor='student-grade'>
          Grade Level
        </label>
        <select
          id='student-grade'
          defaultValue=''
          className={`onboarding-step__select ${errors.gradeLevel ? 'onboarding-step__select--error' : ''}`}
          {...register('gradeLevel')}
        >
          <option value='' disabled>
            Grade Level
          </option>
          {GRADE_LEVELS.map((grade) => (
            <option key={grade.value} value={grade.value}>
              {grade.label}
            </option>
          ))}
        </select>
        {errors.gradeLevel && (
          <span className='onboarding-step__error'>{errors.gradeLevel.message}</span>
        )}
      </div>

      <Controller
        name='color'
        control={control}
        render={({ field }) => (
          <fieldset className='onboarding-step__colors'>
            <legend className='onboarding-step__colors-legend'>
              Select a color for this student
            </legend>
            <div className='onboarding-step__colors-grid'>
              {STUDENT_COLORS.map((option) => (
                <label
                  key={option.value}
                  className={`onboarding-step__swatch ${
                    field.value === option.hex ? 'onboarding-step__swatch--selected' : ''
                  }`}
                  title={option.label}
                >
                  <input
                    type='radio'
                    className='onboarding-step__swatch-input'
                    name={field.name}
                    value={option.hex}
                    checked={field.value === option.hex}
                    onChange={() => field.onChange(option.hex)}
                    onBlur={field.onBlur}
                  />
                  <span
                    className='onboarding-step__swatch-dot'
                    style={{ backgroundColor: option.hex }}
                    aria-hidden='true'
                  />
                  <span className='onboarding-step__sr-only'>{option.label}</span>
                </label>
              ))}
            </div>
            {errors.color && <span className='onboarding-step__error'>{errors.color.message}</span>}
          </fieldset>
        )}
      />

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
  )
}

export default StudentDetailsStep
