'use client';

import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Rnd } from 'react-rnd';
import { ICONS } from '@/config/icons';
import { useGeneratorStore } from '@/store/generatorStore';

interface PreviewDefaultProps {
  // Este componente ahora usa el store directamente
  [key: string]: unknown;
}

export interface PreviewDefaultRef {
  downloadImage: () => void;
  generateImageBlob: () => Promise<Blob>;
}

const PreviewDefault = forwardRef<PreviewDefaultRef, PreviewDefaultProps>((props, ref) => {
  const {
    activeTab,
    textSettings,
    svgSettings,
    iconSettings,
    elementPosition,
    textSize,
    setElementPosition,
    setTextSize,
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

    // Si es contenido SVG completo, mantener el color original #333333
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
      };
      reader.readAsText(svgFile);
    }
  }, [svgFile, updateSvgSettings]);

  // Inicializar tamaño del texto solo si no hay un valor guardado
  useEffect(() => {
    if (type === 'text' && text.trim() && textSize === 120) {
      // Solo inicializar si el tamaño actual es el default
      const newSize = Math.min(elementPosition.width, elementPosition.height) * 0.6;
      setTextSize(Math.max(newSize, 12));
    }
  }, [type, text, textSize, elementPosition.width, elementPosition.height, setTextSize]);

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
      const scaledX = elementPosition.x * scale;
      const scaledY = elementPosition.y * scale;
      const scaledWidth = elementPosition.width * scale;
      const scaledHeight = elementPosition.height * scale;

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
      const scaledX = elementPosition.x * scale;
      const scaledY = elementPosition.y * scale;
      const scaledWidth = elementPosition.width * scale;
      const scaledHeight = elementPosition.height * scale;

      // Para iconos, crear SVG temporal
      const iconSvg = getIconSvgComplete(iconName);
      if (iconSvg) {
        const coloredIconSvg = iconSvg
          .replace(/fill="none"/g, `fill="${textColor}"`)
          .replace(/stroke="[^"]*"/g, `stroke="${svgSettings.iconColor || '#333'}"`);

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
      const scaledX = elementPosition.x * scale;
      const scaledY = elementPosition.y * scale;
      const scaledWidth = elementPosition.width * scale;
      const scaledHeight = elementPosition.height * scale;

      // Crear SVG con el color correcto
      const coloredSvg = svgContent
        .replace(/fill="[^"]*"/g, `fill="${textColor}"`)
        .replace(/stroke="[^"]*"/g, `stroke="${svgSettings.iconColor || '#333'}"`);

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
          const scaledX = elementPosition.x * scale;
          const scaledY = elementPosition.y * scale;
          const scaledWidth = elementPosition.width * scale;
          const scaledHeight = elementPosition.height * scale;

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
          const scaledX = elementPosition.x * scale;
          const scaledY = elementPosition.y * scale;
          const scaledWidth = elementPosition.width * scale;
          const scaledHeight = elementPosition.height * scale;

          // Para iconos, crear SVG temporal
          const iconSvg = getIconSvgComplete(iconName);
          if (iconSvg) {
            const coloredIconSvg = iconSvg
              .replace(/fill="none"/g, `fill="${textColor}"`)
              .replace(/stroke="[^"]*"/g, `stroke="${svgSettings.iconColor || '#333'}"`);

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
          const scaledX = elementPosition.x * scale;
          const scaledY = elementPosition.y * scale;
          const scaledWidth = elementPosition.width * scale;
          const scaledHeight = elementPosition.height * scale;

          const coloredSvg = svgContent
            .replace(/fill="[^"]*"/g, `fill="${textColor}"`)
            .replace(/stroke="[^"]*"/g, `stroke="${svgSettings.iconColor || '#333'}"`);
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
            default={{
              x: elementPosition.x,
              y: elementPosition.y,
              width: elementPosition.width,
              height: elementPosition.height,
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
              setElementPosition(newPosition);
              if (type === 'text') {
                const newSize = Math.min(ref.offsetWidth, ref.offsetHeight) * 0.6;
                setTextSize(Math.max(newSize, 12));
              }
            }}
            onDragStop={(e, d) => {
              setElementPosition({
                ...elementPosition,
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
                    .replace(/fill="none"/g, `fill="${textColor}"`)
                    .replace(/stroke="[^"]*"/g, `stroke="${svgSettings.iconColor || '#333'}"`)
                    .replace(/stroke-width="[^"]*"/g, `stroke-width="2"`)
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
                  __html: svgContent
                    .replace(/fill="[^"]*"/g, `fill="${textColor}"`)
                    .replace(/stroke="[^"]*"/g, `stroke="${svgSettings.iconColor || '#333'}"`)
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
