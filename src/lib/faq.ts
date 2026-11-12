// FAQ copy. Answers are shown on the page AND sent as FAQPage schema, so they
// must stay identical and must match the prices in QuotationBuilder CONFIG.
// If you change a price there, change it here.
export interface Faq {
  q: string
  a: string
}

const COST_INDIA: Faq = {
  q: 'How much does a website cost in India?',
  a: 'Our custom websites start at ₹15,000 for a 5-page Starter site. The Growth website (10 pages) is ₹35,000 and the Studio website (15 pages) is ₹60,000. Extra pages are ₹2,000 each. The website cost calculator on our quote page gives you an exact estimate in under a minute.',
}

const COST_USD: Faq = {
  q: 'How much do you charge international clients?',
  a: 'For clients outside India, prices are in USD: $750 for a 5-page Starter site, $1,500 for a 10-page Growth site and $3,000 for a 15-page Studio site. Extra pages are $40 each. We work remotely with businesses in the US, UK, Canada and Australia.',
}

const PAYMENT: Faq = {
  q: 'How is payment split?',
  a: 'Every project is paid in three milestones: 40% at the start for design, 30% when the build is ready for review, and 30% at launch. You see and approve each stage before the next payment.',
}

const TEMPLATES: Faq = {
  q: 'Do you use templates or WordPress?',
  a: 'No. Every site is custom-built in Next.js, which makes it fast to load and easy to rank on Google. There are no page-builder plugins to slow it down or break on updates.',
}

const OWNERSHIP: Faq = {
  q: 'Do I own the website after launch?',
  a: 'Yes. The site, the code and the domain are yours. At handover you also get a short document explaining how it works, so any developer can take it over.',
}

const AFTER_LAUNCH: Faq = {
  q: 'What happens after the website goes live?',
  a: 'You can manage hosting and updates yourself, or choose a monthly care plan. Essential care (₹1,500 or $99 a month) covers hosting, backups, updates and uptime monitoring. Growth care (₹5,000 or $299 a month) adds 2 hours of changes a month, a monthly speed and SEO report and a 24-hour response time.',
}

const AI: Faq = {
  q: 'Can you add AI automation to my business?',
  a: 'Yes. Your first AI automation workflow starts at ₹30,000 ($1,500). Common examples are answering enquiries, drafting quotes and moving leads into your CRM or WhatsApp automatically. It can be added to a new site or an existing one.',
}

const RFQ: Faq = {
  q: 'What is the RFQ Launch Kit for B2B traders?',
  a: 'It is built for traders and distributors who quote prices on request. You get a catalogue website plus a request-for-quote system that drafts quotes from your own price list, so replies go out on email or WhatsApp in minutes instead of hours. It is ₹60,000 in India, with a ₹5,000 monthly automation plan.',
}

export const HOME_FAQS: Faq[] = [COST_INDIA, COST_USD, TEMPLATES, PAYMENT, OWNERSHIP, AFTER_LAUNCH, AI, RFQ]
export const QUOTE_FAQS: Faq[] = [COST_INDIA, COST_USD, PAYMENT, AFTER_LAUNCH, RFQ]

export function faqSchema(items: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}
