import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoutes from './components/app/ProtectedRoute'
import DashboardPage from './pages/app/DashboardPage'
import LoginPage from './pages/app/LoginPage'
import RegisterPage from './pages/app/RegisterPage'
import AboutPage from './pages/marketing/AboutPage'
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

const App = () => {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.auth.user)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    api.get('/api/v1/auth/me')
      .then((response) => {
        dispatch(setUser(response.data.user))
      })
      .catch((error) => {
        // TODO: handle session restoration errors visually (e.g. toast notification for non-401 errors)
        console.error('Session restoration failed:', error)
      })
      .finally(() => {
        setAuthLoading(false)
      })
  }, [dispatch])

  if (authLoading) return null

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path='/dashboard' element={<DashboardPage />} />
        </Route>
        <Route element={<MarketingLayout />}>
          <Route path='/' element={<LandingPage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/pricing' element={<PricingPage />} />
          <Route path='/contact' element={<ContactPage />} />
          <Route path='/download' element={<DownloadPage />} />
          <Route path='/login' element={user ? <Navigate to='/dashboard' /> : <LoginPage />} />
          <Route path='/forgot-password' element={user ? <Navigate to='/dashboard' /> : <ForgotPasswordPage />} />
          <Route path='/reset-password' element={user ? <Navigate to='/dashboard' /> : <ResetPasswordPage />} />
          <Route path='/register' element={user ? <Navigate to='/dashboard' /> : <RegisterPage />} />
        </Route>
      </Routes>
      <Footer />
    </Router>
  )
}

export default App