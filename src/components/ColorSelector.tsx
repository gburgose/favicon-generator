'use client';

interface ColorSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function ColorSelector({ label, value, onChange, placeholder }: ColorSelectorProps) {
  return (
    <div className="color-selector">
      <label htmlFor={`${label.toLowerCase().replace(' ', '-')}-color`} className="color-selector__label">{label}</label>
      <div className="color-selector__input-group">
        <input
          type="color"
          id={`${label.toLowerCase().replace(' ', '-')}-color`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="color-selector__color-input"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="color-selector__text-input"
        />
      </div>
    </div>
  );
} 
