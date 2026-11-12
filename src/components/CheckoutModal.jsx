import React, { useState } from 'react';
import { Calendar, MapPin, Check, Sparkles } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, onCompleteOrder }) {
  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState('');
  const [eventDate, setEventDate] = useState('This Saturday, 12:00 PM');

  if (!isOpen) return null;

  const handleFinish = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const generated = `IPH-AU-${Math.floor(10000 + Math.random() * 90000)}`;
    setOrderId(generated);
    onCompleteOrder();
    setStep(2);
  };

  const handleModalClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <>
      <div className="modal-backdrop active" onClick={handleModalClose} />
      <div className="center-modal active" role="dialog" aria-modal="true">
        <button
          type="button"
          className="modal-close-corner-btn"
          onClick={handleModalClose}
          aria-label="Close reservation modal"
        >
          ✕
        </button>
        <div className="checkout-modal-inner">
          
          {/* Streamlined 2-Step Progress Indicator */}
          <div className="checkout-steps-nav">
            <div className={`step-indicator ${step === 1 ? 'active' : ''}`}>
              <span className="step-num">1</span>
              <span>Event & Venue</span>
            </div>
            <div className={`step-indicator ${step === 2 ? 'active' : ''}`}>
              <span className="step-num">2</span>
              <span>Confirmation</span>
            </div>
          </div>

          {/* Step 1: Event & Delivery Details */}
          {step === 1 && (
            <form onSubmit={handleFinish} className="checkout-step-pane active">
              <div style={{ marginBottom: '16px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: '#D81B60',
                  marginBottom: '4px'
                }}>
                  <Sparkles size={12} />
                  <span>Reserve Equipment</span>
                </span>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.5rem',
                  lineHeight: 1.25,
                  margin: '4px 0 6px 0',
                  color: 'var(--color-primary)'
                }}>
                  Event Venue & Delivery Details
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  Delivering across Greater Brisbane, Moreton Bay, Logan, Gold Coast & Sunshine Coast.
                </p>
              </div>
              
              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label">Full Name / Event Host</label>
                  <input
                    type="text"
                    className="form-input"
                    defaultValue="Olivia Henderson"
                    required
                    placeholder="e.g. Olivia Henderson"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Australian Mobile Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    defaultValue="+61 412 345 678"
                    required
                    placeholder="04XX XXX XXX"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label">Event Date & Setup Time</label>
                  <input
                    type="text"
                    className="form-input"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                    placeholder="e.g. Saturday 12:00 PM"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Event Type</label>
                  <select className="form-input">
                    <option>Birthday Celebration (21st / 30th / 50th)</option>
                    <option>Wedding Reception / Ceremony</option>
                    <option>Engagement / Bridal High Tea</option>
                    <option>Baby Shower / Christening</option>
                    <option>Corporate Gala / Product Launch</option>
                    <option>Backyard & Garden Party</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Street Address & Venue Name</label>
                <input
                  type="text"
                  className="form-input"
                  defaultValue="Unit 14, 88 Macquarie Street"
                  required
                  placeholder="Venue address or street"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label">Suburb / City</label>
                  <input
                    type="text"
                    className="form-input"
                    defaultValue="New Farm, Brisbane"
                    required
                    placeholder="Suburb"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">State & Postcode</label>
                  <input
                    type="text"
                    className="form-input"
                    defaultValue="QLD 4005"
                    required
                    placeholder="QLD 4000"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  marginTop: '12px',
                  padding: '14px 20px',
                  fontSize: '0.95rem',
                  fontWeight: 700
                }}
              >
                Confirm Event Reservation
              </button>
            </form>
          )}

          {/* Step 2: Order Confirmed Screen */}
          {step === 2 && (
            <div className="checkout-step-pane active">
              <div className="order-success-screen" style={{ padding: '24px 8px' }}>
                <div className="order-success-icon" style={{
                  background: 'linear-gradient(135deg, #FFF0F5 0%, #FCE4EC 100%)',
                  borderColor: '#D81B60',
                  color: '#D81B60'
                }}>
                  <Check size={36} strokeWidth={2.6} />
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.85rem',
                  lineHeight: 1.25,
                  color: 'var(--color-primary)',
                  marginBottom: '10px'
                }}>
                  Celebration Hire Reserved
                </h2>
                <div className="order-id-badge" style={{
                  borderColor: 'rgba(216, 27, 96, 0.3)',
                  color: '#D81B60',
                  background: 'rgba(216, 27, 96, 0.05)'
                }}>
                  Booking reference: #{orderId}
                </div>
                <p style={{
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  color: 'var(--color-text-muted)',
                  maxWidth: '460px',
                  margin: '0 auto 24px auto'
                }}>
                  Your event equipment reservation has been placed. Our team will contact you directly to confirm event logistics, arrival times, and finalize your booking.
                </p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleModalClose}
                  style={{ minWidth: '220px', justifyContent: 'center' }}
                >
                  Return to Icon Party Hire
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
