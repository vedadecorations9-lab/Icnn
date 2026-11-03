import React, { useState } from 'react';

export default function ReviewModal({ isOpen, onClose, onToast }) {
  const [stars, setStars] = useState(5);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onToast('Thank you! Your event hire review has been submitted.', 'success');
    onClose();
  };

  return (
    <>
      <div className="modal-backdrop active" onClick={onClose} />
      <div className="center-modal active" role="dialog" aria-modal="true">
        <button className="modal-close-corner-btn" onClick={onClose} aria-label="Close modal">✕</button>
        <div style={{ padding: '36px' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '6px', color: 'var(--color-primary)' }}>Share your event hire experience</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '20px' }}>Help Brisbane event hosts and brides discover pristine celebration rentals.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="form-label">Your rating</label>
              <div className="star-rating-picker" id="star-picker">
                {[1, 2, 3, 4, 5].map(num => (
                  <span
                    key={num}
                    className={num <= stars ? 'active' : ''}
                    onClick={() => setStars(num)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${num} star`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-field">
                <label className="form-label">Your name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label">Event suburb or city</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. New Farm, Brisbane QLD"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Equipment hired</label>
              <select className="form-input" style={{ cursor: 'pointer' }}>
                <option>Icon 6x3m Commercial Pop-Up Gazebo</option>
                <option>Luxe 3D Silk Flower Wall (2.4m × 2.4m)</option>
                <option>Modern Pastel Pink Ripple Arch Trio</option>
                <option>Sky Blue Ripple Wave Arch Backdrop</option>
                <option>Foldable Silver Cocktail Bar Tables</option>
                <option>White Tiffany Event Chairs & Cushions</option>
                <option>Architectural Fluted Cylinder Plinths</option>
                <option>Indoor/Outdoor Cold Spark Pyrotechnic Pair</option>
                <option>Low Fog "Dancing on Clouds" Machine</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Your event feedback</label>
              <textarea
                className="form-input"
                rows="3"
                placeholder="Tell us about the delivery, setup, and equipment condition during your celebration..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}>Submit review</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
