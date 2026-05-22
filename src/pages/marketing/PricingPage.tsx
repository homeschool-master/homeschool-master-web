import { PRICING_CONTENT } from '../../constants/constants'
import Button from '../../components/shared/Button'
import Accordion from '../../components/shared/accordion'

// Inline SVG icons : placeholder set, Carlie's Canva assets will replace these later
const PricingIcon = ({ name }: { name: string }) => {
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
    case 'no-contract':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
          <circle cx='12' cy='12' r='9' /><line x1='6' y1='6' x2='18' y2='18' />
        </svg>
      )
    case 'no-ads':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
          <circle cx='12' cy='12' r='9' />
          <text x='12' y='15' fill='currentColor' stroke='none' fontSize='8' fontWeight='800' textAnchor='middle'>AD</text>
          <line x1='6' y1='6' x2='18' y2='18' />
        </svg>
      )
    case 'data':
      return (
        <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
          <circle cx='8' cy='8' r='3' /><circle cx='16' cy='8' r='3' />
          <path d='M2 20c0-3.5 2.5-6 6-6s6 2.5 6 6zm8 0c0-3.5 2.5-6 6-6s6 2.5 6 6z' />
        </svg>
      )
    case 'family-owned':
      return (
        <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
          <path d='M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z' />
          <circle cx='9' cy='11' r='1.5' fill='#fff' /><circle cx='15' cy='11' r='1.5' fill='#fff' />
          <circle cx='12' cy='14' r='1.2' fill='#fff' />
        </svg>
      )
    default:
      return null
  }
}

const PricingPage = () => {
  const { hero, plan, whatYouGet, trustStrip, faq, finalCta } = PRICING_CONTENT

  return (
    <div className='pricing-page'>

      <section className='pricing-page__hero'>
        <div className='pricing-page__hero-inner'>
          <p className='pricing-page__hero-eyebrow'>{hero.eyebrow}</p>
          <p className='pricing-page__hero-subhead'>{hero.subhead}</p>
        </div>
      </section>

      <section className='pricing-page__plan'>
        <div className='pricing-page__plan-inner'>
          <div className='pricing-page__plan-layout'>
            <div className='pricing-page__plan-card'>
              <h2 className='pricing-page__plan-name'>{plan.name}</h2>
              <p className='pricing-page__plan-price'>{plan.price}</p>
              <p className='pricing-page__plan-billing'>{plan.billingLabel}</p>
              <p className='pricing-page__plan-annual'>{plan.annualNote}</p>
            </div>
            <div className='pricing-page__plan-included'>
              <h3 className='pricing-page__plan-included-heading'>{plan.includedHeading}</h3>
              <ul className='pricing-page__plan-included-list'>
                {plan.included.map((item) => (
                  <li key={item} className='pricing-page__plan-included-item'>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className='pricing-page__plan-cta'>
            <Button>{plan.ctaText}</Button>
            <p className='pricing-page__plan-cancel'>{plan.cancelNote}</p>
          </div>
        </div>
      </section>

      <section className='pricing-page__what-you-get'>
        <div className='pricing-page__what-you-get-inner'>
          <p className='pricing-page__what-you-get-eyebrow'>{whatYouGet.eyebrow}</p>
          <h2 className='pricing-page__what-you-get-headline'>{whatYouGet.headline}</h2>
          <div className='pricing-page__feature-grid'>
            {whatYouGet.items.map((card) => (
              <div key={card.title} className='pricing-page__feature-card'>
                <div className='pricing-page__feature-icon'>
                  <PricingIcon name={card.icon} />
                </div>
                <h3 className='pricing-page__feature-title'>{card.title}</h3>
                <ul className='pricing-page__feature-list'>
                  {card.bullets.map((bullet) => (
                    <li key={bullet} className='pricing-page__feature-bullet'>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='pricing-page__trust'>
        <div className='pricing-page__trust-inner'>
          {trustStrip.items.map((item) => (
            <div key={item.title} className='pricing-page__trust-item'>
              <div className='pricing-page__trust-icon'>
                <PricingIcon name={item.icon} />
              </div>
              <h4 className='pricing-page__trust-title'>{item.title}</h4>
              <p className='pricing-page__trust-subtext'>{item.subtext}</p>
            </div>
          ))}
        </div>
      </section>

      <Accordion
        eyebrow={faq.eyebrow}
        headline={faq.headline}
        items={faq.items}
        contactText={faq.contactText}
        contactLinkText={faq.contactLinkText}
      />

      <section className='pricing-page__final-cta'>
        <div className='pricing-page__final-cta-inner'>
          <h2 className='pricing-page__final-cta-headline'>{finalCta.headline}</h2>
          <p className='pricing-page__final-cta-subhead'>{finalCta.subhead}</p>
          <Button>{finalCta.ctaText}</Button>
          <p className='pricing-page__final-cta-availability'>{finalCta.availability}</p>
        </div>
      </section>

    </div>
  )
}

export default PricingPage
