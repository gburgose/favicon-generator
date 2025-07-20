import { Heart, Github, Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-logo">
            <Zap size={20} className="footer-icon" />
            <span>Favicon Generator</span>
          </div>

          <ul className="footer-links">
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

        <div className="footer-bottom">
          <p>
            Made with <Heart size={14} className="heart-icon" /> by{" "}
            <a
              href="https://github.com/gburgose"
              target="_blank"
              rel="noopener noreferrer"
              className="author-link"
            >
              Gabriel Burgos
            </a>
          </p>
          <p className="copyright">
            © {new Date().getFullYear()} Favicon Generator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 
