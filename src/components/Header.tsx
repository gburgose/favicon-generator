"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="header">
      <div className="header__container">
        <Logo size="large" className="header__logo" />

        <nav className="header__nav">
          <ul className="header__menu">
            <li>
              <Link href="/" className={isActive('/') ? 'header__menu-link--active' : 'header__menu-link'}>
                Home
              </Link>
            </li>
            <li className="header__separator">•</li>
            <li>
              <Link href="/converter" className={isActive('/converter') ? 'header__menu-link--active' : 'header__menu-link'}>
                Converter
              </Link>
            </li>
            <li className="header__separator">•</li>
            <li>
              <Link href="/generator" className={isActive('/generator') ? 'header__menu-link--active' : 'header__menu-link'}>
                Generator
              </Link>
            </li>
            <li className="header__separator">•</li>
            <li>
              <Link href="/validator" className={isActive('/validator') ? 'header__menu-link--active' : 'header__menu-link'}>
                Validator
              </Link>
            </li>
          </ul>
        </nav>

        <a
          href="https://buymeacoffee.com/gburgose"
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
          <span className="header__link-text">Buy me a coffee</span>
        </a>
      </div>
    </header>
  );
} 
