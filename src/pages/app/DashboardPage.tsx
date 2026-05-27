import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import type { RootState } from '../../store'
import DashboardNav from '../../components/dashboard/DashboardNav'

const DashboardPage = () => {
  const user = useSelector((state: RootState) => state.auth.user)

  if (!user) return null

  const firstName = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)

  return (
    <div className='dashboard'>
      <section className='dashboard__hero'>
        <div className='dashboard__hero-inner'>
          <p className='dashboard__hero-eyebrow'>Account</p>
          <h1 className='dashboard__hero-headline'>Account Settings</h1>
          <p className='dashboard__hero-subhead'>
            Welcome back, {firstName}.<br />
            Manage your account, subscription, and preferences here.
          </p>
        </div>
      </section>

      <section className='dashboard__body'>
        <div className='dashboard__body-inner'>
          <DashboardNav />
          <div className='dashboard__content'>
            <Outlet />
          </div>
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
