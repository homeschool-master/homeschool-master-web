import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import ProtectedRoutes from './components/app/ProtectedRoute'
import DashboardPage from './pages/app/DashboardPage'
import LoginPage from './pages/app/LoginPage'
import RegisterPage from './pages/app/RegisterPage'
import AboutPage from './pages/marketing/AboutPage'
import DownloadPage from './pages/marketing/DownloadPage'
import LandingPage from './pages/marketing/LandingPage'

const App = () => {
  return (
    <Router>
        <Routes>
          <Route element={<ProtectedRoutes/>}>
              <Route path='/dashboard' element={<DashboardPage/>} />
          </Route>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/about' element={<AboutPage/>}/>
          <Route path='/download' element={<DownloadPage/>}/>
          <Route path='/' element={<LandingPage/>}/>
        </Routes>
    </Router>
  )
}

export default App
