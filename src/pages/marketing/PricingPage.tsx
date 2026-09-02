import { PRICING_CONTENT } from '../../constants/constants'
import Button from '../../components/shared/Button'
import Accordion from '../../components/shared/Accordion'

// Inline SVG icons : placeholder set, Carlie's Canva assets will replace these later
const PricingIcon = ({ name }: { name: string }) => {
  switch (name) {
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
  const { hero, plan, trustStrip, faq, finalCta } = PRICING_CONTENT

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
