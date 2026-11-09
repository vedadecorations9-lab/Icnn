import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  X,
  SlidersHorizontal,
  Heart,
  ShoppingBag,
  Eye,
  Check,
  ChevronDown,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Truck,
  Calendar
} from 'lucide-react';
import { CATEGORIES, getProductPills } from '../data/products';

export default function ShopPage({
  products = [],
  categories = CATEGORIES,
  activeCategory = 'all',
  onSelectCategory,
  onBackToHome,
  formatPrice,
  wishlist = [],
  onToggleWishlist,
  onAddToCart,
  onOpenQuickView
}) {
  // Filter States
  const [selectedCat, setSelectedCat] = useState(activeCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [priceMax, setPriceMax] = useState(250);
  const [commercialOnly, setCommercialOnly] = useState(false);
  const [instantOnly, setInstantOnly] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [addedId, setAddedId] = useState(null);

  // Sync internal category selection with parent activeCategory prop
  useEffect(() => {
    setSelectedCat(activeCategory);
  }, [activeCategory]);

  // Scroll to top on mount or when category changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCat]);

  const activeCategories = categories && categories.length > 0 ? categories : CATEGORIES;

  // Compute live count for each category
  const categoryCounts = useMemo(() => {
    const counts = { all: products.length };
    activeCategories.forEach(cat => {
      counts[cat.id] = products.filter(p => p.category === cat.id).length;
    });
    return counts;
  }, [products, activeCategories]);

  // Find active category metadata object
  const currentCategoryMeta = useMemo(() => {
    if (selectedCat === 'all') {
      return {
        id: 'all',
        label: 'All Equipment',
        description: 'Complete Brisbane commercial event hire inventory. Heavy-duty marquees, photo backdrops, seating, catering, and party effects.',
        image: '/assets/images/items/Icon 6x3 m Gazebo Hire-2-1024x1024.webp'
      };
    }
    return (
      activeCategories.find(c => c.id === selectedCat) || {
        id: selectedCat,
        label: 'Event Equipment',
        description: 'Commercial equipment for Brisbane weddings, corporate functions, and celebration parties.',
        image: '/assets/images/items/Icon 6x3 m Gazebo Hire-2-1024x1024.webp'
      }
    );
  }, [selectedCat, activeCategories]);

  // Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        // Category Filter
        if (selectedCat !== 'all' && product.category !== selectedCat) {
          return false;
        }

        // Price Filter
        if (product.priceAUD && product.priceAUD > priceMax) {
          return false;
        }

        // Commercial Heavy-Duty Filter
        if (commercialOnly) {
          const isComm = (product.name + (product.material || '') + (product.badge || '')).toLowerCase().includes('commercial');
          if (!isComm) return false;
        }

        // Instant Dispatch / In-Stock Filter
        if (instantOnly && (product.stock || 0) <= 0) {
          return false;
        }

        // Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = product.name?.toLowerCase().includes(q);
          const matchCat = product.categoryLabel?.toLowerCase().includes(q);
          const matchDesc = product.description?.toLowerCase().includes(q);
          const matchSku = product.sku?.toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchDesc && !matchSku) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') {
          return (a.priceAUD || 0) - (b.priceAUD || 0);
        }
        if (sortBy === 'price-high') {
          return (b.priceAUD || 0) - (a.priceAUD || 0);
        }
        if (sortBy === 'rating') {
          return (b.rating || 5) - (a.rating || 5);
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        // Default: popular / bestseller first
        return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      });
  }, [products, selectedCat, priceMax, commercialOnly, instantOnly, searchQuery, sortBy]);

  const handleCategoryChange = (catId) => {
    setSelectedCat(catId);
    onSelectCategory?.(catId);
  };

  const handleResetFilters = () => {
    setSelectedCat('all');
    onSelectCategory?.('all');
    setSearchQuery('');
    setPriceMax(250);
    setCommercialOnly(false);
    setInstantOnly(false);
    setSortBy('popular');
  };

  const handleAddWithFeedback = (productId) => {
    onAddToCart?.(productId);
    setAddedId(productId);
    setTimeout(() => {
      setAddedId(null);
    }, 1500);
  };

  const isAnyFilterActive = selectedCat !== 'all' || searchQuery.trim() !== '' || priceMax < 250 || commercialOnly || instantOnly;

  return (
    <div className="shop-page-wrapper" aria-label="Icon Party Hire Equipment Shop">
      
      {/* =========================================================================
         1. TOP EDITORIAL BANNER (Full Panoramic Banner Conveying Service & Atmosphere)
         ========================================================================= */}
      <section className="shop-hero-card-section">
        <div className="container">
          <div className="shop-hero-card">
            
            {/* Full Panoramic Background Image */}
            <div className="shop-hero-media">
              <img
                src="/assets/images/shop_hero_banner.jpg"
                alt="Icon Party Hire Brisbane Celebration Service"
                className="shop-hero-img"
              />
            </div>

            {/* Directional Luxury Scrim for High-Contrast Text Readability */}
            <div className="shop-hero-scrim" aria-hidden="true" />

            {/* Editorial Content Overlay */}
            <div className="shop-hero-copy">
              <div className="shop-kicker-row">
                <span className="shop-kicker-tag">— Event Equipment Collections</span>
                <span className="shop-hub-pill">Brisbane Celebration Service</span>
                <div className="shop-hero-media-badge">
                  <Sparkles size={13} className="text-amber-300" />
                  <span>Murrumba Downs HQ</span>
                </div>
              </div>

              <h1 className="shop-hero-title">
                Explore The Complete Collection of{' '}
                <span className="hero-fancy-text">
                  {selectedCat === 'all' ? 'Icon Party Hire' : currentCategoryMeta.label}
                </span>
              </h1>

              <p className="shop-hero-desc">
                {selectedCat === 'all'
                  ? "Greater Brisbane's trusted event equipment hire and logistics dispatch. We deliver, install, and stage luxury celebration atmospheres across Brisbane, Moreton Bay, and the Sunshine Coast."
                  : currentCategoryMeta.description ||
                    "Discover Brisbane's leading commercial event and party equipment rental collection. 100% waterproof gazebos, statement flower walls, ripple arches, and luxury Tiffany seating serviced and delivered across Greater Brisbane."}
              </p>

              {/* Service Highlights */}
              <div className="shop-hero-perks">
                <div className="shop-perk-item">
                  <ShieldCheck size={16} className="perk-icon" />
                  <span>Commercial Tested & Sanitized</span>
                </div>
                <div className="shop-perk-item">
                  <Calendar size={16} className="perk-icon" />
                  <span>24–72h Flexible Weekend Hire</span>
                </div>
                <div className="shop-perk-item">
                  <Truck size={16} className="perk-icon" />
                  <span>Greater Brisbane Delivery & Setup</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
         2. BREADCRUMBS & SECTION TITLE BAR
         ========================================================================= */}
      <section className="shop-subnav-strip">
        <div className="container">
          <div className="shop-subnav-inner">
            
            {/* Left: Breadcrumbs + Return Home */}
            <div className="shop-breadcrumbs-group">
              <button
                type="button"
                className="shop-return-home-btn"
                onClick={onBackToHome}
                title="Return to Icon Party Hire home page"
              >
                <ArrowLeft size={15} />
                <span>Home</span>
              </button>
              <span className="crumb-divider">/</span>
              <span className="crumb-active">Hire Shop</span>
              {selectedCat !== 'all' && (
                <>
                  <span className="crumb-divider">/</span>
                  <span className="crumb-leaf">{currentCategoryMeta.label}</span>
                </>
              )}
            </div>

            {/* Right: Results Count Badge */}
            <div className="shop-count-badge">
              <span className="count-number">{filteredProducts.length}</span>
              <span className="count-label">Items Available</span>
            </div>

          </div>

          {/* Reference Design: Collection Title & Subtitle */}
          <div className="shop-collection-header-row">
            <h2 className="shop-collection-title">
              {selectedCat === 'all' ? 'Icon Hire Collection' : `${currentCategoryMeta.label} Collection`}
            </h2>
            <p className="shop-collection-sub">
              Showing {filteredProducts.length} commercial party & event items for Greater Brisbane hire
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
         3. VISUAL CATEGORY QUICK-SWITCHER PILLS / CARDS (Shifted from Home)
         ========================================================================= */}
      <section className="shop-category-switcher-section">
        <div className="container">
          <div className="shop-cat-switcher-scroll">
            
            {/* All Equipment Master Pill */}
            <button
              type="button"
              className={`shop-cat-pill ${selectedCat === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('all')}
            >
              <span className="cat-pill-icon">✨</span>
              <span className="cat-pill-text">All Equipment</span>
              <span className="cat-pill-badge">{products.length}</span>
            </button>

            {/* Category Pills */}
            {activeCategories.map(cat => {
              const count = categoryCounts[cat.id] || 0;
              const isActive = selectedCat === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`shop-cat-pill ${isActive ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  <div className="cat-pill-thumb">
                    <img src={cat.image} alt={cat.label} />
                  </div>
                  <span className="cat-pill-text">{cat.shortLabel || cat.label}</span>
                  <span className="cat-pill-badge">{count}</span>
                </button>
              );
            })}

          </div>
        </div>
      </section>

      {/* =========================================================================
         4. MAIN CATALOG TWO-COLUMN LAYOUT (Left Sidebar + Right Product Grid)
         ========================================================================= */}
      <section className="shop-main-layout-section">
        <div className="container">
          <div className="shop-main-grid-wrapper">

            {/* ---------------------------------------------------------------
               A. LEFT FILTER SIDEBAR (Desktop Sticky)
               --------------------------------------------------------------- */}
            <aside className="shop-filter-sidebar hide-mobile">
              <div className="shop-sidebar-sticky-box">

                {/* Sidebar Header */}
                <div className="shop-sidebar-header">
                  <div className="sidebar-title-wrap">
                    <SlidersHorizontal size={16} className="text-pink-600" />
                    <h3 className="sidebar-title">Filters</h3>
                  </div>
                  {isAnyFilterActive && (
                    <button
                      type="button"
                      className="sidebar-reset-btn"
                      onClick={handleResetFilters}
                      title="Clear all filters and search"
                    >
                      <RotateCcw size={12} />
                      <span>Reset</span>
                    </button>
                  )}
                </div>

                {/* Filter Group: Categories List with Checkboxes & Counts */}
                <div className="filter-group-block">
                  <h4 className="filter-group-heading">Categories</h4>
                  <div className="filter-checkbox-list">
                    
                    {/* All Option */}
                    <label
                      className={`filter-checkbox-row ${selectedCat === 'all' ? 'active' : ''}`}
                      onClick={() => handleCategoryChange('all')}
                    >
                      <div className="custom-checkbox">
                        {selectedCat === 'all' && <Check size={12} strokeWidth={3} />}
                      </div>
                      <span className="checkbox-label">All Equipment</span>
                      <span className="checkbox-count">{products.length}</span>
                    </label>

                    {/* Category Options */}
                    {activeCategories.map(cat => {
                      const isSelected = selectedCat === cat.id;
                      const count = categoryCounts[cat.id] || 0;

                      return (
                        <label
                          key={cat.id}
                          className={`filter-checkbox-row ${isSelected ? 'active' : ''}`}
                          onClick={() => handleCategoryChange(cat.id)}
                        >
                          <div className="custom-checkbox">
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                          <span className="checkbox-label">{cat.label}</span>
                          <span className="checkbox-count">{count}</span>
                        </label>
                      );
                    })}

                  </div>
                </div>

                {/* Filter Group: Price Range Slider */}
                <div className="filter-group-block">
                  <div className="filter-group-header-between">
                    <h4 className="filter-group-heading">Daily Hire Rate</h4>
                    <span className="price-range-indicator">Up to ${priceMax} AUD</span>
                  </div>

                  <div className="price-slider-wrap">
                    <input
                      type="range"
                      min="5"
                      max="250"
                      step="5"
                      value={priceMax}
                      onChange={(e) => setPriceMax(Number(e.target.value))}
                      className="shop-price-slider"
                      aria-label="Filter by maximum price in AUD"
                    />
                    <div className="price-slider-ticks">
                      <span>$5</span>
                      <span>$100</span>
                      <span>$250+</span>
                    </div>
                  </div>

                  {/* Quick Price Buttons */}
                  <div className="price-quick-pills">
                    <button
                      type="button"
                      className={`price-chip ${priceMax === 50 ? 'active' : ''}`}
                      onClick={() => setPriceMax(50)}
                    >
                      Under $50
                    </button>
                    <button
                      type="button"
                      className={`price-chip ${priceMax === 100 ? 'active' : ''}`}
                      onClick={() => setPriceMax(100)}
                    >
                      Under $100
                    </button>
                    <button
                      type="button"
                      className={`price-chip ${priceMax === 250 ? 'active' : ''}`}
                      onClick={() => setPriceMax(250)}
                    >
                      All Rates
                    </button>
                  </div>
                </div>

                {/* Filter Group: Equipment Specifications */}
                <div className="filter-group-block">
                  <h4 className="filter-group-heading">Features</h4>
                  <div className="filter-checkbox-list">
                    <label
                      className={`filter-checkbox-row ${commercialOnly ? 'active' : ''}`}
                      onClick={() => setCommercialOnly(!commercialOnly)}
                    >
                      <div className="custom-checkbox">
                        {commercialOnly && <Check size={12} strokeWidth={3} />}
                      </div>
                      <span className="checkbox-label">Commercial Heavy-Duty</span>
                    </label>

                    <label
                      className={`filter-checkbox-row ${instantOnly ? 'active' : ''}`}
                      onClick={() => setInstantOnly(!instantOnly)}
                    >
                      <div className="custom-checkbox">
                        {instantOnly && <Check size={12} strokeWidth={3} />}
                      </div>
                      <span className="checkbox-label">In-Stock for This Weekend</span>
                    </label>
                  </div>
                </div>

                {/* Sidebar Callout Card */}
                <div className="sidebar-dispatch-card">
                  <Truck size={20} className="dispatch-icon" />
                  <div className="dispatch-info">
                    <h5>Brisbane Setup Dispatch</h5>
                    <p>Free pickup from Murrumba Downs or door-to-door delivery across Greater Brisbane.</p>
                  </div>
                </div>

              </div>
            </aside>

            {/* ---------------------------------------------------------------
               B. RIGHT PRODUCT LISTING AREA (Toolbar + 3-Col Card Deck)
               --------------------------------------------------------------- */}
            <main className="shop-product-content-area">

              {/* Top Controls Toolbar: Search, Sort & Mobile Filter Trigger */}
              <div className="shop-toolbar-row">
                
                {/* Search Input Box */}
                <div className="shop-search-box">
                  <Search size={16} className="shop-search-icon" />
                  <input
                    type="text"
                    placeholder="Search equipment by name, SKU or spec..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="shop-search-input"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="shop-search-clear-btn"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search query"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Mobile Filter Button */}
                <button
                  type="button"
                  className="shop-mobile-filter-btn show-mobile"
                  onClick={() => setIsMobileFilterOpen(true)}
                  aria-label="Open filter options"
                >
                  <SlidersHorizontal size={16} />
                  <span>Filters</span>
                  {isAnyFilterActive && <span className="mobile-filter-badge-dot" />}
                </button>

                {/* Sorting Dropdown */}
                <div className="shop-sort-box">
                  <label htmlFor="shop-sort-select" className="shop-sort-label">Sort:</label>
                  <div className="sort-select-wrapper">
                    <select
                      id="shop-sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="shop-sort-select"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="name">Alphabetical</option>
                    </select>
                    <ChevronDown size={14} className="sort-chevron-icon" />
                  </div>
                </div>

              </div>

              {/* Active Filter Chips Strip */}
              {isAnyFilterActive && (
                <div className="shop-active-chips-strip">
                  <span className="active-chips-label">Active filters:</span>

                  {selectedCat !== 'all' && (
                    <span className="filter-chip-pill">
                      <span>{currentCategoryMeta.label}</span>
                      <button type="button" onClick={() => handleCategoryChange('all')}>
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  {searchQuery.trim() && (
                    <span className="filter-chip-pill">
                      <span>&ldquo;{searchQuery}&rdquo;</span>
                      <button type="button" onClick={() => setSearchQuery('')}>
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  {priceMax < 250 && (
                    <span className="filter-chip-pill">
                      <span>≤ ${priceMax} AUD</span>
                      <button type="button" onClick={() => setPriceMax(250)}>
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  {commercialOnly && (
                    <span className="filter-chip-pill">
                      <span>Commercial Only</span>
                      <button type="button" onClick={() => setCommercialOnly(false)}>
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  {instantOnly && (
                    <span className="filter-chip-pill">
                      <span>In-Stock Only</span>
                      <button type="button" onClick={() => setInstantOnly(false)}>
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  <button
                    type="button"
                    className="clear-all-chips-link"
                    onClick={handleResetFilters}
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Product Cards Grid (Matching Reference Design) */}
              {filteredProducts.length === 0 ? (
                /* Empty Search State */
                <div className="shop-empty-state-card">
                  <div className="empty-state-icon-wrap">
                    <Search size={32} />
                  </div>
                  <h3 className="empty-state-title">No equipment found matching criteria</h3>
                  <p className="empty-state-desc">
                    We couldn't find any party equipment matching your current filters or search query. Try broadening your criteria or reset filters.
                  </p>
                  <button
                    type="button"
                    className="shop-empty-reset-btn"
                    onClick={handleResetFilters}
                  >
                    <RotateCcw size={14} />
                    <span>View All {products.length} Equipment Items</span>
                  </button>
                </div>
              ) : (
                /* 3-Column Product Grid Matching Reference Image */
                <div className="shop-cards-deck">
                  {filteredProducts.map(product => {
                    const isWish = wishlist.includes(product.id);
                    const isJustAdded = addedId === product.id;
                    const pills = getProductPills(product);

                    return (
                      <article key={product.id} className="shop-product-card">
                        
                        {/* 1. Media Image Container */}
                        <div
                          className="shop-card-media-stage"
                          onClick={() => onOpenQuickView?.(product.id)}
                          role="button"
                          tabIndex={0}
                          aria-label={`Quick view ${product.name}`}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="shop-card-img"
                          />

                          {/* Badge Tag */}
                          {product.badge && (
                            <div className="shop-card-badge-pill">
                              <span>{product.badge}</span>
                            </div>
                          )}

                          {/* Quick View Hover Pill */}
                          <div className="shop-card-quickview-overlay hide-mobile">
                            <span className="quickview-pill-text">
                              <Eye size={14} />
                              <span>Quick View</span>
                            </span>
                          </div>

                          {/* Top-Right Wishlist Heart */}
                          <button
                            type="button"
                            className={`shop-card-wishlist-btn ${isWish ? 'is-active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleWishlist?.(product.id);
                            }}
                            title={isWish ? 'Remove from saved' : 'Save to wishlist'}
                            aria-label={`Save ${product.name} to wishlist`}
                          >
                            <Heart
                              size={17}
                              fill={isWish ? '#D81B60' : 'none'}
                              color={isWish ? '#D81B60' : '#475569'}
                            />
                          </button>
                        </div>

                        {/* 2. Card Body Details */}
                        <div className="shop-card-body">
                          
                          {/* Category Kicker */}
                          <div className="shop-card-kicker">
                            <span>{product.categoryLabel}</span>
                          </div>

                          {/* Product Title */}
                          <h2
                            className="shop-card-title"
                            onClick={() => onOpenQuickView?.(product.id)}
                            title={product.name}
                          >
                            {product.name}
                          </h2>

                          {/* Subtitle / Spec Line */}
                          <p className="shop-card-spec-desc">
                            {product.dimensions || product.material || (pills.length > 0 ? pills.slice(0, 2).join(' · ') : 'Commercial event hire grade')}
                          </p>

                          {/* Bottom Row: Price + Actions (Matching Wink Reference: [Price] [♡] [🛍️]) */}
                          <div className="shop-card-bottom-row">
                            
                            {/* Price Group */}
                            <div className="shop-card-price-group">
                              <div className="price-figure-row">
                                <span className="price-main-figure">
                                  {formatPrice ? formatPrice(product.priceAUD) : `$${product.priceAUD}`}
                                </span>
                                <span className="price-term-tag">/day</span>
                              </div>
                              {product.bondAUD && (
                                <span className="price-bond-sub">
                                  +${product.bondAUD} bond
                                </span>
                              )}
                            </div>

                            {/* Actions Group: Heart Wishlist + Add to Bag (Matching Reference Mockup) */}
                            <div className="shop-card-actions-group">
                              
                              <button
                                type="button"
                                className={`shop-card-heart-btn ${isWish ? 'is-active' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleWishlist?.(product.id);
                                }}
                                title={isWish ? 'Remove from saved' : 'Save to wishlist'}
                                aria-label={`Save ${product.name} to wishlist`}
                              >
                                <Heart
                                  size={18}
                                  fill={isWish ? '#D81B60' : 'none'}
                                  color={isWish ? '#D81B60' : '#475569'}
                                  strokeWidth={1.75}
                                />
                              </button>

                              <button
                                type="button"
                                className={`shop-card-bag-btn ${isJustAdded ? 'is-added' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddWithFeedback(product.id);
                                }}
                                aria-label={`Add ${product.name} to hire bag`}
                                title="Add to hire bag"
                              >
                                {isJustAdded ? (
                                  <Check size={16} strokeWidth={2.5} />
                                ) : (
                                  <ShoppingBag size={17} strokeWidth={1.75} />
                                )}
                              </button>

                            </div>

                          </div>

                        </div>

                      </article>
                    );
                  })}
                </div>
              )}

            </main>

          </div>
        </div>
      </section>

      {/* =========================================================================
         5. MOBILE FILTER SLIDE-UP DRAWER (Matching Phone Experience)
         ========================================================================= */}
      {isMobileFilterOpen && (
        <div className="shop-mobile-filter-drawer-backdrop" onClick={() => setIsMobileFilterOpen(false)}>
          <div className="shop-mobile-filter-drawer" onClick={(e) => e.stopPropagation()}>
            
            {/* Drawer Header */}
            <div className="mobile-drawer-header">
              <div className="drawer-title-group">
                <SlidersHorizontal size={18} className="text-pink-600" />
                <h3>Filters & Options</h3>
              </div>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setIsMobileFilterOpen(false)}
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Body Scroll */}
            <div className="mobile-drawer-body">
              
              {/* Categories */}
              <div className="drawer-section">
                <h4>Categories</h4>
                <div className="filter-checkbox-list">
                  <label
                    className={`filter-checkbox-row ${selectedCat === 'all' ? 'active' : ''}`}
                    onClick={() => handleCategoryChange('all')}
                  >
                    <div className="custom-checkbox">
                      {selectedCat === 'all' && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span className="checkbox-label">All Equipment</span>
                    <span className="checkbox-count">{products.length}</span>
                  </label>

                  {activeCategories.map(cat => (
                    <label
                      key={cat.id}
                      className={`filter-checkbox-row ${selectedCat === cat.id ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(cat.id)}
                    >
                      <div className="custom-checkbox">
                        {selectedCat === cat.id && <Check size={12} strokeWidth={3} />}
                      </div>
                      <span className="checkbox-label">{cat.label}</span>
                      <span className="checkbox-count">{categoryCounts[cat.id] || 0}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="drawer-section">
                <div className="filter-group-header-between">
                  <h4>Daily Rate Limit</h4>
                  <span className="price-range-indicator">Up to ${priceMax} AUD</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="250"
                  step="5"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="shop-price-slider"
                />
              </div>

              {/* Features */}
              <div className="drawer-section">
                <h4>Features</h4>
                <div className="filter-checkbox-list">
                  <label
                    className={`filter-checkbox-row ${commercialOnly ? 'active' : ''}`}
                    onClick={() => setCommercialOnly(!commercialOnly)}
                  >
                    <div className="custom-checkbox">
                      {commercialOnly && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span className="checkbox-label">Commercial Heavy-Duty</span>
                  </label>

                  <label
                    className={`filter-checkbox-row ${instantOnly ? 'active' : ''}`}
                    onClick={() => setInstantOnly(!instantOnly)}
                  >
                    <div className="custom-checkbox">
                      {instantOnly && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span className="checkbox-label">In-Stock This Weekend</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Drawer Bottom Bar */}
            <div className="mobile-drawer-footer">
              <button
                type="button"
                className="drawer-reset-btn"
                onClick={handleResetFilters}
              >
                Reset
              </button>
              <button
                type="button"
                className="drawer-apply-btn"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                Show {filteredProducts.length} Items
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
