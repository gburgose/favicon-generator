"use client";

import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Database, Cookie, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function PrivacyPolicy() {
  const [openSections, setOpenSections] = useState<number[]>([0]);

  const toggleSection = (index: number) => {
    setOpenSections(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const sections = [
    {
      title: "1. Information We Collect",
      content: (
        <>
          <p style={{ marginBottom: '1rem', color: '#EFE6DD' }}>
            We collect information you provide directly to us when using our Favicon Generator service:
          </p>
          <ul style={{ margin: '1rem 0', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.75rem', color: '#EFE6DD' }}><strong>Uploaded Images:</strong> Images you upload for favicon generation are processed locally in your browser and are not stored on our servers.</li>
            <li style={{ marginBottom: '0.75rem', color: '#EFE6DD' }}><strong>App Settings:</strong> Information you enter such as app name, description, and theme color for favicon generation.</li>
            <li style={{ marginBottom: '0.75rem', color: '#EFE6DD' }}><strong>Usage Data:</strong> Anonymous analytics data to improve our service performance and user experience.</li>
          </ul>
        </>
      )
    },
    {
      title: "2. How We Use Your Information",
      content: (
        <>
          <p style={{ marginBottom: '1rem', color: '#EFE6DD' }}>We use the collected information to:</p>
          <ul style={{ margin: '1rem 0', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.75rem', color: '#EFE6DD' }}>Generate favicons based on your uploaded images and settings</li>
            <li style={{ marginBottom: '0.75rem', color: '#EFE6DD' }}>Provide and maintain our favicon generation service</li>
            <li style={{ marginBottom: '0.75rem', color: '#EFE6DD' }}>Improve our service functionality and user experience</li>
            <li style={{ marginBottom: '0.75rem', color: '#EFE6DD' }}>Analyze usage patterns to enhance our service</li>
            <li style={{ marginBottom: '0.75rem', color: '#EFE6DD' }}>Ensure compliance with legal obligations</li>
          </ul>
        </>
      )
    },
    {
      title: "3. Cookies and Tracking Technologies",
      content: (
        <>
          <p style={{ marginBottom: '1rem', color: '#EFE6DD' }}>
            We use cookies and similar tracking technologies to enhance your experience:
          </p>
          <ul style={{ margin: '1rem 0', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.75rem', color: '#EFE6DD' }}><strong>Essential Cookies:</strong> Required for basic site functionality</li>
            <li style={{ marginBottom: '0.75rem', color: '#EFE6DD' }}><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our service</li>
            <li style={{ marginBottom: '0.75rem', color: '#EFE6DD' }}><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
          </ul>
        </>
      )
    },
    {
      title: "4. Data Security",
      content: (
        <>
          <p style={{ marginBottom: '1rem', color: '#EFE6DD' }}>
            We implement appropriate security measures to protect your information:
          </p>
          <ul style={{ margin: '1rem 0', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.75rem', color: '#EFE6DD' }}>All image processing is done locally in your browser</li>
            <li style={{ marginBottom: '0.75rem', color: '#EFE6DD' }}>No uploaded images are stored on our servers</li>
            <li style={{ marginBottom: '0.75rem', color: '#EFE6DD' }}>Secure HTTPS connections for all data transmission</li>
            <li style={{ marginBottom: '0.75rem', color: '#EFE6DD' }}>Regular security assessments and updates</li>
          </ul>
        </>
      )
    },
    {
      title: "5. Third-Party Services",
      content: (
        <>
          <p style={{ marginBottom: '1rem', color: '#EFE6DD' }}>We may use third-party services for:</p>
          <ul style={{ margin: '1rem 0', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.75rem', color: '#EFE6DD' }}><strong>Google Analytics:</strong> To analyze website usage and improve our service</li>
            <li style={{ marginBottom: '0.75rem', color: '#EFE6DD' }}><strong>Google Tag Manager:</strong> To manage tracking and analytics tags</li>
            <li style={{ marginBottom: '0.75rem', color: '#EFE6DD' }}><strong>Vercel:</strong> For hosting and deployment services</li>
          </ul>
          <p style={{ marginBottom: '1rem', color: '#EFE6DD' }}>
            These services have their own privacy policies, and we encourage you to review them.
          </p>
        </>
      )
    },
    {
      title: "6. Data Retention",
      content: (
        <>
          <p style={{ marginBottom: '1rem', color: '#EFE6DD' }}>
            <strong>No Personal Data Storage:</strong> We do not store your uploaded images or personal information on our servers.
          </p>
          <p style={{ marginBottom: '1rem', color: '#EFE6DD' }}>
            <strong>Analytics Data:</strong> Anonymous usage analytics are retained for service improvement purposes.
          </p>
          <p style={{ marginBottom: '1rem', color: '#EFE6DD' }}>
            <strong>Cookie Preferences:</strong> Your cookie consent preferences are stored locally in your browser.
          </p>
        </>
      )
    },
    {
      title: "7. Your Rights",
      content: (
        <>
          <p style={{ marginBottom: '1rem', color: '#EFE6DD' }}>You have the right to:</p>
          <ul style={{ margin: '1rem 0', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.75rem', color: '#EFE6DD' }}>Access any personal information we may hold about you</li>
            <li style={{ marginBottom: '0.75rem', color: '#EFE6DD' }}>Request correction of inaccurate information</li>
            <li style={{ marginBottom: '0.75rem', color: '#EFE6DD' }}>Request deletion of your personal information</li>
            <li style={{ marginBottom: '0.75rem', color: '#EFE6DD' }}>Withdraw consent for data processing</li>
            <li style={{ marginBottom: '0.75rem', color: '#EFE6DD' }}>Object to processing of your personal information</li>
          </ul>
        </>
      )
    },
    {
      title: "8. Children's Privacy",
      content: (
        <p style={{ marginBottom: '1rem', color: '#EFE6DD' }}>
          Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
        </p>
      )
    },
    {
      title: "9. Changes to This Policy",
      content: (
        <p style={{ marginBottom: '1rem', color: '#EFE6DD' }}>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
        </p>
      )
    },
    {
      title: "10. Contact Us",
      content: (
        <>
          <p style={{ marginBottom: '1rem', color: '#EFE6DD' }}>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p style={{ marginBottom: '0.5rem', color: '#EFE6DD' }}><strong>Email:</strong> privacy@favicon-generator.com</p>
          <p style={{ marginBottom: '0.5rem', color: '#EFE6DD' }}><strong>Website:</strong> <Link href="/" style={{ color: '#F3DFA2', textDecoration: 'none', fontWeight: 500 }}>favicon-generator.com</Link></p>
        </>
      )
    }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', lineHeight: 1.6, color: '#EFE6DD' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #404040' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#7EBDC2', textDecoration: 'none', fontWeight: 500, marginBottom: '1.5rem' }}>
          <ArrowLeft size={20} />
          Back to Favicon Generator
        </Link>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', color: '#EFE6DD' }}>
          <Shield size={32} />
          Privacy Policy
        </h1>
        <p style={{ color: '#CCCCCC', fontSize: '1rem', margin: 0 }}>
          Last updated: {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, background: '#2d2d2d', border: '1px solid #404040', borderRadius: '8px', overflow: 'hidden' }}>
        {sections.map((section, index) => (
          <div key={index} style={{ borderBottom: index === sections.length - 1 ? 'none' : '1px solid #404040' }}>
            <button
              style={{
                width: '100%',
                background: '#2d2d2d',
                border: 'none',
                padding: '1.5rem 2rem',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#252525'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#2d2d2d'}
              onClick={() => toggleSection(index)}
            >
              <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#EFE6DD' }}>
                {section.title}
              </div>
              {openSections.includes(index) ? (
                <ChevronUp size={20} style={{ color: '#EFE6DD' }} />
              ) : (
                <ChevronDown size={20} style={{ color: '#EFE6DD' }} />
              )}
            </button>
            <div
              style={{
                background: '#1e1e1e',
                maxHeight: openSections.includes(index) ? '2000px' : '0',
                overflow: 'hidden',
                transition: 'all 0.3s ease-out',
                padding: openSections.includes(index) ? '2rem' : '0 2rem',
                opacity: openSections.includes(index) ? 1 : 0
              }}
            >
              {section.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
