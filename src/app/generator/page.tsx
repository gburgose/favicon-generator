import FaviconGenerator from '@/components/FaviconGenerator';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Favicon Generator - Create Custom Icons from Text, SVG & Icons',
  description: 'Create professional favicons from text, SVG files, or icon libraries. Customize colors, fonts, and sizes. Download PNG favicons instantly. Free online favicon generator.',
  keywords: [
    'favicon generator',
    'create favicon',
    'text to favicon',
    'svg to favicon',
    'custom favicon maker',
    'favicon from text',
    'icon library',
    'favicon creator',
    'online favicon generator',
    'free favicon maker',
    'favicon design tool',
    'browser icon creator'
  ],
  openGraph: {
    title: 'Favicon Generator - Create Custom Icons from Text, SVG & Icons',
    description: 'Create professional favicons from text, SVG files, or icon libraries. Customize colors, fonts, and sizes. Download PNG favicons instantly.',
    url: `${siteConfig.url}/generator`,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Favicon Generator - Create custom icons from text and SVG',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Favicon Generator - Create Custom Icons from Text, SVG & Icons',
    description: 'Create professional favicons from text, SVG files, or icon libraries. Customize colors, fonts, and sizes. Download PNG favicons instantly.',
    images: [siteConfig.ogImage],
    creator: siteConfig.links.twitter.replace('https://twitter.com/', '@'),
  },
  alternates: {
    canonical: '/generator',
  },
};

export default function GeneratorPage() {
  return (
    <div className="page">
      <FaviconGenerator />
    </div>
  );
} 
