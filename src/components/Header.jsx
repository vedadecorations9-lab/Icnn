import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/react';
import { CATEGORIES } from '../data/products';
import AuthControls from './AuthControls';

const PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  import.meta.env.CLERK_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function AdminNavButton({ onOpenAdmin }) {
  if (!PUBLISHABLE_KEY) return null;
  return <AdminNavButtonInner onOpenAdmin={onOpenAdmin} />;
}

function AdminNavButtonInner({ onOpenAdmin }) {
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded || !isSignedIn) return null;

  const adminEmails = (
    import.meta.env.VITE_ADMIN_EMAILS ||
    import.meta.env.ADMIN_EMAILS ||
    ''
  ).split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase() || '';
  const isRoleAdmin = user?.publicMetadata?.role === 'admin';
  const isEmailAdmin = adminEmails.length > 0 && adminEmails.includes(userEmail);

  if (!isRoleAdmin && !isEmailAdmin) return null;

  return (
    <button
      type="button"
      className="nav-icon-action-btn hide-mobile"
      onClick={onOpenAdmin}
      title="Icon Operations Admin HQ"
      aria-label="Open Admin Operations Panel"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
    </button>
  );
}

export default function Header({
  currentView = 'home',
  currency,
  setCurrency,
  formatPrice,
  products,
  activeCategory,
  onSelectCategory,
  onNavigateHome,
  onNavigateCatalog,
  onOpenCategories,
  onOpenQuickView,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenTrackOrder,
  onOpenAdmin,
  onOpenMobileMenu,
  onNavigateAuth
}) {
  const [searchVal, setSearchVal] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  // High-performance RAF scroll listener (no redundant re-renders)
  useEffect(() => {
    let rafId = null;
    function handleScroll() {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const scrolled = window.scrollY > 35;
        setIsScrolled(prev => (prev !== scrolled ? scrolled : prev));
        rafId = null;
      });
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isTransparent = currentView === 'home' && !isScrolled;
  const [collectionsMenuOpen, setCollectionsMenuOpen] = useState(false);
  const collectionsRef = useRef(null);

  // Filter products for live visual search
  const searchResults = searchVal.trim().length >= 2
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchVal.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(searchVal.toLowerCase()) ||
        p.category.toLowerCase().includes(searchVal.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchVal.toLowerCase())) ||
        (p.material && p.material.toLowerCase().includes(searchVal.toLowerCase()))
      ).slice(0, 6)
    : [];

  // Handle Escape key & outside clicks
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setCollectionsMenuOpen(false);
      }
    }
    function handleClickOutside(e) {
      if (collectionsRef.current && !collectionsRef.current.contains(e.target)) {
        setCollectionsMenuOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="luxury-navbar-wrapper" role="banner">
        <nav className={`luxury-navbar ${isScrolled ? 'navbar-scrolled' : 'navbar-glass'}`} aria-label="Main Floating Navigation">

        <div className="luxury-navbar-inner">
          
          {/* LEFT ZONE: Mobile Menu Toggle (Mobile) + Brand Lockup (Desktop) */}
          <div className="nav-zone-left">
            <button
              className="nav-mobile-btn show-mobile"
              onClick={onOpenMobileMenu}
              aria-label="Open navigation menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            {/* Desktop Brand Logo Lockup */}
            <div
              className="luxury-brand-lockup hide-mobile"
              onClick={() => onNavigateHome?.()}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              aria-label="Icon Party Hire Brisbane Home"
            >
              <img
                src="/assets/images/icon_logo_navbar.webp"
                alt="Icon Party Hire Brisbane"
                className="luxury-brand-navbar-img"
              />
            </div>
          </div>

          {/* MOBILE TRUE CENTER: Pure Brand Logo (Centered with zero button collision) */}
          <div
            className="mobile-brand-center show-mobile"
            onClick={() => onNavigateHome?.()}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
            aria-label="Icon Party Hire Brisbane Home"
          >
            <img
              src="/assets/images/icon_logo_navbar.webp"
              alt="Icon Party Hire Brisbane"
              className="mobile-brand-navbar-img"
            />
          </div>

          {/* CENTER ZONE: Essential 3 Pillars (Hiring, Decorations, Balloons) */}
          <nav className="nav-zone-center hide-mobile" aria-label="Main Navigation">
            <ul className="nav-menu-list">
              
              {/* 1. Hiring Link */}
              <li className="nav-menu-item">
                <button
                  type="button"
                  className={`nav-link-btn ${currentView === 'catalog' && activeCategory === 'all' ? 'active' : ''}`}
                  onClick={() => {
                    onSelectCategory?.('all');
                    onNavigateCatalog?.('all');
                  }}
                >
                  <span>Hiring</span>
                </button>
              </li>

              {/* 2. Decorations Link */}
              <li className="nav-menu-item">
                <button
                  type="button"
                  className={`nav-link-btn ${currentView === 'catalog' && activeCategory === 'backdrops' ? 'active' : ''}`}
                  onClick={() => {
                    onSelectCategory?.('backdrops');
                    onNavigateCatalog?.('backdrops');
                  }}
                >
                  <span>Decorations</span>
                </button>
              </li>

              {/* 3. Balloons Link */}
              <li className="nav-menu-item">
                <button
                  type="button"
                  className={`nav-link-btn ${currentView === 'catalog' && activeCategory === 'balloons' ? 'active' : ''}`}
                  onClick={() => {
                    onSelectCategory?.('balloons');
                    onNavigateCatalog?.('balloons');
                  }}
                >
                  <span>Balloons</span>
                </button>
              </li>
            </ul>
          </nav>

          {/* RIGHT ZONE: Search Trigger + Admin HQ + Wishlist + Cart */}
          <div className="nav-zone-right">
            
            {/* Mobile Quick Search Button */}
            <button
              type="button"
              className="nav-mobile-search-btn show-mobile"
              onClick={() => {
                onSelectCategory?.('all');
                onNavigateCatalog?.('all');
              }}
              title="Search equipment catalog"
              aria-label="Search catalog"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {/* Inline Search Bar with Live Dropdown Results */}
            <form
              className="nav-search-form hide-mobile"
              style={{ position: 'relative' }}
              onSubmit={(e) => {
                e.preventDefault();
                if (searchResults.length > 0) {
                  onOpenQuickView?.(searchResults[0].id || searchResults[0]._id);
                  setSearchVal('');
                } else {
                  onSelectCategory?.('all');
                  onNavigateCatalog?.('all');
                }
              }}
              role="search"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="search-form-icon">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                className="nav-search-input"
                placeholder="Search equipment..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                aria-label="Search equipment catalog"
              />
              {searchResults.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: 310,
                    background: '#FFFFFF',
                    border: '1px solid rgba(27, 6, 26, 0.1)',
                    borderRadius: 16,
                    boxShadow: '0 18px 40px rgba(27, 6, 26, 0.16)',
                    padding: 6,
                    zIndex: 2500
                  }}
                >
                  {searchResults.map((item) => {
                    const itemId = item.id || item._id;
                    return (
                      <button
                        key={itemId}
                        type="button"
                        onClick={() => {
                          onOpenQuickView?.(itemId);
                          setSearchVal('');
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '8px 10px',
                          borderRadius: 10,
                          textAlign: 'left',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
                        />
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1B061A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#D81B60', fontWeight: 600 }}>
                            {formatPrice ? formatPrice(item.priceAUD) : `$${item.priceAUD}`} / 1–3 days
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </form>

            {/* Wishlist */}
            <button
              type="button"
              className="nav-icon-action-btn hide-mobile"
              onClick={onOpenWishlist}
              title="Saved wishlist"
              aria-label={`Wishlist with ${wishlistCount} items`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {wishlistCount > 0 && <span className="nav-micro-counter">{wishlistCount}</span>}
            </button>

            {/* Admin Operations HQ (Desktop - Only visible to authorized administrators) */}
            <AdminNavButton onOpenAdmin={onOpenAdmin} />

            {/* Clerk User / Auth Controls (Desktop Navbar) */}
            <div className="hide-mobile">
              <AuthControls onNavigateAuth={onNavigateAuth} />
            </div>

            {/* Shopping Cart */}
            <button
              type="button"
              className="nav-cart-btn"
              onClick={onOpenCart}
              title="View Cart"
              aria-label={`Cart with ${cartCount} items`}
            >
              <div className="cart-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span className="cart-badge-number">{cartCount}</span>
              </div>
              <span className="cart-btn-label hide-mobile">Cart</span>
            </button>

          </div>

        </div>
        </nav>
      </header>
    </>
  );
}
