import { useState } from 'react'
import { Link } from 'react-router-dom'

interface AccordionItem {
  label: string
  content: string
}

interface AccordionProps {
  eyebrow?: string
  headline?: string
  items: AccordionItem[]
  contactText?: string
  contactLinkText?: string
  contactHref?: string
}

const Accordion = ({
  eyebrow,
  headline,
  items,
  contactText,
  contactLinkText,
  contactHref = '/contact',
}: AccordionProps) => {
  const [openItem, setOpenItem] = useState<number | null>(null)

  return (
    <section className='accordion'>
      <div className='accordion__inner'>
        {eyebrow && <p className='accordion__eyebrow'>{eyebrow}</p>}
        {headline && <h2 className='accordion__headline'>{headline}</h2>}
        <div className='accordion__list'>
          {items.map((item, index) => (
            <div key={item.label} className='accordion__item-wrapper'>
              <div className='accordion__item'>
                <button
                  className='accordion__label'
                  onClick={() => setOpenItem(openItem === index ? null : index)}
                >
                  {index + 1}. {item.label}
                  <span className={`accordion__chevron${openItem === index ? ' accordion__chevron--open' : ''}`}>›</span>
                </button>
              </div>
              {openItem === index && (
                <p className='accordion__content'>{item.content}</p>
              )}
            </div>
          ))}
        </div>
        {(contactText || contactLinkText) && (
          <p className='accordion__contact'>
            {contactText && `${contactText} `}
            {contactLinkText && <Link to={contactHref}>{contactLinkText}</Link>}
          </p>
        )}
      </div>
    </section>
  )
}

export default Accordion
