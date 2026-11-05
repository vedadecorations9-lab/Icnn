import React, { useRef, useLayoutEffect } from 'react';
import { CATEGORIES } from '../data/products';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CategoriesShowcase({
  categories = CATEGORIES,
  products = [],
  onExploreCategory,
  onViewAllItems
}) {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  const activeCategories = categories && categories.length > 0 ? categories : CATEGORIES;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
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
      if (cards.length > 0) {
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
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [activeCategories.length]);

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

        {/* Vertical Category Grid: Exactly 5 Cards per Row on Desktop */}
        <div className="categories-vertical-grid category-grid-5cols" ref={gridRef}>
          {activeCategories.map((cat) => {
            const count = products.length > 0
              ? (products.filter(p => p.category === cat.id).length || cat.itemCount || 0)
              : (cat.itemCount || 0);

            return (
              <article
                key={cat.id}
                className="modern-design-card category-vertical-card category-card-compact"
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
                    <span className="modern-card-notch-badge">{count} Items</span>
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
                      <ArrowUpRight size={14} />
                    </button>
                  </div>

                  {/* Minimal Tag Pills (NO lengthy sentences, max 3 for compact 5-per-row fit) */}
                  <div className="modern-card-tags">
                    {cat.pills && cat.pills.slice(0, 3).map((pill, i) => (
                      <span key={i} className="modern-card-tag-pill">{pill}</span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
