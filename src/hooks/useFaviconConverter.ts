import { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { gtmEvents } from '@/utils/gtm';
import { FAVICON_SIZES } from '@/config/favicons';
import { useConverterStore } from '@/store/converterStore';

export const useFaviconConverter = () => {
  const {
    // State from store
    selectedFile,
    previewUrl,
    fileDataUrl,
    generatedFavicons,
    isGenerating,
    isDownloading,
    appSettings,
    tempAppSettings,
    imageWarning,
    selectedFaviconSizes,
    showFavicons,
    showMetaTags,
    showManifest,

    // Actions from store
    setSelectedFile,
    setPreviewUrl,
    setFileDataUrl,
    setGeneratedFavicons,
    setIsGenerating,
    setIsDownloading,
    setAppSettings,
    setTempAppSettings,
    updateTempAppSettings,
    setSelectedFaviconSizes,
    toggleFaviconSize,
    setImageWarning,
    setShowFavicons,
    setShowMetaTags,
    setShowManifest,
    clearAll: clearAllStore
  } = useConverterStore();

  // Check if there's a generated favicon from the Generator
  useEffect(() => {
    const generatedFavicon = localStorage.getItem('generatedFavicon');
    const faviconSource = localStorage.getItem('faviconSource');

    if (generatedFavicon && faviconSource === 'generator') {
      // Convert data URL to File object
      const base64Data = generatedFavicon.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const file = new File([byteArray], 'generated-favicon.png', { type: 'image/png' });

      // Set the file and preview
      setSelectedFile(file);
      setPreviewUrl(generatedFavicon);
      setFileDataUrl(generatedFavicon);

      // Clear localStorage
      localStorage.removeItem('generatedFavicon');
      localStorage.removeItem('faviconSource');

      // Detect dominant color for image from generator
      const img = new Image();
      img.onload = () => {
        try {
          console.log('Detecting color for image from generator:', img.width, 'x', img.height);
          const dominantColor = detectDominantColor(img);
          console.log('Setting theme color to:', dominantColor);
          updateTempAppSettings({ themeColor: dominantColor });
          toast.success(`Theme color automatically set to ${dominantColor}`);
        } catch (error) {
          console.warn('Could not detect dominant color for image from generator:', error);
        }
      };
      img.src = generatedFavicon;

      // Show success message
      toast.success('Image from Generator loaded successfully!');
    }
  }, [setSelectedFile, setPreviewUrl, setFileDataUrl]);

  // Restore image from persisted data URL
  useEffect(() => {
    if (fileDataUrl && !selectedFile) {
      // Convert data URL back to File object
      const base64Data = fileDataUrl.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const file = new File([byteArray], 'restored-image.png', { type: 'image/png' });

      setSelectedFile(file);
      setPreviewUrl(fileDataUrl);

      // Clear generated favicons when restoring image (they need to be regenerated)
      setGeneratedFavicons({});

      // Detect dominant color when restoring image
      const img = new Image();
      img.onload = () => {
        try {
          console.log('Detecting color for restored image:', img.width, 'x', img.height);
          const dominantColor = detectDominantColor(img);
          console.log('Setting theme color to:', dominantColor);
          updateTempAppSettings({ themeColor: dominantColor });
          toast.success(`Theme color automatically set to ${dominantColor}`);
        } catch (error) {
          console.warn('Could not detect dominant color for restored image:', error);
        }
      };
      img.src = fileDataUrl;
    }
  }, [fileDataUrl, selectedFile, setSelectedFile, setPreviewUrl, setGeneratedFavicons, updateTempAppSettings]);

  // Función para detectar el color predominante de una imagen
  const detectDominantColor = (imageElement: HTMLImageElement): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '#ffffff';

    // Reducir el tamaño para mejorar el rendimiento
    const maxSize = 50;
    const scale = Math.min(maxSize / imageElement.width, maxSize / imageElement.height);
    canvas.width = imageElement.width * scale;
    canvas.height = imageElement.height * scale;

    // Dibujar la imagen en el canvas
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

    // Obtener los datos de píxeles
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Contar colores
    const colorCounts: { [key: string]: number } = {};

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Ignorar píxeles transparentes o muy claros
      if (a < 128 || (r > 240 && g > 240 && b > 240)) continue;

      // Redondear colores para agrupar similares (más agresivo)
      const roundedR = Math.round(r / 20) * 20;
      const roundedG = Math.round(g / 20) * 20;
      const roundedB = Math.round(b / 20) * 20;

      const colorKey = `${roundedR},${roundedG},${roundedB}`;
      colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
    }

    // Encontrar el color más frecuente
    let dominantColor = '#ffffff';
    let maxCount = 0;

    for (const [colorKey, count] of Object.entries(colorCounts)) {
      if (count > maxCount) {
        maxCount = count;
        const [r, g, b] = colorKey.split(',').map(Number);
        dominantColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      }
    }

    console.log('Detected dominant color:', dominantColor, 'from', Object.keys(colorCounts).length, 'color groups');
    return dominantColor;
  };

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

    // Convert file to data URL for persistence
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setFileDataUrl(dataUrl);
    };
    reader.readAsDataURL(file);

    // Check image dimensions and detect dominant color
    const img = new Image();
    img.onload = () => {
      if (img.width < 512 || img.height < 512) {
        setImageWarning(`Warning: Your image is ${img.width}x${img.height}px. For best quality, use an image of 512x512px or larger. The favicons will still be generated but larger sizes may appear pixelated.`);
        gtmEvents.smallImageWarning(img.width, img.height);
      }

      // Detectar color predominante y aplicarlo al Theme Color
      try {
        console.log('Starting color detection for image:', img.width, 'x', img.height);
        const dominantColor = detectDominantColor(img);
        console.log('Setting theme color to:', dominantColor);
        updateTempAppSettings({ themeColor: dominantColor });
        toast.success(`Theme color automatically set to ${dominantColor}`);
      } catch (error) {
        console.warn('Could not detect dominant color:', error);
      }
    };
    img.src = url;
  }, [setGeneratedFavicons, setImageWarning, setSelectedFile, setPreviewUrl, updateTempAppSettings]);

  const dropzoneProps = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    multiple: false
  });

  const generateFavicons = async () => {
    if (!selectedFile) return;

    // Apply temporary app settings when generating
    setAppSettings(tempAppSettings);

    setIsGenerating(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const favicons: { [key: string]: string } = {};

        const selectedSizes = getSelectedFaviconSizes();
        FAVICON_SIZES.filter(size => selectedSizes.includes(size.name)).forEach(({ size, name, format }) => {
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

          // Convert to data URL based on format
          const mimeType = format === 'ico' ? 'image/x-icon' : 'image/png';
          favicons[name] = canvas.toDataURL(mimeType);
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

        // Use correct file names based on the configuration
        const faviconSize = FAVICON_SIZES.find(size => size.name === name);
        const fileName = faviconSize ? faviconSize.fileName : `favicon-${name}.png`;

        zip.file(fileName, blob);
      });

      // Generate favicon.ico (using the ICO format from config)
      const icoFavicon = FAVICON_SIZES.find(size => size.format === 'ico');
      if (icoFavicon && generatedFavicons[icoFavicon.name]) {
        const icoData = generatedFavicons[icoFavicon.name].split(',')[1];
        const icoBlob = new Blob([Uint8Array.from(atob(icoData), c => c.charCodeAt(0))], {
          type: 'image/x-icon'
        });
        zip.file(icoFavicon.fileName, icoBlob);
      }

      // Generate site.webmanifest dynamically
      const manifest = getManifest();

      zip.file('manifest.json', JSON.stringify(manifest, null, 2));

      // Generate HTML snippet with all the favicon links
      const htmlSnippet = getMetaTags();

      zip.file('meta-tags.html', htmlSnippet);

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
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will clear all uploaded images and generated favicons. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F3DFA2',
      cancelButtonColor: '#666',
      confirmButtonText: 'Yes, clear everything',
      cancelButtonText: 'Cancel',
      background: '#1e1e1e',
      color: '#EFE6DD'
    }).then((result) => {
      if (result.isConfirmed) {
        clearAllStore();
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }

        // Track clear action
        gtmEvents.allCleared();

        toast.success('All data cleared successfully!');
      }
    });
  };

  const updateAppSettings = (updates: Partial<typeof tempAppSettings>) => {
    updateTempAppSettings(updates);

    // Track app configuration changes
    if (updates.name || updates.themeColor || updates.description) {
      const newSettings = { ...tempAppSettings, ...updates };
      gtmEvents.appConfigured(
        newSettings.name,
        newSettings.themeColor,
        !!newSettings.description
      );
    }
  };

  const getSelectedFaviconSizes = () => {
    return selectedFaviconSizes;
  };

  const isFaviconSelected = (name: string) => {
    return selectedFaviconSizes.includes(name);
  };

  const copyMetaTags = () => {
    const metaTags = getMetaTags();
    navigator.clipboard.writeText(metaTags);
    toast.success('Meta tags copied to clipboard!');
    gtmEvents.metaTagsCopied();
  };

  const getMetaTags = () => {
    const selectedSizes = getSelectedFaviconSizes();

    // Generate Apple Touch Icons (individual links like favicon-generator.org)
    const appleTouchIcons = FAVICON_SIZES
      .filter(size => size.purpose === 'Apple Touch Icon' && selectedSizes.includes(size.name))
      .map(size => `<link rel="apple-touch-icon" sizes="${size.name}" href="/${size.fileName}">`)
      .join('\n');

    // Generate Modern PNG Favicons (excluding Android)
    const faviconLinks = FAVICON_SIZES
      .filter(size => size.purpose === 'Modern PNG Favicon' && selectedSizes.includes(size.name) && !size.fileName.includes('android'))
      .map(size => `<link rel="icon" type="image/png" sizes="${size.name}" href="/${size.fileName}">`)
      .join('\n');

    // Generate Android Icons separately
    const androidIcons = FAVICON_SIZES
      .filter(size => size.fileName.includes('android') && selectedSizes.includes(size.name))
      .map(size => `<link rel="icon" type="image/png" sizes="${size.name}" href="/${size.fileName}">`)
      .join('\n');

    // Windows Tile
    const windowsTile = FAVICON_SIZES
      .find(size => size.purpose === 'Windows Tiles' && selectedSizes.includes(size.name));

    // ICO favicon
    const icoFavicon = FAVICON_SIZES.find(size => size.format === 'ico' && selectedSizes.includes(size.name));

    return `${icoFavicon ? `<!-- Classic Favicon -->
<link rel="shortcut icon" href="/${icoFavicon.fileName}">

` : ''}${appleTouchIcons ? `<!-- Apple Touch Icons -->
${appleTouchIcons}

` : ''}${faviconLinks ? `<!-- Modern PNG Favicons -->
${faviconLinks}

` : ''}${androidIcons ? `<!-- Android Icons -->
${androidIcons}

` : ''}${windowsTile ? `<!-- Microsoft Tile Icons -->
<meta name="msapplication-TileImage" content="/${windowsTile.fileName}">

` : ''}<!-- Manifest and Theme Color -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="${appSettings.themeColor}">
<meta name="msapplication-TileColor" content="${appSettings.themeColor}">`;
  };

  const getManifest = () => {
    const selectedSizes = getSelectedFaviconSizes();

    return {
      name: appSettings.name,
      short_name: appSettings.name,
      description: appSettings.description,
      start_url: "/",
      display: "standalone",
      background_color: appSettings.themeColor,
      theme_color: appSettings.themeColor,
      icons: FAVICON_SIZES
        .filter(size => size.size >= 192 && selectedSizes.includes(size.name)) // Only include selected icons 192px and larger for manifest
        .map(size => ({
          src: `/${size.fileName}`,
          sizes: size.name,
          type: "image/png"
        }))
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
    const faviconSize = FAVICON_SIZES.find(size => size.name === name);
    return faviconSize ? faviconSize.fileName : `favicon-${name}.png`;
  };

  const getFaviconPurpose = (name: string) => {
    const faviconSize = FAVICON_SIZES.find(size => size.name === name);
    return faviconSize ? faviconSize.purpose : 'General favicon';
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
    tempAppSettings,
    imageWarning,
    showFavicons,
    showMetaTags,
    showManifest,

    // Dropzone
    dropzoneProps,
    onDrop,

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
    FAVICON_SIZES,

    // Favicon selection
    selectedFaviconSizes,
    toggleFaviconSize,
    getSelectedFaviconSizes,
    isFaviconSelected,

    // UI state setters
    setShowFavicons,
    setShowMetaTags,
    setShowManifest,

    // Color detection
    detectDominantColor
  };
}; 
