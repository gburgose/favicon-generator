import { Heart, Zap } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          <Link href="/" className="footer__logo">
            <Zap size={20} className="footer__icon" />
            <span>Favicon Tools</span>
          </Link>

          <ul className="footer__links">
            <li>
              <Link href="/">Favicon Converter</Link>
            </li>
            <li>
              <Link href="/generator">Favicon Generator</Link>
            </li>
            <li>
              <Link href="/validator">Favicon Validator</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
          </ul>
        </div>

        <div className="footer__bottom">
          <p>
            Made with <Heart size={14} className="footer__heart" /> by{" "}
            <a
              href="https://github.com/gburgose"
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
