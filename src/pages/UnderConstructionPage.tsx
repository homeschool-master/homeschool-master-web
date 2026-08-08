import { Link } from 'react-router-dom'

const UnderConstructionPage = () => {
  return (
    <div className='status-page'>
      <div className='status-page__inner'>
        <p className='status-page__eyebrow'>Coming Soon</p>
        <h1 className='status-page__headline'>This page is under construction</h1>
        <p className='status-page__body'>
          We're still building this part of Homeschool Master. Check back soon.
        </p>
        <Link to='/' className='status-page__link'>
          Back to home
        </Link>
      </div>
    </div>
  )
}

export default UnderConstructionPage