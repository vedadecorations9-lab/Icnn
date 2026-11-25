import React from 'react';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlist = [],
  products = [],
  onAddToCart,
  onToggleWishlist,
  formatPrice = (v) => `$${v}`
}) {
  if (!isOpen) return null;

  const wishlistProducts = wishlist
    .map(id => products.find(p => p.id === id || p._id === id))
    .filter(Boolean);

  return (
    <>
      <div className="modal-backdrop active" onClick={onClose} />
      <aside className="slide-drawer active" aria-label="Saved Equipment Wishlist">
        <div className="drawer-header">
          <h3 className="drawer-title">
            <span>Saved Equipment ({wishlistProducts.length})</span>
          </h3>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close Wishlist">✕</button>
        </div>
        
        <div className="drawer-body">
          {wishlistProducts.length > 0 ? (
            wishlistProducts.map(prod => {
              const prodId = prod.id || prod._id;
              return (
                <div key={prodId} className="cart-item">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="cart-item-thumb"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/images/icon_logo.png';
                    }}
                  />
                  <div className="cart-item-details">
                    <h4 className="cart-item-title">{prod.name}</h4>
                    <div className="cart-item-price">
                      {formatPrice(prod.priceAUD || prod.priceINR)}{' '}
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>/ 1–3 days</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ padding: '6px 14px', fontSize: '0.75rem' }}
                        onClick={() => {
                          onAddToCart?.(prodId);
                          onToggleWishlist?.(prodId);
                        }}
                      >
                        Move to Cart
                      </button>
                      <button
                        type="button"
                        className="cart-item-remove-btn"
                        onClick={() => onToggleWishlist?.(prodId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="drawer-empty-state">
              <div className="empty-icon">🤍</div>
              <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", textTransform: 'none', fontSize: '1.25rem', color: 'var(--color-primary)' }}>
                No Saved Equipment Yet
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                Click the heart icon on any party hire item to bookmark it for your upcoming celebration.
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
