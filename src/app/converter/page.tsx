import FaviconConverter from '@/components/FaviconConverter';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Favicon Converter - Convert Images to Multiple Favicon Sizes',
  description: 'Convert any image to favicons in multiple sizes for all devices. Generate ICO, PNG favicons for browsers, Apple Touch Icons, Android icons, and Windows tiles. Free favicon converter.',
  keywords: [
    'favicon converter',
    'image to favicon',
    'convert image to favicon',
    'favicon sizes',
    'ico converter',
    'png favicon',
    'apple touch icon',
    'android icon',
    'windows tile',
    'favicon package',
    'multiple favicon sizes',
    'free favicon converter',
    'favicon generator online'
  ],
  openGraph: {
    title: 'Favicon Converter - Convert Images to Multiple Favicon Sizes',
    description: 'Convert any image to favicons in multiple sizes for all devices. Generate ICO, PNG favicons for browsers, Apple Touch Icons, Android icons, and Windows tiles.',
    url: `${siteConfig.url}/converter`,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Favicon Converter - Convert images to multiple favicon sizes',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Favicon Converter - Convert Images to Multiple Favicon Sizes',
    description: 'Convert any image to favicons in multiple sizes for all devices. Generate ICO, PNG favicons for browsers, Apple Touch Icons, Android icons, and Windows tiles.',
    images: [siteConfig.ogImage],
    creator: siteConfig.links.twitter.replace('https://twitter.com/', '@'),
  },
  alternates: {
    canonical: '/converter',
  },
};

export default function ConverterPage() {
  return (
    <div className="page">
      <FaviconConverter />
    </div>
  );
} 
