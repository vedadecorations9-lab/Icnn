import React from 'react';

export default function TrustStrip() {
  return (
    <section className="service-trust-section">
      <div className="container">
        <div className="service-grid">
          
          <div className="service-card">
            <div className="service-icon-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </div>
            <div>
              <h4 className="service-title">Brisbane event delivery and setup</h4>
              <p className="service-sub">Dispatched across Greater Brisbane and Gold Coast</p>
            </div>
          </div>

          <div className="service-card">
            <div className="service-icon-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
            </div>
            <div>
              <h4 className="service-title">Flexible 3-day weekend hire</h4>
              <p className="service-sub">Pick up Friday, return Monday at a single weekend rate</p>
            </div>
          </div>

          <div className="service-card">
            <div className="service-icon-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <div>
              <h4 className="service-title">Instant bond protection</h4>
              <p className="service-sub">Automated bond release within 24–48 hours post-inspection</p>
            </div>
          </div>

          <div className="service-card">
            <div className="service-icon-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <div>
              <h4 className="service-title">Sanitized and commercial grade</h4>
              <p className="service-sub">Commercial gear steam-sanitized and electrically tagged</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
