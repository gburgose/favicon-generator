export interface FaviconSize {
  size: number;
  name: string;
  fileName: string;
  purpose: string;
  format: 'png' | 'ico';
  recommended: boolean;
}

export const FAVICON_SIZES: FaviconSize[] = [
  {
    size: 16,
    name: '16x16-ico',
    fileName: 'favicon.ico',
    purpose: 'Classic ICO Favicon',
    format: 'ico',
    recommended: false
  },
  {
    size: 16,
    name: '16x16',
    fileName: 'favicon-16x16.png',
    purpose: 'Modern PNG Favicon',
    format: 'png',
    recommended: true
  },
  {
    size: 32,
    name: '32x32',
    fileName: 'favicon-32x32.png',
    purpose: 'Modern PNG Favicon',
    format: 'png',
    recommended: true
  },
  {
    size: 57,
    name: '57x57',
    fileName: 'apple-icon-57x57.png',
    purpose: 'Apple Touch Icon',
    format: 'png',
    recommended: false
  },
  {
    size: 60,
    name: '60x60',
    fileName: 'apple-icon-60x60.png',
    purpose: 'Apple Touch Icon',
    format: 'png',
    recommended: false
  },
  {
    size: 72,
    name: '72x72',
    fileName: 'apple-icon-72x72.png',
    purpose: 'Apple Touch Icon',
    format: 'png',
    recommended: false
  },
  {
    size: 76,
    name: '76x76',
    fileName: 'apple-icon-76x76.png',
    purpose: 'Apple Touch Icon',
    format: 'png',
    recommended: false
  },
  {
    size: 96,
    name: '96x96',
    fileName: 'favicon-96x96.png',
    purpose: 'Modern PNG Favicon',
    format: 'png',
    recommended: false
  },
  {
    size: 114,
    name: '114x114',
    fileName: 'apple-icon-114x114.png',
    purpose: 'Apple Touch Icon',
    format: 'png',
    recommended: false
  },
  {
    size: 120,
    name: '120x120',
    fileName: 'apple-icon-120x120.png',
    purpose: 'Apple Touch Icon',
    format: 'png',
    recommended: false
  },
  {
    size: 144,
    name: '144x144',
    fileName: 'ms-icon-144x144.png',
    purpose: 'Windows Tiles',
    format: 'png',
    recommended: true
  },
  {
    size: 152,
    name: '152x152',
    fileName: 'apple-icon-152x152.png',
    purpose: 'Apple Touch Icon',
    format: 'png',
    recommended: false
  },
  {
    size: 180,
    name: '180x180',
    fileName: 'apple-icon-180x180.png',
    purpose: 'Apple Touch Icon',
    format: 'png',
    recommended: true
  },
  {
    size: 192,
    name: '192x192',
    fileName: 'android-icon-192x192.png',
    purpose: 'Android Icon',
    format: 'png',
    recommended: true
  },
  {
    size: 512,
    name: '512x512',
    fileName: 'android-icon-512x512.png',
    purpose: 'Android Icon',
    format: 'png',
    recommended: false
  }
]; 
