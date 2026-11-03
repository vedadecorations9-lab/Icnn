import React, { useState } from 'react';
import { COUPONS } from '../data/products';

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
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  if (!isOpen) return null;

  // Calculate pricing in AUD / base
  let rawSubtotalAUD = 0;
  let totalBondAUD = 0;

  const cartItemsWithDetails = cart.map(item => {
    const prod = products.find(p => p.id === item.productId);
    if (!prod) return null;
    const price = prod.priceAUD || prod.priceINR;
    const itemTotal = price * item.qty;
    rawSubtotalAUD += itemTotal;
    totalBondAUD += (prod.bondAUD || 30) * item.qty;
    return { ...prod, qty: item.qty, calculatedPrice: price };
  }).filter(Boolean);

  let discountAUD = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAUD = Math.round(rawSubtotalAUD * (appliedCoupon.discountPercent / 100));
    } else if (appliedCoupon.flatDiscountAUD) {
      discountAUD = appliedCoupon.flatDiscountAUD;
    }
  }

  const thresholdAUD = 250;
  const isFreeDelivery = rawSubtotalAUD >= thresholdAUD;
  const deliveryAUD = isFreeDelivery ? 0 : (cart.length > 0 ? 35 : 0);
  const grandTotalAUD = Math.max(0, rawSubtotalAUD - discountAUD + deliveryAUD);
  const deliveryPercent = Math.min(100, (rawSubtotalAUD / thresholdAUD) * 100);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon(COUPONS[code]);
      onToast(`Coupon "${code}" applied: ${COUPONS[code].label}!`, 'success');
      setCouponCode('');
    } else {
      onToast('Invalid voucher code. Try "ICON10" or "WEEKEND20"', 'gold');
    }
  };

  return (
    <>
      <div className="modal-backdrop active" onClick={onClose} />
      <aside className="slide-drawer active" aria-label="Event Hire Bag">
        <div className="drawer-header">
          <h3 className="drawer-title">
            <span>Your Event Hire Bag</span>
          </h3>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close Bag">✕</button>
        </div>

        {/* Free Delivery Progress */}
        <div className="shipping-progress-box">
          <div className="shipping-progress-text">
            {isFreeDelivery ? (
              <span><strong>Complimentary Greater Brisbane delivery unlocked</strong></span>
            ) : (
              <span>Add <strong>{formatPrice(thresholdAUD - rawSubtotalAUD)}</strong> more for free Brisbane delivery</span>
            )}
          </div>
          <div className="shipping-bar-bg">
            <div className="shipping-bar-fill" style={{ width: `${deliveryPercent}%` }} />
          </div>
        </div>

        {/* Items List */}
        <div className="drawer-body">
          {cartItemsWithDetails.length > 0 ? (
            cartItemsWithDetails.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-thumb" />
                <div className="cart-item-details">
                  <h4 className="cart-item-title">{item.name}</h4>
                  <div className="cart-item-price">{formatPrice(item.calculatedPrice)} <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>/ hire</span></div>
                  <div className="cart-item-meta" style={{ fontSize: '0.72rem', color: 'var(--color-rose-gold)', margin: '2px 0 6px' }}>
                    Bond: ${item.bondAUD || 30} AUD (refundable)
                  </div>
                  <div className="cart-qty-row">
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => onUpdateQty(item.id, -1)}>-</button>
                      <span className="qty-val">{item.qty}</span>
                      <button className="qty-btn" onClick={() => onUpdateQty(item.id, 1)}>+</button>
                    </div>
                    <button className="cart-item-remove-btn" onClick={() => onRemoveItem(item.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="drawer-empty-state">
              <div className="empty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-primary)' }}>Your hire bag is empty</h4>
              <p style={{ fontSize: '0.875rem' }}>Select gazebos, flower walls, cocktail tables, plinths or cold sparks to start your booking.</p>
              <button className="btn-primary" style={{ marginTop: '12px' }} onClick={onClose}>Explore hire catalog</button>
            </div>
          )}
        </div>

        {/* Footer with Breakdown */}
        {cartItemsWithDetails.length > 0 && (
          <div className="drawer-footer">
            <div className="coupon-row">
              <input
                type="text"
                className="coupon-input"
                placeholder="Voucher code (ICON10, WEEKEND20)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button className="coupon-btn" onClick={handleApplyCoupon}>Apply</button>
            </div>

            <div className="price-breakdown-row">
              <span>Equipment Hire Subtotal</span>
              <span>{formatPrice(rawSubtotalAUD)}</span>
            </div>
            {appliedCoupon && (
              <div className="price-breakdown-row">
                <span>VIP Discount ({appliedCoupon.label})</span>
                <span style={{ color: '#2E7D32' }}>-{formatPrice(discountAUD)}</span>
              </div>
            )}
            <div className="price-breakdown-row">
              <span>Brisbane Van Delivery & Setup</span>
              <span>{isFreeDelivery ? 'FREE' : formatPrice(deliveryAUD)}</span>
            </div>
            <div className="price-breakdown-row" style={{ fontSize: '0.8125rem', color: 'var(--color-rose-gold-dark)' }}>
              <span>Refundable Security Bond (Held on Card)</span>
              <span>${totalBondAUD} AUD</span>
            </div>
            <div className="price-breakdown-row total-row">
              <span>Total Hire Estimate</span>
              <span>{formatPrice(grandTotalAUD)}</span>
            </div>

            <button className="checkout-action-btn" onClick={onCheckout}>
              Proceed to Hire Reservation →
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
