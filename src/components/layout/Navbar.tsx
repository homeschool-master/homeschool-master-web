import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import type { AppDispatch, RootState } from '../../store'
import { clearUser } from '../../store/authSlice'
import api from '../../services/api'
import logo from '../../assets/logo.png'

const Navbar = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  

  const handleLogout = async () => {
    await api.post('/api/v1/auth/logout')
    dispatch(clearUser())
    navigate('/login')
    setMenuOpen(false)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <nav className='navbar'>
      <div className='navbar__inner'>
        <Link to='/' className='navbar__logo' onClick={closeMenu}>
          <span className='navbar__logo-icon'><img src={logo} alt='Homeschool Master' /></span>
          <span className='navbar__logo-homeschool'>HOMESCHOOL</span>
          <span className='navbar__logo-master'>MASTER</span>
        </Link>
        <button 
          className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <li><Link to='/' onClick={closeMenu}>Home</Link></li>
          <li><a href='#features' onClick={closeMenu}>Features</a></li>
          <li><Link to='/pricing' onClick={closeMenu}>Pricing</Link></li>          <li><Link to='/about' onClick={closeMenu}>About Us</Link></li>
          <li><a href='#contact' onClick={closeMenu}>Contact</a></li>
          <li className='navbar__links-divider'></li>
          {user ? (
            <>
              <li><Link to='/dashboard' className='navbar__mobile-btn navbar__mobile-btn--outline' onClick={closeMenu}>Dashboard</Link></li>
              <li><button className='navbar__mobile-btn navbar__mobile-btn--filled' onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to='/login' className='navbar__mobile-btn navbar__mobile-btn--outline' onClick={closeMenu}>Log In</Link></li>
              <li><Link to='/download' className='navbar__mobile-btn navbar__mobile-btn--filled' onClick={closeMenu}>Download</Link></li>
            </>
          )}
        </ul>
        <div className='navbar__actions'>
          {user ? (
            <>
              <Link to='/dashboard' className='navbar__btn navbar__btn--outline' onClick={closeMenu}>Dashboard</Link>
              <button className='navbar__btn navbar__btn--filled' onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to='/login' className='navbar__btn navbar__btn--outline' onClick={closeMenu}>Log In</Link>
              <Link to='/download' className='navbar__btn navbar__btn--filled' onClick={closeMenu}>Download</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
