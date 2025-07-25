import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface CardHomeProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  isBeta?: boolean;
}

export default function CardHome({
  href,
  icon: Icon,
  title,
  description,
  features,
  isBeta = false
}: CardHomeProps) {
  return (
    <Link href={href} className="card-home">
      {isBeta && <div className="card-home__beta">BETA</div>}
      <div className="card-home__icon">
        <Icon size={40} />
      </div>
      <h3 className="card-home__title">{title}</h3>
      <p className="card-home__description">{description}</p>
      <div className="card-home__features">
        {features.map((feature, index) => (
          <span key={index}>{feature}</span>
        ))}
      </div>
    </Link>
  );
} 
