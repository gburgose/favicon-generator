import FaviconValidator from '@/components/FaviconValidator';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Favicon Validator - Check Website Favicon Implementation',
  description: 'Validate your website favicon implementation. Check if all required favicon sizes are present, analyze coverage, and ensure proper favicon setup for all devices and browsers.',
  keywords: [
    'favicon validator',
    'check favicon',
    'validate favicon',
    'favicon checker',
    'favicon analysis',
    'favicon coverage',
    'favicon implementation',
    'website favicon check',
    'favicon testing',
    'favicon audit',
    'favicon validation tool',
    'free favicon validator'
  ],
  openGraph: {
    title: 'Favicon Validator - Check Website Favicon Implementation',
    description: 'Validate your website favicon implementation. Check if all required favicon sizes are present, analyze coverage, and ensure proper favicon setup for all devices and browsers.',
    url: `${siteConfig.url}/validator`,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Favicon Validator - Check website favicon implementation',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Favicon Validator - Check Website Favicon Implementation',
    description: 'Validate your website favicon implementation. Check if all required favicon sizes are present, analyze coverage, and ensure proper favicon setup for all devices and browsers.',
    images: [siteConfig.ogImage],
    creator: siteConfig.links.twitter.replace('https://twitter.com/', '@'),
  },
  alternates: {
    canonical: '/validator',
  },
};

export default function ValidatorPage() {
  return (
    <div className="page">
      <FaviconValidator />
    </div>
  );
} 
