import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { LANDING_CONTENT } from '../../constants/constants'

const Footer = () => {
  const { footer } = LANDING_CONTENT

  return (
    <footer className='landing__footer'>
      <div className='landing__footer-inner'>
        <div className='landing__footer-brand'>
          <Link to='/' className='landing__footer-logo'>
            <img src={logo} alt='Homeschool Master' style={{ height: '24px', width: 'auto' }} />
            <span>HOMESCHOOL</span>
            <span className='landing__footer-logo-master'>MASTER</span>
          </Link>
          <p className='landing__footer-tagline'>{footer.tagline}</p>
          <div className='landing__footer-socials'>
            {footer.socials.map((social) => (
              <a key={social} href='#' className='landing__footer-social' aria-label={social}>
                {social[0].toUpperCase()}
              </a>
            ))}
          </div>
        </div>
        {footer.columns.map((col) => (
          <div key={col.heading} className='landing__footer-column'>
            <h4 className='landing__footer-column-heading'>{col.heading}</h4>
            <ul>
              {col.links.map((link) => (
                <li key={link}><a href='#'>{link}</a></li>
              ))}
            </ul>
          </div>
        ))}
        <p className='landing__footer-copyright'>{footer.copyright}</p>
      </div>
    </footer>
  )
}

export default Footer