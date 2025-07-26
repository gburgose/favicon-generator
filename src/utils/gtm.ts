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
  // Usuario sube una imagen
  imageUploaded: (fileName: string, fileSize: number, fileType: string) => {
    gtmEvent('favicon_image_uploaded', {
      file_name: fileName,
      file_size_mb: (fileSize / 1024 / 1024).toFixed(2),
      file_type: fileType
    });
  },

  // Usuario configura la app
  appConfigured: (appName: string, themeColor: string, hasDescription: boolean) => {
    gtmEvent('favicon_app_configured', {
      app_name: appName,
      theme_color: themeColor,
      has_description: hasDescription
    });
  },

  // Error en la generación
  generationError: (error: string) => {
    gtmEvent('favicon_generation_error', {
      error_type: error,
      success: false
    });
  },

  // Usuario copia meta tags
  metaTagsCopied: () => {
    gtmEvent('favicon_meta_tags_copied');
  },

  // Usuario copia manifest
  manifestCopied: () => {
    gtmEvent('favicon_manifest_copied');
  },

  // Usuario limpia todo
  allCleared: () => {
    gtmEvent('favicon_all_cleared');
  },

  // Warning de imagen pequeña
  smallImageWarning: (imageWidth: number, imageHeight: number) => {
    gtmEvent('favicon_small_image_warning', {
      image_width: imageWidth,
      image_height: imageHeight,
      recommended_size: '512x512'
    });
  },

  // Converter: Imagen cargada desde dropzone
  converterImageUploaded: (fileName: string, fileSize: number, fileType: string) => {
    gtmEvent('converter_image_uploaded', {
      file_name: fileName,
      file_size_mb: (fileSize / 1024 / 1024).toFixed(2),
      file_type: fileType
    });
  },

  // Converter: Imagen cargada desde generator
  converterImageFromGenerator: () => {
    gtmEvent('converter_image_from_generator');
  },

  // Converter: Generación de favicons
  converterGeneration: () => {
    gtmEvent('converter_generation');
  },

  // Converter: Descarga de favicons
  converterDownload: () => {
    gtmEvent('converter_download');
  }
}; 
