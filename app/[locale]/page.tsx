import { setRequestLocale } from 'next-intl/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import WhereWeOperate from '@/components/sections/WhereWeOperate'
import HowItWorks from '@/components/sections/HowItWorks'
import Testimonials from '@/components/sections/Testimonials'
import Contact from '@/components/sections/Contact'
import CTABanner from '@/components/sections/CTABanner'
import { routing } from '@/i18n/routing'

type Props = {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <WhereWeOperate />
        <HowItWorks />
        <Testimonials />
        <Contact />
        <CTABanner />
      </main>
      <Footer />
    </>
  )
}
