import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, Tent, PartyPopper, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [isHovered, setIsHovered] = useState(false);
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

  // User manual interaction pauses auto-rotation momentarily
  const handleUserInteraction = (idx) => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 6000);

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
    pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 6000);
    setActivePillar((prev) => (prev - 1 + PILLARS.length) % PILLARS.length);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 6000);
    setActivePillar((prev) => (prev + 1) % PILLARS.length);
  };

  // Clicking a flanking card promotes it to the center apex
  const handleCardClick = (idx, e) => {
    if (idx !== activePillar) {
      e.preventDefault();
      handleUserInteraction(idx);
    }
  };

  // Continuous auto-advancing carousel along upward arch on desktop, and snap track on mobile
  useEffect(() => {
    if (isPaused || isHovered) return;

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
    }, 3800);

    return () => clearInterval(interval);
  }, [isPaused, isHovered]);

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
        <div
          className="arch-carousel-container bento-arch-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Luminous Architectural Curved Arch Line Guide (Desktop) */}
          <div className="arch-backdrop-track arch-desktop-only" aria-hidden="true">
            <svg viewBox="0 0 1000 240" fill="none" preserveAspectRatio="none" className="arch-svg-curve">
              <defs>
                <linearGradient id="bentoArchGrad" x1="0%" y1="100%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D81B60" stopOpacity="0" />
                  <stop offset="20%" stopColor="#D81B60" stopOpacity="0.28" />
                  <stop offset="50%" stopColor="#E03E8A" stopOpacity="0.65" />
                  <stop offset="80%" stopColor="#D48B70" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#D48B70" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="bentoArchDashedGrad" x1="0%" y1="100%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D81B60" stopOpacity="0" />
                  <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#D81B60" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 60 210 C 260 30, 740 30, 940 210"
                stroke="url(#bentoArchGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 120 210 C 300 50, 700 50, 880 210"
                stroke="url(#bentoArchDashedGrad)"
                strokeWidth="1.5"
                strokeDasharray="6 8"
                strokeLinecap="round"
              />
            </svg>
          </div>

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
              const IconComponent = pillar.icon;
              const slotClass = getSlotClass(idx, activePillar);
              const isCenter = activePillar === idx;
              return (
                <article
                  key={pillar.id}
                  className={`bento-card ${pillar.tint} ${slotClass} ${isCenter ? 'bento-card-active' : ''}`}
                  onClick={(e) => handleCardClick(idx, e)}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCategory(pillar.category);
                      }}
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
                    className={`arch-stepper-fill ${
                      activePillar === idx && !isPaused && !isHovered ? 'is-running' : ''
                    }`}
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
