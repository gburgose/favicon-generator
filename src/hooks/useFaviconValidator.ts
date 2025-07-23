import { useState } from 'react';
import { FAVICON_SIZES } from '@/config/favicon-sizes';
import { useValidatorStore } from '@/stores/validatorStore';

interface FaviconFound {
  url: string;
  sizes?: string;
  type?: string;
  rel?: string;
  width?: number;
  height?: number;
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
}

interface ValidationResult {
  url: string;
  totalFavicons: number;
  foundFavicons: number;
  validations: FaviconValidation[];
  loading: boolean;
  error?: string;
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

  const findFaviconsInHTML = async (url: string): Promise<FaviconFound[]> => {
    try {
      console.log('Fetching HTML from:', url);

      // Verificar si tenemos el HTML en caché
      let html = getCachedHTML(url) || '';

      if (html) {
        console.log('Using cached HTML');
      } else {
        console.log('No cached HTML found, fetching from URL');

        // Usar un proxy público para evitar CORS
        try {
          const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
          const response = await fetch(proxyUrl);

          if (response.ok) {
            const data = await response.json();
            html = data.contents;
            console.log('Successfully fetched HTML via proxy');

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

      // Función 1: Buscar ICO (por extensión o rel específico)
      const icoLinks = doc.querySelectorAll('link[href*=".ico"], link[rel="shortcut icon"]');
      icoLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
          const absoluteUrl = new URL(href, url).href;
          favicons.push({
            url: absoluteUrl,
            type: 'image/x-icon',
            rel: 'shortcut icon'
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
          const absoluteUrl = new URL(href, url).href;
          favicons.push({
            url: absoluteUrl,
            sizes: sizes,
            type: type || undefined,
            rel: rel || undefined
          });
        }
      });

      // Función 3: Buscar Windows Tiles (meta tags)
      const windowsMeta = doc.querySelector('meta[name="msapplication-TileImage"]');
      if (windowsMeta) {
        const content = windowsMeta.getAttribute('content');
        if (content) {
          const absoluteUrl = new URL(content, url).href;
          favicons.push({
            url: absoluteUrl,
            type: 'image/png',
            rel: 'msapplication-TileImage'
          });
        }
      }

      console.log('Total favicons found:', favicons.length);
      return favicons;
    } catch (error) {
      console.error('Error in findFaviconsInHTML:', error);
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

          return false;
        });

        return {
          ...faviconSize,
          found: !!matchingFavicon,
          foundUrl: matchingFavicon?.url,
          foundSizes: matchingFavicon?.sizes
        };
      });

      const foundCount = validations.filter(v => v.found).length;

      setValidationResult({
        url: normalizedUrl,
        totalFavicons: FAVICON_SIZES.length,
        foundFavicons: foundCount,
        validations,
        loading: false
      });

    } catch (error) {
      setValidationResult({
        url,
        totalFavicons: 0,
        foundFavicons: 0,
        validations: [],
        loading: false,
        error: 'Error al validar la URL'
      });
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
