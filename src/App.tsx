import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoutes from './components/app/ProtectedRoute'
import DashboardPage from './pages/app/DashboardPage'
import LoginPage from './pages/app/LoginPage'
import RegisterPage from './pages/app/RegisterPage'
import DownloadPage from './pages/marketing/DownloadPage'
import LandingPage from './pages/marketing/LandingPage'
import MarketingLayout from './components/marketing/MarketingLayout'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'
import { setUser } from './store/authSlice'
import api from './services/api'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import PricingPage from './pages/marketing/PricingPage'
import ContactPage from './pages/marketing/ContactPage'
import ForgotPasswordPage from './components/auth/ForgotPasswordPage'
import ResetPasswordPage from './components/auth/ResetPasswordPage'
import ProfileSection from './components/dashboard/ProfileSection'

import NotFoundPage from './pages/NotFoundPage'
import UnderConstructionPage from './pages/UnderConstructionPage'
import StudentsSection from './components/dashboard/StudentsSection'
import DataPrivacySection from './components/dashboard/DataPrivacySection'
import SubscriptionSection from './components/dashboard/SubscriptionSection'
import ScrollToTop from './components/shared/ScrollToTop'
import BackToTopButton from './components/shared/BakToTopButton'
import NotificationsSection from './components/dashboard/NotificationsSection'
import OnboardingPage from './pages/app/OnboardingPage'
import FeaturesPage from './pages/marketing/FeaturesPage'
import LegalPage from './pages/marketing/LegalPage'

const App = () => {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.auth.user)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    api.get('/api/v1/auth/me')
      .then((response) => {
        dispatch(setUser(response.data.data))
      })
      .catch((error) => {
        // TODO: handle session restoration errors visually (e.g. toast notification for non 401 errors)
        console.error('Session restoration failed:', error)
      })
      .finally(() => {
        setAuthLoading(false)
      })
  }, [dispatch])

  if (authLoading) return null

  const authedRedirect = user?.onboardingCompleted ? '/dashboard' : '/welcome'

  return (
    <Router>
      <ScrollToTop />
      <div className='app-shell'>
        <Navbar />
          <div className='app-shell__main'>
            <Routes>
              <Route element={<ProtectedRoutes />}>
                <Route path='/welcome' element={<OnboardingPage />} />
                <Route path='/dashboard' element={<DashboardPage />}>
                  <Route index element={<Navigate to='profile' replace />} />
                  <Route path='profile' element={<ProfileSection />} />
                  <Route path='students' element={<StudentsSection />} />
                  <Route path='subscription' element={<SubscriptionSection />} />
                  <Route path='data-privacy' element={<DataPrivacySection />} />
                  <Route path='notifications' element={<NotificationsSection />} />
                </Route>
              </Route>
              <Route element={<MarketingLayout />}>
                <Route path='/' element={<LandingPage />} />
                <Route path='/about' element={<UnderConstructionPage />} />
                <Route path='/pricing' element={<PricingPage />} />
                <Route path='/contact' element={<ContactPage />} />
                <Route path='/download' element={<DownloadPage />} />

                {/* Registered but not yet built: show the under construction page */}
                <Route path='/features' element={<FeaturesPage />} />
                <Route path='/changelog' element={<UnderConstructionPage />} />
                <Route path='/help' element={<UnderConstructionPage />} />
                <Route path='/faq' element={<UnderConstructionPage />} />
                <Route path='/free-resources' element={<UnderConstructionPage />} />
                <Route path='/blog' element={<UnderConstructionPage />} />

                <Route path='/terms' element={<LegalPage slug='terms' />} />
                <Route path='/privacy' element={<LegalPage slug='privacy' />} />
                <Route path='/cookies' element={<LegalPage slug='cookies' />} />
                <Route path='/refund' element={<LegalPage slug='refund' />} />

                <Route path='/login' element={user ? <Navigate to={authedRedirect} /> : <LoginPage />} />
                <Route path='/forgot-password' element={user ? <Navigate to={authedRedirect} /> : <ForgotPasswordPage />} />
                <Route path='/reset-password' element={user ? <Navigate to={authedRedirect} /> : <ResetPasswordPage />} />
                <Route path='/register' element={user ? <Navigate to={authedRedirect} /> : <RegisterPage />} />
              </Route>
              <Route path='*' element={<NotFoundPage />} />
            </Routes>
          </div>
        <Footer />
        <BackToTopButton />
      </div>
    </Router>
  )
}

export default App
