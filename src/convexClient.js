import { ConvexReactClient } from 'convex/react';

const localSavedUrl = typeof window !== 'undefined' ? localStorage.getItem('icon_custom_convex_url') : null;

const rawUrl =
  import.meta.env.VITE_CONVEX_URL ||
  import.meta.env.CONVEX_URL ||
  import.meta.env.NEXT_PUBLIC_CONVEX_URL ||
  localSavedUrl ||
  '';

const convexUrl = typeof rawUrl === 'string' ? rawUrl.trim() : '';

let client = null;
if (convexUrl && (convexUrl.startsWith('https://') || convexUrl.startsWith('http://'))) {
  try {
    client = new ConvexReactClient(convexUrl);
  } catch (err) {
    console.warn('[Convex] Failed to instantiate ConvexReactClient:', err);
    client = null;
  }
}

export const convex = client;
export const isConvexConfigured = Boolean(client);
export const activeConvexUrl = convexUrl;

