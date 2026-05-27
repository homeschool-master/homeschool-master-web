import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../store'
import { clearUser } from '../../store/authSlice'
import api from '../../services/api'

const ProfileIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <circle cx='12' cy='8' r='4' /><path d='M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1' />
  </svg>
)
const FamilyIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <circle cx='9' cy='8' r='3' /><circle cx='17' cy='9' r='2.5' /><path d='M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1' /><path d='M16 14h1a4 4 0 0 1 4 4v2' />
  </svg>
)
const SubscriptionIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <circle cx='12' cy='12' r='9' /><path d='M14.5 9a2.5 2.5 0 0 0-2.5-2c-1.4 0-2.5.9-2.5 2s1.1 2 2.5 2 2.5.9 2.5 2-1.1 2-2.5 2a2.5 2.5 0 0 1-2.5-2' /><path d='M12 5v2M12 17v2' />
  </svg>
)
const DataIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <ellipse cx='12' cy='5' rx='8' ry='3' /><path d='M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5' /><path d='M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6' />
  </svg>
)
const BellIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <path d='M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9' /><path d='M13.7 21a2 2 0 0 1-3.4 0' />
  </svg>
)
const LogoutIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' /><path d='M16 17l5-5-5-5' /><path d='M21 12H9' />
  </svg>
)

const navItems = [
  { to: 'profile', label: 'Profile', Icon: ProfileIcon },
  { to: 'family', label: 'Family', Icon: FamilyIcon },
  { to: 'subscription', label: 'Subscription', Icon: SubscriptionIcon },
  { to: 'data-privacy', label: 'Data & Privacy', Icon: DataIcon },
  { to: 'notifications', label: 'Notifications', Icon: BellIcon },
]

const DashboardNav = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await api.post('/api/v1/auth/logout')
    dispatch(clearUser())
    navigate('/login')
  }

  return (
    <nav className='dashboard__nav'>
      {navItems.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `dashboard__nav-item ${isActive ? 'dashboard__nav-item--active' : ''}`
          }
        >
          <span className='dashboard__nav-icon'><Icon /></span>
          <span className='dashboard__nav-label'>{label}</span>
        </NavLink>
      ))}

      <button type='button' className='dashboard__nav-item dashboard__nav-logout' onClick={handleLogout}>
        <span className='dashboard__nav-icon'><LogoutIcon /></span>
        <span className='dashboard__nav-label'>Log Out</span>
      </button>
    </nav>
  )
}

export default DashboardNav
