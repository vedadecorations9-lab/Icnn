import React, { useState } from 'react';

export default function Newsletter({ onToast }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      onToast(`Thank you! Your $25 AUD celebration voucher has been sent to ${email}`, 'success');
      setEmail('');
    }
  };

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-card">
          
          <div className="newsletter-left">
            <div className="newsletter-icon-wrap" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <div>
              <h3 className="newsletter-title">Join the Icon Party VIP circle</h3>
              <p className="newsletter-desc">
                Receive curated event styling guides, early access to new backdrops, and a $25 AUD discount code toward your first Brisbane event booking.
              </p>
            </div>
          </div>

          <div className="newsletter-form-wrap">
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <input
                type="email"
                className="newsletter-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
              />
              <button type="submit" className="newsletter-btn">Claim $25 voucher</button>
            </form>
            <div className="newsletter-privacy">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>We respect your event privacy. No spam, unsubscribe anytime.</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
