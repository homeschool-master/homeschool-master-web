import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

interface FormFieldProps {
  /** Visible label, rendered above the control. */
  label: ReactNode
  /** Id of the control this labels. */
  htmlFor: string
  className?: string
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
const FormField = ({ label, htmlFor, className = '', children }: FormFieldProps) => (
  <div className={['form-field', className].filter(Boolean).join(' ')}>
    <label className='form-field__label' htmlFor={htmlFor}>
      {label}
    </label>
    {children}
  </div>
)

export const FormInput = ({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) => (
  <input className={controlClasses(className)} {...rest} />
)

export const FormTextarea = ({
  className,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className={controlClasses(className)} {...rest} />
)

export const FormSelect = ({ className, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select className={controlClasses(className)} {...rest} />
)

export default FormField
