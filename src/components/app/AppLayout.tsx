import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AppSidebar from './AppSidebar'
import { SidebarSlotContext } from './sidebarSlot'

/**
 * Layout route for the authenticated app: the section sidebar on the left, the
 * page on the right. The marketing navbar and footer stay where they are, one
 * level up in the shell.
 */
const AppLayout = () => {
  // Captured through a ref callback rather than an effect, so the node is
  // published on the same commit that creates it.
  const [sidebarSlot, setSidebarSlot] = useState<HTMLElement | null>(null)

  return (
    <div className='app-layout'>
      <div className='app-layout__sidebar'>
        <AppSidebar />
        {/* Pages that own a sidebar panel portal into this slot. */}
        <div ref={setSidebarSlot} />
      </div>
      <div className='app-layout__content'>
        <SidebarSlotContext.Provider value={sidebarSlot}>
          <Outlet />
        </SidebarSlotContext.Provider>
      </div>
    </div>
  )
}

export default AppLayout
