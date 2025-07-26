import { useState } from 'react';
import { FAVICON_SIZES } from '@/config/favicons';
import { useValidatorStore } from '@/stores/validatorStore';
import { gtmEvents } from '@/utils/gtm';

interface FaviconFound {
  url: string;
  sizes?: string;
  type?: string;
  rel?: string;
  width?: number;
  height?: number;
  isGeneric?: boolean;
}

interface FaviconValidation {
  size: number;
  name: string;
  fileName: string;
  purpose: string;
  format: 'png' | 'ico';
  recommended: boolean;
  found: boolean;
  foundUrl?: string;
  foundSizes?: string;
  isGeneric?: boolean;
}

interface ValidationResult {
  url: string;
  totalFavicons: number;
  foundFavicons: number;
  validations: FaviconValidation[];
  loading: boolean;
  error?: string;
  genericFavicons?: FaviconFound[];
}

export const useFaviconValidator = () => {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { getCachedHTML, setCachedHTML } = useValidatorStore();

  const extractFaviconSizes = (sizes: string): number[] => {
    if (!sizes) return [];

    // Parse sizes like "16x16", "32x32", "any", etc.
    const sizeMatches = sizes.match(/(\d+)x(\d+)/g);
    if (!sizeMatches) return [];

    return sizeMatches.map(size => {
      const [width] = size.split('x').map(Number);
      return width;
    });
  };

  const sizesMatch = (faviconSizes: string, targetSize: number): boolean => {
    if (!faviconSizes) return false;

    // Extraer todos los tamaños del string
    const sizes = extractFaviconSizes(faviconSizes);

    // Verificar si el tamaño objetivo está en la lista
    return sizes.includes(targetSize);
  };

  const normalizeUrl = (url: string, baseUrl: string): string => {
    try {
      // Si la URL comienza con //, agregar https:
      if (url.startsWith('//')) {
        url = 'https:' + url;
      }
      return new URL(url, baseUrl).href;
    } catch {
      return url;
    }
  };

  const findFaviconsInHTML = async (url: string): Promise<FaviconFound[]> => {
    try {
      // Verificar si tenemos el HTML en caché
      let html = getCachedHTML(url) || '';

      if (!html) {

        // Usar un proxy público para evitar CORS
        try {
          const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
          const response = await fetch(proxyUrl);

          if (response.ok) {
            const data = await response.json();
            html = data.contents;

            // Guardar en caché
            setCachedHTML(url, html);
          } else {
            throw new Error(`Proxy HTTP ${response.status}`);
          }
        } catch (error) {
          console.log('Proxy failed, trying direct fetch:', error);

          // Fallback: intentar fetch directo
          try {
            const response = await fetch(url, {
              method: 'GET',
              mode: 'cors'
            });

            if (response.ok) {
              html = await response.text();
              console.log('Successfully fetched HTML with direct fetch');

              // Guardar en caché
              setCachedHTML(url, html);
            } else {
              throw new Error(`HTTP ${response.status}`);
            }
          } catch (directError) {
            console.log('Direct fetch also failed:', directError);
            return [];
          }
        }
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const favicons: FaviconFound[] = [];

      // Función 1: Buscar ICO genéricos (más flexible)
      const icoLinks = doc.querySelectorAll('link[href*=".ico"], link[rel="icon"], link[rel="shortcut icon"]');
      icoLinks.forEach(link => {
        const href = link.getAttribute('href');
        const rel = link.getAttribute('rel');
        const type = link.getAttribute('type');

        if (href) {
          const absoluteUrl = normalizeUrl(href, url);
          favicons.push({
            url: absoluteUrl,
            type: type || 'image/x-icon',
            rel: rel || 'icon',
            isGeneric: true
          });
        }
      });

      // Función 2: Buscar por sizes (PNG, Apple Touch, Android, etc.)
      const sizeLinks = doc.querySelectorAll('link[sizes]');
      sizeLinks.forEach(link => {
        const href = link.getAttribute('href');
        const sizes = link.getAttribute('sizes');
        const type = link.getAttribute('type');
        const rel = link.getAttribute('rel');

        if (href && sizes) {
          const absoluteUrl = normalizeUrl(href, url);
          favicons.push({
            url: absoluteUrl,
            sizes: sizes,
            type: type || undefined,
            rel: rel || undefined
          });
        }
      });

      // Función 3: Buscar Apple Touch Icons sin sizes
      const appleTouchLinks = doc.querySelectorAll('link[rel="apple-touch-icon"]');
      appleTouchLinks.forEach(link => {
        const href = link.getAttribute('href');
        const sizes = link.getAttribute('sizes');
        const type = link.getAttribute('type');

        if (href) {
          const absoluteUrl = normalizeUrl(href, url);
          favicons.push({
            url: absoluteUrl,
            sizes: sizes || '180x180', // Tamaño por defecto
            type: type || 'image/png',
            rel: 'apple-touch-icon'
          });
        }
      });

      // Función 4: Buscar Windows Tiles (meta tags)
      const windowsMeta = doc.querySelector('meta[name="msapplication-TileImage"]');
      if (windowsMeta) {
        const content = windowsMeta.getAttribute('content');
        if (content) {
          const absoluteUrl = normalizeUrl(content, url);
          favicons.push({
            url: absoluteUrl,
            type: 'image/png',
            rel: 'msapplication-TileImage'
          });
        }
      }

      // Función 5: Buscar Android Chrome Icons
      const androidLinks = doc.querySelectorAll('link[rel="android-chrome"]');
      androidLinks.forEach(link => {
        const href = link.getAttribute('href');
        const sizes = link.getAttribute('sizes');
        const type = link.getAttribute('type');

        if (href) {
          const absoluteUrl = normalizeUrl(href, url);
          favicons.push({
            url: absoluteUrl,
            sizes: sizes || '192x192',
            type: type || 'image/png',
            rel: 'android-chrome'
          });
        }
      });

      return favicons;
    } catch {
      return [];
    }
  };

  const validateFavicons = async (url: string) => {
    if (!url) return;

    setLoading(true);
    setValidationResult(null);

    try {
      // Normalizar URL
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;

      // Buscar todos los favicons en la página
      const foundFavicons = await findFaviconsInHTML(normalizedUrl);

      // Separar favicons genéricos
      const genericFavicons = foundFavicons.filter(favicon => favicon.isGeneric);

      // Crear validaciones basadas en nuestra configuración
      const validations: FaviconValidation[] = FAVICON_SIZES.map(faviconSize => {
        // Buscar si existe un favicon que coincida con este tamaño
        const matchingFavicon = foundFavicons.find(favicon => {
          // Para ICO: buscar por tipo o extensión
          if (faviconSize.format === 'ico') {
            return favicon.type === 'image/x-icon' || favicon.url.includes('.ico');
          }

          // Para PNG: buscar por sizes
          if (faviconSize.format === 'png' && favicon.sizes) {
            return sizesMatch(favicon.sizes, faviconSize.size);
          }

          // Para Windows Tiles (144x144): buscar por rel específico
          if (faviconSize.purpose === 'Windows Tiles' && faviconSize.size === 144) {
            return favicon.rel === 'msapplication-TileImage' || favicon.url.includes('ms-icon-144x144');
          }

          return false;
        });

        return {
          ...faviconSize,
          found: !!matchingFavicon,
          foundUrl: matchingFavicon?.url,
          foundSizes: matchingFavicon?.sizes,
          isGeneric: matchingFavicon?.isGeneric
        };
      });

      // Contar favicons encontrados (solo los que coinciden con nuestra configuración)
      const foundCount = validations.filter(v => v.found).length;
      const coveragePercentage = Math.round((foundCount / FAVICON_SIZES.length) * 100);

      setValidationResult({
        url: normalizedUrl,
        totalFavicons: FAVICON_SIZES.length,
        foundFavicons: foundCount,
        validations,
        loading: false,
        genericFavicons: genericFavicons.length > 0 ? genericFavicons : undefined
      });

      // GTM Event: Validación completada exitosamente
      gtmEvents.validatorValidationCompleted(normalizedUrl, foundCount, FAVICON_SIZES.length, coveragePercentage);

    } catch (error) {
      const errorMessage = 'Error al validar la URL';
      setValidationResult({
        url,
        totalFavicons: 0,
        foundFavicons: 0,
        validations: [],
        loading: false,
        error: errorMessage
      });

      // GTM Event: Error en validación
      gtmEvents.validatorValidationError(url, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetValidation = () => {
    setValidationResult(null);
  };

  return {
    validationResult,
    loading,
    validateFavicons,
    resetValidation
  };
}; 
