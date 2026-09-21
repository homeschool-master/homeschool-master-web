import type { ComponentPropsWithRef, ReactNode } from 'react'

interface FormFieldProps {
  /** Visible label, rendered above the control. */
  label: ReactNode
  /** Id of the control this labels. */
  htmlFor: string
  className?: string
  /**
   * Sits beside the label rather than inside it, for a control that belongs to
   * the field but must not become part of what the label announces: a hint
   * button inside the label would be read out as part of the field's name.
   */
  labelAfter?: ReactNode
  children: ReactNode
}

const controlClasses = (className?: string) =>
  ['form-field__control', className].filter(Boolean).join(' ')

/**
 * The app's standard field: a label above a white control with an orange
 * border, as the profile and onboarding pages render it. Pair it with
 * FormInput, FormTextarea or FormSelect so the control picks up the same
 * styling.
 */
const FormField = ({
  label,
  htmlFor,
  className = '',
  labelAfter,
  children,
}: FormFieldProps) => (
  <div className={['form-field', className].filter(Boolean).join(' ')}>
    <span className='form-field__label-row'>
      <label className='form-field__label' htmlFor={htmlFor}>
        {label}
      </label>
      {labelAfter}
    </span>
    {children}
  </div>
)

// Props carry ref through, so an uncontrolled form library can register the
// control: React 19 passes ref like any other prop.
export const FormInput = ({ className, ...rest }: ComponentPropsWithRef<'input'>) => (
  <input className={controlClasses(className)} {...rest} />
)

export const FormTextarea = ({ className, ...rest }: ComponentPropsWithRef<'textarea'>) => (
  <textarea className={controlClasses(className)} {...rest} />
)

export const FormSelect = ({ className, ...rest }: ComponentPropsWithRef<'select'>) => (
  <select className={controlClasses(className)} {...rest} />
)

export default FormField
