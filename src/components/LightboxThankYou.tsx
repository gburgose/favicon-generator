'use client';

import { useEffect } from 'react';
import { X, Coffee } from 'lucide-react';

interface LightboxThankYouProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function LightboxThankYou({
  isOpen,
  onClose,
  title = "Thank you for using our Favicon Generator!",
  message = "We hope you love your new favicon. If you found our tool helpful, consider supporting us with a coffee to keep it free and improve it further."
}: LightboxThankYouProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="thank-you-lightbox" onClick={handleBackdropClick}>
      <div className="thank-you-lightbox__content">
        <button className="thank-you-lightbox__close-btn" onClick={onClose} aria-label="Close">
          <X size={24} />
        </button>
        <div className="thank-you-lightbox__body">
          <div className="thank-you-lightbox__icon">
            <Coffee size={48} />
          </div>
          <h2 className="thank-you-lightbox__title">{title}</h2>
          <p className="thank-you-lightbox__message">{message}</p>
          <div className="thank-you-lightbox__actions">
            <button className="thank-you-lightbox__btn thank-you-lightbox__btn--secondary" onClick={onClose}>
              Close
            </button>
            <a
              href="https://buymeacoffee.com/gburgose"
              target="_blank"
              rel="noopener noreferrer"
              className="thank-you-lightbox__btn thank-you-lightbox__btn--primary"
              onClick={onClose}
            >
              <Coffee size={20} />
              Buy me a coffee
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 
