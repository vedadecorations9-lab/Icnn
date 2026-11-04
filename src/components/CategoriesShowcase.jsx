import React, { useRef, useLayoutEffect } from 'react';
import { CATEGORIES } from '../data/products';
import { ArrowRight, Sparkles, ArrowUpRight } from 'lucide-react';
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

        {/* Vertical Category Grid with Modern Design Cards */}
        <div className="categories-vertical-grid" ref={gridRef}>
          {CATEGORIES.map((cat) => (
            <article
              key={cat.id}
              className="modern-design-card category-vertical-card"
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
              {/* Media Image Stage with Scallop Top-Right Cutout */}
              <div className="modern-card-media">
                <img
                  src={cat.image}
                  alt={cat.label}
                  loading="lazy"
                  className="modern-card-img"
                />

                {/* Top-Right Scallop Notch: Item Count (No Price in Category Cards!) */}
                <div className="modern-card-notch">
                  <span className="modern-card-notch-badge">{cat.itemCount} Items</span>
                </div>

                {/* Bottom Delivery / Fleet Pill */}
                <div className="modern-card-bottom-strip">
                  <span className="modern-card-bottom-pill">Commercial Fleet • Brisbane</span>
                </div>
              </div>

              {/* Card Body: Title, Action, and Concise Feature Pills (NO lengthy sentences) */}
              <div className="modern-card-body">
                <div className="modern-card-header-row">
                  <h3 className="modern-card-title">{cat.label}</h3>
                  <button
                    type="button"
                    className="modern-card-action"
                    onClick={(e) => {
                      e.stopPropagation();
                      onExploreCategory(cat.id);
                    }}
                  >
                    <span>Explore</span>
                    <ArrowUpRight size={15} />
                  </button>
                </div>

                {/* Minimal Tag Pills (NO lengthy sentences) */}
                <div className="modern-card-tags">
                  {cat.pills?.map((pill, i) => (
                    <span key={i} className="modern-card-tag-pill">{pill}</span>
                  ))}
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
