import { Outlet } from 'react-router-dom'
import Footer from './Footer'

const MarketingLayout = () => {
  return (
    <div>
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MarketingLayout