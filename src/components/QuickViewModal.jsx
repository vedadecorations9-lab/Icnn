import React from 'react';

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  formatPrice
}) {
  if (!product) return null;

  const priceVal = product.priceAUD || product.priceINR;

  return (
    <>
      <div className="modal-backdrop active" onClick={onClose} />
      <div className="center-modal active" role="dialog" aria-modal="true">
        <button className="modal-close-corner-btn" onClick={onClose} aria-label="Close modal">✕</button>
        <div className="quickview-layout">
          <div className="quickview-gallery">
            <img
              src={product.image}
              alt={product.name}
              className="quickview-main-img"
              onError={(e) => {
                e.currentTarget.src = '/assets/images/icon_logo.png';
              }}
            />
          </div>
          <div className="quickview-info">
            <span className="quickview-category">{product.categoryLabel} • {product.origin || 'Brisbane Logistics Hub'}</span>
            <h2 className="quickview-title">{product.name}</h2>
            <div className="quickview-price-row">
              <span className="quickview-current-price">{formatPrice(priceVal)}</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-rose-gold)', fontWeight: 600 }}>/ 1–4 Days</span>
              {product.originalAUD && (
                <span className="quickview-original-price">${product.originalAUD} AUD</span>
              )}
              <span className="tag-badge" style={{ fontSize: '0.75rem' }}>{product.badge || 'Available'}</span>
            </div>
            <p className="quickview-desc">{product.description}</p>
            
            <div className="spec-list">
              <div><span className="spec-item-label">Hire period:</span> <div className="spec-item-val">{product.hirePeriod || '1–4 Days Hire'}</div></div>
              <div><span className="spec-item-label">Refundable bond:</span> <div className="spec-item-val">${product.bondAUD || 50} AUD</div></div>
              <div><span className="spec-item-label">Construction:</span> <div className="spec-item-val">{product.material}</div></div>
              <div><span className="spec-item-label">Warehouse SKU:</span> <div className="spec-item-val">{product.sku}</div></div>
              <div style={{ gridColumn: '1 / -1' }}>
                <span className="spec-item-label">Dimensions / coverage:</span> <div className="spec-item-val">{product.dimensions}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', marginTop: 'auto' }}>
              <button
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => {
                  onAddToCart(product.id);
                  onClose();
                }}
              >
                Add to hire bag · {formatPrice(priceVal)}
              </button>
              <button
                className="btn-secondary"
                onClick={() => onToggleWishlist(product.id)}
                title={isWishlisted ? 'Saved to wishlist' : 'Save to wishlist'}
                aria-label={isWishlisted ? 'Saved to wishlist' : 'Save to wishlist'}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span>{isWishlisted ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
