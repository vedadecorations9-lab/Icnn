import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    id: 'hiring',
    category: 'all',
    title: 'ICON HIRING',
    image: '/assets/images/pillars/icon-hiring.jpg',
    alt: 'Icon Hiring'
  },
  {
    id: 'decorations',
    category: 'backdrops',
    title: 'ICON DECORATIONS',
    image: '/assets/images/pillars/icon-decorations.jpg',
    alt: 'Icon Decorations'
  },
  {
    id: 'balloons',
    category: 'balloons',
    title: 'ICON BALLOONS',
    image: '/assets/images/pillars/icon-balloons.jpg',
    alt: 'Icon Balloons'
  }
];

export default function BentoPromos({ onSelectCategory }) {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const [activePillar, setActivePillar] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef(null);

  // GSAP desktop entrance animation for section header
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx = gsap.context(() => {
      if (window.innerWidth > 768) {
        gsap.fromTo(
          '.bento-section-header',
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Calculate arch slot class for desktop 3D curved trajectory (Apex, Right slope, Left slope)
  const getSlotClass = (cardIdx, currentIdx) => {
    const total = PILLARS.length;
    const diff = (cardIdx - currentIdx + total) % total;
    if (diff === 0) return 'arch-slot-center';
    if (diff === 1) return 'arch-slot-right';
    return 'arch-slot-left';
  };

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

  // User manual interaction (click) pauses auto-rotation for 4s then cleanly resumes
  const handleUserInteraction = (idx) => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 4000);

    if (typeof idx === 'number') {
      setActivePillar(idx);
      if (window.innerWidth <= 768) {
        scrollToPillar(idx);
      }
    }
  };

  // Manual Desktop Navigation
  const handlePrev = (e) => {
    e?.stopPropagation();
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 4000);
    setActivePillar((prev) => (prev - 1 + PILLARS.length) % PILLARS.length);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 4000);
    setActivePillar((prev) => (prev + 1) % PILLARS.length);
  };

  // Clicking a flanking card promotes it to the center apex; clicking active card opens category
  const handleCardClick = (idx, pillar, e) => {
    if (window.innerWidth > 768 && idx !== activePillar) {
      e.preventDefault();
      handleUserInteraction(idx);
    } else {
      onSelectCategory?.(pillar.category);
    }
  };

  // Continuous auto-advancing carousel: automatically transitions every 3.2 seconds
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
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
    }, 3200);

    return () => clearInterval(timer);
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

        {/* Upward Arch Stage Container */}
        <div className="arch-carousel-container bento-arch-container">
          
          {/* Floating Desktop Nav Arrows */}
          <div className="arch-nav-controls arch-desktop-flex" aria-hidden="true">
            <button
              type="button"
              className="arch-nav-arrow arch-nav-prev"
              onClick={handlePrev}
              aria-label="Previous experience pillar"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              className="arch-nav-arrow arch-nav-next"
              onClick={handleNext}
              aria-label="Next experience pillar"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* 3 Pillars Grid / Desktop Upward Arch Stage */}
          <div
            className="bento-grid arch-stage-grid"
            ref={gridRef}
            onScroll={handleScroll}
            onTouchStart={() => handleUserInteraction()}
          >
            {PILLARS.map((pillar, idx) => {
              const slotClass = getSlotClass(idx, activePillar);
              const isCenter = activePillar === idx;
              return (
                <article
                  key={pillar.id}
                  className={`bento-card bento-card-image-only ${slotClass} ${isCenter ? 'bento-card-active' : ''}`}
                  onClick={(e) => handleCardClick(idx, pillar, e)}
                >
                  <img
                    src={pillar.image}
                    alt={pillar.alt}
                    loading="lazy"
                    className="bento-full-image"
                  />
                </article>
              );
            })}
          </div>

          {/* Interactive Desktop Indicator Stepper with Countdown Progress */}
          <div
            className="arch-desktop-stepper arch-desktop-flex"
            role="tablist"
            aria-label="Icon Experience Pillars Navigation"
          >
            {PILLARS.map((pillar, idx) => (
              <button
                key={pillar.id}
                type="button"
                role="tab"
                aria-selected={activePillar === idx}
                className={`arch-stepper-pill ${activePillar === idx ? 'is-active' : ''}`}
                onClick={() => handleUserInteraction(idx)}
              >
                <div className="arch-stepper-pill-top">
                  <span className="arch-stepper-num">0{idx + 1}</span>
                  <span className="arch-stepper-label">{pillar.title.replace('ICON ', '')}</span>
                </div>
                <span className="arch-stepper-bar">
                  <span
                    key={`bento-bar-${pillar.id}-${activePillar === idx ? activePillar : 'idle'}`}
                    className={`arch-stepper-fill ${activePillar === idx && !isPaused ? 'is-running' : ''}`}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
