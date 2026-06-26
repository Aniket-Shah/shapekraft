import type { Metadata } from 'next'
import { NavStickyMinimal } from '@/components/sections/NavStickyMinimal'
import { SiteFooter } from '@/components/sections/SiteFooter'
import { LegalPage } from '@/components/sections/LegalPage'
import { SchemaOrg } from '@/components/SchemaOrg'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms and conditions that govern your use of ShapeKraft services and website.',
  alternates: {
    canonical: 'https://shapekraft.co/terms',
  },
  openGraph: {
    title: 'Terms of Service — ShapeKraft',
    description: 'The terms and conditions that govern your use of ShapeKraft services.',
    url: 'https://shapekraft.co/terms',
  },
}

const termsSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://shapekraft.co' },
    { '@type': 'ListItem', position: 2, name: 'Terms of Service', item: 'https://shapekraft.co/terms' },
  ],
}

export default function TermsPage() {
  return (
    <>
      <SchemaOrg schema={termsSchema} />
      <NavStickyMinimal />
      <LegalPage title="Terms of Service" lastUpdated="June 2026">
        <h2>Acceptance of Terms</h2>
        <p>
          By accessing shapekraft.co or shapekraft.in or engaging ShapeKraft for any services, you
          agree to be bound by these Terms of Service. If you do not agree, please do not use the
          site or our services.
        </p>

        <h2>Services</h2>
        <p>
          ShapeKraft provides web design, web development, AI automation, performance optimisation,
          and integration services for businesses. The scope and deliverables for each engagement are
          defined in a separate project proposal or statement of work agreed upon in writing before
          work begins.
        </p>

        <h2>Quotes and Estimates</h2>
        <p>
          Prices shown on the quote builder are estimates only and are not binding offers. A final,
          fixed-price quote is provided after a discovery call where requirements are confirmed. All
          quotes are valid for 30 days from the date of issue.
        </p>

        <h2>Payment Terms</h2>
        <p>
          Unless otherwise agreed, projects are invoiced in three instalments:
        </p>
        <ul>
          <li>
            <strong>40% — Design phase:</strong> due before design work commences.
          </li>
          <li>
            <strong>30% — Build phase:</strong> due before development work commences.
          </li>
          <li>
            <strong>30% — Launch:</strong> due on or before the agreed go-live date.
          </li>
        </ul>
        <p>
          Invoices are payable within 7 days of issue. Late payments may result in work being paused
          until the outstanding balance is cleared.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          Upon receipt of final payment, all custom code, designs, and assets created specifically for
          your project are assigned to you. ShapeKraft retains the right to display the completed work
          in our portfolio unless you request otherwise in writing.
        </p>
        <p>
          Any third-party libraries, fonts, or tools used in the project are subject to their
          respective licences. ShapeKraft will inform you of any licence restrictions that may affect
          your use of the deliverables.
        </p>

        <h2>Client Responsibilities</h2>
        <p>
          You agree to provide accurate project information, supply required content and assets in a
          timely manner, and appoint a single point of contact for approvals. Delays caused by late
          content delivery or approval may affect the agreed timeline and are not the responsibility
          of ShapeKraft.
        </p>

        <h2>Revisions and Scope Changes</h2>
        <p>
          Each project phase includes a defined number of revision rounds as stated in the proposal.
          Requests that fall outside the agreed scope will be quoted separately and require written
          approval before work proceeds.
        </p>

        <h2>Confidentiality</h2>
        <p>
          Both parties agree to keep confidential any non-public information shared during the
          engagement. This obligation continues for two years after the project concludes. It does not
          apply to information that is publicly known, independently developed, or required to be
          disclosed by law.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          ShapeKraft&apos;s total liability to you for any claim arising from a project shall not
          exceed the total fees paid for that project. We are not liable for indirect, consequential,
          or incidental damages including loss of revenue or data.
        </p>

        <h2>Termination</h2>
        <p>
          Either party may terminate an engagement with 14 days&apos; written notice. On termination
          you will be invoiced for all work completed up to the termination date, calculated pro rata
          against the agreed project fee. Any milestone invoices already paid are non-refundable.
        </p>

        <h2>Governing Law</h2>
        <p>
          These terms are governed by the laws applicable in the jurisdiction where the contract is
          signed. Any disputes will first be addressed through good-faith negotiation. If unresolved,
          disputes will be referred to binding arbitration.
        </p>

        <h2>Changes to These Terms</h2>
        <p>
          We may update these Terms of Service at any time. The revised terms take effect immediately
          upon posting. For active projects, the version in effect at the time of contract signing
          applies for the duration of that project.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms can be directed to{' '}
          <a href="mailto:hello@shapekraft.co">hello@shapekraft.co</a>.
        </p>
      </LegalPage>
      <SiteFooter />
    </>
  )
}
