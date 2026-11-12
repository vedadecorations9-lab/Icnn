import React from 'react';
import {
  ShoppingBag,
  X,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  ArrowRight,
  Sparkles,
  MapPin
} from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  products,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
  formatPrice,
  onToast
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

  const thresholdAUD = 250;
  const isFreeDelivery = rawSubtotalAUD >= thresholdAUD;
  const deliveryAUD = isFreeDelivery ? 0 : (cart.length > 0 ? 35 : 0);
  const grandTotalAUD = Math.max(0, rawSubtotalAUD + deliveryAUD);
  const deliveryPercent = Math.min(100, Math.round((rawSubtotalAUD / thresholdAUD) * 100));

  return (
    <>
      {/* High-priority Backdrop */}
      <div className="modal-backdrop active cart-drawer-backdrop" onClick={onClose} />

      {/* Slide Drawer from Right (sits safely above the floating navbar at z-index 2600) */}
      <aside className="slide-drawer active cart-drawer-shell" aria-label="Event Hire Bag">
        
        {/* Drawer Header with Title, Count & Close */}
        <div className="cart-drawer-top-header">
          <div className="cart-header-title-wrap">
            <div className="cart-header-icon-box">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 className="cart-header-title">Your Hire Bag</h3>
              <span className="cart-header-subtitle">
                {cartItemsWithDetails.length} {cartItemsWithDetails.length === 1 ? 'equipment item' : 'equipment items'} for Brisbane hire
              </span>
            </div>
          </div>
          <button
            type="button"
            className="cart-close-pill-btn"
            onClick={onClose}
            aria-label="Close Hire Bag"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Greater Brisbane Delivery Progress Bar */}
        <div className="cart-shipping-meter-card">
          <div className="cart-shipping-meter-info">
            <Truck size={16} className="meter-truck-icon" />
            {isFreeDelivery ? (
              <span className="meter-text unlocked">
                <strong>Free Greater Brisbane Delivery Unlocked!</strong>
              </span>
            ) : (
              <span className="meter-text">
                Add <strong>{formatPrice(thresholdAUD - rawSubtotalAUD)}</strong> more for <strong>FREE Delivery</strong> ($250+)
              </span>
            )}
          </div>
          <div className="cart-meter-track">
            <div
              className={`cart-meter-progress ${isFreeDelivery ? 'unlocked' : ''}`}
              style={{ width: `${deliveryPercent}%` }}
            />
          </div>
        </div>

        {/* Scrollable Cart Items List */}
        <div className="cart-items-scrollable-body">
          {cartItemsWithDetails.length > 0 ? (
            <div className="cart-items-deck">
              {cartItemsWithDetails.map(item => (
                <div key={item.id} className="cart-item-card-pro">
                  <div className="cart-item-media">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-img-pro"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/images/items/Icon 6x3 m Gazebo Hire-2-1024x1024.webp';
                      }}
                    />
                  </div>

                  <div className="cart-item-content-pro">
                    <div className="cart-item-header-pro">
                      <h4 className="cart-item-name-pro">{item.name}</h4>
                      <button
                        type="button"
                        className="cart-item-trash-btn"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label={`Remove ${item.name} from bag`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="cart-item-price-pro">
                      <span className="price-bold">{formatPrice(item.calculatedPrice)}</span>
                      <span className="price-hire-tag">/ hire day</span>
                    </div>

                    <div className="cart-item-bond-badge">
                      <ShieldCheck size={13} />
                      <span>${item.bondAUD || 30} AUD refundable bond held</span>
                    </div>

                    {/* Stepper Quantity Control */}
                    <div className="cart-item-footer-pro">
                      <div className="cart-stepper-control">
                        <button
                          type="button"
                          className="stepper-btn minus"
                          onClick={() => onUpdateQty(item.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="stepper-value">{item.qty}</span>
                        <button
                          type="button"
                          className="stepper-btn plus"
                          onClick={() => onUpdateQty(item.id, 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="cart-item-line-total">
                        Total: <strong>{formatPrice(item.calculatedPrice * item.qty)}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="cart-empty-lux-box">
              <div className="cart-empty-icon-wrap">
                <ShoppingBag size={38} />
              </div>
              <h4>Your Hire Bag is Empty</h4>
              <p>Explore commercial gazebos, flower walls, cocktail bar tables, plinths, and party effects.</p>
              <button
                type="button"
                className="cart-empty-explore-btn"
                onClick={onClose}
              >
                <span>Browse Hire Equipment</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Footer with Transparent Financial Breakdown (Zero coupon/promo codes) */}
        {cartItemsWithDetails.length > 0 && (
          <div className="cart-drawer-pro-footer">
            
            {/* FINANCIAL SUMMARY BREAKDOWN */}
            <div className="cart-financial-summary">
              <div className="summary-row">
                <span className="summary-label">Equipment Hire Subtotal</span>
                <span className="summary-val">{formatPrice(rawSubtotalAUD)}</span>
              </div>

              <div className="summary-row">
                <span className="summary-label">Greater Brisbane Delivery & Setup</span>
                <span className={`summary-val ${isFreeDelivery ? 'free-tag' : ''}`}>
                  {isFreeDelivery ? 'FREE ($250+ Tier)' : formatPrice(deliveryAUD)}
                </span>
              </div>

              <div className="summary-row bond-row">
                <span className="summary-label">Refundable Security Bond (Held on Card)</span>
                <span className="summary-val bond">${totalBondAUD} AUD</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-row total-row">
                <div className="total-title-block">
                  <span className="total-title">Total Hire Estimate</span>
                  <span className="total-subtext">Bond released upon pack-down inspection</span>
                </div>
                <span className="total-price">{formatPrice(grandTotalAUD)}</span>
              </div>
            </div>

            {/* CHECKOUT CTA BUTTON */}
            <button
              type="button"
              className="cart-checkout-cta-btn"
              onClick={onCheckout}
            >
              <span>Proceed to Hire Reservation</span>
              <ArrowRight size={18} />
            </button>

            <div className="cart-footer-reassurance">
              <ShieldCheck size={14} />
              <span>Instant Card Authorisation · Murrumba Downs Dispatch Bay · 100% Bond Security</span>
            </div>

          </div>
        )}

      </aside>
    </>
  );
}
