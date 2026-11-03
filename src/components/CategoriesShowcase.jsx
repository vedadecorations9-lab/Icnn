import React from 'react';
import { CATEGORIES } from '../data/products';
import { ArrowRight } from 'lucide-react';

export default function CategoriesShowcase({ onExploreCategory, onViewAllItems }) {
  return (
    <section className="categories-showcase-section" id="categories-section">
      <div className="section-container">
        
        {/* Section Header */}
        <div className="section-header-centered">
          <h2 className="section-title-grand">
            Browse by event category
          </h2>
          <p className="section-subtitle-grand">
            Explore our curated range of commercial-grade party rentals, statement backdrops, luxury furniture, and cinematic special effects. Select any category below to view specific hire items and daily rates.
          </p>
        </div>

        {/* Categories Showcase Grid */}
        <div className="categories-showcase-grid">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="category-showcase-card"
              onClick={() => onExploreCategory(cat.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onExploreCategory(cat.id);
                }
              }}
            >
              {/* Image Container with Ambient Gradient */}
              <div className="category-card-media">
                <img
                  src={cat.image}
                  alt={cat.label}
                  loading="lazy"
                  className="category-card-img"
                />
                <div className="category-card-overlay" />
                
                {/* Floating Tag */}
                <div className="category-floating-badge">
                  {cat.tag}
                </div>

                {/* Starting Price Pill */}
                <div className="category-price-pill">
                  From ${cat.startingPrice} AUD
                </div>
              </div>

              {/* Card Content */}
              <div className="category-card-content">
                <div className="category-card-top-row">
                  <h3 className="category-card-title">{cat.label}</h3>
                  <span className="category-item-count">{cat.itemCount} items</span>
                </div>
                <p className="category-card-desc">{cat.description}</p>
                
                <div className="category-card-action">
                  <span className="category-action-label">Explore hire items</span>
                  <div className="category-arrow-circle">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
