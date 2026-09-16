import { Outlet } from 'react-router-dom'
import AppSidebar from './AppSidebar'

/**
 * Layout route for the authenticated app: the section sidebar on the left, the
 * page on the right. The marketing navbar and footer stay where they are, one
 * level up in the shell.
 */
const AppLayout = () => (
  <div className='app-layout'>
    <div className='app-layout__sidebar'>
      <AppSidebar />
    </div>
    <div className='app-layout__content'>
      <Outlet />
    </div>
  </div>
)

export default AppLayout
