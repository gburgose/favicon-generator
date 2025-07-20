import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container">
      <div className="not-found">
        <div className="not-found-icon">
          <AlertTriangle size={80} />
        </div>
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-description">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-primary">
          Go Back Home
        </Link>
      </div>
    </div>
  );
} 
