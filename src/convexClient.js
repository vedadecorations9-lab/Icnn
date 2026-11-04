import { ConvexReactClient } from 'convex/react';

const convexUrl =
  import.meta.env.VITE_CONVEX_URL ||
  import.meta.env.CONVEX_URL ||
  import.meta.env.NEXT_PUBLIC_CONVEX_URL ||
  '';

export const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export const isConvexConfigured = Boolean(convexUrl);
export const activeConvexUrl = convexUrl;

