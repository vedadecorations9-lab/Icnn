import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const clerkKey =
    env.CLERK_PUBLISHABLE_KEY ||
    env.VITE_CLERK_PUBLISHABLE_KEY ||
    env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    process.env.CLERK_PUBLISHABLE_KEY ||
    process.env.VITE_CLERK_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    '';

  const convexUrl =
    env.VITE_CONVEX_URL ||
    env.CONVEX_URL ||
    env.NEXT_PUBLIC_CONVEX_URL ||
    process.env.VITE_CONVEX_URL ||
    process.env.CONVEX_URL ||
    process.env.NEXT_PUBLIC_CONVEX_URL ||
    '';

  return {
    plugins: [react()],
    envPrefix: ['VITE_', 'CONVEX_', 'NEXT_PUBLIC_', 'CLERK_'],
    define: {
      'import.meta.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(clerkKey),
      'import.meta.env.CLERK_PUBLISHABLE_KEY': JSON.stringify(clerkKey),
      'import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY': JSON.stringify(clerkKey),
      'import.meta.env.VITE_CONVEX_URL': JSON.stringify(convexUrl),
      'import.meta.env.CONVEX_URL': JSON.stringify(convexUrl),
      'import.meta.env.NEXT_PUBLIC_CONVEX_URL': JSON.stringify(convexUrl)
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('@clerk')) return 'vendor-clerk';
              if (id.includes('convex')) return 'vendor-convex';
              if (id.includes('gsap') || id.includes('lenis')) return 'vendor-motion';
              if (id.includes('lucide-react')) return 'vendor-icons';
              if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
            }
          }
        }
      }
    },
    server: {
      port: 5173,
      open: false
    }
  };
});
