export const siteConfig = {
  name: 'Favicon Generator',
  description: 'Generate professional favicons in multiple sizes for your website',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://favicon-generator-beige.vercel.app',
  ogImage: '/og-image.png',
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || 'GTM-P7FQSKFN',
  links: {
    twitter: 'https://twitter.com/favicon_generator',
    github: 'https://github.com/yourusername/favicon-generator',
  },
  creator: 'Favicon Generator',
  keywords: [
    'favicon generator',
    'website icons',
    'favicon creator',
    'web development tools',
    'site icons',
    'browser icons',
    'apple touch icon',
    'pwa icons',
    'web app manifest'
  ],
} as const 
