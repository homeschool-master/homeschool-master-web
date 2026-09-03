export const LANDING_CONTENT = {
  hero: {
    headline: 'Homeschool planning that actually fits your family',
    subline1: 'The modern homeschool planner you wish existed.',
    subline2: 'Now it does.',
    getAppTxt: 'Get the App',
    availability: 'Available on iOS and Android.',
  },
  founders: {
    quote: "We're a homeschool family building the app we wished existed.",
    foundersNames: '- Robert and Carlie, Founders',
    values: [
      'Family owned',
      'No ads, ever',
      "Your family's data stays yours",
    ],
  },
  features: {
    label: 'Everything You Need',
    headline: 'Designed for how homeschool families actually work',
    description:
      "From planning Monday's math to printing year-end transcripts, every part of your homeschool lives in one place.",
    items: [
      {
        title: 'Built for the Whole Family',
        subtitle: 'Every kid in one app.',
        description:
          'Switch between students with a tap. Each child gets their own schedule, assignments, grades, and progress, all under one family account. No more juggling apps, spreadsheets, or paper for each kid.',
        screenshot: 'feature-multi-child',
        reverse: false,
      },
      {
        title: 'Every Event, One Calendar',
        subtitle: 'From co-op to gymnastics, all in one place.',
        description:
          'Co-ops, field trips, gymnastics practice, nature clubs, doctor appointments. Everything is on the family calendar, color-coded by kid and viewable any way you want.',
        screenshot: 'feature-calendar',
        reverse: true,
      },
      {
        title: 'Stay on Top of the To-Dos',
        subtitle: 'Tasks that never slip through.',
        description:
          'Subject reimbursements, email the co-op leader, schedule field trips, order curriculum. All in one system that seamlessly connects the homeschool planning organization in one place so nothing gets left behind.',
        screenshot: 'feature-todos',
        reverse: false,
      },
      {
        title: 'Grading Made Simple',
        subtitle: 'Every grade, every kid, every subject.',
        description:
          'Assign work, check it off, grade it, and see each student progress build, all from your phone. Each kid sees what is theirs. You see the whole picture.',
        screenshot: 'feature-grading',
        reverse: true,
      },
      {
        title: 'Track Every Dollar',
        subtitle: 'Track expenses and reimbursements.',
        description:
          'Log curriculum, supplies, field trips, and more as you spend. Track which expenses get reimbursed. Know exactly what you spent and what is coming back, without a spreadsheet in sight.',
        screenshot: 'feature-expenses',
        reverse: false,
      },
    ],
  },
  testimonials: {
    label: 'Loved by Homeschool Families',
    headline: 'What Homeschool Parents Are Saying',
    items: [
      {
        quote:
          'I tried four other homeschool apps before this one. Homeschool Master is the first that actually works when your kids have three different schedules.',
        name: 'Sara M.',
        role: 'Mom of 3',
        photo: 'testimonial-1',
      },
      {
        quote:
          'Generating my high schooler transcript took five minutes. The planner and an entire semester organized in under two hours.',
        name: 'Jennifer L.',
        role: 'Mom of 3',
        photo: 'testimonial-2',
      },
      {
        quote:
          'For the first time, my husband can pull up the app and see exactly what each kid is working on. We are finally on the same page.',
        name: 'Lauren K.',
        role: 'Mom of 2',
        photo: 'testimonial-3',
      },
    ],
  },
  pricing: {
    label: 'Simple Pricing',
    headline: 'One Plan. Everything Included.',
    subtext: 'No fees, no upsells, no hidden fees.',
    price: '$6.99',
    billingLabel: 'per month',
    billingNote: 'cancel anytime',
    features: [
      'Unlimited kids in one account',
      'Events, tasks, and grade tracking',
      'Report cards and transcripts',
      'Expense and reimbursement tracking',
      'Cloud sync across all devices',
    ],
    getAppTxt: 'Get the App',
  },
  faq: {
    label: 'Questions, Answered',
    headline: 'Things Parents Ask Before They Sign Up',
    items: [
      {
        label: 'Will Homeschool Master work for the way we homeschool?',
        content: 'Yes. We built it to flex around any methodology: classical, Charlotte Mason, eclectic, unschooling, or your own mix.',
      },
      {
        label: 'Can I track multiple kids in one account?',
        content: 'Yes. Add as many kids as you have. Each gets their own profile, schedule, grades, and records.',
      },
      {
        label: 'Does it work on iPhone and Android?',
        content: 'Both. Download from the App Store or Google Play. Your data syncs across all your devices.',
      },
      {
        label: 'Can I generate official transcripts for high schoolers?',
        content: 'Yes. Generate transcripts, report cards, and progress reports in seconds, formatted for college applications and state requirements.',
      },
      {
        label: "Is my family's data private?",
        content: "Always. We don't sell your data, run ads, or share anything with third parties.",
      },
      {
        label: 'Can I cancel anytime?',
        content: 'Yes. Cancel through your App Store account whenever you want. No contracts, no fees.',
      },
      {
        label: 'Can I export my data if I leave?',
        content: 'Yes. Download all your data: events, grades, transcripts, and expenses. Anytime.',
      },
    ],
    contactText: 'Still have questions?',
    contactLinkText: 'Contact us',
  },
  ctaBanner: {
    headline: 'Ready to Run Your Homeschool From Your Phone?',
    subtext: 'Download Homeschool Master and get started today.',
    getAppTxt: 'Get the App',
    availability: 'Available on iOS and Android.',
  },
  footer: {
    tagline: 'THE MODERN HOMESCHOOL PLANNER',
    socials: ['facebook', 'instagram', 'youtube', 'twitter', 'linkedin'],
    columns: [
      {
        heading: 'Product',
        links: [
          { label: 'Features', path: '/features' },
          { label: 'Pricing', path: '/pricing' },
          { label: 'Download', path: '/download' },
          { label: 'Changelog', path: '/changelog' },
        ],
      },
      {
        heading: 'Resources',
        links: [
          { label: 'Help/Docs', path: '/help' },
          { label: 'FAQ', path: '/faq' },
          { label: 'Free Resources', path: '/free-resources' },
          { label: 'Blog', path: '/blog' },
        ],
      },
      {
        heading: 'Company',
        links: [
          { label: 'About Us', path: '/about' },
          { label: 'Contact', path: '/contact' },
        ],
      },
    ],
    newsletter: {
      heading: 'Newsletter',
      subtext: 'Homeschooling tips in your inbox.',
      placeholder: 'enter email here',
      buttonText: 'Subscribe',
    },
    legalLinks: [
      { label: 'Terms', path: '/terms' },
      { label: 'Privacy', path: '/privacy' },
      { label: 'Cookies', path: '/cookies' },
      { label: 'Refund', path: '/refund' },
    ],
    copyright: '© 2026 Homeschool Master. All rights reserved.',
  },
}

export const PRICING_CONTENT = {
  hero: {
    eyebrow: 'Simple Pricing. Everything Included.',
    subhead: 'One plan, all features, no surprises.',
  },
  plan: {
    name: 'Homeschool Master',
    price: '$6.99',
    billingLabel: 'per month',
    annualNote: 'Annual pricing is also available.',
    ctaText: 'Get the App',
    cancelNote: 'cancel anytime',
    includedHeading: "What's Included?",
    included: [
      'Unlimited kids in one account',
      'Family calendar with color-coded events',
      'Task tracking with reminders',
      'Grade book and report cards',
      'Transcripts ready for college applications',
      'Expense and reimbursement tracking',
      'Receipt and document storage',
      'Cloud sync across all your devices',
    ],
  },
  trustStrip: {
    items: [
      {
        icon: 'no-contract',
        title: 'Cancel Anytime',
        subtext: 'No contracts, no fees. Cancel at any point.',
      },
      {
        icon: 'no-ads',
        title: 'No Ads, Ever',
        subtext: "We don't sell ad space. Period.",
      },
      {
        icon: 'data',
        title: 'Your Data Is Yours',
        subtext: 'Export everything anytime. Delete on request.',
      },
      {
        icon: 'family-owned',
        title: 'Family Owned',
        subtext: 'Built and run by a homeschool family in Florida.',
      },
    ],
  },
  faq: {
    eyebrow: 'Pricing Questions',
    headline: 'Billing, But Make It Simple',
    items: [
      {
        label: 'How does billing work?',
        content: "Homeschool Master is sold through the App Store and Google Play. You're charged monthly through your Apple ID or Google account.",
      },
      {
        label: 'Is there a free trial?',
        content: 'Yes. New users get a 14-day free trial. You will not be charged until the trial ends, and you can cancel before then at no cost.',
      },
      {
        label: 'Can I cancel anytime?',
        content: 'Yes. Cancel through your App Store or Google Play account whenever you want. No contracts, no cancellation fees.',
      },
      {
        label: 'What happens if I cancel?',
        content: 'You keep access until the end of your current billing period. After that your account moves to read-only and you can still export your data.',
      },
      {
        label: 'Do you offer refunds?',
        content: 'Refunds are handled by Apple and Google through their store policies. We are happy to walk you through the process if you need help.',
      },
      {
        label: 'Will the price change?',
        content: 'If we ever update pricing, existing subscribers keep their current rate for as long as their subscription stays active.',
      },
    ],
    contactText: 'Still have questions?',
    contactLinkText: 'Contact us.',
  },
  finalCta: {
    headline: 'Ready to Get Started?',
    subhead: 'Download Homeschool Master and try it free for 14 days.',
    ctaText: 'Get the App',
    availability: 'Available on iOS and Android.',
  },
}

export const CONTACT_CONTENT = {
  hero: {
    headline: "We'd Love to Hear From You",
    subhead: 'Questions, feedback, or just want to say hi. We read every message and answer back ourselves.',
  },
  form: {
    heading: 'Send Us a Message',
    subtext: 'We typically respond within 24-48 hours.',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'Email address',
    subjectPlaceholder: "What's this about?",
    subjectOptions: ['General question', 'Billing', 'Technical support', 'Feedback', 'Other'],
    messagePlaceholder: 'Your message',
    submitText: 'Send Message',
    submittingText: 'Sending...',
  },
  success: {
    heading: 'Message Sent',
    body: "Thanks for reaching out. We'll get back to you within 24-48 hours.",
  },
  info: {
    intro: "Hi there, we're Robert and Carlie, the family behind Homeschool Master. Every message comes straight to us.",
    email: 'support@homeschoolmaster.com',
    socials: ['facebook', 'instagram', 'youtube', 'twitter', 'linkedin'],
  },
  faq: {
    eyebrow: 'Before You Reach Out',
    headline: 'You Might Find Your Answer Faster Here',
    items: [
      { label: 'How does billing work?', content: "Homeschool Master is sold through the App Store and Google Play. You're charged monthly through your Apple ID or Google account." },
      { label: 'Can I cancel anytime?', content: 'Yes. Cancel through your App Store or Google Play account whenever you want. No contracts, no cancellation fees.' },
      { label: 'Does it work on iPhone and Android?', content: 'Both. Download from the App Store or Google Play, and your data syncs across all your devices.' },
    ],
    linkText: 'See all FAQs →',
    linkHref: '#',
  },
}

export const DOWNLOAD_CONTENT = {
  hero: {
    eyebrow: 'Account',
    headline: 'Welcome to Homeschool Master!',
    subhead: "Let's get the app on your phone.",
  },
  scan: {
    heading: 'Scan to install on your phone',
    subtext: "Open your phone's camera and scan the right code below.",
    comingSoonText: 'Coming soon',
  },
  platforms: [
    {
      title: 'iPhone',
      url: import.meta.env.VITE_IOS_INSTALL_URL,
      caption: 'Installs via TestFlight',
      note: 'Requires the free TestFlight app from Apple.',
    },
    {
      title: 'Android',
      url: import.meta.env.VITE_ANDROID_INSTALL_URL,
      caption: 'Direct Download',
      note: "You'll be prompted to allow installs from your browser.",
    },
  ],
  account: {
    text: 'Manage your account and subscription in the meantime.',
    linkText: 'Go to Account Settings',
    path: '/dashboard',
  },
  help: {
    text: 'Need help getting set up?',
    linkText: 'Contact us →',
    path: '/contact',
  },
}

export const FEATURES_CONTENT = {
  hero: {
    eyebrow: 'Every Feature. One App.',
    subhead: 'Everything your homeschool needs, in one place.',
  },
  whatYouGet: {
    eyebrow: 'What You Get',
    headline: 'Everything Homeschool Master Does',
    items: [
      {
        title: 'Family Management',
        icon: 'family',
        bullets: [
          'Unlimited kids in one account',
          'Color-coded profiles for each child',
          'Switch between students with one tap',
          'Shared family calendar',
        ],
      },
      {
        title: 'Daily Planning',
        icon: 'calendar',
        bullets: [
          'Events with reminders',
          'Task tracker for parent to-dos',
          'Recurring events for co-ops & practices',
          "Today's view at a glance",
        ],
      },
      {
        title: 'Grades & Assignments',
        icon: 'grades',
        bullets: [
          'Assign work to one or multiple kids',
          'Auto-calculated weighted grades',
          'Subject-by-subject progress tracking',
          'Grade book that builds in real time',
        ],
      },
      {
        title: 'Reports & Transcripts',
        icon: 'reports',
        bullets: [
          'One-tap report card generation',
          'College-application-ready transcripts',
          'Progress reports for state compliance',
          'Custom report templates',
        ],
      },
      {
        title: 'Expenses & Reimbursements',
        icon: 'expenses',
        bullets: [
          'Categorize spending by kid or type',
          'Snap receipts on the go',
          'Track reimbursements and payments',
          'Year-end tax-ready exports',
        ],
      },
      {
        title: 'Built-In Trust',
        icon: 'trust',
        bullets: [
          'No ads, ever',
          "Your family's data stays yours",
          'Cloud sync and backup across devices',
          'Cancel anytime',
        ],
      },
    ],
  },
}

// TODO: this legal copy is placeholder and has not been reviewed by an attorney.
// Replace every string in LEGAL_CONTENT with reviewed language before launch.
export type LegalSlug = 'terms' | 'privacy' | 'cookies' | 'refund'

export type LegalSection = {
  heading: string
  body: string[]
}

export type LegalDocument = {
  title: string
  lastUpdated: string
  intro: string
  sections: LegalSection[]
}

export const LEGAL_CONTENT: Record<LegalSlug, LegalDocument> = {
  terms: {
    title: 'Terms of Service',
    lastUpdated: 'September 2, 2026',
    intro:
      'These terms cover your use of Homeschool Master, including the mobile apps, this website, and the account you sign in with. By creating an account or using the app you agree to what follows. If you do not agree, please do not use the service.',
    sections: [
      {
        heading: 'Who We Are',
        body: [
          'Homeschool Master is built and operated by a family owned business based in Florida. Throughout these terms, "we", "us", and "our" refer to Homeschool Master, and "you" refers to the person who holds the account.',
          'You can reach us any time at support@homeschoolmaster.com.',
        ],
      },
      {
        heading: 'Your Account',
        body: [
          'You need an account to use Homeschool Master. You agree to give us accurate information when you register and to keep it current. You are responsible for everything that happens under your account, including anything done by family members you give access to.',
          'One adult holds the family account. Student profiles inside that account are created and managed by the account holder, not by the students themselves. Keep your password private, and tell us right away if you think someone else has gotten into your account.',
          'You must be old enough to enter into a contract where you live in order to hold an account.',
        ],
      },
      {
        heading: 'Subscriptions and Billing',
        body: [
          'Homeschool Master is a paid subscription. New accounts start with a 14 day free trial. After the trial, the subscription renews automatically at the price shown at purchase until you cancel.',
          'All subscriptions are sold and billed through the Apple App Store or Google Play, depending on where you downloaded the app. We do not collect or store your card number. Your payment method, renewal date, and billing history live with Apple or Google.',
          'Cancel any time from your Apple ID subscription settings or your Google Play subscription settings. Canceling stops the next renewal. See our Refund Policy for how refunds work.',
        ],
      },
      {
        heading: 'What You Can and Cannot Do',
        body: [
          "Use Homeschool Master for planning and recording your own family's homeschool. That is what it is for.",
          'Please do not: resell or sublicense access to the service, try to break into other accounts or our systems, scrape or bulk export data that is not yours, upload anything unlawful, or interfere with the service for other families.',
          'We may suspend or close an account that is being used in these ways.',
        ],
      },
      {
        heading: 'Your Content',
        body: [
          'The lesson plans, assignments, grades, calendar entries, expenses, and notes you enter belong to you. We do not claim ownership of them.',
          'You give us permission to store, back up, and display that content for the purpose of running the service for you: syncing it between your devices, generating your report cards and transcripts, and letting you export it. That permission ends when you delete the content or close your account.',
          'You are responsible for the accuracy of what you record. Homeschool Master is a record keeping tool, not a legal, tax, or educational advisor. Homeschool reporting requirements differ by state and it is up to you to know and meet the ones that apply to your family.',
        ],
      },
      {
        heading: 'Service Availability',
        body: [
          'We work to keep Homeschool Master running, but we do not promise uninterrupted service. We may take the service down for maintenance, and features may change, improve, or be retired over time.',
          'If we make a change that meaningfully reduces what your subscription includes, we will tell you by email before it takes effect.',
        ],
      },
      {
        heading: 'Ending Your Account',
        body: [
          'You can close your account at any time from your account settings or by emailing us. Closing your account does not by itself cancel a subscription billed by Apple or Google: cancel that through the store as well.',
          'When a subscription lapses, your account moves to read only. Your records stay available to view and export for the retention period described in our Privacy Policy.',
          'We may close an account that violates these terms, and will normally give you notice and a chance to export your data first.',
        ],
      },
      {
        heading: 'Disclaimers and Liability',
        body: [
          'The service is provided as is, without warranties of any kind to the extent the law allows. We do not warrant that the service will be error free or that it will meet any particular state reporting standard.',
          'To the extent the law allows, our total liability to you for any claim relating to the service is limited to the amount you paid us for the subscription in the twelve months before the claim. We are not liable for indirect or consequential losses.',
          'Keep your own copies of anything you cannot afford to lose. The export tools in the app are there for exactly that.',
        ],
      },
      {
        heading: 'Changes to These Terms',
        body: [
          'We may update these terms as the product changes. When we do, we will update the date at the top of this page, and for significant changes we will email the address on your account before the new terms take effect.',
          'Continuing to use Homeschool Master after an update means you accept the updated terms.',
        ],
      },
      {
        heading: 'Contact',
        body: [
          'Questions about these terms can go to support@homeschoolmaster.com. A real person reads that inbox.',
        ],
      },
    ],
  },

  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'September 2, 2026',
    intro:
      'This policy explains what Homeschool Master collects, why we collect it, where it is stored, and what control you have over it. We built this app for our own family first, so the short version is: we collect what the app needs to work, we do not sell it, and there are no ads.',
    sections: [
      {
        heading: 'What We Collect',
        body: [
          'Account information: your name, email address, and password. Passwords are stored only as a salted hash, never as readable text.',
          'Family and student records: the student profiles, subjects, assignments, grades, calendar events, tasks, expenses, and notes you enter. Student profiles hold only what you choose to type in, typically a first name, a grade level, and school work.',
          'Support messages: if you email us or use the contact form, we keep the message and your reply address so we can answer you.',
          'Basic technical records: our servers keep short lived request logs that include IP address and browser or device type. We use them to diagnose errors and abuse.',
          'We do not run advertising trackers, third party analytics, or behavioral profiling in the app or on this site.',
        ],
      },
      {
        heading: 'How We Use It',
        body: [
          'To run the service: signing you in, syncing your records between devices, and generating your report cards and transcripts.',
          'To bill your subscription, by confirming with the app store that your subscription is active.',
          'To contact you about the account: password resets, receipts, trial and renewal notices, and important service changes.',
          'To keep the service working and secure: fixing bugs, investigating abuse, and preventing fraud.',
          'We do not sell your information, and we do not share it with data brokers or advertisers.',
        ],
      },
      {
        heading: 'Where Your Data Lives',
        body: [
          'Homeschool Master runs on a Rails API hosted on Heroku, with your records stored in a PostgreSQL database. Data is stored on servers in the United States.',
          'Traffic between the app and our API is encrypted in transit with TLS. Database backups are managed by our hosting provider.',
          'A small number of people on our team can reach production data, and only to operate the service or to help you with a support request.',
        ],
      },
      {
        heading: 'Sessions and Cookies',
        body: [
          'When you sign in, we set a session cookie that carries a signed JWT. The cookie is what keeps you logged in as you move between pages. It is HTTP only, so page scripts cannot read it, and it is sent over HTTPS.',
          'We use cookies only for signing in and for basic security. We do not set advertising or analytics cookies. Our Cookie Policy has the details.',
        ],
      },
      {
        heading: 'Service Providers',
        body: [
          'Heroku hosts our API and PostgreSQL database.',
          'Resend delivers our transactional email: password resets, receipts, and account notices. Resend receives your email address and the contents of those messages so it can send them.',
          'Apple and Google process subscription payments. They tell us whether a subscription is active. We never receive your full payment details.',
          'These providers handle data on our behalf under their own terms, and we do not authorize them to use your information for their own marketing.',
        ],
      },
      {
        heading: 'Students and Family Members',
        body: [
          'Student records inside a family account are created and controlled by the adult account holder. Students do not sign up on their own, and we do not market to students.',
          'The account holder can view, edit, export, or delete any student record from the app at any time. If you would rather we handle a deletion for you, email us and we will take care of it.',
          "Please enter only what you actually need for your records. There is no requirement to include a student's full legal name, birth date, or address in order to use the app.",
        ],
      },
      {
        heading: 'How Long We Keep It',
        body: [
          'We keep your records for as long as your account is open, so that your history, grades, and transcripts stay available to you year over year.',
          'If you close your account, we delete your family and student records from the production database within 30 days. Encrypted backups roll off on their own cycle, generally within 90 days.',
          'We keep a minimal billing and support record after deletion where we need it for tax and accounting purposes.',
        ],
      },
      {
        heading: 'Your Choices',
        body: [
          'Access and export: you can view and export your family data from the app at any time.',
          'Correction: you can edit any record you have entered directly in the app.',
          'Deletion: you can delete individual records, or ask us to delete your entire account.',
          'Email: account and security emails are part of the service, but you can opt out of any newsletter from the link in its footer.',
          'To make any of these requests by hand, email support@homeschoolmaster.com from the address on your account.',
        ],
      },
      {
        heading: 'Security',
        body: [
          'We use encrypted transport, hashed passwords, HTTP only session cookies, and access controls that scope every request to the family account that made it.',
          'No system is perfectly secure. If we ever discover a breach affecting your data, we will notify affected account holders by email and describe what happened and what we are doing about it.',
        ],
      },
      {
        heading: 'Changes to This Policy',
        body: [
          'We will update this page when our practices change, and we will change the date at the top. For material changes we will email the address on your account.',
        ],
      },
      {
        heading: 'Contact',
        body: [
          'Privacy questions go to support@homeschoolmaster.com and we will answer them ourselves.',
        ],
      },
    ],
  },

  cookies: {
    title: 'Cookie Policy',
    lastUpdated: 'September 2, 2026',
    intro:
      'This page explains the cookies Homeschool Master sets and why. It is a short page on purpose: we use cookies to keep you signed in and to keep the app secure, and for nothing else.',
    sections: [
      {
        heading: 'What a Cookie Is',
        body: [
          'A cookie is a small piece of text a site stores in your browser and sends back on later requests. It lets the server recognize your browser from one page to the next.',
        ],
      },
      {
        heading: 'The Cookies We Set',
        body: [
          'Session cookie: when you sign in, we set a cookie containing a signed JWT that identifies your account. Without it you would have to log in again on every page. It is marked HTTP only so page scripts cannot read it, restricted to HTTPS, and scoped to our own domain.',
          'The session cookie expires when the token expires or when you sign out, whichever comes first. Signing out clears it immediately.',
          'That is the complete list. We do not set cookies for advertising, retargeting, third party analytics, or cross site tracking, and no outside company sets cookies through our site.',
        ],
      },
      {
        heading: 'Cookies From Payments',
        body: [
          'Subscriptions are purchased inside the App Store and Google Play, not on this website, so no payment provider sets a cookie here.',
        ],
      },
      {
        heading: 'Managing Cookies',
        body: [
          'Every major browser lets you view, block, or delete cookies in its settings. You are free to block ours.',
          'Be aware that blocking or clearing the session cookie signs you out and prevents you from signing back in, since it is how the app knows who you are. The marketing pages of this site work fine without it.',
        ],
      },
      {
        heading: 'Changes to This Policy',
        body: [
          'If we ever add a cookie, we will list it here and update the date at the top before it goes live.',
        ],
      },
      {
        heading: 'Contact',
        body: [
          'Questions about cookies can go to support@homeschoolmaster.com.',
        ],
      },
    ],
  },

  refund: {
    title: 'Refund Policy',
    lastUpdated: 'September 2, 2026',
    intro:
      'Homeschool Master subscriptions are sold through the Apple App Store and Google Play, which means Apple and Google handle the money, including refunds. Here is how that works and what we can do to help.',
    sections: [
      {
        heading: 'Try It Free First',
        body: [
          'Every new account gets a 14 day free trial with every feature turned on. You are not charged during the trial, and canceling before it ends costs nothing.',
          'The trial exists so you can decide whether the app fits your family before any money changes hands. We would rather you cancel during the trial than pay for a month you did not want.',
        ],
      },
      {
        heading: 'Who Issues Refunds',
        body: [
          'Because your subscription is billed by Apple or Google, we cannot issue a refund directly. The charge never passes through our systems, so there is nothing on our side to reverse.',
          "Refunds are granted at the store's discretion under its own policy. In our experience both stores are reasonable about accidental and duplicate charges.",
        ],
      },
      {
        heading: 'Requesting a Refund From Apple',
        body: [
          'Go to reportaproblem.apple.com and sign in with the Apple ID used for the purchase, find the Homeschool Master charge, and choose the request refund option.',
          'You can also open Settings on your device, tap your name, then Subscriptions, to see the purchase in question.',
        ],
      },
      {
        heading: 'Requesting a Refund From Google',
        body: [
          'Open the Google Play Store, go to your order history under Payments and subscriptions, find the Homeschool Master charge, and choose the refund option. Requests made soon after the charge are generally handled fastest.',
          'You can also submit a request from play.google.com/store/account/orderhistory in a browser.',
        ],
      },
      {
        heading: 'Canceling a Subscription',
        body: [
          'Canceling and refunding are separate actions. Deleting the app does not cancel a subscription.',
          'On iOS: Settings, then your name, then Subscriptions, then Homeschool Master, then Cancel Subscription.',
          'On Android: Play Store, then your profile icon, then Payments and subscriptions, then Subscriptions, then Homeschool Master, then Cancel.',
          'Cancellation stops the next renewal. You keep access through the end of the period you already paid for, and after that your account becomes read only so you can still view and export your records.',
        ],
      },
      {
        heading: 'How We Can Help',
        body: [
          "Email support@homeschoolmaster.com and we will walk you through the store's process, confirm what was charged and when, and write a short note you can attach to your request explaining the situation.",
          'If a charge looks like a genuine mistake on our end, tell us. We will look into it and back up your refund request with the store.',
        ],
      },
      {
        heading: 'Changes to This Policy',
        body: [
          'We will update this page if our billing arrangements change, and we will change the date at the top when we do.',
        ],
      },
    ],
  },
}
