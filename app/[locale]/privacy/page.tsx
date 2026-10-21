import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { localizedMetadata } from '@/i18n/seo'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Container from '@/components/Container'

type Props = {
  params: Promise<{ locale: string }>
}

const CONTACT_EMAIL = 'info@aviloimmigration.com'

const h2Style: React.CSSProperties = {
  fontFamily: 'var(--font-heading)',
  fontSize: '1.375rem',
  fontWeight: 700,
  color: 'var(--color-ink)',
  margin: '0 0 1rem',
}

const pStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '1.0625rem',
  lineHeight: 1.75,
  color: 'var(--color-ink)',
  margin: '0 0 1rem',
}

const listStyle: React.CSSProperties = {
  ...pStyle,
  // Tailwind's reset removes list markers
  listStyleType: 'disc',
  paddingLeft: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
}

const sectionStyle: React.CSSProperties = { marginTop: '3rem' }

const Email = () => (
  <a href={`mailto:${CONTACT_EMAIL}`} className="link-ink" style={{ textDecoration: 'underline' }}>
    {CONTACT_EMAIL}
  </a>
)

// Bold lead-in for the "label: text" lines
const Lead = ({ children }: { children: React.ReactNode }) => <strong style={{ fontWeight: 700 }}>{children}</strong>

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return localizedMetadata(locale, '/privacy', 'privacy.meta')
}

// English content for now; move to the message files when the policy is translated.
export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: 'var(--color-bg)', padding: '4.5rem 0 6rem' }}>
        <Container>
          <article style={{ maxWidth: '680px', margin: '0 auto' }}>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 700,
              lineHeight: 1.2,
              color: 'var(--color-ink)',
              margin: '0 0 0.75rem',
            }}>
              Privacy Policy
            </h1>
            <p style={{ ...pStyle, fontSize: '0.9375rem', color: 'var(--color-muted)', marginBottom: '2rem' }}>
              Last updated: <time dateTime="2026-10-21">21 October 2026</time>
            </p>
            <p style={pStyle}>
              This policy explains how Avilo Immigration collects, uses and protects your personal data when you use aviloimmigration.com or our services. We process personal data in line with the EU General Data Protection Regulation (GDPR) and Belgian data protection law.
            </p>

            <section style={sectionStyle}>
              <h2 style={h2Style}>1. Who we are</h2>
              <p style={pStyle}>
                Avilo Immigration is a trade name of Chiltepin BV, a Belgian private limited company (besloten vennootschap), registered under company number 1007.754.576, with its registered office at Einde Were 274 bus 302, 9000 Ghent, Belgium (&ldquo;Avilo&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). Chiltepin BV is the data controller for the personal data described in this policy.
              </p>
              <p style={pStyle}>
                For any privacy question or request, contact us at <Email />.
              </p>
            </section>

            <section style={sectionStyle}>
              <h2 style={h2Style}>2. What data we collect</h2>
              <p style={pStyle}>We only collect data you give us or that is needed to run the website.</p>
              <p style={pStyle}>
                <Lead>Contact form:</Lead> name, email address, phone number (optional), nationality, current country of residence, destination country, the service you are interested in and your message.
              </p>
              <p style={pStyle}>
                <Lead>Consultations:</Lead> if you request a consultation, we use the contact details you provide to schedule it with you.
              </p>
              <p style={pStyle}>
                <Lead>Case work:</Lead> once you become a client, we process the documents and information needed for your application. Depending on the procedure this may include identity and travel documents, residence history, employment contracts, civil status documents, diplomas, and in some cases information required by the authorities such as medical certificates or criminal record extracts.
              </p>
              <p style={pStyle}>
                <Lead>Sworn translations:</Lead> the documents you send for translation and your contact and billing details.
              </p>
              <p style={pStyle}>
                <Lead>Technical data:</Lead> basic server logs (such as IP address, browser type and time of visit) kept by our hosting provider for security and performance. Our hosting provider also derives your approximate country from your IP address so the homepage animation can start from your location; we do not store it. The phone number field in our forms loads country flag images from cdnjs, a public content delivery network run by Cloudflare, which receives your IP address when the images load.
              </p>
            </section>

            <section style={sectionStyle}>
              <h2 style={h2Style}>3. Why we use your data and on what legal basis</h2>
              <p style={pStyle}>
                <Lead>To answer your enquiry or quote request:</Lead> steps taken at your request before entering into a contract (Art. 6(1)(b) GDPR).
              </p>
              <p style={pStyle}>
                <Lead>To deliver consultations, translations and handle your case:</Lead> performance of a contract (Art. 6(1)(b)).
              </p>
              <p style={pStyle}>
                <Lead>To process special categories of data or criminal record data contained in your documents:</Lead> only where strictly necessary for your application, based on your explicit consent (Art. 9(2)(a)) and, where applicable, for the establishment of legal claims.
              </p>
              <p style={pStyle}>
                <Lead>To issue invoices and keep accounting records:</Lead> legal obligation (Art. 6(1)(c)).
              </p>
              <p style={pStyle}>
                <Lead>To keep the website secure and working:</Lead> our legitimate interest (Art. 6(1)(f)).
              </p>
              <p style={pStyle}>
                We do not sell your data, use it for advertising, or make decisions about you based solely on automated processing.
              </p>
            </section>

            <section style={sectionStyle}>
              <h2 style={h2Style}>4. Who we share your data with</h2>
              <p style={pStyle}>
                We work with a small number of service providers that process data on our behalf under data processing agreements:
              </p>
              <ul style={listStyle}>
                <li>Vercel Inc. (website hosting and storage of uploaded files)</li>
                <li>Resend (delivery of emails sent through our website forms, including confirmation emails)</li>
                <li>Google (email)</li>
              </ul>
              <p style={pStyle}>
                For your case, we share information with the authorities and organisations involved in your procedure, such as immigration offices, municipalities, embassies or your employer, only as needed to carry out the service you requested.
              </p>
            </section>

            <section style={sectionStyle}>
              <h2 style={h2Style}>5. Transfers outside the EU</h2>
              <p style={pStyle}>
                Some of our providers are based in, or use servers in, the United States. In those cases transfers rely on the EU-US Data Privacy Framework or on Standard Contractual Clauses approved by the European Commission.
              </p>
            </section>

            <section style={sectionStyle}>
              <h2 style={h2Style}>6. How long we keep your data</h2>
              <ul style={listStyle}>
                <li><Lead>Documents uploaded through the website:</Lead> deleted 6 months after upload.</li>
                <li><Lead>Enquiries and quote requests that do not lead to a client relationship:</Lead> 12 months, then deleted.</li>
                <li><Lead>Client files:</Lead> for the duration of the case and up to 5 years after it closes, to handle follow-up procedures and possible claims.</li>
                <li><Lead>Invoices and accounting records:</Lead> as long as required by Belgian law (currently 10 years).</li>
                <li><Lead>Server logs:</Lead> according to our hosting provider&rsquo;s standard retention, typically a few days to weeks.</li>
              </ul>
            </section>

            <section style={sectionStyle}>
              <h2 style={h2Style}>7. Cookies</h2>
              <p style={pStyle}>
                We do not use advertising or tracking cookies. The website only uses technically necessary cookies. If this changes, we will ask for your consent first.
              </p>
            </section>

            <section style={sectionStyle}>
              <h2 style={h2Style}>8. Your rights</h2>
              <p style={pStyle}>
                You have the right to access, correct or delete your data, restrict or object to its processing, receive it in a portable format, and withdraw your consent at any time without affecting earlier processing. To exercise any of these rights, email <Email />. We will reply within one month.
              </p>
              <p style={pStyle}>
                You can also file a complaint with the Belgian Data Protection Authority (Gegevensbeschermingsautoriteit / Autorité de protection des données), Rue de la Presse 35, 1000 Brussels,{' '}
                <a href="https://www.dataprotectionauthority.be" target="_blank" rel="noopener noreferrer" className="link-ink" style={{ textDecoration: 'underline' }}>
                  dataprotectionauthority.be
                </a>
                , or with the authority in your own EU country of residence.
              </p>
            </section>

            <section style={sectionStyle}>
              <h2 style={h2Style}>9. Security</h2>
              <p style={pStyle}>
                We use encrypted connections, restricted access and reputable providers to protect your data. Case documents are only accessible to the people working on your file.
              </p>
            </section>

            <section style={sectionStyle}>
              <h2 style={h2Style}>10. Changes</h2>
              <p style={pStyle}>We may update this policy. The date at the top shows the latest version.</p>
            </section>
          </article>
        </Container>
      </main>
      <Footer />
    </>
  )
}
