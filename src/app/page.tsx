import Link from 'next/link';
import { Sparkles, Palette, CheckCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="page">
      <section className="home">
        <div className="home__header">
          <h1 className="home__title">
            Create, Convert & Validate Favicons
          </h1>
          <p className="home__subtitle">
            Optimize your website&apos;s visual identity from the browser tab.
          </p>
        </div>

        <div className="home__tools">
          <Link href="/converter" className="home__tool-card">
            <div className="home__tool-icon">
              <Sparkles size={40} />
            </div>
            <h3 className="home__tool-title">Convert Favicon</h3>
            <p className="home__tool-description">
              Upload an image and convert it to multiple favicon sizes for all devices.
            </p>
            <div className="home__tool-features">
              <span>Multiple sizes</span>
              <span>All formats</span>
              <span>Instant download</span>
            </div>
          </Link>

          <Link href="/generator" className="home__tool-card">
            <div className="home__tool-icon">
              <Palette size={40} />
            </div>
            <h3 className="home__tool-title">Generate Favicon</h3>
            <p className="home__tool-description">
              Create custom favicons from text, SVG files, or icon libraries.
            </p>
            <div className="home__tool-features">
              <span>Text input</span>
              <span>Icon library</span>
              <span>SVG upload</span>
            </div>
          </Link>

          <Link href="/validator" className="home__tool-card">
            <div className="home__tool-icon">
              <CheckCircle size={40} />
            </div>
            <h3 className="home__tool-title">Validate Favicon</h3>
            <p className="home__tool-description">
              Check if your website has proper favicon implementation.
            </p>
            <div className="home__tool-features">
              <span>URL validation</span>
              <span>Size checking</span>
              <span>Format analysis</span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
