import React, { useState, useEffect } from 'react';
import { ArrowLeft, SlidersHorizontal, ArrowUpRight, Search, X } from 'lucide-react';
import { CATEGORIES, getProductPills } from '../data/products';

export default function ProductGrid({
  products,
  categories = CATEGORIES,
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

  const activeCategories = categories && categories.length > 0 ? categories : CATEGORIES;

  const filterTags = [
    { key: 'all', label: 'All Equipment' },
    ...activeCategories.map(c => ({
      key: c.id,
      label: c.shortLabel || c.label
    }))
  ];

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

  const currentCategoryObj = filterTags.find(t => t.key === activeCategory) || filterTags[0];

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

          <div className="catalog-breadcrumbs">
            <span>Icon Party Hire</span>
            <span className="crumb-sep">/</span>
            <span>Catalog</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-current">{currentCategoryObj.label}</span>
          </div>
        </div>

        {/* Page Title & Category Header */}
        <div className="catalog-header-area">
          <div className="catalog-title-col">
            <span className="catalog-eyebrow">BRISBANE PARTY EQUIPMENT CATALOG</span>
            <h1 className="catalog-main-title">
              {activeCategory === 'all' ? (
                <>All Event <span className="hero-fancy-text">Equipment Hire</span></>
              ) : (
                <>{currentCategoryObj.label} <span className="hero-fancy-text">Collection</span></>
              )}
            </h1>
            <p className="catalog-subtitle">
              Browse Brisbane's commercial event equipment hire catalog. All items serviced, tested, and dispatched from our Murrumba Downs hub.
            </p>
          </div>

          <div className="catalog-stats-badge">
            <span className="catalog-stats-num">{displayed.length}</span>
            <span className="catalog-stats-lbl">Items Available</span>
          </div>
        </div>

        {/* Controls Bar: Category Filter Tabs & Search/Sort */}
        <div className="catalog-controls-bar">
          {/* Scrollable Category Tabs */}
          <div className="catalog-filter-tabs">
            {filterTags.map(tag => (
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
              <label htmlFor="catalog-sort" className="catalog-sort-label">Sort:</label>
              <select
                id="catalog-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="catalog-sort-select"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid Cards */}
        {displayed.length === 0 ? (
          <div className="catalog-empty-state">
            <p className="empty-title">No equipment found matching your criteria</p>
            <p className="empty-sub">Try searching for a different keyword or resetting your category filter.</p>
            <button
              type="button"
              className="btn-primary-gold"
              onClick={() => {
                onSelectCategory('all');
                setItemSearch('');
              }}
            >
              <span>View All Equipment ({products.length})</span>
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {displayed.map((product) => {
              const pills = getProductPills(product);
              const isWish = wishlist.includes(product.id);

              return (
                <article key={product.id} className="clean-item-card">
                  
                  {/* Card Media Image */}
                  <div
                    className="item-media-stage"
                    onClick={() => onOpenQuickView(product.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="item-photo"
                    />

                    {/* Badge */}
                    {product.badge && (
                      <div className="item-badge-pill">
                        <span>{product.badge}</span>
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      className={`item-wishlist-trigger ${isWish ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product.id);
                      }}
                      title={isWish ? 'Remove from saved' : 'Save to wishlist'}
                      aria-label="Save to wishlist"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill={isWish ? '#D81B60' : 'none'} stroke={isWish ? '#D81B60' : 'currentColor'} strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="item-card-details">
                    <div className="item-category-kicker">
                      <span>{product.categoryLabel}</span>
                    </div>

                    <h2
                      className="item-card-name"
                      onClick={() => onOpenQuickView(product.id)}
                    >
                      {product.name}
                    </h2>

                    {/* Spec Tag Pills */}
                    <div className="item-spec-tags">
                      {pills.slice(0, 3).map((pill, i) => (
                        <span key={i} className="spec-tag">{pill}</span>
                      ))}
                    </div>

                    {/* Price and Add to Bag */}
                    <div className="item-card-bottom-row">
                      <div className="item-price-block">
                        <span className="price-prefix">From</span>
                        <div className="price-value-row">
                          <span className="price-curr-val">{formatPrice(product.priceAUD)}</span>
                          <span className="price-term">/ 1–4 days</span>
                        </div>
                        {product.bondAUD && (
                          <span className="price-bond-note">+${product.bondAUD} bond</span>
                        )}
                      </div>

                      <button
                        type="button"
                        className="btn-hire-add"
                        onClick={() => onAddToCart(product.id)}
                        aria-label={`Add ${product.name} to hire bag`}
                      >
                        <span>Add to bag</span>
                      </button>
                    </div>

                  </div>

                </article>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
