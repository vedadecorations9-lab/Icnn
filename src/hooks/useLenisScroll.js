import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useLenisScroll(dependency) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth natural deceleration
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.75,
      infinite: false,
    });

    lenisRef.current = lenis;
    window.__iconLenis = lenis;

    // 2. Connect Lenis scroll events to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // 3. Connect GSAP ticker to Lenis RAF for frame-perfect sync
    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // 4. Initial ScrollTrigger Refresh
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
      delete window.__iconLenis;
    };
  }, []);

  // Whenever dependency changes (e.g. view switches between 'home' and 'catalog')
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
      if (lenisRef.current) {
        lenisRef.current.resize();
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [dependency]);

  return lenisRef;
}

