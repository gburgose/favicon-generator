'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Type,
  FileText,
  Palette,
  Download,
  Sparkles,
  Heart,
  Star,
  Home,
  User,
  Settings,
  Search,
  Mail,
  Phone,
  Camera,
  Music,
  Bookmark,
  Upload,
  Share,
  ThumbsUp,
  Eye,
  Plus,
  Minus,
  Check,
  X,
  Zap
} from 'lucide-react';
import { useFaviconGenerator } from '@/hooks/useFaviconGenerator';

type TabType = 'text' | 'svg' | 'icons';

export default function FaviconGenerator() {
  const [activeTab, setActiveTab] = useState<TabType>('text');

  const {
    previewUrl,
    isGenerating,
    textSettings,
    iconSettings,
    updateTextSettings,
    updateIconSettings,
    generateFavicon,
    generateTextPreview,
    generateIconPreview
  } = useFaviconGenerator();

  const tabs = [
    { id: 'text', label: 'Text', icon: Type },
    { id: 'icons', label: 'Icons', icon: Palette },
    { id: 'svg', label: 'SVG', icon: FileText }
  ];

  const handleGenerateFavicon = () => {
    generateFavicon();
  };



  return (
    <section className="generator">
      <h1 className="generator__title">
        <Sparkles size={40} className="generator__title-icon" />
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
                    maxLength={2}
                    value={textSettings.text}
                    onChange={(e) => updateTextSettings({ text: e.target.value })}
                    placeholder="Enter 1-2 characters"
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

                <div className="generator__form-group">
                  <label htmlFor="size-select">Size</label>
                  <select
                    id="size-select"
                    value={textSettings.size}
                    onChange={(e) => updateTextSettings({ size: e.target.value })}
                    className="generator__select"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>

              <button
                className="generator__btn-apply"
                onClick={() => generateTextPreview(textSettings)}
              >
                Apply Changes
              </button>
            </div>
          )}

          {activeTab === 'svg' && (
            <div className="generator__svg-controls">
              <h3>SVG Settings</h3>
              <p>Upload an SVG file to create your favicon.</p>
              {/* TODO: Implementar controles de SVG */}
            </div>
          )}

          {activeTab === 'icons' && (
            <div className="generator__icons-controls">
              <h3>Icon Settings</h3>
              <p>Choose from our icon library.</p>

              <div className="generator__icons-grid">
                {[
                  { name: 'heart', icon: Heart },
                  { name: 'star', icon: Star },
                  { name: 'home', icon: Home },
                  { name: 'user', icon: User },
                  { name: 'settings', icon: Settings },
                  { name: 'search', icon: Search },
                  { name: 'mail', icon: Mail },
                  { name: 'phone', icon: Phone },
                  { name: 'camera', icon: Camera },
                  { name: 'music', icon: Music },
                  { name: 'bookmark', icon: Bookmark },
                  { name: 'download', icon: Download },
                  { name: 'upload', icon: Upload },
                  { name: 'share', icon: Share },
                  { name: 'thumbsup', icon: ThumbsUp },
                  { name: 'eye', icon: Eye },
                  { name: 'plus', icon: Plus },
                  { name: 'minus', icon: Minus },
                  { name: 'check', icon: Check },
                  { name: 'x', icon: X },
                  { name: 'zap', icon: Zap }
                ].map(({ name, icon: IconComponent }) => (
                  <button
                    key={name}
                    className={`generator__icon-item ${iconSettings.selectedIcon === name ? 'generator__icon-item--selected' : ''}`}
                    onClick={() => {
                      updateIconSettings({ selectedIcon: name });
                      generateIconPreview({ ...iconSettings, selectedIcon: name });
                    }}
                  >
                    <div className="generator__icon-preview">
                      <IconComponent size={32} />
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
          <h3>Preview</h3>
          <div className="generator__preview-container">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Favicon preview"
                width={512}
                height={512}
                className="generator__preview-image"
              />
            ) : (
              <div className="generator__preview-placeholder">
                <Sparkles size={48} />
                <p>Your favicon preview will appear here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="generator__actions">
          <div className="generator__actions-buttons">
            <button
              className="generator__btn-download"
              onClick={handleGenerateFavicon}
              disabled={!previewUrl || isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="generator__loading"></div>
                  Downloading...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Download PNG
                </>
              )}
            </button>

            <button
              className="generator__btn-converter"
              onClick={() => {
                if (previewUrl) {
                  // Guardar la imagen en localStorage para que el Converter la pueda usar
                  localStorage.setItem('generatedFavicon', previewUrl);
                  localStorage.setItem('faviconSource', 'generator');
                  window.location.href = '/converter';
                }
              }}
              disabled={!previewUrl}
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
