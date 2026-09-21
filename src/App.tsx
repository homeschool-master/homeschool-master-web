import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoutes from './components/app/ProtectedRoute'
import AppLayout from './components/app/AppLayout'
import AppShell from './components/app/AppShell'
import DashboardPage from './pages/app/DashboardPage'
import SettingsPage from './pages/app/SettingsPage'
import LoginPage from './pages/app/LoginPage'
import RegisterPage from './pages/app/RegisterPage'
import DownloadPage from './pages/marketing/DownloadPage'
import LandingPage from './pages/marketing/LandingPage'
import MarketingLayout from './components/marketing/MarketingLayout'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'
import { setUser } from './store/authSlice'
import api from './services/api'
import PricingPage from './pages/marketing/PricingPage'
import ContactPage from './pages/marketing/ContactPage'
import ForgotPasswordPage from './components/auth/ForgotPasswordPage'
import ResetPasswordPage from './components/auth/ResetPasswordPage'
import ProfileSection from './components/dashboard/ProfileSection'

import NotFoundPage from './pages/NotFoundPage'
import UnderConstructionPage from './pages/UnderConstructionPage'
import StudentsSection from './components/dashboard/StudentsSection'
import SubjectsSection from './components/dashboard/SubjectsSection'
import AssignmentTypesSection from './components/dashboard/AssignmentTypesSection'
import DataPrivacySection from './components/dashboard/DataPrivacySection'
import SubscriptionSection from './components/dashboard/SubscriptionSection'
import ScrollToTop from './components/shared/ScrollToTop'
import NotificationsSection from './components/dashboard/NotificationsSection'
import OnboardingPage from './pages/app/OnboardingPage'
import CalendarPage from './pages/app/CalendarPage'
import TasksPage from './pages/app/TasksPage'
import AssignmentsPage from './pages/app/AssignmentsPage'
import GradesPage from './pages/app/GradesPage'
import ReportCardsPage from './pages/app/ReportCardsPage'
import ReportCardPage from './pages/app/ReportCardPage'
import ReportCardPrintPage from './pages/app/ReportCardPrintPage'
import EventFormPage from './pages/app/EventFormPage'
import EventDetailPage from './pages/app/EventDetailPage'
import FeaturesPage from './pages/marketing/FeaturesPage'
import LegalPage from './pages/marketing/LegalPage'
import FaqPage from './pages/marketing/FaqPage'

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
      <Routes>
        {/* Outside the shell on purpose: a sheet meant for paper carries no
            navbar, footer or back to top control, and hiding them only at
            print time would still leave them in the preview. */}
        <Route element={<ProtectedRoutes />}>
          <Route
            path='/grades/report-cards/:cardId/print'
            element={<ReportCardPrintPage />}
          />
        </Route>

        <Route element={<AppShell />}>
              <Route element={<ProtectedRoutes />}>
                {/* Onboarding is a linear first run flow with its own exits, so
                    it stays outside the app nav: protected, but no sidebar. */}
                <Route path='/welcome' element={<OnboardingPage />} />

                <Route element={<AppLayout />}>
                  <Route path='/calendar' element={<CalendarPage />} />
                  <Route path='/calendar/new' element={<EventFormPage />} />
                  <Route path='/calendar/:id' element={<EventDetailPage />} />
                  <Route path='/calendar/:id/edit' element={<EventFormPage />} />
                  <Route path='/dashboard' element={<DashboardPage />} />
                  <Route path='/tasks' element={<TasksPage />} />
                  {/* Two sections rather than one page with a toggle:
                      Assignments is where work is set and marked, Grades is
                      where it is read back. */}
                  <Route path='/assignments' element={<AssignmentsPage />} />
                  <Route path='/grades' element={<GradesPage />} />
                  {/* Report cards live under Grades: they are the read side
                      saved out of it. */}
                  <Route path='/grades/report-cards' element={<ReportCardsPage />} />
                  <Route path='/grades/report-cards/:cardId' element={<ReportCardPage />} />

                  {/* Account settings, moved off /dashboard so that path could
                      become the dashboard the mockup describes. The nested nav
                      and its five sections are unchanged: only the parent path
                      moved, and the rows are relative links, so they followed
                      it without edits. */}
                  <Route path='/settings' element={<SettingsPage />}>
                    <Route index element={<Navigate to='profile' replace />} />
                    <Route path='profile' element={<ProfileSection />} />
                    <Route path='students' element={<StudentsSection />} />
                    <Route path='subjects' element={<SubjectsSection />} />
                    <Route path='assignment-types' element={<AssignmentTypesSection />} />
                    <Route path='subscription' element={<SubscriptionSection />} />
                    <Route path='data-privacy' element={<DataPrivacySection />} />
                    <Route path='notifications' element={<NotificationsSection />} />
                  </Route>
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
                <Route path='/faq' element={<FaqPage />} />
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
        </Route>
      </Routes>
    </Router>
  )
}

export default App
