import React from 'react';
import {
  Home,
  ShoppingBag,
  Phone,
  X,
  ChevronRight,
  User,
  LogIn
} from 'lucide-react';
import { useUser, UserButton, SignInButton } from '@clerk/react';

const PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  import.meta.env.CLERK_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function ClerkDrawerProfile({ onClose, onNavigateAuth }) {
  if (!PUBLISHABLE_KEY) {
    return (
      <button
        type="button"
        className="mobile-auth-cta-card"
        onClick={() => {
          onClose();
          onNavigateAuth?.('sign-in');
        }}
      >
        <div className="mobile-auth-icon-box">
          <LogIn size={20} />
        </div>
        <div className="mobile-auth-meta">
          <span className="mobile-auth-title">Sign In / Create Account</span>
          <span className="mobile-auth-sub">Manage your Brisbane event bookings</span>
        </div>
        <ChevronRight size={18} className="mobile-nav-arrow" />
      </button>
    );
  }

  try {
    const { isLoaded, isSignedIn, user } = useUser();

    if (!isLoaded) {
      return (
        <div className="mobile-auth-loading-pill">
          <span className="mobile-auth-spinner" />
          <span>Checking account status...</span>
        </div>
      );
    }

    if (isSignedIn) {
      const displayName = user?.firstName || user?.fullName || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || 'Client';
      return (
        <div className="mobile-auth-signedin-card">
          <div className="mobile-user-row">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: {
                    width: 42,
                    height: 42,
                    border: '2px solid rgba(216, 27, 96, 0.4)',
                    boxShadow: '0 4px 12px rgba(27, 6, 26, 0.1)'
                  }
                }
              }}
            />
            <div className="mobile-user-details">
              <span className="mobile-user-greeting">Welcome back,</span>
              <span className="mobile-user-name">{displayName}</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <SignInButton mode="modal">
        <button
          type="button"
          className="mobile-auth-cta-card"
          onClick={() => {
            onClose();
          }}
        >
          <div className="mobile-auth-icon-box">
            <User size={20} />
          </div>
          <div className="mobile-auth-meta">
            <span className="mobile-auth-title">Sign In / Create Account</span>
            <span className="mobile-auth-sub">Track quotes, bonds & bookings</span>
          </div>
          <ChevronRight size={18} className="mobile-nav-arrow" />
        </button>
      </SignInButton>
    );
  } catch (err) {
    return (
      <button
        type="button"
        className="mobile-auth-cta-card"
        onClick={() => {
          onClose();
          onNavigateAuth?.('sign-in');
        }}
      >
        <div className="mobile-auth-icon-box">
          <LogIn size={20} />
        </div>
        <div className="mobile-auth-meta">
          <span className="mobile-auth-title">Sign In / Register</span>
          <span className="mobile-auth-sub">Manage your hire reservations</span>
        </div>
        <ChevronRight size={18} className="mobile-nav-arrow" />
      </button>
    );
  }
}

export default function CategoriesDrawer({
  isOpen,
  onClose,
  currentView = 'home',
  cartCount = 0,
  onNavigateHome,
  onNavigateCatalog,
  onOpenCart,
  onNavigateAuth
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* High-priority Backdrop */}
      <div className="modal-backdrop active mobile-menu-backdrop" onClick={onClose} />

      {/* Slide Drawer from Left with high z-index (sits safely above the floating navbar) */}
      <aside
        className="slide-drawer active mobile-nav-drawer"
        style={{ right: 'auto', left: 0, transform: 'translateX(0)' }}
        aria-label="Mobile Navigation Menu"
      >
        {/* Drawer Header with Brand Logo & Close Action */}
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

        {/* Scrollable Drawer Body — Streamlined Navbar Navigation */}
        <div className="mobile-drawer-body">

          {/* 1. Profile / Sign In Section */}
          <div className="mobile-drawer-auth-block">
            <ClerkDrawerProfile onClose={onClose} onNavigateAuth={onNavigateAuth} />
          </div>

          {/* 2. Pure Primary Navigation Menu */}
          <div className="mobile-drawer-section">
            <div className="mobile-drawer-section-label">EXPLORE STOREFRONT</div>

            <nav className="mobile-pure-nav-list" aria-label="Mobile Navigation Links">
              
              {/* Hire Shop */}
              <button
                type="button"
                className={`mobile-pure-nav-item ${currentView === 'catalog' ? 'active' : ''}`}
                onClick={() => {
                  onClose();
                  onNavigateCatalog?.('all');
                }}
              >
                <div className="mobile-nav-item-left">
                  <div className="mobile-nav-icon-wrap primary">
                    <ShoppingBag size={20} />
                  </div>
                  <div className="mobile-nav-item-text">
                    <span className="mobile-nav-title">Hire Shop</span>
                    <span className="mobile-nav-desc">Browse commercial equipment catalog</span>
                  </div>
                </div>
                <div className="mobile-nav-item-right">
                  <span className="mobile-nav-pill-badge">All Gear</span>
                  <ChevronRight size={18} className="mobile-nav-chevron" />
                </div>
              </button>

              {/* Hire Bag */}
              <button
                type="button"
                className="mobile-pure-nav-item"
                onClick={() => {
                  onClose();
                  onOpenCart?.();
                }}
              >
                <div className="mobile-nav-item-left">
                  <div className="mobile-nav-icon-wrap">
                    <ShoppingBag size={20} />
                  </div>
                  <div className="mobile-nav-item-text">
                    <span className="mobile-nav-title">Hire Bag</span>
                    <span className="mobile-nav-desc">Review selected gear & checkout</span>
                  </div>
                </div>
                <div className="mobile-nav-item-right">
                  {cartCount > 0 && <span className="mobile-nav-counter-badge cart">{cartCount}</span>}
                  <ChevronRight size={18} className="mobile-nav-chevron" />
                </div>
              </button>

              {/* Home */}
              <button
                type="button"
                className={`mobile-pure-nav-item ${currentView === 'home' ? 'active' : ''}`}
                onClick={() => {
                  onClose();
                  onNavigateHome?.();
                }}
              >
                <div className="mobile-nav-item-left">
                  <div className="mobile-nav-icon-wrap">
                    <Home size={20} />
                  </div>
                  <div className="mobile-nav-item-text">
                    <span className="mobile-nav-title">Home</span>
                    <span className="mobile-nav-desc">Icon party hire showcase</span>
                  </div>
                </div>
                <ChevronRight size={18} className="mobile-nav-chevron" />
              </button>

            </nav>
          </div>

          {/* 3. Direct Support Call */}
          <div className="mobile-drawer-footer">
            <a href="tel:0439592472" className="mobile-footer-call-btn">
              <Phone size={16} />
              <span>Call 0439 592 472</span>
            </a>
          </div>

        </div>
      </aside>
    </>
  );
}
