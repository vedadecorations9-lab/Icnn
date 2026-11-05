import React from 'react';
import { CATEGORIES } from '../data/products';
import {
  Home,
  Package,
  ShoppingBag,
  Heart,
  Truck,
  Settings,
  ArrowRight,
  Sparkles,
  X,
  Phone,
  MapPin,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function CategoriesDrawer({
  isOpen,
  onClose,
  currentView = 'home',
  cartCount = 0,
  wishlistCount = 0,
  onNavigateHome,
  onNavigateCatalog,
  onOpenCart,
  onOpenWishlist,
  onOpenTrackOrder,
  onOpenAdmin,
  categories = CATEGORIES,
  onSelectCategory
}) {
  if (!isOpen) return null;

  const activeCategories = categories && categories.length > 0 ? categories : CATEGORIES;

  return (
    <>
      {/* Blurred Backdrop */}
      <div className="modal-backdrop active mobile-menu-backdrop" onClick={onClose} />

      {/* Slide Drawer from Left */}
      <aside
        className="slide-drawer active mobile-nav-drawer"
        style={{ right: 'auto', left: 0, transform: 'translateX(0)' }}
        aria-label="Mobile Navigation Menu"
      >
        {/* Drawer Header with Brand Logo */}
        <div className="mobile-drawer-header">
          <div
            className="mobile-drawer-brand"
            onClick={() => {
              onClose();
              onNavigateHome?.();
            }}
            role="button"
            tabIndex={0}
          >
            <img
              src="/assets/images/icon_logo_navbar.webp"
              alt="Icon Party Hire Brisbane"
              className="mobile-drawer-logo"
            />
            <span className="mobile-drawer-tagline">Brisbane Event Hire</span>
          </div>
          <button
            type="button"
            className="mobile-drawer-close-btn"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Drawer Body */}
        <div className="mobile-drawer-body">

          {/* 1. PRIMARY STORE NAVIGATION (Shifted from Mobile Bottom Bar) */}
          <div className="mobile-drawer-section">
            <div className="mobile-drawer-section-label">NAVIGATION</div>

            <div className="mobile-hub-grid">
              {/* Home */}
              <button
                type="button"
                className={`mobile-hub-card ${currentView === 'home' ? 'active' : ''}`}
                onClick={() => {
                  onClose();
                  onNavigateHome?.();
                }}
              >
                <div className="mobile-hub-icon-box">
                  <Home size={19} />
                </div>
                <div className="mobile-hub-meta">
                  <span className="mobile-hub-title">Home</span>
                  <span className="mobile-hub-sub">Showcase</span>
                </div>
              </button>

              {/* Hire Catalog */}
              <button
                type="button"
                className={`mobile-hub-card ${currentView === 'catalog' ? 'active' : ''}`}
                onClick={() => {
                  onClose();
                  onNavigateCatalog?.('all');
                }}
              >
                <div className="mobile-hub-icon-box">
                  <Package size={19} />
                </div>
                <div className="mobile-hub-meta">
                  <span className="mobile-hub-title">Hire Catalog</span>
                  <span className="mobile-hub-sub">All Equipment</span>
                </div>
              </button>

              {/* Hire Bag / Cart */}
              <button
                type="button"
                className="mobile-hub-card"
                onClick={() => {
                  onClose();
                  onOpenCart?.();
                }}
              >
                <div className="mobile-hub-icon-box">
                  <ShoppingBag size={19} />
                  {cartCount > 0 && <span className="mobile-hub-badge">{cartCount}</span>}
                </div>
                <div className="mobile-hub-meta">
                  <span className="mobile-hub-title">Hire Bag</span>
                  <span className="mobile-hub-sub">{cartCount > 0 ? `${cartCount} items` : 'View cart'}</span>
                </div>
              </button>

              {/* Saved Wishlist */}
              <button
                type="button"
                className="mobile-hub-card"
                onClick={() => {
                  onClose();
                  onOpenWishlist?.();
                }}
              >
                <div className="mobile-hub-icon-box">
                  <Heart size={19} />
                  {wishlistCount > 0 && <span className="mobile-hub-badge">{wishlistCount}</span>}
                </div>
                <div className="mobile-hub-meta">
                  <span className="mobile-hub-title">Saved Wishlist</span>
                  <span className="mobile-hub-sub">{wishlistCount > 0 ? `${wishlistCount} saved` : 'Favorites'}</span>
                </div>
              </button>

              {/* Track Delivery */}
              <button
                type="button"
                className="mobile-hub-card"
                onClick={() => {
                  onClose();
                  onOpenTrackOrder?.();
                }}
              >
                <div className="mobile-hub-icon-box">
                  <Truck size={19} />
                </div>
                <div className="mobile-hub-meta">
                  <span className="mobile-hub-title">Track Delivery</span>
                  <span className="mobile-hub-sub">Live Status</span>
                </div>
              </button>

              {/* Operations Admin HQ */}
              <button
                type="button"
                className="mobile-hub-card admin-hub-card"
                onClick={() => {
                  onClose();
                  onOpenAdmin?.();
                }}
              >
                <div className="mobile-hub-icon-box">
                  <Settings size={19} />
                </div>
                <div className="mobile-hub-meta">
                  <span className="mobile-hub-title">Operations HQ</span>
                  <span className="mobile-hub-sub">Admin Portal</span>
                </div>
              </button>
            </div>
          </div>

          {/* 2. BROWSE BY CATEGORY */}
          <div className="mobile-drawer-section">
            <div className="mobile-drawer-section-label">
              <span>HIRE CATEGORIES</span>
              <span className="mobile-category-count-badge">{activeCategories.length} Categories</span>
            </div>

            <div className="mobile-categories-stack">
              {activeCategories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className="mobile-category-row"
                  onClick={() => {
                    onClose();
                    onSelectCategory ? onSelectCategory(cat.id) : onNavigateCatalog?.(cat.id);
                  }}
                >
                  <div className="mobile-cat-left">
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="mobile-cat-thumb"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/images/items/Icon 6x3 m Gazebo Hire-2-1024x1024.webp';
                      }}
                    />
                    <div className="mobile-cat-info">
                      <span className="mobile-cat-name">{cat.label}</span>
                      <span className="mobile-cat-price">From ${cat.startingPrice} AUD</span>
                    </div>
                  </div>
                  <ChevronRight size={17} className="mobile-cat-chevron" />
                </button>
              ))}

              {/* View All Button */}
              <button
                type="button"
                className="mobile-view-all-cta"
                onClick={() => {
                  onClose();
                  onSelectCategory ? onSelectCategory('all') : onNavigateCatalog?.('all');
                }}
              >
                <div className="cta-inner">
                  <Sparkles size={16} />
                  <span>View All Equipment ({activeCategories.length} Categories)</span>
                </div>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* 3. WAREHOUSE & SUPPORT FOOTER */}
          <div className="mobile-drawer-footer">
            <div className="mobile-footer-pill">
              <MapPin size={14} className="footer-icon-pink" />
              <span>Murrumba Downs Dispatch Bay · Greater Brisbane</span>
            </div>

            <a href="tel:0423313460" className="mobile-footer-call-btn">
              <Phone size={15} />
              <span>Call Dispatch: 0423 313 460</span>
            </a>

            <div className="mobile-footer-security">
              <ShieldCheck size={14} />
              <span>100% Bond Security · Stripe Verified Booking</span>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
}
