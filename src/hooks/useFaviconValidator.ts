import { useState } from 'react';

interface FaviconCheck {
  type: string;
  url: string;
  exists: boolean;
  size?: string;
  error?: string;
}

interface ValidationResult {
  url: string;
  hasFavicon: boolean;
  checks: FaviconCheck[];
  loading: boolean;
  error?: string;
}

export const useFaviconValidator = () => {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const validateFavicons = async (url: string) => {
    if (!url) return;

    setLoading(true);
    setValidationResult(null);

    try {
      // Normalizar URL
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      const urlObj = new URL(normalizedUrl);
      const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;

      const checks: FaviconCheck[] = [];

      // Favicons que genera nuestra aplicación
      const faviconPaths = [
        '/favicon.ico',
        '/favicon-16x16.png',
        '/favicon-32x32.png',
        '/apple-touch-icon.png',
        '/android-chrome-192x192.png',
        '/android-chrome-512x512.png',
        '/site.webmanifest'
      ];

      // Verificar favicons básicos
      for (const path of faviconPaths) {
        try {
          const response = await fetch(`${baseUrl}${path}`, {
            method: 'HEAD',
            mode: 'no-cors'
          });

          checks.push({
            type: path,
            url: `${baseUrl}${path}`,
            exists: response.ok || response.status === 0, // no-cors siempre retorna 0
            size: response.headers.get('content-length') || undefined
          });
        } catch (error) {
          checks.push({
            type: path,
            url: `${baseUrl}${path}`,
            exists: false,
            error: 'Error al verificar'
          });
        }
      }

      // Verificar meta tags en el HTML
      try {
        const htmlResponse = await fetch(normalizedUrl);
        const html = await htmlResponse.text();

        // Buscar meta tags específicos que genera nuestra app
        const metaPatterns = [
          /<link[^>]*rel=["']icon["'][^>]*href=["']([^"']+)["']/gi,
          /<link[^>]*rel=["']apple-touch-icon["'][^>]*href=["']([^"']+)["']/gi,
          /<link[^>]*rel=["']manifest["'][^>]*href=["']([^"']+)["']/gi,
          /<meta[^>]*name=["']theme-color["'][^>]*content=["']([^"']+)["']/gi
        ];

        for (const pattern of metaPatterns) {
          let match;
          while ((match = pattern.exec(html)) !== null) {
            const faviconUrl = match[1];
            const absoluteUrl = faviconUrl.startsWith('http')
              ? faviconUrl
              : faviconUrl.startsWith('/')
                ? `${baseUrl}${faviconUrl}`
                : `${baseUrl}/${faviconUrl}`;

            try {
              const response = await fetch(absoluteUrl, { method: 'HEAD' });
              checks.push({
                type: 'Meta tag',
                url: absoluteUrl,
                exists: response.ok,
                size: response.headers.get('content-length') || undefined
              });
            } catch (error) {
              checks.push({
                type: 'Meta tag',
                url: absoluteUrl,
                exists: false,
                error: 'Error al verificar'
              });
            }
          }
        }
      } catch (error) {
        // Si no se puede obtener el HTML, continuar con los checks básicos
      }

      const hasFavicon = checks.some(check => check.exists);

      setValidationResult({
        url: normalizedUrl,
        hasFavicon,
        checks,
        loading: false
      });

    } catch (error) {
      setValidationResult({
        url,
        hasFavicon: false,
        checks: [],
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
