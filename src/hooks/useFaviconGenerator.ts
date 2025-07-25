import { useState, useCallback, useEffect } from 'react';

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
    iconColor: '#333'
  });

  // Icon settings
  const [iconSettings, setIconSettings] = useState<IconSettings>({
    selectedIcon: '',
    backgroundColor: '#F3DFA2',
    iconColor: '#333'
  });

  const updateTextSettings = useCallback((updates: Partial<TextSettings>) => {
    setTextSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const updateSvgSettings = useCallback((updates: Partial<SvgSettings>) => {
    setSvgSettings(prev => {
      const newSettings = { ...prev, ...updates };

      // Sincronizar colores con los globales
      if (updates.backgroundColor === undefined) {
        newSettings.backgroundColor = textSettings.backgroundColor;
      }
      if (updates.iconColor === undefined) {
        newSettings.iconColor = textSettings.textColor;
      }

      return newSettings;
    });
  }, [textSettings.backgroundColor, textSettings.textColor]);

  const updateIconSettings = useCallback((updates: Partial<IconSettings>) => {
    setIconSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const selectFirstIcon = useCallback(() => {
    if (!iconSettings.selectedIcon) {
      setIconSettings(prev => ({ ...prev, selectedIcon: 'heart' }));
    }
  }, [iconSettings.selectedIcon]);

  // Sincronizar colores de SVG con los globales
  useEffect(() => {
    setSvgSettings(prev => ({
      ...prev,
      backgroundColor: textSettings.backgroundColor,
      iconColor: textSettings.textColor
    }));
  }, [textSettings.backgroundColor, textSettings.textColor]);

  // Sincronizar colores de iconos con los globales
  useEffect(() => {
    setIconSettings(prev => ({
      ...prev,
      backgroundColor: textSettings.backgroundColor,
      iconColor: textSettings.textColor
    }));
  }, [textSettings.backgroundColor, textSettings.textColor]);

  return {
    // State
    textSettings,
    svgSettings,
    iconSettings,

    // Actions
    updateTextSettings,
    updateSvgSettings,
    updateIconSettings,
    selectFirstIcon
  };
}; 
