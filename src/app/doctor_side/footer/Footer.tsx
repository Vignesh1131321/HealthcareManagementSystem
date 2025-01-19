import React from 'react';
import './Footer.css';

export const Footer = () => {
  const footerSections = {
    company: {
      title: 'Company',
      items: ['About', 'Testimonials', 'Find a doctor', 'Apps'],
    },
    region: {
      title: 'Region',
      items: ['Indonesia', 'Singapore', 'Hongkong', 'Canada'],
    },
    help: {
      title: 'Help',
      items: ['Help center', 'Contact support', 'Instructions', 'How it works'],
    },
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="brand-section">
            <div className="brand-logo">
              <div className="logo-circle">
                <span>M</span>
              </div>
              <span className="brand-name">Medilink</span>
            </div>
            <p className="brand-description">
              Medilink provides healthcare services like booking appointments, AI chatbot,
              finding doctors, and more, making healthcare accessible for everyone.
            </p>
            <p className="copyright">
              ©Medilink PTY LTD {new Date().getFullYear()}. All rights reserved
            </p>
          </div>

          {/* Menu Sections */}
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key} className="footer-section">
              <h3 className="section-title">{section.title}</h3>
              <ul className="section-list">
                {section.items.map((item) => (
                  <li key={item}>
                    <a href="#" className="section-link">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="social-section">
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">
              <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.397-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

