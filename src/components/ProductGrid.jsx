import React, { useState, useEffect } from 'react';
import { ArrowLeft, SlidersHorizontal, ArrowUpRight, Search, X } from 'lucide-react';
import { getProductPills } from '../data/products';

const FILTER_TAGS = [
  { key: 'all', label: 'All Equipment' },
  { key: 'chairs', label: 'Chairs' },
  { key: 'tables', label: 'Tables' },
  { key: 'gazebo', label: 'Gazebo' },
  { key: 'backdrops', label: 'Backdrops' },
  { key: 'lighting', label: 'Lighting' },
  { key: 'linen', label: 'Linen' },
  { key: 'heaters', label: 'Heaters' },
  { key: 'esky', label: 'Esky' },
  { key: 'plinth', label: 'Plinth' },
  { key: 'av', label: 'Audio/Video' }
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

  // Scroll to top cleanly when switching category
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory]);

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

  // Sort logic
  if (sortBy === 'price-low') {
    displayed = [...displayed].sort((a, b) => (a.priceAUD || 0) - (b.priceAUD || 0));
  } else if (sortBy === 'price-high') {
    displayed = [...displayed].sort((a, b) => (b.priceAUD || 0) - (a.priceAUD || 0));
  } else if (sortBy === 'rating') {
    displayed = [...displayed].sort((a, b) => (b.rating || 5) - (a.rating || 5));
  }

  const currentCategoryObj = FILTER_TAGS.find(t => t.key === activeCategory) || FILTER_TAGS[0];

  return (
    <section className="catalog-dedicated-page" aria-label="Dedicated Equipment Catalog">
      <div className="container">
        
        {/* Navigation Breadcrumb Bar */}
        <div className="catalog-breadcrumb-bar">
          <button
            type="button"
            className="catalog-back-btn"
            onClick={onBackToHome}
            aria-label="Back to home page"
          >
            <ArrowLeft size={16} />
            <span>Return to Home</span>
          </button>
          
          <div className="catalog-crumb-trail">
            <span onClick={onBackToHome} className="crumb-link">Home</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-link" onClick={() => onSelectCategory('all')}>Catalog</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-current">{currentCategoryObj.label}</span>
          </div>
        </div>

        {/* Dedicated Catalog Editorial Header Banner */}
        <div className="catalog-header-banner">
          <div className="catalog-banner-copy">
            <div className="catalog-eyebrow">
              <span className="meta-dot"></span>
              <span>Brisbane Commercial Hire Catalog</span>
            </div>
            <h1 className="catalog-banner-title">
              {activeCategory === 'all' ? 'All Party & Event Hire Items' : `${currentCategoryObj.label} Hire Collection`}
            </h1>
            <p className="catalog-banner-sub">
              Available for flexible 24h to 72h weekend hire with Brisbane warehouse dispatch, express delivery, and professional event setup across Queensland.
            </p>
          </div>

          <div className="catalog-banner-meta">
            <div className="catalog-meta-pill">
              <span className="meta-dot"></span>
              <span><strong>{displayed.length}</strong> items in collection</span>
            </div>
            <div className="catalog-meta-pill">
              <span>Standard refundable bond applies</span>
            </div>
          </div>
        </div>

        {/* Controls Bar: Category Filter Tabs & Search/Sort */}
        <div className="catalog-controls-bar">
          {/* Scrollable Category Tabs */}
          <div className="catalog-filter-tabs">
            {FILTER_TAGS.map(tag => (
              <button
                key={tag.key}
                type="button"
                className={`catalog-tab-btn ${activeCategory === tag.key ? 'active' : ''}`}
                onClick={() => onSelectCategory(tag.key)}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Search & Sort Tools */}
          <div className="catalog-tools-row">
            <div className="catalog-search-wrap">
              <Search size={16} className="catalog-search-icon" />
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
                  aria-label="Clear search"
                >
                  <X size={13} />
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

        {/* Dedicated Items Grid with Modern Scallop Design Cards */}
        <div className="product-grid" id="products-grid">
          {displayed.length > 0 ? (
            displayed.map(prod => {
              const isSaved = wishlist.includes(prod.id);
              const priceDisplay = formatPrice(prod.priceAUD || prod.priceINR);
              const pills = getProductPills(prod);
              
              return (
                <article
                  key={prod.id}
                  className="modern-design-card product-card"
                  onClick={() => onOpenQuickView(prod.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onOpenQuickView(prod.id);
                    }
                  }}
                >
                  {/* Media Image Stage with Top-Right Scallop Notch */}
                  <div className="modern-card-media">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="modern-card-img"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/images/icon_logo.png';
                      }}
                    />

                    {/* Top-Left Wishlist Heart Button */}
                    <button
                      type="button"
                      className={`modern-card-wishlist ${isSaved ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(prod.id);
                      }}
                      title={isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}
                      aria-label="Wishlist"
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill={isSaved ? '#D81B60' : 'none'}
                        stroke={isSaved ? '#D81B60' : 'currentColor'}
                        strokeWidth="2.2"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>

                    {/* Top-Right Scallop Notch: PRICE ONLY (As requested: "just the price(only in product cards)") */}
                    <div className="modern-card-notch">
                      <span className="modern-card-price">{priceDisplay}</span>
                    </div>

                    {/* Bottom Fleet / Availability Pill */}
                    <div className="modern-card-bottom-strip">
                      <span className="modern-card-bottom-pill">
                        {prod.badge || 'Commercial Hire • Brisbane'}
                      </span>
                    </div>
                  </div>

                  {/* Card Body: Title, Action, and Minimal Tag Pills (NO lengthy sentences) */}
                  <div className="modern-card-body">
                    <div className="modern-card-header-row">
                      <h3 className="modern-card-title" title={prod.name}>
                        {prod.name}
                      </h3>
                      <button
                        type="button"
                        className="modern-card-action"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(prod.id);
                        }}
                        title="Add to hire bag"
                      >
                        <span>Hire Now</span>
                        <ArrowUpRight size={15} />
                      </button>
                    </div>

                    {/* Minimal Tag Pills (NO lengthy sentences) */}
                    <div className="modern-card-tags">
                      {pills.map((pill, i) => (
                        <span key={i} className="modern-card-tag-pill">{pill}</span>
                      ))}
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
                type="button"
                className="btn-primary-gold"
                onClick={() => {
                  setItemSearch('');
                  onSelectCategory('all');
                }}
              >
                <span>View Full Catalog ({products.length} Items)</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
