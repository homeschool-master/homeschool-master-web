const PhoneMockup = () => (
  <div className='landing__phone-mockup'>
    <div className='landing__phone-mockup-header'>
      HOMESCHOOL<span>MASTER</span>
    </div>
    <div className='landing__phone-mockup-body'>
      <div className='landing__phone-mockup-row landing__phone-mockup-row--tall' />
      <div className='landing__phone-mockup-row' />
      <div className='landing__phone-mockup-row landing__phone-mockup-row--short' />
      <div className='landing__phone-mockup-row' />
      <div className='landing__phone-mockup-row landing__phone-mockup-row--tall' />
      <div className='landing__phone-mockup-row landing__phone-mockup-row--short' />
      <div className='landing__phone-mockup-row' />
    </div>
  </div>
)

const LandingPage = () => {
  return (
    <div className='landing'>
      <section className='landing__hero'>
        <div className='landing__hero-content'>
          <h1 className='landing__hero-headline'>
            Homeschool planning that actually fits your family
          </h1>
          <p className='landing__hero-sub'>The modern homeschool planner you wish existed.</p>
          <p className='landing__hero-sub'>Now it does.</p>
          <button className='landing__hero-cta'>Get the App</button>
          <p className='landing__hero-availability'>Available on iOS and Android.</p>
        </div>
        <div className='landing__hero-phone'>
          <PhoneMockup />
        </div>
      </section>

      <section className='landing__trust'>
        <div className='landing__quote'>
          <div className='landing__quote-photo'>👨‍👩‍👧</div>
          <div className='landing__quote-content'>
            <blockquote>
              We're a homeschool family building the app we wished existed.
            </blockquote>
            <p>- Robert and Carlie, Founders</p>
          </div>
        </div>
        <div className='landing__values'>
          <p className='landing__value-item'>Family owned</p>
          <p className='landing__value-item'>No ads, ever</p>
          <p className='landing__value-item'>Your family's data stays yours</p>
        </div>
      </section>

      <section className='landing__features'>
        <p className='landing__features-label'>Everything You Need</p>
        <h2 className='landing__features-headline'>
          Designed for how homeschool families actually work
        </h2>
        <p className='landing__features-desc'>
          From planning Monday's math to printing year-end transcripts,
          every part of your homeschool lives in one place.
        </p>

        <div className='landing__feature'>
          <div className='landing__feature-phone'><PhoneMockup /></div>
          <div className='landing__feature-content'>
            <h3 className='landing__feature-title'>Multi-Child</h3>
            <p className='landing__feature-subtitle'>Every kid in one app.</p>
            <p className='landing__feature-desc'>
              Switch between students with a tap. Each child gets their own schedule,
              assignments, grades, and progress, all under one family account. No more
              juggling apps, spreadsheets, or paper for each kid.
            </p>
          </div>
        </div>

        <div className='landing__feature landing__feature--reverse'>
          <div className='landing__feature-phone'><PhoneMockup /></div>
          <div className='landing__feature-content'>
            <h3 className='landing__feature-title'>Multi-Child</h3>
            <p className='landing__feature-subtitle'>Every kid in one app.</p>
            <p className='landing__feature-desc'>
              Switch between students with a tap. Each child gets their own schedule,
              assignments, grades, and progress, all under one family account. No more
              juggling apps, spreadsheets, or paper for each kid.
            </p>
          </div>
        </div>

        <div className='landing__feature'>
          <div className='landing__feature-phone'><PhoneMockup /></div>
          <div className='landing__feature-content'>
            <h3 className='landing__feature-title'>Multi-Child</h3>
            <p className='landing__feature-subtitle'>Every kid in one app.</p>
            <p className='landing__feature-desc'>
              Switch between students with a tap. Each child gets their own schedule,
              assignments, grades, and progress, all under one family account. No more
              juggling apps, spreadsheets, or paper for each kid.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
