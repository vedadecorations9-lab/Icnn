import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Clock,
  Layers,
  Maximize2,
  CheckCircle2,
  Plus,
  Minus,
  MapPin
} from 'lucide-react';

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  formatPrice = (v) => `$${v}`
}) {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
  }, [product?.id]);

  if (!product) return null;

  const priceVal = Number(product.priceAUD || product.priceINR || 0);
  const bondVal = Number(product.bondAUD || 50);

  return (
    <>
      <div className="modal-backdrop active qv-backdrop" onClick={onClose} />
      <div
        className="center-modal active qv-modal-shell"
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
      >
        <button
          type="button"
          className="qv-close-btn"
          onClick={onClose}
          aria-label="Close product details"
        >
          <X size={18} />
        </button>

        <div className="qv-grid">
          {/* LEFT COLUMN: Double-Bezel Product Showcase & Trust Strip */}
          <div className="qv-media-col">
            <div className="qv-image-bezel">
              <div className="qv-image-frame">
                <img
                  src={product.image}
                  alt={product.name}
                  className="qv-main-img"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/images/items/Icon 6x3 m Gazebo Hire-2-1024x1024.webp';
                  }}
                />
                {product.badge && (
                  <span className="qv-floating-badge">{product.badge}</span>
                )}
              </div>
            </div>

            {/* Compact Dispatch & Quality Bar below image */}
            <div className="qv-trust-bar">
              <div className="qv-trust-item">
                <CheckCircle2 size={14} className="qv-trust-icon" />
                <span>In Stock · Ready to Book</span>
              </div>
              <div className="qv-trust-divider" />
              <div className="qv-trust-item">
                <MapPin size={14} className="qv-trust-icon" />
                <span>Murrumba Downs Hub</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Editorial Product Details, 2x2 Specs & Action Dock */}
          <div className="qv-details-col">
            {/* Top Kicker Row: Category Pill + SKU */}
            <div className="qv-kicker-row">
              <span className="qv-category-pill">{product.categoryLabel || 'Event Hire'}</span>
              {product.sku && (
                <span className="qv-sku-tag">SKU: {product.sku}</span>
              )}
            </div>

            {/* Mixed-Case Editorial Title */}
            <h2 className="qv-title">{product.name}</h2>

            {/* Pricing & Bond Strip */}
            <div className="qv-price-card">
              <div className="qv-price-main">
                <span className="qv-price-amount">{formatPrice(priceVal)}</span>
                <span className="qv-price-period">/ 1–3 Days Hire</span>
                {product.originalAUD && Number(product.originalAUD) > priceVal && (
                  <span className="qv-price-original">${product.originalAUD} AUD</span>
                )}
              </div>
              <div className="qv-bond-pill">
                <ShieldCheck size={13} />
                <span>+${bondVal} AUD Refundable Bond</span>
              </div>
            </div>

            {/* Product Description */}
            <p className="qv-description">{product.description}</p>

            {/* 2x2 Architectural Specifications Grid */}
            <div className="qv-specs-grid">
              <div className="qv-spec-box">
                <div className="qv-spec-header">
                  <Clock size={13} className="qv-spec-icon" />
                  <span className="qv-spec-label">Hire Duration</span>
                </div>
                <div className="qv-spec-value">{product.hirePeriod || '1–3 Days Flexible Hire'}</div>
              </div>

              <div className="qv-spec-box">
                <div className="qv-spec-header">
                  <ShieldCheck size={13} className="qv-spec-icon" />
                  <span className="qv-spec-label">Security Bond</span>
                </div>
                <div className="qv-spec-value">${bondVal} AUD (Refundable)</div>
              </div>

              <div className="qv-spec-box">
                <div className="qv-spec-header">
                  <Maximize2 size={13} className="qv-spec-icon" />
                  <span className="qv-spec-label">Dimensions / Size</span>
                </div>
                <div className="qv-spec-value">{product.dimensions || 'Standard Event Specification'}</div>
              </div>

              <div className="qv-spec-box">
                <div className="qv-spec-header">
                  <Layers size={13} className="qv-spec-icon" />
                  <span className="qv-spec-label">Construction</span>
                </div>
                <div className="qv-spec-value">{product.material || 'Commercial Event Grade'}</div>
              </div>
            </div>

            {/* Bottom Action Dock: Quantity Stepper + Add to Cart + Save */}
            <div className="qv-action-dock">
              <div className="qv-qty-stepper" aria-label="Quantity selector">
                <button
                  type="button"
                  className="qv-qty-btn"
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="qv-qty-val">{qty}</span>
                <button
                  type="button"
                  className="qv-qty-btn"
                  onClick={() => setQty((prev) => prev + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                type="button"
                className="qv-add-cart-btn"
                onClick={() => {
                  onAddToCart?.(product.id, qty);
                  onClose?.();
                }}
              >
                <ShoppingBag size={17} />
                <span>Add to Cart · {formatPrice(priceVal * qty)}</span>
              </button>

              <button
                type="button"
                className={`qv-wishlist-btn ${isWishlisted ? 'is-saved' : ''}`}
                onClick={() => onToggleWishlist?.(product.id)}
                title={isWishlisted ? 'Saved to wishlist' : 'Save to wishlist'}
                aria-label={isWishlisted ? 'Saved to wishlist' : 'Save to wishlist'}
              >
                <Heart
                  size={18}
                  fill={isWishlisted ? '#D81B60' : 'none'}
                  color={isWishlisted ? '#D81B60' : '#1B061A'}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
