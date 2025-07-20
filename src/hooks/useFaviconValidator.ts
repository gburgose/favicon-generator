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
