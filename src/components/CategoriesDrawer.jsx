import React from 'react';

const CATEGORIES = [
  { key: 'marquees', label: 'Marquees & Gazebos' },
  { key: 'backdrops', label: 'Backdrops & Flower Walls' },
  { key: 'tables', label: 'Tables & Cocktail Furniture' },
  { key: 'chairs', label: 'Tiffany Chairs & Linens' },
  { key: 'plinths', label: 'Plinths & Cake Stands' },
  { key: 'catering', label: 'Catering & Beverage Warmers' },
  { key: 'effects', label: 'Special Effects (Sparks & Low Fog)' },
  { key: 'all', label: 'View all 18 hire items' }
];

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
          <h3 className="drawer-title">Hire Categories</h3>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close menu">✕</button>
        </div>
        <div className="drawer-body">
          {CATEGORIES.map(cat => (
            <div
              key={cat.key}
              className="mobile-nav-item"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                onSelectCategory(cat.key);
                onClose();
              }}
            >
              <span>{cat.label}</span>
              <span aria-hidden="true">→</span>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
