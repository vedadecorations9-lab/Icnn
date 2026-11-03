import React from 'react';
import { CURRENCIES, BRISBANE_STORE_INFO } from '../data/products';
import { MapPin, Phone, ShieldCheck } from 'lucide-react';

export default function Footer({ currency, setCurrency, onSelectCategory, onOpenTrackOrder }) {
  const toggleCurrency = () => {
    const next = currency === 'AUD' ? 'USD' : currency === 'USD' ? 'NZD' : 'AUD';
    setCurrency(next);
  };

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
                <span className="clean-brand-sub">Party & Event Hire · Brisbane</span>
              </div>
            </div>
            <p className="clean-brand-desc">
              Brisbane's premier party hire equipment company. Commercial gazebos, statement flower walls, ripple backdrops, plinths & special effects.
            </p>
          </div>

          {/* Essential Quick Links */}
          <div className="clean-footer-nav">
            <span className="clean-footer-heading">Hire Services</span>
            <div className="clean-footer-links-row">
              <a href="#home" onClick={() => onSelectCategory('all')}>All 18 Hire Items</a>
              <a href="#home" onClick={() => onSelectCategory('marquees')}>Gazebos & Marquees</a>
              <a href="#home" onClick={() => onSelectCategory('backdrops')}>Flower Walls & Arches</a>
              <a href="#home" onClick={() => onSelectCategory('effects')}>Cold Sparks & Fog</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#track" onClick={(e) => { e.preventDefault(); onOpenTrackOrder(); }}>Track Delivery</a>
            </div>
          </div>

          {/* Direct Brisbane Contact */}
          <div className="clean-footer-contact">
            <span className="clean-footer-heading">Brisbane Studio</span>
            <div className="clean-contact-capsule">
              <div className="clean-contact-item">
                <MapPin size={13} className="clean-contact-icon" />
                <span>{BRISBANE_STORE_INFO.address}, Brisbane 4503</span>
              </div>
              <div className="clean-contact-item">
                <Phone size={13} className="clean-contact-icon" />
                <a href="tel:0439592472" className="clean-contact-tel">{BRISBANE_STORE_INFO.phone}</a>
              </div>
              <div className="clean-contact-item">
                <ShieldCheck size={13} className="clean-contact-icon" />
                <span>100% Insured & Test-Tagged</span>
              </div>
            </div>
          </div>

        </div>

        {/* Minimal Bottom Bar */}
        <div className="clean-footer-bottom">
          <div className="clean-copyright">
            © 2026 Icon Party Hire Pty Ltd · ABN {BRISBANE_STORE_INFO.abn} · Murrumba Downs, Brisbane QLD
          </div>

          <div
            className="clean-currency-pill"
            onClick={toggleCurrency}
            role="button"
            tabIndex={0}
            title="Toggle Currency"
          >
            <span>{CURRENCIES[currency]?.flag} {CURRENCIES[currency]?.code} ({CURRENCIES[currency]?.symbol})</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
