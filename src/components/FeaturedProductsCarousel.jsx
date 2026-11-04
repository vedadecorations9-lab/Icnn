import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Sparkles, Clock, Flame } from 'lucide-react';
import { getProductPills } from '../data/products';

export default function FeaturedProductsCarousel({
  products,
  formatPrice,
  wishlist = [],
  onToggleWishlist,
  onAddToCart,
  onOpenQuickView,
  onViewAll
}) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Live countdown timer for seasonal weekend booking urgency (similar to Image 3)
  const [timeLeft, setTimeLeft] = useState({ hours: 9, minutes: 39, seconds: 16 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter curated top picks for this season's must-haves
  const mustHaves = products.filter(p =>
    ['icon-01', 'icon-03', 'icon-04', 'icon-09', 'icon-14', 'icon-16', 'icon-18', 'icon-20'].includes(p.id)
  );

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const handleScrollBy = (direction) => {
    if (!scrollRef.current) return;
    const offset = scrollRef.current.clientWidth * 0.75 * direction;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <section className="musthave-section" aria-label="This Season's Must-Haves">
      <div className="container">
        
        {/* Section Header */}
        <div className="musthave-header">
          <div className="musthave-header-copy">
            <div className="musthave-urgency-row">
              <span className="musthave-badge">
                <Flame size={13} className="text-pink-500" />
                <span>Brisbane Most-Hired</span>
              </span>
              <div className="musthave-timer-pill" title="Next delivery dispatch cutoff">
                <Clock size={13} />
                <span>Next Weekend Dispatch In: <strong>{pad(timeLeft.hours)}h : {pad(timeLeft.minutes)}m : {pad(timeLeft.seconds)}s</strong></span>
              </div>
            </div>

            <h2 className="musthave-title">
              This Season's <span className="hero-fancy-text">Must-Haves</span>
            </h2>
            <p className="musthave-sub">
              Trending event centerpieces, commercial gazebos, and luxury backdrops in high demand across Brisbane.
            </p>
          </div>

          {/* Desktop Arrow Controls */}
          <div className="musthave-controls hide-mobile">
            <button
              type="button"
              className={`musthave-arrow-btn ${!canScrollLeft ? 'disabled' : ''}`}
              onClick={() => handleScrollBy(-1)}
              aria-label="Previous products"
              disabled={!canScrollLeft}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className={`musthave-arrow-btn ${!canScrollRight ? 'disabled' : ''}`}
              onClick={() => handleScrollBy(1)}
              aria-label="Next products"
              disabled={!canScrollRight}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Horizontal Side-by-Side Scrolling Product Track (Image 3 layout) */}
        <div className="musthave-carousel-track" ref={scrollRef}>
          {mustHaves.map(prod => {
            const isSaved = wishlist.includes(prod.id);
            const priceDisplay = formatPrice(prod.priceAUD || prod.priceINR);
            const pills = getProductPills(prod);

            return (
              <article
                key={prod.id}
                className="modern-design-card musthave-product-card"
                onClick={() => onOpenQuickView?.(prod.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenQuickView?.(prod.id);
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
                      onToggleWishlist?.(prod.id);
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

                  {/* Top-Right Scallop Notch: PRICE ONLY */}
                  <div className="modern-card-notch">
                    <span className="modern-card-price">{priceDisplay}</span>
                  </div>

                  {/* Bottom Availability Pill */}
                  <div className="modern-card-bottom-strip">
                    <span className="modern-card-bottom-pill">
                      {prod.badge || 'Fast Brisbane Delivery'}
                    </span>
                  </div>
                </div>

                {/* Card Body: Title, Action, and Tags (NO lengthy sentences) */}
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
                        onAddToCart?.(prod.id);
                      }}
                      title="Add to hire bag"
                    >
                      <span>Hire Now</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </div>

                  {/* Minimal Tag Pills */}
                  <div className="modern-card-tags">
                    {pills.slice(0, 3).map((pill, i) => (
                      <span key={i} className="modern-card-tag-pill">{pill}</span>
                    ))}
                  </div>

                  {/* Quick Add Button matching Image 3 */}
                  <button
                    type="button"
                    className="musthave-card-add-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart?.(prod.id);
                    }}
                  >
                    <span>Add to hire bag</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* View All Button at bottom of section */}
        <div className="musthave-footer">
          <button
            type="button"
            className="btn-primary-gold musthave-view-all-btn"
            onClick={onViewAll}
          >
            <span>Explore All 10 Categories (18 Items)</span>
            <div className="btn-icon-gold-circle">
              <ArrowRight size={14} />
            </div>
          </button>
        </div>

      </div>
    </section>
  );
}

