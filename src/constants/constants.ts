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
        links: ['Features', 'Pricing', 'Download', 'Changelog'],
      },
      {
        heading: 'Resources',
        links: ['Help/Docs', 'FAQ', 'Free Resources', 'Blog'],
      },
      {
        heading: 'Company',
        links: ['About Us', 'Contact'],
      },
    ],
    newsletter: {
      heading: 'Newsletter',
      subtext: 'Homeschooling tips in your inbox.',
      placeholder: 'enter email here',
      buttonText: 'Subscribe',
    },
    legalLinks: ['Terms', 'Privacy', 'Cookies', 'Refund'],
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
