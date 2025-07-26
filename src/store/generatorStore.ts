import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TextSettings {
  text: string;
  font: string;
  size: string;
  backgroundColor: string;
  textColor: string;
}

interface SvgSettings {
  file: File | null;
  svgContent: string; // Para persistir el contenido del SVG
  fileName: string; // Para persistir el nombre del archivo
  fileSize: number; // Para persistir el tamaño del archivo
  backgroundColor: string;
  fillColor: string;
  strokeColor: string;
}

interface IconSettings {
  selectedIcon: string;
  backgroundColor: string;
  iconColor: string;
}

interface ElementPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface GeneratorStore {
  // Active tab
  activeTab: 'text' | 'svg' | 'icons';

  // Settings for each tab
  textSettings: TextSettings;
  svgSettings: SvgSettings;
  iconSettings: IconSettings;

  // Element positions and sizes (for interactive preview) - independent for each type
  textPosition: ElementPosition;
  iconPosition: ElementPosition;
  svgPosition: ElementPosition;
  textSize: number;
  iconSize: number;
  svgSize: number;

  // Actions
  setActiveTab: (tab: 'text' | 'svg' | 'icons') => void;
  updateTextSettings: (updates: Partial<TextSettings>) => void;
  updateSvgSettings: (updates: Partial<SvgSettings>) => void;
  updateIconSettings: (updates: Partial<IconSettings>) => void;
  setTextPosition: (position: ElementPosition) => void;
  setIconPosition: (position: ElementPosition) => void;
  setSvgPosition: (position: ElementPosition) => void;
  setTextSize: (size: number) => void;
  setIconSize: (size: number) => void;
  setSvgSize: (size: number) => void;
  resetStore: () => void;
}

const defaultTextSettings: TextSettings = {
  text: 'FT',
  font: 'Inter',
  size: 'medium',
  backgroundColor: '#F3DFA2',
  textColor: '#333'
};

const defaultSvgSettings: SvgSettings = {
  file: null,
  svgContent: '',
  fileName: '',
  fileSize: 0,
  backgroundColor: '#F3DFA2',
  fillColor: '#333',
  strokeColor: '#333'
};

const defaultIconSettings: IconSettings = {
  selectedIcon: 'heart',
  backgroundColor: '#F3DFA2',
  iconColor: '#333'
};

const defaultElementPosition: ElementPosition = {
  x: 156,
  y: 156,
  width: 200,
  height: 200
};

export const useGeneratorStore = create<GeneratorStore>()(
  persist(
    (set, get) => ({
      // Initial state
      activeTab: 'text',
      textSettings: defaultTextSettings,
      svgSettings: defaultSvgSettings,
      iconSettings: defaultIconSettings,
      textPosition: defaultElementPosition,
      iconPosition: defaultElementPosition,
      svgPosition: defaultElementPosition,
      textSize: 120,
      iconSize: 120,
      svgSize: 120,

      // Actions
      setActiveTab: (tab) => set({ activeTab: tab }),

      updateTextSettings: (updates) => set((state) => ({
        textSettings: { ...state.textSettings, ...updates }
      })),

      updateSvgSettings: (updates) => set((state) => ({
        svgSettings: { ...state.svgSettings, ...updates }
      })),

      updateIconSettings: (updates) => set((state) => ({
        iconSettings: { ...state.iconSettings, ...updates }
      })),

      setTextPosition: (position) => set({ textPosition: position }),

      setIconPosition: (position) => set({ iconPosition: position }),

      setSvgPosition: (position) => set({ svgPosition: position }),

      setTextSize: (size) => set({ textSize: size }),

      setIconSize: (size) => set({ iconSize: size }),

      setSvgSize: (size) => set({ svgSize: size }),

      resetStore: () => set({
        activeTab: 'text',
        textSettings: defaultTextSettings,
        svgSettings: defaultSvgSettings,
        iconSettings: defaultIconSettings,
        textPosition: defaultElementPosition,
        iconPosition: defaultElementPosition,
        svgPosition: defaultElementPosition,
        textSize: 120,
        iconSize: 120,
        svgSize: 120
      })
    }),
    {
      name: 'generator-store',
      // Don't persist File objects as they can't be serialized
      partialize: (state) => ({
        activeTab: state.activeTab,
        textSettings: state.textSettings,
        svgSettings: {
          backgroundColor: state.svgSettings.backgroundColor,
          fillColor: state.svgSettings.fillColor,
          strokeColor: state.svgSettings.strokeColor,
          svgContent: state.svgSettings.svgContent,
          fileName: state.svgSettings.fileName,
          fileSize: state.svgSettings.fileSize
        },
        iconSettings: state.iconSettings,
        textPosition: state.textPosition,
        iconPosition: state.iconPosition,
        svgPosition: state.svgPosition,
        textSize: state.textSize,
        iconSize: state.iconSize,
        svgSize: state.svgSize
      })
    }
  )
);
