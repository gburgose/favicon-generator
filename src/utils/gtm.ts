export const gtmEvent = (eventName: string, data: Record<string, unknown> = {}) => {
  if (typeof window !== 'undefined' && (window as { dataLayer?: unknown[] }).dataLayer) {
    (window as { dataLayer: unknown[] }).dataLayer.push({
      event: eventName,
      ...data
    });
  }
};

// Eventos específicos para el favicon tools
export const gtmEvents = {
  // 1. Imagen subida desde dropzone
  converterImageUploaded: (fileName: string, fileSize: number, fileType: string) => {
    gtmEvent('converter_image_uploaded', {
      file_name: fileName,
      file_size_mb: (fileSize / 1024 / 1024).toFixed(2),
      file_type: fileType
    });
  },

  // 2. Imagen llegada desde generator
  converterImageFromGenerator: () => {
    gtmEvent('converter_image_from_generator');
  },

  // 3. Configuración de la app
  converterAppConfigured: (appName: string, themeColor: string, hasDescription: boolean) => {
    gtmEvent('converter_app_configured', {
      app_name: appName,
      theme_color: themeColor,
      has_description: hasDescription
    });
  },

  // 4. Warning de imagen pequeña
  converterSmallImageWarning: (imageWidth: number, imageHeight: number) => {
    gtmEvent('converter_small_image_warning', {
      image_width: imageWidth,
      image_height: imageHeight,
      recommended_size: '512x512'
    });
  },

  // 5. Generación de favicons
  converterGeneration: () => {
    gtmEvent('converter_generation');
  },

  // 6. Error en la generación
  converterGenerationError: (error: string) => {
    gtmEvent('converter_generation_error', {
      error_type: error,
      success: false
    });
  },

  // 7. Descarga de favicons
  converterDownload: () => {
    gtmEvent('converter_download');
  },

  // 8. Copia de meta tags
  converterMetaTagsCopied: () => {
    gtmEvent('converter_meta_tags_copied');
  },

  // 9. Copia de manifest
  converterManifestCopied: () => {
    gtmEvent('converter_manifest_copied');
  },

  // 10. Limpieza total
  converterAllCleared: () => {
    gtmEvent('converter_all_cleared');
  }
}; 
