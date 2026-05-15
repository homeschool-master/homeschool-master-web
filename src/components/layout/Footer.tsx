import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { LANDING_CONTENT } from '../../constants/constants'

const Footer = () => {
  const { footer } = LANDING_CONTENT

  return (
    <footer className='footer'>
      <div className='footer__main'>
        <div className='footer__inner'>
          <div className='footer__brand'>
            <Link to='/' className='footer__logo'>
              <img src={logo} alt='Homeschool Master' />
              <span className='footer__logo-homeschool'>HOMESCHOOL</span>
              <span className='footer__logo-master'>MASTER</span>
            </Link>
            <p className='footer__tagline'>{footer.tagline}</p>
            <div className='footer__socials'>
              {footer.socials.map((social) => (
                <a key={social} href='#' className='footer__social' aria-label={social}>
                  {social[0].toUpperCase()}
                </a>
              ))}
            </div>
          </div>
          {footer.columns.map((col) => (
            <div key={col.heading} className='footer__column'>
              <h4 className='footer__column-heading'>{col.heading}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link}><a href='#'>{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
          <div className='footer__newsletter'>
            <h4 className='footer__column-heading'>{footer.newsletter.heading}</h4>
            <p className='footer__newsletter-subtext'>{footer.newsletter.subtext}</p>
            <div className='footer__newsletter-form'>
              <input
                type='email'
                placeholder={footer.newsletter.placeholder}
                className='footer__newsletter-input'
              />
              <button className='footer__newsletter-btn'>{footer.newsletter.buttonText}</button>
            </div>
          </div>
        </div>
      </div>
      <div className='footer__bottom'>
        <div className='footer__bottom-inner'>
          <p className='footer__copyright'>{footer.copyright}</p>
          <div className='footer__legal'>
            {footer.legalLinks.map((link, index) => (
              <span key={link}>
                <a href='#'>{link}</a>
                {index < footer.legalLinks.length - 1 && <span className='footer__legal-dot'> · </span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer