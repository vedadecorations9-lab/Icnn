import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    image: '/assets/images/how-it-works-1.png',
    alt: 'Select your equipment',
    title: 'Select your equipment',
    description: 'Add equipment to your quote and check live availability. Book & pay for your event 24/7'
  },
  {
    image: '/assets/images/how-it-works-2.png',
    alt: 'We confirm the details',
    title: 'We confirm the details',
    description: 'Our team reviews your booking and recommends any changes required'
  },
  {
    image: '/assets/images/how-it-works-3.png',
    alt: 'We deliver, build & collect',
    title: 'We deliver, build & collect',
    description: 'We deliver, set up if required, then return for pack-down and collection. Any day. Any time'
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
      const cols = grid.querySelectorAll('.hiw-ref-col');
      gsap.from(cols, {
        y: 60,
        opacity: 0,
        scale: 0.94,
        stagger: 0.18,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          once: true,
        clearProps: 'opacity,transform',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="how-it-works-ref-section" id="how-it-works" aria-label="How Event Hire Works">
      <div className="container">
        
        {/* Clean Centered Header Matching Reference */}
        <div className="hiw-ref-header">
          <h2 className="hiw-ref-title">
            How It <span className="hiw-ref-pink">Works</span>
          </h2>
        </div>

        {/* 3 Clean Flat Columns */}
        <div className="hiw-ref-grid" ref={gridRef}>
          {STEPS.map((step, idx) => (
            <div key={idx} className="hiw-ref-col">
              <div className="hiw-ref-image-wrapper">
                <img
                  src={step.image}
                  alt={step.alt}
                  className="hiw-ref-img"
                  loading="lazy"
                  width="320"
                  height="285"
                />
              </div>
              <h3 className="hiw-ref-col-title">{step.title}</h3>
              <p className="hiw-ref-col-desc">{step.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
