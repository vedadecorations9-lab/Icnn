import React from 'react';
import { useUser, useClerk, SignInButton } from '@clerk/react';
import { Lock, AlertCircle, ArrowLeft, LogOut, ShieldCheck } from 'lucide-react';

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

export default function AdminAuthGuard({ children, onClose }) {
  // If Clerk is not active at all, allow local dev
  if (!PUBLISHABLE_KEY) {
    return children;
  }

  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  // 1. Loading state while Clerk verifies session token
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

  // 2. User is NOT signed in at all
  if (!isSignedIn) {
    return (
      <div className="admin-gate-screen">
        <div className="admin-gate-card">
          <div className="admin-gate-icon-wrap lock">
            <Lock size={32} />
          </div>
          <div className="admin-gate-tag">Restricted Access</div>
          <h2>Icon Operations HQ</h2>
          <p>
            The Operations Portal is restricted to authorized Icon Party Hire managers and equipment dispatch staff. Please sign in to verify your credentials.
          </p>

          <div className="admin-gate-actions">
            <SignInButton mode="modal">
              <button type="button" className="admin-gate-primary-btn">
                <ShieldCheck size={18} />
                <span>Sign In as Administrator</span>
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

  // 3. User is signed in — verify admin authorization
  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase() || '';
  const isRoleAdmin = user?.publicMetadata?.role === 'admin';
  const isEmailAdmin = ADMIN_EMAILS.length === 0 || ADMIN_EMAILS.includes(userEmail);

  // If admin emails are specified and user doesn't qualify
  if (ADMIN_EMAILS.length > 0 && !isRoleAdmin && !isEmailAdmin) {
    return (
      <div className="admin-gate-screen">
        <div className="admin-gate-card error">
          <div className="admin-gate-icon-wrap warning">
            <AlertCircle size={32} />
          </div>
          <div className="admin-gate-tag error">Access Denied</div>
          <h2>Admin Privileges Required</h2>
          <p>
            You are signed in as <strong>{userEmail}</strong>, but this account does not have operational admin permissions.
          </p>

          <div className="admin-gate-actions">
            <button
              type="button"
              className="admin-gate-primary-btn outline"
              onClick={() => signOut(() => window.location.reload())}
            >
              <LogOut size={16} />
              <span>Sign Out & Switch Account</span>
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

  // 4. Authorized admin — render full panel
  return children;
}
