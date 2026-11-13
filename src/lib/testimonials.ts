export interface Testimonial {
  /** The client's own words. Fix typos or cut whole sentences; never reword. */
  quote: string
  name: string
  /** What we built for them, or their role and company. */
  context: string
  /** Short quotes are set in larger type so the cards balance. */
  size?: 'large' | 'base'
  /** The live site we built. Shown as a preview on wide screens and a link everywhere. */
  site?: { url: string; label: string }
}

// Names and roles are as shown on each client's own live site.
// TODO: confirm the name, role and wording with each client; add photos.
// TODO: add the Vraj Chem testimonial when it arrives.
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Getting a portfolio webpage made by ShapeKraft was by far one of the best decisions I made. It looks extremely professional, the quality of work is amazing and it helped me land a job in the UK, all thanks to ShapeKraft.',
    name: 'Mohammad Ali Shaikh',
    context: 'Project Coordinator, Bath, UK',
    size: 'large',
    site: { url: 'https://ali-portfolio-weld.vercel.app/', label: 'ali-portfolio-weld.vercel.app' },
  },
  {
    quote:
      "Working with you on my portfolio website was a great experience! You did an excellent job understanding my requirements and turning my vision into a clean, modern, and professional website. What stood out was your willingness to understand feedback, make improvements, and ensure the final result aligned with my expectations. I'm genuinely happy with how the website turned out. Would definitely recommend you to anyone looking for someone who combines creativity with technical skills to bring their ideas to life!",
    name: 'Simran Bhamrah',
    context: 'Automation Engineer & Tech Lead, Mumbai',
    size: 'base',
    site: { url: 'https://simran-bhamrah.vercel.app/', label: 'simran-bhamrah.vercel.app' },
  },
]
