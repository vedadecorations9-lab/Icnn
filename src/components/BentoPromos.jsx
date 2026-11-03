import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, Tent, PartyPopper } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function BentoPromos({ onSelectCategory }) {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    let ctx = gsap.context(() => {
      const cards = grid.querySelectorAll('.bento-card');
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 40,
          scale: 0.97,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          stagger: 0.14,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="promo-bento-section" aria-label="Icon Pillars">
      <div className="container">
        
        {/* Section Header */}
        <div className="bento-section-header">
          <div className="bento-header-copy">
            <span className="bento-eyebrow">The Icon Experience</span>
            <h2 className="bento-main-title">
              Three Pillars of <span className="hero-fancy-text">Celebration</span>
            </h2>
          </div>
          <p className="bento-header-sub">
            From DIY commercial marquee hire to full luxury backdrop styling and organic balloon architecture.
          </p>
        </div>

        <div className="bento-grid" ref={gridRef}>
          
          {/* Pillar 1: ICON HIRING */}
          <article className="bento-card tint-rose">
            <div className="bento-card-glow" />
            <div className="bento-header">
              <div className="bento-tag">
                <Tent size={13} />
                <span>Equipment & Furniture</span>
              </div>
              <h3 className="bento-title">ICON HIRING</h3>
              <p className="bento-desc">
                Commercial 6x3m gazebos, white Tiffany chairs, cocktail tables, plinths & catering warmers for Brisbane events.
              </p>
              <button
                type="button"
                className="bento-cta"
                onClick={() => onSelectCategory('all')}
              >
                <span>Browse hire catalog</span>
                <ArrowRight size={14} />
              </button>
            </div>
            <div className="bento-art-container">
              <img
                src="/assets/images/items/Icon 6x3 m Gazebo Hire-2-1024x1024.webp"
                alt="Icon Hiring Equipment"
                loading="lazy"
                className="bento-art-asset"
              />
            </div>
          </article>

          {/* Pillar 2: ICON EVENTS */}
          <article className="bento-card tint-blush">
            <div className="bento-card-glow" />
            <div className="bento-header">
              <div className="bento-tag">
                <Sparkles size={13} />
                <span>Event Styling & FX</span>
              </div>
              <h3 className="bento-title">ICON EVENTS</h3>
              <p className="bento-desc">
                Statement ripple wave backdrops, 3D silk flower walls, cake plinth clusters & dramatic cold spark fountain FX.
              </p>
              <button
                type="button"
                className="bento-cta"
                onClick={() => onSelectCategory('backdrops')}
              >
                <span>Explore event styling</span>
                <ArrowRight size={14} />
              </button>
            </div>
            <div className="bento-art-container">
              <img
                src="/assets/images/items/Three pink arches for hire-1-1024x1024.webp"
                alt="Icon Events Styling"
                loading="lazy"
                className="bento-art-asset"
              />
            </div>
          </article>

          {/* Pillar 3: ICON BALLOONS */}
          <article className="bento-card tint-gold">
            <div className="bento-card-glow" />
            <div className="bento-header">
              <div className="bento-tag">
                <PartyPopper size={13} />
                <span>Bespoke Balloon Art</span>
              </div>
              <h3 className="bento-title">ICON BALLOONS</h3>
              <p className="bento-desc">
                Luxury organic balloon garlands, photo-op backdrop arches, milestone displays & custom celebration color themes.
              </p>
              <button
                type="button"
                className="bento-cta"
                onClick={() => onSelectCategory('balloons')}
              >
                <span>View balloon styling</span>
                <ArrowRight size={14} />
              </button>
            </div>
            <div className="bento-art-container">
              <img
                src="/assets/images/items/Three blue arches for party hire-3-1024x1024.webp"
                alt="Icon Balloons Styling"
                loading="lazy"
                className="bento-art-asset"
              />
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}
