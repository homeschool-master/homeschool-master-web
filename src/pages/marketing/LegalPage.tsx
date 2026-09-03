import { LEGAL_CONTENT } from '../../constants/constants'
import type { LegalSlug } from '../../constants/constants'

type LegalPageProps = {
  slug: LegalSlug
}

const LegalPage = ({ slug }: LegalPageProps) => {
  const { title, lastUpdated, intro, sections } = LEGAL_CONTENT[slug]

  return (
    <div className='legal-page'>

      <section className='legal-page__hero'>
        <div className='legal-page__hero-inner'>
          <h1 className='legal-page__hero-title'>{title}</h1>
          <p className='legal-page__hero-updated'>Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className='legal-page__body'>
        <div className='legal-page__body-inner'>
          <p className='legal-page__intro'>{intro}</p>

          {sections.map((section) => (
            <div key={section.heading} className='legal-page__section'>
              <h2 className='legal-page__section-heading'>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className='legal-page__paragraph'>{paragraph}</p>
              ))}
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default LegalPage
