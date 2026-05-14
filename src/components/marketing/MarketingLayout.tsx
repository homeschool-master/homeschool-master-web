import { Outlet } from 'react-router-dom'

const MarketingLayout = () => {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default MarketingLayout