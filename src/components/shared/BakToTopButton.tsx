import { useEffect, useState } from 'react'

// Floating button that appears once the user scrolls past the threshold and
// smooth-scrolls back to the top on click. Separate from ScrollToTop, which
// resets scroll on route change; this is for scrolling within a single page.
const SCROLL_THRESHOLD = 400

const BackToTopButton = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // sync in case the page loads already scrolled
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type='button'
      className={`back-to-top ${visible ? 'back-to-top--visible' : ''}`}
      onClick={scrollToTop}
      aria-label='Back to top'
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
        <polyline points='18 15 12 9 6 15'></polyline>
      </svg>
      <span className='back-to-top__label'>Back to Top</span>
    </button>
  )
}

export default BackToTopButton
