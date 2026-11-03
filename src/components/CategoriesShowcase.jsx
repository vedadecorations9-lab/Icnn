import React, { useRef, useLayoutEffect } from 'react';
import { CATEGORIES } from '../data/products';
import { ArrowRight, Sparkles, Layers } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CategoriesShowcase({ onExploreCategory, onViewAllItems }) {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const bannerRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    const banner = bannerRef.current;
    if (!section || !grid) return;

    let ctx = gsap.context(() => {
      // 1. Header reveal
      gsap.fromTo(
        '.categories-v-header',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            once: true,
          },
          clearProps: 'opacity,transform',
        }
      );

      // 2. Smooth emergence of category cards on vertical scroll
      const cards = grid.querySelectorAll('.category-vertical-card');
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 45,
          scale: 0.97,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 82%',
            once: true,
          },
          clearProps: 'opacity,transform',
        }
      );

      // 3. Bottom CTA banner emergence
      if (banner) {
        gsap.fromTo(
          banner,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: banner,
              start: 'top 88%',
              once: true,
            },
            clearProps: 'opacity,transform',
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="categories-vertical-section" id="categories-section" ref={sectionRef}>
      <div className="container">
        
        {/* Section Header */}
        <div className="categories-v-header">
          <div className="categories-v-header-copy">
            <h2 className="categories-v-title">
              Browse by <span className="hero-fancy-text">Event Category</span>
            </h2>
            <p className="categories-v-subtitle">
              Curated commercial-grade party rentals, statement backdrops & luxury event equipment across Brisbane.
            </p>
          </div>

          <button
            type="button"
            className="categories-v-all-btn"
            onClick={onViewAllItems}
          >
            <span>View all items</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Vertical Category Grid with Smooth Emerge */}
        <div className="categories-vertical-grid" ref={gridRef}>
          {CATEGORIES.map((cat, idx) => (
            <article
              key={cat.id}
              className="category-vertical-card"
              onClick={() => onExploreCategory(cat.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onExploreCategory(cat.id);
                }
              }}
            >
              {/* Media Image Stage */}
              <div className="category-v-media">
                <img
                  src={cat.image}
                  alt={cat.label}
                  loading="lazy"
                  className="category-v-img"
                />
                <div className="category-v-scrim" />

                {/* Floating Tag Badge */}
                <span className="category-v-tag">{cat.tag}</span>

                {/* Price Pill */}
                <span className="category-v-price">From ${cat.startingPrice} AUD</span>

                {/* Index Watermark */}
                <span className="category-v-watermark" aria-hidden="true">
                  0{idx + 1}
                </span>
              </div>

              {/* Content Block */}
              <div className="category-v-body">
                <div className="category-v-meta-row">
                  <h3 className="category-v-card-title">{cat.label}</h3>
                  <span className="category-v-count">{cat.itemCount} items</span>
                </div>

                <p className="category-v-desc">{cat.description}</p>

                <div className="category-v-footer">
                  <span className="category-v-action-text">Explore hire items</span>
                  <div className="category-v-arrow-circle">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Full Catalog VIP Strip */}
        <div className="categories-v-catalog-strip" ref={bannerRef}>
          <div className="strip-info">
            <div className="strip-icon-circle">
              <Sparkles size={22} />
            </div>
            <div>
              <h4 className="strip-title">Looking for the Complete Hire Inventory?</h4>
              <p className="strip-desc">
                Explore all 10 hire categories with real-time live availability, package discounts & quick booking dispatches in Brisbane.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-primary-gold strip-btn"
            onClick={onViewAllItems}
          >
            <span>Open hire catalog (10 categories)</span>
            <div className="btn-icon-gold-circle">
              <ArrowRight size={14} />
            </div>
          </button>
        </div>

      </div>
    </section>
  );
}
