import type { Metadata } from 'next'
import { NavStickyMinimal } from '@/components/sections/NavStickyMinimal'
import { SiteFooter } from '@/components/sections/SiteFooter'
import { LegalPage } from '@/components/sections/LegalPage'

export const metadata: Metadata = {
  title: 'Privacy Policy — ShapeKraft',
  description:
    'How ShapeKraft collects, uses, and protects your information when you use our website and services.',
}

export default function PrivacyPage() {
  return (
    <>
      <NavStickyMinimal />
      <LegalPage title="Privacy Policy" lastUpdated="June 2026">
        <h2>Overview</h2>
        <p>
          ShapeKraft (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) operates the websites
          shapekraft.co and shapekraft.in. This Privacy Policy explains what information we collect,
          how we use it, and the choices available to you.
        </p>
        <p>
          By using our website you agree to the collection and use of information in accordance with
          this policy. We will never sell your personal data to third parties.
        </p>

        <h2>Information We Collect</h2>
        <p>We collect information in two ways:</p>
        <ul>
          <li>
            <strong>Information you provide</strong> — name, email address, project details, and any
            other information you submit through our contact form or quote builder.
          </li>
          <li>
            <strong>Information collected automatically</strong> — pages visited, time on site, device
            type, browser, and approximate location (country level) via analytics tools.
          </li>
        </ul>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>Respond to enquiries and deliver the services you request.</li>
          <li>Send project updates and invoices relevant to an active engagement.</li>
          <li>Improve the website experience based on aggregated, anonymised usage data.</li>
          <li>Comply with legal obligations.</li>
        </ul>
        <p>
          We do not use your information for unsolicited marketing. If you contact us through the
          quote builder, we will only follow up in relation to that enquiry.
        </p>

        <h2>Cookies and Analytics</h2>
        <p>
          We use minimal, privacy-respecting analytics to understand how visitors interact with the
          site. No cookies are used for advertising or cross-site tracking. The following third-party
          services may process data as part of your visit:
        </p>
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Purpose</th>
              <th>Data shared</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vercel Analytics</td>
              <td>Page views and performance metrics</td>
              <td>Anonymised usage data, no personal identifiers</td>
            </tr>
            <tr>
              <td>Vercel Speed Insights</td>
              <td>Core Web Vitals measurement</td>
              <td>Performance timings, device class</td>
            </tr>
          </tbody>
        </table>

        <h2>Data Retention</h2>
        <p>
          Enquiry data (contact form submissions and quote requests) is retained for up to 12 months
          after the last communication. Analytics data is retained in aggregated form with no
          personally identifiable information.
        </p>

        <h2>Your Rights</h2>
        <p>
          Depending on your location you may have rights to access, correct, or request deletion of
          your personal data. To exercise any of these rights, email us at{' '}
          <a href="mailto:hello@shapekraft.co">hello@shapekraft.co</a> and we will respond within 30
          days.
        </p>

        <h2>Third-Party Links</h2>
        <p>
          Our website may contain links to external sites. We are not responsible for the privacy
          practices of those sites and encourage you to review their respective policies.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date at
          the top of this page reflects the most recent revision. Continued use of the site after any
          change constitutes your acceptance of the updated policy.
        </p>

        <h2>Contact</h2>
        <p>
          For any privacy-related questions, write to us at{' '}
          <a href="mailto:hello@shapekraft.co">hello@shapekraft.co</a>.
        </p>
      </LegalPage>
      <SiteFooter />
    </>
  )
}
