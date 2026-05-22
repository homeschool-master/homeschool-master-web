import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CONTACT_CONTENT } from '../../constants/constants'
import Accordion from '../../components/shared/accordion'
import Button from '../../components/shared/Button'
import foundersPhoto from '../../assets/founders.png'

const contactSchema = z.object({
  name: z.string().min(1, { message: 'Your name is required' }),
  email: z.email({ message: 'Enter a valid email address' }),
  subject: z.string().min(1, { message: 'Please choose a subject' }),
  message: z.string().min(10, { message: 'Please add a bit more detail (10+ characters)' }),
})

type ContactFormData = z.infer<typeof contactSchema>

const socialGlyph: Record<string, string> = {
  facebook: 'f',
  instagram: 'IG',
  youtube: 'YT',
  twitter: 'X',
  linkedin: 'in',
}

const ContactPage = () => {
  const { hero, form, success, info, faq } = CONTACT_CONTENT
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: ContactFormData) => {
    // TODO: POST to /api/v1/contact once the contact-message endpoint exists on the Rails API.
    // Stubbed for now (mirrors the console.log placeholders) so the page is functional UX-wise.
    console.log('Contact form submission:', data)
    reset()
    setSubmitted(true)
  }

  return (
    <div className='contact-page'>

      <section className='contact-page__hero'>
        <div className='contact-page__hero-inner'>
          <h1 className='contact-page__hero-headline'>{hero.headline}</h1>
          <p className='contact-page__hero-subhead'>{hero.subhead}</p>
        </div>
      </section>

      <section className='contact-page__content'>
        <div className='contact-page__content-inner'>

          <div className='contact-page__form-col'>
            <h2 className='contact-page__form-heading'>{form.heading}</h2>
            <p className='contact-page__form-subtext'>{form.subtext}</p>

            {submitted ? (
              <div className='contact-page__success'>
                <h3 className='contact-page__success-heading'>{success.heading}</h3>
                <p className='contact-page__success-body'>{success.body}</p>
                <Button color='white' onClick={() => setSubmitted(false)}>Send another message</Button>
              </div>
            ) : (
              <form className='contact-page__form' onSubmit={handleSubmit(onSubmit)}>
                <div className='contact-page__field'>
                  <input
                    type='text'
                    placeholder={form.namePlaceholder}
                    {...register('name')}
                    className={`contact-page__input ${errors.name ? 'contact-page__input--error' : ''}`}
                    disabled={isSubmitting}
                  />
                  {errors.name && <span className='contact-page__error'>{errors.name.message}</span>}
                </div>

                <div className='contact-page__field'>
                  <input
                    type='email'
                    placeholder={form.emailPlaceholder}
                    {...register('email')}
                    className={`contact-page__input ${errors.email ? 'contact-page__input--error' : ''}`}
                    disabled={isSubmitting}
                  />
                  {errors.email && <span className='contact-page__error'>{errors.email.message}</span>}
                </div>

                <div className='contact-page__field'>
                  <select
                    defaultValue=''
                    {...register('subject')}
                    className={`contact-page__select ${errors.subject ? 'contact-page__input--error' : ''}`}
                    disabled={isSubmitting}
                  >
                    <option value='' disabled>{form.subjectPlaceholder}</option>
                    {form.subjectOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {errors.subject && <span className='contact-page__error'>{errors.subject.message}</span>}
                </div>

                <div className='contact-page__field'>
                  <textarea
                    placeholder={form.messagePlaceholder}
                    rows={6}
                    {...register('message')}
                    className={`contact-page__textarea ${errors.message ? 'contact-page__input--error' : ''}`}
                    disabled={isSubmitting}
                  />
                  {errors.message && <span className='contact-page__error'>{errors.message.message}</span>}
                </div>

                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? form.submittingText : form.submitText}
                </Button>
              </form>
            )}
          </div>

          <div className='contact-page__info-col'>
            <img src={foundersPhoto} alt='Robert and Carlie' className='contact-page__photo' />
            <p className='contact-page__info-intro'>{info.intro}</p>
            <a href={`mailto:${info.email}`} className='contact-page__info-email'>{info.email}</a>
            <div className='contact-page__socials'>
              {info.socials.map((social) => (
                <a key={social} href='#' className='contact-page__social' aria-label={social}>
                  {socialGlyph[social] ?? social[0].toUpperCase()}
                </a>
              ))}
            </div>
          </div>

        </div>
      </section>

      <Accordion
        eyebrow={faq.eyebrow}
        headline={faq.headline}
        items={faq.items}
        contactLinkText={faq.linkText}
        contactHref={faq.linkHref}
      />

    </div>
  )
}

export default ContactPage
