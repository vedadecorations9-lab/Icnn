import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const bannerRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const banner = bannerRef.current;
    if (!section || !banner) return;

    let ctx = gsap.context(() => {
      gsap.from(banner, {
        y: 40,
        opacity: 0,
        scale: 0.98,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
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
        <div className="hiw-banner-wrapper" ref={bannerRef}>
          <img
            src="/assets/images/how_it_works_banner.jpg"
            alt="How It Works - Icon Party Hire: 01 Select your equipment, 02 We confirm the details, 03 We deliver, build & collect"
            className="hiw-full-banner-img"
            loading="lazy"
            width="1920"
            height="1080"
          />
        </div>
      </div>
    </section>
  );
}
