import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';
import { gtmEvents } from '@/utils/gtm';

interface FaviconSize {
  size: number;
  name: string;
}

interface AppSettings {
  name: string;
  description: string;
  themeColor: string;
}

const FAVICON_SIZES: FaviconSize[] = [
  { size: 16, name: '16x16' },
  { size: 32, name: '32x32' },
  { size: 192, name: '192x192' },
  { size: 512, name: '512x512' },
  { size: 180, name: '180x180' }, // Apple Touch Icon
  { size: 144, name: '144x144' }, // Windows Tile
];

export const useFaviconGenerator = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [generatedFavicons, setGeneratedFavicons] = useState<{ [key: string]: string }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [imageWarning, setImageWarning] = useState<string>('');
  const [appSettings, setAppSettings] = useState<AppSettings>({
    name: 'My App',
    description: 'Application description',
    themeColor: '#ffffff'
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setGeneratedFavicons({});
    setImageWarning('');

    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);

    // Track image upload
    gtmEvents.imageUploaded(file.name, file.size, file.type);

    // Create preview URL and check image dimensions
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Check image dimensions
    const img = new Image();
    img.onload = () => {
      if (img.width < 512 || img.height < 512) {
        setImageWarning(`Warning: Your image is ${img.width}x${img.height}px. For best quality, use an image of 512x512px or larger. The favicons will still be generated but larger sizes may appear pixelated.`);
        gtmEvents.smallImageWarning(img.width, img.height);
      }
    };
    img.src = url;
  }, []);

  const dropzoneProps = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    multiple: false
  });

  const generateFavicons = async () => {
    if (!selectedFile) return;

    setIsGenerating(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const favicons: { [key: string]: string } = {};

        FAVICON_SIZES.forEach(({ size, name }) => {
          canvas.width = size;
          canvas.height = size;

          // Clear canvas
          ctx.clearRect(0, 0, size, size);

          // Calculate scaling to fit image in square
          const scale = Math.min(size / img.width, size / img.height);
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;
          const x = (size - scaledWidth) / 2;
          const y = (size - scaledHeight) / 2;

          // Draw image centered
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

          // Convert to data URL
          favicons[name] = canvas.toDataURL('image/png');
        });

        setGeneratedFavicons(favicons);
        toast.success('Favicons generated successfully!');
        setIsGenerating(false);

        // Track successful generation
        gtmEvents.faviconsGenerated(
          FAVICON_SIZES.length + 1, // +1 for favicon.ico
          appSettings.name,
          `${img.width}x${img.height}`
        );

        // Scroll to generated favicons section
        setTimeout(() => {
          const element = document.getElementById('generated-favicons');
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 100);
      };

      img.onerror = () => {
        throw new Error('Failed to load image');
      };

      img.src = URL.createObjectURL(selectedFile);

    } catch (error) {
      toast.error('Failed to generate favicons. Please try again.');
      setIsGenerating(false);
      gtmEvents.generationError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const downloadFavicons = async () => {
    if (Object.keys(generatedFavicons).length === 0) return;

    setIsDownloading(true);

    try {
      const zip = new JSZip();

      // Add each favicon to the zip with correct names
      Object.entries(generatedFavicons).forEach(([name, dataUrl]) => {
        // Convert data URL to blob
        const base64Data = dataUrl.split(',')[1];
        const blob = new Blob([Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))], {
          type: 'image/png'
        });

        // Use correct file names based on the meta tags
        let fileName = '';
        switch (name) {
          case '16x16':
            fileName = 'favicon-16x16.png';
            break;
          case '32x32':
            fileName = 'favicon-32x32.png';
            break;
          case '192x192':
            fileName = 'favicon-192x192.png';
            break;
          case '512x512':
            fileName = 'favicon-512x512.png';
            break;
          case '180x180':
            fileName = 'apple-touch-icon.png';
            break;
          case '144x144':
            fileName = 'mstile-144x144.png';
            break;
          default:
            fileName = `favicon-${name}.png`;
        }

        zip.file(fileName, blob);
      });

      // Generate favicon.ico (using 32x32 as base)
      if (generatedFavicons['32x32']) {
        const icoData = generatedFavicons['32x32'].split(',')[1];
        const icoBlob = new Blob([Uint8Array.from(atob(icoData), c => c.charCodeAt(0))], {
          type: 'image/x-icon'
        });
        zip.file('favicon.ico', icoBlob);
      }

      // Generate site.webmanifest
      const manifest = {
        name: appSettings.name,
        short_name: appSettings.name,
        description: appSettings.description,
        start_url: "/",
        display: "standalone",
        background_color: appSettings.themeColor,
        theme_color: appSettings.themeColor,
        icons: [
          {
            src: "/favicon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/favicon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      };

      zip.file('site.webmanifest', JSON.stringify(manifest, null, 2));

      // Generate HTML snippet with all the favicon links
      const htmlSnippet = `<!-- Classic Favicon -->
<link rel="shortcut icon" href="/favicon.ico">

<!-- Modern PNG Favicons -->
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- Windows Tiles -->
<meta name="msapplication-TileColor" content="${appSettings.themeColor}">
<meta name="msapplication-TileImage" content="/mstile-144x144.png">

<!-- Manifest and Theme Color -->
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${appSettings.themeColor}">`;

      zip.file('meta-tags.html', htmlSnippet);

      // Generate README.md with installation instructions
      const readmeContent = `# Favicon Package

This package contains all the favicon files needed for your website.

## Files Included

- \`favicon.ico\` - Classic favicon for older browsers
- \`favicon-16x16.png\` - Small favicon for modern browsers
- \`favicon-32x32.png\` - Standard favicon for modern browsers
- \`favicon-192x192.png\` - Large favicon for Android devices
- \`favicon-512x512.png\` - Extra large favicon for Android devices
- \`apple-touch-icon.png\` - Icon for iOS devices
- \`mstile-144x144.png\` - Icon for Windows tiles
- \`site.webmanifest\` - Web app manifest for PWA support
- \`meta-tags.html\` - HTML meta tags to include in your website

## Installation

1. Upload all the favicon files to your website's root directory (public folder)
2. Add the following meta tags to your HTML <head> section:

\`\`\`html
<!-- Classic Favicon -->
<link rel="shortcut icon" href="/favicon.ico">

<!-- Modern PNG Favicons -->
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- Windows Tiles -->
<meta name="msapplication-TileColor" content="${appSettings.themeColor}">
<meta name="msapplication-TileImage" content="/mstile-144x144.png">

<!-- Manifest and Theme Color -->
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${appSettings.themeColor}">
\`\`\`

## Notes

- Make sure all files are accessible from your website's root URL
- The theme color in the meta tags should match your website's design
- For PWA support, ensure your server serves the \`site.webmanifest\` file with the correct MIME type (\`application/manifest+json\`)

## Browser Support

- **Chrome, Firefox, Safari, Edge**: Modern PNG favicons
- **Internet Explorer**: Classic .ico favicon
- **iOS Safari**: Apple Touch Icon
- **Android Chrome**: Large PNG favicons
- **Windows**: Tile icons for pinned sites

Generated with Favicon Generator - Create professional favicons for your website!`;

      zip.file('README.md', readmeContent);

      // Generate and download zip
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'favicons.zip');

      // Track download
      gtmEvents.faviconsDownloaded(
        FAVICON_SIZES.length + 1, // +1 for favicon.ico
        appSettings.name
      );

      toast.success('Favicons and files downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download favicons. Please try again.');
      gtmEvents.generationError(error instanceof Error ? error.message : 'Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  const clearAll = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setGeneratedFavicons({});
    setImageWarning('');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // Track clear action
    gtmEvents.allCleared();
  };

  const updateAppSettings = (updates: Partial<AppSettings>) => {
    setAppSettings(prev => {
      const newSettings = { ...prev, ...updates };

      // Track app configuration changes
      if (updates.name || updates.themeColor || updates.description) {
        gtmEvents.appConfigured(
          newSettings.name,
          newSettings.themeColor,
          !!newSettings.description
        );
      }

      return newSettings;
    });
  };

  const copyMetaTags = () => {
    const metaTags = getMetaTags();
    navigator.clipboard.writeText(metaTags);
    toast.success('Meta tags copied to clipboard!');
    gtmEvents.metaTagsCopied();
  };

  const getMetaTags = () => {
    return `<!-- Classic Favicon -->
<link rel="shortcut icon" href="/favicon.ico">

<!-- Modern PNG Favicons -->
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- Windows Tiles -->
<meta name="msapplication-TileColor" content="${appSettings.themeColor}">
<meta name="msapplication-TileImage" content="/mstile-144x144.png">

<!-- Manifest and Theme Color -->
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${appSettings.themeColor}">`;
  };

  const getManifest = () => {
    return {
      name: appSettings.name,
      short_name: appSettings.name,
      description: appSettings.description,
      start_url: "/",
      display: "standalone",
      background_color: appSettings.themeColor,
      theme_color: appSettings.themeColor,
      icons: [
        {
          src: "/favicon-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/favicon-512x512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    };
  };

  const copyManifest = () => {
    const manifest = getManifest();
    navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
    toast.success('Manifest copied to clipboard!');
    gtmEvents.manifestCopied();
  };

  // Helper functions for favicon table
  const getFileName = (name: string) => {
    switch (name) {
      case '16x16': return 'favicon-16x16.png';
      case '32x32': return 'favicon-32x32.png';
      case '192x192': return 'favicon-192x192.png';
      case '512x512': return 'favicon-512x512.png';
      case '180x180': return 'apple-touch-icon.png';
      case '144x144': return 'mstile-144x144.png';
      default: return `favicon-${name}.png`;
    }
  };

  const getFaviconPurpose = (name: string) => {
    switch (name) {
      case '16x16': return 'Modern PNG Favicon';
      case '32x32': return 'Modern PNG Favicon';
      case '192x192': return 'Modern PNG Favicon';
      case '512x512': return 'Modern PNG Favicon';
      case '180x180': return 'Apple Touch Icon';
      case '144x144': return 'Windows Tiles';
      default: return 'General favicon';
    }
  };

  const getFileSize = (dataUrl: string) => {
    if (!dataUrl) return '0 KB';
    const base64 = dataUrl.split(',')[1];
    const bytes = atob(base64).length;
    const kb = (bytes / 1024).toFixed(1);
    return `${kb} KB`;
  };

  return {
    // State
    selectedFile,
    previewUrl,
    generatedFavicons,
    isGenerating,
    isDownloading,
    appSettings,
    imageWarning,

    // Dropzone
    dropzoneProps,

    // Actions
    generateFavicons,
    downloadFavicons,
    clearAll,
    updateAppSettings,
    copyMetaTags,
    copyManifest,

    // Data
    getMetaTags,
    getManifest,

    // Helpers
    getFileName,
    getFaviconPurpose,
    getFileSize,

    // Constants
    FAVICON_SIZES
  };
}; 
