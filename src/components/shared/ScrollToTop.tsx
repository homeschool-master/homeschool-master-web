import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// Resets scroll to top on route change so navigating from the bottom of one
// page doesn't land you at the bottom of the next. Exception: navigating
// between sections inside /dashboard preserves scroll so option clicks feel
// like tabs, keeping the user's viewport anchored where they were.
const ScrollToTop = () => {
  const { pathname } = useLocation()
  const prevPathnameRef = useRef(pathname)

  useEffect(() => {
    const prev = prevPathnameRef.current
    prevPathnameRef.current = pathname

    const stayingInDashboard =
      prev.startsWith('/dashboard') && pathname.startsWith('/dashboard')

    if (!stayingInDashboard) {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return null
}

export default ScrollToTop
