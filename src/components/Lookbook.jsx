import React from 'react';

export default function Lookbook({ onOpenQuickView, onAddToCart, formatPrice }) {
  return (
    <section className="lookbook-section" id="lookbook-section">
      <div className="container">
        <div className="lookbook-container">
          
          {/* Interactive Stage with Hotspots */}
          <div className="lookbook-stage">
            <img
              src="/assets/images/items/Three elegant outdoor party setups.png"
              alt="Icon Styled Outdoor Celebration Setup"
              className="lookbook-img"
            />
            
            {/* Hotspot 1: 6x3m Gazebo */}
            <div
              className="hotspot-pin"
              style={{ top: '25%', left: '50%' }}
              onClick={() => onOpenQuickView('icon-01')}
              title="Click to view Icon 6x3m Gazebo"
            >
              <span>+</span>
            </div>

            {/* Hotspot 2: Silver Cocktail Table */}
            <div
              className="hotspot-pin"
              style={{ top: '65%', left: '22%' }}
              onClick={() => onOpenQuickView('icon-06')}
              title="Click to view Silver Cocktail Table"
            >
              <span>+</span>
            </div>

            {/* Hotspot 3: Ripple Arches */}
            <div
              className="hotspot-pin"
              style={{ top: '45%', left: '80%' }}
              onClick={() => onOpenQuickView('icon-04')}
              title="Click to view Ripple Wave Arches"
            >
              <span>+</span>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lookbook-sidebar">
            <span className="lookbook-eyebrow">Interactive event styling</span>
            <h2 className="lookbook-title">Style the complete party setup</h2>
            <p className="lookbook-desc">
              Select the markers on our styled Brisbane celebration setup to inspect commercial equipment specs, hire terms, and add directly to your event bag.
            </p>

            <div className="lookbook-featured-card">
              <img
                src="/assets/images/items/Icon 6x3 m Gazebo Hire-2-1024x1024.webp"
                alt="Icon 6x3m Gazebo"
                className="lookbook-card-thumb"
              />
              <div className="lookbook-card-info">
                <h4 className="lookbook-card-title">Commercial 6x3m pop-up gazebo</h4>
                <div className="lookbook-card-price">{formatPrice(85)} <span style={{ fontSize: '0.8rem', color: '#E8A28E' }}>/ day</span></div>
              </div>
              <button
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.8125rem' }}
                onClick={() => onAddToCart('icon-01')}
              >
                Add to bag
              </button>
            </div>

            <button
              className="btn-secondary"
              style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}
              onClick={() => onOpenQuickView('icon-04')}
            >
              Inspect ripple wave arches
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
