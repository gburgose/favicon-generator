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
  },

  // Generator Events

  // 1. Cambio de tab en generator
  generatorTabChanged: (tabName: string) => {
    gtmEvent('generator_tab_changed', {
      tab_name: tabName
    });
  },

  // 2. Cambio de texto en generator
  generatorTextChanged: (text: string) => {
    gtmEvent('generator_text_changed', {
      text_length: text.length,
      text_content: text
    });
  },

  // 3. Cambio de fuente en generator
  generatorFontChanged: (fontName: string) => {
    gtmEvent('generator_font_changed', {
      font_name: fontName
    });
  },

  // 4. Selección de icono en generator
  generatorIconSelected: (iconName: string) => {
    gtmEvent('generator_icon_selected', {
      icon_name: iconName
    });
  },

  // 5. Subida de SVG en generator
  generatorSvgUploaded: (fileName: string, fileSize: number) => {
    gtmEvent('generator_svg_uploaded', {
      file_name: fileName,
      file_size_mb: (fileSize / 1024 / 1024).toFixed(2)
    });
  },

  // 6. Cambio de color de fondo en generator
  generatorBackgroundColorChanged: (color: string) => {
    gtmEvent('generator_background_color_changed', {
      color: color
    });
  },

  // 7. Cambio de color de texto en generator
  generatorTextColorChanged: (color: string) => {
    gtmEvent('generator_text_color_changed', {
      color: color
    });
  },

  // 8. Cambio de fill color en generator
  generatorFillColorChanged: (color: string) => {
    gtmEvent('generator_fill_color_changed', {
      color: color
    });
  },

  // 9. Cambio de stroke color en generator
  generatorStrokeColorChanged: (color: string) => {
    gtmEvent('generator_stroke_color_changed', {
      color: color
    });
  },

  // 10. Alineación vertical en generator
  generatorAlignVertical: () => {
    gtmEvent('generator_align_vertical');
  },

  // 11. Alineación horizontal en generator
  generatorAlignHorizontal: () => {
    gtmEvent('generator_align_horizontal');
  },

  // 12. Descarga de favicon desde generator
  generatorDownload: () => {
    gtmEvent('generator_download');
  },

  // 13. Envío al converter desde generator
  generatorSendToConverter: () => {
    gtmEvent('generator_send_to_converter');
  },

  // Validator Events

  // 1. Validación de favicons iniciada
  validatorValidationStarted: (url: string) => {
    gtmEvent('validator_validation_started', {
      url: url
    });
  },

  // 2. Validación de favicons completada exitosamente
  validatorValidationCompleted: (url: string, foundFavicons: number, totalFavicons: number, coveragePercentage: number) => {
    gtmEvent('validator_validation_completed', {
      url: url,
      found_favicons: foundFavicons,
      total_favicons: totalFavicons,
      coverage_percentage: coveragePercentage
    });
  },

  // 3. Error en validación de favicons
  validatorValidationError: (url: string, error: string) => {
    gtmEvent('validator_validation_error', {
      url: url,
      error_type: error
    });
  },

  // 4. Limpieza de resultados de validación
  validatorResultsCleared: () => {
    gtmEvent('validator_results_cleared');
  }
}; 
