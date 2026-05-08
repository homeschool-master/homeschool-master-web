import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '../../services/api'
import { login } from '../../store/authSlice'
import type { AppDispatch } from '../../store'

const loginSchema = z.object({
  email: z.email({message: 'Invalid email address'}),
  password: z.string().min(1, {message: 'Password is required'}),
})

type LoginFormData = z.infer<typeof loginSchema>

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await api.post('/api/v1/auth/login', data)
      dispatch(login({
        token: response.data.accessToken,
        user: response.data.user,
      }))
      navigate('/dashboard')
    } catch (error: unknown) {
      setError('root', { message: 'Invalid email or password' })
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            type='email'
            {...register('email')}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            id='password'
            type='password'
            {...register('password')}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        {errors.root && <p>{errors.root.message}</p>}
        <button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default LoginPage
