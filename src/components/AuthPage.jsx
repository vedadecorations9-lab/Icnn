import React from 'react';
import { SignIn, SignUp } from '@clerk/react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export default function AuthPage({ mode = 'sign-up', onBackHome, onSwitchMode }) {
  return (
    <div className="auth-page-container">
      <div className="auth-page-ambient" aria-hidden="true" />
      
      <div className="auth-page-content">
        {/* Top Back Navigation & Brand Lockup */}
        <div className="auth-page-header">
          <button
            type="button"
            className="auth-back-btn"
            onClick={onBackHome}
            aria-label="Back to home"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back to Hire Shop</span>
          </button>

          <div className="auth-page-brand" onClick={onBackHome} role="button" tabIndex={0}>
            <img
              src="/assets/images/icon_logo_navbar.webp"
              alt="Icon Party Hire Brisbane"
              className="auth-page-logo"
            />
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="auth-tab-switch" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'sign-up'}
            className={`auth-tab-btn ${mode === 'sign-up' ? 'active' : ''}`}
            onClick={() => onSwitchMode?.('sign-up')}
          >
            Create Account
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'sign-in'}
            className={`auth-tab-btn ${mode === 'sign-in' ? 'active' : ''}`}
            onClick={() => onSwitchMode?.('sign-in')}
          >
            Sign In
          </button>
        </div>

        {/* Clerk Component or Setup Alert */}
        <div className="auth-clerk-card-wrapper">
          {PUBLISHABLE_KEY ? (
            mode === 'sign-up' ? (
              <SignUp
                routing="hash"
                signInUrl="#/sign-in"
                appearance={{
                  elements: {
                    rootBox: { width: '100%' },
                    card: {
                      boxShadow: '0 20px 48px rgba(27, 6, 26, 0.12)',
                      borderRadius: '18px',
                      border: '1px solid rgba(212, 139, 112, 0.25)',
                      backgroundColor: '#FFFFFF'
                    },
                    primaryButton: {
                      backgroundColor: '#D81B60',
                      '&:hover': { backgroundColor: '#C2185B' }
                    }
                  }
                }}
              />
            ) : (
              <SignIn
                routing="hash"
                signUpUrl="#/sign-up"
                appearance={{
                  elements: {
                    rootBox: { width: '100%' },
                    card: {
                      boxShadow: '0 20px 48px rgba(27, 6, 26, 0.12)',
                      borderRadius: '18px',
                      border: '1px solid rgba(212, 139, 112, 0.25)',
                      backgroundColor: '#FFFFFF'
                    },
                    primaryButton: {
                      backgroundColor: '#D81B60',
                      '&:hover': { backgroundColor: '#C2185B' }
                    }
                  }
                }}
              />
            )
          ) : (
            <div className="auth-fallback-card">
              <div className="auth-fallback-badge">Clerk Integration Notice</div>
              <h3>Authentication Setup In Progress</h3>
              <p>
                The Clerk Publishable Key (<code>VITE_CLERK_PUBLISHABLE_KEY</code>) is not yet compiled into this build.
              </p>
              <div className="auth-steps-list">
                <div className="auth-step-item">
                  <span className="step-num">1</span>
                  <span>Ensure <code>VITE_CLERK_PUBLISHABLE_KEY</code> is set under <strong>Vercel Settings → Environment Variables</strong>.</span>
                </div>
                <div className="auth-step-item">
                  <span className="step-num">2</span>
                  <span>Make sure the <strong>Production</strong> checkbox is selected in Vercel.</span>
                </div>
                <div className="auth-step-item">
                  <span className="step-num">3</span>
                  <span>Trigger a <strong>Redeploy</strong> (unchecking "Use existing Build Cache").</span>
                </div>
              </div>
              <button
                type="button"
                className="auth-return-btn"
                onClick={onBackHome}
              >
                Return to Storefront
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
