import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import FormField, { FormInput, FormTextarea } from '../shared/FormField'
import Button from '../shared/Button'
import { TASKS_CONTENT } from '../../constants/tasks'
import type { Task, TaskInput } from '../../types'

const { form, validation } = TASKS_CONTENT

// Only the title is required, which matches the server: a to-do you jot down
// in a hurry should not need a due date to be saved.
const schema = z.object({
  title: z.string().trim().min(1, { message: validation.title }).max(255, {
    message: validation.titleLength,
  }),
  description: z.string(),
  dueDate: z.string(),
})

type FormData = z.infer<typeof schema>

interface TaskFormProps {
  /** The task being edited, or null when adding. */
  task: Task | null
  saving: boolean
  onSubmit: (values: TaskInput) => Promise<boolean>
  onCancel: () => void
}

const TaskForm = ({ task, saving, onSubmit, onCancel }: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      dueDate: task?.dueDate ?? '',
    },
  })

  // Blank means absent rather than empty: the server stores a blank note as
  // null, and an empty date string would not parse.
  const submit = async (values: FormData) => {
    const saved = await onSubmit({
      title: values.title.trim(),
      description: values.description.trim() || null,
      dueDate: values.dueDate || null,
    })
    if (saved) onCancel()
  }

  return (
    <form className='task-form' onSubmit={handleSubmit(submit)}>
      <p className='task-form__title'>{task ? form.editTitle : form.addTitle}</p>

      <FormField label={form.title} htmlFor='task-title'>
        <FormInput
          id='task-title'
          type='text'
          autoComplete='off'
          placeholder={form.titlePlaceholder}
          className={errors.title ? 'form-field__control--error' : ''}
          {...register('title')}
        />
        {errors.title && (
          <p className='task-form__error' role='alert'>
            {errors.title.message}
          </p>
        )}
      </FormField>

      <FormField label={form.dueDate} htmlFor='task-due-date'>
        <FormInput id='task-due-date' type='date' {...register('dueDate')} />
        <p className='task-form__hint'>{form.dueDateHint}</p>
      </FormField>

      <FormField label={form.description} htmlFor='task-description'>
        <FormTextarea
          id='task-description'
          rows={3}
          placeholder={form.descriptionPlaceholder}
          {...register('description')}
        />
      </FormField>

      <div className='task-form__actions'>
        <button type='button' className='task-form__cancel' onClick={onCancel} disabled={saving}>
          {form.cancel}
        </button>
        <Button type='submit' color='cream' disabled={saving}>
          {saving ? form.saving : form.save}
        </Button>
      </div>
    </form>
  )
}

export default TaskForm
