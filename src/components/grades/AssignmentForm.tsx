import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import FormField, { FormInput, FormSelect, FormTextarea } from '../shared/FormField'
import Button from '../shared/Button'
import HintTooltip from '../shared/HintTooltip'
import { GRADES_CONTENT } from '../../constants/grades'
import { fillTemplate, formatDecimal, weightSentence } from '../../utils/grades'
import { readableTextColor } from '../../utils/studentColor'
import type { Assignment, AssignmentInput, AssignmentType, Student, Subject } from '../../types'

const { form, validation } = GRADES_CONTENT

/** The fill behind a student with no colour of their own. */
const NEUTRAL_STUDENT_COLOR = '#ecbb77'

/**
 * Both numbers arrive from the control as strings. Validating the string and
 * converting once on submit keeps a half typed "1." from being read as a
 * number mid keystroke, which is what makes a number input fight the typist.
 */
const decimalField = (message: string, allowZero: boolean) =>
  z
    .string()
    .trim()
    .refine(
      (value) => {
        const parsed = Number(value)
        if (value === '' || !Number.isFinite(parsed)) return false

        return allowZero ? parsed >= 0 : parsed > 0
      },
      { message }
    )

const schema = z.object({
  subjectId: z.string().trim().min(1, { message: validation.subject }),
  assignmentTypeId: z.string().trim().min(1, { message: validation.assignmentType }),
  title: z.string().trim().min(1, { message: validation.title }).max(255, {
    message: validation.titleLength,
  }),
  description: z.string(),
  dueDate: z.string(),
  pointsPossible: decimalField(validation.pointsPossible, false),
  weight: decimalField(validation.weight, true),
})

type FormData = z.infer<typeof schema>

interface AssignmentFormProps {
  /** The assignment being edited, or null when adding. */
  assignment: Assignment | null
  subjects: Subject[]
  assignmentTypes: AssignmentType[]
  students: Student[]
  studentsLoading: boolean
  saving: boolean
  onSubmit: (values: AssignmentInput) => Promise<boolean>
  onCancel: () => void
}

/**
 * Everything about the work itself, and who holds it. Marks are deliberately
 * not here: a score box per student would double the height of a form a
 * teacher opens to fix a due date, and marking is its own job done from the
 * row.
 */
const AssignmentForm = ({
  assignment,
  subjects,
  assignmentTypes,
  students,
  studentsLoading,
  saving,
  onSubmit,
  onCancel,
}: AssignmentFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      subjectId: assignment?.subjectId ?? '',
      // A new assignment opens on the first type offered, which is the built in
      // Assignment, so the weight below starts from a real default rather than
      // from an empty box.
      assignmentTypeId: assignment?.assignmentTypeId ?? assignmentTypes[0]?.id ?? '',
      title: assignment?.title ?? '',
      description: assignment?.description ?? '',
      dueDate: assignment?.dueDate ?? '',
      // The server's own defaults, so an untouched form saves what it shows.
      pointsPossible: assignment?.pointsPossible ?? '100',
      // New work takes its type's default rather than a hardcoded 1, which is
      // the whole point of a type carrying one. Existing work keeps its own.
      weight: assignment?.weight ?? formatDecimal(assignmentTypes[0]?.defaultWeight ?? '1'),
    },
  })

  // Subscribed rather than read during render: watch() reads the live value on
  // every render, which the React compiler cannot follow, while useWatch
  // re-renders this field alone when the number changes.
  const weightValue = useWatch({ control, name: 'weight' })
  const typeId = useWatch({ control, name: 'assignmentTypeId' })
  const selectedType = assignmentTypes.find((type) => type.id === typeId) ?? null

  /**
   * Picking a type moves the weight box to that type's default. Done on the
   * change event rather than in an effect, so it happens once, when she picks,
   * and a number she then types over is hers and stays.
   */
  const applyTypeDefault = (nextTypeId: string) => {
    const next = assignmentTypes.find((type) => type.id === nextTypeId)
    if (next) setValue('weight', formatDecimal(next.defaultWeight), { shouldValidate: true })
  }

  /**
   * Whether the number in the box is the type's or the teacher's. The server
   * decides this the same way on save, by comparing the two, so what the form
   * says will be what is recorded.
   */
  const weightMatchesType =
    selectedType !== null && Number(weightValue) === Number(selectedType.defaultWeight)

  // Held outside react-hook-form: a set of checkboxes is a set, and threading
  // it through the resolver buys nothing when the server accepts an empty one.
  const [studentIds, setStudentIds] = useState<string[]>(
    () => assignment?.grades.map((grade) => grade.studentId) ?? []
  )

  const toggleStudent = (id: string) => {
    setStudentIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    )
  }

  // Unassigning deletes the mark with the row, so the warning only appears
  // when there is actually a mark about to go with it.
  const losingMarks =
    assignment !== null &&
    assignment.grades.some((grade) => grade.graded && !studentIds.includes(grade.studentId))

  const submit = async (values: FormData) => {
    const saved = await onSubmit({
      subjectId: values.subjectId,
      assignmentTypeId: values.assignmentTypeId,
      title: values.title.trim(),
      description: values.description.trim() || null,
      dueDate: values.dueDate || null,
      pointsPossible: Number(values.pointsPossible),
      weight: Number(values.weight),
      studentIds,
    })
    if (saved) onCancel()
  }

  return (
    <form className='assignment-form' onSubmit={handleSubmit(submit)}>
      <p className='assignment-form__title'>{assignment ? form.editTitle : form.addTitle}</p>

      <FormField label={form.subject} htmlFor='assignment-subject'>
        <FormSelect
          id='assignment-subject'
          className={errors.subjectId ? 'form-field__control--error' : ''}
          {...register('subjectId')}
        >
          <option value=''>{form.subjectPlaceholder}</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </FormSelect>
        {errors.subjectId && (
          <p className='assignment-form__error' role='alert'>
            {errors.subjectId.message}
          </p>
        )}
      </FormField>

      <FormField label={form.assignmentType} htmlFor='assignment-type'>
        <FormSelect
          id='assignment-type'
          className={errors.assignmentTypeId ? 'form-field__control--error' : ''}
          {...register('assignmentTypeId', {
            onChange: (changeEvent: React.ChangeEvent<HTMLSelectElement>) =>
              applyTypeDefault(changeEvent.target.value),
          })}
        >
          {assignmentTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </FormSelect>
        {errors.assignmentTypeId && (
          <p className='assignment-form__error' role='alert'>
            {errors.assignmentTypeId.message}
          </p>
        )}
        <p className='assignment-form__hint'>{form.assignmentTypeHint}</p>
      </FormField>

      <FormField label={form.title} htmlFor='assignment-title'>
        <FormInput
          id='assignment-title'
          type='text'
          autoComplete='off'
          placeholder={form.titlePlaceholder}
          className={errors.title ? 'form-field__control--error' : ''}
          {...register('title')}
        />
        {errors.title && (
          <p className='assignment-form__error' role='alert'>
            {errors.title.message}
          </p>
        )}
      </FormField>

      <FormField label={form.description} htmlFor='assignment-description'>
        <FormTextarea
          id='assignment-description'
          rows={2}
          placeholder={form.descriptionPlaceholder}
          {...register('description')}
        />
      </FormField>

      <FormField label={form.dueDate} htmlFor='assignment-due-date'>
        <FormInput id='assignment-due-date' type='date' {...register('dueDate')} />
        <p className='assignment-form__hint'>{form.dueDateHint}</p>
      </FormField>

      <div className='assignment-form__numbers'>
        <FormField label={form.pointsPossible} htmlFor='assignment-points'>
          <FormInput
            id='assignment-points'
            type='number'
            min='0'
            step='any'
            inputMode='decimal'
            className={errors.pointsPossible ? 'form-field__control--error' : ''}
            {...register('pointsPossible')}
          />
          {errors.pointsPossible && (
            <p className='assignment-form__error' role='alert'>
              {errors.pointsPossible.message}
            </p>
          )}
          <p className='assignment-form__hint'>{form.pointsPossibleHint}</p>
        </FormField>

        <FormField
          label={form.weight}
          htmlFor='assignment-weight'
          labelAfter={
            <HintTooltip text={form.weightTooltip} label={form.weightTooltipLabel} align='start' />
          }
        >
          <FormInput
            id='assignment-weight'
            type='number'
            min='0'
            step='any'
            inputMode='decimal'
            className={errors.weight ? 'form-field__control--error' : ''}
            {...register('weight')}
          />
          {errors.weight && (
            <p className='assignment-form__error' role='alert'>
              {errors.weight.message}
            </p>
          )}
          <p className='assignment-form__hint'>{form.weightHint}</p>
          {/* The number restated as what it does, updating as it is typed: a
              bare "2" means nothing to a teacher new to weighting. */}
          <p className='assignment-form__weight-says' aria-live='polite'>
            {weightSentence(weightValue)}
          </p>
          {/* Which of the two this number is, said in the open. Without it a
              teacher has no way to know whether changing what Tests count
              later will move this piece of work or leave it where she put it. */}
          {selectedType && (
            <p className='assignment-form__weight-source'>
              {fillTemplate(
                weightMatchesType ? form.weightFromType : form.weightOverridden,
                { name: selectedType.name }
              )}
            </p>
          )}
        </FormField>
      </div>

      <fieldset className='assignment-form__students'>
        <legend className='assignment-form__legend'>{form.students}</legend>
        <p className='assignment-form__hint'>{form.studentsHint}</p>

        {studentsLoading && <p className='assignment-form__status'>{form.loadingStudents}</p>}
        {!studentsLoading && students.length === 0 && (
          <p className='assignment-form__status'>{form.noStudents}</p>
        )}

        <div className='assignment-form__pills'>
          {students.map((student) => {
            const checked = studentIds.includes(student.id)
            const fill = student.color ?? NEUTRAL_STUDENT_COLOR

            return (
              <label
                key={student.id}
                className={`assignment-pill${checked ? ' assignment-pill--on' : ''}`}
                htmlFor={`assignment-student-${student.id}`}
                style={
                  checked ? { backgroundColor: fill, color: readableTextColor(fill) } : undefined
                }
              >
                <input
                  id={`assignment-student-${student.id}`}
                  type='checkbox'
                  className='assignment-pill__box'
                  checked={checked}
                  onChange={() => toggleStudent(student.id)}
                />
                <span className='assignment-pill__name'>
                  {student.firstName} {student.lastName}
                </span>
              </label>
            )
          })}
        </div>

        {losingMarks && (
          <p className='assignment-form__warning' role='alert'>
            {form.removalWarning}
          </p>
        )}
      </fieldset>

      <div className='assignment-form__actions'>
        <button
          type='button'
          className='assignment-form__cancel'
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

export default AssignmentForm
