import { Link, useNavigate } from 'react-router-dom'
import airplaneImage from '../assets/404plane.png'

const NotFoundPage = () => {
  const navigate = useNavigate()

  // history.state.idx is 0 on a fresh load (bookmark, external link, typed URL)
  // and greater than 0 once the user has navigated within the app this session.
  // So this only offers a back link when there's an in-app page to return to.
  const canGoBack = (window.history.state?.idx ?? 0) > 0

  return (
    <div className='not-found'>
      <section className='not-found__hero'>
        <div className='not-found__hero-inner'>
          <p className='not-found__eyebrow'>404</p>
          <h1 className='not-found__headline'>This page took a field trip</h1>
        </div>
      </section>

      <section className='not-found__body'>
        <div className='not-found__body-inner'>
          <div className='not-found__illustration' aria-hidden='true'>
            <img src={airplaneImage} alt='' />
          </div>
          <p className='not-found__subhead'>Let's get you back on track.</p>
          <Link to='/' className='button button--orange button--large'>Back to Home</Link>
          {canGoBack && (
            <button type='button' className='not-found__back' onClick={() => navigate(-1)}>
              &larr; Go back to the previous page
            </button>
          )}
        </div>
      </section>
    </div>
  )
}

export default NotFoundPage
