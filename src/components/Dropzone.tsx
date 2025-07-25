'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface DropzoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile?: File | null;
  acceptedFileType?: string;
  maxSize?: number; // en bytes
  className?: string;
}

export default function Dropzone({
  onFileSelect,
  selectedFile: externalSelectedFile,
  acceptedFileType = '.svg',
  maxSize = 1024 * 1024, // 1MB por defecto
  className = ''
}: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [internalSelectedFile, setInternalSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  // Usar el archivo externo si está disponible, sino el interno
  const selectedFile = externalSelectedFile || internalSelectedFile;

  const validateFile = useCallback((file: File): boolean => {
    setError('');

    // Verificar tipo de archivo
    if (!file.name.toLowerCase().endsWith('.svg')) {
      setError('Solo se permiten archivos SVG');
      return false;
    }

    // Verificar tamaño
    if (file.size > maxSize) {
      setError(`El archivo es demasiado grande. Máximo ${Math.round(maxSize / 1024)}KB`);
      return false;
    }

    return true;
  }, [maxSize]);

  const handleFileSelect = useCallback((file: File) => {
    if (validateFile(file)) {
      setInternalSelectedFile(file);
      onFileSelect(file);
    }
  }, [validateFile, onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const removeFile = useCallback(() => {
    setInternalSelectedFile(null);
    setError('');
    onFileSelect(null);
  }, [onFileSelect]);

  return (
    <div className={`dropzone ${className}`}>
      {!selectedFile ? (
        <div
          className={`dropzone__area ${isDragOver ? 'dropzone__area--drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={acceptedFileType}
            onChange={handleFileInput}
            className="dropzone__input"
            id="dropzone-file"
          />

          <div className="dropzone__content">
            <p className="dropzone__description">
              Drag & drop an SVG file here, or <span className="dropzone__browse">click to select</span>
            </p>
            <p className="dropzone__info">
              Supports SVG files (max {Math.round(maxSize / 1024)}KB)
            </p>
          </div>
        </div>
      ) : (
        <div className="dropzone__file-selected">
          <div className="dropzone__file-info">
            <FileText size={24} className="dropzone__file-icon" />
            <div className="dropzone__file-details">
              <h4 className="dropzone__file-name">{selectedFile.name}</h4>
              <p className="dropzone__file-size">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="dropzone__remove-btn"
            title="Eliminar archivo"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {error && (
        <div className="dropzone__error">
          {error}
        </div>
      )}
    </div>
  );
}
