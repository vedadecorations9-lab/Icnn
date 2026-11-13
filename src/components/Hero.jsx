import React, { useRef, useLayoutEffect } from 'react';
import { ArrowRight } from 'lucide-react';
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
        y: -70,
        opacity: 0.25,
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
          y: 12,
          scaleY: 1.1,
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
      style={{ backgroundImage: "url('/assets/images/hero_sec.webp')" }}
      aria-label="Icon Party Hire Brisbane Hero Banner"
    >
      {/* High-Contrast Left Scrim Overlay for Clean Readability without Covering Centerpiece */}
      <div className="hero-fullsize-scrim">
        <div className="container hero-fullsize-inner">
          
          {/* Left-Aligned Editorial Content */}
          <div className="hero-fullsize-copy" ref={copyRef}>

            {/* Prominent Hero Brand Logo */}
            <div className="hero-brand-logo-frame">
              <img
                src="/assets/images/hero_logo.webp"
                alt="Icon Party Hire Brisbane"
                className="hero-brand-logo-img"
              />
            </div>

            {/* Grand Editorial Headline */}
            <h1 className="hero-full-title">
              <span className="hero-title-first-line">ELEVATE EVERY</span>
              <span className="hero-title-second-line">
                <span className="hero-fancy-text">Celebration</span>
              </span>
            </h1>

            {/* Single Primary Action CTA */}
            <div className="hero-full-cta-group">
              <button
                type="button"
                className="hero-primary-btn"
                onClick={onExploreCategories || onViewCatalog}
              >
                <span>Explore categories</span>
                <div className="btn-icon-gold-circle">
                  <ArrowRight size={15} />
                </div>
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
