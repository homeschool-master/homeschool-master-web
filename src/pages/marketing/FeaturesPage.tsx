import { FEATURES_CONTENT } from '../../constants/constants'

// Inline SVG icons : placeholder set, Carlie's Canva assets will replace these later
const FeatureIcon = ({ name }: { name: string }) => {
  switch (name) {
    case 'family':
      return (
        <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
          <circle cx='7' cy='8' r='3' /><circle cx='17' cy='8' r='3' /><circle cx='12' cy='6' r='2.5' />
          <path d='M2 20c0-3 2-5 5-5s5 2 5 5zm10 0c0-3 2-5 5-5s5 2 5 5zM7 20c0-3 2-5 5-5s5 2 5 5z' />
        </svg>
      )
    case 'calendar':
      return (
        <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
          <path d='M19 4h-2V2h-2v2H9V2H7v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14zM5 8V6h14v2z' />
        </svg>
      )
    case 'grades':
      return (
        <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
          <path d='M6 2h9l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm8 1v5h5z' />
          <text x='12' y='17' fill='#fff' fontSize='8' fontWeight='800' textAnchor='middle'>A+</text>
        </svg>
      )
    case 'reports':
      return (
        <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
          <path d='M5 3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H7a2 2 0 0 1-2-2V3zm12 16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H7v12h10zM9 8h6v1.5H9zm0 3h6v1.5H9zm0 3h4v1.5H9z' />
        </svg>
      )
    case 'expenses':
      return (
        <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
          <path d='M6 2v20l2-1.5L10 22l2-1.5L14 22l2-1.5L18 22V2zm9 6H9V6.5h6zm0 3H9V9.5h6zm-3 3H9v-1.5h3z' />
        </svg>
      )
    case 'trust':
      return (
        <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
          <path d='M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5z' />
          <path d='m10.5 14.5-2.5-2.5 1-1 1.5 1.5 4-4 1 1z' fill='#fff' />
        </svg>
      )
    default:
      return null
  }
}

const FeaturesPage = () => {
  const { hero, whatYouGet } = FEATURES_CONTENT

  return (
    <div className='features-page'>

      <section className='features-page__hero'>
        <div className='features-page__hero-inner'>
          <p className='features-page__hero-eyebrow'>{hero.eyebrow}</p>
          <p className='features-page__hero-subhead'>{hero.subhead}</p>
        </div>
      </section>

      <section className='features-page__what-you-get'>
        <div className='features-page__what-you-get-inner'>
          <p className='features-page__what-you-get-eyebrow'>{whatYouGet.eyebrow}</p>
          <h2 className='features-page__what-you-get-headline'>{whatYouGet.headline}</h2>
          <div className='features-page__feature-grid'>
            {whatYouGet.items.map((card) => (
              <div key={card.title} className='features-page__feature-card'>
                <div className='features-page__feature-icon'>
                  <FeatureIcon name={card.icon} />
                </div>
                <h3 className='features-page__feature-title'>{card.title}</h3>
                <ul className='features-page__feature-list'>
                  {card.bullets.map((bullet) => (
                    <li key={bullet} className='features-page__feature-bullet'>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

export default FeaturesPage
