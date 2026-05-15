import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import { clearUser } from '../../store/authSlice'
import api from '../../services/api'
import logo from '../../assets/logo.png'

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
    <nav className='navbar'>
      <div className='navbar__inner'>
        <Link to='/' className='navbar__logo'>
          <span className='navbar__logo-icon'><img src={logo} alt='Homeschool Master' /></span>
          <span className='navbar__logo-homeschool'>HOMESCHOOL</span>
          <span className='navbar__logo-master'>MASTER</span>
        </Link>
        <ul className='navbar__links'>
          <li><Link to='/'>Home</Link></li>
          <li><a href='#features'>Features</a></li>
          <li><a href='#pricing'>Pricing</a></li>
          <li><Link to='/about'>About Us</Link></li>
          <li><a href='#contact'>Contact</a></li>
        </ul>
        <div className='navbar__actions'>
          {user ? (
            <>
              <Link to='/dashboard' className='navbar__btn navbar__btn--outline'>Dashboard</Link>
              <button className='navbar__btn navbar__btn--filled' onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to='/login' className='navbar__btn navbar__btn--outline'>Log In</Link>
              <Link to='/download' className='navbar__btn navbar__btn--filled'>Download</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
