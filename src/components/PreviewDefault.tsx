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
    textPosition,
    iconPosition,
    svgPosition,
    textSize,
    iconSize,
    svgSize,
    setTextPosition,
    setIconPosition,
    setSvgPosition,
    setTextSize,
    setIconSize,
    setSvgSize,
    updateSvgSettings
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
      case 'text': return textPosition;
      case 'icon': return iconPosition;
      case 'svg': return svgPosition;
      default: return textPosition;
    }
  };

  const getCurrentSize = () => {
    switch (type) {
      case 'text': return textSize;
      case 'icon': return iconSize;
      case 'svg': return svgSize;
      default: return textSize;
    }
  };

  const setCurrentPosition = (position: ElementPosition) => {
    switch (type) {
      case 'text': setTextPosition(position); break;
      case 'icon': setIconPosition(position); break;
      case 'svg': setSvgPosition(position); break;
    }
  };

  const setCurrentSize = (size: number) => {
    switch (type) {
      case 'text': setTextSize(size); break;
      case 'icon': setIconSize(size); break;
      case 'svg': setSvgSize(size); break;
    }
  };

  const currentPosition = getCurrentPosition();
  const currentSize = getCurrentSize();

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
        .replace(/stroke="[^"]*"/g, `stroke="${strokeColor}"`);
    }

    try {
      // Crear un parser temporal para manipular el SVG
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');

      if (!svgElement) return svgContent;

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
        .replace(/stroke="[^"]*"/g, `stroke="${strokeColor}"`);
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
    if (type === 'text' && text.trim() && textSize === 120) {
      // Solo inicializar si el tamaño actual es el default
      const newSize = Math.min(currentPosition.width, currentPosition.height) * 0.6;
      setTextSize(Math.max(newSize, 12));
    }
  }, [type, text, textSize, currentPosition.width, currentPosition.height, setTextSize]);

  // Función para descargar imagen (crear canvas temporalmente solo para descarga)
  const downloadImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 512;
    canvas.height = 512;

    // Rellenar fondo
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, 512, 512);

    // Renderizar contenido según el tipo
    if (type === 'text' && text.trim()) {
      // Calcular escala del preview (620px) al canvas (512px)
      const scale = 512 / 620;

      // Calcular posición y tamaño escalados
      const scaledX = currentPosition.x * scale;
      const scaledY = currentPosition.y * scale;
      const scaledWidth = currentPosition.width * scale;
      const scaledHeight = currentPosition.height * scale;

      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const scaledFontSize = textSize * scale;
      // Aplicar el peso de fuente correcto (bold)
      ctx.font = `bold ${scaledFontSize}px "${font}"`;
      ctx.fillText(text.substring(0, 3).toUpperCase(), scaledX + scaledWidth / 2, scaledY + scaledHeight / 2);
    } else if (type === 'icon' && iconName) {
      // Calcular escala del preview (620px) al canvas (512px)
      const scale = 512 / 620;

      // Calcular posición y tamaño escalados
      const scaledX = currentPosition.x * scale;
      const scaledY = currentPosition.y * scale;
      const scaledWidth = currentPosition.width * scale;
      const scaledHeight = currentPosition.height * scale;

      // Para iconos, crear SVG temporal
      const iconSvg = getIconSvgComplete(iconName);
      if (iconSvg) {
        const coloredIconSvg = iconSvg
          .replace(/stroke="[^"]*"/g, `stroke="${iconSettings.iconColor}"`)
          .replace(/fill="[^"]*"/g, `fill="${iconSettings.iconColor}"`);

        const svgContent = `
          <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" fill="${backgroundColor}"/>
            <g transform="translate(${scaledX}, ${scaledY}) scale(${scaledWidth / 24})">
              ${coloredIconSvg}
            </g>
          </svg>
        `;
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          // Descargar
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
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgContent);
        return;
      }
    } else if (type === 'svg' && svgContent) {
      // Calcular escala del preview (620px) al canvas (512px)
      const scale = 512 / 620;

      // Calcular posición y tamaño escalados
      const scaledX = currentPosition.x * scale;
      const scaledY = currentPosition.y * scale;
      const scaledWidth = currentPosition.width * scale;
      const scaledHeight = currentPosition.height * scale;

      // Crear SVG con el color correcto
      const coloredSvg = applyColorsToSvg(svgContent, svgSettings.fillColor, svgSettings.strokeColor);

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, scaledX, scaledY, scaledWidth, scaledHeight);
        // Descargar
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
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(coloredSvg);
      return;
    }

    // Descargar para texto
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
  };

  // Exponer método de descarga
  useImperativeHandle(ref, () => ({
    downloadImage,
    generateImageBlob: () => {
      return new Promise<Blob>((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 512;
        canvas.height = 512;

        // Rellenar fondo
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, 512, 512);

        // Renderizar contenido según el tipo
        if (type === 'text' && text.trim()) {
          // Calcular escala del preview (620px) al canvas (512px)
          const scale = 512 / 620;

          // Calcular posición y tamaño escalados
          const scaledX = currentPosition.x * scale;
          const scaledY = currentPosition.y * scale;
          const scaledWidth = currentPosition.width * scale;
          const scaledHeight = currentPosition.height * scale;

          ctx.fillStyle = textColor;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const scaledFontSize = textSize * scale;
          // Aplicar el peso de fuente correcto (bold)
          ctx.font = `bold ${scaledFontSize}px "${font}"`;
          ctx.fillText(text.substring(0, 3).toUpperCase(), scaledX + scaledWidth / 2, scaledY + scaledHeight / 2);

          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
          }, 'image/png');
        } else if (type === 'icon' && iconName) {
          // Calcular escala del preview (620px) al canvas (512px)
          const scale = 512 / 620;

          // Calcular posición y tamaño escalados
          const scaledX = currentPosition.x * scale;
          const scaledY = currentPosition.y * scale;
          const scaledWidth = currentPosition.width * scale;
          const scaledHeight = currentPosition.height * scale;

          // Para iconos, crear SVG temporal
          const iconSvg = getIconSvgComplete(iconName);
          if (iconSvg) {
            const coloredIconSvg = iconSvg
              .replace(/stroke="[^"]*"/g, `stroke="${iconSettings.iconColor}"`)
              .replace(/fill="[^"]*"/g, `fill="${iconSettings.iconColor}"`);

            const svgContent = `
              <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <rect width="512" height="512" fill="${backgroundColor}"/>
                <g transform="translate(${scaledX}, ${scaledY}) scale(${scaledWidth / 24})">
                  ${coloredIconSvg.replace(/<svg[^>]*>|<\/svg>/g, '')}
                </g>
              </svg>
            `;
            const img = new Image();
            img.onload = () => {
              ctx.drawImage(img, 0, 0);
              canvas.toBlob((blob) => {
                if (blob) resolve(blob);
              }, 'image/png');
            };
            img.src = 'data:image/svg+xml;base64,' + btoa(svgContent);
          }
        } else if (type === 'svg' && svgContent) {
          // Calcular escala del preview (620px) al canvas (512px)
          const scale = 512 / 620;

          // Calcular posición y tamaño escalados
          const scaledX = currentPosition.x * scale;
          const scaledY = currentPosition.y * scale;
          const scaledWidth = currentPosition.width * scale;
          const scaledHeight = currentPosition.height * scale;

          const coloredSvg = applyColorsToSvg(svgContent, svgSettings.fillColor, svgSettings.strokeColor);
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, scaledX, scaledY, scaledWidth, scaledHeight);
            canvas.toBlob((blob) => {
              if (blob) resolve(blob);
            }, 'image/png');
          };
          img.src = 'data:image/svg+xml;base64,' + btoa(coloredSvg);
        }
      });
    },
    centerVertically: () => {
      // Solo alinear si hay un elemento activo según el tipo
      if ((type === 'text' && text.trim()) || (type === 'icon' && iconName) || (type === 'svg' && svgContent)) {
        const newPosition = {
          ...currentPosition,
          y: (620 - currentPosition.height) / 2
        };
        setCurrentPosition(newPosition);
      }
    },
    centerHorizontally: () => {
      // Solo alinear si hay un elemento activo según el tipo
      if ((type === 'text' && text.trim()) || (type === 'icon' && iconName) || (type === 'svg' && svgContent)) {
        const newPosition = {
          ...currentPosition,
          x: (620 - currentPosition.width) / 2
        };
        setCurrentPosition(newPosition);
      }
    }
  }));

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
        {(type === 'text' && text.trim()) || (type === 'icon' && iconName) || (type === 'svg' && svgContent) ? (
          <Rnd
            position={{
              x: currentPosition.x,
              y: currentPosition.y,
            }}
            size={{
              width: currentPosition.width,
              height: currentPosition.height,
            }}
            minWidth={50}
            minHeight={50}
            maxWidth={500}
            maxHeight={500}
            bounds="parent"
            lockAspectRatio={true}
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
                setTextSize(Math.max(newSize, 12));
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
                  fontFamily: font,
                  fontSize: `${textSize}px`,
                  fontWeight: 'bold',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  userSelect: 'none'
                }}
              >
                {text.substring(0, 3).toUpperCase()}
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
                    .replace(/stroke="[^"]*"/g, `stroke="${iconSettings.iconColor}"`)
                    .replace(/fill="[^"]*"/g, `fill="${iconSettings.iconColor}"`)
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
