import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

  // GSAP desktop entrance animation for section header & grid cards
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

        gsap.fromTo(
          '.bento-card',
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.bento-grid',
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
        </div>

        {/* Static 3-Column Pillars Grid */}
        <div className="bento-grid">
          {PILLARS.map((pillar) => (
            <article
              key={pillar.id}
              className="bento-card bento-card-image-only"
              onClick={() => onSelectCategory?.(pillar.category)}
            >
              <img
                src={pillar.image}
                alt={pillar.alt}
                loading="lazy"
                className="bento-full-image"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
