import React from 'react';
import { BRISBANE_STORE_INFO } from '../data/products';
import { MapPin, Phone } from 'lucide-react';

export default function Footer({ onSelectCategory }) {
  return (
    <footer className="compact-clean-footer" id="event-contact" aria-label="Icon Party Hire Brisbane Footer">
      <div className="container">
        
        {/* Main Clean Editorial Bar */}
        <div className="clean-footer-main">
          
          {/* Brand & Mission */}
          <div className="clean-footer-brand">
            <div className="clean-brand-lockup">
              <img src="/assets/images/icon_logo.png" alt="Icon Party Hire Logo" className="clean-brand-logo" />
              <div className="clean-brand-text">
                <span className="clean-brand-wordmark">ICON</span>
                <span className="clean-brand-sub">Party Hire - Brisbane</span>
              </div>
            </div>
            <p className="clean-brand-desc">
              Brisbane's premier party hire equipment company. Commercial gazebos, statement flower walls, ripple backdrops, plinths & special effects.
            </p>
          </div>

          {/* Essential Quick Links */}
          <div className="clean-footer-nav">
            <span className="clean-footer-heading">Services</span>
            <div className="clean-footer-links-row">
              <a href="#home" onClick={(e) => { e.preventDefault(); onSelectCategory?.('all'); }}>Hiring</a>
              <a href="#home" onClick={(e) => { e.preventDefault(); onSelectCategory?.('backdrops'); }}>Decorations</a>
              <a href="#home" onClick={(e) => { e.preventDefault(); onSelectCategory?.('balloons'); }}>Balloons</a>
            </div>
          </div>

          {/* Direct Brisbane Contact */}
          <div className="clean-footer-contact">
            <span className="clean-footer-heading">Location</span>
            <div className="clean-contact-capsule">
              <div className="clean-contact-item">
                <MapPin size={13} className="clean-contact-icon" />
                <span>{BRISBANE_STORE_INFO.address}, Brisbane 4503</span>
              </div>
              <div className="clean-contact-item">
                <Phone size={13} className="clean-contact-icon" />
                <a href="tel:0439592472" className="clean-contact-tel">{BRISBANE_STORE_INFO.phone}</a>
              </div>
            </div>
          </div>

        </div>

        {/* Minimal Bottom Bar */}
        <div className="clean-footer-bottom">
          <div className="clean-copyright">
            © 2026 Icon Party Hire · Murrumba Downs, Brisbane QLD
          </div>
        </div>

      </div>
    </footer>
  );
}
