import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Database, Cookie, Users } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="container">
      <div className="privacy-page">
        <div className="privacy-header">
          <Link href="/" className="back-link">
            <ArrowLeft size={20} />
            Back to Favicon Generator
          </Link>
          <h1 className="privacy-title">
            <Shield size={32} />
            Privacy Policy
          </h1>
          <p className="privacy-subtitle">
            Last updated: {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div className="privacy-content">
          <section className="privacy-section">
            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when using our Favicon Generator service:
            </p>
            <ul>
              <li><strong>Uploaded Images:</strong> Images you upload for favicon generation are processed locally in your browser and are not stored on our servers.</li>
              <li><strong>App Settings:</strong> Information you enter such as app name, description, and theme color for favicon generation.</li>
              <li><strong>Usage Data:</strong> Anonymous analytics data to improve our service performance and user experience.</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul>
              <li>Generate favicons based on your uploaded images and settings</li>
              <li>Provide and maintain our favicon generation service</li>
              <li>Improve our service functionality and user experience</li>
              <li>Analyze usage patterns to enhance our service</li>
              <li>Ensure compliance with legal obligations</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>3. Cookies and Tracking Technologies</h2>
            <div className="cookie-info">
              <Cookie size={20} />
              <div>
                <p>
                  We use cookies and similar tracking technologies to enhance your experience:
                </p>
                <ul>
                  <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our service</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="privacy-section">
            <h2>4. Data Security</h2>
            <div className="security-info">
              <Eye size={20} />
              <div>
                <p>
                  We implement appropriate security measures to protect your information:
                </p>
                <ul>
                  <li>All image processing is done locally in your browser</li>
                  <li>No uploaded images are stored on our servers</li>
                  <li>Secure HTTPS connections for all data transmission</li>
                  <li>Regular security assessments and updates</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="privacy-section">
            <h2>5. Third-Party Services</h2>
            <p>We may use third-party services for:</p>
            <ul>
              <li><strong>Google Analytics:</strong> To analyze website usage and improve our service</li>
              <li><strong>Google Tag Manager:</strong> To manage tracking and analytics tags</li>
              <li><strong>Vercel:</strong> For hosting and deployment services</li>
            </ul>
            <p>
              These services have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          <section className="privacy-section">
            <h2>6. Data Retention</h2>
            <div className="retention-info">
              <Database size={20} />
              <div>
                <p>
                  <strong>No Personal Data Storage:</strong> We do not store your uploaded images or personal information on our servers.
                </p>
                <p>
                  <strong>Analytics Data:</strong> Anonymous usage analytics are retained for service improvement purposes.
                </p>
                <p>
                  <strong>Cookie Preferences:</strong> Your cookie consent preferences are stored locally in your browser.
                </p>
              </div>
            </div>
          </section>

          <section className="privacy-section">
            <h2>7. Your Rights</h2>
            <div className="rights-info">
              <Users size={20} />
              <div>
                <p>You have the right to:</p>
                <ul>
                  <li>Access any personal information we may hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Withdraw consent for data processing</li>
                  <li>Object to processing of your personal information</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="privacy-section">
            <h2>8. Children's Privacy</h2>
            <p>
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section className="privacy-section">
            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="privacy-section">
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> privacy@favicon-generator.com</p>
              <p><strong>Website:</strong> <a href="/" className="contact-link">favicon-generator.com</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 
