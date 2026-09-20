import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import FormField, { FormInput, FormTextarea } from '../shared/FormField'
import Button from '../shared/Button'
import { TASKS_CONTENT } from '../../constants/tasks'
import { TASK_OWNERS } from '../../utils/taskOwnership'
import { readableTextColor } from '../../utils/studentColor'
import type { Student, Task, TaskInput, TaskOwner } from '../../types'

const { form, validation } = TASKS_CONTENT

/** The fill behind a student with no colour of their own. */
const NEUTRAL_STUDENT_COLOR = '#ecbb77'

const OWNER_LABELS: Record<TaskOwner, string> = {
  teacher: form.ownerTeacher,
  student: form.ownerStudent,
  both: form.ownerBoth,
}

const OWNER_HINTS: Record<TaskOwner, string> = {
  teacher: form.ownerTeacherHint,
  student: form.ownerStudentHint,
  both: form.ownerBothHint,
}

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
  students: Student[]
  saving: boolean
  onSubmit: (values: TaskInput) => Promise<boolean>
  onCancel: () => void
}

const TaskForm = ({ task, students, saving, onSubmit, onCancel }: TaskFormProps) => {
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

  // Held outside react-hook-form, like the assignment form's students: a set
  // of checkboxes is a set, and the pair of them is validated together below
  // rather than field by field.
  const [studentIds, setStudentIds] = useState<string[]>(() => task?.studentIds ?? [])
  const [ownedBy, setOwnedBy] = useState<TaskOwner>(() => task?.ownedBy ?? 'teacher')

  const toggleStudent = (id: string) => {
    setStudentIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    )
  }

  /**
   * The server refuses a task that is a student's while naming nobody, rather
   * than quietly making it the teacher's. The form says so before sending,
   * and names both ways out: add a student, or make it your job.
   */
  const ownerNeedsStudent = ownedBy !== 'teacher' && studentIds.length === 0

  // Blank means absent rather than empty: the server stores a blank note as
  // null, and an empty date string would not parse.
  const submit = async (values: FormData) => {
    if (ownerNeedsStudent) return

    const saved = await onSubmit({
      title: values.title.trim(),
      description: values.description.trim() || null,
      dueDate: values.dueDate || null,
      ownedBy,
      studentIds,
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

      <fieldset className='task-form__students'>
        <legend className='task-form__legend'>{form.students}</legend>
        <p className='task-form__hint'>{form.studentsHint}</p>

        {students.length === 0 && <p className='task-form__hint'>{form.noStudents}</p>}

        <div className='task-form__pills'>
          {students.map((student) => {
            const checked = studentIds.includes(student.id)
            const fill = student.color ?? NEUTRAL_STUDENT_COLOR

            return (
              <label
                key={student.id}
                className={`task-pill${checked ? ' task-pill--on' : ''}`}
                htmlFor={`task-student-${student.id}`}
                style={
                  checked ? { backgroundColor: fill, color: readableTextColor(fill) } : undefined
                }
              >
                <input
                  id={`task-student-${student.id}`}
                  type='checkbox'
                  className='task-pill__box'
                  checked={checked}
                  onChange={() => toggleStudent(student.id)}
                />
                <span className='task-pill__name'>{student.firstName}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      {/* Naming a student does not say who has to do the work, which is the
          whole reason this field exists. Radios rather than a select: three
          exclusive answers, all worth reading at once. */}
      <fieldset className='task-form__owner'>
        <legend className='task-form__legend'>{form.owner}</legend>

        <div className='task-form__owner-options'>
          {TASK_OWNERS.map((owner) => (
            <label
              key={owner}
              className={`task-owner${ownedBy === owner ? ' task-owner--on' : ''}`}
              htmlFor={`task-owner-${owner}`}
            >
              <input
                id={`task-owner-${owner}`}
                type='radio'
                name='task-owner'
                className='task-owner__box'
                checked={ownedBy === owner}
                onChange={() => setOwnedBy(owner)}
              />
              <span className='task-owner__body'>
                <span className='task-owner__label'>{OWNER_LABELS[owner]}</span>
                <span className='task-owner__hint'>{OWNER_HINTS[owner]}</span>
              </span>
            </label>
          ))}
        </div>

        {ownerNeedsStudent && (
          <p className='task-form__error' role='alert'>
            {validation.ownerNeedsStudent}
          </p>
        )}
      </fieldset>

      <div className='task-form__actions'>
        <button type='button' className='task-form__cancel' onClick={onCancel} disabled={saving}>
          {form.cancel}
        </button>
        <Button type='submit' color='cream' disabled={saving || ownerNeedsStudent}>
          {saving ? form.saving : form.save}
        </Button>
      </div>
    </form>
  )
}

export default TaskForm
