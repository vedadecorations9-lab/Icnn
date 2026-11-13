import React, { useState, useEffect } from 'react';
import { PRODUCTS, CURRENCIES, CATEGORIES, INITIAL_ORDERS } from './data/products';
import { isConvexConfigured } from './convexClient';
import { useConvexStore, useLocalStore } from './hooks/useProductsData';
import { useConvexCategoriesStore, useLocalCategoriesStore } from './hooks/useCategoriesData';
import { useConvexBookingsStore, useLocalBookingsStore } from './hooks/useBookingsData';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoriesShowcase from './components/CategoriesShowcase';
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

/**
 * Main application interface rendered with either Convex Real-time Cloud store
 * or local state fallback depending on whether VITE_CONVEX_URL is configured in Vercel.
 */
function AppContent({ store, categoriesStore, bookingsStore, toasts, addToast }) {
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
    handleAddBooking
  } = bookingsStore;

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

  // Cart Operations
  const handleAddToCart = (productId, qty = 1) => {
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
    const totalAUD = cart.reduce((sum, item) => sum + (Number(item.product?.priceAUD) || 0) * (item.quantity || 1), 0);
    const itemNames = cart.map(item => `${item.product?.name || 'Equipment'} (x${item.quantity || 1})`);

    const newBooking = {
      id: orderData?.id || `IPH-AU-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: orderData?.customerName || 'Customer Reservation',
      phone: orderData?.phone || '+61 400 000 000',
      email: orderData?.email || 'customer@eventhire.com.au',
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
            {/* Hero Banner with Direct CTA to Categories */}
            <Hero
              onExploreCategories={handleScrollToCategories}
              onViewCatalog={() => handleNavigateCatalog('all')}
            />

            {/* Event Categories Showcase */}
            <CategoriesShowcase
              categories={categories}
              products={products}
              onExploreCategory={(catId) => handleNavigateCatalog(catId)}
              onViewAllItems={() => handleNavigateCatalog('all')}
            />

            {/* 3-Column Promo Bento Banners: The 3 Pillars of Icon */}
            <BentoPromos
              onSelectCategory={(catId) => handleNavigateCatalog(catId)}
            />

            {/* How It Works: 3-Step Simple Process */}
            <HowItWorks
              onExploreCatalog={() => handleNavigateCatalog('all')}
            />
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
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        formatPrice={formatPrice}
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
      />

      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
        onToast={addToast}
      />

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
    <AppContent
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
    <AppContent
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
