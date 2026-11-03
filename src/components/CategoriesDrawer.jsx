import React from 'react';
import { CATEGORIES } from '../data/products';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CategoriesDrawer({ isOpen, onClose, onSelectCategory }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop active" onClick={onClose} />
      <aside
        className="slide-drawer active"
        style={{ right: 'auto', left: 0, transform: 'translateX(0)' }}
        aria-label="Category Navigation"
      >
        <div className="drawer-header">
          <h3 className="drawer-title">Hire Categories (10)</h3>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close menu">✕</button>
        </div>
        <div className="drawer-body">
          {CATEGORIES.map(cat => (
            <div
              key={cat.id}
              className="mobile-nav-item"
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid rgba(27,6,26,0.06)' }}
              onClick={() => {
                onSelectCategory(cat.id);
                onClose();
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={cat.image}
                  alt={cat.label}
                  style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1B061A' }}>{cat.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#D81B60', fontWeight: 600 }}>From ${cat.startingPrice} AUD</div>
                </div>
              </div>
              <ArrowRight size={15} color="#D81B60" />
            </div>
          ))}

          <div
            className="mobile-nav-item"
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', marginTop: '12px', background: 'rgba(216, 27, 96, 0.08)', borderRadius: '12px' }}
            onClick={() => {
              onSelectCategory('all');
              onClose();
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={18} color="#D81B60" />
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#D81B60' }}>View all equipment</span>
            </div>
            <ArrowRight size={16} color="#D81B60" />
          </div>
        </div>
      </aside>
    </>
  );
}
