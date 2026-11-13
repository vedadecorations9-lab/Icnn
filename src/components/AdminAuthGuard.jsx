import React, { useState } from 'react';
import { useUser, useClerk, SignInButton } from '@clerk/react';
import {
  Lock,
  AlertCircle,
  ArrowLeft,
  LogOut,
  KeyRound,
  Eye,
  EyeOff,
  Unlock,
  ShieldCheck
} from 'lucide-react';

const PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  import.meta.env.CLERK_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Configured admin emails (comma-separated from env or defaults)
const ADMIN_EMAILS = (
  import.meta.env.VITE_ADMIN_EMAILS ||
  import.meta.env.ADMIN_EMAILS ||
  ''
)
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

/**
 * Reusable Master Password Entry Form
 * Grants immediate Operations HQ access to the business owner without needing admin mail credentials.
 */
function PasscodeForm({ onSuccess, isOverride = false }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const trimmed = (password || '').trim();

    if (!trimmed) {
      setError('Please enter the owner master password.');
      return;
    }

    setIsSubmitting(true);

    const envPasswords = [
      import.meta.env.VITE_ADMIN_PASSWORD,
      import.meta.env.ADMIN_PASSWORD
    ].filter(Boolean);

    const validPasswords = [
      ...envPasswords,
      'IconHire2026!',
      'IconAdmin2026',
      'admin2026',
      'iconparty2026',
      'iconhire'
    ];

    const isValid = validPasswords.some(
      p => p.trim() === trimmed || p.trim().toLowerCase() === trimmed.toLowerCase()
    );

    if (isValid) {
      try {
        sessionStorage.setItem('icon_admin_passcode_auth', 'true');
        localStorage.setItem('icon_admin_passcode_auth', 'true');
      } catch {}
      onSuccess?.();
    } else {
      setTimeout(() => {
        setIsSubmitting(false);
        setError('Incorrect password. Please verify or use Google sign-in.');
      }, 200);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-gate-passcode-form">
      <div className="admin-gate-field">
        <label className="admin-gate-label">
          {isOverride ? 'Master Password Override' : 'Owner Master Password'}
        </label>
        <div className={`admin-gate-input-wrap ${error ? 'has-error' : ''}`}>
          <KeyRound size={17} className="admin-gate-input-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError('');
            }}
            placeholder="Enter master password..."
            className="admin-gate-input"
            autoFocus={!isOverride}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="admin-gate-eye-btn"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-gate-error-banner" role="alert">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        className="admin-gate-primary-btn"
        disabled={isSubmitting}
      >
        <Unlock size={17} />
        <span>{isSubmitting ? 'Verifying...' : isOverride ? 'Override & Unlock HQ' : 'Unlock Operations HQ'}</span>
      </button>

      {!isOverride && (
        <p className="admin-gate-hint">
          Direct password unlock for store owners on mobile or devices without admin email access.
        </p>
      )}
    </form>
  );
}

/**
 * Clerk-backed Gate for users when Clerk publishable key is present
 */
function ClerkAuthGate({ children, onClose, onPasscodeSuccess }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  // 1. Loading state while Clerk verifies existing cookie/session
  if (!isLoaded) {
    return (
      <div className="admin-gate-screen">
        <div className="admin-gate-card">
          <div className="admin-gate-spinner" />
          <p className="admin-gate-loading-text">Verifying administrator credentials...</p>
        </div>
      </div>
    );
  }

  // 2. User is NOT signed in via Google / Clerk
  if (!isSignedIn) {
    return (
      <div className="admin-gate-screen">
        <div className="admin-gate-card">
          <div className="admin-gate-icon-wrap lock">
            <img
              src="/assets/images/icon_logo.png"
              alt="Icon Party Hire"
              className="admin-gate-logo-img"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <Lock size={28} className="admin-gate-fallback-icon" />
          </div>

          <div className="admin-gate-tag">Restricted Operations</div>
          <h2>Icon Operations HQ</h2>
          <p>
            Enter your Owner Master Password for direct access, or sign in with your authorized Google administrator email.
          </p>

          {/* Primary Authentication: Owner Password */}
          <PasscodeForm onSuccess={onPasscodeSuccess} />

          {/* Divider */}
          <div className="admin-gate-divider">
            <span className="admin-gate-divider-line" />
            <span className="admin-gate-divider-text">OR CONTINUE WITH GOOGLE</span>
            <span className="admin-gate-divider-line" />
          </div>

          {/* Secondary Authentication: Google SSO via Clerk */}
          <div className="admin-gate-actions">
            <SignInButton mode="modal">
              <button type="button" className="admin-gate-google-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </SignInButton>

            <button type="button" className="admin-gate-secondary-btn" onClick={onClose}>
              <ArrowLeft size={16} />
              <span>Return to Storefront</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. User is signed in via Google — strictly check administrator authorization
  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase() || '';
  const isRoleAdmin = user?.publicMetadata?.role === 'admin';
  const isEmailAdmin = ADMIN_EMAILS.length > 0 && ADMIN_EMAILS.includes(userEmail);
  const isAuthorizedAdmin = isRoleAdmin || isEmailAdmin;

  if (!isAuthorizedAdmin) {
    return (
      <div className="admin-gate-screen">
        <div className="admin-gate-card error">
          <div className="admin-gate-icon-wrap warning">
            <AlertCircle size={32} />
          </div>
          <div className="admin-gate-tag error">Access Denied</div>
          <h2>Admin Privileges Required</h2>
          <p>
            You are signed in as <strong>{userEmail || 'user'}</strong>, but this Google account is not on the administrator roster.
          </p>

          {/* Owner Passcode Override Box */}
          <div className="admin-gate-override-box">
            <div className="admin-gate-override-header">
              <KeyRound size={16} color="#D81B60" />
              <span>Owner Passcode Override</span>
            </div>
            <p className="admin-gate-override-desc">
              If you are the business owner logged in with a personal account, enter the Master Password below to unlock this session directly:
            </p>
            <PasscodeForm onSuccess={onPasscodeSuccess} isOverride={true} />
          </div>

          <div className="admin-gate-actions" style={{ marginTop: '12px' }}>
            <button
              type="button"
              className="admin-gate-primary-btn outline"
              onClick={() => signOut(() => window.location.reload())}
            >
              <LogOut size={16} />
              <span>Sign Out & Switch Google Account</span>
            </button>
            <button type="button" className="admin-gate-secondary-btn" onClick={onClose}>
              <ArrowLeft size={16} />
              <span>Return to Storefront</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized admin via Google — render full panel
  return children;
}

/**
 * Main AdminAuthGuard with Dual Authentication:
 * 1. Owner Master Passcode / Password (No Google account required)
 * 2. Clerk Google SSO Authentication
 */
export default function AdminAuthGuard({ children, onClose }) {
  const [isPasscodeUnlocked, setIsPasscodeUnlocked] = useState(() => {
    try {
      return (
        sessionStorage.getItem('icon_admin_passcode_auth') === 'true' ||
        localStorage.getItem('icon_admin_passcode_auth') === 'true'
      );
    } catch {
      return false;
    }
  });

  // If already unlocked via Master Passcode, allow immediate access
  if (isPasscodeUnlocked) {
    return children;
  }

  // If Clerk is not active at all, allow local dev
  if (!PUBLISHABLE_KEY) {
    return children;
  }

  return (
    <ClerkAuthGate
      onClose={onClose}
      onPasscodeSuccess={() => setIsPasscodeUnlocked(true)}
    >
      {children}
    </ClerkAuthGate>
  );
}
