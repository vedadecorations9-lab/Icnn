import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function TrackOrderModal({ isOpen, onClose, onToast, bookings = [] }) {
  const [orderInput, setOrderInput] = useState('IPH-AU-40912');
  const [showResult, setShowResult] = useState(true);

  if (!isOpen) return null;

  const matchedBooking = bookings.find(
    (b) =>
      b.id?.toLowerCase() === orderInput.trim().toLowerCase() ||
      b.tracking?.toLowerCase() === orderInput.trim().toLowerCase()
  );

  const isRejected =
    (matchedBooking?.status || '').toLowerCase() === 'rejected' ||
    (() => {
      try {
        const notices = JSON.parse(localStorage.getItem('icon_rejected_order_notices') || '[]');
        return notices.some((n) => n.id?.toLowerCase() === orderInput.trim().toLowerCase());
      } catch {
        return false;
      }
    })();

  const handleTrack = () => {
    setShowResult(true);
    if (isRejected) {
      onToast?.(`Order ${orderInput} was rejected by the Owner`, 'warning');
    } else {
      onToast?.(`Displaying dispatch updates for ${orderInput}`, 'gold');
    }
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
              placeholder="Enter booking reference (e.g. IPH-AU-40912)"
            />
            <button className="btn-primary" onClick={handleTrack}>Track delivery</button>
          </div>

          {showResult && (
            isRejected ? (
              <div
                style={{
                  background: '#FEF2F2',
                  border: '1.5px solid #FECACA',
                  borderRadius: '16px',
                  padding: '22px 20px',
                  color: '#991B1B',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px'
                }}
              >
                <AlertTriangle size={24} style={{ color: '#DC2626', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', fontWeight: 800, color: '#991B1B' }}>
                    Order Rejected by the Owner
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.55, color: '#7F1D1D' }}>
                    Your booking reference <strong>#{orderInput.trim()}</strong> was rejected and cancelled by the Owner. Any held security bond or authorization will be automatically released. Please contact <strong>info@iconpartyhire.com.au</strong> or WhatsApp <strong>0439 592 472</strong> for assistance.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ background: 'var(--color-bg-surface-soft)', padding: '14px 18px', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', marginBottom: '16px' }}>
                  <strong>Dispatch:</strong> {matchedBooking ? matchedBooking.items.join(', ') : 'Commercial 6x3m gazebo, ripple arches, cocktail tables'} · <strong>Carrier:</strong> {matchedBooking?.carrier || 'Icon Van 1 (Brisbane setup crew)'}
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
                    <div className="timeline-title">Status: {matchedBooking?.status || 'Confirmed & Scheduled for Delivery'}</div>
                    <div className="timeline-time">Destination: {matchedBooking?.city || 'Greater Brisbane Venue'}</div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}
