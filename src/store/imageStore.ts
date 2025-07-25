import { create } from 'zustand';

interface ImageStore {
  generatedImage: Blob | null;
  imageData: {
    bg: string;
    color: string;
    type: string;
    text: string;
    font: string;
    icon: string;
  } | null;
  setGeneratedImage: (image: Blob, data: ImageStore['imageData']) => void;
  clearImage: () => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  generatedImage: null,
  imageData: null,
  setGeneratedImage: (image, data) => set({ generatedImage: image, imageData: data }),
  clearImage: () => set({ generatedImage: null, imageData: null }),
}));
