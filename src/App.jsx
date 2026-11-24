import React, { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/react';
import { PRODUCTS, CURRENCIES, CATEGORIES, INITIAL_ORDERS } from './data/products';
import { isConvexConfigured } from './convexClient';
import { useConvexStore, useLocalStore } from './hooks/useProductsData';
import { useConvexCategoriesStore, useLocalCategoriesStore } from './hooks/useCategoriesData';
import { useConvexBookingsStore, useLocalBookingsStore } from './hooks/useBookingsData';
import Header from './components/Header';
import Hero from './components/Hero';
import BentoPromos from './components/BentoPromos';
import HowItWorks from './components/HowItWorks';
import ShopPage from './components/ShopPage';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CategoriesDrawer from './components/CategoriesDrawer';
import QuickViewModal from './components/QuickViewModal';
import CheckoutModal from './components/CheckoutModal';
import TrackOrderModal from './components/TrackOrderModal';
import ReviewModal from './components/ReviewModal';
import AdminPanel from './components/AdminPanel';
import AdminAuthGuard from './components/AdminAuthGuard';
import MobileBottomBar from './components/MobileBottomBar';
import AuthPage from './components/AuthPage';
import Toast from './components/Toast';
import ConvexSafeBoundary from './components/ConvexSafeBoundary';
import { Agentation } from 'agentation';
import { useLenisScroll } from './hooks/useLenisScroll';

const PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  import.meta.env.CLERK_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

/**
 * Main application interface rendered with either Convex Real-time Cloud store
 * or local state fallback depending on whether VITE_CONVEX_URL is configured in Vercel.
 */
function AppContent({
  store,
  categoriesStore,
  bookingsStore,
  toasts,
  addToast,
  isSignedIn = false,
  isAuthLoaded = true,
  authUser = null,
  openSignIn,
  openSignUp
}) {
  const {
    products,
    isRealtime,
    handleAdd,
    handleUpdate,
    handleDelete,
    handleUpdateStock,
    handleReset
  } = store;

  const {
    categories,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleResetCategories
  } = categoriesStore;

  const {
    bookings,
    handleUpdateBookingStatus,
    handleAddBooking,
    handleDeleteBooking
  } = bookingsStore;

  const [rejectedOrderAlert, setRejectedOrderAlert] = useState(null);

  // Real-time detection when an order placed by this user is deleted/rejected by the Owner
  useEffect(() => {
    try {
      const myOrderIds = JSON.parse(localStorage.getItem('icon_my_order_ids') || '[]');
      const dismissedIds = JSON.parse(localStorage.getItem('icon_dismissed_rejected_orders') || '[]');
      const localNotices = JSON.parse(localStorage.getItem('icon_rejected_order_notices') || '[]');
      const userEmail = authUser?.primaryEmailAddress?.emailAddress?.toLowerCase() || '';

      // Find any booking belonging to this user that has status === 'Rejected'
      const rejectedFromBookings = (bookings || []).find((b) => {
        if ((b.status || '').toLowerCase() !== 'rejected') return false;
        if (dismissedIds.includes(b.id)) return false;
        const isMyId = myOrderIds.includes(b.id);
        const isMyEmail = userEmail && b.email && b.email.toLowerCase() === userEmail;
        return isMyId || isMyEmail;
      });

      const rejectedFromLocalNotice = localNotices.find((n) => {
        if (dismissedIds.includes(n.id)) return false;
        const isMyId = myOrderIds.includes(n.id);
        const isMyEmail = userEmail && n.email && n.email.toLowerCase() === userEmail;
        return isMyId || isMyEmail;
      });

      const found = rejectedFromBookings || rejectedFromLocalNotice;
      if (found && (!rejectedOrderAlert || rejectedOrderAlert.id !== found.id)) {
        setRejectedOrderAlert(found);
        addToast?.(`Notice: Your order #${found.id} was rejected by the Owner.`, 'warning');
      }
    } catch {}
  }, [bookings, authUser]);

  const handleDismissRejectedOrder = (orderId) => {
    try {
      const dismissedIds = JSON.parse(localStorage.getItem('icon_dismissed_rejected_orders') || '[]');
      if (!dismissedIds.includes(orderId)) {
        dismissedIds.push(orderId);
        localStorage.setItem('icon_dismissed_rejected_orders', JSON.stringify(dismissedIds));
      }
    } catch {}
    setRejectedOrderAlert(null);
  };

  // Navigation View: 'home', 'catalog', 'sign-in', 'sign-up'
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('sign-up')) return 'sign-up';
      if (path.includes('sign-in')) return 'sign-in';
      if (path.includes('catalog') || path.includes('shop')) return 'catalog';
    }
    return 'home';
  });
  useLenisScroll(currentView);

  useEffect(() => {
    const handleRouteCheck = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('admin') || hash === '#admin') {
        setIsAdminOpen(true);
      } else if (path.includes('sign-up')) {
        setCurrentView('sign-up');
      } else if (path.includes('sign-in')) {
        setCurrentView('sign-in');
      } else if (path.includes('catalog') || path.includes('shop')) {
        setCurrentView('catalog');
      } else {
        setCurrentView('home');
      }
    };

    // Check on initial mount
    const initialPath = window.location.pathname.toLowerCase();
    const initialHash = window.location.hash.toLowerCase();
    if (initialPath.includes('admin') || initialHash === '#admin') {
      setIsAdminOpen(true);
    }

    window.addEventListener('popstate', handleRouteCheck);
    window.addEventListener('hashchange', handleRouteCheck);
    return () => {
      window.removeEventListener('popstate', handleRouteCheck);
      window.removeEventListener('hashchange', handleRouteCheck);
    };
  }, []);

  // --- Persistent State (Default to AUD for Brisbane, QLD) ---
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('icon_currency') || 'AUD';
  });

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('icon_cart')) || [{ productId: 'icon-01', qty: 1 }];
    } catch {
      return [{ productId: 'icon-01', qty: 1 }];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('icon_wishlist')) || ['icon-03', 'icon-17'];
    } catch {
      return ['icon-03', 'icon-17'];
    }
  });

  // --- UI Modals & Drawers ---
  const [activeCategory, setActiveCategory] = useState('all');
  const [quickViewId, setQuickViewId] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('icon_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('icon_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const setCurrency = (code) => {
    if (CURRENCIES[code]) {
      setCurrencyState(code);
      localStorage.setItem('icon_currency', code);
      addToast(`Currency updated to ${code} (${CURRENCIES[code].symbol})`, 'gold');
    }
  };

  // Price Formatter in AUD / Currency
  const formatPrice = (amount) => {
    const curr = CURRENCIES[currency] || CURRENCIES.AUD;
    const base = typeof amount === 'number' ? amount : 0;
    const converted = Math.round(base * curr.rate);
    return `${curr.symbol}${converted.toLocaleString()}`;
  };

  // Cart Operations — Protected by User Authentication
  const handleAddToCart = (productId, qty = 1) => {
    // A user cannot buy or add items to cart before creating an account or signing in
    if (PUBLISHABLE_KEY && !isSignedIn) {
      addToast('Please sign in or create an account to hire equipment', 'warning');
      if (typeof openSignIn === 'function') {
        try {
          openSignIn();
        } catch {
          handleNavigateAuth('sign-in');
        }
      } else {
        handleNavigateAuth('sign-in');
      }
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item =>
          item.productId === productId ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { productId, qty }];
    });
    const prod = products.find(p => p.id === productId);
    addToast(`Added "${prod?.name || 'Equipment'}" to your hire bag`, 'success');
  };

  const handleProceedToCheckout = () => {
    if (PUBLISHABLE_KEY && !isSignedIn) {
      addToast('Please sign in or create an account to proceed with booking', 'warning');
      if (typeof openSignIn === 'function') {
        try {
          openSignIn();
        } catch {
          handleNavigateAuth('sign-in');
        }
      } else {
        handleNavigateAuth('sign-in');
      }
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQty = (productId, delta) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.productId === productId) {
            const nextQty = item.qty + delta;
            return nextQty > 0 ? { ...item, qty: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
    addToast('Item removed from hire bag', 'info');
  };

  const handleCompleteOrder = (orderData) => {
    const totalAUD = cart.reduce((sum, item) => {
      const prod = item.product || products.find(p => p.id === item.productId);
      const qty = item.quantity || item.qty || 1;
      return sum + (Number(prod?.priceAUD) || 0) * qty;
    }, 0);
    const itemNames = cart.map(item => {
      const prod = item.product || products.find(p => p.id === item.productId);
      const qty = item.quantity || item.qty || 1;
      return `${prod?.name || 'Equipment'} (x${qty})`;
    });
    const userEmail = authUser?.primaryEmailAddress?.emailAddress || orderData?.email || 'customer@eventhire.com.au';

    const newBooking = {
      id: orderData?.id || `IPH-AU-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: orderData?.customerName || 'Customer Reservation',
      phone: orderData?.phone || '+61 400 000 000',
      email: userEmail,
      city: orderData?.city || 'Brisbane QLD',
      eventDate: orderData?.eventDate || 'Upcoming Weekend',
      eventType: orderData?.eventType || 'Party & Event Celebration',
      items: itemNames.length > 0 ? itemNames : ['Event Equipment Hire Package'],
      totalAUD: totalAUD > 0 ? totalAUD : 350,
      status: 'Confirmed',
      carrier: orderData?.carrier || 'Icon Van 1 (Brisbane Delivery)',
      tracking: `IPH-DEL-${Math.floor(10000 + Math.random() * 90000)}`,
      date: 'Just now',
      paymentStatus: 'Paid ($100 Bond Held)'
    };

    try {
      const myOrderIds = JSON.parse(localStorage.getItem('icon_my_order_ids') || '[]');
      if (!myOrderIds.includes(newBooking.id)) {
        myOrderIds.push(newBooking.id);
        localStorage.setItem('icon_my_order_ids', JSON.stringify(myOrderIds));
      }
    } catch {}

    handleAddBooking(newBooking);
    setCart([]);
  };

  // Wishlist Operations
  const handleToggleWishlist = (productId) => {
    const prod = products.find(p => p.id === productId);
    if (wishlist.includes(productId)) {
      setWishlist(prev => prev.filter(id => id !== productId));
      addToast(`Removed from saved equipment`, 'info');
    } else {
      setWishlist(prev => [...prev, productId]);
      addToast(`Saved "${prod?.name || 'Equipment'}" to Wishlist`, 'gold');
    }
  };

  // Close all overlay drawers helper
  const closeAllDrawers = () => {
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setIsCategoriesOpen(false);
    setIsTrackOrderOpen(false);
    setIsCheckoutOpen(false);
    setQuickViewId(null);
  };

  // Mutually exclusive drawer openers (so drawers NEVER stack on top of each other)
  const handleOpenCart = () => {
    closeAllDrawers();
    setIsCartOpen(true);
  };

  const handleOpenWishlist = () => {
    closeAllDrawers();
    setIsWishlistOpen(true);
  };

  const handleOpenCategories = () => {
    closeAllDrawers();
    setIsCategoriesOpen(true);
  };

  // Navigation handlers
  const handleNavigateHome = () => {
    closeAllDrawers();
    setCurrentView('home');
    try {
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
      }
    } catch {}
    if (window.__iconLenis) {
      window.__iconLenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
  };

  const handleNavigateCatalog = (categoryKey = 'all') => {
    closeAllDrawers();
    setActiveCategory(categoryKey);
    setCurrentView('catalog');
    try {
      if (!window.location.pathname.includes('catalog') && !window.location.pathname.includes('shop')) {
        window.history.pushState(null, '', '/shop');
      }
    } catch {}
    if (window.__iconLenis) {
      window.__iconLenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
  };

  const handleScrollToCategories = () => {
    closeAllDrawers();
    // On mobile devices, categories showcase is hidden on home screen: navigate directly to dedicated hire catalog
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      handleNavigateCatalog('all');
      return;
    }
    if (currentView !== 'home') {
      setCurrentView('home');
      try {
        window.history.pushState(null, '', '/');
      } catch {}
    }
    setTimeout(() => {
      const el = document.getElementById('categories-section');
      if (el) {
        if (window.__iconLenis) {
          window.__iconLenis.scrollTo(el, { offset: -70, duration: 1.1 });
        } else {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 60);
  };

  const handleNavigateAuth = (mode = 'sign-up') => {
    closeAllDrawers();
    setCurrentView(mode);
    try {
      window.history.pushState(null, '', mode === 'sign-up' ? '/sign-up' : '/sign-in');
    } catch {}
    if (window.__iconLenis) {
      window.__iconLenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
  };

  const quickViewProduct = quickViewId ? products.find(p => p.id === quickViewId) : null;
  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // Pause Lenis smooth scroll while Admin Operations Portal is open to ensure 100% native mouse wheel scrolling
  useEffect(() => {
    if (isAdminOpen && window.__iconLenis) {
      window.__iconLenis.stop();
      return () => {
        window.__iconLenis?.start();
      };
    }
  }, [isAdminOpen]);

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    try {
      sessionStorage.removeItem('icon_admin_passcode_auth');
      localStorage.removeItem('icon_admin_passcode_auth');
    } catch {}
    try {
      if (window.location.pathname.includes('admin') || window.location.hash.includes('admin')) {
        window.history.pushState(null, '', '/');
      }
    } catch {}
  };

  // If Admin Panel is Open, render full Admin Operations Portal
  if (isAdminOpen) {
    return (
      <div className="icon-admin-app" data-lenis-prevent="true">
        <AdminAuthGuard onClose={handleCloseAdmin}>
          <AdminPanel
            onClose={handleCloseAdmin}
            products={products}
            categories={categories}
            bookings={bookings}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onAddBooking={handleAddBooking}
            onDeleteBooking={handleDeleteBooking}
            isRealtime={isRealtime}
            onAddProduct={handleAdd}
            onUpdateProduct={handleUpdate}
            onDeleteProduct={handleDelete}
            onUpdateProductStock={handleUpdateStock}
            onResetProducts={handleReset}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
            onResetCategories={handleResetCategories}
            onToast={addToast}
          />
        </AdminAuthGuard>
        <Toast toasts={toasts} />
      </div>
    );
  }

  return (
    <div className="icon-app">
      {/* 1. Luxury Editorial Header */}
      <Header
        currentView={currentView}
        currency={currency}
        setCurrency={setCurrency}
        formatPrice={formatPrice}
        products={products}
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onNavigateHome={handleNavigateHome}
        onNavigateCatalog={handleNavigateCatalog}
        onOpenCategories={handleOpenCategories}
        onOpenQuickView={(id) => {
          closeAllDrawers();
          setQuickViewId(id);
        }}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={handleOpenCart}
        onOpenWishlist={handleOpenWishlist}
        onOpenTrackOrder={() => {
          closeAllDrawers();
          setIsTrackOrderOpen(true);
        }}
        onOpenAdmin={() => {
          closeAllDrawers();
          setIsAdminOpen(true);
        }}
        onOpenMobileMenu={handleOpenCategories}
        onNavigateAuth={handleNavigateAuth}
      />

      <main>
        {currentView === 'sign-in' || currentView === 'sign-up' ? (
          <AuthPage
            mode={currentView}
            onBackHome={handleNavigateHome}
            onSwitchMode={(mode) => handleNavigateAuth(mode)}
          />
        ) : currentView === 'home' ? (
          /* =================================================================
             HOME PAGE: CLEAN EDITORIAL LUXURY SHOWCASE
             (Product listings and category cards shifted to dedicated Shop Page)
             ================================================================= */
          <>
            {/* Hero Banner with Direct CTA to Dedicated Hire Shop */}
            <Hero
              onExploreCategories={() => handleNavigateCatalog('all')}
              onViewCatalog={() => handleNavigateCatalog('all')}
            />

            {/* 3-Column Promo Bento Banners: The 3 Pillars of Icon */}
            <BentoPromos
              onSelectCategory={(catId) => handleNavigateCatalog(catId)}
            />

            {/* How It Works: 3-Step Simple Process */}
            <HowItWorks
              onExploreCatalog={() => handleNavigateCatalog('all')}
            />

            {/* Luxury Service Regions Showcase Banner */}
            <section className="service-regions-showcase" aria-label="South East Queensland Service Areas">
              <div className="container">
                <div className="service-regions-card">
                  <div className="service-regions-glow service-glow-left" aria-hidden="true" />
                  <div className="service-regions-glow service-glow-right" aria-hidden="true" />
                  <span className="service-regions-kicker">South East Queensland Event Dispatch</span>
                  <h2 className="service-regions-heading">
                    We Service <span className="service-region-highlight">Brisbane</span> – <span className="service-region-highlight">Sunshine Coast</span> – <span className="service-region-highlight">Gold Coast</span> &amp; Surroundings
                  </h2>
                  <div className="service-regions-pills">
                    <span className="service-region-pill">Brisbane Metro</span>
                    <span className="service-region-dot">✦</span>
                    <span className="service-region-pill">Sunshine Coast</span>
                    <span className="service-region-dot">✦</span>
                    <span className="service-region-pill">Gold Coast</span>
                    <span className="service-region-dot">✦</span>
                    <span className="service-region-pill">&amp; Surroundings</span>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* =================================================================
             DEDICATED SEPARATE SHOP PAGE: WINK-INSPIRED HIRE CATALOG & FILTERS
             ================================================================= */
          <ShopPage
            products={products}
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onBackToHome={handleNavigateHome}
            formatPrice={formatPrice}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onOpenQuickView={(id) => {
              closeAllDrawers();
              setQuickViewId(id);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        currency={currency}
        setCurrency={setCurrency}
        onSelectCategory={(catId) => handleNavigateCatalog(catId)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
      />

      {/* Mobile Bottom Navigation Bar removed — shifted into top navbar hamburger drawer */}

      {/* --- Drawers & Modals --- */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        products={products}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleProceedToCheckout}
        formatPrice={formatPrice}
        isSignedIn={isSignedIn}
        onToast={addToast}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        products={products}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        formatPrice={formatPrice}
      />

      <CategoriesDrawer
        isOpen={isCategoriesOpen}
        onClose={() => setIsCategoriesOpen(false)}
        currentView={currentView}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onNavigateHome={handleNavigateHome}
        onNavigateCatalog={handleNavigateCatalog}
        onOpenCart={handleOpenCart}
        onOpenWishlist={handleOpenWishlist}
        onOpenTrackOrder={() => {
          closeAllDrawers();
          setIsTrackOrderOpen(true);
        }}
        onNavigateAuth={handleNavigateAuth}
        categories={categories}
        onSelectCategory={(catId) => {
          setIsCategoriesOpen(false);
          handleNavigateCatalog(catId);
        }}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewId(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
        formatPrice={formatPrice}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onCompleteOrder={handleCompleteOrder}
        isSignedIn={isSignedIn}
        user={authUser}
        onRequireAuth={() => {
          setIsCheckoutOpen(false);
          if (typeof openSignIn === 'function') {
            try {
              openSignIn();
            } catch {
              handleNavigateAuth('sign-in');
            }
          } else {
            handleNavigateAuth('sign-in');
          }
        }}
      />

      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
        onToast={addToast}
        bookings={bookings}
      />

      {/* User Order Rejected by Owner Notification Modal */}
      {rejectedOrderAlert && (
        <>
          <div
            className="modal-backdrop active"
            onClick={() => handleDismissRejectedOrder(rejectedOrderAlert.id)}
          />
          <div className="center-modal active" role="dialog" aria-modal="true" aria-label="Order Rejected Notification">
            <button
              type="button"
              className="modal-close-corner-btn"
              onClick={() => handleDismissRejectedOrder(rejectedOrderAlert.id)}
              aria-label="Close notification"
            >
              ✕
            </button>
            <div style={{ padding: '36px 28px', textAlign: 'center' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: '#FEF2F2',
                  border: '2px solid #FECACA',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px auto',
                  fontSize: '1.75rem',
                  fontWeight: 800
                }}
              >
                !
              </div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  background: '#FEF2F2',
                  color: '#DC2626',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '10px'
                }}
              >
                Booking Status Update
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  color: '#1B061A',
                  margin: '0 0 10px 0'
                }}
              >
                Your Order Was Rejected by the Owner
              </h3>
              <p
                style={{
                  fontSize: '0.92rem',
                  lineHeight: 1.6,
                  color: '#475569',
                  maxWidth: 440,
                  margin: '0 auto 18px auto'
                }}
              >
                Your event hire order <strong>#{rejectedOrderAlert.id}</strong>
                {rejectedOrderAlert.eventDate ? ` scheduled for ${rejectedOrderAlert.eventDate}` : ''} has been rejected and removed by the Owner.
              </p>
              {Array.isArray(rejectedOrderAlert.items) && rejectedOrderAlert.items.length > 0 && (
                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '0.82rem',
                    color: '#334155',
                    marginBottom: '22px'
                  }}
                >
                  <strong>Items:</strong> {rejectedOrderAlert.items.join(', ')}
                </div>
              )}
              <button
                type="button"
                className="btn-primary"
                style={{ minWidth: 220, justifyContent: 'center' }}
                onClick={() => handleDismissRejectedOrder(rejectedOrderAlert.id)}
              >
                Acknowledge &amp; Close
              </button>
            </div>
          </div>
        </>
      )}

      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onToast={addToast}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} />

      {/* Visual Feedback for AI Coding Agents */}
      {import.meta.env.DEV && <Agentation />}
    </div>
  );
}

function AppContentWithClerk(props) {
  const { isSignedIn, isLoaded, user } = useUser();
  const { openSignIn, openSignUp } = useClerk();
  return (
    <AppContent
      {...props}
      isSignedIn={Boolean(isSignedIn)}
      isAuthLoaded={Boolean(isLoaded)}
      authUser={user}
      openSignIn={openSignIn}
      openSignUp={openSignUp}
    />
  );
}

function AppContentRouter(props) {
  if (PUBLISHABLE_KEY) {
    return <AppContentWithClerk {...props} />;
  }
  return (
    <AppContent
      {...props}
      isSignedIn={true}
      isAuthLoaded={true}
      authUser={null}
      openSignIn={() => {}}
      openSignUp={() => {}}
    />
  );
}

// 1. App variant with Convex Cloud real-time subscriptions
function ConvexConnectedApp() {
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'gold') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };
  const store = useConvexStore(PRODUCTS, addToast);
  const categoriesStore = useConvexCategoriesStore(CATEGORIES, addToast);
  const bookingsStore = useConvexBookingsStore(INITIAL_ORDERS, addToast);
  return (
    <AppContentRouter
      store={store}
      categoriesStore={categoriesStore}
      bookingsStore={bookingsStore}
      toasts={toasts}
      addToast={addToast}
    />
  );
}

// 2. App variant with local storage fallback when Convex URL is pending
function LocalFallbackApp() {
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'gold') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };
  const store = useLocalStore(PRODUCTS, addToast);
  const categoriesStore = useLocalCategoriesStore(CATEGORIES, addToast);
  const bookingsStore = useLocalBookingsStore(INITIAL_ORDERS, addToast);
  return (
    <AppContentRouter
      store={store}
      categoriesStore={categoriesStore}
      bookingsStore={bookingsStore}
      toasts={toasts}
      addToast={addToast}
    />
  );
}

export default function App() {
  if (isConvexConfigured) {
    return (
      <ConvexSafeBoundary fallback={<LocalFallbackApp />}>
        <ConvexConnectedApp />
      </ConvexSafeBoundary>
    );
  }
  return <LocalFallbackApp />;
}
