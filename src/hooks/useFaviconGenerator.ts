import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

interface TextSettings {
  text: string;
  font: string;
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

  const updateIconSettings = useCallback((updates: Partial<IconSettings>) => {
    setIconSettings(prev => ({ ...prev, ...updates }));
    if (updates.selectedIcon) {
      generateIconPreview({ ...iconSettings, ...updates });
    }
  }, [iconSettings]);

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

      // Calculate font size based on text length
      const fontSize = settings.text.length === 1 ? 300 : 200;
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

  const generateIconPreview = useCallback((settings: IconSettings) => {
    if (!settings.selectedIcon) {
      setPreviewUrl('');
      return;
    }

    // TODO: Implement icon preview generation
    // This will be implemented when we add the icon library
    console.log('Generating icon preview for:', settings.selectedIcon);
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
    generateIconPreview
  };
}; 
