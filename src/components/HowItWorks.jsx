import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    step: '01',
    image: '/assets/images/how-it-works-step1.webp',
    fallback: '/assets/images/how-it-works-step1.jpg',
    alt: 'Step 1: Select your equipment online at Icon Party Hire',
    title: 'Select your equipment',
    description: 'Add equipment to your quote and check live availability. Book & pay for your event 24/7 with zero hassle.'
  },
  {
    step: '02',
    image: '/assets/images/how-it-works-step2.webp',
    fallback: '/assets/images/how-it-works-step2.jpg',
    alt: 'Step 2: We confirm the details and schedule dispatch',
    title: 'We confirm the details',
    description: 'Our team reviews your booking, checks dates & logistics, and confirms seamless Brisbane dispatch schedules.'
  },
  {
    step: '03',
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

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    let ctx = gsap.context(() => {
      const cards = grid.querySelectorAll('.hiw-step-card');
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
        </div>

        {/* 3 Step Columns */}
        <div className="hiw-grid" ref={gridRef}>
          {STEPS.map((step, idx) => (
            <article key={idx} className="hiw-step-card">
              
              {/* Illustration Card Image Stage */}
              <div className="hiw-card-stage">
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

              {/* Step Meta: Rose-Gold Step Number Badge + Text */}
              <div className="hiw-card-body">
                <div className="hiw-number-badge" aria-label={`Step ${step.step}`}>
                  <span>{step.step}</span>
                </div>
                
                <h3 className="hiw-step-title">{step.title}</h3>
                <p className="hiw-step-desc">{step.description}</p>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
