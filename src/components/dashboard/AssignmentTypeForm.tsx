import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import FormField, { FormInput } from '../shared/FormField'
import Button from '../shared/Button'
import HintTooltip from '../shared/HintTooltip'
import { ASSIGNMENT_TYPES_CONTENT } from '../../constants/assignmentTypes'
import { GRADES_CONTENT } from '../../constants/grades'
import { fillTemplate, formatDecimal, isLargeWeight, weightSentence } from '../../utils/grades'
import type { AssignmentType } from '../../types'

const { form, validation, builtInBadge } = ASSIGNMENT_TYPES_CONTENT

/** Values a teacher typed, before the apply mode question is asked. */
export interface TypeFormValues {
  name: string
  defaultWeight: number
  /** True when the weight moved, which is what makes the question worth asking. */
  weightChanged: boolean
}

const schema = z.object({
  name: z.string().trim().min(1, { message: validation.name }).max(100, {
    message: validation.nameLength,
  }),
  defaultWeight: z
    .string()
    .trim()
    .refine(
      (value) => {
        const parsed = Number(value)
        return value !== '' && Number.isFinite(parsed) && parsed >= 0
      },
      { message: validation.weight }
    ),
})

type FormData = z.infer<typeof schema>

interface AssignmentTypeFormProps {
  /** The type being edited, or null when adding. */
  assignmentType: AssignmentType | null
  saving: boolean
  onSubmit: (values: TypeFormValues) => void
  onCancel: () => void
}

/**
 * A type's name and what it counts by default.
 *
 * A built in type keeps its name: work already filed under Test reads by that
 * name, and renaming it underneath would rewrite the record rather than the
 * label. Its default weight is the whole point of the screen, so that stays
 * editable.
 */
const AssignmentTypeForm = ({
  assignmentType,
  saving,
  onSubmit,
  onCancel,
}: AssignmentTypeFormProps) => {
  const builtIn = assignmentType?.isBuiltIn ?? false

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      name: assignmentType?.name ?? '',
      // Every type starts counting once, built in and custom alike.
      defaultWeight: formatDecimal(assignmentType?.defaultWeight ?? '1'),
    },
  })

  // Subscribed rather than read during render: watch() reads the live value on
  // every render, which the React compiler cannot follow.
  const weightValue = useWatch({ control, name: 'defaultWeight' })

  const submit = (values: FormData) => {
    const weight = Number(values.defaultWeight)

    onSubmit({
      name: values.name.trim(),
      defaultWeight: weight,
      weightChanged:
        assignmentType !== null && weight !== Number(assignmentType.defaultWeight),
    })
  }

  return (
    <form className='subject-form' onSubmit={handleSubmit(submit)}>
      <p className='subject-form__title'>
        {assignmentType ? form.editTitle : form.addTitle}
        {builtIn && <span className='assignment-type__badge'>{builtInBadge}</span>}
      </p>

      <FormField label={form.name} htmlFor='assignment-type-name'>
        <FormInput
          id='assignment-type-name'
          type='text'
          autoComplete='off'
          placeholder={form.namePlaceholder}
          readOnly={builtIn}
          className={errors.name ? 'form-field__control--error' : ''}
          {...register('name')}
        />
        {errors.name && (
          <p className='subject-form__error' role='alert'>
            {errors.name.message}
          </p>
        )}
        {builtIn && <p className='subject-form__hint'>{form.nameBuiltInHint}</p>}
      </FormField>

      <FormField
        label={form.defaultWeight}
        htmlFor='assignment-type-weight'
        labelAfter={
          <HintTooltip
            text={GRADES_CONTENT.form.weightTooltip}
            label={GRADES_CONTENT.form.weightTooltipLabel}
            align='start'
          />
        }
      >
        <FormInput
          id='assignment-type-weight'
          type='number'
          min='0'
          step='any'
          inputMode='decimal'
          className={errors.defaultWeight ? 'form-field__control--error' : ''}
          {...register('defaultWeight')}
        />
        {errors.defaultWeight && (
          <p className='subject-form__error' role='alert'>
            {errors.defaultWeight.message}
          </p>
        )}
        {/* The same warning the assignment form gives, for the same typo: a
            default of 30 makes every new piece of work of this kind swallow
            the average. It warns and does not block. */}
        {isLargeWeight(weightValue) && (
          <p className='assignment-form__weight-warning' role='status'>
            {fillTemplate(form.weightLarge, { factor: formatDecimal(weightValue) })}
          </p>
        )}

        {/* The number said as what it does, updating as it is typed. */}
        <p className='assignment-form__weight-says' aria-live='polite'>
          {weightSentence(weightValue)}
        </p>
      </FormField>

      <div className='subject-form__actions'>
        <button type='button' className='subject-form__cancel' onClick={onCancel} disabled={saving}>
          {form.cancel}
        </button>
        <Button type='submit' color='cream' disabled={saving}>
          {saving ? form.saving : form.save}
        </Button>
      </div>
    </form>
  )
}

export default AssignmentTypeForm
