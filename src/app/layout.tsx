import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "../styles/globals.scss";

export const metadata: Metadata = {
  title: "Favicon Generator - Create Icons for Your Website",
  description: "Generate professional favicons in multiple sizes (16x16, 32x32, 192x192, 512x512) for your website. Supports PNG, JPG, WebP formats. Download complete favicon package with HTML meta tags and web app manifest.",
  keywords: [
    "favicon generator",
    "website icons",
    "favicon creator",
    "web development tools",
    "site icons",
    "browser icons",
    "apple touch icon",
    "pwa icons",
    "web app manifest"
  ],
  authors: [{ name: "Favicon Generator" }],
  creator: "Favicon Generator",
  publisher: "Favicon Generator",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://favicon-generator.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Favicon Generator - Create Icons for Your Website",
    description: "Generate professional favicons in multiple sizes for your website. Download complete package with HTML meta tags.",
    url: 'https://favicon-generator.vercel.app',
    siteName: 'Favicon Generator',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Favicon Generator - Create Icons for Your Website',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Favicon Generator - Create Icons for Your Website",
    description: "Generate professional favicons in multiple sizes for your website. Download complete package with HTML meta tags.",
    images: ['/og-image.png'],
    creator: '@favicon_generator',
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
    'theme-color': '#231F20',
    'msapplication-TileColor': '#231F20',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Favicon Generator',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
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
