'use client';

import { useRef, useEffect } from 'react';
import {
  Type,
  FileText,
  Palette,
  Download,
  Sparkles,
  X
} from 'lucide-react';
import { useGeneratorStore } from '@/store/generatorStore';
import Dropzone from './Dropzone';
import dynamic from 'next/dynamic';
import { ICONS } from '@/config/icons';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

const PreviewDefault = dynamic(() => import('./PreviewDefault'), { ssr: false });
import type { PreviewDefaultRef } from './PreviewDefault';

type TabType = 'text' | 'svg' | 'icons';

export default function FaviconGenerator() {
  const previewRef = useRef<PreviewDefaultRef>(null);

  const {
    activeTab,
    textSettings,
    svgSettings,
    iconSettings,
    elementPosition,
    textSize,
    setActiveTab,
    updateTextSettings,
    updateSvgSettings,
    updateIconSettings
  } = useGeneratorStore();



  const tabs = [
    { id: 'text', label: 'Text', icon: Type },
    { id: 'icons', label: 'Icons', icon: Palette },
    { id: 'svg', label: 'SVG', icon: FileText }
  ];

  const handleGenerateFavicon = () => {
    previewRef.current?.downloadImage();
  };

  // Seleccionar primer icono cuando se cambie al tab Icons
  useEffect(() => {
    if (activeTab === 'icons' && !iconSettings.selectedIcon) {
      updateIconSettings({ selectedIcon: 'heart' });
    }
  }, [activeTab, iconSettings.selectedIcon, updateIconSettings]);



  return (
    <section className="generator">
      <h1 className="generator__title">
        <Palette size={40} className="generator__title-icon" />
        Favicon Generator
      </h1>
      <p className="generator__subtitle">
        Create custom favicons from text, SVG files, or icon libraries.
      </p>

      <div className="generator__card">
        {/* Color Settings Section */}
        <div className="generator__color-settings">
          <h3>Color Settings</h3>
          <p>Customize the colors of your favicon.</p>

          <div className="generator__form-row">
            <div className="generator__form-group">
              <label htmlFor="bg-color">Background Color</label>
              <div className="generator__color-input-group">
                <input
                  type="color"
                  id="bg-color"
                  value={textSettings.backgroundColor}
                  onChange={(e) => updateTextSettings({ backgroundColor: e.target.value })}
                  className="generator__color-input"
                />
                <input
                  type="text"
                  value={textSettings.backgroundColor}
                  onChange={(e) => updateTextSettings({ backgroundColor: e.target.value })}
                  placeholder="#F3DFA2"
                  className="generator__input"
                />
              </div>
            </div>

            <div className="generator__form-group">
              <label htmlFor="text-color">Text Color</label>
              <div className="generator__color-input-group">
                <input
                  type="color"
                  id="text-color"
                  value={textSettings.textColor}
                  onChange={(e) => updateTextSettings({ textColor: e.target.value })}
                  className="generator__color-input"
                />
                <input
                  type="text"
                  value={textSettings.textColor}
                  onChange={(e) => updateTextSettings({ textColor: e.target.value })}
                  placeholder="#333"
                  className="generator__input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="generator__tabs">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`generator__tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id as TabType)}
              >
                <IconComponent size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Controls Section */}
        <div className="generator__controls">
          {activeTab === 'text' && (
            <div className="generator__text-controls">
              <h3>Text Settings</h3>
              <p>Create a favicon from custom text (max 2 characters).</p>

              <div className="generator__form-row">
                <div className="generator__form-group">
                  <label htmlFor="text-input">Text</label>
                  <input
                    id="text-input"
                    type="text"
                    maxLength={3}
                    value={textSettings.text}
                    onChange={(e) => updateTextSettings({ text: e.target.value })}
                    placeholder="Enter 1-3 characters"
                    className="generator__input"
                  />
                </div>

                <div className="generator__form-group">
                  <label htmlFor="font-select">Font</label>
                  <select
                    id="font-select"
                    value={textSettings.font}
                    onChange={(e) => updateTextSettings({ font: e.target.value })}
                    className="generator__select"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Source Sans Pro">Source Sans Pro</option>
                    <option value="Ubuntu">Ubuntu</option>
                    <option value="Nunito">Nunito</option>
                    <option value="Playfair Display">Playfair Display</option>
                  </select>
                </div>


              </div>


            </div>
          )}

          {activeTab === 'svg' && (
            <div className="generator__svg-controls">
              <h3>SVG Settings</h3>
              <p>Upload an SVG file to create your favicon.</p>

              {svgSettings.svgContent ? (
                // Mostrar archivo cargado desde el store
                <div className="dropzone">
                  <div className="dropzone__file-selected">
                    <div className="dropzone__file-info">
                      <FileText size={24} className="dropzone__file-icon" />
                      <div className="dropzone__file-details">
                        <h4 className="dropzone__file-name">{svgSettings.fileName || 'SVG File'}</h4>
                        <p className="dropzone__file-size">
                          {svgSettings.fileSize ? `${(svgSettings.fileSize / 1024).toFixed(1)} KB` : 'SVG loaded'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        Swal.fire({
                          title: 'Delete SVG?',
                          text: 'Are you sure you want to delete the loaded SVG?',
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#3085d6',
                          cancelButtonColor: '#d33',
                          confirmButtonText: 'Yes, delete',
                          cancelButtonText: 'Cancel'
                        }).then((result) => {
                          if (result.isConfirmed) {
                            updateSvgSettings({
                              file: null,
                              svgContent: '',
                              fileName: '',
                              fileSize: 0
                            });
                            toast.success('SVG deleted successfully!');
                          }
                        });
                      }}
                      className="dropzone__remove-btn"
                      title="Eliminar archivo"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                // Mostrar dropzone normal
                <Dropzone
                  onFileSelect={(file) => {
                    if (file) {
                      updateSvgSettings({
                        file,
                        fileName: file.name,
                        fileSize: file.size
                      });

                      // Cargar el contenido del SVG y guardarlo en el store
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const content = e.target?.result as string;
                        updateSvgSettings({ svgContent: content });
                      };
                      reader.readAsText(file);
                    } else {
                      updateSvgSettings({
                        file: null,
                        svgContent: '',
                        fileName: '',
                        fileSize: 0
                      });
                    }
                  }}
                  acceptedFileType=".svg"
                  maxSize={1024 * 1024} // 1MB
                />
              )}


            </div>
          )}

          {activeTab === 'icons' && (
            <div className="generator__icons-controls">
              <h3>Icon Settings</h3>
              <p>Choose from our icon library.</p>

              <div className="generator__icons-grid">
                {Object.keys(ICONS).map((name) => (
                  <button
                    key={name}
                    className={`generator__icon-item ${iconSettings.selectedIcon === name ? 'generator__icon-item--selected' : ''}`}
                    onClick={() => {
                      updateIconSettings({ selectedIcon: name });
                    }}
                  >
                    <div className="generator__icon-preview">
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          filter: 'brightness(0) invert(1)'
                        }}
                        dangerouslySetInnerHTML={{
                          __html: ICONS[name].replace('width="24" height="24"', 'width="32" height="32"')
                        }}
                      />
                    </div>
                    <span className="generator__icon-name">{name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div className="generator__preview">
          <div className="generator__preview-container">
            <PreviewDefault ref={previewRef} />
          </div>
        </div>

        {/* Actions */}
        <div className="generator__actions">
          <div className="generator__actions-buttons">
            <button
              className="generator__btn-download"
              onClick={handleGenerateFavicon}
            >
              <Download size={20} />
              Download PNG
            </button>

            <button
              className="generator__btn-converter"
              onClick={async () => {
                try {
                  console.log('Botón Send to Converter clickeado');

                  // Generar la imagen como blob
                  console.log('Generando imagen...');
                  const blob = await previewRef.current?.generateImageBlob();
                  console.log('Blob generado:', blob);

                  if (!blob) {
                    console.error('No se pudo generar el blob');
                    return;
                  }

                  // Convertir blob a base64 y guardar en localStorage
                  const reader = new FileReader();
                  reader.onload = () => {
                    const base64 = reader.result as string;
                    localStorage.setItem('generatedFavicon', base64);
                    localStorage.setItem('faviconSource', 'generator');

                    // Guardar también los datos del generator para referencia
                    localStorage.setItem('generatorData', JSON.stringify({
                      activeTab,
                      textSettings,
                      svgSettings: {
                        backgroundColor: svgSettings.backgroundColor,
                        iconColor: svgSettings.iconColor,
                        svgContent: svgSettings.svgContent,
                        fileName: svgSettings.fileName,
                        fileSize: svgSettings.fileSize
                      },
                      iconSettings,
                      elementPosition,
                      textSize
                    }));

                    console.log('Imagen guardada en localStorage, redirigiendo...');
                    window.location.href = '/converter';
                  };
                  reader.readAsDataURL(blob);
                } catch (error) {
                  console.error('Error generating image:', error);
                }
              }}
            >
              <Sparkles size={20} />
              Send to Converter
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 
