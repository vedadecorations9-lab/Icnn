import React from 'react';

function StarRating({ count = 5 }) {
  return (
    <div className="review-stars" aria-label={`${count} out of 5 stars`}>
      {[...Array(count)].map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="star-icon" aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      ))}
    </div>
  );
}

export default function Reviews({ onOpenReviewModal }) {
  return (
    <section className="reviews-section" id="reviews-section">
      <div className="container">
        
        <div className="section-header-row">
          <div className="section-title-wrap">
            <span className="section-eyebrow">Client experiences</span>
            <h2 className="section-title">Loved by Brisbane event hosts</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', fontSize: '0.875rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="star-icon" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span style={{ fontWeight: 600 }}>5.0 rating across 340+ verified events</span>
            </div>
            <button
              className="btn-secondary"
              style={{ padding: '6px 16px', fontSize: '0.8125rem' }}
              onClick={onOpenReviewModal}
            >
              Write review
            </button>
          </div>
        </div>

        <div className="reviews-grid">
          
          {/* Review 1 */}
          <article className="review-card">
            <div className="review-author-row">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Sarah Jenkins" className="review-avatar" />
              <div>
                <div className="review-author-name">
                  <span>Sarah Jenkins</span>
                  <span className="verified-icon" title="Verified Hire Client">✓</span>
                </div>
                <div className="review-author-meta">New Farm, Brisbane QLD · 30th Birthday</div>
              </div>
            </div>
            <StarRating count={5} />
            <p className="review-quote">
              &ldquo;The 6x3m commercial gazebo and pastel pink ripple arches turned our backyard into a luxury venue. Even when sudden Brisbane rain hit, the marquee was 100% waterproof. On-time delivery and lovely team.&rdquo;
            </p>
            <span className="review-product-tag">Hired: Commercial Gazebo & Ripple Pink Arches</span>
          </article>

          {/* Review 2 */}
          <article className="review-card">
            <div className="review-author-row">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Marcus & Jessica Vance" className="review-avatar" />
              <div>
                <div className="review-author-name">
                  <span>Marcus & Jessica Vance</span>
                  <span className="verified-icon" title="Verified Hire Client">✓</span>
                </div>
                <div className="review-author-meta">Paddington, Brisbane QLD · Wedding</div>
              </div>
            </div>
            <StarRating count={5} />
            <p className="review-quote">
              &ldquo;The 3D silk flower wall was the absolute star of our reception photos, and the 'Dancing on Clouds' low fog machine made our first dance unforgettable. Booking with Icon was seamless from start to finish.&rdquo;
            </p>
            <span className="review-product-tag">Hired: 3D Silk Flower Wall & Low Fog Cloud FX</span>
          </article>

          {/* Review 3 */}
          <article className="review-card">
            <div className="review-author-row">
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80" alt="Liam O'Connor" className="review-avatar" />
              <div>
                <div className="review-author-name">
                  <span>Liam O'Connor</span>
                  <span className="verified-icon" title="Verified Hire Client">✓</span>
                </div>
                <div className="review-author-meta">Gold Coast QLD · Corporate Sunset Soiree</div>
              </div>
            </div>
            <StarRating count={5} />
            <p className="review-quote">
              &ldquo;Hired 8 silver cocktail dry-bar tables, chafing warmers, and the cold spark machines. Everything was spotless, commercial-grade, and arrived right on schedule with zero fuss. Our go-to party hire in QLD.&rdquo;
            </p>
            <span className="review-product-tag">Hired: Cocktail Tables, Chafing Dishes & Cold Sparks</span>
          </article>

        </div>

      </div>
    </section>
  );
}
