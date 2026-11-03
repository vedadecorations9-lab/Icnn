import React, { useState } from 'react';

export default function CheckoutModal({ isOpen, onClose, onCompleteOrder }) {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderId, setOrderId] = useState('');
  const [eventDate, setEventDate] = useState('This Saturday, 12:00 PM');

  if (!isOpen) return null;

  const handleFinish = () => {
    const generated = `IPH-AU-${Math.floor(10000 + Math.random() * 90000)}`;
    setOrderId(generated);
    onCompleteOrder();
    setStep(3);
  };

  return (
    <>
      <div className="modal-backdrop active" onClick={onClose} />
      <div className="center-modal active" role="dialog" aria-modal="true">
        <button className="modal-close-corner-btn" onClick={onClose}>✕</button>
        <div className="checkout-modal-inner">
          
          {/* Steps Nav */}
          <div className="checkout-steps-nav">
            <div className={`step-indicator ${step === 1 ? 'active' : ''}`}>
              <span className="step-num">1</span>
              <span>Event & Venue</span>
            </div>
            <div className={`step-indicator ${step === 2 ? 'active' : ''}`}>
              <span className="step-num">2</span>
              <span>Payment & Bond</span>
            </div>
            <div className={`step-indicator ${step === 3 ? 'active' : ''}`}>
              <span className="step-num">3</span>
              <span>Confirmation</span>
            </div>
          </div>

          {/* Step 1: Event & Delivery Details */}
          {step === 1 && (
            <div className="checkout-step-pane active">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '6px', color: 'var(--color-primary)' }}>Event Venue & Hire Delivery</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                Delivering across Greater Brisbane, Moreton Bay, Logan, Gold Coast & Sunshine Coast.
              </p>
              
              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label">Full Name / Event Host</label>
                  <input type="text" className="form-input" defaultValue="Olivia Henderson" required />
                </div>
                <div className="form-field">
                  <label className="form-label">Australian Mobile Number</label>
                  <input type="tel" className="form-input" defaultValue="+61 412 345 678" required />
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
                <input type="text" className="form-input" defaultValue="Unit 14, 88 Macquarie Street" required />
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label">Suburb / City</label>
                  <input type="text" className="form-input" defaultValue="New Farm, Brisbane" required />
                </div>
                <div className="form-field">
                  <label className="form-label">State & Postcode</label>
                  <input type="text" className="form-input" defaultValue="QLD 4005" required />
                </div>
              </div>

              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
                onClick={() => setStep(2)}
              >
                Continue to payment and bond
              </button>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <div className="checkout-step-pane active">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '16px', color: 'var(--color-primary)' }}>Select payment and bond method</h3>
              <div className="payment-method-options">
                <div
                  className={`payment-method-card ${paymentMethod === 'card' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="payment-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                      <line x1="2" y1="10" x2="22" y2="10"></line>
                    </svg>
                  </div>
                  <div className="payment-title">Credit or debit card</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>Stripe AU (instant bond hold)</div>
                </div>
                <div
                  className={`payment-method-card ${paymentMethod === 'direct' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('direct')}
                >
                  <div className="payment-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="3" y1="21" x2="21" y2="21"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                      <polyline points="5 10 12 3 19 10"></polyline>
                      <line x1="6" y1="21" x2="6" y2="10"></line>
                      <line x1="10" y1="21" x2="10" y2="10"></line>
                      <line x1="14" y1="21" x2="14" y2="10"></line>
                      <line x1="18" y1="21" x2="18" y2="10"></line>
                    </svg>
                  </div>
                  <div className="payment-title">Direct bank transfer</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>NAB Brisbane account</div>
                </div>
                <div
                  className={`payment-method-card ${paymentMethod === 'afterpay' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('afterpay')}
                >
                  <div className="payment-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                    </svg>
                  </div>
                  <div className="payment-title">Afterpay or Zip</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>Pay in 4 interest-free</div>
                </div>
              </div>

              <div style={{ background: 'var(--color-bg-surface-soft)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '0.8125rem' }}>
                <strong>Refundable security bond terms:</strong> The security bond is pre-authorized on your card and automatically released within 24–48 hours following equipment return in good order.
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(1)}>Back</button>
                <button
                  className="btn-primary"
                  style={{ flex: 2, justifyContent: 'center' }}
                  onClick={handleFinish}
                >
                  Confirm event booking
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Order Confirmed Screen */}
          {step === 3 && (
            <div className="checkout-step-pane active">
              <div className="order-success-screen">
                <div className="order-success-icon">✓</div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-primary)' }}>Celebration hire confirmed</h2>
                <div className="order-id-badge">Booking reference: #{orderId}</div>
                <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 auto 24px auto' }}>
                  Your event equipment has been reserved at our Brisbane warehouse. Our logistics dispatch team will call you 24 hours prior to confirm the exact delivery and setup arrival window.
                </p>
                <button className="btn-primary" onClick={onClose}>Return to Icon Party Hire</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
