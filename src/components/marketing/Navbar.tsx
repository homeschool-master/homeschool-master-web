import { Link, useNavigate } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../store'
import { useDispatch, useSelector } from 'react-redux'
import { clearUser } from '../../store/authSlice'
import api from '../../services/api'

const Navbar = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await api.post('/api/v1/auth/logout')
    dispatch(clearUser())
    navigate('/login')
  }

  return (
    <nav>
      <Link to='/'>Home</Link>
      <Link to='/about'>About</Link>
      <Link to='/download'>Download</Link>
      { user ?
        <>
          <Link to='/dashboard'>Dashboard</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
        :
        <>
          <Link to='/login'>Login</Link>
          <Link to='/register'>Register</Link>
        </>
      }
    </nav>
  )
}

export default Navbar
