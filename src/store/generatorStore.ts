import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TextSettings {
  text: string;
  font: string;
  size: number;
  backgroundColor: string;
  textColor: string;
  position: ElementPosition;
}

interface SvgSettings {
  file: File | null;
  svgContent: string; // Para persistir el contenido del SVG
  fileName: string; // Para persistir el nombre del archivo
  fileSize: number; // Para persistir el tamaño del archivo
  backgroundColor: string;
  fillColor: string;
  strokeColor: string;
  position: ElementPosition;
  size: number;
}

interface IconSettings {
  selectedIcon: string;
  backgroundColor: string;
  fillColor: string;
  strokeColor: string;
  position: ElementPosition;
  size: number;
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



  // Actions
  setActiveTab: (tab: 'text' | 'svg' | 'icons') => void;
  updateTextSettings: (updates: Partial<TextSettings>) => void;
  updateSvgSettings: (updates: Partial<SvgSettings>) => void;
  updateIconSettings: (updates: Partial<IconSettings>) => void;

  resetStore: () => void;
}

const defaultTextPosition: ElementPosition = {
  x: 55.866851806640625,
  y: 130.20000000000002,
  width: 200,
  height: 200
};

const defaultTextSettings: TextSettings = {
  text: 'FAV',
  font: 'Roboto',
  size: 273,
  backgroundColor: '#F3DFA2',
  textColor: '#333',
  position: defaultTextPosition
};

const defaultElementPosition: ElementPosition = {
  x: 156,
  y: 156,
  width: 200,
  height: 200
};

const defaultSvgSettings: SvgSettings = {
  file: null,
  svgContent: '',
  fileName: '',
  fileSize: 0,
  backgroundColor: '#F3DFA2',
  fillColor: '#F3DFA2',
  strokeColor: '#333',
  position: defaultElementPosition,
  size: 120
};

const defaultIconPosition: ElementPosition = {
  x: 60,
  y: 60,
  width: 500,
  height: 500
};

const defaultIconSettings: IconSettings = {
  selectedIcon: 'star',
  backgroundColor: '#F3DFA2',
  fillColor: '#F3DFA2',
  strokeColor: '#333',
  position: defaultIconPosition,
  size: 120
};



export const useGeneratorStore = create<GeneratorStore>()(
  persist(
    (set, get) => ({
      // Initial state
      activeTab: 'text',
      textSettings: defaultTextSettings,
      svgSettings: defaultSvgSettings,
      iconSettings: defaultIconSettings,
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



      resetStore: () => set({
        activeTab: 'text',
        textSettings: defaultTextSettings,
        svgSettings: defaultSvgSettings,
        iconSettings: defaultIconSettings,

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
          fileSize: state.svgSettings.fileSize,
          position: state.svgSettings.position,
          size: state.svgSettings.size
        },
        iconSettings: state.iconSettings,

      })
    }
  )
);
