import React, { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ onExploreCategories, onViewCatalog }) {
  const heroRef = useRef(null);
  const copyRef = useRef(null);
  const waveRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

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

            {/* Fancy Grand Headline with Rotating Vinyl Emblem Beside "Every" */}
            <h1 className="hero-full-title">
              <span className="hero-title-first-line">
                <span>Elevate Every</span>
                
                {/* Rotating Vinyl Logo Disc placed aside "Every" */}
                <span
                  className={`hero-inline-vinyl ${isPlaying ? 'is-playing' : 'is-paused'}`}
                  onClick={() => setIsPlaying(!isPlaying)}
                  role="button"
                  tabIndex={0}
                  title={isPlaying ? "Click to pause rotation" : "Click to play rotation"}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setIsPlaying(!isPlaying);
                    }
                  }}
                  aria-label="Icon Party Hire Rotating Logo Emblem"
                >
                  <span className="vinyl-glow-aura" />
                  
                  <span className="vinyl-disc-body">
                    <span className="vinyl-groove-rings" />
                    
                    {/* SVG Rotating Words on Curved Path */}
                    <svg className="vinyl-rotating-svg" viewBox="0 0 200 200" aria-hidden="true">
                      <defs>
                        <path
                          id="vinylPath"
                          d="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0"
                        />
                      </defs>
                      <text className="vinyl-curved-text">
                        <textPath href="#vinylPath" startOffset="0%">
                          ✦ ICON PARTY HIRE ✦ BRISBANE LUXURY HIRE ✦
                        </textPath>
                      </text>
                    </svg>

                    {/* Center High-Definition Circular Logo */}
                    <span className="vinyl-center-label">
                      <img
                        src="/assets/images/logo.png"
                        alt="Icon Party Hire Official Circular Emblem"
                        className="vinyl-center-logo-img"
                      />
                      <span className="vinyl-spindle-hole" />
                    </span>
                  </span>
                </span>
              </span>
              <br />
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
                <span>View hire catalog (10 categories)</span>
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
