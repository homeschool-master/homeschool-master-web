import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import ProtectedRoutes from './components/app/ProtectedRoute'
import DashboardPage from './pages/app/DashboardPage'
import LoginPage from './pages/app/LoginPage'
import RegisterPage from './pages/app/RegisterPage'
import AboutPage from './pages/marketing/AboutPage'
import DownloadPage from './pages/marketing/DownloadPage'
import LandingPage from './pages/marketing/LandingPage'
import MarketingLayout from './components/marketing/MarketingLayout'
import { useSelector } from 'react-redux'
import type { RootState } from './store'

const App = () => {
  const token = useSelector((state: RootState) => state.auth.token)

  return (
    <Router>
        <Routes>
          <Route element={<ProtectedRoutes/>}>
              <Route path='/dashboard' element={<DashboardPage/>} />
          </Route>
            <Route element={<MarketingLayout />} >
            <Route path='/login' element={token ? <Navigate to='/dashboard' /> : <LoginPage />} />
            <Route path='/register' element={token ? <Navigate to='/dashboard' /> : <RegisterPage />} />
            <Route path='/about' element={<AboutPage/>}/>
            <Route path='/download' element={<DownloadPage/>}/>
            <Route path='/' element={<LandingPage/>}/>
          </Route>
        </Routes>
    </Router>
  )
}

export default App
