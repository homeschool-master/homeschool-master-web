import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import api from "../../services/api"
import { useState } from "react"

const registerSchema = z.object({
  email: z.email({message: 'Invalid email address'}),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

const RegisterPage = () => {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm <RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...registerData } = data
      await api.post('/api/v1/auth/register', registerData)
      navigate('/login')
    } catch {
      setError('root', { message: 'Registration failed. Please try again.' })
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor='email'>Enter email address</label>
          <input
            id='email'
            type='email'
            {...register('email')}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor='password'>Enter password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            id='password'
          />
          <button type='button' onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <div>
          <label htmlFor='confirm-password'>Confirm password</label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            id='confirm-password'
          />
          <button type='button' onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? 'Hide' : 'Show'}
          </button>
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>
        <div>
          <label htmlFor='first-name'>Enter first name</label>
          <input
            id='first-name'
            type='text'
            {...register('firstName')}
          />
          {errors.firstName && <p>{errors.firstName.message}</p>}
        </div>
        <div>
          <label htmlFor='last-name'>Enter last name</label>
          <input
            id='last-name'
            type='text'
            {...register('lastName')}
          />
          {errors.lastName && <p>{errors.lastName.message}</p>}
        </div>
        {errors.root && <p>{errors.root.message}</p>}
        <button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  )
}

export default RegisterPage;