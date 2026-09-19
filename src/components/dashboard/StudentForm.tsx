import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import FormField, { FormInput, FormSelect } from '../shared/FormField'
import ColorPicker from '../shared/ColorPicker'
import { GRADE_LEVELS } from '../../constants/onboarding'
import { STUDENTS_CONTENT } from '../../constants/students'
import { readableTextColor } from '../../utils/studentColor'
import type { Student, StudentInput } from '../../types'

const { form, validation } = STUDENTS_CONTENT

// The same shape onboarding collects, so a student added here and a student
// added during setup are the same record with the same rules.
const schema = z.object({
  firstName: z.string().trim().min(1, { message: validation.firstName }),
  middleName: z.string().trim(),
  lastName: z.string().trim().min(1, { message: validation.lastName }),
  gradeLevel: z.string().min(1, { message: validation.gradeLevel }),
  color: z.string().min(1, { message: validation.color }),
})

type FormData = z.infer<typeof schema>

interface StudentFormProps {
  /** The student being edited, or null when adding. */
  student: Student | null
  saving: boolean
  onSubmit: (values: StudentInput) => Promise<boolean>
  onCancel: () => void
}

const StudentForm = ({ student, saving, onSubmit, onCancel }: StudentFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      firstName: student?.firstName ?? '',
      middleName: student?.middleName ?? '',
      lastName: student?.lastName ?? '',
      gradeLevel: student?.gradeLevel ?? '',
      color: student?.color ?? '',
    },
  })

  const previewColor = useWatch({ control, name: 'color' })
  const previewFirstName = useWatch({ control, name: 'firstName' })
  const previewName = previewFirstName.trim() || form.previewName

  const submit = async (values: FormData) => {
    const saved = await onSubmit(values)
    if (saved) onCancel()
  }

  return (
    <form className='dashboard__form dashboard__student-form' onSubmit={handleSubmit(submit)}>
      <p className='dashboard__section-title'>
        {student ? form.editTitle : form.addTitle}
      </p>

      <FormField label={form.firstName} htmlFor='student-first-name'>
        <FormInput
          id='student-first-name'
          type='text'
          autoComplete='off'
          className={errors.firstName ? 'form-field__control--error' : ''}
          {...register('firstName')}
        />
        {errors.firstName && <span className='dashboard__error'>{errors.firstName.message}</span>}
      </FormField>

      <FormField label={form.middleName} htmlFor='student-middle-name'>
        <FormInput
          id='student-middle-name'
          type='text'
          autoComplete='off'
          placeholder={form.middleNamePlaceholder}
          {...register('middleName')}
        />
      </FormField>

      <FormField label={form.lastName} htmlFor='student-last-name'>
        <FormInput
          id='student-last-name'
          type='text'
          autoComplete='off'
          className={errors.lastName ? 'form-field__control--error' : ''}
          {...register('lastName')}
        />
        {errors.lastName && <span className='dashboard__error'>{errors.lastName.message}</span>}
      </FormField>

      <FormField label={form.gradeLevel} htmlFor='student-grade-level'>
        <FormSelect
          id='student-grade-level'
          className={errors.gradeLevel ? 'form-field__control--error' : ''}
          {...register('gradeLevel')}
        >
          <option value=''>{form.gradePlaceholder}</option>
          {GRADE_LEVELS.map((grade) => (
            <option key={grade.value} value={grade.value}>
              {grade.label}
            </option>
          ))}
        </FormSelect>
        {errors.gradeLevel && <span className='dashboard__error'>{errors.gradeLevel.message}</span>}
      </FormField>

      <Controller
        name='color'
        control={control}
        render={({ field }) => (
          <ColorPicker
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            legend={form.color}
            hint={form.colorHint}
          >
            {/* The preview is the chip the roster and the calendar will show,
                text colour picked from the fill so any choice stays legible. */}
            <span
              className='dashboard__student-chip dashboard__color-preview'
              style={
                previewColor
                  ? { backgroundColor: previewColor, color: readableTextColor(previewColor) }
                  : undefined
              }
            >
              {previewName}
            </span>

            {errors.color && <span className='dashboard__error'>{errors.color.message}</span>}
          </ColorPicker>
        )}
      />

      <div className='dashboard__form-actions'>
        <button
          type='button'
          className='dashboard__cancel-btn'
          onClick={onCancel}
          disabled={saving}
        >
          {form.cancel}
        </button>
        <button type='submit' className='dashboard__save-btn' disabled={saving}>
          {saving ? form.saving : form.save}
        </button>
      </div>
    </form>
  )
}

export default StudentForm
