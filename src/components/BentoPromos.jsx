import React from 'react';

export default function BentoPromos({ onSelectCategory }) {
  return (
    <section className="promo-bento-section" aria-label="Icon Pillars">
      <div className="container">
        
        <div className="bento-grid">
          
          {/* Bento 1: ICON HIRING */}
          <article className="bento-card tint-rose">
            <div className="bento-header">
              <div className="bento-tag">Equipment & Furniture Rental</div>
              <h3 className="bento-title">ICON HIRING</h3>
              <p className="bento-desc">Commercial 6x3m gazebos, Tiffany chairs, cocktail tables, plinths & catering equipment for Brisbane events.</p>
              <button
                type="button"
                className="bento-cta"
                onClick={() => onSelectCategory('all')}
              >
                <span>Browse hire catalog</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
            <img src="/assets/images/items/Icon 6x3 m Gazebo Hire-2-1024x1024.webp" alt="Icon Hiring Equipment" className="bento-art-asset" />
          </article>

          {/* Bento 2: ICON EVENTS */}
          <article className="bento-card tint-blush">
            <div className="bento-header">
              <div className="bento-tag">Full Event Styling & FX</div>
              <h3 className="bento-title">ICON EVENTS</h3>
              <p className="bento-desc">Statement ripple backdrops, 3D silk flower walls, cake plinth clusters & dramatic cold spark effects.</p>
              <button
                type="button"
                className="bento-cta"
                onClick={() => onSelectCategory('backdrops')}
              >
                <span>Explore event styling</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
            <img src="/assets/images/items/Three pink arches for hire-1-1024x1024.webp" alt="Icon Events Styling" className="bento-art-asset" />
          </article>

          {/* Bento 3: ICON BALLOONS */}
          <article className="bento-card tint-gold">
            <div className="bento-header">
              <div className="bento-tag">Bespoke Balloon Installations</div>
              <h3 className="bento-title">ICON BALLOONS</h3>
              <p className="bento-desc">Luxury organic balloon garlands, photo-op backdrop arches, milestone displays & custom color palettes.</p>
              <button
                type="button"
                className="bento-cta"
                onClick={() => onSelectCategory('backdrops')}
              >
                <span>View balloon styling</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
            <img src="/assets/images/items/Three blue arches for party hire-3-1024x1024.webp" alt="Icon Balloons Styling" className="bento-art-asset" />
          </article>

        </div>
      </div>
    </section>
  );
}
