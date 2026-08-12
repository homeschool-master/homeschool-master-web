import { Link } from 'react-router-dom'
import { DOWNLOAD_CONTENT } from '../../constants/constants'
import InstallQrCard from './InstallQRCard'

const DownloadPage = () => {
  const { hero, scan, platforms, account, help } = DOWNLOAD_CONTENT

  return (
    <div className='download-page'>

      <section className='download-page__hero'>
        <div className='download-page__hero-inner'>
          <p className='download-page__eyebrow'>{hero.eyebrow}</p>
          <h1 className='download-page__headline'>{hero.headline}</h1>
          <p className='download-page__subhead'>{hero.subhead}</p>
        </div>
      </section>

      <section className='download-page__body'>
        <div className='download-page__body-inner'>
          <h2 className='download-page__scan-heading'>{scan.heading}</h2>
          <p className='download-page__scan-subtext'>{scan.subtext}</p>

          <div className='download-page__cards'>
            {platforms.map((platform) => (
              <InstallQrCard
                key={platform.title}
                title={platform.title}
                url={platform.url}
                caption={platform.caption}
                note={platform.note}
                comingSoonText={scan.comingSoonText}
              />
            ))}
          </div>

          <p className='download-page__account-text'>{account.text}</p>
          <Link to={account.path} className='button button--large download-page__cta'>
            {account.linkText}
          </Link>

          <p className='download-page__help'>
            {help.text}{' '}
            <Link to={help.path} className='download-page__help-link'>{help.linkText}</Link>
          </p>
        </div>
      </section>
    </div>
  )
}

export default DownloadPage
