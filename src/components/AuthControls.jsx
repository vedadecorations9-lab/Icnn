import React from 'react';
import { Show, SignInButton, UserButton } from '@clerk/react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export default function AuthControls() {
  if (!PUBLISHABLE_KEY) {
    return (
      <button
        type="button"
        className="nav-auth-btn"
        onClick={() => alert('Please set VITE_CLERK_PUBLISHABLE_KEY in your .env.local file to enable Clerk authentication.')}
        title="Sign in with Clerk"
      >
        <span>Sign in</span>
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
