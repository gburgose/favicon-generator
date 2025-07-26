import { Sparkles, Palette, CheckCircle } from 'lucide-react';
import CardHome from '@/components/CardHome';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Favicon Tools - Convert, Create & Validate Website Icons',
  description: 'Professional favicon tools for web developers. Convert images to favicons, create custom icons from text/SVG, and validate favicon implementation. Free online favicon generator and converter.',
  keywords: [
    'favicon tools',
    'favicon generator',
    'favicon converter',
    'favicon validator',
    'website icons',
    'browser icons',
    'apple touch icon',
    'pwa icons',
    'web app manifest',
    'favicon creator',
    'online favicon maker',
    'free favicon generator'
  ],
  openGraph: {
    title: 'Favicon Tools - Convert, Create & Validate Website Icons',
    description: 'Professional favicon tools for web developers. Convert images to favicons, create custom icons from text/SVG, and validate favicon implementation.',
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Favicon Tools - Professional favicon generator and converter',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Favicon Tools - Convert, Create & Validate Website Icons',
    description: 'Professional favicon tools for web developers. Convert images to favicons, create custom icons from text/SVG, and validate favicon implementation.',
    images: [siteConfig.ogImage],
    creator: siteConfig.links.twitter.replace('https://twitter.com/', '@'),
  },
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <div className="page">
      <section className="home">
        <div className="home__header">
          <h1 className="home__title">
            Convert, Create & Validate Favicons
          </h1>
          <p className="home__subtitle">
            Optimize your website&apos;s visual identity from the browser tab.
          </p>
        </div>

        <div className="home__tools">
          <CardHome
            href="/converter"
            icon={Sparkles}
            title="Convert Favicon"
            description="Upload an image and convert it to multiple favicon sizes for all devices."
            features={["Multiple sizes", "All formats", "Instant download"]}
            isBeta={true}
          />

          <CardHome
            href="/generator"
            icon={Palette}
            title="Generate Favicon"
            description="Create custom favicons from text, SVG files, or icon libraries."
            features={["Text input", "Icon library", "SVG upload"]}
            isBeta={true}
          />

          <CardHome
            href="/validator"
            icon={CheckCircle}
            title="Validate Favicon"
            description="Check if your website has proper favicon implementation."
            features={["URL validation", "Size checking", "Format analysis"]}
            isBeta={true}
          />
        </div>
      </section>
    </div>
  );
}
