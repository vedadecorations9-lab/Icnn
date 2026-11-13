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
  cart,
  products,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
  formatPrice
}) {
  if (!isOpen) return null;

  // Calculate pricing in AUD
  let rawSubtotalAUD = 0;
  let totalBondAUD = 0;

  const cartItemsWithDetails = cart.map(item => {
    const prod = products.find(p => p.id === item.productId);
    if (!prod) return null;
    const price = prod.priceAUD || prod.priceINR || 0;
    const itemTotal = price * item.qty;
    rawSubtotalAUD += itemTotal;
    totalBondAUD += (prod.bondAUD || 30) * item.qty;
    return { ...prod, qty: item.qty, calculatedPrice: price };
  }).filter(Boolean);

  const deliveryAUD = cart.length > 0 ? 35 : 0;
  const grandTotalAUD = Math.max(0, rawSubtotalAUD + deliveryAUD);

  return (
    <>
      {/* High-priority Backdrop */}
      <div className="modal-backdrop active cart-drawer-backdrop" onClick={onClose} />

      {/* Slide Drawer from Right (sits safely above the floating navbar at z-index 2600) */}
      <aside className="slide-drawer active cart-drawer-shell" aria-label="Event Hire Bag">
        
        {/* Minimal Luxury Drawer Header */}
        <div className="cart-minimal-header">
          <div className="cart-minimal-title-group">
            <h3 className="cart-minimal-title">Hire Bag</h3>
            <span className="cart-minimal-count-pill">{cartItemsWithDetails.length}</span>
          </div>
          <button
            type="button"
            className="cart-minimal-close-btn"
            onClick={onClose}
            aria-label="Close Hire Bag"
          >
            <X size={18} />
          </button>
        </div>

        {/* Minimal Delivery Banner (Compact 1-line whisper) */}
        {cartItemsWithDetails.length > 0 && (
          <div className="cart-minimal-delivery-bar">
            {isFreeDelivery ? (
              <span className="cart-delivery-unlocked-text">
                ✨ Free Greater Brisbane delivery unlocked
              </span>
            ) : (
              <span className="cart-delivery-tier-text">
                Add <strong>{formatPrice(thresholdAUD - rawSubtotalAUD)}</strong> for free Brisbane delivery ($250+)
              </span>
            )}
          </div>
        )}

        {/* Scrollable Cart Items List */}
        <div className="cart-items-scrollable-body">
          {cartItemsWithDetails.length > 0 ? (
            <div className="cart-items-minimal-deck">
              {cartItemsWithDetails.map(item => (
                <div key={item.id} className="cart-item-minimal-card">
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
                        onClick={() => onRemoveItem(item.id)}
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
                          onClick={() => onUpdateQty(item.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="cart-stepper-qty">{item.qty}</span>
                        <button
                          type="button"
                          className="cart-stepper-btn plus"
                          onClick={() => onUpdateQty(item.id, 1)}
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
              <h4>Your Hire Bag is Empty</h4>
              <p>Explore commercial marquees, flower walls, cocktail bar tables, plinths, and party effects.</p>
              <button
                type="button"
                className="cart-empty-explore-btn"
                onClick={onClose}
              >
                <span>Browse Hire Equipment</span>
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
                <span>Brisbane Delivery & Setup</span>
                <span className={`cart-summary-num ${isFreeDelivery ? 'free' : ''}`}>
                  {isFreeDelivery ? 'FREE' : formatPrice(deliveryAUD)}
                </span>
                <span className="cart-summary-num">{formatPrice(deliveryAUD)}</span>
              </div>
              <div className="cart-summary-line subtle">
                <span>Refundable Bond (Held on Card)</span>
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
              <span>Proceed to Booking</span>
              <ArrowRight size={16} />
            </button>

            <div className="cart-minimal-trust-note">
              <ShieldCheck size={13} />
              <span>100% Bond Security · Stripe Verified Booking</span>
              <span>100% Bond Security · Verified Hire Booking</span>
            </div>
          </div>
        )}

      </aside>
    </>
  );
}
