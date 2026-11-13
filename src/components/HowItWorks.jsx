import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingBag, ClipboardCheck, Truck } from 'lucide-react';

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
  const pauseTimeoutRef = useRef(null);

  // GSAP entrance animation for desktop
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    let ctx = gsap.context(() => {
      const cards = grid.querySelectorAll('.hiw-step-card');
      if (window.innerWidth > 768) {
        gsap.from(cards, {
          y: 45,
          opacity: 0,
          scale: 0.95,
          stagger: 0.16,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            once: true,
            clearProps: 'opacity,transform',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Smooth centered scroll to a specific step
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

  // Pause auto-rotation momentarily when user manually interacts
  const handleUserInteraction = (stepIndex) => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 6000);

    if (typeof stepIndex === 'number') {
      scrollToStep(stepIndex);
    }
  };

  // Auto-advance loop (continuously transitions between steps on a timer)
  useEffect(() => {
    if (isPaused) return;

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
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Update active dot/tab when user manually swipes
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

        {/* 3 Step Cards — Auto-advancing Carousel on Mobile, 3-Col Grid on Desktop */}
        <div
          className="hiw-grid"
          ref={gridRef}
          onScroll={handleScroll}
          onTouchStart={() => handleUserInteraction()}
          onMouseDown={() => handleUserInteraction()}
        >
          {STEPS.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <article
                key={idx}
                className={`hiw-step-card ${activeStep === idx ? 'is-active' : ''}`}
                onClick={() => handleUserInteraction(idx)}
              >
                
                {/* Illustration Card Image Stage (Desktop Only - completely removed on mobile) */}
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
