import type { ReactNode } from 'react'
import { STUDENT_COLORS } from '../../constants/onboarding'

interface ColorPickerProps {
  /** Groups the radios, so two pickers on one page stay separate. */
  name: string
  /** The selected hex, or an empty string for none. */
  value: string
  onChange: (hex: string) => void
  onBlur?: () => void
  legend: string
  hint: string
  /**
   * Rendered inside the fieldset under the swatches, for whatever the caller
   * wants to show about the choice: the student form previews the chip its
   * colour will become.
   */
  children?: ReactNode
}

/**
 * The app's one palette. A student and a subject both carry a colour and both
 * pick it from here, so a second list of swatches never has to be kept in step
 * with this one. The classes stay on the dashboard block because that is where
 * both forms live.
 */
const ColorPicker = ({
  name,
  value,
  onChange,
  onBlur,
  legend,
  hint,
  children,
}: ColorPickerProps) => (
  <fieldset className='dashboard__color-field'>
    <legend className='dashboard__color-legend'>{legend}</legend>
    <p className='dashboard__color-hint'>{hint}</p>

    <div className='dashboard__color-swatches'>
      {STUDENT_COLORS.map((option) => (
        <label
          key={option.value}
          className={`dashboard__color-swatch${
            value === option.hex ? ' dashboard__color-swatch--selected' : ''
          }`}
          title={option.label}
        >
          <input
            type='radio'
            className='dashboard__color-input'
            name={name}
            value={option.hex}
            checked={value === option.hex}
            onChange={() => onChange(option.hex)}
            onBlur={onBlur}
          />
          <span
            className='dashboard__color-dot'
            style={{ backgroundColor: option.hex }}
            aria-hidden='true'
          />
          <span className='dashboard__color-name'>{option.label}</span>
        </label>
      ))}
    </div>

    {children}
  </fieldset>
)

export default ColorPicker
