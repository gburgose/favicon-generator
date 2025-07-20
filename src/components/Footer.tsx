import { Heart, Github, Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          <div className="footer__logo">
            <Zap size={20} className="footer__icon" />
            <span>Favicon Generator</span>
          </div>

          <ul className="footer__links">
            <li>
              <a href="https://github.com/gburgose" target="_blank" rel="noopener noreferrer">
                <Github size={16} />
                GitHub
              </a>
            </li>
            <li>
              <a href="/privacy">Privacy Policy</a>
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
            © {new Date().getFullYear()} Favicon Generator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 
