"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

export default function Footer() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          <Logo size="large" className="footer__logo" />

          <ul className="footer__links">
            <li>
              <Link href="/" className={isActive('/') ? 'footer__link--active' : ''}>
                Home
              </Link>
            </li>
            <li className="footer__separator">•</li>
            <li>
              <Link href="/converter" className={isActive('/converter') ? 'footer__link--active' : ''}>
                Converter
              </Link>
            </li>
            <li className="footer__separator">•</li>
            <li>
              <Link href="/generator" className={isActive('/generator') ? 'footer__link--active' : ''}>
                Generator
              </Link>
            </li>
            <li className="footer__separator">•</li>
            <li>
              <Link href="/validator" className={isActive('/validator') ? 'footer__link--active' : ''}>
                Validator
              </Link>
            </li>
            <li className="footer__separator">•</li>
            <li>
              <Link href="/privacy" className={isActive('/privacy') ? 'footer__link--active' : ''}>
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer__bottom">
          <p>
            Made with <Heart size={14} className="footer__heart" /> by{" "}
            <a
              href="https://buymeacoffee.com/gburgose"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__author-link"
            >
              Gabriel Burgos
            </a>
          </p>
          <p className="footer__copyright">
            © {new Date().getFullYear()} Favicon Tools. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 
