import React from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cart = [],
  products = [],
  onUpdateQty,
  onRemoveItem,
  onCheckout,
  onExploreCatalog,
  formatPrice = (v) => `$${v}`,
  isSignedIn = true
}) {
  if (!isOpen) return null;

  // Calculate pricing in AUD
  let rawSubtotalAUD = 0;
  let totalBondAUD = 0;

  const cartItemsWithDetails = (Array.isArray(cart) ? cart : [])
    .map((item) => {
      const prod = (Array.isArray(products) ? products : []).find(
        (p) => p.id === item.productId || p._id === item.productId
      );
      if (!prod) return null;
      const price = Number(prod.priceAUD || prod.priceINR || 0);
      const qty = Number(item.qty || item.quantity || 1);
      const itemTotal = price * qty;
      rawSubtotalAUD += itemTotal;
      totalBondAUD += Number(prod.bondAUD || 30) * qty;
      return { ...prod, cartItemId: item.productId, qty, calculatedPrice: price };
    })
    .filter(Boolean);

  const thresholdAUD = 250;
  const isFreeDelivery = rawSubtotalAUD >= thresholdAUD;
  const deliveryAUD = cartItemsWithDetails.length > 0 ? (isFreeDelivery ? 0 : 35) : 0;
  const grandTotalAUD = Math.max(0, rawSubtotalAUD + deliveryAUD);

  return (
    <>
      {/* High-priority Backdrop */}
      <div className="modal-backdrop active cart-drawer-backdrop" onClick={onClose} />

      {/* Slide Drawer from Right (sits safely above the floating navbar at z-index 2600) */}
      <aside className="slide-drawer active cart-drawer-shell" aria-label="Shopping Cart">
        
        {/* Minimal Luxury Drawer Header */}
        <div className="cart-minimal-header">
          <div className="cart-minimal-title-group">
            <h3 className="cart-minimal-title">Cart</h3>
            <span className="cart-minimal-count-pill">{cartItemsWithDetails.length}</span>
          </div>
          <button
            type="button"
            className="cart-minimal-close-btn"
            onClick={onClose}
            aria-label="Close Cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Minimal Delivery Banner */}
        {cartItemsWithDetails.length > 0 && (
          <div className="cart-minimal-delivery-bar">
            {isFreeDelivery ? (
              <span className="cart-delivery-unlocked-text">
                Free Greater Brisbane delivery unlocked
              </span>
            ) : (
              <span className="cart-delivery-tier-text">
                Add <strong>{formatPrice(Math.max(0, thresholdAUD - rawSubtotalAUD))}</strong> for free Brisbane delivery ($250+)
              </span>
            )}
          </div>
        )}

        {/* Scrollable Cart Items List */}
        <div className="cart-items-scrollable-body">
          {cartItemsWithDetails.length > 0 ? (
            <div className="cart-items-minimal-deck">
              {cartItemsWithDetails.map((item) => (
                <div key={item.cartItemId || item.id} className="cart-item-minimal-card">
                  {/* Media Thumbnail */}
                  <div className="cart-item-minimal-thumb">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.src = '/assets/images/items/Icon 6x3 m Gazebo Hire-2-1024x1024.webp';
                      }}
                    />
                  </div>

                  {/* Info Column */}
                  <div className="cart-item-minimal-info">
                    <div className="cart-item-minimal-top-row">
                      <h4 className="cart-item-minimal-name">{item.name}</h4>
                      <button
                        type="button"
                        className="cart-item-minimal-del"
                        onClick={() => onRemoveItem?.(item.cartItemId || item.id)}
                        aria-label={`Remove ${item.name}`}
                        title="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="cart-item-minimal-meta">
                      <span className="cart-item-minimal-rate">{formatPrice(item.calculatedPrice)} / 1–4 days</span>
                    </div>

                    <div className="cart-item-minimal-bottom-row">
                      {/* Compact Micro-Stepper */}
                      <div className="cart-minimal-stepper">
                        <button
                          type="button"
                          className="cart-stepper-btn minus"
                          onClick={() => onUpdateQty?.(item.cartItemId || item.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="cart-stepper-qty">{item.qty}</span>
                        <button
                          type="button"
                          className="cart-stepper-btn plus"
                          onClick={() => onUpdateQty?.(item.cartItemId || item.id, 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <span className="cart-minimal-line-total">
                        {formatPrice(item.calculatedPrice * item.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="cart-empty-lux-box">
              <div className="cart-empty-icon-wrap">
                <ShoppingBag size={32} />
              </div>
              <h4>Your Cart is Empty</h4>
              <p>Explore commercial gazebos, flower walls, cocktail bar tables, plinths, and party effects.</p>
              <button
                type="button"
                className="cart-empty-explore-btn"
                onClick={() => {
                  onClose?.();
                  onExploreCatalog?.();
                }}
              >
                <span>Browse Equipment</span>
                <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Minimal Luxury Footer */}
        {cartItemsWithDetails.length > 0 && (
          <div className="cart-minimal-footer">
            <div className="cart-minimal-summary">
              <div className="cart-summary-line">
                <span>Equipment Subtotal</span>
                <span className="cart-summary-num">{formatPrice(rawSubtotalAUD)}</span>
              </div>
              <div className="cart-summary-line">
                <span>Brisbane Delivery &amp; Setup</span>
                <span className={`cart-summary-num ${isFreeDelivery ? 'free' : ''}`}>
                  {isFreeDelivery ? 'FREE' : formatPrice(deliveryAUD)}
                </span>
              </div>
              <div className="cart-summary-line subtle">
                <span>Refundable Security Bond</span>
                <span className="cart-summary-num">${totalBondAUD} AUD</span>
              </div>

              <div className="cart-minimal-hairline" />

              <div className="cart-summary-total-line">
                <div className="cart-total-title-block">
                  <span className="cart-total-title">Total Estimate</span>
                  <span className="cart-total-note">Bond released post-event</span>
                </div>
                <span className="cart-total-figure">{formatPrice(grandTotalAUD)}</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              className="cart-minimal-checkout-btn"
              onClick={onCheckout}
            >
              <span>{isSignedIn ? 'Proceed to Booking' : 'Sign In to Book Hire'}</span>
              <ArrowRight size={16} />
            </button>

            <div className="cart-minimal-trust-note">
              <ShieldCheck size={13} />
              <span>100% Bond Security · Verified Brisbane Hire Booking</span>
            </div>
          </div>
        )}

      </aside>
    </>
  );
}
