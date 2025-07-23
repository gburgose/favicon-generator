import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CachedHTML {
  html: string;
  timestamp: number;
}

interface ValidatorState {
  lastUrl: string;
  setLastUrl: (url: string) => void;
  clearLastUrl: () => void;
  htmlCache: Record<string, CachedHTML>;
  setCachedHTML: (url: string, html: string) => void;
  getCachedHTML: (url: string) => string | null;
  clearCache: () => void;
}

export const useValidatorStore = create<ValidatorState>()(
  persist(
    (set, get) => ({
      lastUrl: '',
      setLastUrl: (url: string) => set({ lastUrl: url }),
      clearLastUrl: () => set({ lastUrl: '' }),
      htmlCache: {},
      setCachedHTML: (url: string, html: string) => {
        const state = get();
        set({
          htmlCache: {
            ...state.htmlCache,
            [url]: {
              html,
              timestamp: Date.now()
            }
          }
        });
      },
      getCachedHTML: (url: string) => {
        const state = get();
        const cached = state.htmlCache[url];
        if (!cached) return null;

        // Verificar si han pasado 2 minutos (120,000 ms)
        const now = Date.now();
        const twoMinutes = 2 * 60 * 1000;

        if (now - cached.timestamp > twoMinutes) {
          // Cache expirado, eliminarlo
          const newCache = { ...state.htmlCache };
          delete newCache[url];
          set({ htmlCache: newCache });
          return null;
        }

        return cached.html;
      },
      clearCache: () => set({ htmlCache: {} }),
    }),
    {
      name: 'validator-store',
    }
  )
); 
