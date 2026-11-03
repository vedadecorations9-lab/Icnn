import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ onExploreCategories, onViewCatalog }) {
  const heroRef = useRef(null);
  const copyRef = useRef(null);
  const waveRef = useRef(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const copy = copyRef.current;
    const wave = waveRef.current;
    if (!hero || !copy) return;

    let ctx = gsap.context(() => {
      // 1. Text lift and fade on scroll down
      gsap.to(copy, {
        y: -90,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      // 2. Wave gentle scale out
      if (wave) {
        gsap.to(wave, {
          y: 15,
          scaleY: 1.12,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="hero-fullsize-banner"
      id="home"
      data-glisse-backdrop
      style={{ backgroundImage: "url('/assets/images/hero_sec.png?v=hero_balanced_v1')" }}
      aria-label="Icon Party Hire Brisbane Hero Banner"
    >
      {/* High-Contrast Left Scrim Overlay for Clean Readability without Covering Centerpiece */}
      <div className="hero-fullsize-scrim">
        <div className="container hero-fullsize-inner">
          
          {/* Left-Aligned Editorial Content */}
          <div className="hero-fullsize-copy" ref={copyRef}>

            {/* Fancy Grand Headline (No Paragraph Below) */}
            <h1 className="hero-full-title">
              Elevate Every <br />
              <span className="hero-fancy-text">Celebration</span>
            </h1>

            {/* Action CTAs Directly Below Heading */}
            <div className="hero-full-cta-group">
              <button className="btn-primary-gold" onClick={onExploreCategories}>
                <span>Browse categories</span>
                <div className="btn-icon-gold-circle">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                  </svg>
                </div>
              </button>
              
              <button className="btn-secondary-glass" onClick={onViewCatalog}>
                <span>View hire catalog (18 items)</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Organic Wave Transition */}
      <div className="hero-bottom-wave-divider" ref={waveRef} aria-hidden="true">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="hero-wave-svg"
        >
          <path
            d="M0,28 C280,52 480,12 760,36 C1040,56 1240,16 1440,30 L1440,60 L0,60 Z"
            fill="var(--color-bg-page, #FAF7F9)"
          ></path>
        </svg>
      </div>
    </section>
  );
}
