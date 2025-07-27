'use client';

import { useRef, useEffect, useState } from 'react';
import {
  Type,
  FileText,
  Palette,
  Download,
  Sparkles,
  X,
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter
} from 'lucide-react';
import { useGeneratorStore } from '@/store/generatorStore';
import Dropzone from './Dropzone';
import dynamic from 'next/dynamic';
import { ICONS } from '@/config/icons';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import ColorSelector from './ColorSelector';
import LightboxThankYou from './LightboxThankYou';
import { gtmEvents } from '@/utils/gtm';

const PreviewDefault = dynamic(() => import('./PreviewDefault'), { ssr: false });
import type { PreviewDefaultRef } from './PreviewDefault';

type TabType = 'text' | 'svg' | 'icons';

export default function FaviconGenerator() {
  const previewRef = useRef<PreviewDefaultRef>(null);
  const [showThankYou, setShowThankYou] = useState(false);

  const {
    activeTab,
    textSettings,
    svgSettings,
    iconSettings,
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
    setShowThankYou(true);
  };

  // Seleccionar primer icono cuando se cambie al tab Icons
  useEffect(() => {
    if (activeTab === 'icons' && !iconSettings.selectedIcon) {
      updateIconSettings({ selectedIcon: 'star' });
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
        {/* Tabs */}
        <div className="generator__tabs">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`generator__tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  gtmEvents.generatorTabChanged(tab.id);
                }}
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
              <div className="generator__text-controls__header">
                <h3 className="generator__text-controls__heading">Text Settings</h3>
                <p className="generator__text-controls__description">Create a favicon from custom text (max 2 characters).</p>
              </div>

              <div className="generator__form-row">
                <div className="generator__form-group">
                  <label htmlFor="text-input">Text</label>
                  <input
                    id="text-input"
                    type="text"
                    maxLength={3}
                    value={textSettings.text}
                    onChange={(e) => {
                      updateTextSettings({ text: e.target.value });
                      gtmEvents.generatorTextChanged(e.target.value);
                    }}
                    placeholder="Enter 1-3 characters"
                    className="generator__input"
                  />
                </div>

                <div className="generator__form-group">
                  <label htmlFor="font-select">Font</label>
                  <select
                    id="font-select"
                    value={textSettings.font}
                    onChange={(e) => {
                      updateTextSettings({ font: e.target.value });
                      gtmEvents.generatorFontChanged(e.target.value);
                    }}
                    className="generator__select"
                  >
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Oswald">Oswald</option>
                    <option value="Raleway">Raleway</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Source Sans Pro">Source Sans Pro</option>
                    <option value="Merriweather">Merriweather</option>
                    <option value="Noto Sans">Noto Sans</option>
                  </select>
                </div>


              </div>


            </div>
          )}

          {activeTab === 'svg' && (
            <div className="generator__svg-controls">
              <div className="generator__svg-controls__header">
                <h3 className="generator__svg-controls__heading">SVG Settings</h3>
                <p className="generator__svg-controls__description">Upload an SVG file to create your favicon.</p>
              </div>

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
                        fileSize: file.size,
                        position: {
                          x: 78,
                          y: 78,
                          width: 464,
                          height: 464
                        },
                        size: 120
                      });

                      // Cargar el contenido del SVG y guardarlo en el store
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const content = e.target?.result as string;
                        updateSvgSettings({ svgContent: content });

                        // Detectar colores del SVG y actualizar el store
                        // Necesitamos crear una función temporal para detectar colores
                        const detectSvgColors = (svgContent: string): { fillColor: string; strokeColor: string } => {
                          let detectedFillColor = '#333';
                          let detectedStrokeColor = '#333';

                          try {
                            // Usar regex simple para detectar colores
                            const fillMatch = svgContent.match(/fill="([^"]*)"/);
                            const strokeMatch = svgContent.match(/stroke="([^"]*)"/);

                            if (fillMatch && fillMatch[1] !== 'none' && fillMatch[1] !== 'currentColor') {
                              detectedFillColor = fillMatch[1];
                            }
                            if (strokeMatch && strokeMatch[1] !== 'none' && strokeMatch[1] !== 'currentColor') {
                              detectedStrokeColor = strokeMatch[1];
                            }
                          } catch (error) {
                            console.warn('Error detecting SVG colors:', error);
                          }

                          return { fillColor: detectedFillColor, strokeColor: detectedStrokeColor };
                        };

                        const { fillColor, strokeColor } = detectSvgColors(content);
                        updateSvgSettings({
                          fillColor,
                          strokeColor
                        });
                      };
                      reader.readAsText(file);
                    } else {
                      updateSvgSettings({
                        file: null,
                        svgContent: '',
                        fileName: '',
                        fileSize: 0,
                        position: {
                          x: 78,
                          y: 78,
                          width: 464,
                          height: 464
                        },
                        size: 120
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
              <div className="generator__icons-controls__header">
                <h3 className="generator__icons-controls__heading">Icon Settings</h3>
                <p className="generator__icons-controls__description">Choose from our icon library.</p>
              </div>

              <div className="generator__icons-grid">
                {Object.keys(ICONS).map((name) => (
                  <button
                    key={name}
                    className={`generator__icon-item ${iconSettings.selectedIcon === name ? 'generator__icon-item--selected' : ''}`}
                    onClick={() => {
                      updateIconSettings({ selectedIcon: name });
                      gtmEvents.generatorIconSelected(name);
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

        {/* Color Settings Section */}
        <div className={`generator__color-settings ${activeTab === 'text' ? 'show-text-color' : ''} ${(activeTab === 'icons' || activeTab === 'svg') ? 'show-fill-color show-stroke-color' : ''}`}>
          <div className="generator__color-controls">
            <div className="generator__color-selectors">
              <div className="generator__form-group">
                <ColorSelector
                  label="Background Color"
                  value={textSettings.backgroundColor}
                  onChange={(value) => {
                    updateTextSettings({ backgroundColor: value });
                    gtmEvents.generatorBackgroundColorChanged(value);
                  }}
                  placeholder="#F3DFA2"
                />
              </div>
              <div className="generator__form-group">
                <ColorSelector
                  label="Text Color"
                  value={textSettings.textColor}
                  onChange={(value) => {
                    updateTextSettings({ textColor: value });
                    gtmEvents.generatorTextColorChanged(value);
                  }}
                  placeholder="#333"
                />
              </div>
              <div className="generator__form-group">
                <ColorSelector
                  label="Fill Color"
                  value={activeTab === 'icons' ? iconSettings.fillColor : svgSettings.fillColor}
                  onChange={(value) => {
                    if (activeTab === 'icons') {
                      updateIconSettings({ fillColor: value });
                    } else {
                      updateSvgSettings({ fillColor: value });
                    }
                    gtmEvents.generatorFillColorChanged(value);
                  }}
                  placeholder="#333"
                />
              </div>
              <div className="generator__form-group">
                <ColorSelector
                  label="Stroke Color"
                  value={activeTab === 'icons' ? iconSettings.strokeColor : svgSettings.strokeColor}
                  onChange={(value) => {
                    if (activeTab === 'icons') {
                      updateIconSettings({ strokeColor: value });
                    } else {
                      updateSvgSettings({ strokeColor: value });
                    }
                    gtmEvents.generatorStrokeColorChanged(value);
                  }}
                  placeholder="#333"
                />
              </div>
            </div>

            <div className="generator__alignment-controls">
              <button
                className="generator__align-btn"
                onClick={() => {
                  previewRef.current?.centerVertically();
                  gtmEvents.generatorAlignVertical();
                }}
                title="Centrar verticalmente"
              >
                <AlignVerticalJustifyCenter size={20} />
              </button>

              <button
                className="generator__align-btn"
                onClick={() => {
                  previewRef.current?.centerHorizontally();
                  gtmEvents.generatorAlignHorizontal();
                }}
                title="Centrar horizontalmente"
              >
                <AlignHorizontalJustifyCenter size={20} />
              </button>
            </div>
          </div>
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

                  // Verificar si ya hay una imagen en el converter
                  const converterStore = JSON.parse(localStorage.getItem('converter-storage') || '{}');
                  const hasExistingImage = converterStore.state?.fileDataUrl || converterStore.state?.previewUrl;

                  if (hasExistingImage) {
                    const result = await Swal.fire({
                      title: 'Image Already Exists',
                      text: 'You are already working on an image in the Converter. Do you want to replace it with this new image?',
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#F3DFA2',
                      cancelButtonColor: '#666',
                      confirmButtonText: 'Yes, replace it',
                      cancelButtonText: 'Cancel',
                      background: '#1e1e1e',
                      color: '#EFE6DD'
                    });

                    if (!result.isConfirmed) {
                      return;
                    }
                  }

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
                      svgSettings,
                      iconSettings
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

      <LightboxThankYou
        isOpen={showThankYou}
        onClose={() => setShowThankYou(false)}
        title="Thank you for using our Favicon Generator!"
        message="We hope you love your new favicon. If you found our tool helpful, consider supporting us with a coffee to keep it free and improve it further."
      />
    </section>
  );
} 
