import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Avilo Immigration — Expert guidance, clear pricing, support from start to finish.',
  description: 'Avilo helps individuals and families navigate immigration in Belgium and the Netherlands — with expertise, clarity, and care.',
  openGraph: {
    title: 'Avilo Immigration',
    description: 'Expert immigration guidance in Belgium and the Netherlands.',
    url: 'https://www.aviloimmigration.com',
    siteName: 'Avilo Immigration',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Avilo Immigration',
    description: 'Expert immigration guidance in Belgium and the Netherlands.',
    images: ['/images/og-image.jpg'],
  },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
