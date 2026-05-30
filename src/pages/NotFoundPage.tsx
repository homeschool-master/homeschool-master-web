import { Link } from 'react-router-dom'
import airplaneImage from '../assets/404plane.png'

const NotFoundPage = () => {
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
        </div>
      </section>
    </div>
  )
}

export default NotFoundPage
