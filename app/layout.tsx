import type { Metadata } from 'next'
import { Libre_Baskerville, Atkinson_Hyperlegible_Next } from 'next/font/google'
import { SITE_NAME, SITE_URL, sharedOpenGraph, sharedTwitter } from '@/i18n/seo'
import './globals.css'

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-heading',
  display: 'swap',
})

const atkinsonHyperlegible = Atkinson_Hyperlegible_Next({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: SITE_NAME,
  description: 'Immigration services in Belgium, the Netherlands, Luxembourg and France.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    ...sharedOpenGraph,
    title: SITE_NAME,
    description: 'Immigration services in Belgium, the Netherlands, Luxembourg and France.',
    url: SITE_URL,
  },
  twitter: {
    ...sharedTwitter,
    title: SITE_NAME,
  },
  icons: {
    icon: [
      { url: '/favicons/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicons/favicon.ico' },
    ],
    apple: '/favicons/apple-touch-icon.png',
    other: [
      { rel: 'manifest', url: '/favicons/site.webmanifest' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${libreBaskerville.variable} ${atkinsonHyperlegible.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
