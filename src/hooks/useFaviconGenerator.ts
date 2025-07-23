import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

interface TextSettings {
  text: string;
  font: string;
  size: string;
  backgroundColor: string;
  textColor: string;
}

interface SvgSettings {
  file: File | null;
  backgroundColor: string;
  iconColor: string;
}

interface IconSettings {
  selectedIcon: string;
  backgroundColor: string;
  iconColor: string;
}

export const useFaviconGenerator = () => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Text settings
  const [textSettings, setTextSettings] = useState<TextSettings>({
    text: 'FT',
    font: 'Inter',
    size: 'medium',
    backgroundColor: '#F3DFA2',
    textColor: '#333'
  });

  // SVG settings
  const [svgSettings, setSvgSettings] = useState<SvgSettings>({
    file: null,
    backgroundColor: '#F3DFA2',
    iconColor: '#231F20'
  });

  // Icon settings
  const [iconSettings, setIconSettings] = useState<IconSettings>({
    selectedIcon: '',
    backgroundColor: '#F3DFA2',
    iconColor: '#231F20'
  });

  // Generar preview inicial
  useEffect(() => {
    if (textSettings.text) {
      generateTextPreview(textSettings);
    }
  }, []);

  const updateTextSettings = useCallback((updates: Partial<TextSettings>) => {
    setTextSettings(prev => {
      const newSettings = { ...prev, ...updates };

      // Solo actualizar preview automáticamente si cambian los colores
      if (updates.backgroundColor || updates.textColor) {
        generateTextPreview(newSettings);
      }

      return newSettings;
    });
  }, []);

  const updateSvgSettings = useCallback((updates: Partial<SvgSettings>) => {
    setSvgSettings(prev => ({ ...prev, ...updates }));
    if (updates.file) {
      generateSvgPreview({ ...svgSettings, ...updates });
    }
  }, [svgSettings]);

  // Helper function to get SVG content for each icon
  const getIconSvg = (iconName: string): string => {
    const icons: { [key: string]: string } = {
      'heart': '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
      'star': '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
      'home': '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
      'user': '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
      'settings': '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
      'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
      'mail': '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
      'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
      'camera': '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
      'music': '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
      'bookmark': '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
      'download': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
      'upload': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
      'share': '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
      'thumbsup': '<path d="M14 9V5a3 3 0 0 0-6 0v4"/><rect x="2" y="9" width="20" height="12" rx="2" ry="2"/>',
      'eye': '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
      'plus': '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
      'minus': '<line x1="5" y1="12" x2="19" y2="12"/>',
      'check': '<polyline points="20 6 9 17 4 12"/>',
      'x': '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
      'zap': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'
    };

    return icons[iconName] || icons['star'];
  };

  const generateIconPreview = useCallback((settings: IconSettings) => {
    if (!settings.selectedIcon) {
      setPreviewUrl('');
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 512;
    canvas.height = 512;

    // Fill background
    ctx.fillStyle = textSettings.backgroundColor;
    ctx.fillRect(0, 0, 512, 512);

    // Create SVG with the selected icon - properly centered and sized
    const iconSize = 300; // Icono de tamaño medio
    const x = (512 / 2) - (iconSize / 2); // 256 - 150 = 106
    const y = (512 / 2) - (iconSize / 2); // 256 - 150 = 106

    const svgContent = `
      <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <rect width="512" height="512" fill="${textSettings.backgroundColor}"/>
        <g transform="translate(${x}, ${y}) scale(12.5)" fill="none" stroke="${textSettings.textColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${getIconSvg(settings.selectedIcon)}
        </g>
      </svg>
    `;

    // Convert SVG to image
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      setPreviewUrl(canvas.toDataURL());
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgContent);
  }, [textSettings]);

  const updateIconSettings = useCallback((updates: Partial<IconSettings>) => {
    setIconSettings(prev => ({ ...prev, ...updates }));
    if (updates.selectedIcon) {
      // Clear text when icon is selected
      setTextSettings(prev => ({ ...prev, text: '' }));
      generateIconPreview({ ...iconSettings, ...updates });
    }
  }, [iconSettings, generateIconPreview]);

  const generateTextPreview = useCallback((settings: TextSettings) => {
    console.log('Generating preview with settings:', settings);

    if (!settings.text.trim()) {
      setPreviewUrl('');
      return;
    }

    // Load Google Font
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${settings.font.replace(' ', '+')}:wght@400;600;700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Wait for font to load
    document.fonts.ready.then(() => {
      console.log('Font loaded, generating canvas');

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 512;
      canvas.height = 512;

      // Fill background
      ctx.fillStyle = settings.backgroundColor;
      ctx.fillRect(0, 0, 512, 512);

      // Set text properties
      ctx.fillStyle = settings.textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Calculate font size based on text length and selected size
      let fontSize;
      if (settings.size === 'small') {
        fontSize = settings.text.length === 1 ? 200 : 150;
      } else if (settings.size === 'large') {
        fontSize = settings.text.length === 1 ? 400 : 300;
      } else {
        // medium
        fontSize = settings.text.length === 1 ? 300 : 200;
      }
      ctx.font = `${fontSize}px "${settings.font}"`;

      console.log('Using font:', ctx.font);

      // Draw text
      ctx.fillText(settings.text.toUpperCase(), 256, 256);

      setPreviewUrl(canvas.toDataURL());
      console.log('Preview generated');
    });
  }, []);

  const generateSvgPreview = useCallback((settings: SvgSettings) => {
    if (!settings.file) {
      setPreviewUrl('');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const svgContent = e.target?.result as string;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 512;
      canvas.height = 512;

      // Fill background
      ctx.fillStyle = settings.backgroundColor;
      ctx.fillRect(0, 0, 512, 512);

      // Create image from SVG
      const img = new Image();
      img.onload = () => {
        // Calculate scaling to fit SVG in the canvas
        const scale = Math.min(400 / img.width, 400 / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (512 - scaledWidth) / 2;
        const y = (512 - scaledHeight) / 2;

        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        setPreviewUrl(canvas.toDataURL());
      };

      // Convert SVG colors and set as image source
      const coloredSvg = svgContent.replace(/fill="[^"]*"/g, `fill="${settings.iconColor}"`);
      img.src = 'data:image/svg+xml;base64,' + btoa(coloredSvg);
    };
    reader.readAsText(settings.file);
  }, []);



  const generateFavicon = useCallback(async () => {
    if (!previewUrl) {
      toast.error('Please create a preview first');
      return;
    }

    setIsGenerating(true);

    try {
      // Convert preview URL to blob
      const response = await fetch(previewUrl);
      const blob = await response.blob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'favicon-512x512.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Favicon downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download favicon');
    } finally {
      setIsGenerating(false);
    }
  }, [previewUrl]);

  return {
    // State
    previewUrl,
    isGenerating,
    textSettings,
    svgSettings,
    iconSettings,

    // Actions
    updateTextSettings,
    updateSvgSettings,
    updateIconSettings,
    generateFavicon,

    // Preview generators
    generateTextPreview,
    generateSvgPreview,
    generateIconPreview,

    // Helper functions
    getIconSvg
  };
}; 
