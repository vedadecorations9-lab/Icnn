import React, { useState } from 'react';

export default function TrackOrderModal({ isOpen, onClose, onToast }) {
  const [orderInput, setOrderInput] = useState('IPH-DEL-88912');
  const [showResult, setShowResult] = useState(true);

  if (!isOpen) return null;

  const handleTrack = () => {
    setShowResult(true);
    onToast(`Displaying dispatch updates for ${orderInput}`, 'gold');
  };

  return (
    <>
      <div className="modal-backdrop active" onClick={onClose} />
      <div className="center-modal active" role="dialog" aria-modal="true">
        <button className="modal-close-corner-btn" onClick={onClose}>✕</button>
        <div style={{ padding: '36px' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '8px', color: 'var(--color-primary)' }}>Track Event Hire Delivery</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '20px' }}>Enter your Booking ID (e.g. IPH-AU-40912) or Delivery Reference.</p>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
            <input
              type="text"
              className="form-input"
              style={{ flex: 1 }}
              value={orderInput}
              onChange={(e) => setOrderInput(e.target.value)}
              placeholder="Enter booking reference (e.g. ICON-8492)"
            />
            <button className="btn-primary" onClick={handleTrack}>Track delivery</button>
          </div>

          {showResult && (
            <div>
              <div style={{ background: 'var(--color-bg-surface-soft)', padding: '14px 18px', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', marginBottom: '16px' }}>
                <strong>Dispatch:</strong> Commercial 6x3m gazebo, ripple arches, cocktail tables · <strong>Carrier:</strong> Icon Van 1 (Brisbane setup crew)
              </div>

              <div className="tracking-timeline">
                <div className="timeline-step completed">
                  <div className="timeline-dot">✓</div>
                  <div className="timeline-title">Equipment sanitized and electrical safety tested</div>
                  <div className="timeline-time">Murrumba Downs warehouse hub · Yesterday, 3:30 pm</div>
                </div>
                <div className="timeline-step completed">
                  <div className="timeline-dot">✓</div>
                  <div className="timeline-title">Loaded and secured on Icon Mercedes Sprinter</div>
                  <div className="timeline-time">Icon logistics hub · Today, 7:15 am AEST</div>
                </div>
                <div className="timeline-step current">
                  <div className="timeline-dot">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                  </div>
                  <div className="timeline-title">Out for delivery · in transit to New Farm venue</div>
                  <div className="timeline-time">Driver: Dylan (Crew Lead) · On route</div>
                </div>
                <div className="timeline-step">
                  <div className="timeline-dot">○</div>
                  <div className="timeline-title">Venue setup and weighted anchor handover</div>
                  <div className="timeline-time">Estimated window: 10:30 am – 11:15 am AEST</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
