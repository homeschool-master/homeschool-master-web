import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import FormField, { FormInput, FormSelect, FormTextarea } from '../shared/FormField'
import Button from '../shared/Button'
import { REPORT_CARDS_CONTENT } from '../../constants/reportCards'
import { defaultProgressRange } from '../../utils/grades'
import { todayKey } from '../../utils/calendarDates'
import type { ReportCard, ReportCardInput, Student } from '../../types'

const { form, validation } = REPORT_CARDS_CONTENT

const schema = z
  .object({
    studentId: z.string().trim().min(1, { message: validation.student }),
    title: z.string().trim().min(1, { message: validation.title }).max(255),
    periodStart: z.string().min(1, { message: validation.period }),
    periodEnd: z.string().min(1, { message: validation.period }),
    comments: z.string(),
  })
  // The server refuses a reversed period, so the form says so first rather
  // than sending it to be refused.
  .refine((values) => values.periodEnd >= values.periodStart, {
    message: validation.period,
    path: ['periodEnd'],
  })

type FormData = z.infer<typeof schema>

interface ReportCardFormProps {
  /** The card being edited, or null when creating. */
  card: ReportCard | null
  students: Student[]
  saving: boolean
  onSubmit: (values: ReportCardInput) => Promise<boolean>
  onCancel: () => void
}

/**
 * The heading of a report card: who it is for, what it is called and the
 * period it covers. The grades themselves are never typed here: they are
 * calculated from the work in that period, and the only thing a teacher writes
 * over them is an override on the card itself.
 */
const ReportCardForm = ({ card, students, saving, onSubmit, onCancel }: ReportCardFormProps) => {
  const fallback = defaultProgressRange(todayKey())

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      studentId: card?.studentId ?? students[0]?.id ?? '',
      title: card?.title ?? '',
      // The school year so far, the same default the gradebook opens on, so a
      // teacher who wants the whole term has nothing to type.
      periodStart: card?.periodStart ?? fallback.from,
      periodEnd: card?.periodEnd ?? fallback.to,
      comments: card?.comments ?? '',
    },
  })

  const submit = async (values: FormData) => {
    const saved = await onSubmit({
      studentId: values.studentId,
      title: values.title.trim(),
      periodStart: values.periodStart,
      periodEnd: values.periodEnd,
      comments: values.comments.trim() || null,
    })
    if (saved) onCancel()
  }

  return (
    <form className='report-card-form' onSubmit={handleSubmit(submit)}>
      <p className='report-card-form__title'>{card ? form.editTitle : form.addTitle}</p>

      <FormField label={form.student} htmlFor='report-card-student'>
        <FormSelect
          id='report-card-student'
          // The student a card is about cannot move: its grades, its period
          // and its snapshot all belong to one child.
          disabled={card !== null}
          className={errors.studentId ? 'form-field__control--error' : ''}
          {...register('studentId')}
        >
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.firstName} {student.lastName}
            </option>
          ))}
        </FormSelect>
        {errors.studentId && (
          <p className='report-card-form__error' role='alert'>
            {errors.studentId.message}
          </p>
        )}
      </FormField>

      <FormField label={form.title} htmlFor='report-card-title'>
        <FormInput
          id='report-card-title'
          type='text'
          autoComplete='off'
          placeholder={form.titlePlaceholder}
          className={errors.title ? 'form-field__control--error' : ''}
          {...register('title')}
        />
        {errors.title && (
          <p className='report-card-form__error' role='alert'>
            {errors.title.message}
          </p>
        )}
      </FormField>

      <div className='report-card-form__period'>
        <FormField label={form.periodStart} htmlFor='report-card-from'>
          <FormInput id='report-card-from' type='date' {...register('periodStart')} />
        </FormField>

        <FormField label={form.periodEnd} htmlFor='report-card-to'>
          <FormInput
            id='report-card-to'
            type='date'
            className={errors.periodEnd ? 'form-field__control--error' : ''}
            {...register('periodEnd')}
          />
          {errors.periodEnd && (
            <p className='report-card-form__error' role='alert'>
              {errors.periodEnd.message}
            </p>
          )}
        </FormField>
      </div>

      <FormField label={form.comments} htmlFor='report-card-comments'>
        <FormTextarea
          id='report-card-comments'
          rows={3}
          placeholder={form.commentsPlaceholder}
          {...register('comments')}
        />
      </FormField>

      <div className='report-card-form__actions'>
        <button
          type='button'
          className='report-card-form__cancel'
          onClick={onCancel}
          disabled={saving}
        >
          {form.cancel}
        </button>
        <Button type='submit' color='cream' disabled={saving}>
          {saving ? form.saving : form.save}
        </Button>
      </div>
    </form>
  )
}

export default ReportCardForm
