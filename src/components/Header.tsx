import { Zap } from "lucide-react";

export default function Header() {
  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-logo">
          <Zap size={24} className="logo-icon" />
          <span className="logo-text">Favicon Generator</span>
        </div>
        <a
          href="https://github.com/gburgose"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
          <img
            src="https://avatars.githubusercontent.com/u/944868?s=32&v=4"
            alt="Gabriel Burgos GitHub"
            className="github-avatar"
          />
          <span className="github-text">Sígueme en GitHub</span>
        </a>
      </div>
    </header>
  );
} 
