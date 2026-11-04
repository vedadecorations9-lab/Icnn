import React, { useState, useEffect } from 'react';
import { PRODUCTS, CURRENCIES, CATEGORIES } from './data/products';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoriesShowcase from './components/CategoriesShowcase';
import BentoPromos from './components/BentoPromos';
import HowItWorks from './components/HowItWorks';
import ProductGrid from './components/ProductGrid';
import TrustStrip from './components/TrustStrip';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CategoriesDrawer from './components/CategoriesDrawer';
import QuickViewModal from './components/QuickViewModal';
import CheckoutModal from './components/CheckoutModal';
import TrackOrderModal from './components/TrackOrderModal';
import ReviewModal from './components/ReviewModal';
import AdminPanel from './components/AdminPanel';
import MobileBottomBar from './components/MobileBottomBar';
import Toast from './components/Toast';
import { Agentation } from 'agentation';
import { useLenisScroll } from './hooks/useLenisScroll';

export default function App() {
  // Navigation View: 'home' (Categories on Home) vs 'catalog' (Dedicated Separate Items Page)
  const [currentView, setCurrentView] = useState('home');
  useLenisScroll(currentView);

  // --- Persistent State (Default to AUD for Brisbane, QLD) ---
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('icon_currency') || 'AUD';
  });

  const [products, setProducts] = useState(PRODUCTS);

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
  const [toasts, setToasts] = useState([]);

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

  // Toast Handler
  const addToast = (message, type = 'gold') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
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

  const handleCompleteOrder = () => {
    setCart([]);
    addToast('Booking confirmed! Brisbane logistics dispatch scheduled.', 'success');
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

  // Navigation handlers
  const handleNavigateHome = () => {
    setCurrentView('home');
    if (window.__iconLenis) {
      window.__iconLenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateCatalog = (categoryKey = 'all') => {
    setActiveCategory(categoryKey);
    setCurrentView('catalog');
    if (window.__iconLenis) {
      window.__iconLenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Admin Operations
  const handleAddProduct = (newProd) => {
    setProducts(prev => [newProd, ...prev]);
  };

  const handleUpdateProductStock = (id, newStock) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, stock: newStock } : p))
    );
    addToast('Equipment inventory updated in Brisbane warehouse', 'gold');
  };

  const quickViewProduct = quickViewId ? products.find(p => p.id === quickViewId) : null;
  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // If Admin Panel is Open, render full Admin Operations Portal
  if (isAdminOpen) {
    return (
      <div className="icon-admin-app">
        <AdminPanel
          onClose={() => setIsAdminOpen(false)}
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProductStock={handleUpdateProductStock}
          onToast={addToast}
        />
        <Toast toasts={toasts} />
      </div>
    );
  }

  return (
    <div className="icon-app">
      
      {/* 2. Unified Luxury Editorial Header */}
      <Header
        currentView={currentView}
        currency={currency}
        setCurrency={setCurrency}
        formatPrice={formatPrice}
        products={products}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onNavigateHome={handleNavigateHome}
        onNavigateCatalog={handleNavigateCatalog}
        onOpenCategories={() => setIsCategoriesOpen(true)}
        onOpenQuickView={(id) => setQuickViewId(id)}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenMobileMenu={() => setIsCategoriesOpen(true)}
      />

      <main>
        {currentView === 'home' ? (
          /* =================================================================
             HOME PAGE: SHOWCASES ONLY CATEGORIES (LEADING TO ITEMS)
             ================================================================= */
          <>
            {/* Hero Banner with High Contrast Editorial Content */}
            <Hero
              onExploreCategories={() => {
                const el = document.getElementById('categories-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onViewCatalog={() => handleNavigateCatalog('all')}
            />

            {/* Core Home Showcase: Rich Category Cards leading to Items (Vertical Scroll + Smooth Emerge) */}
            <CategoriesShowcase
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

            {/* Service & Equipment Guarantees Strip */}
            <TrustStrip />
          </>
        ) : (
          /* =================================================================
             DEDICATED SEPARATE ITEMS PAGE: ALL HIRE PRODUCTS & FILTERING
             ================================================================= */
          <ProductGrid
            products={products}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onBackToHome={handleNavigateHome}
            formatPrice={formatPrice}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onOpenQuickView={(id) => setQuickViewId(id)}
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

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomBar
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onNavigateHome={handleNavigateHome}
        onNavigateCatalog={handleNavigateCatalog}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCategories={() => setIsCategoriesOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

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
