import React from 'react';
import {
  Home,
  ShoppingBag,
  Sparkles,
  Truck,
  Heart,
  Phone,
  MapPin,
  ShieldCheck,
  X,
  ChevronRight,
  User,
  LogIn,
  ArrowRight
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
  wishlistCount = 0,
  onNavigateHome,
  onNavigateCatalog,
  onOpenCart,
  onOpenWishlist,
  onOpenTrackOrder,
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
            <span className="mobile-drawer-tagline">Brisbane Luxury Event Hire</span>
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

        {/* Scrollable Drawer Body — STRICTLY NAVBAR CONTENT ONLY (NO CATEGORIES, NO ADMIN PANEL) */}
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

              {/* How It Works */}
              <button
                type="button"
                className="mobile-pure-nav-item"
                onClick={() => {
                  onClose();
                  if (currentView !== 'home') {
                    onNavigateHome?.();
                  }
                  setTimeout(() => {
                    const el = document.getElementById('how-it-works');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 120);
                }}
              >
                <div className="mobile-nav-item-left">
                  <div className="mobile-nav-icon-wrap">
                    <Sparkles size={20} />
                  </div>
                  <div className="mobile-nav-item-text">
                    <span className="mobile-nav-title">How It Works</span>
                    <span className="mobile-nav-desc">4 simple booking, delivery & setup steps</span>
                  </div>
                </div>
                <ChevronRight size={18} className="mobile-nav-chevron" />
              </button>

              {/* Track Delivery */}
              <button
                type="button"
                className="mobile-pure-nav-item"
                onClick={() => {
                  onClose();
                  onOpenTrackOrder?.();
                }}
              >
                <div className="mobile-nav-item-left">
                  <div className="mobile-nav-icon-wrap">
                    <Truck size={20} />
                  </div>
                  <div className="mobile-nav-item-text">
                    <span className="mobile-nav-title">Track Delivery</span>
                    <span className="mobile-nav-desc">Live dispatch & delivery status</span>
                  </div>
                </div>
                <div className="mobile-nav-item-right">
                  <span className="mobile-nav-pill-badge live">Live Status</span>
                  <ChevronRight size={18} className="mobile-nav-chevron" />
                </div>
              </button>

              {/* Saved Wishlist */}
              <button
                type="button"
                className="mobile-pure-nav-item"
                onClick={() => {
                  onClose();
                  onOpenWishlist?.();
                }}
              >
                <div className="mobile-nav-item-left">
                  <div className="mobile-nav-icon-wrap">
                    <Heart size={20} />
                  </div>
                  <div className="mobile-nav-item-text">
                    <span className="mobile-nav-title">Saved Wishlist</span>
                    <span className="mobile-nav-desc">Your favorite equipment list</span>
                  </div>
                </div>
                <div className="mobile-nav-item-right">
                  {wishlistCount > 0 && <span className="mobile-nav-counter-badge">{wishlistCount}</span>}
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

          {/* 3. Brisbane Logistics Bay & Direct Support */}
          <div className="mobile-drawer-footer">
            <div className="mobile-footer-pill">
              <MapPin size={15} className="footer-icon-pink" />
              <span>Murrumba Downs Dispatch Bay · Greater Brisbane</span>
            </div>

            <a href="tel:0423313460" className="mobile-footer-call-btn">
              <Phone size={16} />
              <span>Call Dispatch: 0423 313 460</span>
            </a>

            <div className="mobile-footer-security">
              <ShieldCheck size={14} />
              <span>100% Bond Security · Stripe Verified Equipment Hire</span>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
}
