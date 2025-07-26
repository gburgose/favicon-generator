import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FAVICON_SIZES } from '@/config/favicons';

interface AppSettings {
  name: string;
  description: string;
  themeColor: string;
}

interface ConverterState {
  // File state
  selectedFile: File | null;
  previewUrl: string;
  fileDataUrl: string; // Para persistir la imagen como data URL

  // Generated favicons
  generatedFavicons: { [key: string]: string };

  // Loading states
  isGenerating: boolean;
  isDownloading: boolean;

  // App settings
  appSettings: AppSettings;
  tempAppSettings: AppSettings;

  // Favicon selection
  selectedFaviconSizes: string[];

  // UI state
  imageWarning: string;
  showFavicons: boolean;
  showMetaTags: boolean;
  showManifest: boolean;

  // Actions
  setSelectedFile: (file: File | null) => void;
  setPreviewUrl: (url: string) => void;
  setFileDataUrl: (dataUrl: string) => void;
  setGeneratedFavicons: (favicons: { [key: string]: string }) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setIsDownloading: (isDownloading: boolean) => void;
  setAppSettings: (settings: AppSettings) => void;
  setTempAppSettings: (settings: AppSettings) => void;
  updateTempAppSettings: (updates: Partial<AppSettings>) => void;
  setSelectedFaviconSizes: (sizes: string[]) => void;
  toggleFaviconSize: (name: string) => void;
  setImageWarning: (warning: string) => void;
  setShowFavicons: (show: boolean) => void;
  setShowMetaTags: (show: boolean) => void;
  setShowManifest: (show: boolean) => void;
  clearAll: () => void;
}

const DEFAULT_APP_SETTINGS: AppSettings = {
  name: 'My App',
  description: 'Demo description',
  themeColor: '#ffffff'
};

const RECOMMENDED_FAVICON_SIZES = FAVICON_SIZES
  .filter(size => size.recommended)
  .map(size => size.name);

export const useConverterStore = create<ConverterState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedFile: null,
      previewUrl: '',
      fileDataUrl: '',
      generatedFavicons: {},
      isGenerating: false,
      isDownloading: false,
      appSettings: DEFAULT_APP_SETTINGS,
      tempAppSettings: DEFAULT_APP_SETTINGS,
      selectedFaviconSizes: RECOMMENDED_FAVICON_SIZES, // Default recommended sizes
      imageWarning: '',
      showFavicons: false,
      showMetaTags: false,
      showManifest: false,

      // Actions
      setSelectedFile: (file) => set({ selectedFile: file }),
      setPreviewUrl: (url) => set({ previewUrl: url }),
      setFileDataUrl: (dataUrl) => set({ fileDataUrl: dataUrl }),
      setGeneratedFavicons: (favicons) => set({ generatedFavicons: favicons }),
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      setIsDownloading: (isDownloading) => set({ isDownloading }),
      setAppSettings: (settings) => set({ appSettings: settings }),
      setTempAppSettings: (settings) => set({ tempAppSettings: settings }),
      updateTempAppSettings: (updates) => set((state) => ({
        tempAppSettings: { ...state.tempAppSettings, ...updates }
      })),
      setSelectedFaviconSizes: (sizes) => set({ selectedFaviconSizes: sizes }),
      toggleFaviconSize: (name) => set((state) => {
        const newSizes = state.selectedFaviconSizes.includes(name)
          ? state.selectedFaviconSizes.filter(size => size !== name)
          : [...state.selectedFaviconSizes, name];

        // Clear generated favicons when selection changes
        return {
          selectedFaviconSizes: newSizes,
          generatedFavicons: {}
        };
      }),
      setImageWarning: (warning) => set({ imageWarning: warning }),
      setShowFavicons: (show) => set({ showFavicons: show }),
      setShowMetaTags: (show) => set({ showMetaTags: show }),
      setShowManifest: (show) => set({ showManifest: show }),
      clearAll: () => set({
        selectedFile: null,
        previewUrl: '',
        fileDataUrl: '',
        generatedFavicons: {},
        imageWarning: '',
        tempAppSettings: DEFAULT_APP_SETTINGS,
        showFavicons: false,
        showMetaTags: false,
        showManifest: false
      })
    }),
    {
      name: 'converter-storage',
      partialize: (state) => ({
        fileDataUrl: state.fileDataUrl,
        previewUrl: state.previewUrl,
        appSettings: state.appSettings,
        tempAppSettings: state.tempAppSettings,
        selectedFaviconSizes: state.selectedFaviconSizes,
        imageWarning: state.imageWarning,
        showFavicons: state.showFavicons,
        showMetaTags: state.showMetaTags,
        showManifest: state.showManifest
      })
    }
  )
); 
