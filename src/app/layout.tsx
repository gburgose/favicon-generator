import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import "../styles/globals.scss";
import { siteConfig } from "@/config/site";
import { Montserrat, Poppins } from "next/font/google";
import CookieConsent from "@/components/CookieConsent";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LogRocketInit from "@/components/LogRocketInit";

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
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': siteConfig.name,
  },
  manifest: '/favicons/manifest.json',
};

const GTM_ID = 'GTM-P7FQSKFN';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Script estático en el head */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
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

        {/* Microsoft Tile Icons */}
        <meta name="msapplication-TileColor" content="#F3DFA2" />
        <meta name="msapplication-TileImage" content="/favicons/ms-icon-144x144.png" />

        {/* Microsoft Browser Config */}
        <meta name="msapplication-config" content="/favicons/browserconfig.xml" />

        {/* Google Site Verification */}
        <meta name="google-site-verification" content="ZGmqB_iCvwVhAWkyyY5htrL_3HU-grU4wIO6AH5u6po" />
      </head>
      <body className={`${montserrat.className} ${poppins.variable}`} style={{
        backgroundColor: '#100709',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 100 60'%3E%3Cg %3E%3Crect fill='%23100709' width='11' height='11'/%3E%3Crect fill='%2311080a' x='10' width='11' height='11'/%3E%3Crect fill='%2311090b' y='10' width='11' height='11'/%3E%3Crect fill='%23120a0c' x='20' width='11' height='11'/%3E%3Crect fill='%23120b0d' x='10' y='10' width='11' height='11'/%3E%3Crect fill='%23130c0e' y='20' width='11' height='11'/%3E%3Crect fill='%23130d0e' x='30' width='11' height='11'/%3E%3Crect fill='%23140e0f' x='20' y='10' width='11' height='11'/%3E%3Crect fill='%23150f10' x='10' y='20' width='11' height='11'/%3E%3Crect fill='%23150f11' y='30' width='11' height='11'/%3E%3Crect fill='%23161011' x='40' width='11' height='11'/%3E%3Crect fill='%23161112' x='30' y='10' width='11' height='11'/%3E%3Crect fill='%23161213' x='20' y='20' width='11' height='11'/%3E%3Crect fill='%23171213' x='10' y='30' width='11' height='11'/%3E%3Crect fill='%23171314' y='40' width='11' height='11'/%3E%3Crect fill='%23181414' x='50' width='11' height='11'/%3E%3Crect fill='%23181415' x='40' y='10' width='11' height='11'/%3E%3Crect fill='%23191516' x='30' y='20' width='11' height='11'/%3E%3Crect fill='%23191516' x='20' y='30' width='11' height='11'/%3E%3Crect fill='%231a1617' x='10' y='40' width='11' height='11'/%3E%3Crect fill='%231a1717' y='50' width='11' height='11'/%3E%3Crect fill='%231b1718' x='60' width='11' height='11'/%3E%3Crect fill='%231b1818' x='50' y='10' width='11' height='11'/%3E%3Crect fill='%231b1819' x='40' y='20' width='11' height='11'/%3E%3Crect fill='%231c1919' x='30' y='30' width='11' height='11'/%3E%3Crect fill='%231c191a' x='20' y='40' width='11' height='11'/%3E%3Crect fill='%231d1a1b' x='10' y='50' width='11' height='11'/%3E%3Crect fill='%231d1a1b' x='70' width='11' height='11'/%3E%3Crect fill='%231e1b1c' x='60' y='10' width='11' height='11'/%3E%3Crect fill='%231e1c1c' x='50' y='20' width='11' height='11'/%3E%3Crect fill='%231f1c1d' x='40' y='30' width='11' height='11'/%3E%3Crect fill='%231f1d1d' x='30' y='40' width='11' height='11'/%3E%3Crect fill='%23201d1e' x='20' y='50' width='11' height='11'/%3E%3Crect fill='%23201e1e' x='80' width='11' height='11'/%3E%3Crect fill='%23211e1f' x='70' y='10' width='11' height='11'/%3E%3Crect fill='%23211f1f' x='60' y='20' width='11' height='11'/%3E%3Crect fill='%23222020' x='50' y='30' width='11' height='11'/%3E%3Crect fill='%23222021' x='40' y='40' width='11' height='11'/%3E%3Crect fill='%23232121' x='30' y='50' width='11' height='11'/%3E%3Crect fill='%23232122' x='90' width='11' height='11'/%3E%3Crect fill='%23242222' x='80' y='10' width='11' height='11'/%3E%3Crect fill='%23242223' x='70' y='20' width='11' height='11'/%3E%3Crect fill='%23252323' x='60' y='30' width='11' height='11'/%3E%3Crect fill='%23252424' x='50' y='40' width='11' height='11'/%3E%3Crect fill='%23262424' x='40' y='50' width='11' height='11'/%3E%3Crect fill='%23262525' x='90' y='10' width='11' height='11'/%3E%3Crect fill='%23272526' x='80' y='20' width='11' height='11'/%3E%3Crect fill='%23272626' x='70' y='30' width='11' height='11'/%3E%3Crect fill='%23282627' x='60' y='40' width='11' height='11'/%3E%3Crect fill='%23282727' x='50' y='50' width='11' height='11'/%3E%3Crect fill='%23292828' x='90' y='20' width='11' height='11'/%3E%3Crect fill='%23292828' x='80' y='30' width='11' height='11'/%3E%3Crect fill='%232a2929' x='70' y='40' width='11' height='11'/%3E%3Crect fill='%232a292a' x='60' y='50' width='11' height='11'/%3E%3Crect fill='%232b2a2a' x='90' y='30' width='11' height='11'/%3E%3Crect fill='%232b2b2b' x='80' y='40' width='11' height='11'/%3E%3Crect fill='%232c2b2b' x='70' y='50' width='11' height='11'/%3E%3Crect fill='%232c2c2c' x='90' y='40' width='11' height='11'/%3E%3Crect fill='%232d2c2c' x='80' y='50' width='11' height='11'/%3E%3Crect fill='%232D2D2D' x='90' y='50' width='11' height='11'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover'
      }}>
        {/* GTM <noscript> para el body */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <div className="layout">
          <Header />
          <main className="layout__content">
            {children}
          </main>
          <Footer />
        </div>
        <CookieConsent />
        <ServiceWorkerRegistration />
        <LogRocketInit />
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
