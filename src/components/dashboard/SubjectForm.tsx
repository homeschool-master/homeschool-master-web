import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import FormField, { FormInput, FormTextarea } from '../shared/FormField'
import ColorPicker from '../shared/ColorPicker'
import Button from '../shared/Button'
import { SUBJECTS_CONTENT } from '../../constants/subjects'
import type { Subject, SubjectInput } from '../../types'

const { form, validation } = SUBJECTS_CONTENT

/**
 * Name and length only. Uniqueness is deliberately not checked here: the rule
 * ignores case and counts only subjects still on the list, so a name freed by
 * a removal is available again, and a client side guess would refuse a name
 * the server would happily accept.
 */
const schema = z.object({
  name: z.string().trim().min(1, { message: validation.name }).max(100, {
    message: validation.nameLength,
  }),
  description: z.string(),
  color: z.string(),
})

type FormData = z.infer<typeof schema>

interface SubjectFormProps {
  /** The subject being edited, or null when adding. */
  subject: Subject | null
  saving: boolean
  onSubmit: (values: SubjectInput) => Promise<boolean>
  onCancel: () => void
}

const SubjectForm = ({ subject, saving, onSubmit, onCancel }: SubjectFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      name: subject?.name ?? '',
      description: subject?.description ?? '',
      color: subject?.color ?? '',
    },
  })

  // Blank means absent rather than empty, which is how the server stores it.
  const submit = async (values: FormData) => {
    const saved = await onSubmit({
      name: values.name.trim(),
      description: values.description.trim() || null,
      color: values.color || null,
    })
    if (saved) onCancel()
  }

  return (
    <form className='subject-form' onSubmit={handleSubmit(submit)}>
      <p className='subject-form__title'>{subject ? form.editTitle : form.addTitle}</p>

      <FormField label={form.name} htmlFor='subject-name'>
        <FormInput
          id='subject-name'
          type='text'
          autoComplete='off'
          placeholder={form.namePlaceholder}
          className={errors.name ? 'form-field__control--error' : ''}
          {...register('name')}
        />
        {errors.name && (
          <span className='dashboard__error' role='alert'>
            {errors.name.message}
          </span>
        )}
      </FormField>

      <FormField label={form.description} htmlFor='subject-description'>
        <FormTextarea
          id='subject-description'
          rows={3}
          placeholder={form.descriptionPlaceholder}
          {...register('description')}
        />
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
          />
        )}
      />

      <div className='subject-form__actions'>
        <button
          type='button'
          className='subject-form__cancel'
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

export default SubjectForm
