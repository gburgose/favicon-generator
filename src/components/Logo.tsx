import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'medium', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    small: 'logo--small',
    medium: 'logo--medium',
    large: 'logo--large'
  };

  return (
    <Link href="/" className={`logo ${sizeClasses[size]} ${className}`}>
      <Image
        src="/favicons/favicon-96x96.png"
        alt="Favicon Tools"
        width={24}
        height={24}
        className="logo__icon"
      />
      {showText && <span className="logo__text">Favicon Tools</span>}
    </Link>
  );
} 
