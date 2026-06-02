import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonColor = 'orange' | 'white' | 'black' | 'cream' | 'danger'
type ButtonSize = 'small' | 'large'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  color?: ButtonColor
  size?: ButtonSize
}

const Button = ({
  children,
  color = 'orange',
  size = 'small',
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) => {
  const classes = ['button', `button--${color}`, `button--${size}`, className].filter(Boolean).join(' ')

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  )
}

export default Button
