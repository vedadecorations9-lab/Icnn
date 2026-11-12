import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useLenisScroll
 * Provides butter-smooth inertia scrolling for desktop pointer devices.
 * CRITICAL (mobile-native rule): Touch devices (smartphones and tablets) must
 * NEVER be hijacked by virtual scroll libraries. On mobile/touch devices, Lenis
 * is disabled so the browser retains 100% native 120Hz hardware-accelerated momentum scrolling.
 */
export function useLenisScroll(dependency) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Detect mobile touch devices or narrow viewport
    const isTouch = typeof window !== 'undefined' && (
      window.innerWidth <= 768 ||
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    );

    // On touch devices: completely skip Lenis to preserve 100% native momentum scrolling
    if (isTouch) {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('lenis', 'lenis-stopped', 'lenis-smooth', 'lenis-scrolling');
        document.body.classList.remove('lenis', 'lenis-stopped', 'lenis-smooth', 'lenis-scrolling');
      }
      delete window.__iconLenis;
      ScrollTrigger.refresh();
      return;
    }

    // 1. Initialize Lenis Smooth Scroll on desktop only
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false,
      autoRaf: false,
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
    gsap.ticker.lagSmoothing(500, 33);

    // 4. Initial ScrollTrigger Refresh
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

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
    }, 100);
    return () => clearTimeout(timer);
  }, [dependency]);

  return lenisRef;
}
