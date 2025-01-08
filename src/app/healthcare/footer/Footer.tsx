import React from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
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
        {/* Brand Section */}
        <div className="brand-section">
          <div className="brand-logo">
            <div className="logo-circle">
              <span className="logo-text">M</span>
            </div>
            <span className="brand-name">Medilink</span>
          </div>
          <p className="footer-description">
            Medilink provides healthcare services like booking appointments, AI chatbot,
            finding doctors, and more, making healthcare accessible for everyone.
          </p>
          <p className="footer-rights">
            ©Medilink PTY LTD {new Date().getFullYear()}. All rights reserved
          </p>
        </div>

        {/* Menu Sections */}
        <div className="footer-links">
          {Object.entries(footerSections).map(([key, section]) => (
            <div className="footer-links-section" key={key}>
              <h3 className="section-title">{section.title}</h3>
              <ul className="section-items">
                {section.items.map((item) => (
                  <li key={item} className="section-item">
                    <a href="#">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links (Optional) */}
      <div className="footer-social">
        <a href="#" className="social-icon">
          <i className="bi bi-facebook"></i>
        </a>
        <a href="#" className="social-icon">
          <i className="bi bi-twitter"></i>
        </a>
        <a href="#" className="social-icon">
          <i className="bi bi-linkedin"></i>
        </a>
      </div>
    </footer>
  );
};


