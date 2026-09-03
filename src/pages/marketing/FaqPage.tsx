import { Link } from 'react-router-dom'
import { FAQ_CONTENT } from '../../constants/constants'
import Accordion from '../../components/shared/Accordion'

const FaqPage = () => {
  const { hero, groups, contact } = FAQ_CONTENT

  return (
    <div className='faq-page'>

      <section className='faq-page__hero'>
        <div className='faq-page__hero-inner'>
          <p className='faq-page__hero-eyebrow'>{hero.eyebrow}</p>
          <p className='faq-page__hero-subhead'>{hero.subhead}</p>
        </div>
      </section>

      <section className='faq-page__groups'>
        {groups.map((group) => (
          <div key={group.heading} className='faq-page__group'>
            <h2 className='faq-page__group-heading'>{group.heading}</h2>
            <Accordion items={group.items} />
          </div>
        ))}

        <p className='faq-page__contact'>
          {contact.text}{' '}
          <Link to='/contact' className='faq-page__contact-link'>{contact.linkText}</Link>
        </p>
      </section>

    </div>
  )
}

export default FaqPage
