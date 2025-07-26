'use client';

import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Rnd } from 'react-rnd';
import { ICONS } from '@/config/icons';
import { useGeneratorStore } from '@/store/generatorStore';

interface ElementPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PreviewDefaultProps {
  // Este componente ahora usa el store directamente
  [key: string]: unknown;
}

export interface PreviewDefaultRef {
  downloadImage: () => void;
  generateImageBlob: () => Promise<Blob>;
  centerVertically: () => void;
  centerHorizontally: () => void;
}

const PreviewDefault = forwardRef<PreviewDefaultRef, PreviewDefaultProps>((props, ref) => {
  const {
    activeTab,
    textSettings,
    svgSettings,
    iconSettings,
    updateSvgSettings,
    updateTextSettings,
    updateIconSettings
  } = useGeneratorStore();

  // Determinar el tipo basado en el tab activo
  const type = activeTab === 'text' ? 'text' : activeTab === 'svg' ? 'svg' : 'icon';
  const backgroundColor = textSettings.backgroundColor;
  const textColor = textSettings.textColor;
  const text = textSettings.text;
  const font = textSettings.font;
  const svgFile = svgSettings.file;
  const svgContent = svgSettings.svgContent;
  const iconName = iconSettings.selectedIcon;

  // Obtener posición y tamaño según el tipo activo
  const getCurrentPosition = () => {
    switch (type) {
      case 'text': return textSettings.position;
      case 'icon': return iconSettings.position;
      case 'svg': return svgSettings.position;
      default: return textSettings.position;
    }
  };

  const getCurrentSize = () => {
    switch (type) {
      case 'text': return textSettings.size;
      case 'icon': return iconSettings.size;
      case 'svg': return svgSettings.size;
      default: return textSettings.size;
    }
  };

  const setCurrentPosition = (position: ElementPosition) => {
    switch (type) {
      case 'text': updateTextSettings({ position }); break;
      case 'icon': updateIconSettings({ position }); break;
      case 'svg': updateSvgSettings({ position }); break;
    }
  };

  const setCurrentSize = (size: number) => {
    switch (type) {
      case 'text': updateTextSettings({ size }); break;
      case 'icon': updateIconSettings({ size }); break;
      case 'svg': updateSvgSettings({ size }); break;
    }
  };

  const currentPosition = getCurrentPosition();
  const currentSize = getCurrentSize();

  // Función para mapear nombres de fuentes a variables CSS
  const getFontFamily = (fontName: string): string => {
    const fontMap: { [key: string]: string } = {
      'Roboto': 'var(--font-roboto)',
      'Open Sans': 'var(--font-open-sans)',
      'Lato': 'var(--font-lato)',
      'Montserrat': 'var(--font-montserrat)',
      'Oswald': 'var(--font-oswald)',
      'Raleway': 'var(--font-raleway)',
      'Poppins': 'var(--font-poppins)',
      'Source Sans Pro': 'var(--font-source-sans-pro)',
      'Merriweather': 'var(--font-merriweather)',
      'Noto Sans': 'var(--font-noto-sans)'
    };
    return fontMap[fontName] || fontName;
  };

  // Calcular el tamaño del contenedor de texto basado en el contenido
  const getTextContainerSize = () => {
    if (type === 'text' && text.trim()) {
      // Crear un canvas temporal para medir el texto
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = `bold ${textSettings.size}px ${getFontFamily(font)}`;
        const textMetrics = ctx.measureText(text.substring(0, 3));
        const textWidth = textMetrics.width;
        const textHeight = textSettings.size * 1.2; // Aproximación de la altura del texto

        // Agregar padding
        const padding = 16;
        return {
          width: textWidth + padding * 2,
          height: textHeight + padding * 2
        };
      }
    }
    return currentPosition ? { width: currentPosition.width, height: currentPosition.height } : { width: 200, height: 200 };
  };

  const textContainerSize = getTextContainerSize() || { width: 200, height: 200 };

  // Función para extraer solo el contenido del path del SVG
  const extractSvgPath = (svgContent: string): string => {
    const match = svgContent.match(/<path[^>]*>/);
    if (match) return match[0];

    const polygonMatch = svgContent.match(/<polygon[^>]*>/);
    if (polygonMatch) return polygonMatch[0];

    const lineMatch = svgContent.match(/<line[^>]*>/);
    if (lineMatch) return lineMatch[0];

    const polylineMatch = svgContent.match(/<polyline[^>]*>/);
    if (polylineMatch) return polylineMatch[0];

    const circleMatch = svgContent.match(/<circle[^>]*>/);
    if (circleMatch) return circleMatch[0];

    const rectMatch = svgContent.match(/<rect[^>]*>/);
    if (rectMatch) return rectMatch[0];

    return '';
  };

  // Función para detectar colores del SVG
  const detectSvgColors = (svgContent: string): { fillColor: string; strokeColor: string } => {
    let detectedFillColor = '#333';
    let detectedStrokeColor = '#333';

    // Verificar si estamos en el navegador
    if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
      // Fallback para SSR: usar regex simple
      const fillMatch = svgContent.match(/fill="([^"]*)"/);
      const strokeMatch = svgContent.match(/stroke="([^"]*)"/);

      if (fillMatch && fillMatch[1] !== 'none') {
        detectedFillColor = fillMatch[1];
      }
      if (strokeMatch) {
        detectedStrokeColor = strokeMatch[1];
      }

      return { fillColor: detectedFillColor, strokeColor: detectedStrokeColor };
    }

    try {
      // Crear un parser temporal para analizar el SVG
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');

      if (!svgElement) return { fillColor: detectedFillColor, strokeColor: detectedStrokeColor };

      // Función recursiva para detectar colores en todos los elementos
      const detectColorsInElement = (element: Element) => {
        // Detectar fill color
        const fill = element.getAttribute('fill');
        if (fill && fill !== 'none' && fill !== 'currentColor') {
          detectedFillColor = fill;
        }

        // Detectar stroke color
        const stroke = element.getAttribute('stroke');
        if (stroke && stroke !== 'none' && stroke !== 'currentColor') {
          detectedStrokeColor = stroke;
        }

        // Recursivamente detectar en elementos hijos
        Array.from(element.children).forEach(detectColorsInElement);
      };

      // Detectar colores en todos los elementos dentro del SVG
      Array.from(svgElement.children).forEach(detectColorsInElement);

      return { fillColor: detectedFillColor, strokeColor: detectedStrokeColor };
    } catch (error) {
      console.warn('Error detecting SVG colors, using fallback method:', error);
      // Fallback en caso de error: usar regex simple
      const fillMatch = svgContent.match(/fill="([^"]*)"/);
      const strokeMatch = svgContent.match(/stroke="([^"]*)"/);

      if (fillMatch && fillMatch[1] !== 'none') {
        detectedFillColor = fillMatch[1];
      }
      if (strokeMatch) {
        detectedStrokeColor = strokeMatch[1];
      }

      return { fillColor: detectedFillColor, strokeColor: detectedStrokeColor };
    }
  };

  // Función para aplicar colores a SVG personalizado
  const applyColorsToSvg = (svgContent: string, fillColor: string, strokeColor: string): string => {
    // Verificar si estamos en el navegador
    if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
      // Fallback para SSR: usar regex simple
      return svgContent
        .replace(/fill="[^"]*"/g, `fill="${fillColor}"`)
        .replace(/stroke="[^"]*"/g, `stroke="${strokeColor}"`)
        .replace(/width="[^"]*"/g, 'width="100%"')
        .replace(/height="[^"]*"/g, 'height="100%"');
    }

    try {
      // Crear un parser temporal para manipular el SVG
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');

      if (!svgElement) return svgContent;

      // Ajustar dimensiones del SVG para que se adapte al contenedor
      svgElement.setAttribute('width', '100%');
      svgElement.setAttribute('height', '100%');
      svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

      // Función recursiva para aplicar colores a todos los elementos
      const applyColorsToElement = (element: Element) => {
        // Aplicar fill color si el elemento no tiene fill="none"
        if (element.getAttribute('fill') !== 'none') {
          element.setAttribute('fill', fillColor);
        }

        // Aplicar stroke color si el elemento tiene stroke
        if (element.hasAttribute('stroke')) {
          element.setAttribute('stroke', strokeColor);
        }

        // Recursivamente aplicar a elementos hijos
        Array.from(element.children).forEach(applyColorsToElement);
      };

      // Aplicar colores a todos los elementos dentro del SVG
      Array.from(svgElement.children).forEach(applyColorsToElement);

      // Convertir de vuelta a string
      return new XMLSerializer().serializeToString(svgElement);
    } catch (error) {
      // Fallback en caso de error: usar regex simple
      console.warn('Error parsing SVG, using fallback method:', error);
      return svgContent
        .replace(/fill="[^"]*"/g, `fill="${fillColor}"`)
        .replace(/stroke="[^"]*"/g, `stroke="${strokeColor}"`)
        .replace(/width="[^"]*"/g, 'width="100%"')
        .replace(/height="[^"]*"/g, 'height="100%"');
    }
  };

  // Función para obtener el SVG del icono
  const getIconSvg = (iconName: string): string => {
    const iconContent = ICONS[iconName];
    if (!iconContent) return ICONS['star'] || '';

    // Si ya es un path SVG, devolverlo directamente
    if (iconContent.startsWith('<path') || iconContent.startsWith('<polygon') ||
      iconContent.startsWith('<line') || iconContent.startsWith('<polyline') ||
      iconContent.startsWith('<circle') || iconContent.startsWith('<rect')) {
      return iconContent;
    }

    // Si es contenido SVG completo, extraer el path
    return extractSvgPath(iconContent);
  };

  const getIconSvgComplete = (iconName: string): string => {
    const iconContent = ICONS[iconName];
    if (!iconContent) return ICONS['star'] || '';

    // Si ya es un path SVG, crear SVG completo
    if (iconContent.startsWith('<path') || iconContent.startsWith('<polygon') ||
      iconContent.startsWith('<line') || iconContent.startsWith('<polyline') ||
      iconContent.startsWith('<circle') || iconContent.startsWith('<rect')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconContent}</svg>`;
    }

    // Si es contenido SVG completo, devolverlo tal como está
    return iconContent;
  };

  // Función para calcular el tamaño de fuente
  const getFontSize = (textLength: number, size: string): number => {
    if (size === 'small') {
      return textLength === 1 ? 200 : 150;
    } else if (size === 'large') {
      return textLength === 1 ? 400 : 300;
    } else {
      // medium
      return textLength === 1 ? 300 : 200;
    }
  };

  // Cargar SVG desde archivo y guardarlo en el store
  useEffect(() => {
    if (svgFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        updateSvgSettings({ svgContent: content });

        // Detectar colores del SVG y actualizar el store
        const { fillColor, strokeColor } = detectSvgColors(content);
        updateSvgSettings({
          fillColor,
          strokeColor
        });
      };
      reader.readAsText(svgFile);
    }
  }, [svgFile, updateSvgSettings]);

  // Inicializar tamaño del texto solo si no hay un valor guardado
  useEffect(() => {
    if (type === 'text' && text.trim() && textSettings.size === 120 && currentPosition) {
      // Solo inicializar si el tamaño actual es el default
      const newSize = Math.min(currentPosition.width, currentPosition.height) * 0.6;
      updateTextSettings({ size: Math.max(newSize, 12) });
    }
  }, [type, text, textSettings.size, currentPosition, updateTextSettings]);

  // Función para descargar imagen usando html2canvas
  const downloadImage = () => {
    if (!currentPosition) return;

    // Crear un contenedor temporal sin controles para la captura
    const tempContainer = document.createElement('div');
    tempContainer.style.width = '620px';
    tempContainer.style.height = '620px';
    tempContainer.style.backgroundColor = backgroundColor;
    tempContainer.style.borderRadius = '8px';
    tempContainer.style.position = 'relative';
    tempContainer.style.overflow = 'hidden';

    // Crear el contenido directamente sin controles
    const contentDiv = document.createElement('div');
    contentDiv.style.position = 'absolute';
    contentDiv.style.left = currentPosition.x + 'px';
    contentDiv.style.top = currentPosition.y + 'px';
    contentDiv.style.width = (type === 'text' ? textContainerSize.width : currentPosition.width) + 'px';
    contentDiv.style.height = (type === 'text' ? textContainerSize.height : currentPosition.height) + 'px';
    contentDiv.style.display = 'flex';
    contentDiv.style.alignItems = 'center';
    contentDiv.style.justifyContent = 'center';

    if (type === 'text' && text.trim()) {
      const textDiv = document.createElement('div');
      textDiv.style.color = textColor;
      textDiv.style.fontFamily = getFontFamily(font);
      textDiv.style.fontSize = textSettings.size + 'px';
      textDiv.style.fontWeight = 'bold';
      textDiv.style.width = 'fit-content';
      textDiv.style.height = 'fit-content';
      textDiv.style.display = 'flex';
      textDiv.style.alignItems = 'center';
      textDiv.style.justifyContent = 'center';
      textDiv.style.userSelect = 'none';
      textDiv.style.padding = '8px';
      textDiv.textContent = text.substring(0, 3);
      contentDiv.appendChild(textDiv);
    } else if (type === 'icon' && iconName) {
      const iconDiv = document.createElement('div');
      iconDiv.style.width = '100%';
      iconDiv.style.height = '100%';
      iconDiv.style.display = 'flex';
      iconDiv.style.alignItems = 'center';
      iconDiv.style.justifyContent = 'center';
      iconDiv.innerHTML = getIconSvgComplete(iconName)
        .replace('width="24" height="24"', 'width="100%" height="100%"')
        .replace(/stroke="[^"]*"/g, `stroke="${iconSettings.strokeColor}"`)
        .replace(/fill="[^"]*"/g, `fill="${iconSettings.fillColor}"`);
      contentDiv.appendChild(iconDiv);
    } else if (type === 'svg' && svgContent) {
      const svgDiv = document.createElement('div');
      svgDiv.style.width = '100%';
      svgDiv.style.height = '100%';
      svgDiv.style.display = 'flex';
      svgDiv.style.alignItems = 'center';
      svgDiv.style.justifyContent = 'center';
      svgDiv.innerHTML = applyColorsToSvg(svgContent, svgSettings.fillColor, svgSettings.strokeColor);
      contentDiv.appendChild(svgDiv);
    }

    tempContainer.appendChild(contentDiv);

    // Agregar temporalmente al DOM
    document.body.appendChild(tempContainer);

    // Usar html2canvas para capturar el contenedor temporal
    import('html2canvas').then(({ default: html2canvas }) => {
      html2canvas(tempContainer, {
        width: 620,
        height: 620,
        scale: 512 / 620, // Escalar a 512x512
        backgroundColor: backgroundColor,
        useCORS: true,
        allowTaint: true
      }).then((canvas) => {
        // Remover el contenedor temporal
        document.body.removeChild(tempContainer);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'favicon-512x512.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      });
    });
  };

  // Exponer método de descarga
  useImperativeHandle(ref, () => ({
    downloadImage,
    generateImageBlob: () => {
      return new Promise<Blob>((resolve) => {
        if (!currentPosition) {
          resolve(new Blob());
          return;
        }

        // Crear un contenedor temporal sin controles para la captura
        const tempContainer = document.createElement('div');
        tempContainer.style.width = '620px';
        tempContainer.style.height = '620px';
        tempContainer.style.backgroundColor = backgroundColor;
        tempContainer.style.borderRadius = '8px';
        tempContainer.style.position = 'relative';
        tempContainer.style.overflow = 'hidden';

        // Crear el contenido directamente sin controles
        const contentDiv = document.createElement('div');
        contentDiv.style.position = 'absolute';
        contentDiv.style.left = currentPosition.x + 'px';
        contentDiv.style.top = currentPosition.y + 'px';
        contentDiv.style.width = (type === 'text' ? textContainerSize.width : currentPosition.width) + 'px';
        contentDiv.style.height = (type === 'text' ? textContainerSize.height : currentPosition.height) + 'px';
        contentDiv.style.display = 'flex';
        contentDiv.style.alignItems = 'center';
        contentDiv.style.justifyContent = 'center';

        if (type === 'text' && text.trim()) {
          const textDiv = document.createElement('div');
          textDiv.style.color = textColor;
          textDiv.style.fontFamily = getFontFamily(font);
          textDiv.style.fontSize = textSettings.size + 'px';
          textDiv.style.fontWeight = 'bold';
          textDiv.style.width = 'fit-content';
          textDiv.style.height = 'fit-content';
          textDiv.style.display = 'flex';
          textDiv.style.alignItems = 'center';
          textDiv.style.justifyContent = 'center';
          textDiv.style.userSelect = 'none';
          textDiv.style.padding = '8px';
          textDiv.textContent = text.substring(0, 3);
          contentDiv.appendChild(textDiv);
        } else if (type === 'icon' && iconName) {
          const iconDiv = document.createElement('div');
          iconDiv.style.width = '100%';
          iconDiv.style.height = '100%';
          iconDiv.style.display = 'flex';
          iconDiv.style.alignItems = 'center';
          iconDiv.style.justifyContent = 'center';
          iconDiv.innerHTML = getIconSvgComplete(iconName)
            .replace('width="24" height="24"', 'width="100%" height="100%"')
            .replace(/stroke="[^"]*"/g, `stroke="${iconSettings.strokeColor}"`)
            .replace(/fill="[^"]*"/g, `fill="${iconSettings.fillColor}"`);
          contentDiv.appendChild(iconDiv);
        } else if (type === 'svg' && svgContent) {
          const svgDiv = document.createElement('div');
          svgDiv.style.width = '100%';
          svgDiv.style.height = '100%';
          svgDiv.style.display = 'flex';
          svgDiv.style.alignItems = 'center';
          svgDiv.style.justifyContent = 'center';
          svgDiv.innerHTML = applyColorsToSvg(svgContent, svgSettings.fillColor, svgSettings.strokeColor);
          contentDiv.appendChild(svgDiv);
        }

        tempContainer.appendChild(contentDiv);

        // Agregar temporalmente al DOM
        document.body.appendChild(tempContainer);

        // Usar html2canvas para capturar el contenedor temporal
        import('html2canvas').then(({ default: html2canvas }) => {
          html2canvas(tempContainer, {
            width: 620,
            height: 620,
            scale: 512 / 620, // Escalar a 512x512
            backgroundColor: backgroundColor,
            useCORS: true,
            allowTaint: true
          }).then((canvas) => {
            // Remover el contenedor temporal
            document.body.removeChild(tempContainer);

            canvas.toBlob((blob) => {
              if (blob) resolve(blob);
            }, 'image/png');
          });
        });
      });
    },
    centerVertically: () => {
      // Solo alinear si hay un elemento activo según el tipo
      if (currentPosition && ((type === 'text' && text.trim()) || (type === 'icon' && iconName) || (type === 'svg' && svgContent))) {
        const elementHeight = type === 'text' ? textContainerSize.height : currentPosition.height;
        const newPosition = {
          ...currentPosition,
          y: (620 - elementHeight) / 2
        };
        setCurrentPosition(newPosition);
      }
    },
    centerHorizontally: () => {
      // Solo alinear si hay un elemento activo según el tipo
      if (currentPosition && ((type === 'text' && text.trim()) || (type === 'icon' && iconName) || (type === 'svg' && svgContent))) {
        const elementWidth = type === 'text' ? textContainerSize.width : currentPosition.width;
        const newPosition = {
          ...currentPosition,
          x: (620 - elementWidth) / 2
        };
        setCurrentPosition(newPosition);
      }
    }
  }));

  // Verificar que currentPosition existe antes de renderizar
  if (!currentPosition) {
    return (
      <div className="preview-default">
        <div
          className="preview-default__canvas"
          style={{
            width: '620px',
            height: '620px',
            backgroundColor,
            borderRadius: '8px',
            border: '1px solid rgba(126, 189, 194, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Loading state */}
        </div>
      </div>
    );
  }

  return (
    <div className="preview-default">
      <div
        className="preview-default__canvas"
        style={{
          width: '620px',
          height: '620px',
          backgroundColor,
          borderRadius: '8px',
          border: '1px solid rgba(126, 189, 194, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Elemento editable con react-rnd */}
        {currentPosition && ((type === 'text' && text.trim()) || (type === 'icon' && iconName) || (type === 'svg' && svgContent)) ? (
          <Rnd
            data-testid="rnd"
            position={{
              x: currentPosition.x,
              y: currentPosition.y,
            }}
            size={{
              width: type === 'text' ? textContainerSize.width : currentPosition.width,
              height: type === 'text' ? textContainerSize.height : currentPosition.height,
            }}
            minWidth={50}
            minHeight={50}
            maxWidth={500}
            maxHeight={500}
            bounds="parent"
            lockAspectRatio={type !== 'text'}
            onResize={(e, direction, ref, delta, position) => {
              const newPosition = {
                x: position.x,
                y: position.y,
                width: ref.offsetWidth,
                height: ref.offsetHeight
              };
              setCurrentPosition(newPosition);
              if (type === 'text') {
                const newSize = Math.min(ref.offsetWidth, ref.offsetHeight) * 0.6;
                updateTextSettings({ size: Math.max(newSize, 12) });
              }
            }}
            onDragStop={(e, d) => {
              setCurrentPosition({
                ...currentPosition,
                x: d.x,
                y: d.y
              });
            }}
            resizeHandleStyles={{
              topLeft: { background: '#FFFFFF', border: '1px solid #000000', width: '8px', height: '8px' },
              topRight: { background: '#FFFFFF', border: '1px solid #000000', width: '8px', height: '8px' },
              bottomLeft: { background: '#FFFFFF', border: '1px solid #000000', width: '8px', height: '8px' },
              bottomRight: { background: '#FFFFFF', border: '1px solid #000000', width: '8px', height: '8px' }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: '1px solid #000000'
            }}
          >
            {type === 'text' && text.trim() && (
              <div
                style={{
                  color: textColor,
                  fontFamily: getFontFamily(font),
                  fontSize: `${textSettings.size}px`,
                  fontWeight: 'bold',
                  width: 'fit-content',
                  height: 'fit-content',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  userSelect: 'none',
                  padding: '8px'
                }}
              >
                {text.substring(0, 3)}
              </div>
            )}
            {type === 'icon' && iconName && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                dangerouslySetInnerHTML={{
                  __html: getIconSvgComplete(iconName)
                    .replace('width="24" height="24"', 'width="100%" height="100%"')
                    .replace(/stroke="[^"]*"/g, `stroke="${iconSettings.strokeColor}"`)
                    .replace(/fill="[^"]*"/g, `fill="${iconSettings.fillColor}"`)
                }}
              />
            )}
            {type === 'svg' && svgContent && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                dangerouslySetInnerHTML={{
                  __html: applyColorsToSvg(svgContent, svgSettings.fillColor, svgSettings.strokeColor)
                }}
              />
            )}
          </Rnd>
        ) : null}
      </div>
    </div>
  );
});

PreviewDefault.displayName = 'PreviewDefault';

export default PreviewDefault;
