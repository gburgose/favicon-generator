'use client';

import { useState } from 'react';
import { useFaviconGenerator } from '@/hooks/useFaviconGenerator';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Upload,
  Download,
  Trash2,
  Copy,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function FaviconGenerator() {
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
    FAVICON_SIZES
  } = useFaviconGenerator();

  return (
    <div className="container">
      <h1 className="title">Favicon Generator</h1>
      <p className="subtitle">
        Upload an image and generate favicons in multiple sizes for your website
      </p>

      <div className="card">
        <div
          {...dropzoneProps.getRootProps()}
          className={`dropzone ${dropzoneProps.isDragActive ? 'active' : ''}`}
        >
          <input {...dropzoneProps.getInputProps()} />
          <div className="dropzone-text">
            {dropzoneProps.isDragActive
              ? 'Drop the image here...'
              : 'Drag & drop an image here, or click to select'}
          </div>
          <div className="dropzone-subtext">
            Supports PNG, JPG, JPEG, GIF, BMP, WebP (max 10MB)
          </div>
        </div>

        {selectedFile && (
          <div className="preview-section">
            <h2 className="preview-title">Original Image</h2>
            <img
              src={previewUrl}
              alt="Preview"
              className="original-image"
            />
            <p className="file-info">
              {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>

            {imageWarning && (
              <div className="image-warning">
                ⚠️ {imageWarning}
              </div>
            )}

            <div className="app-settings">
              <h3>App Settings</h3>

              <div className="settings-grid">
                <div className="form-group">
                  <label>App Name</label>
                  <input
                    type="text"
                    value={appSettings.name}
                    onChange={(e) => updateAppSettings({ name: e.target.value })}
                    placeholder="My App"
                  />
                </div>

                <div className="form-group">
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

              <div className="form-group description-field">
                <label>App Description</label>
                <input
                  type="text"
                  value={appSettings.description}
                  onChange={(e) => updateAppSettings({ description: e.target.value })}
                  placeholder="App description"
                />
              </div>
            </div>

            <div className="buttons-container">
              <button
                onClick={generateFavicons}
                disabled={isGenerating}
                className="btn-primary btn-no-margin"
              >
                {isGenerating && <span className="loading"></span>}
                {!isGenerating && <Sparkles size={18} />}
                {isGenerating ? 'Generating...' : 'Generate Favicons'}
              </button>

              <button
                onClick={clearAll}
                className="btn-secondary btn-no-margin"
              >
                <Trash2 size={18} />
                Clear
              </button>
            </div>
          </div>
        )}

        {Object.keys(generatedFavicons).length > 0 && (
          <div className="preview-section" id="generated-favicons">
            <div className="section-header">
              <h2 className="preview-title">Generated Favicons</h2>
              <button
                onClick={() => setShowFavicons(!showFavicons)}
                className="btn-view-more"
              >
                {showFavicons ? 'View Less' : 'View More'}
                {showFavicons ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {showFavicons && (
              <>
                <div className="favicons-table">
                  <table>
                    <tbody>
                      {/* Add favicon.ico row */}
                      <tr>
                        <td>
                          <img
                            src={generatedFavicons['32x32']}
                            alt="favicon.ico"
                            className="favicon-table-preview favicon-icon"
                          />
                        </td>
                        <td className="file-name">favicon.ico</td>
                        <td className="size">32x32</td>
                        <td className="purpose">Classic Favicon</td>
                        <td className="file-size">{getFileSize(generatedFavicons['32x32'])}</td>
                      </tr>
                      {FAVICON_SIZES.map(({ size, name }) => {
                        const fileName = getFileName(name);
                        const purpose = getFaviconPurpose(name);
                        const fileSize = getFileSize(generatedFavicons[name]);

                        return (
                          <tr key={name}>
                            <td>
                              <img
                                src={generatedFavicons[name]}
                                alt={`${name} favicon`}
                                className="favicon-table-preview favicon-icon"
                              />
                            </td>
                            <td className="file-name">{fileName}</td>
                            <td className="size">{name}</td>
                            <td className="purpose">{purpose}</td>
                            <td className="file-size">{fileSize}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>


              </>
            )}

            <div className="meta-tags-section">
              <div className="section-header">
                <h3>HTML Meta Tags</h3>
                <button
                  onClick={() => setShowMetaTags(!showMetaTags)}
                  className="btn-view-more"
                >
                  {showMetaTags ? 'View Less' : 'View More'}
                  {showMetaTags ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {showMetaTags && (
                <>
                  <p className="section-description">
                    Copy and paste these meta tags into your HTML &lt;head&gt; section:
                  </p>
                  <div className="code-block">
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
                      className="btn-copy"
                    >
                      <Copy size={16} />
                      Copy Meta Tags
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="manifest-section">
              <div className="section-header">
                <h3>Web App Manifest Preview</h3>
                <button
                  onClick={() => setShowManifest(!showManifest)}
                  className="btn-view-more"
                >
                  {showManifest ? 'View Less' : 'View More'}
                  {showManifest ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {showManifest && (
                <>
                  <p className="section-description">
                    This is the content of the site.webmanifest file that will be generated:
                  </p>
                  <div className="code-block">
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
                      className="btn-copy"
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
          <div className="download-section">
            <h3>Ready to Download</h3>
            <p className="download-description">
              All your favicons have been generated successfully. Download the complete package with all files and meta tags.
            </p>
            <button
              onClick={downloadFavicons}
              disabled={isDownloading}
              className="btn-download"
            >
              {isDownloading && <span className="loading"></span>}
              {!isDownloading && <Download size={20} />}
              {isDownloading ? 'Downloading...' : 'Download Complete Package (ZIP)'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
