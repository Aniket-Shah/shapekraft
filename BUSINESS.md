# ShapeKraft — Business Overview

Facts below come from the website code (services, quote builder, market config). Items marked **TBD** are not in the codebase and need your input. Pricing lives in `CONFIG` in [QuotationBuilder.tsx](src/components/sections/QuotationBuilder.tsx); if this file and the code disagree, the code wins.

## 1. What ShapeKraft is
A global, remote digital engineering studio (founded 2025) that builds custom websites and the automation around them. Positioning: **craft over volume — no templates, no shortcuts, pure craft.**

- **Tagline:** "We don't design websites. We engineer them."
- **Studio:** Global · Remote
- **Approach:** selective ("we don't take every project, we take the right ones")
- **Legal entity, registered address, GST/tax details:** TBD

## 2. Markets
One deployment serves two markets, detected by domain:

| Market | Domain | Currency | Contact |
|---|---|---|---|
| India | shapekraft.in | INR | hello@shapekraft.in |
| US / global | shapekraft.co | USD | hello@shapekraft.co |

The quote page also geolocates the visitor (India → INR, everyone else → USD). Each market has its own analytics (GTM + GA4) and its own WhatsApp number (currently placeholders in the code — **TBD**).

## 3. Services
1. **Website Design & Development:** custom Next.js / React / TypeScript sites, design systems, CMS. No themes.
2. **AI Automation & Agents:** LLM integrations, RAG pipelines, multi-agent systems, workflow automation.
3. **Performance Optimisation:** Core Web Vitals audits, 100 Lighthouse, sub-2s LCP, bundle and image work.
4. **Webhook & Integrations:** event pipelines and API wiring (CRMs, payments, email, Slack, Notion, Zapier).

Areas served in the site's structured data: IN, US, GB, AU, CA.

## 4. Pricing (from the quote builder)

### Website packages
| Package | INR | USD | What it is |
|---|---|---|---|
| Basic | ₹8,000 | $110 | Clean, fast, responsive site; contact form; SEO basics |
| Pro | ₹25,000 | $350 | Multiple sections, animations, editable blog/portfolio, better SEO |
| Advanced | ₹40,000 | $550 | Built from scratch to the brand: own design system, custom interactions |
| Business B2B | custom | custom | Discovery calls, build, proposals/decks, AMC; priced by scope |

### Add-ons
| Add-on | INR | USD |
|---|---|---|
| AI Automation & Agents | ₹25,000 | $350 |
| Performance Optimisation | ₹10,000 | $150 |
| Webhook & Integrations | ₹10,000 | $150 |

### Pages
- Per-page rate: ₹2,000 / $30. Default 5 pages, maximum 50. Not applied to B2B.
- **Check:** the builder multiplies *all* pages (including the default 5) by the rate and adds it to the package price. If the first 5 pages are meant to be included, the formula needs changing.

### Payment schedule
Quotes split the total **40% design / 30% build / 30% launch**.

Custom or negotiated quotes go through WhatsApp, and the quote can be downloaded as a branded PDF estimate.

## 5. Ideal customer
- Growing businesses and startups that want a custom site, not a template
- B2B companies needing proposals, decks and ongoing maintenance (AMC)
- Teams wanting AI or integrations wired into what they already use

Customer segments, industries and personas beyond this: **TBD**

## 6. How we work
1. **Brief & Discovery:** learn the business, goals and users.
2. **Design & Spec:** architecture before aesthetics; wireframes, component specs, motion brief.
3. **Build & Assemble:** precision-built components with regular check-ins.
4. **Review & Ship:** QA, performance audit, Lighthouse pass, handoff doc.

## 7. Proof points (as shown on the site)
- 3+ projects shipped
- 100 Lighthouse score
- under 2s average LCP
- 90+ performance score across categories

The Featured Work section exists in code but is switched off until there are case studies. Case studies, testimonials, client logos: **TBD**

## 8. Brand
Burnt Sienna / Cream Linen / Royal Teal, Obsidian text, Syne + Inter. See [BRAND_DESIGN.md](BRAND_DESIGN.md).

## 9. Channels and operations
- **Lead capture:** email (mailto), quote builder, WhatsApp
- **Analytics:** Google Tag Manager + GA4 per market, with consent mode (cookies off until accepted)
- **Hosting:** Vercel (single project, both domains)
- **Social profiles:** hidden until ready (Twitter/X, LinkedIn, GitHub): **TBD**
- **Response time promise:** within 24 hours

## 10. Open questions
- [ ] Real WhatsApp numbers for India and US
- [ ] Legal entity, tax and invoicing details
- [ ] Per-page pricing: are the first 5 pages included?
- [ ] AMC pricing and terms
- [ ] Target industries and customer personas
- [ ] Case studies and testimonials to unlock Featured Work
- [ ] Revenue goals, capacity (projects per month), team and roles
- [ ] Competitors and differentiators to state explicitly
