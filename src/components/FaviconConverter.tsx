'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useFaviconConverter } from '@/hooks/useFaviconConverter';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Download,
  Trash2,
  Copy,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Zap,
  Check
} from 'lucide-react';

export default function Converter() {
  const [showFavicons, setShowFavicons] = useState(false);
  const [showMetaTags, setShowMetaTags] = useState(false);
  const [showManifest, setShowManifest] = useState(false);

  const {
    selectedFile,
    previewUrl,
    generatedFavicons,
    isGenerating,
    isDownloading,
    appSettings,
    imageWarning,
    dropzoneProps,
    generateFavicons,
    downloadFavicons,
    clearAll,
    updateAppSettings,
    copyMetaTags,
    copyManifest,
    getMetaTags,
    getManifest,
    getFileName,
    getFaviconPurpose,
    getFileSize,
    FAVICON_SIZES,
    toggleFaviconSize,
    isFaviconSelected
  } = useFaviconConverter();

  return (
    <section className="converter">
      <h1 className="converter__title">
        <Zap size={40} className="converter__title-icon" />
        Favicon Converter
      </h1>
      <p className="converter__subtitle">
        Upload an image and generate favicons in multiple sizes for your website
      </p>

      <div className="converter__card">
        <div
          {...dropzoneProps.getRootProps()}
          className={`converter__dropzone ${dropzoneProps.isDragActive ? 'active' : ''}`}
        >
          <input {...dropzoneProps.getInputProps()} />
          <div className="converter__dropzone-text">
            {dropzoneProps.isDragActive
              ? 'Drop the image here...'
              : 'Drag & drop an image here, or click to select'}
          </div>
          <div className="converter__dropzone-subtext">
            Supports PNG, JPG, JPEG, GIF, BMP, WebP (max 10MB)
          </div>
        </div>

        {selectedFile && (
          <div className="converter__preview-section">
            <h2 className="converter__preview-title">Original Image</h2>
            <Image
              src={previewUrl}
              alt="Preview"
              width={200}
              height={200}
              className="converter__original-image"
              style={{ objectFit: 'contain' }}
            />
            <div className="converter__file-info">
              <div className="converter__file-name-long" title={selectedFile.name}>
                {selectedFile.name}
              </div>
              <div className="converter__file-size-info">
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            </div>

            {imageWarning && (
              <div className="converter__image-warning">
                ⚠️ {imageWarning}
              </div>
            )}

            <div className="converter__app-settings">
              <h3>App Settings</h3>
              <p className="converter__settings-subtitle">
                Customize these fields with your project information. This data will be used in meta tags and manifest to improve SEO and user experience.
              </p>

              <div className="converter__settings-grid">
                <div className="converter__form-group">
                  <label>App Name</label>
                  <input
                    type="text"
                    value={appSettings.name}
                    onChange={(e) => updateAppSettings({ name: e.target.value })}
                    placeholder="My App"
                  />
                </div>

                <div className="converter__form-group">
                  <label>Theme Color</label>
                  <div className="color-input-group">
                    <input
                      type="color"
                      value={appSettings.themeColor}
                      onChange={(e) => updateAppSettings({ themeColor: e.target.value })}
                    />
                    <input
                      type="text"
                      value={appSettings.themeColor}
                      onChange={(e) => updateAppSettings({ themeColor: e.target.value })}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>

              <div className="converter__form-group converter__description-field">
                <label>App Description</label>
                <input
                  type="text"
                  value={appSettings.description}
                  onChange={(e) => updateAppSettings({ description: e.target.value })}
                  placeholder="App description"
                />
              </div>
            </div>

            <div className="converter__favicon-selection">
              <h3>Select Favicon Sizes</h3>
              <p className="converter__settings-subtitle">
                Choose which favicon sizes you want to generate. Required sizes are pre-selected for optimal compatibility.
              </p>

              <div className="converter__favicon-grid">
                {FAVICON_SIZES.map((faviconSize) => {
                  const isSelected = isFaviconSelected(faviconSize.name);

                  return (
                    <div
                      key={faviconSize.name}
                      className={`converter__favicon-option ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleFaviconSize(faviconSize.name)}
                    >
                      <div className="converter__favicon-checkbox">
                        <div className="converter__checkbox-custom">
                          {isSelected && <Check size={12} color="#231F20" />}
                        </div>
                      </div>
                      <div className="converter__favicon-info">
                        <div className="converter__favicon-title">
                          {faviconSize.name.replace('-ico', '')}
                          <span className="converter__format-badge">{faviconSize.format.toUpperCase()}</span>
                        </div>
                        <div className="converter__favicon-description">
                          {faviconSize.purpose}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="converter__buttons-container">
              <button
                onClick={generateFavicons}
                disabled={isGenerating}
                className="converter__btn-primary converter__btn-primary--no-margin"
              >
                {isGenerating && <span className="converter__loading"></span>}
                {!isGenerating && <Sparkles size={18} />}
                {isGenerating ? 'Generating...' : 'Generate Favicons'}
              </button>

              <button
                onClick={clearAll}
                className="converter__btn-secondary converter__btn-secondary--no-margin"
              >
                <Trash2 size={18} />
                Clear
              </button>
            </div>
          </div>
        )}

        {Object.keys(generatedFavicons).length > 0 && (
          <div className="converter__preview-section" id="generated-favicons">
            <div className="converter__section-header">
              <h2 className="converter__preview-title">Generated Favicons</h2>
              <button
                onClick={() => setShowFavicons(!showFavicons)}
                className="converter__btn-view-more"
              >
                {showFavicons ? 'View Less' : 'View More'}
                {showFavicons ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {showFavicons && (
              <>
                <div className="converter__favicons-table">
                  <table>
                    <tbody>
                      {/* Add favicon.ico row */}

                      {FAVICON_SIZES.filter(({ name }) => isFaviconSelected(name)).map(({ name }) => {
                        const fileName = getFileName(name);
                        const purpose = getFaviconPurpose(name);
                        const fileSize = getFileSize(generatedFavicons[name]);

                        return (
                          <tr key={name}>
                            <td>
                              <Image
                                src={generatedFavicons[name]}
                                alt={`${name} favicon`}
                                width={32}
                                height={32}
                                className="converter__favicon-table-preview"
                              />
                            </td>
                            <td className="converter__file-name">{fileName}</td>
                            <td className="converter__size">{name}</td>
                            <td className="converter__purpose">{purpose}</td>
                            <td className="converter__file-size">{fileSize}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <div className="converter__meta-tags-section">
              <div className="converter__section-header">
                <h3>HTML Meta Tags</h3>
                <button
                  onClick={() => setShowMetaTags(!showMetaTags)}
                  className="converter__btn-view-more"
                >
                  {showMetaTags ? 'View Less' : 'View More'}
                  {showMetaTags ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {showMetaTags && (
                <>
                  <p className="converter__section-description">
                    Copy and paste these meta tags into your HTML &lt;head&gt; section:
                  </p>
                  <div className="converter__code-block">
                    <SyntaxHighlighter
                      language="html"
                      style={tomorrow}
                      customStyle={{
                        margin: 0,
                        padding: 0,
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                      }}
                    >
                      {getMetaTags()}
                    </SyntaxHighlighter>
                    <button
                      onClick={copyMetaTags}
                      className="converter__btn-copy"
                    >
                      <Copy size={16} />
                      Copy Meta Tags
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="converter__manifest-section">
              <div className="converter__section-header">
                <h3>Web App Manifest Preview</h3>
                <button
                  onClick={() => setShowManifest(!showManifest)}
                  className="converter__btn-view-more"
                >
                  {showManifest ? 'View Less' : 'View More'}
                  {showManifest ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {showManifest && (
                <>
                  <p className="converter__section-description">
                    This is the content of the site.webmanifest file that will be generated:
                  </p>
                  <div className="converter__code-block">
                    <SyntaxHighlighter
                      language="json"
                      style={tomorrow}
                      customStyle={{
                        margin: 0,
                        padding: 0,
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                      }}
                    >
                      {JSON.stringify(getManifest(), null, 2)}
                    </SyntaxHighlighter>
                    <button
                      onClick={copyManifest}
                      className="converter__btn-copy"
                    >
                      <FileText size={16} />
                      Copy Manifest
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {Object.keys(generatedFavicons).length > 0 && (
          <div className="converter__download-section">
            <h3>Ready to Download</h3>
            <p className="converter__download-description">
              All your favicons have been generated successfully. Download the complete package with all files and meta tags.
            </p>
            <button
              onClick={downloadFavicons}
              disabled={isDownloading}
              className="converter__btn-download"
            >
              {isDownloading && <span className="converter__loading"></span>}
              {!isDownloading && <Download size={20} />}
              {isDownloading ? 'Downloading...' : 'Download Complete Package (ZIP)'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
} 
