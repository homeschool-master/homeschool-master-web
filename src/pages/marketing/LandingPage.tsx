import { useState } from 'react'
import { LANDING_CONTENT } from '../../constants/constants'
import foundersPhoto from '../../assets/founders.png'
import testimonial1 from '../../assets/testimonials/testimonial-1.png'
import testimonial2 from '../../assets/testimonials/testimonial-2.png'
import testimonial3 from '../../assets/testimonials/testimonial-3.png'
import screenshotMultiChild from '../../assets/screenshots/feature-multi-child.png'
import screenshotCalendar from '../../assets/screenshots/feature-calendar.png'
import screenshotTodos from '../../assets/screenshots/feature-todos.png'
import screenshotGrading from '../../assets/screenshots/feature-grading.png'
import screenshotExpenses from '../../assets/screenshots/feature-expenses.png'

const screenshots: Record<string, string> = {
  'feature-multi-child': screenshotMultiChild,
  'feature-calendar': screenshotCalendar,
  'feature-todos': screenshotTodos,
  'feature-grading': screenshotGrading,
  'feature-expenses': screenshotExpenses,
}

const testimonialPhotos: Record<string, string> = {
  'testimonial-1': testimonial1,
  'testimonial-2': testimonial2,
  'testimonial-3': testimonial3,
}

const StarRating = ({ count }: { count: number }) => (
  <div className='landing__stars'>
    {Array.from({ length: count }).map((_, i) => (
      <span key={i}>★</span>
    ))}
  </div>
)

const LandingPage = () => {
  const { hero, founders, features, testimonials, pricing, faq, ctaBanner, footer } = LANDING_CONTENT
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className='landing'>

      <section className='landing__hero'>
        <div className='landing__hero-content'>
          <h1 className='landing__hero-headline'>{hero.headline}</h1>
          <p className='landing__hero-sub'>{hero.subline1}</p>
          <p className='landing__hero-sub'>{hero.subline2}</p>
          <button className='landing__hero-cta'>{hero.getAppTxt}</button>
          <p className='landing__hero-availability'>{hero.availability}</p>
        </div>
        <div className='landing__hero-phone'>
          <img
            src={screenshots['feature-multi-child']}
            alt='Homeschool Master app'
            className='landing__hero-screenshot'
          />
        </div>
      </section>

      <section className='landing__founders'>
        <div className='landing__quote'>
          <img src={foundersPhoto} alt='Robert and Carlie, Founders' className='landing__quote-photo' />
          <div className='landing__quote-content'>
            <blockquote>{founders.quote}</blockquote>
            <p>{founders.foundersNames}</p>
          </div>
        </div>
        <div className='landing__values'>
          {founders.values.map((value) => (
            <p key={value} className='landing__value-item'>{value}</p>
          ))}
        </div>
      </section>

      <section className='landing__features'>
        <p className='landing__features-label'>{features.label}</p>
        <h2 className='landing__features-headline'>{features.headline}</h2>
        <p className='landing__features-desc'>{features.description}</p>
        {features.items.map((item, index) => (
          <div
            key={index}
            className={`landing__feature${item.reverse ? ' landing__feature--reverse' : ''}`}
          >
            <div className='landing__feature-phone'>
              <img
                src={screenshots[item.screenshot]}
                alt={item.title}
                className='landing__feature-screenshot'
              />
            </div>
            <div className='landing__feature-content'>
              <h3 className='landing__feature-title'>{item.title}</h3>
              <p className='landing__feature-subtitle'>{item.subtitle}</p>
              <p className='landing__feature-desc'>{item.description}</p>
            </div>
          </div>
        ))}
      </section>

      <section className='landing__testimonials'>
        <p className='landing__testimonials-label'>{testimonials.label}</p>
        <h2 className='landing__testimonials-headline'>{testimonials.headline}</h2>
        <div className='landing__testimonials-grid'>
          {testimonials.items.map((item, index) => (
            <div key={index} className='landing__testimonial-card'>
              <img
                src={testimonialPhotos[item.photo]}
                alt={item.name}
                className='landing__testimonial-photo'
              />
              <StarRating count={item.rating} />
              <blockquote className='landing__testimonial-quote'>{item.quote}</blockquote>
              <p className='landing__testimonial-name'>{item.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className='landing__pricing'>
        <p className='landing__pricing-label'>{pricing.label}</p>
        <h2 className='landing__pricing-headline'>{pricing.headline}</h2>
        <p className='landing__pricing-subtext'>{pricing.subtext}</p>
        <div className='landing__pricing-card'>
          <div className='landing__pricing-price'>
            <span className='landing__pricing-amount'>{pricing.price}</span>
            <div className='landing__pricing-billing'>
              <span>{pricing.billingLabel}</span>
              <span>{pricing.billingNote}</span>
            </div>
          </div>
          <ul className='landing__pricing-features'>
            {pricing.features.map((feature) => (
              <li key={feature} className='landing__pricing-feature'>{feature}</li>
            ))}
          </ul>
        </div>
        <button className='landing__hero-cta'>{pricing.getAppTxt}</button>
      </section>

      <section className='landing__faq'>
        <p className='landing__faq-label'>{faq.label}</p>
        <h2 className='landing__faq-headline'>{faq.headline}</h2>
        <div className='landing__faq-list'>
          {faq.items.map((item, index) => (
            <div key={index} className='landing__faq-item-wrapper'>
              <div className='landing__faq-item'>
                <button
                  className='landing__faq-question'
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  {index + 1}. {item.question}
                  <span className={`landing__faq-chevron${openFaq === index ? ' landing__faq-chevron--open' : ''}`}>›</span>
                </button>
              </div>
              {openFaq === index && (
                <p className='landing__faq-answer'>{item.answer}</p>
              )}
            </div>
          ))}
        </div>
        <p className='landing__faq-contact'>
          {faq.contactText} <a href='#contact'>{faq.contactLinkText}</a>
        </p>
      </section>

      <section className='landing__cta-banner'>
        <h2 className='landing__cta-banner-headline'>{ctaBanner.headline}</h2>
        <p className='landing__cta-banner-subtext'>{ctaBanner.subtext}</p>
        <button className='landing__hero-cta'>{ctaBanner.getAppTxt}</button>
        <p className='landing__hero-availability'>{ctaBanner.availability}</p>
      </section>
    </div>
  )
}

export default LandingPage
