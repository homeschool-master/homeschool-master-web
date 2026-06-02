import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// On a single-page app, the browser keeps the previous scroll position when the
// route changes, so navigating from the bottom of one page lands you at the
// bottom of the next. This resets to the top whenever the path changes.
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
