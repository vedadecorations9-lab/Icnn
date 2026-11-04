import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useLenisScroll(dependency) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Check if device is touch-primary (mobile/tablet) to prevent touch hijacking
    const isTouch = typeof window !== 'undefined' && (
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    );

    // 1. Initialize Lenis Smooth Scroll with zero touch-hijacking & single RAF
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth natural deceleration
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false, // Never hijack native mobile touch scrolling
      touchMultiplier: 0, // Ensure mobile retains 120Hz native momentum
      autoRaf: false,     // Critical: disable Lenis internal loop to prevent double-RAF with GSAP ticker
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
    // Enable lag smoothing to prevent violent jumps on minor frame drop
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
