import React from 'react';

/**
 * ConvexSafeBoundary
 * Wraps Convex real-time components. If Convex Cloud queries fail,
 * throw an unhandled error (e.g. backend functions not yet deployed via `npx convex deploy`,
 * WebSocket timeout, or schema mismatch), this boundary catches the exception
 * and immediately mounts the local fallback store without dropping frames.
 *
 * This guarantees visitors NEVER experience a blank white screen.
 */
export default class ConvexSafeBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn(
      '[Icon Party Hire] Convex Cloud backend is pending function deployment or returned a server error. Gracefully falling back to Brisbane local catalog store.',
      error?.message || error
    );
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
