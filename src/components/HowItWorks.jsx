import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingBag, ClipboardCheck, Truck, ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    step: '01',
    short: 'Select',
    icon: ShoppingBag,
    image: '/assets/images/how-it-works-step1.webp',
    fallback: '/assets/images/how-it-works-step1.jpg',
    alt: 'Step 1: Select your equipment online at Icon Party Hire',
    title: 'Select your equipment',
    description: 'Add equipment to your quote and check live availability. Book your event 24/7 with zero hassle.'
  },
  {
    step: '02',
    short: 'Confirm',
    icon: ClipboardCheck,
    image: '/assets/images/how-it-works-step2.webp',
    fallback: '/assets/images/how-it-works-step2.jpg',
    alt: 'Step 2: We confirm the details and schedule dispatch',
    title: 'We confirm the details',
    description: 'Our team reviews your booking, checks dates & logistics, and confirms seamless Brisbane dispatch schedules.'
  },
  {
    step: '03',
    short: 'Deliver',
    icon: Truck,
    image: '/assets/images/how-it-works-step3.webp',
    fallback: '/assets/images/how-it-works-step3.jpg',
    alt: 'Step 3: We deliver, build & collect at your venue',
    title: 'We deliver, build & collect',
    description: 'We deliver, set up if required, and return for prompt pack-down and collection across Greater Brisbane.'
  }
];

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pauseTimeoutRef = useRef(null);

  // GSAP entrance animation for section header on desktop
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx = gsap.context(() => {
      if (window.innerWidth > 768) {
        gsap.fromTo(
          '.hiw-header',
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
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
    const total = STEPS.length;
    const diff = (cardIdx - currentIdx + total) % total;
    if (diff === 0) return 'arch-slot-center';
    if (diff === 1) return 'arch-slot-right';
    return 'arch-slot-left';
  };

  // Smooth centered scroll to a specific step on mobile
  const scrollToStep = (idx) => {
    if (!gridRef.current) return;
    const el = gridRef.current;
    const cards = el.querySelectorAll('.hiw-step-card');
    if (cards[idx]) {
      const card = cards[idx];
      const targetLeft = card.offsetLeft - (el.clientWidth - card.clientWidth) / 2;
      el.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: 'smooth'
      });
      setActiveStep(idx);
    }
  };

  // User manual interaction pauses auto-rotation momentarily
  const handleUserInteraction = (stepIndex) => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 6000);

    if (typeof stepIndex === 'number') {
      setActiveStep(stepIndex);
      if (window.innerWidth <= 768) {
        scrollToStep(stepIndex);
      }
    }
  };

  // Manual Desktop Navigation
  const handlePrev = (e) => {
    e?.stopPropagation();
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 6000);
    setActiveStep((prev) => (prev - 1 + STEPS.length) % STEPS.length);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 6000);
    setActiveStep((prev) => (prev + 1) % STEPS.length);
  };

  // Clicking a flanking step card promotes it to the center apex
  const handleCardClick = (idx, e) => {
    if (idx !== activeStep) {
      e.preventDefault();
      handleUserInteraction(idx);
    }
  };

  // Auto-advance loop: continuously transitions between steps along the upward arch on desktop
  useEffect(() => {
    if (isPaused || isHovered) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev + 1) % STEPS.length;
        if (gridRef.current && window.innerWidth <= 768) {
          const el = gridRef.current;
          const cards = el.querySelectorAll('.hiw-step-card');
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

  // Update active dot/tab when user manually swipes on mobile
  const handleScroll = () => {
    if (!gridRef.current || window.innerWidth > 768) return;
    const el = gridRef.current;
    const cardWidth = el.scrollWidth / STEPS.length;
    const current = Math.round(el.scrollLeft / cardWidth);
    if (current !== activeStep && current >= 0 && current < STEPS.length) {
      setActiveStep(current);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="how-it-works-section"
      id="how-it-works"
      aria-label="How Event Hire Works"
    >
      <div className="container hiw-relative-container">
        
        {/* Aesthetic Centered Section Header */}
        <div className="hiw-header">
          <div className="hiw-kicker-line">
            <span className="hiw-line" />
            <h2 className="hiw-title">
              How It <span className="hiw-serif-pink">Works</span>
            </h2>
            <span className="hiw-line" />
          </div>
          <p className="hiw-subtitle">
            From reserving your equipment to white-glove delivery and packdown, we make your celebration effortless.
          </p>

          {/* Interactive Auto-Advancing Step Tabs (Mobile Only) */}
          <div className="hiw-mobile-stepper show-mobile" role="tablist" aria-label="Step progress">
            {STEPS.map((step, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={activeStep === idx}
                className={`hiw-stepper-btn ${activeStep === idx ? 'is-active' : ''}`}
                onClick={() => handleUserInteraction(idx)}
              >
                <span className="hiw-stepper-num">{step.step}</span>
                <span className="hiw-stepper-label">{step.short}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Upward Arch Stage Container */}
        <div
          className="arch-carousel-container hiw-arch-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Luminous Architectural Curved Arch Line Guide (Desktop) */}
          <div className="arch-backdrop-track arch-desktop-only" aria-hidden="true">
            <svg viewBox="0 0 1000 240" fill="none" preserveAspectRatio="none" className="arch-svg-curve">
              <defs>
                <linearGradient id="hiwArchGrad" x1="0%" y1="100%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D81B60" stopOpacity="0" />
                  <stop offset="20%" stopColor="#D81B60" stopOpacity="0.28" />
                  <stop offset="50%" stopColor="#E03E8A" stopOpacity="0.65" />
                  <stop offset="80%" stopColor="#D48B70" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#D48B70" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="hiwArchDashedGrad" x1="0%" y1="100%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D81B60" stopOpacity="0" />
                  <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#D81B60" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 60 210 C 260 30, 740 30, 940 210"
                stroke="url(#hiwArchGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 120 210 C 300 50, 700 50, 880 210"
                stroke="url(#hiwArchDashedGrad)"
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
              aria-label="Previous step"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              className="arch-nav-arrow arch-nav-next"
              onClick={handleNext}
              aria-label="Next step"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* 3 Step Cards: Desktop Upward Arch Slots / Mobile Auto-Snap Track */}
          <div
            className="hiw-grid arch-stage-grid"
            ref={gridRef}
            onScroll={handleScroll}
            onTouchStart={() => handleUserInteraction()}
          >
            {STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              const slotClass = getSlotClass(idx, activeStep);
              const isCenter = activeStep === idx;
              return (
                <article
                  key={idx}
                  className={`hiw-step-card ${slotClass} ${isCenter ? 'is-active hiw-card-spotlight' : ''}`}
                  onClick={(e) => handleCardClick(idx, e)}
                >
                  {/* Illustration Card Image Stage (Desktop Only) */}
                  <div className="hiw-card-stage hide-mobile">
                    <picture>
                      <source srcSet={step.image} type="image/webp" />
                      <img
                        src={step.fallback}
                        alt={step.alt}
                        className="hiw-card-img"
                        loading="lazy"
                        width="300"
                        height="247"
                      />
                    </picture>
                  </div>

                  {/* Step Meta: Rose-Gold Step Number Badge + Icon + Text */}
                  <div className="hiw-card-body">
                    <div className="hiw-card-top-row">
                      <div className="hiw-number-badge" aria-label={`Step ${step.step}`}>
                        <span>{step.step}</span>
                      </div>
                      <div className="hiw-icon-disc">
                        <StepIcon size={17} />
                      </div>
                    </div>
                    
                    <h3 className="hiw-step-title">{step.title}</h3>
                    <p className="hiw-step-desc">{step.description}</p>
                  </div>

                </article>
              );
            })}
          </div>

          {/* Interactive Desktop Indicator Stepper with Countdown Progress */}
          <div
            className="arch-desktop-stepper arch-desktop-flex"
            role="tablist"
            aria-label="How it works desktop step progress"
          >
            {STEPS.map((step, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={activeStep === idx}
                className={`arch-stepper-pill ${activeStep === idx ? 'is-active' : ''}`}
                onClick={() => handleUserInteraction(idx)}
              >
                <div className="arch-stepper-pill-top">
                  <span className="arch-stepper-num">{step.step}</span>
                  <span className="arch-stepper-label">{step.short}</span>
                </div>
                <span className="arch-stepper-bar">
                  <span
                    className={`arch-stepper-fill ${
                      activeStep === idx && !isPaused && !isHovered ? 'is-running' : ''
                    }`}
                  />
                </span>
              </button>
            ))}
          </div>

        </div>

        {/* Pagination Dots (Mobile Only) */}
        <div className="hiw-mobile-dots show-mobile" aria-hidden="true">
          {STEPS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`hiw-dot-btn ${activeStep === idx ? 'is-active' : ''}`}
              onClick={() => handleUserInteraction(idx)}
              aria-label={`Go to step ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
