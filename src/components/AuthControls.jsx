import React, { useEffect } from 'react';
import { Show, SignInButton, UserButton } from '@clerk/react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export default function AuthControls() {
  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const isProdKey = Boolean(PUBLISHABLE_KEY && PUBLISHABLE_KEY.startsWith('pk_live_'));

  useEffect(() => {
    if (!PUBLISHABLE_KEY) {
      console.warn('[Clerk Auth] VITE_CLERK_PUBLISHABLE_KEY is not defined. Add it to .env.local (locally) or Vercel Environment Variables (production), then redeploy.');
    } else if (isLocalhost && isProdKey) {
      console.warn('[Clerk Auth] You are using a production publishable key (pk_live_...) on localhost. Clerk restricts production keys to production domains.');
    } else {
      console.info('[Clerk Auth] Initialized with key prefix:', PUBLISHABLE_KEY.slice(0, 12) + '...');
    }
  }, [isLocalhost, isProdKey]);

  if (!PUBLISHABLE_KEY) {
    return (
      <button
        type="button"
        className="nav-auth-btn"
        onClick={() => {
          alert(
            'Clerk Publishable Key is missing!\n\n' +
            '• On Vercel: Add VITE_CLERK_PUBLISHABLE_KEY in Project Settings -> Environment Variables, then click "Redeploy" in Deployments.\n\n' +
            '• Locally: Add VITE_CLERK_PUBLISHABLE_KEY=pk_test_... in a .env.local file in your project folder.'
          );
        }}
        title="Sign in with Clerk"
      >
        <span>Sign in</span>
      </button>
    );
  }

  if (isLocalhost && isProdKey) {
    return (
      <button
        type="button"
        className="nav-auth-btn"
        onClick={() => {
          alert(
            'Clerk Warning: You are using a Production Key (pk_live_...) on localhost.\n\n' +
            'Clerk blocks production keys on localhost. To test locally, use your Development key (pk_test_...) in .env.local. Your production key will work on your live domain.'
          );
        }}
        title="Production key on localhost"
      >
        <span>Sign in (Live Key)</span>
      </button>
    );
  }

  return (
    <div className="nav-auth-wrapper">
      <Show when="signed-in">
        <UserButton
          appearance={{
            elements: {
              avatarBox: {
                width: 34,
                height: 34,
                border: '1.5px solid rgba(212, 139, 112, 0.45)',
                boxShadow: '0 2px 8px rgba(27, 6, 26, 0.08)'
              }
            }
          }}
        />
      </Show>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button type="button" className="nav-auth-btn">
            <span>Sign in</span>
          </button>
        </SignInButton>
      </Show>
    </div>
  );
}
