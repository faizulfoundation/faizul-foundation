import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Lora, Plus_Jakarta_Sans } from 'next/font/google';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Footer } from '@/components/Footer';
import { FoundationProvider } from '@/components/FoundationProvider';
import { Navbar } from '@/components/Navbar';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { DEFAULT_EMAIL, DEFAULT_HELPLINE, FOUNDATION_NAME, FOUNDATION_TAGLINE } from '@/lib/foundation-defaults';
import './globals.css';

const lora = Lora({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-lora',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const APP_BASE_URL = process.env.APP_URL || 'https://faizulfoundation.org';

export const viewport: Viewport = {
  themeColor: '#0E7A21',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_BASE_URL),
  title: {
    default: 'Faizul Foundation — Serving Humanity & Supporting Education',
    template: '%s | Faizul Foundation',
  },
  description:
    'Official website for Faizul Foundation. Helping poor and needy people, supporting Islamic education, assisting Madrasas and Masjids, and receiving confidential help requests.',
  keywords: [
    'Faizul Foundation',
    'Humanitarian Assistance',
    'Education Support',
    'Madrasa Support',
    'Masjid Support',
    'Community Welfare',
    'Request Help',
  ],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: FOUNDATION_NAME,
  },
  openGraph: {
    title: 'Faizul Foundation — Serving Humanity & Supporting Education',
    description:
      'Helping poor and needy people, supporting Islamic education, and strengthening Madrasas, Masjids, and communities.',
    type: 'website',
    siteName: FOUNDATION_NAME,
    images: [
      {
        url: '/images/banner-humanity.jpg',
        width: 1280,
        height: 720,
        alt: 'Faizul Foundation — Serving Humanity',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Faizul Foundation',
    description: FOUNDATION_TAGLINE,
    images: ['/images/banner-humanity.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: FOUNDATION_NAME,
    description:
      'Helping poor and needy people, supporting Islamic education, and strengthening our communities.',
    url: APP_BASE_URL,
    logo: `${APP_BASE_URL}/icon-512x512.png`,
    email: DEFAULT_EMAIL,
    telephone: DEFAULT_HELPLINE,
  };

  return (
    <html
      lang="en"
      className={`${lora.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-white text-[#131D15]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <ErrorBoundary>
          <FoundationProvider>
            <OfflineIndicator />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </FoundationProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
