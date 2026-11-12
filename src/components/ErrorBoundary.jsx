import React from 'react';
import { RotateCcw, Home, AlertTriangle, ShieldCheck } from 'lucide-react';

/**
 * Global Error Boundary
 * Catches any uncaught runtime rendering errors in the React component tree.
 * Prevents the application from crashing to a blank white screen, providing
 * visitors with a branded, luxury self-recovery action.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Icon Party Hire - Uncaught Application Error]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.removeItem('icon_cart');
      localStorage.removeItem('icon_wishlist');
      localStorage.removeItem('icon_catalog_category');
    } catch {
      // ignore
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          minHeight: '100svh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FDF7FA 0%, #F5EBF2 50%, #FDF7FA 100%)',
          padding: '24px',
          fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
          color: '#1B061A'
        }}>
          <div style={{
            maxWidth: '540px',
            width: '100%',
            background: '#FFFFFF',
            borderRadius: '28px',
            padding: '36px 32px',
            boxShadow: '0 24px 60px rgba(216, 27, 96, 0.12), 0 4px 16px rgba(27, 6, 26, 0.04)',
            border: '1px solid rgba(216, 27, 96, 0.15)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Top decorative gradient bar */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '5px',
              background: 'linear-gradient(90deg, #D81B60, #D48B70, #F59E0B, #E03E8A)'
            }} />

            {/* Icon */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(216, 27, 96, 0.12), rgba(212, 139, 112, 0.16))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#D81B60',
              border: '1px solid rgba(216, 27, 96, 0.2)'
            }}>
              <AlertTriangle size={30} />
            </div>

            {/* Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: '999px',
              background: 'rgba(216, 27, 96, 0.08)',
              color: '#D81B60',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '16px'
            }}>
              <ShieldCheck size={14} />
              <span>Storefront Self-Recovery</span>
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '24px',
              fontWeight: 700,
              color: '#1B061A',
              margin: '0 0 12px',
              letterSpacing: '-0.01em'
            }}>
              Restoring Your Hire Session
            </h1>

            <p style={{
              fontSize: '14.5px',
              lineHeight: 1.6,
              color: '#6E5D6A',
              margin: '0 0 28px'
            }}>
              We encountered a temporary connection glitch while syncing live Brisbane inventory. Your selections remain safe. Click below to refresh your session.
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '16px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #D81B60 0%, #C2185B 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '14.5px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 24px rgba(216, 27, 96, 0.28)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <RotateCcw size={16} />
                <span>Reload Storefront</span>
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '12px 20px',
                  borderRadius: '16px',
                  border: '1px solid rgba(27, 6, 26, 0.12)',
                  background: 'transparent',
                  color: '#1B061A',
                  fontWeight: 600,
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                <Home size={15} />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
