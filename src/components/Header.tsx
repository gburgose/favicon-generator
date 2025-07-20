import { Zap } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <a href="/" className="header__logo">
          <Zap size={24} className="header__icon" />
          <span className="header__text">Favicon Generator</span>
        </a>
        <a
          href="https://github.com/gburgose"
          target="_blank"
          rel="noopener noreferrer"
          className="header__link"
        >
          <Image
            src="https://avatars.githubusercontent.com/u/944868?s=32&v=4"
            alt="Gabriel Burgos GitHub"
            width={24}
            height={24}
            className="header__avatar"
          />
          <span className="header__link-text">Follow me on GitHub</span>
        </a>
      </div>
    </header>
  );
} 
