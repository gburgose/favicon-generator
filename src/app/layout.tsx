import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { GoogleTagManager } from '@next/third-parties/google';
import "../styles/globals.scss";
import { siteConfig } from "@/config/site";
import { Montserrat, Poppins } from "next/font/google";
import CookieConsent from "@/components/CookieConsent";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: `${siteConfig.name} - Create Icons for Your Website`,
  description: `${siteConfig.description}. Supports PNG, JPG, WebP formats. Download complete favicon package with HTML meta tags and web app manifest.`,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  publisher: siteConfig.creator,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${siteConfig.name} - Create Icons for Your Website`,
    description: `${siteConfig.description}. Download complete package with HTML meta tags.`,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Create Icons for Your Website`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - Create Icons for Your Website`,
    description: `${siteConfig.description}. Download complete package with HTML meta tags.`,
    images: [siteConfig.ogImage],
    creator: siteConfig.links.twitter.replace('https://twitter.com/', '@'),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'web development',
  classification: 'web tools',
  other: {
    'theme-color': '#F3DFA2',
    'msapplication-TileColor': '#F3DFA2',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': siteConfig.name,
  },
  manifest: '/favicons/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleTagManager gtmId="GTM-P7FQSKFN" />


        {/* Classic Favicon */}
        <link rel="shortcut icon" href="/favicons/favicon.ico" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="57x57" href="/favicons/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/favicons/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/favicons/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/favicons/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/favicons/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/favicons/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/favicons/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-icon-180x180.png" />

        {/* Modern PNG Favicons */}
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicons/favicon-96x96.png" />

        {/* Android Icons */}
        <link rel="icon" type="image/png" sizes="192x192" href="/favicons/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicons/android-icon-512x512.png" />

        {/* Microsoft Icons */}
        <meta name="msapplication-TileColor" content="#F3DFA2" />
        <meta name="msapplication-TileImage" content="/favicons/ms-icon-144x144.png" />
        <meta name="msapplication-config" content="/favicons/browserconfig.xml" />
      </head>
      <body className={`${montserrat.className} ${poppins.variable}`}>
        <div className="layout">
          <Header />
          <main className="layout__content">
            {children}
          </main>
          <Footer />
        </div>
        <CookieConsent />
        <ServiceWorkerRegistration />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            className: 'toast-custom',
            style: {
              fontSize: '14px',
            },
            success: {
              duration: 3000,
              className: 'toast-custom success',
              iconTheme: {
                primary: '#231F20',
                secondary: '#7EBDC2',
              },
            },
            error: {
              duration: 4000,
              className: 'toast-custom error',
              iconTheme: {
                primary: '#EFE6DD',
                secondary: '#BB4430',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
