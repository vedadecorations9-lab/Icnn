import React, { useState } from 'react';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';

const FILTER_TAGS = [
  { key: 'all', label: 'All Equipment (18)' },
  { key: 'marquees', label: 'Marquees & Gazebos' },
  { key: 'backdrops', label: 'Backdrops & Arches' },
  { key: 'balloons', label: 'Bespoke Balloons' },
  { key: 'tables', label: 'Tables & Cocktail' },
  { key: 'chairs', label: 'Chairs & Linens' },
  { key: 'plinths', label: 'Plinths & Cake Stands' },
  { key: 'catering', label: 'Catering & Warmers' },
  { key: 'effects', label: 'Special Effects' }
];

export default function ProductGrid({
  products,
  activeCategory,
  onSelectCategory,
  onBackToHome,
  formatPrice,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onOpenQuickView
}) {
  const [sortBy, setSortBy] = useState('popular');
  const [itemSearch, setItemSearch] = useState('');

  // Filter by category
  let displayed = products.filter(p => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'balloons') return p.category === 'backdrops' || p.category === 'balloons';
    return p.category === activeCategory;
  });

  // Filter by inner search keyword
  if (itemSearch.trim()) {
    const q = itemSearch.toLowerCase();
    displayed = displayed.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  // Sort
  if (sortBy === 'price-low') {
    displayed.sort((a, b) => (a.priceAUD || a.priceINR) - (b.priceAUD || b.priceINR));
  } else if (sortBy === 'price-high') {
    displayed.sort((a, b) => (b.priceAUD || b.priceINR) - (a.priceAUD || a.priceINR));
  } else if (sortBy === 'rating') {
    displayed.sort((a, b) => b.rating - a.rating);
  }

  const currentCategoryObj = FILTER_TAGS.find(t => t.key === activeCategory) || FILTER_TAGS[0];

  return (
    <section className="catalog-dedicated-page" id="dedicated-catalog-page">
      <div className="container">
        
        {/* Breadcrumb & Navigation Bar */}
        <div className="catalog-top-nav-bar">
          <button
            type="button"
            className="catalog-back-home-btn"
            onClick={onBackToHome}
          >
            <ArrowLeft size={16} />
            <span>Back to categories</span>
          </button>

          <div className="catalog-breadcrumbs">
            <span className="crumb-link" onClick={onBackToHome}>Home</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-link" onClick={() => onSelectCategory('all')}>Hire catalog</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-current">{currentCategoryObj.label}</span>
          </div>
        </div>

        {/* Dedicated Catalog Hero Banner */}
        <div className="catalog-header-banner">
          <div className="catalog-banner-copy">
            <div className="catalog-eyebrow">
              <span className="meta-dot"></span>
              <span>Brisbane commercial hire catalog</span>
            </div>
            <h1 className="catalog-banner-title">
              {activeCategory === 'all' ? 'All party and event hire items' : currentCategoryObj.label}
            </h1>
            <p className="catalog-banner-sub">
              Available for flexible 24h to 72h weekend hire with Brisbane warehouse dispatch, express delivery, and professional event setup across Queensland.
            </p>
          </div>

          <div className="catalog-banner-meta">
            <div className="catalog-meta-pill">
              <span className="meta-dot"></span>
              <span><strong>{displayed.length}</strong> items available</span>
            </div>
            <div className="catalog-meta-pill">
              <span>Standard refundable bond applies</span>
            </div>
          </div>
        </div>

        {/* Controls Bar: Category Filters & Search/Sort */}
        <div className="catalog-controls-bar">
          {/* Category Tabs */}
          <div className="catalog-filter-tabs">
            {FILTER_TAGS.map(tag => (
              <button
                key={tag.key}
                className={`catalog-tab-btn ${activeCategory === tag.key ? 'active' : ''}`}
                onClick={() => onSelectCategory(tag.key)}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Search & Sort Row */}
          <div className="catalog-tools-row">
            <div className="catalog-search-wrap">
              <input
                type="text"
                placeholder="Search this catalog..."
                value={itemSearch}
                onChange={(e) => setItemSearch(e.target.value)}
                className="catalog-search-input"
              />
              {itemSearch && (
                <button
                  type="button"
                  className="catalog-search-clear"
                  onClick={() => setItemSearch('')}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="catalog-sort-wrap">
              <SlidersHorizontal size={15} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="catalog-sort-select"
                aria-label="Sort catalog items"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dedicated Items Grid */}
        <div className="product-grid" id="products-grid">
          {displayed.length > 0 ? (
            displayed.map(prod => {
              const isSaved = wishlist.includes(prod.id);
              const priceDisplay = formatPrice(prod.priceAUD || prod.priceINR);
              
              return (
                <article key={prod.id} className="product-card">
                  <div className="card-thumb-wrap">
                    <span className={`card-badge ${prod.badgeType}`}>{prod.badge || prod.discount}</span>
                    
                    <button
                      className={`wishlist-toggle-btn ${isSaved ? 'active' : ''}`}
                      onClick={() => onToggleWishlist(prod.id)}
                      title={isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}
                      aria-label="Wishlist"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                    
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="card-img"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/images/icon_logo.png';
                      }}
                    />
                    
                    <button
                      className="quick-view-btn"
                      onClick={() => onOpenQuickView(prod.id)}
                    >
                      Quick view & specs
                    </button>
                  </div>

                  <div className="card-body">
                    <div className="card-meta-top">
                      <span className="card-category">{prod.categoryLabel}</span>
                      <span className="card-sku">{prod.sku}</span>
                    </div>

                    <h3
                      className="card-title"
                      onClick={() => onOpenQuickView(prod.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {prod.name}
                    </h3>
                    
                    <div className="card-rating-row">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="star-icon" aria-hidden="true">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      <span className="rating-num">{prod.rating ? prod.rating.toFixed(1) : '5.0'}</span>
                      <span className="reviews-count">({prod.reviewsCount} hires)</span>
                    </div>

                    <div className="card-hire-period">
                      <span>Hire period: {prod.hirePeriod || 'Weekend hire (Fri–Mon)'}</span>
                    </div>

                    <div className="card-footer-row">
                      <div className="price-wrap">
                        <span className="price-current">{priceDisplay}</span>
                        <span className="price-sub-label">/ day hire</span>
                      </div>
                      
                      <button
                        className="btn-hire-add"
                        onClick={() => onAddToCart(prod.id)}
                        title="Add to hire bag"
                        aria-label="Add to hire bag"
                      >
                        <span>Add to bag</span>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="catalog-empty-state">
              <p className="empty-title">
                No hire equipment matches &ldquo;{itemSearch}&rdquo; in this category
              </p>
              <p className="empty-subtitle">
                Try searching across all equipment or clearing your filter keyword.
              </p>
              <button
                className="btn-primary"
                style={{ marginTop: '16px' }}
                onClick={() => {
                  setItemSearch('');
                  onSelectCategory('all');
                }}
              >
                View Full 18 Items Catalog
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
