import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, Tent, PartyPopper } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    id: 'hiring',
    category: 'all',
    tint: 'tint-rose',
    tag: 'Equipment & Furniture',
    icon: Tent,
    title: 'ICON HIRING',
    desc: 'Commercial 6x3m gazebos, white Tiffany chairs, cocktail tables, plinths & catering warmers for Brisbane events.',
    cta: 'Browse hire catalog',
    image: '/assets/images/items/Icon 6x3 m Gazebo Hire-2-1024x1024.webp',
    alt: 'Icon Hiring Equipment'
  },
  {
    id: 'events',
    category: 'backdrops',
    tint: 'tint-blush',
    tag: 'Event Styling & FX',
    icon: Sparkles,
    title: 'ICON EVENTS',
    desc: 'Statement ripple wave backdrops, 3D silk flower walls, cake plinth clusters & dramatic cold spark fountain FX.',
    cta: 'Explore event styling',
    image: '/assets/images/items/Three pink arches for hire-1-1024x1024.webp',
    alt: 'Icon Events Styling'
  },
  {
    id: 'balloons',
    category: 'balloons',
    tint: 'tint-gold',
    tag: 'Bespoke Balloon Art',
    icon: PartyPopper,
    title: 'ICON BALLOONS',
    desc: 'Luxury organic balloon garlands, photo-op backdrop arches, milestone displays & custom celebration color themes.',
    cta: 'View balloon styling',
    image: '/assets/images/items/Three blue arches for party hire-3-1024x1024.webp',
    alt: 'Icon Balloons Styling'
  }
];

export default function BentoPromos({ onSelectCategory }) {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const [activePillar, setActivePillar] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef(null);

  // GSAP desktop entrance animation
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    let ctx = gsap.context(() => {
      const cards = grid.querySelectorAll('.bento-card');
      if (window.innerWidth > 768) {
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
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Smooth scroll to a specific pillar card on mobile
  const scrollToPillar = (idx) => {
    if (!gridRef.current) return;
    const el = gridRef.current;
    const cards = el.querySelectorAll('.bento-card');
    if (cards[idx]) {
      const card = cards[idx];
      const targetLeft = card.offsetLeft - (el.clientWidth - card.clientWidth) / 2;
      el.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: 'smooth'
      });
      setActivePillar(idx);
    }
  };

  // User manual interaction pauses auto-rotation momentarily
  const handleUserInteraction = (idx) => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 6000);

    if (typeof idx === 'number') {
      scrollToPillar(idx);
    }
  };

  // Continuous auto-advancing carousel for mobile
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActivePillar((prev) => {
        const next = (prev + 1) % PILLARS.length;
        if (gridRef.current && window.innerWidth <= 768) {
          const el = gridRef.current;
          const cards = el.querySelectorAll('.bento-card');
          if (cards[next]) {
            const card = cards[next];
            const targetLeft = card.offsetLeft - (el.clientWidth - card.clientWidth) / 2;
            el.scrollTo({
              left: Math.max(0, targetLeft),
              behavior: 'smooth'
            });
          }
        }
        return next;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Sync active pillar when swiping horizontally on mobile
  const handleScroll = () => {
    if (!gridRef.current || window.innerWidth > 768) return;
    const el = gridRef.current;
    const cardWidth = el.scrollWidth / PILLARS.length;
    const current = Math.round(el.scrollLeft / cardWidth);
    if (current !== activePillar && current >= 0 && current < PILLARS.length) {
      setActivePillar(current);
    }
  };

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

          {/* Interactive Auto-Advancing Stepper for Mobile */}
          <div
            className="bento-mobile-stepper show-mobile"
            role="tablist"
            aria-label="Icon Experience Pillars"
          >
            {PILLARS.map((pillar, idx) => (
              <button
                key={pillar.id}
                type="button"
                role="tab"
                aria-selected={activePillar === idx}
                className={`bento-stepper-btn ${activePillar === idx ? 'is-active' : ''}`}
                onClick={() => handleUserInteraction(idx)}
              >
                <span className="bento-stepper-label">{pillar.title.replace('ICON ', '')}</span>
                <span className="bento-stepper-bar">
                  <span className={`bento-stepper-fill ${activePillar === idx && !isPaused ? 'is-animating' : ''}`} />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 3 Pillars Grid (Desktop Grid, Mobile Auto-Snap Carousel) */}
        <div
          className="bento-grid"
          ref={gridRef}
          onScroll={handleScroll}
          onTouchStart={() => handleUserInteraction()}
        >
          {PILLARS.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <article
                key={pillar.id}
                className={`bento-card ${pillar.tint} ${activePillar === idx ? 'bento-card-active' : ''}`}
              >
                <div className="bento-card-glow" />
                <div className="bento-header">
                  <div className="bento-tag">
                    <IconComponent size={13} />
                    <span>{pillar.tag}</span>
                  </div>
                  <h3 className="bento-title">{pillar.title}</h3>
                  <p className="bento-desc">{pillar.desc}</p>
                  <button
                    type="button"
                    className="bento-cta"
                    onClick={() => onSelectCategory(pillar.category)}
                  >
                    <span>{pillar.cta}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
                <div className="bento-art-container">
                  <img
                    src={pillar.image}
                    alt={pillar.alt}
                    loading="lazy"
                    className="bento-art-asset"
                  />
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
