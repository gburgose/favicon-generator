import { Sparkles, Palette, CheckCircle } from 'lucide-react';
import CardHome from '@/components/CardHome';

export default function HomePage() {
  return (
    <div className="page">
      <section className="home">
        <div className="home__header">
          <h1 className="home__title">
            Convert, Create & Validate Favicons
          </h1>
          <p className="home__subtitle">
            Optimize your website&apos;s visual identity from the browser tab.
          </p>
        </div>

        <div className="home__tools">
          <CardHome
            href="/converter"
            icon={Sparkles}
            title="Convert Favicon"
            description="Upload an image and convert it to multiple favicon sizes for all devices."
            features={["Multiple sizes", "All formats", "Instant download"]}
            isBeta={true}
          />

          <CardHome
            href="/generator"
            icon={Palette}
            title="Generate Favicon"
            description="Create custom favicons from text, SVG files, or icon libraries."
            features={["Text input", "Icon library", "SVG upload"]}
            isBeta={true}
          />

          <CardHome
            href="/validator"
            icon={CheckCircle}
            title="Validate Favicon"
            description="Check if your website has proper favicon implementation."
            features={["URL validation", "Size checking", "Format analysis"]}
            isBeta={true}
          />
        </div>
      </section>
    </div>
  );
}
