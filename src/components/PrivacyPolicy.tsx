"use client";

import Link from 'next/link';
import { ArrowLeft, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function PrivacyPolicy() {
  const [openSection, setOpenSection] = useState<number>(0);

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? -1 : index);
  };

  const sections = [
    {
      title: "1. Information We Collect",
      content: (
        <>
          <p className="privacy-policy__text">
            We collect information you provide directly to us when using our Favicon Generator service:
          </p>
          <ul className="privacy-policy__list">
            <li className="privacy-policy__list-item"><strong>Uploaded Images:</strong> Images you upload for favicon generation are processed locally in your browser and are not stored on our servers.</li>
            <li className="privacy-policy__list-item"><strong>App Settings:</strong> Information you enter such as app name, description, and theme color for favicon generation.</li>
            <li className="privacy-policy__list-item"><strong>Usage Data:</strong> Anonymous analytics data to improve our service performance and user experience.</li>
          </ul>
        </>
      )
    },
    {
      title: "2. How We Use Your Information",
      content: (
        <>
          <p className="privacy-policy__text">We use the collected information to:</p>
          <ul className="privacy-policy__list">
            <li className="privacy-policy__list-item">Generate favicons based on your uploaded images and settings</li>
            <li className="privacy-policy__list-item">Provide and maintain our favicon generation service</li>
            <li className="privacy-policy__list-item">Improve our service functionality and user experience</li>
            <li className="privacy-policy__list-item">Analyze usage patterns to enhance our service</li>
            <li className="privacy-policy__list-item">Ensure compliance with legal obligations</li>
          </ul>
        </>
      )
    },
    {
      title: "3. Cookies and Tracking Technologies",
      content: (
        <>
          <p className="privacy-policy__text">
            We use cookies and similar tracking technologies to enhance your experience:
          </p>
          <ul className="privacy-policy__list">
            <li className="privacy-policy__list-item"><strong>Essential Cookies:</strong> Required for basic site functionality</li>
            <li className="privacy-policy__list-item"><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our service</li>
            <li className="privacy-policy__list-item"><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
          </ul>
        </>
      )
    },
    {
      title: "4. Data Security",
      content: (
        <>
          <p className="privacy-policy__text">
            We implement appropriate security measures to protect your information:
          </p>
          <ul className="privacy-policy__list">
            <li className="privacy-policy__list-item">All image processing is done locally in your browser</li>
            <li className="privacy-policy__list-item">No uploaded images are stored on our servers</li>
            <li className="privacy-policy__list-item">Secure HTTPS connections for all data transmission</li>
            <li className="privacy-policy__list-item">Regular security assessments and updates</li>
          </ul>
        </>
      )
    },
    {
      title: "5. Third-Party Services",
      content: (
        <>
          <p className="privacy-policy__text">We may use third-party services for:</p>
          <ul className="privacy-policy__list">
            <li className="privacy-policy__list-item"><strong>Google Analytics:</strong> To analyze website usage and improve our service</li>
            <li className="privacy-policy__list-item"><strong>Google Tag Manager:</strong> To manage tracking and analytics tags</li>
            <li className="privacy-policy__list-item"><strong>Vercel:</strong> For hosting and deployment services</li>
          </ul>
          <p className="privacy-policy__text">
            These services have their own privacy policies, and we encourage you to review them.
          </p>
        </>
      )
    },
    {
      title: "6. Data Retention",
      content: (
        <>
          <p className="privacy-policy__text">
            <strong>No Personal Data Storage:</strong> We do not store your uploaded images or personal information on our servers.
          </p>
          <p className="privacy-policy__text">
            <strong>Analytics Data:</strong> Anonymous usage analytics are retained for service improvement purposes.
          </p>
          <p className="privacy-policy__text">
            <strong>Cookie Preferences:</strong> Your cookie consent preferences are stored locally in your browser.
          </p>
        </>
      )
    },
    {
      title: "7. Your Rights",
      content: (
        <>
          <p className="privacy-policy__text">You have the right to:</p>
          <ul className="privacy-policy__list">
            <li className="privacy-policy__list-item">Access any personal information we may hold about you</li>
            <li className="privacy-policy__list-item">Request correction of inaccurate information</li>
            <li className="privacy-policy__list-item">Request deletion of your personal information</li>
            <li className="privacy-policy__list-item">Withdraw consent for data processing</li>
            <li className="privacy-policy__list-item">Object to processing of your personal information</li>
          </ul>
        </>
      )
    },
    {
      title: "8. Children's Privacy",
      content: (
        <p className="privacy-policy__text">
          Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
        </p>
      )
    },
    {
      title: "9. Changes to This Policy",
      content: (
        <p className="privacy-policy__text">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
        </p>
      )
    },
    {
      title: "10. Contact Us",
      content: (
        <>
          <p className="privacy-policy__text">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="privacy-policy__contact-item"><strong>Email:</strong> privacy@favicon-generator.com</p>
          <p className="privacy-policy__contact-item"><strong>Website:</strong> <Link href="/" className="privacy-policy__contact-link">favicon-generator.com</Link></p>
        </>
      )
    }
  ];

  return (
    <div className="privacy-policy">
      <div className="privacy-policy__header">
        <Link href="/" className="privacy-policy__back-link">
          <ArrowLeft size={20} />
          Back to Favicon Generator
        </Link>
        <h1 className="privacy-policy__title">
          <Shield size={32} />
          Privacy Policy
        </h1>
        <p className="privacy-policy__subtitle">
          Last updated: {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      <div className="privacy-policy__content">
        {sections.map((section, index) => (
          <div key={index} className="privacy-policy__accordion-item">
            <button
              className="privacy-policy__accordion-header"
              onMouseEnter={(e) => e.currentTarget.classList.add('privacy-policy__accordion-header--hover')}
              onMouseLeave={(e) => e.currentTarget.classList.remove('privacy-policy__accordion-header--hover')}
              onClick={() => toggleSection(index)}
            >
              <div className="privacy-policy__accordion-title">
                {section.title}
              </div>
              {openSection === index ? (
                <ChevronUp size={20} color="#EFE6DD" />
              ) : (
                <ChevronDown size={20} color="#EFE6DD" />
              )}
            </button>
            <div
              className={`privacy-policy__accordion-content ${openSection === index ? 'privacy-policy__accordion-content--open' : ''}`}
            >
              {section.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
